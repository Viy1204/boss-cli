import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import * as searchPool from '../dist/toolset/normal-search.js';
import { greetSearchPoolOnPage, searchPoolDialogFunding } from '../dist/toolset/normal-search.js';
import { greetOnPage } from '../dist/toolset/greet.js';

// 仅在本测试进程缩短人类操作间隔，不启动浏览器、不访问网络。
const realTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms, ...args) => realTimeout(fn, 0, ...args);
test.after(() => { globalThis.setTimeout = realTimeout; });

function fixture(config = {}) {
  const state = { mode: config.initialCard ? 'card' : 'account', dialog: null, switches: [], confirms: 0, contacts: 0, contactIndices: [], cancels: 0, detail: false, url: 'https://www.zhipin.com/web/chat/search' };
  class El {
    constructor(text = '', cls = '') { this.textContent = text; this.className = cls; this.disabled = false; this.style = { display: 'block', visibility: 'visible', opacity: '1' }; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getAttribute(name) { return name === 'disabled' && this.disabled ? '' : null; }
    getBoundingClientRect() { return { width: 300, height: 300 }; }
    scrollIntoView() {}
    click() {}
    dispatchEvent(e) { if (e.type === 'click') this.click(); }
  }
  const name = new El('张**'); name.click = () => {
    state.detail = true;
    if (config.afterDetail) config.afterDetail(state);
  };
  const summary = new El('工程师');
  const contact = new El('联系Ta');
  const openContactDialog = () => {
    state.contacts++;
    const card = state.mode === 'card' && !config.wrongRetry;
    const dlg = new El();
    const title = new El(card ? '选择该牛人开聊职位' : config.unknown ? '未知弹层' : '使用VVIP账号沟通权益联系牛人');
    const jobName = new El('工程师');
    const job = new El('', config.noActiveJob ? '' : 'active');
    job.querySelector = sel => sel === 'h3' ? jobName : null;
    const btn = new El(card ? '搜索畅聊卡(3/13)' : '立即沟通', 'boss-btn-primary');
    btn.disabled = card ? !!config.disabledCard : !!config.exhausted || !!config.disabledUnknown;
    btn.click = () => { state.confirms++; if (!config.keepDialog) state.dialog = null; };
    const cancel = new El('取消', 'boss-btn-outline');
    cancel.click = () => { state.cancels++; if (!config.cancelFails) state.dialog = null; };
    dlg.innerText = title.textContent + '\n' + (config.exhausted && !card ? '账号权益已耗尽。' : config.disabledUnknown ? '如果账号权益不足，请使用畅聊卡。' : '') + '\n工程师\n' + btn.textContent;
    dlg.querySelectorAll = sel => sel === 'button' ? [btn, cancel] : sel === '.select-list li' ? [job] : [];
    dlg.querySelector = sel => sel === 'h3' ? title : sel === '.select-list li.active h3' && !config.noActiveJob ? jobName : null;
    dlg.btn = btn;
    state.dialog = dlg;
    if (config.afterContact) config.afterContact(state);
  };
  contact.click = () => { state.contactIndices.push(1); openContactDialog(); };
  contact.scrollIntoView = () => { if (config.afterScroll) config.afterScroll(state, contact); };
  const card = new El(); card.__vue__ = { $props: { geek: { geekCard: { encryptGeekId: 'candidate-1' } } } };
  card.querySelector = sel => sel === '.name-label' ? name : sel === '.info-detail' ? summary : sel === 'button.btn-getcontact, .btn-getcontact' ? contact : null;
  card.querySelectorAll = sel => ['button', 'button, .btn-getcontact'].includes(sel) ? [contact] : [];
  const modes = ['account', 'card'].map(mode => {
    const el = new El(mode === 'account' ? '使用账号权益进行沟通' : '使用畅聊卡进行沟通');
    Object.defineProperty(el, 'className', { get: () => 'chat-mode' + (state.mode === mode ? ' checked' : '') });
    el.click = () => {
      state.switches.push(mode);
      if (!config.modeFails) state.mode = mode;
      if (config.afterModeChange) config.afterModeChange(state);
    };
    return el;
  });
  const wrap = new El();
  wrap.querySelectorAll = sel => sel === '.chat-mode' ? modes : [];
  wrap.querySelector = sel => sel === '.chat-mode.checked' ? modes[state.mode === 'account' ? 0 : 1] : null;
  let searchIframe;
  const pageDoc = {
    querySelector: sel => sel === 'iframe[name="searchFrame"]' ? searchIframe : sel === '.change-chat-mode-wrap' ? state.detail && !config.missingMode ? wrap : null : sel.includes('common-job-list-dialog') ? state.dialog : null,
    querySelectorAll: sel => sel === 'iframe[name="searchFrame"]' ? [searchIframe] : sel.includes('common-job-list-dialog') && state.dialog ? [state.dialog] : [],
  };
  const secondName = new El('张**');
  const secondSummary = new El('设计师');
  const secondContact = new El('联系Ta');
  secondContact.click = () => { state.contactIndices.push(2); openContactDialog(); };
  const second = new El(); second.__vue__ = { $props: { geek: { geekCard: { encryptGeekId: 'candidate-2' } } } };
  second.querySelector = sel => sel === '.name-label' ? secondName : sel === '.info-detail' ? secondSummary : sel === 'button.btn-getcontact, .btn-getcontact' ? secondContact : null;
  second.querySelectorAll = sel => ['button', 'button, .btn-getcontact'].includes(sel) ? [secondContact] : [];
  secondName.click = name.click;
  state.cards = config.sameName ? [card, second] : [card];
  const frameDoc = { querySelectorAll: sel => sel === '.geek-info-card' ? state.cards : [] };
  const topWindow = { document: pageDoc, getComputedStyle: el => el.style };
  topWindow.top = topWindow;
  Object.defineProperty(topWindow, 'location', { get: () => new URL(state.url) });
  const frameWindow = { top: topWindow, getComputedStyle: el => el.style };
  const evaluate = (script, document) => {
    assert.equal(typeof script, 'string');
    return vm.runInNewContext(script, { document, HTMLElement: El, MouseEvent: class { constructor(type) { this.type = type; } }, window: document === pageDoc ? topWindow : frameWindow });
  };
  frameDoc.location = { href: 'https://www.zhipin.com/web/frame/search' };
  frameDoc.defaultView = frameWindow;
  searchIframe = new El(); searchIframe.name = 'searchFrame'; searchIframe.contentDocument = frameDoc;
  searchIframe.contentWindow = frameWindow;
  const frame = { name: () => 'searchFrame', url: () => 'https://www.zhipin.com/web/frame/search', evaluate: async script => evaluate(script, frameDoc), waitForFunction: async () => {} };
  const page = {
    url: () => state.url,
    frames: () => [frame],
    waitForSelector: async () => ({ contentFrame: async () => frame }),
    evaluate: async script => {
      if (config.staleConfirm && script.includes('const expected =') && state.dialog) state.dialog.btn.textContent = '未知按钮';
      if (config.beforeConfirm && script.includes('const expected =') && state.dialog) config.beforeConfirm(state);
      return evaluate(script, pageDoc);
    },
    waitForFunction: async script => { if (!evaluate(script, pageDoc)) throw new Error('开聊模式切换未生效'); },
  };
  return { page, frame, state, summary, name, frameWindow, secondSummary, searchIframe, topWindow };
}
const capture = f => searchPool.captureSearchPoolSnapshot(f.frame);
const greet = async (f, dryRun = false) => {
  await capture(f);
  return greetSearchPoolOnPage(f.page, { index: 1, dryRun });
};

function nonSearchFixture(url) {
  const state = { contacts: 0, confirms: 0, evaluations: 0 };
  class El {
    constructor(text = '') { this.textContent = text; this.className = ''; this.classList = { contains: () => false }; }
    getAttribute() { return null; }
    querySelectorAll() { return []; }
    querySelector() { return null; }
    matches() { return false; }
    scrollIntoView() {}
    click() { state.contacts++; throw new Error('离线沟通按钮已点击'); }
  }
  const name = new El('张三');
  const contact = new El('打招呼');
  const inner = new El();
  inner.getAttribute = attribute => attribute === 'data-geekid' ? 'fixture-candidate' : null;
  const card = new El();
  card.querySelector = sel => ['.name-wrap .name', '.name', '.geek-name'].includes(sel) ? name
    : sel === '.card-inner' ? inner
    : ['.button-chat-wrap .btn.btn-greet', '.geek-chat .btn-ai-v2', '.geek-chat'].includes(sel) ? contact : null;
  const document = {
    querySelector: () => null,
    querySelectorAll: sel => sel.includes('.candidate-card-wrap') || sel.includes('.geek-card-item') ? [card] : [],
  };
  const evaluate = async script => {
    state.evaluations++;
    return vm.runInNewContext(script, { document, HTMLElement: El, window: {} });
  };
  const frame = { url: () => 'https://www.zhipin.com/web/frame/recommend', evaluate, waitForFunction: async () => {} };
  const page = { url: () => 'https://www.zhipin.com' + url, frames: () => [page], evaluate,
    waitForFunction: async () => {}, waitForSelector: async () => ({ contentFrame: async () => frame }),
    viewport: async () => ({ width: 1200, height: 900 }), setViewport: async () => {},
  };
  return { page, state };
}

for (const url of ['/web/chat/recommend', '/web/chat/aiform']) {
  test('非搜索池离线 fixture 可走到真实按钮点击：' + url, async () => {
    const f = nonSearchFixture(url);
    await assert.rejects(greetOnPage(f.page, { candidateTarget: '张三' }), /离线沟通按钮已点击/);
    assert.equal(f.state.contacts, 1);
  });
  test('非搜索池 dry-run 在任何点击前拒绝：' + url, async () => {
    const f = nonSearchFixture(url);
    await assert.rejects(greetOnPage(f.page, { candidateTarget: '张三', dryRun: true }), /dry-run.*搜索池/);
    assert.equal(f.state.contacts, 0);
    assert.equal(f.state.confirms, 0);
    assert.equal(f.state.evaluations, 0);
  });
}

test('同名打码卡按快照序号精确沟通，不按姓名重新搜索', async () => {
  const f = fixture({ sameName: true });
  await greet(f);
  assert.equal(f.state.contacts, 1);
  assert.equal(f.state.confirms, 1);
});

for (const change of ['reorder', 'disappear', 'replace', 'summary']) {
  test('详情打开后身份变化必须零沟通点击：' + change, async () => {
    const f = fixture({ sameName: true, afterDetail: state => {
      if (change === 'reorder') state.cards.reverse();
      if (change === 'disappear') state.cards.shift();
      if (change === 'replace') state.cards[0] = state.cards[1];
      if (change === 'summary') f.summary.textContent = '另一位工程师';
    } });
    await assert.rejects(greet(f), /快照|身份|列表已变化/);
    assert.equal(f.state.contacts, 0);
    assert.equal(f.state.confirms, 0);
  });
}

test('没有搜索快照不能沟通，即使只给有效序号', async () => {
  const f = fixture();
  await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, dryRun: true }), /快照/);
  assert.equal(f.state.contacts, 0);
});

