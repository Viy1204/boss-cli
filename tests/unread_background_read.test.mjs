import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

import * as auth from '../dist/common/auth.js';
import * as foreground from '../dist/browser/cdp_browser.js';

async function withEnv(vars, run) {
  const names = ['BOSS_BROWSER_NO_FOREGROUND', 'BOSS_BROWSER_HEADLESS', 'RECRUIT_BROWSER_HIDDEN', 'BOSS_BROWSER_DISABLE_JS'];
  const saved = Object.fromEntries(names.map(name => [name, process.env[name]]));
  try {
    for (const name of names) delete process.env[name];
    for (const [name, value] of Object.entries(vars)) process.env[name] = value;
    return await run();
  } finally {
    for (const name of names) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  }
}

async function loadSource(relative, imports) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, process, URL,
    require(specifier) {
      assert.ok(Object.hasOwn(imports, specifier), `未隔离的依赖：${specifier}`);
      return imports[specifier];
    },
  }, { filename: relative });
  return exports;
}

async function readFixture(windowState = 'normal') {
  const calls = { raised: 0 };
  const noDelay = async () => undefined;
  const tab = {
    textContent: '全部', className: 'active',
    dispatchEvent: () => true,
    click() { this.className = 'active'; },
    getAttribute: () => 'true',
    closest() { return this; },
  };
  const link = { textContent: '沟通', getAttribute: () => '/web/chat/index', querySelector: () => null };
  const items = [
    { '.geek-name': '虚构候选甲', '.source-job': '虚构岗位', '.badge-count': '2' },
    { '.geek-name': '虚构候选乙', '.source-job': '虚构岗位', '.badge-count': '' },
  ].map(fields => ({ querySelector: selector => ({ textContent: fields[selector] || '' }) }));
  const document = {
    readyState: 'complete',
    querySelector(selector) {
      if (selector === '.menu-list') return { querySelectorAll: () => [link] };
      if (selector === '.chat-message-filter-left') return { querySelectorAll: () => [tab, { ...tab, textContent: '未读' }] };
      return null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, '.geek-item');
      return items;
    },
  };
  const evaluate = script => vm.runInNewContext(script, { document, MouseEvent: class {} });
  const page = {
    url: () => auth.BOSS_CHAT_INDEX_URL,
    isClosed: () => false,
    async evaluate(script) { return evaluate(script); },
    async waitForFunction(script) { assert.ok(evaluate(script), '页面就绪条件不满足'); },
    async bringToFront() { calls.raised++; },
    async createCDPSession() {
      return {
        async send(method) {
          assert.equal(method, 'Browser.getWindowForTarget');
          return { windowId: 1, bounds: { windowState } };
        },
        detach: noDelay,
      };
    },
  };
  const session = await loadSource('../src/common/boss_session_page.ts', {
    './auth.js': auth,
    '../browser/browser_session.js': {
      ensureBrowserSession: noDelay,
      getBrowserRef: () => ({}),
      getPageRef: () => page,
      setSessionPage: () => undefined,
    },
    '../browser/cdp_browser.js': foreground,
    '../browser/human_delay.js': { CONTEXT_DESTROY_RETRY_MS: { min: 0, max: 0 } },
    '../browser/timing.js': { sleepRandom: noDelay },
    './boss_page_guards.js': { getBossPageRiskState: () => null, installBossPageGuards: noDelay },
    './boss_session_lock.js': { withBossSessionLock: callback => callback() },
  });
  const list = await loadSource('../src/toolset/list.ts', {
    '../browser/index.js': {
      LIST_FILTER_GAP_MS: { min: 0, max: 0 },
      LIST_MIN_BEFORE_READY_MS: 0,
      LIST_POLL_MS: { min: 0, max: 0 },
      sleepRandom: noDelay,
    },
    '../common/auth.js': auth,
    '../common/ensure_page.js': {
      async ensurePage(current, options) { assert.ok(options.matches(current.url())); },
    },
    '../common/boss_session_page.js': session,
  });
  return { calls, list };
}

test('默认有头且普通列表与未读读取都不前置，仍返回实际列表结果', async () => {
  await withEnv({}, async () => {
    assert.equal(foreground.resolveHeadlessFromEnv(), false, 'READ_MUST_STAY_HEADFUL');
    for (const windowState of ['normal', 'minimized']) {
      const { calls, list } = await readFixture(windowState);
      const all = await list.runGetCandidateList();
      const unread = await list.runGetCandidateList({ unreadOnly: true });
      assert.ok(all.startsWith('沟通列表共 2 人，其中 1 人有未读消息。'));
      assert.ok(unread.startsWith('未读筛选：共 1 人'));
      assert.ok(unread.includes('虚构候选甲'));
      assert.ok(!unread.includes('虚构候选乙'));
      assert.equal(calls.raised, 0, `READ_MUST_NOT_RAISE_${windowState}`);
      assert.equal(foreground.resolveHeadlessFromEnv(), false, 'READ_MUST_STAY_HEADFUL');
    }
  });
});

test('显式不前置仍使用有头模式，读取未读人选成功', async () => {
  await withEnv({ BOSS_BROWSER_NO_FOREGROUND: 'true' }, async () => {
    const { calls, list } = await readFixture();
    const unread = await list.runGetCandidateList({ unreadOnly: true });
    assert.ok(unread.startsWith('未读筛选：共 1 人'));
    assert.equal(calls.raised, 0);
    assert.equal(foreground.resolveHeadlessFromEnv(), false, 'NO_FOREGROUND_IS_NOT_HEADLESS');
  });
});

test('显式允许前置不改变有头模式，并继续尊重已最小化窗口', async () => {
  await withEnv({ BOSS_BROWSER_NO_FOREGROUND: 'false' }, async () => {
    for (const windowState of ['normal', 'minimized']) {
      const { calls, list } = await readFixture(windowState);
      const unread = await list.runGetCandidateList({ unreadOnly: true });
      assert.ok(unread.startsWith('未读筛选：共 1 人'));
      assert.equal(calls.raised, windowState === 'normal' ? 1 : 0);
      assert.equal(foreground.resolveHeadlessFromEnv(), false);
    }
  });
});

test('默认后台策略不影响登录的显式前置与有头模式', async () => {
  await withEnv({}, async () => {
    const calls = { raised: 0, navigated: 0, detached: 0 };
    const page = {
      isClosed: () => false,
      async bringToFront() { calls.raised++; },
      async goto(url) {
        assert.equal(url, 'https://www.zhipin.com/web/user/?ka=header-login');
        calls.navigated++;
      },
    };
    const login = await loadSource('../src/toolset/login.ts', {
      '../browser/index.js': {
        ensureAndGetBrowser: async () => ({}),
        getPageRef: () => page,
        setSessionPage: () => undefined,
        probeRemoteHeadless: async () => false,
        async detachBrowserSession() { calls.detached++; },
      },
    });
    const output = await login.runLogin();
    assert.ok(output.includes('已在浏览器中打开 Boss 登录页'));
    assert.deepEqual(calls, { raised: 1, navigated: 1, detached: 1 });
    assert.equal(foreground.resolveHeadlessFromEnv(), false);
  });
});
