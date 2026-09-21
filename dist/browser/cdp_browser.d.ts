import { type Browser, type CDPSession, type Page } from 'puppeteer-core';
/**
 * 固定的远程调试端口：boss-cli 使用独立的 user-data-dir，因此可以稳定占用一个端口，
 * 让多个命令直接通过 `http://127.0.0.1:<port>/json/version` 复用同一只浏览器。
 * 可用 `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` 覆盖。
 */
export declare const REMOTE_DEBUGGING_PORT: number;
export declare function clearSpawnedChromeProcessRef(): void;
/**
 * 是否以无头（隐藏）方式启动。
 *
 * 优先级：`BOSS_BROWSER_HEADLESS`（本 CLI 专属）> `RECRUIT_BROWSER_HIDDEN`（招聘工具链共读的
 * 统一覆盖开关，**只在显式设置时生效**）> **BOSS 自己的默认：有头**，与上游 `joohw/boss-cli` 一致。
 *
 * **2026-08-19：默认从无头翻回有头。** 本 fork 曾把默认改成无头，理由是招聘浏览器不该
 * 抢前景与键盘焦点，当时对代价的评估是「UA 里多个 `HeadlessChrome`，没有观测到实际危害」。
 * 现在观测到了：
 *
 * - 一个账号被 BOSS 限制 web 端登录，页面文案明确写「检测到您的账号存在使用第三方招聘
 *   管理系统、插件、外挂、软件等辅助工具」——判定的是**工具指纹**，不是打招呼频率。
 * - 另一个团队用上游版（默认有头）长期没事，他们的 AI 擅自改走无头之后当天封号。
 *
 * 两个独立样本都指向无头。抢焦点是体验问题，被限 web 端登录是业务问题。
 * 真要无头，显式设 `RECRUIT_BROWSER_HIDDEN=true`（或 `BOSS_BROWSER_HEADLESS=true`），
 * 并且清楚这是在拿账号冒险。
 *
 * **liepin-cli 那边默认仍是无头**：猎聘的风控形态一次都没观测过，没有证据支持翻它的默认。
 * 所以共读变量是「统一覆盖」而非「提供默认值」——不设时两个 CLI 各用自己的默认。
 */
export declare function resolveHeadlessFromEnv(): boolean;
/**
 * 探测固定调试端口上已在跑的那只浏览器是不是无头：读 `/json/version` 的
 * User-Agent，无头 Chrome 报 `HeadlessChrome/<ver>`，有头报 `Chrome/<ver>`
 * （实测确认，这是两种模式之间唯一的指纹差异）。
 *
 * 必须这样读**进程外的真实状态**：一次性命令（如 `boss login`）刚起进程时，
 * 任何进程内变量都是空的，靠它们判断等于不判断。
 *
 * 返回 null 表示端口上没有实例在跑。
 *
 * ⚠️ 一旦决定伪装 UA 来规避指纹，这个判据就失效，需要换信号。
 */
export declare function probeRemoteHeadless(port?: number, timeoutMs?: number): Promise<boolean | null>;
/**
 * 关掉固定端口上已在跑的浏览器（本进程没有它的引用时用，例如一次性命令要切换模式）。
 * 登录态在 user-data-dir 里，不会因此丢失。
 */
export declare function closeRemoteBrowser(port?: number): Promise<boolean>;
/**
 * 把 exe + argv 拼成一条 Windows 命令行（`CreateProcess` 的 `lpCommandLine` 语义）：
 * 含空白或引号的参数整体加双引号，内部 `"` 前补反斜杠，结尾反斜杠成对翻倍。
 *
 * `--screen-info={0,0 1920x1080 workAreaBottom=40}` 这类带空格的参数不加引号会被拆成多个
 * 参数，Chrome 直接启动失败。`spawn()` 在 Windows 上由 libuv 做同样的拼接，走 WMI 就得自己做。
 */
export declare function toWindowsCommandLine(exe: string, args: readonly string[]): string;
/**
 * Windows 上是否让浏览器脱离调用方的 Job Object（默认开；`BOSS_SPAWN_BREAKAWAY=false` 关）。
 *
 * recruiting-copilot#43（与 liepin-cli#21 同因）：从 AI Agent 宿主调用 CLI 时，宿主会把整棵
 * 进程树放进一个 `KILL_ON_JOB_CLOSE` 的 Job Object。`spawn({ detached: true })` 在 Windows 上
 * 只是新建进程组，**逃不出 Job**，于是 CLI 进程一结束 Chrome 就被连带 `TerminateProcess`：
 * profile 留下 `exit_type: Crashed`，会话级 cookie 随进程消失，只能反复重新扫码——而高频
 * 重登本身就是平台风控信号。
 */
