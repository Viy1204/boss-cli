/**
 * Boss B 端「主壳」会话：选页、必要时进入沟通页、侧栏 `.menu-list` 探测，
 * 再执行 {@link withBossSessionPage} 回调。与 `src/toolset/chat.ts`（按姓名打开会话等业务）无关。
 */
import type { Page } from 'puppeteer-core';
type BossSessionPageOptions = {
    ensureChatShell?: boolean;
    ensureMenuList?: boolean;
};
/**
 * 先按 URL 判断：不在 Boss 已登录主壳页（`/web/chat/*`）时跳到沟通页 `/web/chat/index`，
 * 再交由 {@link ensureMenuListMountedAfterLoad} 查 `.menu-list`。
 * 已经在 `/web/chat/recommend`、`/web/chat/aiform` 等主壳子页时直接跳过 goto，
 * 避免触发"先回到聊天页再切回业务页"的额外跳转。
 */
/** 页面守卫熔断（风控页反弹 / 自刷新循环）导致的中止，与普通页面异常区分开。 */
export declare class BossPageRiskError extends Error {
    constructor(message: string);
}
/**
 * 在已连接浏览器、且当前页为 Boss 主壳（含侧栏 `.menu-list`）的前提下执行回调。
 * 默认会先按 URL 确保落在 `/web/chat/*` 主壳页（已在主壳子页则保留原路径，否则跳回沟通页 `/web/chat/index`），
 * 再校验侧栏；需要严格使用当前页面的命令可通过 options 关闭这些预检查。
 */
export declare function withBossSessionPage<T>(callback: (page: Page) => Promise<T>, options?: BossSessionPageOptions): Promise<T>;
export {};
//# sourceMappingURL=boss_session_page.d.ts.map