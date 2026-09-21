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
  ageTokenToLabel,
  defaultSearchCityFromEnv,
  expSliderLabel,
  expTokenToIndex,
  normalizeFilterLabel,
  parseFilterLabels,
  parseRangeArg,
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

test('--exp-range / --age-range 的区间拆分，半角全角连字符和波浪号都收', () => {
  assert.deepEqual(parseRangeArg('3-8'), { min: '3', max: '8' });
  assert.deepEqual(parseRangeArg(' 23 － 27 '), { min: '23', max: '27' });
  assert.deepEqual(parseRangeArg('1~5'), { min: '1', max: '5' });
});

test('区间写不成两段就报错，不猜用户想要哪一头', () => {
  assert.throws(() => parseRangeArg('3'), /两段/);
  assert.throws(() => parseRangeArg(''), /两段/);
});

test('经验档位：1=在校/应届，n年=n+1 档，10+ 是最后一档', () => {
  assert.equal(expTokenToIndex('应届'), 1);
  assert.equal(expTokenToIndex('3'), 4);
  assert.equal(expTokenToIndex('3年'), 4);
  assert.equal(expTokenToIndex('10'), 11);
  assert.equal(expTokenToIndex('10+'), 12);
});

test('经验档位反向取文案，和页面上 tooltip 实测到的一致', () => {
  assert.equal(expSliderLabel(1), '在校/应届');
  assert.equal(expSliderLabel(4), '3年');
  assert.equal(expSliderLabel(11), '10年');
  assert.equal(expSliderLabel(12), '10年以上');
});

test('经验档位超范围直接报错：拖错一格＝搜错人群且用户看不出来', () => {
  assert.throws(() => expTokenToIndex('11'), /应届/);
  assert.throws(() => expTokenToIndex('abc'), /应届/);
});

test('年龄区间转成下拉里的文案', () => {
  assert.equal(ageTokenToLabel('23'), '23岁');
  assert.equal(ageTokenToLabel('23岁'), '23岁');
  assert.equal(ageTokenToLabel('46+'), '46岁+');
});

test('年龄超出页面给的 16-46 直接报错', () => {
  assert.throws(() => ageTokenToLabel('15'), /16-46/);
  assert.throws(() => ageTokenToLabel('47'), /16-46/);
});
