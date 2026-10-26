import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { ensureMenuListMountedAfterLoad } from '../dist/common/boss_session_page.js';
import { captureSearchPoolSnapshot, ensureInNormalSearchPage, selectNormalSearchAnyJob, selectNormalSearchJob, settleNormalSearchFrame, runKeywordSearch, assertNormalSearchFiltersClear, prepareNormalSearchJob, runNormalSearch } from '../dist/toolset/normal-search.js';

const originalTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms, ...args) => originalTimeout(fn, 0, ...args);
test.after(() => { globalThis.setTimeout = originalTimeout; });

function fixture({ chosen = '不限职位', actual = '游戏主程（UE5）' } = {}) {
  class El {
    constructor(text = '') { this.textContent = text; }
    scrollIntoView() {}
    click() {}
  }
  const current = new El(actual);
  const trigger = new El();
  const item = new El(chosen);
  const document = {
    querySelector: selector => selector === '.search-current-job' ? current : trigger,
    querySelectorAll: selector => selector === 'li[ka="search_select_job"]' || selector === '.search-job-list-C li[ka="search_select_job"] .job-name' ? [item] : [],
  };
  const evaluate = script => vm.runInNewContext(script, { document, HTMLElement: El });
  return { evaluate: async script => evaluate(script), waitForFunction: async script => { if (!evaluate(script)) throw new Error('岗位选择没有生效'); } };
}

test('不限职位点击没有真正生效时必须拒绝，不能返回另一个岗位', async () => {
  await assert.rejects(selectNormalSearchAnyJob(fixture()), /岗位|职位/);
});

test('指定岗位没有真正生效时必须拒绝，不能忽略等待失败', async () => {
  await assert.rejects(selectNormalSearchJob(fixture({ chosen: '动画师' }), '动画师'), /岗位|职位/);
});


test('tooltip浮层副本不应改变完整work和education语义资料', async () => {
  const company = { textContent: '完整公司名称' };
  const role = { textContent: '完整岗位名称' };
  const school = { textContent: '完整院校名称' };
  const degree = { textContent: '本科专业' };
  const work = { textContent: '2019-2024 完整公司名称 完整岗位名称', querySelectorAll: () => [{ textContent: '2019-2024' }, company, role] };
  const edu = { textContent: '2015-2019 完整院校名称 本科专业', querySelectorAll: () => [{ textContent: '2015-2019' }, school, degree] };
  const eduBox = { textContent: edu.textContent, querySelectorAll: () => [edu] };
  const card = { __vue__: { $props: { geek: { geekCard: { encryptGeekId: 'candidate-1' } } } }, querySelector: sel => sel === '.name-label' ? { textContent: '张**' } : sel === '.edu-exp-box' ? eduBox : null,
    querySelectorAll: sel => sel === '.work-exp-box .work-exp-item' ? [work] : sel === '.edu-exp-box li' ? [edu] : [],
  };
  const window = {};
  const document = { querySelectorAll: () => [card] };
  const frame = { evaluate: async script => vm.runInNewContext(script, { document, window }) };
  const before = await captureSearchPoolSnapshot(frame);
  work.textContent += ' 完整公司名称 完整岗位名称';
  eduBox.textContent += ' 完整院校名称 本科专业';
  const after = await captureSearchPoolSnapshot(frame);
  assert.deepEqual(Array.from(after[0].work), Array.from(before[0].work));
  assert.equal(after[0].education, before[0].education);
  assert.match(after[0].work[0], /完整公司名称/);
  assert.match(after[0].education, /完整院校名称/);
  company.textContent = '另一家公司完整名称';
  school.textContent = '另一院校完整名称';
  const changed = await captureSearchPoolSnapshot(frame);
  assert.notEqual(changed[0].work[0], after[0].work[0]);
  assert.notEqual(changed[0].education, after[0].education);
});



