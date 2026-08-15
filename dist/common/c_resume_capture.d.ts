import type { ElementHandle, Frame, Page } from 'puppeteer-core';
/** 在线简历 iframe：`src` 常为相对路径 `/web/frame/c-resume/...`，故用子串匹配 */
export declare const C_RESUME_IFRAME_SELECTOR: "iframe[src*=\"c-resume\"], iframe[src*=\"frame/c-resume\"]";
export declare function frameHasVisibleCResumeIframe(frame: Frame): Promise<boolean>;
/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export declare function safeResumeScreenshotFileBase(name: string): string;
/** 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。含 `.boss-popup__close`、`.btn-quxiao`（取消）等。会在主文档与各子 frame 中尝试。 */
export declare function closeCResumePanel(page: Page): Promise<void>;
/**
 * 在任意 frame（含主 frame、`recommendFrame` 等）中查找已挂载且尺寸可见的 c-resume iframe。
 */
export declare function findVisibleCResumeIframeHandle(page: Page): Promise<ElementHandle<Element> | null>;
export declare function waitForVisibleCResumeIframeReady(page: Page, timeoutMs?: number): Promise<boolean>;
/**
 * 在已出现 `c-resume` iframe 的页面上，对 iframe 整框截图并关闭弹层。
 * `preOpenViewport` 为打开弹层前的视口快照，请用 `snapshotBossPageViewport(page)`（`page.viewport()` 常为 null 时勿直接用默认尺寸）。
 */
export declare function captureCResumeIframeToFile(page: Page, preOpenViewport: Awaited<ReturnType<Page['viewport']>>, absPath: string): Promise<boolean>;
//# sourceMappingURL=c_resume_capture.d.ts.map