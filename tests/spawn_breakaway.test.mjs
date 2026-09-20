import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldBreakawayFromJob, toWindowsCommandLine } from '../dist/browser/cdp_browser.js';

/** 跑一段代码，跑完把开关环境变量还原成原样。 */
function withBreakawayEnv(value, fn) {
  const saved = process.env.BOSS_SPAWN_BREAKAWAY;
  try {
    if (value === undefined) delete process.env.BOSS_SPAWN_BREAKAWAY;
    else process.env.BOSS_SPAWN_BREAKAWAY = value;
    return fn();
  } finally {
    if (saved === undefined) delete process.env.BOSS_SPAWN_BREAKAWAY;
    else process.env.BOSS_SPAWN_BREAKAWAY = saved;
  }
}

const onWindows = process.platform === 'win32';

test('Windows 上默认脱离 Job Object：否则 CLI 一退出 Chrome 就被连带杀掉', () => {
  withBreakawayEnv(undefined, () => assert.equal(shouldBreakawayFromJob(), onWindows));
});

test('只有显式给假值才退回普通 spawn', () => {
  for (const v of ['false', 'FALSE', '0', 'no', 'n']) {
    withBreakawayEnv(v, () => assert.equal(shouldBreakawayFromJob(), false), v);
  }
});

test('无意义值不算关闭，仍按平台默认走', () => {
  for (const v of ['true', '1', 'yes', 'maybe', '']) {
    withBreakawayEnv(v, () => assert.equal(shouldBreakawayFromJob(), onWindows), v);
  }
});

test('非 Windows 没有 Job Object 问题，永远不走 WMI', () => {
  if (onWindows) return;
  withBreakawayEnv('true', () => assert.equal(shouldBreakawayFromJob(), false));
});

test('不含空白和引号的参数保持原样，不多加引号', () => {
  assert.equal(
    toWindowsCommandLine('C:\\chrome.exe', ['--headless=new', '--remote-debugging-port=53470']),
    'C:\\chrome.exe --headless=new --remote-debugging-port=53470',
  );
});

test('带空格的参数整体加引号：--screen-info 不加引号会被拆开，Chrome 直接启动失败', () => {
  assert.equal(
    toWindowsCommandLine('C:\\Program Files\\Google\\chrome.exe', [
      '--screen-info={0,0 1920x1080 workAreaBottom=40}',
    ]),
    '"C:\\Program Files\\Google\\chrome.exe" "--screen-info={0,0 1920x1080 workAreaBottom=40}"',
  );
});

test('参数内的双引号按 CreateProcess 语义转义', () => {
  assert.equal(toWindowsCommandLine('a.exe', ['say "hi"']), 'a.exe "say \\"hi\\""');
});

test('结尾反斜杠成对翻倍，不会把收尾引号吃掉', () => {
  assert.equal(
    toWindowsCommandLine('a.exe', ['--user-data-dir=C:\\my dir\\']),
    'a.exe "--user-data-dir=C:\\my dir\\\\"',
  );
});
