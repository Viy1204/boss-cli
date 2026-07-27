import type { Page } from 'puppeteer-core';
type ViewportState = Awaited<ReturnType<Page['viewport']>>;
export type BossViewportSnapshot = NonNullable<ViewportState>;
/**
 * 供临时拉高/恢复视口使用。未设置 Puppeteer 固定视口时 `page.viewport()` 常为 `null`；
 * 若此时仍用 {@link defaultViewportFromEnv}（如 1280×1200）恢复，会改掉用户真实窗口对应的布局视口。
 * 在打开弹层/截图**之前**调用，用页面 `innerWidth`/`innerHeight` 作为恢复基准。
 */
export declare function snapshotBossPageViewport(page: Page): Promise<BossViewportSnapshot>;
/** 截图前临时拉高视口高度；`prev` 一般为进入流程前 `await page.viewport()` 的快照。 */
export declare function setTempHeight(page: Page, prev: ViewportState, heightPx?: number): Promise<void>;
/** 与 {@link setTempHeight} 配对，恢复截图前的视口。 */
export declare function resumeHeight(page: Page, prev: ViewportState): Promise<void>;
export {};
//# sourceMappingURL=viewport_temp.d.ts.map