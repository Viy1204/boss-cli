import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {
  SEARCH_CANDIDATE_READER_SCRIPT,
  VALIDATE_SEARCH_SNAPSHOT_SCRIPT,
} from '../dist/common/boss_greet_card_dialog.js';

function fixture() {
  const state = { visible: [], full: ['测试院校', '广告投放', '数据分析'] };
  const card = {
    __vue__: { $props: { geek: { geekCard: { encryptGeekId: 'fixture-person' } } } },
    querySelector: selector => selector === '.name-label' ? { textContent: '张**' } : null,
    querySelectorAll: selector => {
      if (selector === '.info-tags:not(.info-tags-measure) .info-tags-item') {
        return state.visible.map(textContent => ({ textContent }));
      }
      if (selector === '.info-tags-measure .info-tags-item') {
        return state.full.map(textContent => ({ textContent }));
      }
      return [];
    },
  };
  const searchDocument = { querySelectorAll: () => [card] };
  const searchWindow = {};
  const context = { card, searchDocument, searchWindow };
  const read = () => vm.runInNewContext(`(() => { ${SEARCH_CANDIDATE_READER_SCRIPT} return readCandidate(card); })()`, context);
  const capture = () => {
    searchWindow.__bossCliSearchSnapshot = {
      createdAt: Date.now(), cards: [card], fingerprints: [JSON.stringify(read())],
    };
  };
  const validate = () => vm.runInNewContext(`(() => { ${VALIDATE_SEARCH_SNAPSHOT_SCRIPT} })()`, context);
  return { state, read, capture, validate };
}

test('搜索在后台尚未完成标签布局时仍读取完整语义标签', () => {
  const f = fixture();
  assert.deepEqual(Array.from(f.read().tags), f.state.full);
});

test('搜索预览恢复窗口或改变宽度时，标签截断不能使同一候选人快照失效', () => {
  const f = fixture();
  f.capture();
  f.state.visible = ['测试院校', '广告投放'];
  assert.doesNotThrow(f.validate);
  f.state.visible = ['测试院校'];
  assert.doesNotThrow(f.validate);
});

test('真实标签内容变化仍拒绝旧搜索快照', () => {
  const f = fixture();
  f.capture();
  f.state.full[2] = '另一项真实技能';
  assert.throws(f.validate, /搜索快照.*不一致/);
});
