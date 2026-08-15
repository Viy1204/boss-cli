/**
 * Boss 直聘 URL 约定、登录态探测文案与 `Page` 上只读探测（不连 CDP、不启动浏览器）。
 */
import type { Page } from 'puppeteer-core';
/** Boss 直聘首页 */
export declare const BOSS_ZHIPIN_HOME = "https://www.zhipin.com/";
/** 默认落地页（杭州 SEO 首页）；CLI 等未配置环境变量时使用 */
export declare const BOSS_DEFAULT_LANDING_URL = "https://www.zhipin.com/hangzhou/?seoRefer=index";
/** 沟通页（登录成功后的典型落地页之一） */
export declare const BOSS_CHAT_INDEX_URL = "https://www.zhipin.com/web/chat/index";
/** 尚未有可用的浏览器会话时的提示文本（供工具抛错复用）。 */
export declare function createWaitManualLoginRequiredText(action: string): string;
/** 当前 URL 是否属于 Boss 直聘站点（hostname 含 `zhipin.com`）；`about:blank` / 空 / 非法视为否 */
export declare function isBossZhipinSiteUrl(url: string): boolean;
/** 当前 URL 是否为沟通页 `/web/chat/index`（允许带 query） */
export declare function isBossChatIndexUrl(url: string): boolean;
/**
 * 是否已经位于 Boss 已登录主壳页（pathname 以 `/web/chat/` 开头）。
 * 当前已知主壳页：`/web/chat/index`、`/web/chat/recommend`、`/web/chat/aiform`、`/web/chat/job/list`。
 * 它们共享同一套侧栏 `.menu-list`，校验登录态时不必再额外跳回 `/web/chat/index`。
 */
export declare function isBossChatShellUrl(url: string): boolean;
/** 未登录时常见跳转：如 `https://www.zhipin.com/web/user/?ka=bticket` */
export declare function isWebUserLoginUrl(url: string): boolean;
export type ProbeLoggedInSignals = {
    hasNickname: boolean;
    navLoginCta: boolean;
    hasLogoutHint: boolean;
};
/**
 * 根据当前页判断是否已登录（不导航）。
 *
 * **已登录（true）**：检测到顶栏昵称、或「退出登录」/logout 等信号。
 * 会短轮询等待 SPA 渲染，避免 `goto` 后立即读静态 HTML 误判。
 *
 * **未登录（false）**：`/web/user/` 登录流 URL、顶栏出现「我要登录」入口、且轮询结束仍无昵称/退出类信号。
 */
export declare function probeLoggedInFromPage(page: Page): Promise<{
    loggedIn: boolean;
    url: string;
}>;
/** 沟通页且已登录（与 {@link probeLoggedInFromPage} 一致）。 */
export declare function probeBossChatIndexLoggedIn(page: Page): Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map