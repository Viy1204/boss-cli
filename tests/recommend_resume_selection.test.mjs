import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

async function fixture() {
  const state = { clicks: [], now: Date.now(), job: '工程师' };
  class Element {
    constructor(text = '') {
      this.textContent = text;
      this.className = '';
      this.style = { display: 'block', visibility: 'visible', opacity: '1' };
      this.classList = { contains: value => this.className.split(/\s+/).includes(value) };
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getAttribute() { return null; }
    matches() { return false; }
    scrollIntoView() {}
    click() {}
  }
  const makeTimeline = (dates, details) => {
    const row = new Element();
    row.dates = dates.map(value => new Element(value));
    row.details = details.map(value => new Element(value));
    row.querySelectorAll = selector => selector === '.join-text-wrap.time span' ? row.dates
      : selector === '.join-text-wrap.content span' ? row.details : [];
    return row;
  };
  const makeCard = (id, name) => {
    const card = new Element();
    card.matches = selector => selector === '.candidate-card-wrap';
    card.name = new Element(name);
    card.basic = new Element('本科 5年');
    card.work = makeTimeline(['2020', '至今'], ['A公司', '工程师']);
    card.education = makeTimeline(['2016', '2020'], ['A大学', '计算机', '本科']);
    card.inner = new Element();
    card.inner.id = id;
    card.inner.getAttribute = key => key === 'data-geekid' ? card.inner.id : null;
    card.inner.click = () => { state.clicks.push(id); card.className = 'has-viewed'; };
    card.querySelector = selector => {
      if (selector === '.card-inner') return card.inner;
      if (selector === '.name-wrap .name' || selector === '.name') return card.name;
      return null;
    };
    card.querySelectorAll = selector => {
      if (selector === '.base-info span') return [card.basic];
      if (selector === '.work-exps .timeline-item') return [card.work];
      if (selector === '.edu-exps .timeline-item') return [card.education];
      return [];
    };
    card.outer = new Element();
    card.outer.querySelector = selector => selector === '.candidate-card-wrap' ? card : card.querySelector(selector);
    card.outer.querySelectorAll = selector => card.querySelectorAll(selector);
    return card;
  };
  state.cards = [makeCard('candidate-1', '张**'), makeCard('candidate-2', '张**'), makeCard('candidate-3', '李四')];
  const document = {
    querySelector: selector => selector === '.job-selecter-wrap .ui-dropmenu-label' ? new Element(state.job) : null,
    querySelectorAll: selector => {
      if (selector === '.candidate-card-wrap') return state.cards;
      if (selector === '.candidate-card-wrap:not(.anonymous-geek-guide-card)') return state.cards.filter(card => !card.classList.contains('anonymous-geek-guide-card'));
      if (selector.includes('.candidate-card-wrap') && selector.includes('.card-item')) return state.cards.flatMap(card => [card.outer, card]);
      return [];
    },
  };
  const window = { getComputedStyle: el => el.style, location: new URL('https://www.zhipin.com/web/frame/recommend/') };
  const context = vm.createContext({ document, window, HTMLElement: Element, Date: { now: () => state.now } });
  const frame = { evaluate: async script => vm.runInContext(script, context) };
  const source = await readFile(new URL('../src/toolset/recommend.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const imports = {
    'puppeteer-core': { TimeoutError: Error },
    '../browser/index.js': { sleepRandom: async () => {}, RESUME_PREVIEW_OPEN_GAP_MS: { min: 0, max: 0 } },
    '../common/boss_session_page.js': {},
    '../common/ensure_page.js': {},
  };
  const exports = {};
  vm.runInNewContext(outputText, { exports, URL, require: id => {
    assert.ok(Object.hasOwn(imports, id), '未隔离的依赖：' + id);
    return imports[id];
  } });
  return { state, frame, api: exports, makeCard, window };
}

const read = f => f.api.readRecommendList(f.frame);
const preview = (f, target = '', index) => f.api.openRecommendResumePreview(f.frame, target, index);

test('推荐嵌套父子卡片只列出每人一次，来源分组沿用全局序号', async () => {
  const f = await fixture();
  const rows = await read(f);
  assert.equal(rows.length, 3);
  f.api.markGreetProduced([], [rows[1]]);
  const text = f.api.renderRecommendList(rows);
  assert.match(text, /共 3 人/);
  assert.match(text, /常规推荐[\s\S]*1\. 张\*\*[\s\S]*3\. 李四/);
  assert.match(text, /打招呼产生的推荐[\s\S]*2\. 张\*\*/);
});

test('推荐跳转搜索引导卡不计入候选人、不占序号也不进入预览快照', async () => {
  const f = await fixture();
  const guide = f.makeCard('', '张**');
  guide.className = 'candidate-card-wrap anonymous-geek-guide-card';
  guide.inner = null;
  f.state.cards.splice(1, 0, guide);
  const rows = await read(f);
  assert.equal(rows.length, 3);
  assert.deepEqual(Array.from(rows, row => row.index), [1, 2, 3]);
  const selected = await preview(f, '张**', 2);
  assert.equal(selected.index, 2);
  assert.deepEqual(f.state.clicks, ['candidate-2']);
  guide.name.textContent = '热搜牛人推荐 查看更多';
  await preview(f, '李四', 3);
  assert.deepEqual(f.state.clicks, ['candidate-2', 'candidate-3']);
});

test('推荐时间线输出完整工作与教育日期、公司、院校和专业', async () => {
  const f = await fixture();
  const rows = await read(f);
  const text = f.api.renderRecommendList(rows);
  assert.match(text, /工作[^\n]*2020-至今 A公司 · 工程师/);
  assert.match(text, /教育[^\n]*2016-2020 A大学 · 计算机 · 本科/);
});

test('推荐同名必须指定序号，第二人预览不触发第一人', async () => {
  const f = await fixture();
  await read(f);
  await assert.rejects(preview(f, '张**'), /唯一|同名|多个/);
  assert.deepEqual(f.state.clicks, []);
  const selected = await preview(f, '张**', 2);
  assert.equal(selected.name, '张**');
  assert.equal(selected.index, 2);
  assert.deepEqual(f.state.clicks, ['candidate-2']);
});

test('推荐索引和姓名冲突、越界或非法时零点击', async () => {
  const f = await fixture();
  await read(f);
  await assert.rejects(preview(f, '李四', 2), /不匹配|冲突/);
  for (const index of [0, -1, 1.5, 4, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(preview(f, '', index), /序号|index/);
  }
  assert.deepEqual(f.state.clicks, []);
});

test('推荐预览要求已有且未过期的列表快照', async () => {
  const f = await fixture();
  await assert.rejects(preview(f, '李四'), /快照/);
  await read(f);
  f.state.now += 15 * 60 * 1000 + 1;
  await assert.rejects(preview(f, '', 3), /15 分钟|过期/);
  assert.deepEqual(f.state.clicks, []);
});

test('推荐顺序变化或相同资料的DOM重建后拒绝预览', async () => {
  const reordered = await fixture();
  await read(reordered);
  reordered.state.cards.reverse();
  await assert.rejects(preview(reordered, '', 1), /快照|顺序|身份/);
  assert.deepEqual(reordered.state.clicks, []);
  const rebuilt = await fixture();
  await read(rebuilt);
  rebuilt.state.cards[1] = rebuilt.makeCard('candidate-2', '张**');
  await assert.rejects(preview(rebuilt, '', 2), /快照|顺序|身份/);
  assert.deepEqual(rebuilt.state.clicks, []);
});

test('推荐平台ID、工作教育日期、院校或岗位变化后拒绝预览', async () => {
  for (const change of [
    f => { f.state.cards[1].inner.id = 'other-candidate'; },
    f => { f.state.cards[1].work.dates[0].textContent = '2021'; },
    f => { f.state.cards[1].work.details[0].textContent = 'B公司'; },
    f => { f.state.cards[1].education.dates[0].textContent = '2015'; },
    f => { f.state.cards[1].education.details[0].textContent = 'B大学'; },
    f => { f.state.job = '设计师'; },
  ]) {
    const f = await fixture();
    await read(f);
    change(f);
    await assert.rejects(preview(f, '', 2), /快照|资料|岗位|身份/);
    assert.deepEqual(f.state.clicks, []);
  }
});

test('推荐卡片滚入视口时被替换，点击前仍拒绝失配身份', async () => {
  const f = await fixture();
  await read(f);
  f.state.cards[1].inner.scrollIntoView = () => { f.state.cards[1].inner.id = 'other-candidate'; };
  await assert.rejects(preview(f, '', 2), /快照|资料|身份/);
  assert.deepEqual(f.state.clicks, []);
});

test('推荐预览产生has-viewed和样式变化不使快照失效', async () => {
  const f = await fixture();
  await read(f);
  await preview(f, '', 2);
  f.state.cards[0].className = 'candidate-card-wrap has-viewed selected';
  await preview(f, '', 3);
  assert.deepEqual(f.state.clicks, ['candidate-2', 'candidate-3']);
});

test('推荐平台ID缺失时拒绝创建可用快照，不改用姓名', async () => {
  const f = await fixture();
  f.state.cards[0].inner.id = '';
  await assert.rejects(read(f), /标识|ID|data-geekid/);
  await assert.rejects(preview(f, '', 1), /快照/);
  assert.deepEqual(f.state.clicks, []);
});

test('推荐iframe刷新丢失快照后拒绝沿用序号', async () => {
  const f = await fixture();
  await read(f);
  delete f.window.__bossCliRecommendSnapshot;
  await assert.rejects(preview(f, '', 2), /快照/);
  assert.deepEqual(f.state.clicks, []);
});

test('重新读取推荐列表失败后不得复用先前快照', async () => {
  const f = await fixture();
  await read(f);
  f.state.cards[1].inner.id = 'candidate-1';
  await assert.rejects(read(f), /标识重复|ID重复/);
  f.state.cards[1].inner.id = 'candidate-2';
  await assert.rejects(preview(f, '', 2), /快照/);
  assert.deepEqual(f.state.clicks, []);
});
