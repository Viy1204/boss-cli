import assert from 'node:assert/strict';
import test from 'node:test';

import { SEARCH_POOL_CONTACT_LABEL_PATTERN, isChatCardDialog } from '../dist/toolset/normal-search.js';

const matches = (label) => new RegExp(SEARCH_POOL_CONTACT_LABEL_PATTERN).test(label);

// 平台 2026-10 改版把开聊按钮文案从「畅聊卡 N/M」换成「立即沟通(N/M)」，
// 而定位逻辑当时只认旧类名 btn-getcontact，于是所有搜索池招呼都报「卡片上没有按钮」。
// 这组用例锁住文案白名单，防止改版再次静默失效。
test('认得出平台当前的开聊按钮文案', () => {
  assert.equal(matches('立即沟通(30/140)'), true);
});

test('认得出旧版畅聊卡文案，改版回滚也不失效', () => {
  assert.equal(matches('畅聊卡 3/13'), true);
  assert.equal(matches('畅聊卡(3/13)'), true);
});

test('认得出继续沟通等变体', () => {
  assert.equal(matches('继续沟通'), true);
});

// 同一张卡片上「不感兴趣」就在开聊按钮旁边，误点会把候选人标成不合适且不可逆。
test('不能命中同卡片的其他操作按钮', () => {
  for (const label of ['不感兴趣', '查看简历', '收藏', '举报']) {
    assert.equal(matches(label), false, `${label} 不该被当成开聊按钮`);
  }
});

// 前缀锚定是有意的：宁可漏判（报错文案会列出卡片内按钮供排查），也不误点。
test('只认文案开头，不认出现在中间的', () => {
  assert.equal(matches('点击立即沟通'), false);
  assert.equal(matches('已沟通过'), false);
});

// 账号权益模式下卡片只显示「联系Ta」；它和畅聊卡是同一套搜索池额度，也要能点。
test('认得出账权模式下的「联系Ta」', () => {
  assert.equal(matches('联系Ta'), true);
  assert.equal(matches('联系TA'), true);
  assert.equal(matches('联系ta'), true);
});

// 两个弹层共用 .common-job-list-dialog，只能靠确认按钮文案区分：
// 账号权益走「立即沟通」，畅聊卡走「搜索畅聊卡(N/M)」。
// 判错就会点下「立即沟通」——账号权益耗尽时它**静默失败**（不报错也不建会话），
// 而 CLI 还回显「已确认发出招呼」。这条判据是本次修复的核心，必须锁住。
test('分得清畅聊卡弹层与账号权益弹层', () => {
  assert.equal(isChatCardDialog('搜索畅聊卡(3/13)'), true);
  assert.equal(isChatCardDialog('搜索畅聊卡 3/34'), true);
  assert.equal(isChatCardDialog('立即沟通'), false, '账号权益弹层不能当成畅聊卡');
  assert.equal(isChatCardDialog('立即沟通(30/140)'), false);
  assert.equal(isChatCardDialog('取消'), false);
  assert.equal(isChatCardDialog(''), false);
});
