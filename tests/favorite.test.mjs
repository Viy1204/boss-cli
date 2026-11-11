import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import vm from 'node:vm';
import puppeteer, { TimeoutError } from 'puppeteer-core';
import ts from 'typescript';
import * as dialog from '../dist/common/boss_greet_card_dialog.js';

const executablePath = [
  process.env.CHROME_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  ...[process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]
    .filter(Boolean).flatMap(root => [join(root, 'Google/Chrome/Application/chrome.exe'), join(root, 'Microsoft/Edge/Application/msedge.exe')]),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(path => path && existsSync(path));
const options = { skip: !executablePath && '本地未安装 Chrome/Edge', timeout: 25_000 };
let browser;
before(async () => { if (executablePath) browser = await puppeteer.launch({ executablePath, headless: true, pipe: true }); });
after(async () => { if (browser) await browser.close(); });

async function loadSource(file, imports) {
  const source = await readFile(new URL('../src/' + file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, URL, Error, process: { env: {} }, require: name => {
    assert.ok(Object.hasOwn(imports, name), '未隔离的依赖：' + name);
    return imports[name];
  } });
  return exports;
}

const browserTiming = { sleepRandom: async () => {}, RESUME_PREVIEW_OPEN_GAP_MS: { min: 0, max: 0 } };
const searchApi = await loadSource('toolset/normal-search.ts', {
  'node:crypto': { randomUUID }, 'puppeteer-core': { TimeoutError }, '../browser/index.js': browserTiming,
  '../common/boss_session_page.js': {}, '../common/boss_greet_card_dialog.js': dialog,
});
const cardsApi = await loadSource('toolset/recommend.ts', {
  'node:crypto': { randomUUID }, 'puppeteer-core': { TimeoutError }, '../browser/index.js': browserTiming,
  '../common/boss_session_page.js': {}, '../common/ensure_page.js': {},
});

const captureApi = await loadSource('common/c_resume_capture.ts', {
  'node:fs/promises': {}, '../browser/human_delay.js': {},
  '../browser/timing.js': { sleepRandom: async () => {} }, '../browser/viewport_temp.js': {},
});

const frameScript = source => `(() => {
  const source = ${JSON.stringify(source)};
  const state = parent.__fixture;
  const list = document.querySelector('.card-list');
  const view = document.querySelector('.list-wrap.card-list-wrap');
  view.__vue__ = { $props: { loading: false, finished: true, error: false } };
  list.__vue__ = { $props: { pageList: [] } };
  window.renderCards = () => {
    list.replaceChildren();
    const people = source === 'favorites' ? state.people.filter(person => state.saved[person.id]) : state.people;
    list.__vue__.$props.pageList = people;
    people.forEach(person => {
      const outer = document.createElement('div'); outer.className = 'card-item';
      const card = document.createElement('div'); card.className = source === 'search' ? 'geek-info-card' : 'candidate-card-wrap';
      card.innerHTML = '<div class="card-inner"><div class="name-wrap"><span class="name name-label"></span></div><div class="info-detail">工程师</div><div class="base-info"><span>本科 5年</span></div><div class="work-exps"><div class="timeline-item"><div class="join-text-wrap time"><span>2020</span><span>至今</span></div><div class="join-text-wrap content"><span>示例公司</span><span>工程师</span></div></div></div><div class="work-exp-box"><div class="work-exp-item"><span class="date">2020-至今</span><span class="t-tooltip-slot">示例公司 工程师</span></div></div></div><button class="btn-getcontact">联系Ta</button>';
      card.querySelector('.name').textContent = person.name;
      card.__vue__ = source === 'search' ? { $props: { geek: { geekCard: { encryptGeekId: person.id } } } }
        : { $el: card, $options: { name: 'RecommendCandidateCard' }, $children: [], $props: { geekInfo: { encryptGeekId: person.id, geekName: person.name }, status: source === 'favorites' ? 9 : 0 } };
      const open = () => {
        state.opens.push({ source, id: person.id });
        const doc = source === 'search' ? parent.document : document;
        const wrapper = doc.createElement('div');
        wrapper.className = 'boss-popup__wrapper boss-dialog boss-dialog__wrapper dialog-lib-resume anonymousV2';
        wrapper.style.cssText = 'position:absolute;top:0;left:0;width:900px;min-height:650px;z-index:10;background:white';
        const close = doc.createElement('button'); close.className = 'close-btn'; close.textContent = '关闭';
        close.onclick = () => { if (!state.closeBlocked) wrapper.remove(); };
        const resume = doc.createElement('iframe');
        resume.src = '/web/frame/c-resume/?source=' + source;
        resume.style.cssText = 'width:773px;height:2772px';
        const root = doc.createElement('div'); root.className = 'resume-simple-box';
        root.innerHTML = '<div class="like-icon-and-text"><div class="like-icon"></div><div class="btn-text"></div></div>';
        const props = source === 'search' ? { geekInfo: { encryptGeekId: state.detailId || person.id }, alreadyInterested: state.saved[person.id] ? 1 : 0 }
          : { personInfo: { encryptGeekId: state.detailId || person.id, enshrineGeek: !!state.saved[person.id] } };
        root.__vue__ = { $props: props, $data: { enshrineGeek: !!state.saved[person.id], isLikeLoading: false } };
        const icon = root.querySelector('.like-icon');
        const paint = () => {
          const saved = source === 'search' ? props.alreadyInterested === 1 : root.__vue__.$data.enshrineGeek;
          icon.classList.toggle('like-icon-active', saved);
          root.querySelector('.btn-text').textContent = saved ? '已收藏' : '收藏';
        };
        paint();
        icon.onclick = () => {
          state.favoriteClicks.push(person.id);
          if (state.behavior === 'ignore') return;
          if (state.behavior === 'loading') { root.__vue__.$data.isLikeLoading = true; return; }
          state.saved[person.id] = !state.saved[person.id];
          if (source === 'search') props.alreadyInterested = state.saved[person.id] ? 1 : 0;
          else root.__vue__.$data.enshrineGeek = state.saved[person.id];
          paint();
          if (state.behavior === 'unknown') {
            if (source === 'search') props.alreadyInterested = null;
            else root.__vue__.$data.enshrineGeek = null;
          }
          if (state.behavior === 'wrong-detail') {
            if (source === 'search') props.geekInfo.encryptGeekId = 'different-person';
            else props.personInfo.encryptGeekId = 'different-person';
          }
          if (state.behavior === 'remove-row') {
            outer.remove(); list.__vue__.$props.pageList = list.__vue__.$props.pageList.filter(row => row.id !== person.id);
            view.__vue__.$props.loading = true;
          }
        };
        wrapper.append(close, root, resume);
        doc.body.append(wrapper);
        state.onOpen?.(window, root);
      };
      card.querySelector(source === 'search' ? '.name-label' : '.card-inner').onclick = open;
      card.querySelector('button').onclick = () => state.contacts++;
      outer.append(card); list.append(outer);
    });
  };
  document.querySelector('li.tab-item').onclick = () => {
    state.listRefreshes++;
    document.querySelector('li.tab-item').classList.add('curr');
    view.__vue__.$props.loading = true;
    setTimeout(() => {
      renderCards();
      view.__vue__.$props.loading = false;
      if (state.listError) view.__vue__.$props.error = true;
      if (state.unfinished) view.__vue__.$props.finished = false;
      if (state.countMismatch) list.__vue__.$props.pageList.push({ id: 'not-rendered' });
    }, 25);
  };
  renderCards();
  window.__fixtureReady = true;
})()`;

async function fixture(t, source = 'search', { pendingFrameUrls = [] } = {}) {
  const page = await browser.newPage();
  t.after(() => page.close());
  await page.setRequestInterception(true);
  const routes = { search: '/web/chat/search', recommend: '/web/chat/recommend', favorites: '/web/chat/interaction' };
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== 'https://www.zhipin.com') { void request.abort(); return; }
    let html;
    if (Object.values(routes).includes(url.pathname)) {
      html = '<!doctype html><meta charset="utf-8"><style>iframe{width:900px;height:650px}.resume-simple-box{width:300px;height:180px}.like-icon{width:24px;height:24px}</style><div class="menu-list"><a href="/web/chat/interaction">互动</a></div>' +
        '<script>window.__fixture={people:[{id:"candidate-1",name:"张**"},{id:"candidate-2",name:"张**"},{id:"candidate-3",name:"李四"}],saved:' + JSON.stringify(source === 'favorites' ? { 'candidate-1': true, 'candidate-2': true } : {}) + ',opens:[],favoriteClicks:[],contacts:0,listRefreshes:0};</script>' +
        '<iframe name="searchFrame" src="/web/frame/search"></iframe><iframe name="recommendFrame" src="/web/frame/recommend/"></iframe><iframe name="interactionFrame" src="/web/frame/recommend/interaction"></iframe>' +
        '<script>window.route=()=>{for(const f of document.querySelectorAll("iframe"))f.style.display=(f.name===(location.pathname.endsWith("search")?"searchFrame":location.pathname.endsWith("recommend")?"recommendFrame":"interactionFrame"))?"block":"none"};document.querySelector("a").onclick=e=>{e.preventDefault();history.pushState({},"","/web/chat/interaction");route()};route();</script>';
    } else if (url.pathname === '/web/frame/c-resume/') {
      html = '<!doctype html><meta charset="utf-8"><body>离线简历正文</body>';
    } else {
      const frameSource = url.pathname === '/web/frame/search' ? 'search' : url.pathname === '/web/frame/recommend/' ? 'recommend' : url.pathname === '/web/frame/recommend/interaction' ? 'favorites' : null;
      if (!frameSource) { void request.abort(); return; }
      html = '<!doctype html><meta charset="utf-8"><style>.candidate-card-wrap,.geek-info-card{width:600px;min-height:80px}.resume-simple-box{width:300px;height:180px}.like-icon{width:24px;height:24px}</style><input class="search-input"><div class="job-selecter-wrap"><span class="ui-dropmenu-label">工程师</span></div><li class="tab-item curr" title="收藏牛人">收藏牛人</li><div class="list-wrap card-list-wrap"><div class="card-list"></div></div><script>' + frameScript(frameSource) + '</script>';
    }
    void request.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
  });
  await page.goto('https://www.zhipin.com' + routes[source]);
  for (const frame of page.frames().filter(frame => frame !== page.mainFrame())) await frame.waitForFunction('window.__fixtureReady === true');
  const shorten = target => new Proxy(target, { get(object, key) {
    if (key === 'waitForFunction') return (script, settings) => object.waitForFunction(script, { ...settings, timeout: settings?.timeout === 8_000 ? 350 : Math.min(settings?.timeout ?? 18_000, 2_000) });
    if (key === 'waitForSelector') return async (selector, settings) => {
      const handle = await object.waitForSelector(selector, settings);
      if (!handle || !selector.startsWith('iframe[')) return handle;
      return new Proxy(handle, { get(element, property) {
        if (property === 'contentFrame') return async () => {
          const frame = await element.contentFrame();
          const pendingUrl = pendingFrameUrls.shift();
          if (!frame || pendingUrl === undefined) return frame;
          return new Proxy(frame, { get(current, field) {
            if (field === 'url') return () => pendingUrl;
            const value = Reflect.get(current, field);
            return typeof value === 'function' ? value.bind(current) : value;
          } });
        };
        const value = Reflect.get(element, property);
        return typeof value === 'function' ? value.bind(element) : value;
      } });
    };
    const value = Reflect.get(object, key);
    return typeof value === 'function' ? value.bind(object) : value;
  } });
  const api = await loadSource('toolset/favorite.ts', {
    '../common/boss_session_page.js': { withBossSessionPage: callback => callback(shorten(page)) },
    '../common/boss_greet_card_dialog.js': dialog,
    '../common/c_resume_capture.js': captureApi,
    './normal-search.js': { ...searchApi, assertNormalSearchPageReadyForPreview: async current => shorten(await searchApi.assertNormalSearchPageReadyForPreview(current)) },
    './recommend.js': { ...cardsApi,
      assertRecommendPageReady: async (current, action) => shorten(await cardsApi.assertRecommendPageReady(current, action)),
      getCandidateListFrame: async (current, list) => shorten(await cardsApi.getCandidateListFrame(current, list)),
    },
  });
  const frame = page.frames().find(frame => frame.name() === ({ search: 'searchFrame', recommend: 'recommendFrame', favorites: 'interactionFrame' })[source]);
  const seed = async () => {
    if (source === 'search') await searchApi.captureSearchPoolSnapshot(frame);
    else if (source === 'recommend') await cardsApi.readRecommendList(frame);
    else await api.runFavorite({ kind: 'list' });
  };
  const set = (desired = 'saved', candidateTarget = '', candidateIndex = 2) => api.runFavorite({ kind: 'set', candidateTarget, candidateIndex, desired });
  const residue = async () => ({
    details: await page.evaluate('document.querySelectorAll(".resume-simple-box").length') + await frame.evaluate('document.querySelectorAll(".resume-simple-box").length'),
    iframes: await captureApi.countVisibleCResumeIframes(page),
  });
  return { page, frame, api, seed, set, residue, state: () => page.evaluate('JSON.parse(JSON.stringify(window.__fixture))') };
}

