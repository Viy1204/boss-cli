import type { ElementHandle, Frame, Page } from 'puppeteer-core';
/** 在线简历 iframe：`src` 常为相对路径 `/web/frame/c-resume/...`，故用子串匹配 */
export declare const C_RESUME_IFRAME_SELECTOR: "iframe[src*=\"c-resume\"], iframe[src*=\"frame/c-resume\"]";
export declare function frameHasVisibleCResumeIframe(frame: Frame): Promise<boolean>;
/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export declare function safeResumeScreenshotFileBase(name: string): string;
/**
 * 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。含 `.boss-popup__close`、`.btn-quxiao`（取消）等。会在主文档与各子 frame 中尝试。
 *
 * 返回是否确认关净。**点到关闭按钮不等于关掉了**——关不净时旧面板会留在 DOM 里，
 * 后续截图会命中残留的旧 iframe（只有水印、没有正文），所以这里必须回报真实结果。
 */
export declare function closeCResumePanel(page: Page): Promise<boolean>;
/** 当前可见的 c-resume iframe 数量；>1 说明上一次弹层没关净。 */
export declare function countVisibleCResumeIframes(page: Page): Promise<number>;
/**
 * 取**最后**一个可见 c-resume iframe。
 * 旧实现取第一个，一旦有残留旧面板就会一直截到那个空壳（recruiting-copilot#37）。
 */
export declare function findVisibleCResumeIframeHandle(page: Page): Promise<ElementHandle<Element> | null>;
/**
 * 等到 c-resume iframe 可见且内容就绪。
 * 只拿到「壳就绪」（`shell`）时不提前返回，会继续轮询到 `timeoutMs`——多等一会儿是纯收益，
 * 且到点仍只有壳时返回值与旧行为一致（true），不引入新的硬失败。
 */
export declare function waitForVisibleCResumeIframeReady(page: Page, timeoutMs?: number): Promise<boolean>;
export declare function blankBytesPerPixelThreshold(): number;
/**
 * 按「PNG 字节 / 像素」判 PNG 是否只有水印。
 * `borderline` 指虽然过线但不到阈值 2 倍——阈值本身是经验值，边缘样本要让用户看见以便校准。
 */
export declare function classifyResumeCaptureDensity(byteLength: number, pixels: number, threshold?: number): {
    verdict: 'blank' | 'borderline' | 'ok';
    density: number;
};
export type CResumeCaptureOutcome = {
    ok: boolean;
    /** 失败原因；`ok: true` 时为空 */
    detail?: string;
    /** 疑似空壳：PNG 已落盘供排查，但正文没渲染出来 */
    blankShell?: boolean;
    /** 截图前可见的 c-resume iframe 数；>1 表示上一次弹层没关净 */
    visibleIframes?: number;
};
/**
 * 在已出现 `c-resume` iframe 的页面上，对 iframe 整框截图并关闭弹层。
 * `preOpenViewport` 为打开弹层前的视口快照，请用 `snapshotBossPageViewport(page)`（`page.viewport()` 常为 null 时勿直接用默认尺寸）。
 */
export declare function captureCResumeIframeToFile(page: Page, preOpenViewport: Awaited<ReturnType<Page['viewport']>>, absPath: string): Promise<CResumeCaptureOutcome>;
//# sourceMappingURL=c_resume_capture.d.ts.map