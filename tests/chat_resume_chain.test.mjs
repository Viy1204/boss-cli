import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const compiled = new Map(await Promise.all([
  '../src/common/ensure_page.ts',
  '../src/toolset/list.ts',
  '../src/toolset/chat.ts',
].map(async path => {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  return [path, outputText];
})));

class Element {
  constructor(className = '', textContent = '', children = [], tagName = 'DIV') {
    this.className = className;
    this.ownText = textContent;
    this.children = [];
    this.parentElement = null;
    this.tagName = tagName;
    this.style = { display: 'block', visibility: 'visible', overflowY: 'visible' };
    this.rect = { left: 0, top: 0, width: 300, height: 40 };
    this.append(...children);
  }
  append(...children) {
    children.forEach(child => { child.parentElement = this; this.children.push(child); });
  }
  get textContent() { return this.ownText + this.children.map(child => child.textContent).join(''); }
  get classList() { return { contains: name => this.className.split(/\s+/).includes(name) }; }
  getBoundingClientRect() { return this.rect; }
  getAttribute(name) { return name === 'aria-selected' ? String(this.classList.contains('selected')) : null; }
  scrollIntoView() {}
  click() {}
  dispatchEvent(event) { if (event.type === 'click') this.click(); }
  closest(selector) {
    for (let current = this; current; current = current.parentElement) {
      if (matches(current, selector)) return current;
    }
    return null;
  }
  querySelectorAll(selector) {
    const descendants = this.children.flatMap(child => [child, ...child.descendants()]);
    return descendants.filter(child => matches(child, selector));
  }
  descendants() { return this.children.flatMap(child => [child, ...child.descendants()]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
}

function matches(element, selector) {
  const matchesToken = (node, token) => {
    const tag = token.match(/^[a-z][\w-]*/i)?.[0];
    if (tag && node.tagName !== tag.toUpperCase()) return false;
    if (token.endsWith(':last-child') && node.parentElement?.children.at(-1) !== node) return false;
    return [...token.matchAll(/\.([\w-]+)/g)].every(([, name]) => node.classList.contains(name));
  };
  return selector.split(',').some(part => {
    const tokens = part.trim().replace(/\s*>\s*/g, ' > ').split(/\s+/);
    const visit = (node, index) => {
      if (!node || !matchesToken(node, tokens[index])) return false;
      if (index === 0) return true;
      if (tokens[index - 1] === '>') return visit(node.parentElement, index - 2);
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (visit(parent, index - 1)) return true;
      }
      return false;
    };
    return visit(element, tokens.length - 1);
  });
}

function messageElement(kind) {
  const time = new Element('message-time', '', [new Element('time', '10:00')]);
  let content;
  if (kind === 'text' || kind === 'myself' || kind === 'system-text') {
    const from = kind === 'text' ? 'friend' : kind === 'myself' ? 'myself' : 'system';
    content = new Element('item-' + from, '', [new Element('text', '', [new Element('', '普通文字', [], 'SPAN')])]);
  } else if (kind === 'plain-text') {
    content = new Element('item-friend', '', [new Element('text', '无 span 的文字')]);
  } else if (kind === 'resume' || kind === 'card' || kind === 'card-button' || kind === 'resume-icon') {
    const parts = [];
    if (kind === 'resume' || kind === 'resume-icon') parts.push(new Element('resume-icon'));
    if (kind === 'resume' || kind === 'card') parts.push(new Element('message-card-top-title', '梁伟佳的简历.pdf'));
    if (kind !== 'resume-icon') parts.push(new Element('message-card-buttons', '', [new Element('card-btn', '查看简历')]));
    content = new Element('item-friend', '', parts);
  } else if (kind === 'system-card') {
    content = new Element('item-system', '', [new Element('message-card-top-title', '已交换简历')]);
  } else {
    content = new Element('item-friend');
  }
  return new Element('message-item', '', [time, content]);
}

function fixture(config = {}) {
  const state = { now: 0, scheduled: [], clicked: [], tabs: [], tab: 'all', url: 'https://www.zhipin.com/web/chat/index' };
  const advance = milliseconds => {
    const deadline = state.now + milliseconds;
    while (state.scheduled.some(event => event.at <= deadline)) {
      state.scheduled.sort((a, b) => a.at - b.at);
      const event = state.scheduled.shift();
      state.now = event.at;
      event.run();
    }
    state.now = deadline;
  };
  const schedule = (delay, run) => {
    if (delay) state.scheduled.push({ at: state.now + delay, run });
    else run();
  };
  const document = new Element();
  document.visibilityState = config.background ? 'hidden' : 'visible';
  const list = new Element('user-list');
  document.append(list);
  const candidates = config.rows ?? [{ name: '梁伟佳', badge: '1' }];
  const rows = candidates.map((candidate, index) => {
    const row = new Element('geek-item', '', [
      new Element('geek-name', candidate.name),
      new Element('source-job', candidate.job ?? '工程师'),
      new Element('time', '今天'),
      new Element('push-text', '候选人消息'),
      new Element('badge-count', candidate.badge ?? ''),
    ]);
    row.rect = { left: 0, top: 100 + index * 40, width: 300, height: 30 };
    return row;
  });
  const wraps = rows.map(row => new Element('geek-item-wrap', '', [row]));
  const refreshList = () => {
    list.children = [];
    const visible = state.tab === 'unread' && !config.unreadTabShowsAll
      ? wraps.filter(wrap => Number.parseInt(wrap.querySelector('.badge-count').textContent, 10) > 0)
      : wraps;
    list.append(...visible);
  };
  refreshList();
  const tabs = ['all', 'unread'].map(key => {
    const tab = new Element(key === 'all' ? 'selected' : '', key === 'all' ? '全部' : '未读', [], 'SPAN');
    tab.click = () => {
      state.tabs.push(key);
      tabs.forEach(item => { item.className = ''; });
      schedule(config.filterSelectionDelay ?? 0, () => {
        tab.className = 'selected';
        state.tab = key;
        refreshList();
      });
    };
    return tab;
  });
  const filter = new Element('chat-message-filter-left', '', tabs);
  schedule(config.filterDelay ?? 0, () => document.append(filter));
  const messageList = new Element('chat-message-list');
  const messageKinds = config.messages ?? ['text'];
  const evaluate = script => {
    assert.equal(typeof script, 'string', '注入浏览器的表达式必须为字符串');
    return vm.runInNewContext(script, {
      document,
      window: { getComputedStyle: element => element.style },
      HTMLElement: Element,
      MouseEvent: class { constructor(type) { this.type = type; } },
      Error,
    });
  };
  const page = {
    url: () => state.url,
    goto: async () => { throw new Error('当前页面已在聊天页，不应重新导航'); },
    evaluate: async script => evaluate(script),
    waitForFunction: async (script, options = {}) => {
      if (evaluate(script)) return;
      const timeout = options.timeout ?? 30_000;
      const deadline = state.now + timeout;
      const interval = options.polling ?? (config.background ? Infinity : 16);
      while (state.now + interval <= deadline) {
        advance(interval);
        if (evaluate(script)) return;
      }
      advance(deadline - state.now);
      throw new Error(`Waiting failed: ${timeout}ms exceeded`);
    },
    $$: async selector => document.querySelectorAll(selector).map(element => ({
      $eval: async (childSelector, callback) => {
        const child = element.querySelector(childSelector);
        if (!child) throw new Error('未找到元素：' + childSelector);
        return callback(child);
      },
    })),
    mouse: {
      click: async (x, y) => {
        const row = list.querySelectorAll('.geek-item').find(item => {
          const rect = item.getBoundingClientRect();
          return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;
        });
        assert.ok(row, '鼠标必须点中当前列表中的候选人');
        const name = row.querySelector('.geek-name').textContent.replace(/\s+/g, ' ').trim();
        state.clicked.push(name);
        schedule(config.identityDelay ?? 0, () => {
          rows.forEach(item => { item.className = 'geek-item'; });
          row.className += ' selected';
          document.append(new Element('base-info-single-container', '', [new Element('name-box', name)]));
        });
        document.append(messageList);
        if (config.hiddenMessages) {
          const hiddenList = new Element('chat-message-list', '', config.hiddenMessages.map(messageElement));
          hiddenList.style.display = 'none';
          document.append(hiddenList);
        }
        schedule(config.messageDelay ?? 0, () => messageList.append(...messageKinds.map(messageElement)));
      },
    },
  };
  const loadSource = (path, imports) => {
    const exports = {};
    vm.runInNewContext(compiled.get(path), {
      exports,
      Error,
      Date: class extends Date { static now() { return state.now; } },
      require: specifier => {
        assert.ok(Object.hasOwn(imports, specifier), '未隔离的依赖：' + specifier);
        return imports[specifier];
      },
    }, { filename: path });
    return exports;
  };
  const browser = {
    LIST_FILTER_GAP_MS: { min: 1, max: 1 },
    LIST_POLL_MS: { min: 1, max: 1 },
    LIST_MIN_BEFORE_EMPTY_OK_MS: 0,
    CHAT_HISTORY_DIALOG_WAIT_MS: { min: 1, max: 1 },
    CHAT_HISTORY_TAB_SWITCH_MS: { min: 1, max: 1 },
    OPEN_CHAT_AFTER_ROW_CLICK_MS: { min: 1, max: 1 },
    OPEN_CHAT_SCROLL_GAP_MS: { min: 1, max: 1 },
    sleepRandom: async min => advance(min),
  };
  const auth = {
    BOSS_CHAT_INDEX_URL: 'https://www.zhipin.com/web/chat/index',
    isBossChatIndexUrl: url => new URL(url).pathname === '/web/chat/index',
  };
  const listModule = loadSource('../src/toolset/list.ts', {
    '../browser/index.js': browser,
    '../common/auth.js': auth,
    '../common/ensure_page.js': loadSource('../src/common/ensure_page.ts', {}),
    '../common/boss_session_page.js': { withBossSessionPage: async callback => callback(page) },
  });
  const chat = loadSource('../src/toolset/chat.ts', {
    '../browser/index.js': browser,
    '../common/auth.js': auth,
    './list.js': listModule,
  });
  return { state, page, list: listModule, chat };
}

for (const delayed of ['filterDelay', 'filterSelectionDelay']) {
  test('后台 list 等待延迟 DOM：' + delayed, async () => {
    const f = fixture({ background: true, [delayed]: 500 });
    const output = await f.list.runGetCandidateList();
    assert.match(output, /沟通列表共 1 人/);
    assert.match(output, /1\. 梁伟佳/);
    assert.deepEqual(f.state.clicked, []);
  });
}

const openRoutes = {
  name: f => f.chat.runOpenCandidateChat(f.page, '梁伟佳', true),
  index: f => f.chat.runOpenCandidateChatByIndex(f.page, { index: 1, expectedName: '梁伟佳', exact: true }),
};
for (const [route, open] of Object.entries(openRoutes)) {
  for (const delayed of ['identityDelay', 'messageDelay']) {
    test(`后台 chat ${route} 等待延迟 DOM：${delayed}`, async () => {
      const f = fixture({ background: true, [delayed]: 500 });
      assert.match(await open(f), /\[candidate\] 10:00 普通文字/);
      assert.deepEqual(f.state.clicked, ['梁伟佳']);
    });
  }
  for (const kind of ['resume', 'card', 'card-button', 'resume-icon', 'text', 'plain-text', 'myself', 'system-text', 'system-card']) {
    test(`chat ${route} 读取只含 ${kind} 的会话`, async () => {
      const f = fixture({ messages: [kind] });
      const output = await open(f);
      assert.match(output, /成功进入候选人聊天：梁伟佳/);
      assert.match(output, kind.startsWith('resume') ? /附件简历消息：已收到（仅当前已加载消息）/ : /附件简历消息：未发现（仅当前已加载消息）/);
      assert.doesNotMatch(output, /完整聊天消息/);
      assert.match(output, /当前已加载聊天消息：\n\n/);
      assert.match(output, /在线简历可直接使用 boss action resume 读取，无须先索要/);
      if (kind === 'resume' || kind === 'card') assert.match(output, /\[candidate\] 10:00 梁伟佳的简历\.pdf · 查看简历/);
      if (kind === 'card-button') assert.match(output, /\[candidate\] 10:00 查看简历/);
      if (kind === 'text') assert.match(output, /\[candidate\] 10:00 普通文字/);
      if (kind === 'plain-text') assert.match(output, /\[candidate\] 10:00 无 span 的文字/);
      if (kind === 'myself') assert.match(output, /\[you\] 10:00 普通文字/);
      if (kind === 'system-text') assert.match(output, /\[system\] 10:00 普通文字/);
      if (kind === 'system-card') assert.match(output, /\[system\] 10:00 已交换简历/);
    });
  }
  test(`chat ${route} 仅报告当前可见列表的已加载消息与附件状态`, async () => {
    const f = fixture({ messages: ['text'], hiddenMessages: ['resume'] });
    const output = await open(f);
    assert.match(output, /附件简历消息：未发现（仅当前已加载消息）/);
    assert.match(output, /当前已加载聊天消息：\n\n\[candidate\] 10:00 普通文字/);
    assert.doesNotMatch(output, /梁伟佳的简历\.pdf/);
  });
  for (const messages of [[], ['empty']]) {
    test(`chat ${route} 不把${messages.length ? '空消息壳' : '空列表'}判为就绪`, async () => {
      const f = fixture({ messages });
      await assert.rejects(open(f), /Waiting failed|未检测到对应聊天详情面板/);
      assert.deepEqual(f.state.clicked, ['梁伟佳']);
    });
  }
}

const mixedRows = [
  { name: '已读候选人', badge: '' },
  { name: '   ', badge: '9' },
  { name: '零角标候选人', badge: '0' },
  { name: '梁伟佳', badge: '2' },
  { name: '陈云', badge: '99+' },
];

test('未读序号与 list --unread 一致，只点击全部列表中有姓名且角标大于零的人', async () => {
  for (const [index, name] of [[1, '梁伟佳'], [2, '陈云']]) {
    const f = fixture({ rows: mixedRows, unreadTabShowsAll: true });
    const listed = await f.list.runGetCandidateList({ unreadOnly: true });
    assert.match(listed, /未读筛选：共 2 人/);
    assert.match(listed, new RegExp(`${index}\\. ${name}`));
    const output = await f.chat.runOpenCandidateChatByIndex(f.page, { index, filter: 'unread' });
    assert.match(output, new RegExp(`成功进入候选人聊天：${name}`));
    assert.deepEqual(f.state.clicked, [name]);
    assert.ok(f.state.tabs.every(tab => tab === 'all'), '未读序号必须使用全部列表客户端筛选');
  }
});

test('全部序号与 list 一致，空姓名不占序号', async () => {
  const f = fixture({ rows: [{ name: ' ' }, { name: '梁伟佳' }, { name: '陈云' }] });
  assert.match(await f.list.runGetCandidateList(), /2\. 陈云/);
  const output = await f.chat.runOpenCandidateChatByIndex(f.page, { index: 2, expectedName: '陈云', exact: true });
  assert.match(output, /成功进入候选人聊天：陈云/);
  assert.deepEqual(f.state.clicked, ['陈云']);
});

test('未读序号可校验预期姓名，失配时零候选人点击', async () => {
  const f = fixture({ rows: mixedRows, unreadTabShowsAll: true });
  await assert.rejects(f.chat.runOpenCandidateChatByIndex(f.page, {
    index: 1, filter: 'unread', expectedName: '陈云', exact: true,
  }), /候选人是「梁伟佳」.*与指定姓名「陈云」不匹配/);
  assert.deepEqual(f.state.clicked, []);
});

test('未读序号姓名精确或包含校验成功后才点击', async () => {
  for (const [expectedName, exact] of [['梁伟佳', true], ['伟佳', false]]) {
    const f = fixture({ rows: mixedRows, unreadTabShowsAll: true });
    assert.match(await f.chat.runOpenCandidateChatByIndex(f.page, {
      index: 1, filter: 'unread', expectedName, exact,
    }), /成功进入候选人聊天：梁伟佳/);
    assert.deepEqual(f.state.clicked, ['梁伟佳']);
  }
});

for (const filter of ['all', 'unread']) {
  test(`chat --index 对 ${filter} 列表越界时零候选人点击`, async () => {
    const f = fixture({ rows: mixedRows, unreadTabShowsAll: true });
    const total = filter === 'all' ? 4 : 2;
    await assert.rejects(f.chat.runOpenCandidateChatByIndex(f.page, { index: total + 1, filter }),
      new RegExp(`序号 ${total + 1} 不存在；当前.*列表共 ${total} 条`));
    assert.deepEqual(f.state.clicked, []);
  });
}

test('全是已读人或空姓名时未读序号拒绝且零候选人点击', async () => {
  const f = fixture({ rows: mixedRows.slice(0, 3), unreadTabShowsAll: true });
  assert.match(await f.list.runGetCandidateList({ unreadOnly: true }), /未读筛选：共 0 人/);
  await assert.rejects(f.chat.runOpenCandidateChatByIndex(f.page, { index: 1, filter: 'unread' }), /列表共 0 条/);
  assert.deepEqual(f.state.clicked, []);
});

test('按姓名包含匹配后等待实际命中的完整姓名', async () => {
  const f = fixture();
  assert.match(await f.chat.runOpenCandidateChat(f.page, '伟佳', false), /姓名: 梁伟佳/);
  assert.deepEqual(f.state.clicked, ['梁伟佳']);
});