export declare function shouldBreakawayFromJob(): boolean;
/**
 * 经 WMI `Win32_Process.Create` 拉起浏览器：进程由系统服务 `WmiPrvSE.exe` 创建，因此不在
 * 调用方的 Job Object 里，但仍属于当前交互登录会话（有头窗口照常可见）。
 * 命令行经环境变量交给 PowerShell，省掉再套一层引号转义。
 *
 * 抛错由调用方接住并**显著告警后退回 `spawn`**，理由见 `warnBreakawayUnavailable`。
 *
 * **WMI 被策略拒时的备选（备查，未实现）**：`explorer.exe <临时 .cmd>` 借 shell 重新 parent，
 * 同样能脱离调用方的 Job。recruiting-copilot#43 实测有效——心跳文件跨两次调用边界活了 33 秒，
 * 同批对照组的普通 detached spawn 立即被杀。参数转义不要让 explorer 直接携带 chrome 的参数，
 * 全写进 .cmd 内部；PID 靠调试端口回探，或让 .cmd 自己把子进程 pid 写进临时文件。
 * **没实现是权衡后的结果**：留临时文件、拿不到可靠 pid、多一层 shell，而真正需要它的环境
 * 恰恰是 WMI 起不来的那种——不值得为此把主路径复杂化。要用再说。
 *
 * 另两条已排除：`CREATE_BREAKAWAY_FROM_JOB` 死路（#43 实测 WinError 5，对照组只带
 * `DETACHED_PROCESS` 成功 ⇒ 外层 Job 没设 `JOB_OBJECT_LIMIT_BREAKAWAY_OK`）；`schtasks`
 * **未得出结论**（报告人宿主的程序黑名单把它拦在启动前，不是 Windows 拒的，别当成不可行的证据）。
 */
export declare function spawnViaWmi(commandLine: string, 
/** 仅供测试注入必定失败的 stub；生产路径永远用默认值。 */
powershellExe?: string): Promise<number>;
/**
 * WMI 拉不起来时的显著告警。打完这条就退回普通 `spawn`。
 *
 * **这是 AGENTS.md「禁止回退逻辑 / 失败直接暴露」的一处有意例外，别顺手删掉。**
 * 那条规则禁的是**静默**兜底；这里告警是刷屏级的，用户不可能看不见，不属于「掩盖根因」。
 *
 * 为什么必须退回（recruiting-copilot#43 验收反馈，2026-09-21）：报告人那台 Windows 上
 * `Invoke-CimMethod Win32_Process Create` 返回 `ReturnValue=2`（拒绝访问）——读操作正常，
 * 单单「创建进程」被策略拒了。硬失败的结果是 `search` / `recommend` / `list` 全部不可用，
 * 他只能设 `BOSS_SPAWN_BREAKAWAY=false` 兜住，而那恰好把 #43 原样装回去，还绕过了这条告警。
 * 权衡很清楚：**退回后是「浏览器可能被连带杀掉」（可恢复，重扫码），硬失败是「CLI 完全不能用」**
 * （不可恢复，除非用户自己找到那个环境变量）。前者更轻，且带告警时用户知道自己在什么状态。
 *
 * 退回**只覆盖「WMI 创建进程失败」这一步**。进程已创建但调试端口没起来，仍然硬失败——
 * 那时候端口上可能已经有一只正在启动的 Chrome，再 spawn 一只会撞车。
 */