function pageFixture({ job = '不限职位', keyword = '', city = '深圳', loading = false, hiddenLoaderParent = false } = {}) {
  const state = { job, keyword, city, loading, signature: '工程师', empty: false, noCards: false, idleCalls: 0, polled: [], pagePath: '/web/chat/search' };
  class El {
    constructor(textContent = '') { this.textContent = textContent; this.parentElement = null; this.style = { display: 'block', visibility: 'visible', opacity: '1' }; }
    getBoundingClientRect() { return { width: 300, height: 300 }; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    focus() {}
    scrollIntoView() {}
    click() { if (state.onJobClick) state.onJobClick(this); }
    dispatchEvent(event) { if (event.type === 'keydown' && state.onEnter) state.onEnter(); }
  }
  const input = new El();
  Object.defineProperty(input, 'value', { get: () => state.keyword, set: value => { state.keyword = value; } });
  const card = new El(); card.__vue__ = { $props: { geek: { geekCard: { encryptGeekId: 'candidate-1' } } } };
  card.querySelector = selector => selector === '.name-label' ? new El('张**') : selector === '.info-detail' ? new El(state.signature) : null;
  const loader = new El();
  if (hiddenLoaderParent) { loader.parentElement = new El(); loader.parentElement.style.display = 'none'; }
  const active = new El();
  Object.defineProperty(active, 'textContent', { get: () => state.job });
  active.querySelector = () => state.job === '不限职位' ? null : new El(state.job);
  const doc = { readyState: 'complete',
    querySelector: selector => selector === '.search-input' ? input : selector === '.search-current-job' ? new El(state.job)
      : selector.includes('search_select_job') ? active : selector === '.geek-list-wrap, .card-list' ? new El() : selector === '.city-wrap .city' ? new El(state.city) : selector === '.empty-tips' && state.empty ? new El('暂无结果') : null,
    querySelectorAll: selector => selector === '.geek-info-card' ? (state.noCards ? [] : [card]) : selector === '.toast-con.toast-loading' && state.loading ? [loader] : selector === '.search-job-list-C li[ka="search_select_job"] .job-name' ? [new El('资深动画师')] : selector === 'li[ka="search_select_job"]' ? [new El('不限职位')] : [],
  };
  const window = { getComputedStyle: el => el.style };
  let tick = 0;
  doc.defaultView = window; doc.location = { href: 'https://www.zhipin.com/web/frame/search' };
  const iframe = new El(); iframe.name = 'searchFrame'; iframe.contentDocument = doc;
  const menuLink = new El('搜索'); menuLink.click = () => { state.menuClicks = (state.menuClicks ?? 0) + 1; state.pagePath = '/web/chat/search'; };
  const mainDoc = { querySelector: selector => selector.includes('menu-geeksearch') ? menuLink : iframe, querySelectorAll: () => [iframe] };
  const globals = document => ({ document, window, location: { pathname: state.pagePath }, getComputedStyle: el => el.style,
    HTMLElement: El, HTMLInputElement: El, Event: class { constructor(type) { this.type = type; } }, KeyboardEvent: class { constructor(type) { this.type = type; } },
    Date: class { static now() { tick += 150; return tick; } },
  });
  const frame = { name: () => 'searchFrame', url: () => 'https://www.zhipin.com/web/frame/search', evaluate: async script => vm.runInNewContext(script, globals(doc)), waitForFunction: async script => { if (!vm.runInNewContext(script, globals(doc))) throw new Error('岗位没有生效'); } };
  const handlers = new Map();
  const page = { url: () => 'https://www.zhipin.com' + state.pagePath, frames: () => [state.currentFrame ?? frame], goto: async () => { state.gotos = (state.gotos ?? 0) + 1; state.pagePath = '/web/chat/search'; },
    waitForSelector: async () => ({ contentFrame: async () => state.currentFrame ?? frame }),
    waitForNetworkIdle: async () => { state.idleCalls++; if (state.onIdle) state.onIdle(); },
    waitForFunction: async (script, options) => {
      state.polled.push(options.polling);
      for (let i = 0; i < 20; i++) {
        if (state.onPoll) state.onPoll(i);
        if (vm.runInNewContext(script, globals(mainDoc))) return;
      }
      throw new Error('搜索等待超时');
    },
    evaluate: async script => vm.runInNewContext(script, globals(mainDoc)),
    on: (event, handler) => handlers.set(event, handler), off: event => handlers.delete(event),
  };
  return { page, frame, state, doc, iframe, handlers, window };
}

test('search初始化必须等请求稳定后重新获取当前iframe，不能使用首个旧frame', async () => {
  const f = pageFixture();
  const oldFrame = { url: () => 'https://www.zhipin.com/web/frame/search' };
  f.state.currentFrame = oldFrame;
  f.state.onIdle = () => { f.state.currentFrame = f.frame; };
  assert.equal(await ensureInNormalSearchPage(f.page), f.frame);
  assert.equal(f.state.idleCalls, 1);
  assert.deepEqual(f.state.polled, [100, 100]);
});

for (const expected of [{ job: '动画师' }, { keyword: '动捕精修' }, { city: '北京' }]) {
  test('最终搜索条件不符合预期时必须拒绝：' + JSON.stringify(expected), async () => {
    const f = pageFixture();
    await assert.rejects(settleNormalSearchFrame(f.page, expected), /搜索/);
  });
}

test('真正可见的loading不能判为列表稳定', async () => {
  const f = pageFixture({ loading: true });
  await assert.rejects(settleNormalSearchFrame(f.page), /搜索/);
});

test('隐藏祖先中的常驻loader不阻断真实列表', async () => {
  const f = pageFixture({ loading: true, hiddenLoaderParent: true });
  assert.equal(await settleNormalSearchFrame(f.page), f.frame);
});

test('外部导航离开搜索页必须停止，不能使用缓存frame', async () => {
  const f = pageFixture();
  f.state.onIdle = () => { f.state.pagePath = '/web/chat/job/list'; };
  await assert.rejects(settleNormalSearchFrame(f.page), /离开搜索页/);
});

test('输入框正确但没有请求完成或列表更新不能宣称关键词搜索成功', async () => {
  const f = pageFixture();
  await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' }), /请求|响应|结果/);
  assert.equal(f.handlers.size, 0);
});

test('仅异步资料变化不能代替精确结果响应', async () => {
  const f = pageFixture();
  f.state.onEnter = () => { f.state.signature = '动画工程师'; };
  await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' }), /请求|绑定/);
  assert.equal(f.handlers.size, 0);
});


test('清空后仍有学历筛选时不能继续输出搜索结果', async () => {
  const document = { querySelector: selector => selector === '.degree-ui .degree-item.active' ? { textContent: '本科及以上' } : null,
    querySelectorAll: () => [],
  };
  const frame = { evaluate: async script => vm.runInNewContext(script, { document }) };
  await assert.rejects(assertNormalSearchFiltersClear(frame), /清空筛选未生效/);
});

function emitResult(f, { path = 'geeks.json', keyword = '动捕精修', jobId = '', status = 200, code = 0, change = true, count = 1, candidateId = 'candidate-1' } = {}) {
  const request = { frame: () => f.frame, url: () => 'https://www.zhipin.com/wapi/zpitem/web/boss/search/' + path + '?page=1&keywords=' + encodeURIComponent(keyword) + '&jobId=' + jobId };
  f.handlers.get('request')(request);
  if (change) f.state.signature = '关键词结果动画师';
  const response = { request: () => request, status: () => status, json: async () => ({ code, zpData: { page: 1, geeks: Array.from({ length: count }, (_v, i) => ({ geekCard: { encryptGeekId: count === 1 ? candidateId : candidateId + i } })) } }) };
  f.handlers.get('response')(response);
}

for (const config of [{ path: 'autoSuggest.json' }, { path: 'dapCommon.json' }, { keyword: '别的关键词' }, { jobId: 'otherJob' }, { status: 500 }, { code: 1 }, { candidateId: 'wrong-candidate' }, { count: 2 }]) {
  test('无关请求、业务错误或未应用结果必须拒绝：' + JSON.stringify(config), async () => {
    const f = pageFixture();
    f.state.onEnter = () => emitResult(f, config);
    await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' }), /请求|响应|结果|列表/);
    assert.equal(f.handlers.size, 0);
  });
}

test('同候选列表也可通过精确关键词响应与平台ID应用证明', async () => {
  const f = pageFixture(); f.state.onEnter = () => emitResult(f, { change: false });
  assert.equal((await runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' })).frame, f.frame);
  assert.equal(f.handlers.size, 0);
});

test('没有选岗请求绑定时非空jobId也不能作为明确岗位证据', async () => {
  const f = pageFixture({ job: '资深动画师' });
  await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '资深动画师' }), /绑定/);
});

