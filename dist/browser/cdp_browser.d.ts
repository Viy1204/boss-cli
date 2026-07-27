import { type Browser, type CDPSession, type Page } from 'puppeteer-core';
/**
 * 固定的远程调试端口：boss-cli 使用独立的 user-data-dir，因此可以稳定占用一个端口，
 * 让多个命令直接通过 `http://127.0.0.1:<port>/json/version` 复用同一只浏览器。
 * 可用 `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` 覆盖。
 */
export declare const REMOTE_DEBUGGING_PORT: number;
export declare function clearSpawnedChromeProcessRef(): void;
/** 最近一次启动是否为无头（仅本进程内、与当前会话一致时有效）。 */
export declare function wasLastChromeLaunchHeadless(): boolean;
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
 * - `BOSS_BROWSER_HEADLESS` — 设为 `true` 时启用无头；默认**有界面**。
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