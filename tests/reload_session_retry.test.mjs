import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

async function sessionFixture() {
  const state = { reloads: 0, connections: 0, waits: 0 };
  const failure = new Error('Execution context was destroyed, most likely because of a navigation.');
  const frameWindow = { __bossCliSearchSnapshot: { id: 'old-search' } };
  const link = { textContent: '搜索', getAttribute: () => '/web/chat/search', querySelector: () => null };
  const menu = { querySelectorAll: () => [link] };
  const document = {
    readyState: 'complete',
    querySelector: () => menu,
    querySelectorAll: () => [{ contentWindow: frameWindow }],
  };
  const page = {
    url: () => 'https://www.zhipin.com/web/chat/search',
    isClosed: () => false,
    evaluate: async script => vm.runInNewContext(script, { document }),
    reload: async () => {
      state.reloads++;
      assert.equal(frameWindow.__bossCliSearchSnapshot, undefined);
    },
    waitForFunction: async () => {
      if (state.waits++ === 0) throw failure;
    },
  };
  const browser = {};
  const auth = {
    BOSS_CHAT_INDEX_URL: 'https://www.zhipin.com/web/chat/index',
    isBossChatShellUrl: url => new URL(url).pathname.startsWith('/web/chat/'),
  };
  const dependencies = {
    './auth.js': auth,
    '../browser/browser_session.js': {
      ensureBrowserSession: async () => { state.connections++; },
      getBrowserRef: () => browser,
      getPageRef: () => page,
      setSessionPage: () => {},
    },
    '../browser/cdp_browser.js': { bringToFrontUnlessMinimized: async () => {} },
    '../browser/human_delay.js': { CONTEXT_DESTROY_RETRY_MS: { min: 0, max: 0 } },
    '../browser/timing.js': { sleepRandom: async () => {} },
    './boss_page_guards.js': {
      getBossPageRiskState: () => null,
      installBossPageGuards: async () => {},
    },
    './boss_session_lock.js': { withBossSessionLock: async callback => callback() },
  };
  const loadSource = async (relativePath, imports) => {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const exports = {};
    vm.runInNewContext(outputText, {
      exports,
      process: { env: {} },
      URL,
      require: specifier => {
        assert.ok(Object.hasOwn(imports, specifier), '未隔离的依赖：' + specifier);
        return imports[specifier];
      },
    }, { filename: relativePath });
    return exports;
  };
  const session = await loadSource('../src/common/boss_session_page.ts', dependencies);
  const reload = await loadSource('../src/toolset/reload.ts', {
    '../common/auth.js': auth,
    '../common/boss_session_page.js': session,
  });
  return { state, failure, frameWindow, session, reload };
}

test('reload经生产会话封装在刷新后上下文销毁时只刷新一次并原样报错', async () => {
  const f = await sessionFixture();
  await assert.rejects(f.reload.runReload(), error => error === f.failure);
  assert.equal(f.state.reloads, 1);
  assert.equal(f.state.connections, 1);
  assert.equal(f.frameWindow.__bossCliSearchSnapshot, undefined);
});

test('其他会话调用默认保留一次上下文销毁重试', async () => {
  const f = await sessionFixture();
  let calls = 0;
  const result = await f.session.withBossSessionPage(async () => {
    if (calls++ === 0) throw f.failure;
    return '读取成功';
  }, { ensureChatShell: false, ensureMenuList: false });
  assert.equal(result, '读取成功');
  assert.equal(calls, 2);
  assert.equal(f.state.connections, 2);
  assert.equal(f.state.reloads, 0);
});
