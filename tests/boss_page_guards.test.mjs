import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getBossPageRiskState,
  installBossPageGuards,
} from '../dist/common/boss_page_guards.js';

const RISK_URL = 'https://www.zhipin.com/web/passport/zp/verify.html?from=chat';
const CHAT_INDEX_URL = 'https://www.zhipin.com/web/chat/index';

function createFakePage(initialUrl = CHAT_INDEX_URL) {
  const listeners = new Map();
  const cdpCalls = [];
  const gotos = [];
  const mainFrame = { url: () => page.currentUrl };

  const page = {
    currentUrl: initialUrl,
    gotos,
    cdpCalls,
    isClosed: () => false,
    url: () => page.currentUrl,
    mainFrame: () => mainFrame,
    evaluateOnNewDocument: async () => {},
    evaluate: async () => {},
    on: (event, cb) => {
      const arr = listeners.get(event) ?? [];
      arr.push(cb);
      listeners.set(event, arr);
    },
    createCDPSession: async () => ({
      send: async (method, params) => {
        cdpCalls.push({ method, params });
      },
      on: () => {},
    }),
    goto: async (url) => {
      gotos.push(url);
      page.currentUrl = url;
    },
    emitMainFrameNavigated: (url) => {
      page.currentUrl = url;
      for (const cb of listeners.get('framenavigated') ?? []) {
        cb(mainFrame);
      }
    },
  };
  return page;
}

function silenceStderr() {
  const original = console.error;
  const messages = [];
  console.error = (msg) => messages.push(String(msg));
  return {
    messages,
    restore: () => {
      console.error = original;
    },
  };
}

test('风险页反弹超过阈值后熔断，不再无限跳回沟通页', async () => {
  const page = createFakePage();
  const stderr = silenceStderr();
  try {
    await installBossPageGuards(page);
    for (let i = 0; i < 6; i++) {
      page.emitMainFrameNavigated(RISK_URL);
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  } finally {
    stderr.restore();
  }

  const bounces = page.gotos.filter((u) => u === CHAT_INDEX_URL);
  assert.equal(bounces.length, 3, '窗口内最多反弹 3 次');

  const state = getBossPageRiskState(page);
  assert.ok(state, '应记录熔断状态');
  assert.equal(state.kind, 'risk_navigation');
  assert.equal(state.url, RISK_URL);
  assert.ok(stderr.messages.some((m) => m.includes('风控/验证页')));

  const lastFetchEnable = page.cdpCalls.filter((c) => c.method === 'Fetch.enable').at(-1);
  const patterns = lastFetchEnable.params.patterns.map((p) => p.urlPattern);
  assert.ok(
    !patterns.some((p) => p.includes('verify')),
    '熔断后应放行验证页导航，让用户手动完成验证',
  );
  assert.ok(page.gotos.includes(RISK_URL), '熔断后应把验证页展示出来');
});

test('同一页面反复自刷新时熔断并给出原因', async () => {
  const page = createFakePage();
  const stderr = silenceStderr();
  try {
    await installBossPageGuards(page);
    for (let i = 0; i < 5; i++) {
      page.emitMainFrameNavigated(CHAT_INDEX_URL);
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  } finally {
    stderr.restore();
  }

  const state = getBossPageRiskState(page);
  assert.ok(state, '应记录熔断状态');
  assert.equal(state.kind, 'reload_loop');
  assert.equal(page.gotos.length, 0, '自刷新循环不应触发额外导航');
});

test('命令启动时页面已停在验证页则立即熔断', async () => {
  const page = createFakePage(RISK_URL);
  const stderr = silenceStderr();
  try {
    await installBossPageGuards(page);
  } finally {
    stderr.restore();
  }

  const state = getBossPageRiskState(page);
  assert.ok(state);
  assert.equal(state.kind, 'risk_navigation');
  assert.equal(page.gotos.length, 0, '不应再尝试跳回沟通页');
});

test('正常沟通页不触发熔断', async () => {
  const page = createFakePage();
  await installBossPageGuards(page);
  page.emitMainFrameNavigated('https://www.zhipin.com/web/chat/recommend');
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(getBossPageRiskState(page), null);
  assert.equal(page.gotos.length, 0);
});