test('进入主壳的非动画DOM等待在隐藏页面采用数值polling', async () => {
  const seen = [];
  const page = { waitForFunction: async (_script, options) => { seen.push(options.polling); assert.equal(options.polling, 100); }, evaluate: async () => ({ exists: true, signature: '职位管理' }) };
  await ensureMenuListMountedAfterLoad(page);
  assert.deepEqual(seen, [100, 100]);
});


test('没有卡片且没有可见empty提示不能成功', async () => {
  const f = pageFixture(); f.state.noCards = true;
  await assert.rejects(settleNormalSearchFrame(f.page, {}, 'results'), /搜索/);
});

test('明确可见empty提示允许空搜索结果', async () => {
  const f = pageFixture(); f.state.noCards = true; f.state.empty = true;
  assert.equal(await settleNormalSearchFrame(f.page, {}, 'results'), f.frame);
});


test('从职位页进入搜索仅点击已观测侧栏，不goto重载主壳', async () => {
  const f = pageFixture(); f.state.pagePath = '/web/chat/job/list';
  assert.equal(await ensureInNormalSearchPage(f.page), f.frame);
  assert.equal(f.state.menuClicks, 1);
  assert.equal(f.state.gotos ?? 0, 0);
});

test('明确选岗请求的encryptJobId必须与最终结果jobId一致', async () => {
  const f = pageFixture();
  f.state.onJobClick = item => {
    f.state.job = item.textContent;
    f.handlers.get('request')({ frame: () => f.frame, url: () => 'https://www.zhipin.com/wapi/zpitem/web/boss/search/getFilterConditions.json?encryptJobId=job-abc' });
  };
  assert.equal(await selectNormalSearchJob(f.frame, '资深动画师', f.page), '资深动画师');
  f.state.onEnter = () => emitResult(f, { jobId: 'job-abc' });
  assert.equal((await runKeywordSearch(f.page, f.frame, '动捕精修', { job: '资深动画师' })).frame, f.frame);
});


