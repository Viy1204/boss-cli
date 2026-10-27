import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { selectNormalSearchCity } from '../dist/toolset/normal-search.js';

function cityFixture(cities = ['深圳市', '深圳']) {
  class El {
    constructor(textContent = '') { this.textContent = textContent; }
    scrollIntoView() {}
    click() { this.onclick?.(); }
    focus() { document.activeElement = this; }
    dispatchEvent(event) { if (event.type === 'input') this.oninput?.(); }
  }
  class Event {
    constructor(type) { this.type = type; }
  }
  const city = new El('城市');
  const input = new El();
  input.value = '北京';
  input.disabled = false;
  input.readOnly = false;
  let opened = false;
  let suggestions = [];
  const trigger = new El();
  trigger.onclick = () => { opened = true; };
  input.oninput = () => {
    suggestions = cities.filter(label => input.value && label.startsWith(input.value)).map(label => {
      const option = new El(label);
      option.onclick = () => { city.textContent = label; };
      return option;
    });
  };
  const document = {
    visibilityState: 'hidden',
    activeElement: null,
    querySelector: selector => selector === '.city-wrap .city' ? city : selector === '.city-wrap' ? trigger
      : selector === '.search-city-kw input' && opened ? input : null,
    querySelectorAll: selector => selector === '.city-box .search-result-item' ? suggestions : [],
  };
  const evaluate = script => vm.runInNewContext(script, { document, HTMLElement: El, Event });
  const inputHandle = {
    // 隐藏文档中的可见性观察停转，但输入框本身仍可聚焦和编辑。
    click: () => new Promise(() => {}),
    type: async text => {
      input.focus();
      document.activeElement.value += text;
      document.activeElement.dispatchEvent(new Event('input'));
    },
  };
  const frame = {
    evaluate: async script => evaluate(script),
    $: async selector => document.querySelector(selector) === input ? inputHandle : null,
    waitForFunction: async script => { if (!evaluate(script)) throw new Error('城市联想尚未出现'); },
  };
  return { frame, document };
}

test('隐藏文档的可见性观察停转时仍应输入并选中精确城市', { timeout: 10_000 }, async () => {
  const { frame, document } = cityFixture();
  let timer;
  try {
    const selected = await Promise.race([
      selectNormalSearchCity(frame, '深圳'),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('隐藏文档中的城市选择未完成')), 8_000); }),
    ]);
    assert.equal(selected, '深圳');
    assert.equal(document.querySelector('.city-wrap .city').textContent, '深圳');
    assert.equal(document.querySelector('.search-city-kw input').value, '深圳');
  } finally {
    clearTimeout(timer);
  }
});

test('城市联想只有相近名称时应拒绝并保持未选中', { timeout: 10_000 }, async () => {
  const { frame, document } = cityFixture(['深圳市']);
  let timer;
  try {
    await assert.rejects(Promise.race([
      selectNormalSearchCity(frame, '深圳'),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('隐藏文档中的城市选择未完成')), 8_000); }),
    ]), /没有完全匹配项/);
    assert.equal(document.querySelector('.city-wrap .city').textContent, '城市');
  } finally {
    clearTimeout(timer);
  }
});
