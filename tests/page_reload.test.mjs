import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { TimeoutError } from 'puppeteer-core';
import * as toolset from '../dist/toolset/index.js';
import { executeCommand } from '../dist/cli/cliRouter.js';
import { installBossPageGuards } from '../dist/common/boss_page_guards.js';
import { ensureInNormalSearchPage, runNormalSearch } from '../dist/toolset/normal-search.js';
import { ensureInRecommendPage, assertRecommendPageReady } from '../dist/toolset/recommend.js';

const SEARCH_URL = 'https://www.zhipin.com/web/chat/search';

function reloadFixture({ url = SEARCH_URL, afterUrl, reloadError, sidebar = true } = {}) {
  const frameWindow = { __bossCliSearchSnapshot: { id: 'old-search' } };
  const link = { textContent: '搜索', getAttribute: () => '/web/chat/search', querySelector: () => null };
  const menu = { querySelectorAll: () => [link] };
  const document = {
    readyState: 'complete',
    querySelector: () => sidebar ? menu : null,
    querySelectorAll: () => [{ contentWindow: frameWindow }],
  };
  const state = { url, reloads: 0, gotos: 0, closes: 0, newPages: 0 };
  const listeners = new Map();
  const mainFrame = { url: () => state.url };
  const page = {
    url: () => state.url,
    isClosed: () => false,
    mainFrame: () => mainFrame,
    frames: () => [mainFrame],
    evaluateOnNewDocument: async () => {},
    evaluate: async script => script.startsWith('(function()') ? undefined : vm.runInNewContext(script, { document }),
    waitForFunction: async script => {
      if (state.onWait) state.onWait();
      if (!vm.runInNewContext(script, { document })) throw new TimeoutError('Waiting failed: 30000ms exceeded');
    },
    createCDPSession: async () => ({ send: async () => {}, on: () => {} }),
    on: (event, handler) => listeners.set(event, handler),
    goto: async () => { state.gotos++; },
    close: async () => { state.closes++; },
    browser: () => ({ close: async () => { state.closes++; }, newPage: async () => { state.newPages++; } }),
    reload: async options => {
      state.reloads++;
      assert.equal(frameWindow.__bossCliSearchSnapshot, undefined, '开始刷新前旧搜索快照就必须失效');
      assert.equal(options.waitUntil, 'load');
      if (reloadError) throw reloadError;
      if (afterUrl) state.url = afterUrl;
      if (state.onReload) state.onReload();
    },
    emitNavigation: () => listeners.get('framenavigated')?.(mainFrame),
  };
  const runner = async (callback, options) => {
    assert.deepEqual(options, { ensureChatShell: false, ensureMenuList: false, retryOnContextDestroyed: false });
    return callback(page);
  };
  return { page, runner, state, frameWindow };
}

function assertNoRecoveryNavigation(state) {
  assert.equal(state.gotos, 0);
  assert.equal(state.closes, 0);
  assert.equal(state.newPages, 0);
}

test('reload只刷新当前主壳一次并提前作废搜索快照', async () => {
  const f = reloadFixture();
  const result = await toolset.runReload(f.runner);
  assert.match(result, /已刷新/);
  assert.match(result, /boss search/);
  assert.equal(f.state.reloads, 1);
  assert.equal(f.frameWindow.__bossCliSearchSnapshot, undefined);
  assertNoRecoveryNavigation(f.state);
});

test('reload失败仍保持旧快照失效且不能返回成功', async () => {
  const failure = new TimeoutError('Navigation timeout of 60000 ms exceeded');
  const f = reloadFixture({ reloadError: failure });
  await assert.rejects(toolset.runReload(f.runner), error => error === failure);
  assert.equal(f.state.reloads, 1);
  assert.equal(f.frameWindow.__bossCliSearchSnapshot, undefined);
  assertNoRecoveryNavigation(f.state);
});

for (const url of ['https://www.zhipin.com/web/user/?ka=header-login', 'https://www.zhipin.com/web/passport/zp/verify.html', 'https://example.com/', 'https://www.zhipin.com.example.com/web/chat/search']) {
  test('非Boss主壳页不能执行reload：' + url, async () => {
    const f = reloadFixture({ url });
    await assert.rejects(toolset.runReload(f.runner), /主壳|登录|验证/);
    assert.equal(f.state.reloads, 0);
    assertNoRecoveryNavigation(f.state);
  });
}

test('刷新后跳到登录页不能报告成功', async () => {
  const f = reloadFixture({ afterUrl: 'https://www.zhipin.com/web/user/?ka=bticket' });
  await assert.rejects(toolset.runReload(f.runner), /主壳|登录/);
  assert.equal(f.state.reloads, 1);
  assertNoRecoveryNavigation(f.state);
});