test('重复同岗位搜索每次先不限再选目标，绑定新请求而不沿用缓存ID', async () => {
  const f = pageFixture({ job: '资深动画师' });
  const choices = [];
  f.state.onJobClick = item => {
    if (item.textContent === f.state.job) return;
    f.state.job = item.textContent;
    choices.push(item.textContent);
    if (item.textContent === '资深动画师') f.handlers.get('request')({ frame: () => f.frame, url: () => 'https://www.zhipin.com/wapi/zpitem/web/boss/search/getFilterConditions.json?encryptJobId=job-abc' });
  };
  for (let i = 0; i < 2; i++) {
    const selected = await prepareNormalSearchJob(f.page, f.frame, '资深动画师');
    assert.equal(selected.label, '资深动画师');
    f.state.onEnter = () => emitResult(f, { jobId: 'job-abc', change: false });
    assert.equal((await runKeywordSearch(f.page, selected.frame, '动捕精修', { job: selected.label })).frame, f.frame);
  }
  assert.deepEqual(choices, ['不限职位', '资深动画师', '不限职位', '资深动画师']);
});


test('两次相同默认搜索仍各自触发并绑定新响应，允许ID列表不变', async () => {
  const f = pageFixture({ keyword: '动捕精修' });
  let requests = 0;
  f.state.onEnter = () => { requests++; emitResult(f, { change: false }); };
  for (let i = 0; i < 2; i++) {
    const selected = await prepareNormalSearchJob(f.page, f.frame, '');
    assert.equal((await runKeywordSearch(f.page, selected.frame, '动捕精修', { job: selected.label })).frame, f.frame);
  }
  assert.equal(requests, 2);
});