for (const source of ['search', 'recommend', 'favorites']) {
  test(source + ' 同名必须指定序号，姓名与序号冲突时零点击', options, async t => {
    const f = await fixture(t, source); await f.seed();
    await assert.rejects(f.api.runFavorite({ kind: 'set', candidateTarget: '张**', desired: 'saved' }), /唯一/);
    await assert.rejects(f.set('saved', '李四', 2), /冲突|不匹配/);
    assert.deepEqual((await f.state()).opens, []);
    await f.set('saved', '张**', 2);
    assert.deepEqual((await f.state()).opens, [{ source, id: 'candidate-2' }]);
    assert.equal((await f.state()).contacts, 0);
  });

  test(source + ' 唯一姓名可不带序号定位', options, async t => {
    const f = await fixture(t, source);
    if (source === 'favorites') await f.page.evaluate('window.__fixture.saved["candidate-1"] = false');
    await f.seed();
    const result = await f.api.runFavorite({ kind: 'set', candidateTarget: source === 'favorites' ? '张**' : '李四', desired: 'saved' });
    assert.match(result, /已收藏/);
    assert.deepEqual((await f.state()).opens, [{ source, id: source === 'favorites' ? 'candidate-2' : 'candidate-3' }]);
  });

  test(source + ' 缺失、过期、换序与资料变化的快照拒绝写入', options, async t => {
    const f = await fixture(t, source);
    await assert.rejects(f.set(), /快照/);
    await f.seed();
    await f.frame.evaluate('Date.now = (() => { const now = Date.now.bind(Date); return () => now() + 16 * 60 * 1000; })()');
    await assert.rejects(f.set(), /15 分钟/);
    await f.seed();
    await f.frame.evaluate('document.querySelector(".card-list").prepend(document.querySelector(".card-list").lastElementChild)');
    await assert.rejects(f.set(), /顺序|快照/);
    await f.seed();
    await f.frame.evaluate('document.querySelector(".name").textContent = "改变的姓名"');
    await assert.rejects(f.set(), /身份|快照/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
  });

  test(source + ' 详情换人或详情打开后来源换人均不点击收藏', options, async t => {
    const f = await fixture(t, source); await f.seed();
    await f.page.evaluate('window.__fixture.detailId = "different-person"');
    await assert.rejects(f.set(), /标识|不一致/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
    await f.page.evaluate('window.__fixture.detailId = null; window.__fixture.onOpen = frame => { const card = frame.document.querySelector(".geek-info-card, .candidate-card-wrap"); const props = card.__vue__.$props; if (props.geek) props.geek.geekCard.encryptGeekId = "changed-person"; else props.geekInfo.encryptGeekId = "changed-person"; }');
    await assert.rejects(f.set(), /身份|快照/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
  });

  test(source + ' 收藏与取消均按终态幂等', options, async t => {
    const f = await fixture(t, source); await f.seed();
    const initial = (await f.state()).favoriteClicks.length;
    await f.set('saved'); await f.set('saved');
    const afterSave = (await f.state()).favoriteClicks.length;
    assert.equal(afterSave - initial, source === 'favorites' ? 0 : 1);
    await f.set('unsaved');
    if (source === 'favorites') await f.api.runFavorite({ kind: 'list' });
    if (source !== 'favorites') await f.set('unsaved');
    assert.equal((await f.state()).favoriteClicks.length - afterSave, 1);
    assert.equal((await f.state()).saved['candidate-2'], false);
  });
}

for (const behavior of ['ignore', 'unknown', 'wrong-detail', 'loading']) {
  test('推荐点击后结果未确认不成功且不重试：' + behavior, options, async t => {
    const f = await fixture(t, 'recommend'); await f.seed();
    await f.page.evaluate('window.__fixture.behavior = ' + JSON.stringify(behavior));
    await assert.rejects(f.set(), /未能确认收藏结果/);
    assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  });
}

test('隐藏旧详情不能覆盖当前可见详情', options, async t => {
  for (const source of ['search', 'recommend']) {
    const f = await fixture(t, source); await f.seed();
    await f.page.evaluate('window.__fixture.onOpen = (_frame, root) => { const old = root.cloneNode(true); old.style.display = "none"; old.__vue__ = { $props: { geekInfo: { encryptGeekId: "old-person" }, personInfo: { encryptGeekId: "old-person" } } }; root.parentElement.prepend(old); }');
    assert.match(await f.set(), /已收藏/);
    assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
  }
});

test('未知收藏状态在点击前拒绝', options, async t => {
  const f = await fixture(t, 'recommend'); await f.seed();
  await f.page.evaluate('window.__fixture.onOpen = (_frame, root) => { root.__vue__.$data.enshrineGeek = "false"; }');
  await assert.rejects(f.set(), /状态未知/);
  assert.deepEqual((await f.state()).favoriteClicks, []);
});

test('写入前 frame 换绑和主页面变化均拒绝', options, async t => {
  for (const change of [
    'frame.frameElement.name = "replacedFrame"',
    'frame.parent.history.pushState({}, "", "/web/chat/index")',
  ]) {
    const f = await fixture(t, 'recommend'); await f.seed();
    await f.page.evaluate('window.__fixture.onOpen = frame => { ' + change + '; }');
    await assert.rejects(f.set(), /frame|主页面/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
  }
});

test('收藏列表读取真实来源并在已选中时再次刷新', options, async t => {
  const f = await fixture(t, 'favorites');
  const first = await f.api.runFavorite({ kind: 'list' });
  assert.match(first, /当前已加载 2 人/);
  assert.match(first, /1\. 张\*\*[\s\S]*2\. 张\*\*/);
  assert.equal((await f.state()).listRefreshes, 1);
  await f.page.evaluate('window.__fixture.saved["candidate-3"] = true');
  const second = await f.api.runFavorite({ kind: 'list' });
  assert.match(second, /当前已加载 3 人[\s\S]*3\. 李四/);
  assert.equal((await f.state()).listRefreshes, 2);
});

test('收藏列表挂载后短暂空白会等待真实结果', options, async t => {
  const f = await fixture(t, 'favorites');
  await f.frame.evaluate(`(() => {
    const list = document.querySelector('.card-list');
    const view = document.querySelector('.list-wrap.card-list-wrap').__vue__.$props;
    document.querySelector('li.tab-item').onclick = () => {
      parent.__fixture.listRefreshes++;
      list.replaceChildren();
      list.__vue__.$props.pageList = [];
      view.loading = false;
      view.finished = false;
      setTimeout(() => {
        window.renderCards();
        view.finished = true;
      }, 150);
    };
  })()`);
  assert.match(await f.api.runFavorite({ kind: 'list' }), /当前已加载 2 人/);
  assert.deepEqual((await f.state()).favoriteClicks, []);
});

test('收藏列表可从其他主壳页进入，空态须平台确认完成', options, async t => {
  const f = await fixture(t, 'search');
  assert.match(await f.api.runFavorite({ kind: 'list' }), /列表为空.*加载完成/);
  assert.equal(new URL(f.page.url()).pathname, '/web/chat/interaction');
  assert.deepEqual((await f.state()).favoriteClicks, []);
  await f.page.evaluate('window.__fixture.unfinished = true');
  await assert.rejects(f.api.runFavorite({ kind: 'list' }), /未加载完成|空列表/);
});

test('收藏列表未加载全量明确说明，加载错误或DOM数目失配拒绝成功', options, async t => {
  const f = await fixture(t, 'favorites');
  await f.page.evaluate('window.__fixture.unfinished = true');
  assert.match(await f.api.runFavorite({ kind: 'list' }), /尚有未加载结果/);
  await f.page.evaluate('window.__fixture.listError = true');
  await assert.rejects(f.api.runFavorite({ kind: 'list' }), /加载出错/);
  await assert.rejects(f.set('unsaved'), /快照/);
  const mismatch = await fixture(t, 'favorites');
  await mismatch.page.evaluate('window.__fixture.countMismatch = true');
  await assert.rejects(mismatch.api.runFavorite({ kind: 'list' }), /timeout|Waiting failed/i);
});

test('卡片重绘为包装组件后仍绑定同一拥有者且重复收藏不反转', options, async t => {
  for (const source of ['recommend', 'favorites']) {
    const f = await fixture(t, source); await f.seed();
    await f.set('saved');
    await f.frame.evaluate(`(() => {
      for (const card of document.querySelectorAll('.candidate-card-wrap')) {
        const owner = card.__vue__;
        card.__vue__ = {
          $el: card, $options: {}, $children: [owner],
          $props: { geekInfo: {}, status: owner.$props.status },
        };
      }
    })()`);
    assert.match(await f.set('saved'), /原状态已满足/);
    assert.deepEqual((await f.state()).favoriteClicks, source === 'recommend' ? ['candidate-2'] : []);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  }
});

test('候选组件拥有者不唯一或不属于该DOM时拒绝收藏', options, async t => {
  for (const source of ['recommend', 'favorites']) {
    const f = await fixture(t, source); await f.seed();
    await f.frame.evaluate(`(() => {
      const cards = document.querySelectorAll('.candidate-card-wrap');
      const card = cards[1];
      const owner = card.__vue__;
      card.__vue__ = { $el: card, $options: {}, $children: [owner, { ...owner }] };
    })()`);
    await assert.rejects(f.set());
    await f.frame.evaluate(`(() => {
      const cards = document.querySelectorAll('.candidate-card-wrap');
      cards[1].__vue__.$children = [cards[0].__vue__];
    })()`);
    await assert.rejects(f.set());
    assert.deepEqual((await f.state()).favoriteClicks, []);
  }
});

test('推荐列表仍在加载时不创建空快照', options, async t => {
  const f = await fixture(t, 'recommend');
  await f.frame.evaluate(`(() => {
    const list = document.querySelector('.card-list');
    const view = document.querySelector('.list-wrap.card-list-wrap').__vue__.$props;
    list.replaceChildren();
    list.__vue__.$props.pageList = [];
    view.loading = true;
    view.finished = false;
    setTimeout(() => {
      window.renderCards();
      view.loading = false;
    }, 150);
  })()`);
  await f.seed();
  assert.match(await f.set(), /已收藏/);
  assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
});

test('推荐卡片先挂载后补齐身份时等待可用快照', options, async t => {
  const f = await fixture(t, 'recommend');
  await f.frame.evaluate(`(() => {
    const props = document.querySelectorAll('.candidate-card-wrap')[1].__vue__.$props.geekInfo;
    const id = props.encryptGeekId;
    props.encryptGeekId = '';
    setTimeout(() => { props.encryptGeekId = id; }, 150);
  })()`);
  await f.seed();
  assert.match(await f.set(), /已收藏/);
  assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
});

test('连续两次公开收藏命令均成功且不堆叠详情', options, async t => {
  for (const source of ['search', 'recommend']) {
    const f = await fixture(t, source); await f.seed();
    assert.match(await f.set(), /已收藏/);
    assert.match(await f.set(), /已收藏/);
    assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  }
});

for (const source of ['recommend', 'favorites']) {
  test(source + ' 初始化空frame URL等待就绪后完成公开命令', options, async t => {
    const f = await fixture(t, source === 'favorites' ? 'search' : source, { pendingFrameUrls: ['', 'about:blank'] });
    if (source === 'recommend') {
      await f.seed();
      assert.match(await f.set(), /已收藏/);
    } else {
      assert.match(await f.api.runFavorite({ kind: 'list' }), /收藏牛人列表为空/);
    }
  });
}

test('新收藏命令先关净已有多个简历遮罩', options, async t => {
  for (const source of ['search', 'recommend', 'favorites']) {
    const f = await fixture(t, source); await f.seed();
    await f.frame.evaluate('document.querySelector(".name-label").click(); document.querySelector(".name-label").click()');
    assert.equal((await f.residue()).details, 2);
    assert.match(await f.set(), /已收藏/);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
    assert.deepEqual((await f.state()).favoriteClicks, source === 'favorites' ? [] : ['candidate-2']);
  }
});

test('收藏列表导航前关闭已有简历遮罩', options, async t => {
  const f = await fixture(t, 'search');
  await f.frame.evaluate('document.querySelector(".name-label").click()');
  assert.match(await f.api.runFavorite({ kind: 'list' }), /收藏牛人列表为空/);
  assert.equal(new URL(f.page.url()).pathname, '/web/chat/interaction');
  assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  assert.deepEqual((await f.state()).favoriteClicks, []);
});

test('已有遮罩关不净时不打开新详情或导航', options, async t => {
  const f = await fixture(t, 'search'); await f.seed();
  await f.frame.evaluate('parent.__fixture.closeBlocked = true; document.querySelector(".name-label").click()');
  await assert.rejects(f.set(), /已有在线简历弹层关闭失败/);
  await assert.rejects(f.api.runFavorite({ kind: 'list' }), /已有在线简历弹层关闭失败/);
  assert.equal(new URL(f.page.url()).pathname, '/web/chat/search');
  assert.equal((await f.state()).opens.length, 1);
  assert.deepEqual((await f.state()).favoriteClicks, []);
});

test('已确认收藏或取消后关闭失败保留真实操作事实', options, async t => {
  for (const desired of ['saved', 'unsaved']) {
    const f = await fixture(t, desired === 'saved' ? 'search' : 'favorites'); await f.seed();
    await f.page.evaluate('window.__fixture.onOpen = () => { window.__fixture.closeBlocked = true; }');
    await assert.rejects(f.set(desired), error => {
      assert.match(error.message, desired === 'saved' ? /已收藏（已确认）/ : /已取消收藏（已确认）/);
      assert.match(error.message, /关闭在线简历弹层失败/);
      return true;
    });
    assert.equal((await f.state()).saved['candidate-2'], desired === 'saved');
    assert.deepEqual((await f.state()).favoriteClicks, ['candidate-2']);
  }
});

test('原操作错误与详情关闭错误均保留', options, async t => {
  const f = await fixture(t, 'recommend'); await f.seed();
  await f.page.evaluate('window.__fixture.onOpen = (_frame, root) => { window.__fixture.closeBlocked = true; root.__vue__.$data.enshrineGeek = null; }');
  await assert.rejects(f.set(), error => {
    assert.match(error.message, /收藏状态未知/);
    assert.match(error.message, /关闭在线简历弹层失败/);
    assert.equal(error.cause.errors.length, 2);
    assert.match(error.cause.errors[0].message, /收藏状态未知/);
    return true;
  });
  assert.deepEqual((await f.state()).favoriteClicks, []);
});

test('本次打开出现多个可见错人详情仍拒绝并关闭', options, async t => {
  for (const source of ['search', 'recommend']) {
    const f = await fixture(t, source); await f.seed();
    await f.page.evaluate('window.__fixture.onOpen = (_frame, root) => { const other = root.cloneNode(true); other.__vue__ = { $props: { geekInfo: { encryptGeekId: "other-person" }, personInfo: { encryptGeekId: "other-person" } } }; root.parentElement.append(other); }');
    await assert.rejects(f.set(), /多个可见候选人详情/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  }
});

for (const source of ['recommend', 'favorites']) {
  test(source + ' 非空无效frame URL明确报错且不操作收藏', options, async t => {
    const f = await fixture(t, source === 'favorites' ? 'search' : source, { pendingFrameUrls: ['not-a-valid-url'] });
    await f.seed();
    await assert.rejects(source === 'recommend' ? f.set() : f.api.runFavorite({ kind: 'list' }), /frame URL 无效：not-a-valid-url/);
    assert.deepEqual((await f.state()).favoriteClicks, []);
    assert.deepEqual(await f.residue(), { details: 0, iframes: 0 });
  });
}

test('收藏取消可确认本次列表移除，旧编号必须重读后才能再使用', options, async t => {
  const f = await fixture(t, 'favorites'); await f.seed();
  await f.page.evaluate('window.__fixture.behavior = "remove-row"');
  assert.match(await f.set('unsaved', '张**', 1), /已取消收藏/);
  await assert.rejects(f.set('unsaved', '', 1), /快照/);
  assert.deepEqual((await f.state()).favoriteClicks, ['candidate-1']);
  assert.match(await f.api.runFavorite({ kind: 'list' }), /当前已加载 1 人/);
  await f.set('unsaved', '张**', 1);
  assert.deepEqual((await f.state()).favoriteClicks, ['candidate-1', 'candidate-2']);
});