test('等待侧栏期间跳到登录页不能报告成功', async () => {
  const f = reloadFixture();
  f.state.onWait = () => { f.state.url = 'https://www.zhipin.com/web/user/?ka=bticket'; };
  await assert.rejects(toolset.runReload(f.runner), /主壳|登录/);
  assert.equal(f.state.reloads, 1);
  assertNoRecoveryNavigation(f.state);
});

test('刷新后侧栏未就绪不能报告成功', async () => {
  const f = reloadFixture({ sidebar: false });
  await assert.rejects(toolset.runReload(f.runner), /侧栏|menu-list/);
  assert.equal(f.state.reloads, 1);
  assertNoRecoveryNavigation(f.state);
});

for (const afterReload of [false, true]) {
  test('风险熔断不能被reload清除：' + (afterReload ? '刷新后' : '刷新前'), async () => {
    const f = reloadFixture();
    await installBossPageGuards(f.page);
    const trigger = () => { for (let i = 0; i < 5; i++) f.page.emitNavigation(); };
    const original = console.error;
    console.error = () => {};
    try {
      if (afterReload) f.state.onReload = trigger;
      else trigger();
      await assert.rejects(toolset.runReload(f.runner), error => error.name === 'BossPageRiskError');
    } finally {
      console.error = original;
    }
    assert.equal(f.state.reloads, afterReload ? 1 : 0);
    assertNoRecoveryNavigation(f.state);
  });
}

for (const extra of [['extra'], ['--force'], ['--wait', '10'], ['--']]) {
  test('reload拒绝额外参数且不连接浏览器：' + extra.join(' '), async () => {
    await assert.rejects(executeCommand(['reload', ...extra]), /用法: reload/);
  });
}

function initializationFixture(kind, error, stage = 'ready') {
  const state = { reloads: 0, gotos: 0 };
  const frame = {
    url: () => 'https://www.zhipin.com/web/frame/' + (kind === 'search' ? 'search' : 'recommend'),
    waitForFunction: async () => { throw error; },
  };
  const page = {
    url: () => 'https://www.zhipin.com/web/chat/' + (stage === 'navigation' ? 'index' : kind),
    frames: () => [frame],
    evaluate: async () => true,
    waitForSelector: async () => { if (stage === 'iframe') throw error; return { contentFrame: async () => frame }; },
    waitForNetworkIdle: async () => { throw error; },
    waitForFunction: async () => { throw error; },
    goto: async () => { state.gotos++; throw error; },
    reload: async () => { state.reloads++; },
  };
  return { page, state };
}

for (const [kind, enter] of [['search', ensureInNormalSearchPage], ['recommend', ensureInRecommendPage]]) {
  test(kind + '初始化TimeoutError保留原因和上下文，只提示显式reload', async () => {
    const original = new TimeoutError('Waiting failed: 18000ms exceeded');
    const f = initializationFixture(kind, original);
    await assert.rejects(enter(f.page), error => {
      assert.equal(error.cause, original);
      assert.match(error.message, /18000ms exceeded/);
      assert.match(error.message, /初始化.*超时/);
      assert.match(error.message, /阶段/);
      assert.ok(error.message.includes(f.page.url()));
      assert.match(error.message, /boss reload/);
      assert.ok(error.message.includes('boss ' + kind));
      return true;
    });
    assert.equal(f.state.reloads, 0);
    assert.equal(f.state.gotos, 0);
  });

  test(kind + '非TimeoutError保留原对象且不提示恢复', async () => {
    const original = new Error('Execution context was destroyed');
    const f = initializationFixture(kind, original);
    await assert.rejects(enter(f.page), error => error === original);
    assert.equal(f.state.reloads, 0);
  });
}

for (const [kind, enter, stage] of [
  ['search', ensureInNormalSearchPage, 'navigation'],
  ['recommend', ensureInRecommendPage, 'navigation'],
  ['recommend', ensureInRecommendPage, 'iframe'],
]) {
  test(kind + '初始化超时包含实际阶段：' + stage, async () => {
    const original = new TimeoutError('Navigation/selector timeout');
    const f = initializationFixture(kind, original, stage);
    await assert.rejects(enter(f.page), error => error.cause === original && /阶段/.test(error.message) && /boss reload/.test(error.message));
    assert.equal(f.state.reloads, 0);
  });
}

test('公开search初始化错误保留cause链', async () => {
  const original = new TimeoutError('Waiting failed: 18000ms exceeded');
  const f = initializationFixture('search', original);
  await assert.rejects(runNormalSearch({ keyword: 'TypeScript' }, async callback => callback(f.page)), error => {
    assert.equal(error.cause?.cause, original);
    assert.match(error.message, /boss reload/);
    return true;
  });
});

test('推荐预览或greet就绪失败不附只读命令恢复提示', async () => {
  const original = new TimeoutError('Waiting failed: 18000ms exceeded');
  const f = initializationFixture('recommend', original);
  await assert.rejects(assertRecommendPageReady(f.page, '打招呼'), error => error === original && !/boss reload/.test(error.message));
  assert.equal(f.state.reloads, 0);
});