test('输入框已有同词但没有本次有效响应仍须拒绝', async () => {
  const f = pageFixture({ keyword: '动捕精修' });
  await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' }), /绑定|响应/);
});


test('初始搜索form有控件但尚无卡片或empty时必须允许执行查询', async () => {
  const f = pageFixture(); f.state.noCards = true;
  assert.equal(await ensureInNormalSearchPage(f.page), f.frame);
  assert.equal(f.state.keyword, '');
});


test('合法初始form随后仍能触发绑定查询并进入结果阶段', async () => {
  const f = pageFixture(); f.state.noCards = true;
  const ready = await ensureInNormalSearchPage(f.page);
  f.state.onEnter = () => { f.state.noCards = false; emitResult(f); };
  assert.equal((await runKeywordSearch(f.page, ready, '动捕精修', { job: '不限职位' })).frame, f.frame);
});

test('业务空结果不能把尚未查询的使用说明form当作结果已应用', async () => {
  const f = pageFixture(); f.state.noCards = true;
  f.state.onEnter = () => emitResult(f, { count: 0 });
  await assert.rejects(runKeywordSearch(f.page, f.frame, '动捕精修', { job: '不限职位' }), /搜索/);
});


for (const warm of [false, true]) {
  test('公开无关键词search仅进入表单并清旧快照：' + (warm ? '暖入口' : '冷入口'), async () => {
    const f = pageFixture({ keyword: warm ? '已有关键词' : '' });
    f.state.noCards = !warm;
    f.window.__bossCliSearchSnapshot = { id: 'old-query' };
    const result = await runNormalSearch({ city: '' }, async callback => callback(f.page));
    assert.equal(result, '未提供关键词，本次仅进入搜索页，未执行查询。\n已清除旧搜索快照。请提供关键词执行 boss search <关键词>。');
    assert.doesNotMatch(result, /共.*人|搜索结果/);
    assert.equal(f.window.__bossCliSearchSnapshot, undefined);
    assert.equal(f.handlers.size, 0);
  });
}

test('本次响应核对后列表被替换，公开search不得给新列表建立快照', async () => {
  const f = pageFixture();
  let responded = false;
  let resultSettles = 0;
  f.state.onEnter = () => { emitResult(f); responded = true; };
  f.state.onIdle = () => {
    if (responded && ++resultSettles === 2) {
      f.doc.querySelectorAll('.geek-info-card')[0].__vue__.$props.geek.geekCard.encryptGeekId = 'unbound-candidate';
    }
  };
  await assert.rejects(runNormalSearch({ keyword: '动捕精修', city: '' }, async callback => callback(f.page)), /候选人ID|响应/);
  assert.equal(f.window.__bossCliSearchSnapshot, undefined);
});

test('快照采集必须在实际读取资料时核对本次响应的有序ID', async () => {
  const f = pageFixture();
  await assert.rejects(captureSearchPoolSnapshot(f.frame, ['different-response-candidate']), /候选人ID|响应/);
  assert.equal(f.window.__bossCliSearchSnapshot, undefined);
});
