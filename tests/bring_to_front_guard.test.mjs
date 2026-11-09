import assert from 'node:assert/strict';
import test from 'node:test';

import { decideBringToFront, resolveNoForegroundFromEnv } from '../dist/browser/cdp_browser.js';

function withEnv(value, fn) {
  const saved = process.env.BOSS_BROWSER_NO_FOREGROUND;
  try {
    if (value === undefined) delete process.env.BOSS_BROWSER_NO_FOREGROUND;
    else process.env.BOSS_BROWSER_NO_FOREGROUND = value;
    return fn();
  } finally {
    if (saved === undefined) delete process.env.BOSS_BROWSER_NO_FOREGROUND;
    else process.env.BOSS_BROWSER_NO_FOREGROUND = saved;
  }
}

test('普通命令默认不前置，未配置或空值采用相同默认策略', () => {
  for (const value of [undefined, '', '   ']) {
    withEnv(value, () => {
      const noForeground = resolveNoForegroundFromEnv();
      assert.equal(noForeground, true, 'DEFAULT_NO_FOREGROUND');
      assert.equal(decideBringToFront('normal', noForeground), 'skipped-env');
      assert.equal(decideBringToFront(undefined, noForeground), 'skipped-env');
    });
  }
});

test('人把窗口最小化了，即使显式允许前置也不能把它拽回前台', () => {
  assert.equal(decideBringToFront('minimized', false), 'skipped-minimized');
});

test('BOSS_BROWSER_NO_FOREGROUND 真值明确禁止前置', () => {
  for (const value of ['true', '1', 'yes', 'Y']) {
    withEnv(value, () => assert.equal(resolveNoForegroundFromEnv(), true), value);
  }
  assert.equal(decideBringToFront('normal', true), 'skipped-env');
});

test('显式关闭不前置策略时保留原有激活行为', () => {
  for (const value of ['false', 'FALSE', '0', 'no', 'N', 'maybe']) {
    withEnv(value, () => assert.equal(resolveNoForegroundFromEnv(), false), value);
  }
  withEnv('false', () => {
    assert.equal(decideBringToFront('normal', resolveNoForegroundFromEnv()), 'raised');
    assert.equal(decideBringToFront(undefined, resolveNoForegroundFromEnv()), 'raised');
  });
});
