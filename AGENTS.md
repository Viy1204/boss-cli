# 项目协作规则

## 基本原则

- 禁止添加任何回退逻辑（fallback）。
- 禁止添加掩盖根因的“胶水代码”。
- 默认采用单一路径、可预测行为；未经明确要求，不引入隐式分支。

## 失败处理

- 失败应直接暴露，不做静默兜底。
- 错误信息必须清晰、可定位，日志应包含关键上下文。
- 发现问题优先修复根因，不通过绕路方案规避。

### 已登记的例外（只有这一处，别再扩）

**`cdp_browser.ts` 的 `warnBreakawayUnavailable()`：WMI 拉不起浏览器时，刷屏级告警后退回普通
`spawn`。** 这是上面「禁止回退逻辑 / 不做静默兜底」的一处**有意例外**，删它之前先读完这段。

- **禁的是「静默」**。这里的告警是 72 字符分隔线的整块输出，含原因、影响、自查命令、缓解办法，
  用户不可能看不见，不属于「掩盖根因」。
- **硬失败比退回更糟**——这是**设计论证，不依赖任何一台机器的观测**：`spawnViaWmi` 一旦硬失败，
  `search` / `recommend` / `list` 全部不可用，用户唯一的出路是自己翻到 `BOSS_SPAWN_BREAKAWAY=false`；
  而那个开关 = 根本不试 WMI = 必然退回普通 spawn = 把 #43 原样装回去，**还绕过了本该提醒他的告警**。
  即：硬失败把用户推向一个比退回更坏、且更难察觉的状态。
  权衡：退回 = 浏览器可能被连带杀掉（可恢复，重扫一次码，且有告警）；硬失败 = CLI 完全不能用
  （不可恢复，除非用户自己翻到那个环境变量，然后掉进更坏的状态）。
- **退回的边界很窄**：只覆盖「WMI 创建进程」这一步。进程已创建但调试端口没起来仍然硬失败——
  那时端口上可能已有一只正在启动的 Chrome，再 spawn 一只会撞车。
- **回归保护**：本路径在 WMI 正常的机器上**跑不到**，所以靠 stub 测（把 powershell 换成必定失败的
  可执行文件），见 `tests/breakaway-fallback.test.mjs`。别指望真实环境验收能覆盖它。

> **史料更正（2026-09-21）**：本节最初写的立论依据是 recruiting-copilot#43 报告人「那台机器
> `Invoke-CimMethod Win32_Process Create` 返回 `ReturnValue=2`」。**该观测已被报告人当日撤回**——
> 那是他独立探测脚本的行为，不是 boss 实际调用路径的行为；boss 自己调用 WMI 在他那台是通的
> （Chrome 父进程 `WmiPrvSE.exe`，活过调用边界，登录态保住）。他上午观测到的「Chrome 每次被杀」
> 也有一半来自他为绕开硬失败而设的 `BOSS_SPAWN_BREAKAWAY=false`。
> **例外本身保留**：上面那条权衡不依赖这个观测，换任何 WMI 创建被拒的环境都成立。
> 留这段是因为——引用一条已撤回的事实，会让整条例外在下一个人核对时失去可信度。

新增别的回退前，先确认它同时满足「告警足够响」「硬失败的代价明显更大」「退回边界能说清楚」
三条，并登记到本节；说不清就别加。

## 变更约束

- 小步修改，保持最小必要改动。
- 不在未被要求的范围内扩散改动。
- 规则优先级：用户明确要求 > 本文件约束。

## 文档索引

- 页面 URL、命令功能和当前位置要求记录在 `docs/boss-url-map.md`。
- 修改导航、命令入口、当前位置校验或 help 文案前，先查阅并同步更新该文档。

## 浏览器默认无头（重要）

浏览器**默认以无头方式启动**，看不见窗口。有头窗口一启动就抢键盘焦点，会打断用户正在做的事，所以默认隐藏。

开关优先级（`resolveHeadlessFromEnv()`，`src/browser/cdp_browser.ts`）：

1. `BOSS_BROWSER_HEADLESS` —— 本 CLI 专属，显式覆盖，认 `true/1/yes/y` 与 `false/0/no/n`
2. `RECRUIT_BROWSER_HIDDEN` —— 招聘工具链共读的单一来源（boss-cli / liepin-cli / DSH 面板都认），设 `false` 退回有头
3. 都没设 → **无头**

**要让浏览器可见时**（用户说"我看不到浏览器"、"让我看看它在干什么"、需要人工介入页面）：

```bash
RECRUIT_BROWSER_HIDDEN=false boss <cmd>    # 或 BOSS_BROWSER_HEADLESS=false
```

已经有一只无头实例在跑时，换了变量也**不会**自动变可见 —— 端口上已有实例会被直接复用。先 `boss shutdown` 关掉那只，下条命令才会按新模式重启。

浏览器**跨命令常驻**（一次性命令结束只 detach CDP，不关窗口），`boss shutdown` 是唯一的显式退出口。别在命令路径里加关浏览器的逻辑。名字不叫 `quit` 是因为交互模式里 `exit` / `quit` 已经是退出 REPL 的别名。

**判断在跑的实例是什么模式**：读 `http://127.0.0.1:53470/json/version` 的 `User-Agent`，含 `HeadlessChrome` 即无头（`probeRemoteHeadless()`）。**不要**用进程内变量判断 —— 一次性命令刚起进程时那些变量都是空的，`login.ts` 曾因此把登录页开在看不见的浏览器里。

`login` 是例外：扫码必须可见，它会自己探测并把无头实例关掉重启为有头。登录态在 `~/.boss-cli/.cache/` 的 user-data-dir 里，重启不丢。

无头下额外带 `--screen-info={0,0 1920x1080 workAreaBottom=40}`：无头虚拟屏默认 800x600 是已知的强自动化指纹，而 `--window-size` 抬不动它，只有 `--screen-info` 能（Chrome 142+，仅无头有效）。**四个 workArea 参数必须分开写**（`workAreaTop/Bottom/Left/Right`），写成 `workArea=` 会让 Chrome 直接启动失败。

## Puppeteer evaluate 约束（重要）

- 在工具代码中，避免使用 `page.evaluate(() => { ... })` / `page.waitForFunction(() => { ... })` 的函数写法。
- 统一改为字符串脚本写法（如 `page.evaluate("(() => { ... })()")`），避免构建后注入辅助符号导致浏览器上下文报错 `__name is not defined`。
- 出现 `__name is not defined` 时，优先检查最近新增的 evaluate / waitForFunction 回调并改成字符串脚本，不要加兜底掩盖问题。