test('搜索到 dry-run 再正式执行时换人必须停止', async () => {
  const f = fixture();
  await capture(f);
  await greetSearchPoolOnPage(f.page, { index: 1, dryRun: true });
  f.summary.textContent = '产品经理';
  await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, dryRun: false }), /快照|身份|列表已变化/);
  assert.equal(f.state.contacts, 1);
  assert.equal(f.state.confirms, 0);
});

test('index 与关键词冲突必须零沟通点击', async () => {
  const f = fixture();
  await capture(f);
  await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, target: '设计师', dryRun: true }), /冲突|不匹配/);
  assert.equal(f.state.contacts, 0);
});

for (const change of ['reorder', 'rebuild', 'expired', 'missing', 'fullSummary']) {
  test('跨调用快照失效必须停止且不会刷新快照：' + change, async () => {
    const f = fixture({ sameName: true });
    f.summary.textContent = '工程师'.repeat(40) + '原始末尾';
    await capture(f);
    const snapshot = f.frameWindow.__bossCliSearchSnapshot;
    if (change === 'reorder') f.state.cards.reverse();
    if (change === 'rebuild') {
      const original = f.state.cards[0];
      f.state.cards[0] = { querySelector: original.querySelector, querySelectorAll: original.querySelectorAll };
    }
    if (change === 'expired') snapshot.createdAt -= 15 * 60 * 1000 + 1;
    if (change === 'missing') delete f.frameWindow.__bossCliSearchSnapshot;
    if (change === 'fullSummary') f.summary.textContent = '工程师'.repeat(40) + '替换末尾';
    await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, dryRun: true }), /快照/);
    assert.equal(f.state.contacts, 0);
    assert.equal(f.state.confirms, 0);
    assert.equal(f.frameWindow.__bossCliSearchSnapshot, change === 'missing' ? undefined : snapshot);
  });
}

