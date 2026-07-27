import type { Page } from 'puppeteer-core';
/**
 * 轮询直到出现 c-resume iframe、或出现付费墙、或超时。
 * c-resume 可能在主文档，也可能在 `recommendFrame` 等子 frame 内（推荐预览），故遍历 {@link Page.frames}。
 */
export declare function waitForCResumeIframeOrPaywall(page: Page, timeoutMs?: number): Promise<'iframe' | 'paywall' | 'neither'>;
/**
 * 单次探测：主文档是否当前正显示付费弹层（与 {@link describeBossPaywallPopupIfPresent} 判定一致）。
 * 供合并轮询（同一循环内同时检测多类弹层）使用，避免重复编写检测脚本。
 */
export declare function detectBossPaywallPopup(page: Page): Promise<boolean>;
/**
 * 打招呼等操作后，轮询主文档是否出现付费弹层（与 {@link describeBossPaywallPopupIfPresent} 判定一致）。
 * 命中则返回 true；超时未出现则返回 false。
 */
export declare function waitForBossPaywallPopup(page: Page, timeoutMs?: number): Promise<boolean>;
/**
 * 若当前存在 VIP/付费类弹层（判定规则与 {@link describeBossPaywallPopupIfPresent} 一致），
 * 则点击关闭按钮以恢复页面可操作状态。返回是否执行了关闭。
 */
export declare function closeBossPaywallPopupIfPresent(page: Page): Promise<boolean>;
/**
 * 检测 Boss 页面上是否出现 VIP/付费购买类弹层（如点击「在线简历」、推荐预览或打招呼后拦截权益时）。
 * 命中则返回简短中文说明，供与「未出现 c-resume iframe」类错误拼接。
 * @param purpose `greet` 时将「查看在线简历」类措辞改为适合打招呼的说明。
 */
export declare function describeBossPaywallPopupIfPresent(page: Page, purpose?: 'resume' | 'greet'): Promise<string | null>;
//# sourceMappingURL=boss_paywall_popup.d.ts.map