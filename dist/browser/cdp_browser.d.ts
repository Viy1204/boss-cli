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
 * 优先级：`BOSS_BROWSER_HEADLESS`（本 CLI 专属，显式覆盖）> `RECRUIT_BROWSER_HIDDEN`
 * （招聘工具链共读的单一来源）> 默认 **true**。
 *
 * 默认隐藏是有意的：招聘浏览器不该抢前景与键盘焦点。想看见窗口设
 * `RECRUIT_BROWSER_HIDDEN=false`（或 `BOSS_BROWSER_HEADLESS=false`）。
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
 * - `RECRUIT_BROWSER_HIDDEN` — 招聘工具链共读的隐藏开关；**默认无头**，设为 `false` 退回有界面。
 * - `BOSS_BROWSER_HEADLESS` — 本 CLI 专属覆盖项，优先级高于 `RECRUIT_BROWSER_HIDDEN`。
 * - `BOSS_BROWSER_VIEWPORT_WIDTH` / `BOSS_BROWSER_VIEWPORT_HEIGHT` — 启动时显式指定视口；未设置时不覆盖浏览器窗口尺寸
 */
/** 启动浏览器时的默认视口（与环境变量一致）；截图恢复时 `viewport()` 为 null 也可用其兜底。 */
export declare function defaultViewportFromEnv(): {
    width: number;
    height: number;
};
export declare function connectBrowser(options?: ConnectBrowserOptions): Promise<Browser>;
/** 对某一页创建原生 CDP Session（需要低层域如 `Network.*`、`Fetch.*` 时使用）。 */
export declare function createPageCDPSession(page: Page): Promise<CDPSession>;
//# sourceMappingURL=cdp_browser.d.ts.map