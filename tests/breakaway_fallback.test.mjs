/**
 * WMI 拉不起浏览器时的「显著告警 + 退回 spawn」路径。
 *
 * 为什么要 stub 测：这条路径在 **WMI 正常的机器上永远跑不到**，真实环境验收覆盖不了它
 * （recruiting-copilot#43 报告人最终验收时 WMI 是通的，告警块一次都没出现过）。
 * 所以把 powershell 换成一个必定起不来的可执行文件，让失败可复现。
 *
 * ⚠️ **本文件覆盖的是「失败可被察觉」这一半**：`spawnViaWmi` 失败时抛出的错误可定位，
 * 且 `warnBreakawayUnavailable` 吐出的告警块含用户真正需要的四样东西。
 * **没覆盖**「launchBrowser 接住错误后确实继续走 spawn」——那要真启动浏览器。
 * 改 `launchBrowser` 里那段 try/catch 时，请人工确认退回仍然成立（见 AGENTS.md 已登记的例外）。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { spawnViaWmi, warnBreakawayUnavailable } from '../dist/browser/cdp_browser.js';

/** 一个肯定不存在的可执行文件，execFile 必定 ENOENT。 */
const FAILING_EXE = 'boss-cli-nonexistent-powershell-stub.exe';

/** 收集一段代码里所有 console.error 的输出。 */
function captureStderr(fn) {
  const original = console.error;
  const lines = [];
  console.error = (...args) => lines.push(args.join(' '));
  try {
    fn();
  } finally {
    console.error = original;
  }
  return lines.join('\n');
}

test('WMI 起不来时 spawnViaWmi 抛错，且错误里带得出下一步动作', async () => {
  await assert.rejects(
    () => spawnViaWmi('chrome.exe --remote-debugging-port=53470', FAILING_EXE),
    (e) => {
      assert.ok(e instanceof Error);
      // 错误要能自解释：说清 WMI 是干嘛的、以及有哪个开关可走。
      assert.match(e.message, /WMI/);
      assert.match(e.message, /Job Object/);
      assert.match(e.message, /BOSS_SPAWN_BREAKAWAY=false/);
      return true;
    },
  );
});

test('告警块含用户真正需要的四样：原因 / 影响 / 自查命令 / 缓解办法', () => {
  const out = captureStderr(() => warnBreakawayUnavailable(new Error('spawn ENOENT')));

  // 原因要把底层报错原样带出来，不能吞。
  assert.match(out, /spawn ENOENT/);
  // 影响：说清代价，否则用户不知道退回意味着什么。
  assert.match(out, /Crashed/);
  assert.match(out, /风控/);
  // 自查：给得出可复制的命令，而不是让用户自己查 WMI 怎么测。
  assert.match(out, /Invoke-CimMethod/);
  assert.match(out, /ReturnValue/);
  // 缓解：告诉用户现在能做什么。
  assert.match(out, /boss shutdown/);
  assert.match(out, /BOSS_SPAWN_BREAKAWAY=false/);
});

test('告警是刷屏块不是一行 stderr——否则等于静默兜底，违反 AGENTS.md', () => {
  const out = captureStderr(() => warnBreakawayUnavailable(new Error('x')));
  assert.ok(out.split('\n').length >= 10, `告警只有 ${out.split('\n').length} 行，太容易被刷过去`);
  assert.match(out, /={20,}/);
});
