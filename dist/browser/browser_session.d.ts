import type { Browser, Page } from 'puppeteer-core';
/**
 * 在 {@link ensureBrowserSession} 之后返回当前已连接的 Browser；
 * 用于工具内单次获取句柄，避免与异步 ensure 不同步的 `getBrowser()` 竞态。
 */
export declare function ensureAndGetBrowser(): Promise<Browser | null>;
export declare function ensureBrowserSession(): Promise<void>;
export declare function getBrowserRef(): Browser | null;
export declare function getPageRef(): Page | null;
/**
 * 将当前会话的主操作页设为 `page`（须属于已连接的 `browserRef`）。
 * 供“导航/打开页面”类流程在新建或选中标签后同步，便于其它工具通过 `getPageRef` 复用。
 */
export declare function setSessionPage(page: Page): void;
/** 进程退出时断开 CDP，避免残留子进程 */
export declare function disconnectBrowserSession(): Promise<void>;
/**
 * 仅断开与浏览器的 CDP 连接，但不主动关闭浏览器进程。
 * 用于 `boss login` 这类“需要用户继续在浏览器里操作”的场景：
 * CLI 可以立刻退出，而浏览器窗口仍保留给用户完成登录。
 *
 * 必须在 disconnect 后对 Chrome 子进程 `unref`，否则 Node 会因子进程仍存活而无法退出。
 *
 * 注意：**绝不调用 `browser.close()`**——历史上在 disconnect 抛错时误走 close 会导致退出 CLI 时浏览器被关掉。
 */
export declare function detachBrowserSession(): Promise<void>;
//# sourceMappingURL=browser_session.d.ts.map