import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('../scripts/verify-npm-oidc.mjs', import.meta.url).href;
const requestToken = 'fixture-github-request-token';
const idToken = 'fixture-github-id-token';
const npmToken = 'fixture-npm-exchange-token';

function verify(scenario = {}) {
  const source = `
    import assert from 'node:assert/strict';
    const scenario = ${JSON.stringify(scenario)};
    let requests = 0;
    globalThis.fetch = async (url, options) => {
      requests++;
      assert.equal(options.redirect, 'error');
      if (requests === 1) {
        assert.equal(String(url), 'https://issuer.example.test/token?job=123&audience=npm%3Aregistry.npmjs.org');
        assert.equal(options.headers.Authorization, 'Bearer ${requestToken}');
        if (scenario.networkError) throw new Error('${idToken}');
        return new Response(JSON.stringify(scenario.missingIdToken ? {} : { value: '${idToken}' }), {
          status: scenario.issuerStatus ?? 200,
        });
      }
      assert.equal(requests, 2);
      assert.equal(String(url), 'https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/%40viyzhu%2Fboss-cli-fork');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, 'Bearer ${idToken}');
      if (scenario.malformedResponse) return new Response('${npmToken}', { status: 201 });
      return new Response(JSON.stringify(scenario.missingNpmToken ? {} : {
        token: '${npmToken}',
        expires: scenario.missingExpiry ? undefined : scenario.invalidExpiry ? '${npmToken}'
          : scenario.expired ? '2000-01-01T00:00:00.000Z' : '2999-01-01T00:00:00.000Z',
      }), { status: scenario.exchangeStatus ?? 201 });
    };
    await import(${JSON.stringify(script)});
    assert.equal(requests, 2);
  `;
  const env = {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    GITHUB_ACTIONS: 'true',
    ACTIONS_ID_TOKEN_REQUEST_URL: 'https://issuer.example.test/token?job=123',
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: requestToken,
  };
  if (scenario.missingPermission) delete env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
    env,
    encoding: 'utf8',
    timeout: 10000,
  });
  assert.ifError(result.error);
  for (const secret of [requestToken, idToken, npmToken]) {
    assert.ok(!result.stdout.includes(secret), 'stdout must not contain credentials');
    assert.ok(!result.stderr.includes(secret), 'stderr must not contain credentials');
  }
  return result;
}

test('npm 接受 GitHub 身份后仅报告交换成功，不发布或输出凭证', () => {
  const result = verify();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /OIDC identity verified for @viyzhu\/boss-cli-fork/);
  assert.match(result.stdout, /does not verify publish or dist-tag write permissions/);
});

test('缺少 id-token 权限时在请求前失败', () => {
  const result = verify({ missingPermission: true });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /id-token: write/);
});

for (const status of [401, 403, 404, 500]) {
  test(`npm OIDC 交换 HTTP ${status} 必须失败，不回退认证`, () => {
    const result = verify({ exchangeStatus: status });
    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(`npm OIDC exchange: HTTP ${status}`));
  });
}

test('GitHub 拒绝身份请求时失败', () => {
  const result = verify({ issuerStatus: 403 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GitHub OIDC request: HTTP 403/);
});

test('网络错误不得把异常中的凭证写到日志', () => {
  const result = verify({ networkError: true });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GitHub OIDC request: request failed/);
});

for (const [scenario, message] of [
  [{ missingIdToken: true }, /GitHub OIDC response is missing an ID token/],
  [{ malformedResponse: true }, /npm OIDC exchange: invalid JSON response/],
  [{ missingNpmToken: true }, /npm OIDC response is missing a short-lived token/],
  [{ expired: true }, /npm OIDC response has an invalid or expired expiry/],
  [{ missingExpiry: true }, /npm OIDC response has an invalid or expired expiry/],
  [{ invalidExpiry: true }, /npm OIDC response has an invalid or expired expiry/],
]) {
  test(`无效响应必须失败：${Object.keys(scenario)[0]}`, () => {
    const result = verify(scenario);
    assert.equal(result.status, 1);
    assert.match(result.stderr, message);
  });
}
