/**
 * 浏览器：CDP 连接与会话（统一出口）。
 */
export * from './timing.js';
export * from './human_delay.js';
export { resumeHeight, setTempHeight, snapshotBossPageViewport, type BossViewportSnapshot, } from './viewport_temp.js';
export { bringToFrontUnlessMinimized, type BringToFrontOutcome, connectBrowser, createPageCDPSession, decideBringToFront, defaultViewportFromEnv, LAUNCH_ARGS_ALLOW_ALL_CORS, LAUNCH_ARGS_LESS_AUTOMATION, type ConnectBrowserOptions, closeRemoteBrowser, probeRemoteHeadless, resolveHeadlessFromEnv, resolveNoForegroundFromEnv, REMOTE_DEBUGGING_PORT, withWindowVisible, } from './cdp_browser.js';
export { detachBrowserSession, disconnectBrowserSession, ensureAndGetBrowser, ensureBrowserSession, getBrowserRef, getPageRef, setSessionPage, } from './browser_session.js';
//# sourceMappingURL=index.d.ts.map