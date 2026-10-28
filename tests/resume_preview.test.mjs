import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

async function loadSource(file, imports) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, URL, process: { env: {} }, require: id => {
    assert.ok(Object.hasOwn(imports, id), '未隔离的依赖：' + id);
    return imports[id];
  } }, { filename: file });
  return exports;
}

async function searchFixture() {
  const state = { clicks: [], contacts: 0, afterScroll: null };
  class Element {
    constructor(text = '') { this.textContent = text; this.style = { display: 'block', visibility: 'visible', opacity: '1' }; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getBoundingClientRect() { return { width: 300, height: 300 }; }
    scrollIntoView() { state.afterScroll?.(); }
    click() {}
    dispatchEvent(event) { if (event.type === 'click') this.click(); }
  }
  const makeCard = (id, name) => {
    const card = new Element();
    card.__vue__ = { $props: { geek: { geekCard: { encryptGeekId: id } } } };
    card.name = new Element(name);
    card.name.click = () => state.clicks.push(id);
    card.summary = new Element(id === 'candidate-1' ? '工程师' : '设计师');
    card.contact = new Element('联系Ta');
    card.contact.click = () => { state.contacts++; };
    card.querySelector = selector => selector === '.name-label' ? card.name : selector === '.info-detail' ? card.summary : selector === '.btn-getcontact' ? card.contact : null;
    card.querySelectorAll = selector => selector === 'button' ? [card.contact] : [];
    return card;
  };
  state.cards = [makeCard('candidate-1', '张**'), makeCard('candidate-2', '张**')];
  const document = { querySelectorAll: selector => selector === '.geek-info-card' ? state.cards : [] };
  const window = { __bossCliSearchFrameBinding: 'frame-binding', getComputedStyle: el => el.style };
  document.defaultView = window;
  const iframe = new Element(); iframe.contentDocument = document;
  const topWindow = {
    document: { querySelectorAll: selector => selector === 'iframe[name="searchFrame"]' ? [iframe] : [] },
    location: new URL('https://www.zhipin.com/web/chat/search'),
    getComputedStyle: el => el.style,
  };
  window.top = topWindow;
  const context = vm.createContext({ document, window, HTMLElement: Element, MouseEvent: class { constructor(type) { this.type = type; } } });
  const frame = { evaluate: async script => vm.runInContext(script, context) };
  const dialog = await loadSource('../src/common/boss_greet_card_dialog.ts', { '../browser/timing.js': { sleepRandom: async () => {} } });
  const api = await loadSource('../src/toolset/normal-search.ts', {
    'node:crypto': { randomUUID: () => 'snapshot-id' },
    'puppeteer-core': { TimeoutError: Error },
    '../browser/index.js': { sleepRandom: async () => {}, RESUME_PREVIEW_OPEN_GAP_MS: { min: 0, max: 0 } },
    '../common/boss_session_page.js': {},
    '../common/boss_greet_card_dialog.js': dialog,
  });
  return { state, frame, api, window };
}

test('搜索预览同名须索引，第二人只打开简历且不点击沟通', async () => {
  const f = await searchFixture();
  await f.api.captureSearchPoolSnapshot(f.frame);
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '张**'), /唯一|同名|多个/);
  const selected = await f.api.openNormalSearchResumePreview(f.frame, '张**', 2);
  assert.equal(selected.name, '张**');
  assert.equal(selected.index, 2);
  assert.deepEqual(f.state.clicks, ['candidate-2']);
  assert.equal(f.state.contacts, 0);
});

test('搜索预览拒绝索引关键词冲突和非法索引且零点击', async () => {
  const f = await searchFixture();
  await f.api.captureSearchPoolSnapshot(f.frame);
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '工程师', 2), /不匹配|冲突/);
  for (const index of [0, -1, 1.5, 3]) {
    await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', index), /序号|index/);
  }
  assert.deepEqual(f.state.clicks, []);
  assert.equal(f.state.contacts, 0);
});

test('搜索预览姓名不得由另一人的摘要关键词满足', async () => {
  const f = await searchFixture();
  f.state.cards[0].name.textContent = '李**';
  f.state.cards[1].name.textContent = '陈**';
  f.state.cards[1].summary.textContent = '李宁 电商运营';
  await f.api.captureSearchPoolSnapshot(f.frame);
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '李**', 2), /不匹配|冲突/);
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '电商运营'), /唯一|姓名/);
  assert.deepEqual(f.state.clicks, []);
  const selected = await f.api.openNormalSearchResumePreview(f.frame, '李**');
  assert.equal(selected.index, 1);
  assert.equal(selected.name, '李**');
  assert.deepEqual(f.state.clicks, ['candidate-1']);
  assert.equal(f.state.contacts, 0);
});

