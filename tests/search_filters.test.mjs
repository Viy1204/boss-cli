/**
 * `boss search` 的筛选参数解析：城市默认值、多选值拆分、`≥` 的键盘替代写法。
 *
 * 只测纯函数——真正的选择动作要连浏览器，那部分靠人工在真实页面上验收
 * （本轮已验：不限职位 / --city 深圳 / --school 统招本科 / --degree 本科及以上 /
 * --exp 3-5年 / --age 25-30 / --status / --job-hop / --major，以及每次搜索前自动清空筛选
 * （含只在浏览器里手动设过的残留）、传错值时列出可选项的报错路径）。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  defaultSearchCityFromEnv,
  normalizeFilterLabel,
  parseFilterLabels,
} from '../dist/toolset/index.js';

function withCityEnv(value, fn) {
  const saved = process.env.BOSS_SEARCH_CITY;
  try {
    if (value === undefined) delete process.env.BOSS_SEARCH_CITY;
    else process.env.BOSS_SEARCH_CITY = value;
    return fn();
  } finally {
    if (saved === undefined) delete process.env.BOSS_SEARCH_CITY;
    else process.env.BOSS_SEARCH_CITY = saved;
  }
}

test('不设 BOSS_SEARCH_CITY 就完全不碰城市控件——不给别人硬塞深圳', () => {
  withCityEnv(undefined, () => assert.equal(defaultSearchCityFromEnv(), ''));
});

test('BOSS_SEARCH_CITY 生效，且两边空白被吃掉', () => {
  withCityEnv('深圳', () => assert.equal(defaultSearchCityFromEnv(), '深圳'));
  withCityEnv('  深圳  ', () => assert.equal(defaultSearchCityFromEnv(), '深圳'));
});

test('空串等同于没设，不会拿空字符串去点城市控件', () => {
  withCityEnv('', () => assert.equal(defaultSearchCityFromEnv(), ''));
  withCityEnv('   ', () => assert.equal(defaultSearchCityFromEnv(), ''));
});

test('--school 按逗号拆成多项', () => {
  assert.deepEqual(parseFilterLabels('统招本科,985院校'), ['统招本科', '985院校']);
});

test('--school 认全角逗号：中文输入法下顺手打出来的就是它', () => {
  assert.deepEqual(parseFilterLabels('统招本科，985院校'), ['统招本科', '985院校']);
  assert.deepEqual(parseFilterLabels('统招本科，211院校,985院校'), [
    '统招本科',
    '211院校',
    '985院校',
  ]);
});

test('--school 去空白、丢空项，末尾多打一个逗号不会变成一个空条件', () => {
  assert.deepEqual(parseFilterLabels(' 统招本科 , , 985院校 ,'), ['统招本科', '985院校']);
});

test('--school 没传就是空数组，不触发院校筛选', () => {
  assert.deepEqual(parseFilterLabels(undefined), []);
  assert.deepEqual(parseFilterLabels(''), []);
});

test('--status 同一套拆分规则：多选、全角逗号、去空白', () => {
  assert.deepEqual(parseFilterLabels('离职-随时到岗，在职-月内到岗'), [
    '离职-随时到岗',
    '在职-月内到岗',
  ]);
});

test('--job-hop 的「时间≥1年」允许写成 >=：≥ 在键盘上打不出来', () => {
  assert.equal(normalizeFilterLabel('时间>=1年'), '时间≥1年');
  assert.equal(normalizeFilterLabel('时间≥1年'), '时间≥1年');
});

test('normalizeFilterLabel 不越权改别的字：只换 >= 并去两端空白', () => {
  assert.equal(normalizeFilterLabel('  5年少于3份 '), '5年少于3份');
  assert.equal(normalizeFilterLabel('QS 100'), 'QS 100');
});
