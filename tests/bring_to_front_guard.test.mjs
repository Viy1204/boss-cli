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

test('默认允许抢前台，兼容原有行为', () => {
  withEnv(undefined, () => assert.equal(resolveNoForegroundFromEnv(), false));
  assert.equal(decideBringToFront('normal', false), 'raised');
  assert.equal(decideBringToFront(undefined, false), 'raised');
});

test('人把窗口最小化了，命令不能把它拽回前台', () => {
  assert.equal(decideBringToFront('minimized', false), 'skipped-minimized');
});

test('BOSS_BROWSER_NO_FOREGROUND 显式关闭后任何状态都不抢', () => {
  for (const v of ['true', '1', 'yes', 'Y']) {
    withEnv(v, () => assert.equal(resolveNoForegroundFromEnv(), true), v);
  }
  assert.equal(decideBringToFront('normal', true), 'skipped-env');
  for (const v of ['false', '0', '', 'maybe']) {
    withEnv(v, () => assert.equal(resolveNoForegroundFromEnv(), false), v);
  }
});
