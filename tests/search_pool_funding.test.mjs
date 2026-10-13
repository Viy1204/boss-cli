import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { greetSearchPoolOnPage, searchPoolDialogFunding } from '../dist/toolset/normal-search.js';

// 仅在本测试进程缩短人类操作间隔，不启动浏览器、不访问网络。
const realTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms, ...args) => realTimeout(fn, 0, ...args);
test.after(() => { globalThis.setTimeout = realTimeout; });

function fixture(config = {}) {
  const state = { mode: config.initialCard ? 'card' : 'account', dialog: null, switches: [], confirms: 0, contacts: 0, cancels: 0, detail: false };
  class El {
    constructor(text = '', cls = '') { this.textContent = text; this.className = cls; this.disabled = false; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getAttribute(name) { return name === 'disabled' && this.disabled ? '' : null; }
    getBoundingClientRect() { return { width: 300, height: 300 }; }
    scrollIntoView() {}
    click() {}
    dispatchEvent(e) { if (e.type === 'click') this.click(); }
  }
  const name = new El('张**'); name.click = () => { state.detail = true; };
  const summary = new El('工程师');
  const contact = new El('联系Ta');
  contact.click = () => {
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
  };
  const card = new El();
  card.querySelector = sel => sel === '.name-label' ? name : sel === '.info-detail' ? summary : sel === 'button.btn-getcontact, .btn-getcontact' ? contact : null;
  card.querySelectorAll = sel => sel === 'button' ? [contact] : [];
  const modes = ['account', 'card'].map(mode => {
    const el = new El(mode === 'account' ? '使用账号权益进行沟通' : '使用畅聊卡进行沟通');
    Object.defineProperty(el, 'className', { get: () => 'chat-mode' + (state.mode === mode ? ' checked' : '') });
    el.click = () => { state.switches.push(mode); if (!config.modeFails) state.mode = mode; };
    return el;
  });
  const wrap = new El();
  wrap.querySelectorAll = sel => sel === '.chat-mode' ? modes : [];
  wrap.querySelector = sel => sel === '.chat-mode.checked' ? modes[state.mode === 'account' ? 0 : 1] : null;
  const pageDoc = {
    querySelector: sel => sel === '.change-chat-mode-wrap' ? state.detail && !config.missingMode ? wrap : null : sel.includes('common-job-list-dialog') ? state.dialog : null,
    querySelectorAll: sel => sel.includes('common-job-list-dialog') && state.dialog ? [state.dialog] : [],
  };
  const frameDoc = { querySelectorAll: sel => sel === '.geek-info-card' ? [card] : [] };
  const evaluate = (script, document) => {
    assert.equal(typeof script, 'string');
    return vm.runInNewContext(script, { document, HTMLElement: El, MouseEvent: class { constructor(type) { this.type = type; } }, window: { getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }) } });
  };
  const frame = { url: () => 'https://www.zhipin.com/web/frame/search', evaluate: async script => evaluate(script, frameDoc), waitForFunction: async () => {} };
  const page = {
    url: () => 'https://www.zhipin.com/web/chat/search',
    waitForSelector: async () => ({ contentFrame: async () => frame }),
    evaluate: async script => {
      if (config.staleConfirm && script.includes('const expected =') && state.dialog) state.dialog.btn.textContent = '未知按钮';
      return evaluate(script, pageDoc);
    },
    waitForFunction: async script => { if (!evaluate(script, pageDoc)) throw new Error('开聊模式切换未生效'); },
  };
  return { page, state };
}
const greet = (f, dryRun = false) => greetSearchPoolOnPage(f.page, { index: 1, dryRun });

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
