import assert from 'node:assert/strict';
import test from 'node:test';

import { probeRemoteHeadless, resolveHeadlessFromEnv } from '../dist/browser/cdp_browser.js';

const HEADLESS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36';
const HEADFUL_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

/** 跑一段代码，跑完把两个环境变量还原成原样。 */
function withEnv(vars, fn) {
  const names = ['BOSS_BROWSER_HEADLESS', 'RECRUIT_BROWSER_HIDDEN'];
  const saved = Object.fromEntries(names.map((n) => [n, process.env[n]]));
  try {
    for (const n of names) delete process.env[n];
    for (const [k, v] of Object.entries(vars)) process.env[k] = v;
    return fn();
  } finally {
    for (const n of names) {
      if (saved[n] === undefined) delete process.env[n];
      else process.env[n] = saved[n];
    }
  }
}

test('默认无头：招聘浏览器不该抢前景与键盘焦点', () => {
  withEnv({}, () => assert.equal(resolveHeadlessFromEnv(), true));
});

test('RECRUIT_BROWSER_HIDDEN=false 退回有头', () => {
  withEnv({ RECRUIT_BROWSER_HIDDEN: 'false' }, () => assert.equal(resolveHeadlessFromEnv(), false));
  withEnv({ RECRUIT_BROWSER_HIDDEN: 'FALSE' }, () => assert.equal(resolveHeadlessFromEnv(), false));
});

test('BOSS_BROWSER_HEADLESS 优先级高于共读变量，两个方向都生效', () => {
  withEnv({ BOSS_BROWSER_HEADLESS: 'false', RECRUIT_BROWSER_HIDDEN: 'true' }, () =>
    assert.equal(resolveHeadlessFromEnv(), false),
  );
  withEnv({ BOSS_BROWSER_HEADLESS: 'true', RECRUIT_BROWSER_HIDDEN: 'false' }, () =>
    assert.equal(resolveHeadlessFromEnv(), true),
  );
});

test('无法识别的值不当作覆盖，回落到共读变量', () => {
  withEnv({ BOSS_BROWSER_HEADLESS: 'maybe', RECRUIT_BROWSER_HIDDEN: 'false' }, () =>
    assert.equal(resolveHeadlessFromEnv(), false),
  );
});

test('probeRemoteHeadless 按 /json/version 的 UA 判模式', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const serve = (body, ok = true) => {
    globalThis.fetch = async () => ({ ok, json: async () => body });
  };

  serve({ 'User-Agent': HEADLESS_UA });
  assert.equal(await probeRemoteHeadless(1), true);

  serve({ 'User-Agent': HEADFUL_UA });
  assert.equal(await probeRemoteHeadless(1), false);

  // 没有 UA 字段：判不出来，不能瞎猜
  serve({});
  assert.equal(await probeRemoteHeadless(1), null);

  // 端口没人应答 / 非 200：视为没有实例在跑
  serve({}, false);
  assert.equal(await probeRemoteHeadless(1), null);

  globalThis.fetch = async () => {
    throw new Error('ECONNREFUSED');
  };
  assert.equal(await probeRemoteHeadless(1), null);
});