test('失配后重新搜索采集快照才能恢复，并且 dry-run 不重写快照', async () => {
  const f = fixture();
  await capture(f);
  f.summary.textContent = '产品经理';
  await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, dryRun: true }), /快照/);
  await capture(f);
  const snapshot = f.frameWindow.__bossCliSearchSnapshot;
  await greetSearchPoolOnPage(f.page, { index: 1, target: '产品经理', dryRun: true });
  assert.equal(f.frameWindow.__bossCliSearchSnapshot, snapshot);
  await greetSearchPoolOnPage(f.page, { index: 1, target: '产品经理', dryRun: false });
  assert.equal(f.frameWindow.__bossCliSearchSnapshot, snapshot);
  assert.equal(f.state.contacts, 2);
  assert.equal(f.state.confirms, 1);
});

test('账号权益弹层不代表耗尽，正常确认一次且不切卡', async () => {
  const f = fixture(); const result = await greet(f);
  assert.equal(f.state.confirms, 1); assert.deepEqual(f.state.switches, []); assert.equal(f.state.contacts, 1);
  assert.match(result, /已提交账号权益确认/); assert.match(result, /结果未确认/); assert.doesNotMatch(result, /已确认发出|消耗一张/);
});
test('旧持久模式为卡时，正式发送先验证切回账号权益', async () => {
  const f = fixture({ initialCard: true }); await greet(f);
  assert.deepEqual(f.state.switches, ['account']); assert.equal(f.state.confirms, 1);
});
test('明确不足且按钮禁用，验证切卡和二次弹层后只确认一次', async () => {
  const f = fixture({ exhausted: true }); const result = await greet(f);
  assert.deepEqual(f.state.switches, ['card']); assert.equal(f.state.contacts, 2); assert.equal(f.state.confirms, 1);
  assert.match(result, /已提交畅聊卡确认/);
});
for (const config of [{}, { exhausted: true }, { initialCard: true }]) {
  test('dry-run 保留持久模式且不确认：' + JSON.stringify(config), async () => {
    const f = fixture(config); const initial = f.state.mode; await greet(f, true);
    assert.equal(f.state.mode, initial); assert.deepEqual(f.state.switches, []); assert.equal(f.state.confirms, 0); assert.equal(f.state.contacts, 1); assert.equal(f.state.dialog, null);
  });
}
for (const config of [{ unknown: true }, { disabledUnknown: true }, { exhausted: true, wrongRetry: true }, { exhausted: true, disabledCard: true }, { exhausted: true, cancelFails: true }, { initialCard: true, modeFails: true }, { missingMode: true }, { staleConfirm: true }, { noActiveJob: true }]) {
  test('不可靠状态必须停止且没有确认：' + JSON.stringify(config), async () => {
    const f = fixture(config); await assert.rejects(greet(f)); assert.equal(f.state.confirms, 0); assert.ok(f.state.contacts <= 2);
    if (config.unknown || config.disabledUnknown || config.cancelFails) assert.deepEqual(f.state.switches, []);
  });
}
test('确认后弹层仍在也不能切卡或补发', async () => {
  const f = fixture({ keepDialog: true }); const result = await greet(f);
  assert.equal(f.state.confirms, 1); assert.equal(f.state.contacts, 1); assert.deepEqual(f.state.switches, []); assert.match(result, /结果未确认/);
});
test('假设、否定或泛化提示不能作为权益耗尽证据', () => {
  const base = { present: true, title: '使用VVIP账号沟通权益联系牛人', confirmLabel: '立即沟通', confirmDisabled: true };
  for (const text of ['', '剩余0', '账号权益未耗尽', '账号权益不足时可以使用卡', '如果账号权益不足，请使用卡', '说明：账号权益不足时将提示', '如果 账号权益已耗尽。', '提示：账号权益已耗尽。']) assert.equal(searchPoolDialogFunding({ ...base, text }), 'unknown', text);
  assert.equal(searchPoolDialogFunding({ ...base, text: '账号权益已耗尽。' }), 'exhausted');
  assert.equal(searchPoolDialogFunding({ ...base, text: '账号权益已耗尽。', confirmDisabled: false }), 'unknown');
});