test('搜索预览缺少、过期或列表变化时不重新建立快照', async () => {
  const f = await searchFixture();
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', 2), /快照/);
  assert.equal(f.window.__bossCliSearchSnapshot, undefined);
  await f.api.captureSearchPoolSnapshot(f.frame);
  f.window.__bossCliSearchSnapshot.createdAt -= 15 * 60 * 1000 + 1;
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', 2), /15 分钟|过期/);
  await f.api.captureSearchPoolSnapshot(f.frame);
  f.state.cards.reverse();
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', 2), /快照|顺序|身份/);
  assert.deepEqual(f.state.clicks, []);
  assert.equal(f.state.contacts, 0);
});

test('搜索预览缺少已验证姓名入口不改点任意链接或沟通按钮', async () => {
  const f = await searchFixture();
  f.state.cards[1].name = null;
  await f.api.captureSearchPoolSnapshot(f.frame);
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', 2), /姓名|入口/);
  assert.deepEqual(f.state.clicks, []);
  assert.equal(f.state.contacts, 0);
});

test('搜索预览滚动期间身份变化后零点击', async () => {
  const f = await searchFixture();
  await f.api.captureSearchPoolSnapshot(f.frame);
  f.state.afterScroll = () => { f.state.cards[1].__vue__.$props.geek.geekCard.encryptGeekId = 'other-candidate'; };
  await assert.rejects(f.api.openNormalSearchResumePreview(f.frame, '', 2), /快照|顺序|身份/);
  assert.deepEqual(f.state.clicks, []);
  assert.equal(f.state.contacts, 0);
});

async function previewFixture(path) {
  const state = { opens: [], deepNavigations: 0, captures: [] };
  const page = { url: () => 'https://www.zhipin.com' + path };
  const api = await loadSource('../src/toolset/preview.ts', {
    'node:path': { join: (...parts) => parts.join('/') },
    '../browser/index.js': { withWindowVisible: async (_page, callback) => callback(), snapshotBossPageViewport: async () => ({ width: 1200, height: 800 }) },
    '../common/boss_session_page.js': { withBossSessionPage: async callback => callback(page) },
    '../common/boss_paywall_popup.js': { waitForCResumeIframeOrPaywall: async () => 'iframe' },
    '../common/c_resume_capture.js': {
      waitForVisibleCResumeIframeReady: async () => true,
      captureCResumeIframeToFile: async (_page, _viewport, file) => { state.captures.push(file); return { ok: true }; },
      safeResumeScreenshotFileBase: value => value,
    },
    '../config.js': { ensureAppDataLayout() {}, RESUME_SCREENSHOTS_DIR: '/screenshots' },
    '../ocr/index.js': { isResumeOcrEnabled: () => false },
    './deep-search.js': {
      isBossChatAiFormUrl: url => url.endsWith('/aiform'),
      ensureInDeepSearchPage: async () => { state.deepNavigations++; },
      readAiFormSelectedJobLabel: async () => '工程师',
      openDeepSearchResumePreview: async () => { state.opens.push('deep'); return true; },
    },
    './recommend.js': {
      isBossChatRecommendUrl: url => url.endsWith('/recommend'),
      assertRecommendPageReadyForPreview: async () => ({}),
      openRecommendResumePreview: async (_frame, target, index) => { state.opens.push({ target, index }); return { name: '实际姓名', index }; },
    },
    './normal-search.js': {
      isBossChatSearchUrl: url => url.endsWith('/search'),
      assertNormalSearchPageReadyForPreview: async () => ({}),
      readNormalSearchSelectedJobLabel: async () => '工程师',
      openNormalSearchResumePreview: async (_frame, target, index) => { state.opens.push({ target, index }); return { name: '实际姓名', index }; },
    },
  });
  return { state, api };
}

test('搜索及推荐纯索引预览输出实际姓名与序号', async () => {
  for (const page of ['/web/chat/search', '/web/chat/recommend']) {
    const f = await previewFixture(page);
    const result = await f.api.runPreview({ candidateTarget: '', candidateIndex: 2 });
    assert.match(result, /实际姓名/);
    assert.match(result, /#2|序号.?2/);
    assert.deepEqual(f.state.opens, [{ target: '', index: 2 }]);
    assert.equal(f.state.captures.length, 1);
    assert.match(f.state.captures[0], /2/);
  }
});

test('旧深搜索引预览在任何导航或点击前拒绝', async () => {
  const f = await previewFixture('/web/chat/aiform');
  await assert.rejects(f.api.runPreview({ candidateTarget: '张三', candidateIndex: 2 }), /深度搜索|深搜/);
  assert.equal(f.state.deepNavigations, 0);
  assert.deepEqual(f.state.opens, []);
  assert.deepEqual(f.state.captures, []);
});
