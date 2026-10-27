import { readFile } from 'node:fs/promises';

const { name: packageName } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

async function requestJson(label, url, options) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    // 网络异常和响应正文可能包含凭证，只记录阶段和 HTTP 状态。
    throw new Error(`${label}: request failed (network, timeout or redirect)`);
  }
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label}: invalid JSON response`);
  }
}

try {
  const { GITHUB_ACTIONS, ACTIONS_ID_TOKEN_REQUEST_URL, ACTIONS_ID_TOKEN_REQUEST_TOKEN } = process.env;
  if (GITHUB_ACTIONS !== 'true' || !ACTIONS_ID_TOKEN_REQUEST_URL || !ACTIONS_ID_TOKEN_REQUEST_TOKEN) {
    throw new Error('GitHub Actions OIDC is unavailable; require permissions: id-token: write.');
  }

  let requestUrl;
  try {
    requestUrl = new URL(ACTIONS_ID_TOKEN_REQUEST_URL);
  } catch {
    throw new Error('GitHub OIDC request URL is invalid.');
  }
  if (requestUrl.protocol !== 'https:') throw new Error('GitHub OIDC request URL must use HTTPS.');
  requestUrl.searchParams.set('audience', 'npm:registry.npmjs.org');
  const identity = await requestJson('GitHub OIDC request', requestUrl, {
    headers: { Authorization: `Bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
  });
  if (typeof identity?.value !== 'string' || !identity.value) {
    throw new Error('GitHub OIDC response is missing an ID token.');
  }

  const exchange = await requestJson('npm OIDC exchange',
    `https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/${encodeURIComponent(packageName)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${identity.value}` },
    });
  if (typeof exchange?.token !== 'string' || !exchange.token) {
    throw new Error('npm OIDC response is missing a short-lived token.');
  }
  if (!Number.isFinite(Date.parse(exchange.expires)) || Date.parse(exchange.expires) <= Date.now()) {
    throw new Error('npm OIDC response has an invalid or expired expiry.');
  }

  console.log(`OIDC identity verified for ${packageName}.`);
  console.log('Identity exchange does not verify publish or dist-tag write permissions; no package or tag was changed.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