test('同名打码卡精确选择第二张且切卡后仍是第二张', async () => {
  const f = fixture({ sameName: true, exhausted: true });
  await capture(f);
  await greetSearchPoolOnPage(f.page, { index: 2, dryRun: false });
  assert.deepEqual(f.state.contactIndices, [2, 2]);
  assert.equal(f.state.confirms, 1);
});

test('沟通按钮滚动引起身份变化仍须在点击前停止', async () => {
  const f = fixture({ afterScroll: () => { f.summary.textContent = '另一位工程师'; } });
  await assert.rejects(greet(f), /快照/);
  assert.equal(f.state.contacts, 0);
  assert.equal(f.state.confirms, 0);
});

test('沟通按钮滚动后文案变成不感兴趣时停止', async () => {
  const f = fixture({ afterScroll: (_state, contact) => { contact.textContent = '不感兴趣'; } });
  await assert.rejects(greet(f), /按钮/);
  assert.equal(f.state.contacts, 0);
});

test('沟通弹层期间身份变化不能确认', async () => {
  const f = fixture({ afterContact: () => { f.summary.textContent = '另一位工程师'; } });
  await assert.rejects(greet(f), /快照/);
  assert.equal(f.state.contacts, 1);
  assert.equal(f.state.confirms, 0);
  assert.equal(f.state.dialog, null);
});

