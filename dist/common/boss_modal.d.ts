import type { Page } from 'puppeteer-core';
/**
 * 关闭当前可见的 Boss 弹层（通常同一时刻只会出现一个）。
 * 覆盖 `.boss-popup__wrapper` / `.boss-dialog__wrapper` / `.dialog-container`，
 * 以及含 c-resume 的简历预览层（`.close-btn`）。
 * 会在主文档与各子 frame 中尝试。返回是否执行了关闭。
 */
export declare function closeBossModalIfPresent(page: Page): Promise<boolean>;
/**
 * 轮询直到出现可见弹层并关闭，或超时。
 * 用于操作完成后清理延迟出现的提示框（如「当前职位尚未开放」）。
 */
export declare function waitAndCloseBossModalIfPresent(page: Page, timeoutMs: number): Promise<boolean>;
//# sourceMappingURL=boss_modal.d.ts.map