export declare function warnBreakawayUnavailable(cause: unknown): void;
/** 减轻「正受到自动测试软件的控制」提示与常见自动化特征（非万能，站点仍可能用其它方式检测）。手动开 Chrome 并接 CDP 时可复用。 */
export declare const LAUNCH_ARGS_LESS_AUTOMATION: readonly ["--disable-infobars"];
/** 仅用于本地调试：尽量放宽同源/CORS 限制，便于跨域 iframe/canvas 处理。 */
export declare const LAUNCH_ARGS_ALLOW_ALL_CORS: readonly ["--disable-web-security", "--allow-running-insecure-content"];
export type ConnectBrowserOptions = {
    /** 用于启动本机 Chrome/Edge */
    executablePath?: string;
    /** 启动浏览器时复用的用户数据目录（登录态/缓存等） */
    userDataDir?: string;
    /** 启动浏览器时指定 profile（如 `Default` / `Profile 1`） */
    profileDirectory?: string;
    /** 默认 `false`（有界面）。也可用环境变量 `BOSS_BROWSER_HEADLESS=true` 开无头。 */
    headless?: boolean;
    /** 仅本地调试用：放宽同源/CORS 策略（高风险，默认关闭）。 */
    allowAllCors?: boolean;
};
/**
 * 启动本机浏览器（puppeteer-core 底层为 Chrome DevTools Protocol）。
 *
 * 环境变量（可选）：
 * - `CHROME_PATH` / `PUPPETEER_EXECUTABLE_PATH` — 启动本机浏览器可执行文件路径（高于自动探测）
 * - `BOSS_BROWSER_USER_DATA_DIR` — 启动浏览器时复用的用户数据目录；未设置时默认 `~/.boss-cli/.cache/browser-data`
 * - `BOSS_BROWSER_PROFILE_DIRECTORY` — 启动浏览器时指定 profile（如 `Default`）
 * - `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` — 远程调试端口（默认 53470）；同一 user-data-dir 跨命令复用该端口
 * - `BOSS_BROWSER_ALLOW_ALL_CORS` — 设为 `true` 时附加放宽同源/CORS 的启动参数（仅调试）
 * - `BOSS_BROWSER_DISABLE_GPU` — 设为 `true` 时附加 `--disable-gpu`
 *
 * 若以上均未设置，会按系统尝试常见 Chrome / Edge / Chromium 安装路径。
 * - `RECRUIT_BROWSER_HIDDEN` — 招聘工具链共读的隐藏开关；**默认有界面**，设为 `true` 才无头（有账号风险，见 `resolveHeadlessFromEnv`）。
 * - `BOSS_BROWSER_HEADLESS` — 本 CLI 专属覆盖项，优先级高于 `RECRUIT_BROWSER_HIDDEN`。
 * - `BOSS_BROWSER_VIEWPORT_WIDTH` / `BOSS_BROWSER_VIEWPORT_HEIGHT` — 启动时显式指定视口；未设置时不覆盖浏览器窗口尺寸
 */
/** 启动浏览器时的默认视口（与环境变量一致）；截图恢复时 `viewport()` 为 null 也可用其兜底。 */
export declare function defaultViewportFromEnv(): {
    width: number;
    height: number;
};
export declare function connectBrowser(options?: ConnectBrowserOptions): Promise<Browser>;
/**
 * 是否禁止 CLI 把 Boss 窗口抢到前台。
 *
 * 默认允许：`page.bringToFront()` 走 `Target.activateTarget`，Windows 上会把**最小化**的窗口
 * 还原并夺取前台焦点。把 CLI 接进后台系统定时跑的人（例如把 boss-cli 打通到内部招聘系统）
 * 会被每条命令弹一次窗口打断办公，所以给一个显式关闭项。
 */
export declare function resolveNoForegroundFromEnv(): boolean;
export type BringToFrontOutcome = 'raised' | 'skipped-env' | 'skipped-minimized';
/**
 * 判定这次要不要抢前台：环境变量关了 → 不抢；窗口已被人最小化 → 不抢（尊重人的选择）；
 * 其余情况照旧。抽出来是为了让判定逻辑不依赖真实浏览器就能测。
 */
export declare function decideBringToFront(windowState: string | undefined, noForeground: boolean): BringToFrontOutcome;
/**
 * `page.bringToFront()` 的替代：先问 `Browser.getWindowForTarget` 窗口状态，最小化就不动它。
 * 单标签窗口下不抢前台对自动化没有影响；CDP 操作不需要窗口可见。
 */
export declare function bringToFrontUnlessMinimized(page: Page): Promise<BringToFrontOutcome>;
/**
 * 需要真实渲染的操作（在线简历 canvas、截图）在**最小化**窗口里会永远等不到新帧
 * （实测 `Page.captureScreenshot` 第二次起就挂死）。这里临时把窗口还原成 normal，
 * 跑完立刻再最小化——短暂闪一下，但不把「最小化」这个人的选择永久推翻。
 * 窗口本来没最小化时什么都不做。
 */
export declare function withWindowVisible<T>(page: Page, fn: () => Promise<T>): Promise<T>;
/** 对某一页创建原生 CDP Session（需要低层域如 `Network.*`、`Fetch.*` 时使用）。 */
export declare function createPageCDPSession(page: Page): Promise<CDPSession>;
//# sourceMappingURL=cdp_browser.d.ts.map