test('权益不足切卡期间身份变化不能再次沟通或确认', async () => {
  const f = fixture({ exhausted: true, afterModeChange: () => { f.summary.textContent = '另一位工程师'; } });
  await assert.rejects(greet(f), /快照/);
  assert.equal(f.state.contacts, 1);
  assert.equal(f.state.confirms, 0);
});


test('同DOM同资料更换平台候选人ID必须拒绝', async () => {
  const f = fixture(); await capture(f);
  f.state.cards[0].__vue__.$props.geek.geekCard.encryptGeekId = 'candidate-replaced';
  await assert.rejects(greetSearchPoolOnPage(f.page, { index: 1, dryRun: true }), /快照|身份/);
  assert.equal(f.state.contacts, 0);
  assert.equal(f.state.confirms, 0);
});

test('平台候选人ID缺失不能创建搜索快照', async () => {
  const f = fixture(); delete f.state.cards[0].__vue__;
  await assert.rejects(capture(f), /标识|ID/);
});

for (const change of ['navigation', 'hidden', 'replaced', 'binding']) {
  const loseBinding = f => {
    if (change === 'navigation') f.state.url = 'https://www.zhipin.com/web/chat/recommend';
    if (change === 'hidden') f.searchIframe.style.display = 'none';
    if (change === 'replaced') f.searchIframe.contentDocument = { defaultView: {} };
    if (change === 'binding') f.frameWindow.__bossCliSearchFrameBinding = 'different-frame';
  };
  test('详情后页面失去原搜索frame绑定不得沟通：' + change, async () => {
    const f = fixture({ afterDetail: () => loseBinding(f) });
    await assert.rejects(greet(f), /搜索|frame|绑定|离开/);
    assert.equal(f.state.contacts, 0);
    assert.equal(f.state.confirms, 0);
  });
  test('切卡后页面失去原搜索frame绑定不得重试沟通：' + change, async () => {
    const f = fixture({ exhausted: true, afterModeChange: () => loseBinding(f) });
    await assert.rejects(greet(f), /搜索|frame|绑定|离开/);
    assert.equal(f.state.contacts, 1);
    assert.equal(f.state.confirms, 0);
  });
  test('确认点击同次脚本须拒绝已失去搜索frame绑定：' + change, async () => {
    const f = fixture({ beforeConfirm: () => loseBinding(f) });
    await assert.rejects(greet(f), /搜索|frame|绑定|离开/);
    assert.equal(f.state.contacts, 1);
    assert.equal(f.state.confirms, 0);
  });
}

test('最终确认脚本内候选人变化必须拒绝，不能依赖前一次远端校验', async () => {
  const f = fixture({ beforeConfirm: () => { f.summary.textContent = '替换后的资料'; } });
  await assert.rejects(greet(f), /快照|身份/);
  assert.equal(f.state.contacts, 1);
  assert.equal(f.state.confirms, 0);
});

test('无法读取同源top时直接停止，不得略过页面绑定校验', async () => {
  const f = fixture();
  Object.defineProperty(f.frameWindow, 'top', { get: () => { throw new Error('Cross-origin top access blocked'); } });
  await assert.rejects(greet(f), /Cross-origin top access blocked/);
  assert.equal(f.state.contacts, 0);
  assert.equal(f.state.confirms, 0);
});
