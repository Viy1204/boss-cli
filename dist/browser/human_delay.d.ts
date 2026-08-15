import type { Page } from 'puppeteer-core';
/** macOS 用 Meta，其余平台用 Control */
export declare function selectAllModifierKey(): 'Meta' | 'Control';
/** 导航到沟通页并 load 后，等待 SPA/接口渲染 */
export declare const CHAT_GOTO_SETTLE_MS: {
    readonly min: 2800;
    readonly max: 5200;
};
/** 页面执行上下文被销毁后重试前 */
export declare const CONTEXT_DESTROY_RETRY_MS: {
    readonly min: 900;
    readonly max: 1800;
};
/** 侧栏导航点击后，等待路由与 SPA 状态开始变化 */
export declare const SIDEBAR_NAV_AFTER_CLICK_MS: {
    readonly min: 420;
    readonly max: 1100;
};
/** 列表滚动查找候选人时，每轮之间的间隔 */
export declare const OPEN_CHAT_SCROLL_GAP_MS: {
    readonly min: 240;
    readonly max: 760;
};
/** 点击会话行后，等待右侧面板出现的短停顿 */
export declare const OPEN_CHAT_AFTER_ROW_CLICK_MS: {
    readonly min: 420;
    readonly max: 1200;
};
/** mouse.click 的按下/抬起间隔（Puppeteer delay 选项） */
export declare const MOUSE_CLICK_PRESS_MS: {
    readonly min: 55;
    readonly max: 180;
};
/** 筛选「全部」等操作之间的停顿 */
export declare const LIST_FILTER_GAP_MS: {
    readonly min: 780;
    readonly max: 1400;
};
/** 岗位下拉打开、搜索输入、选择岗位等连续动作之间的停顿 */
export declare const JOB_SELECT_ACTION_GAP_MS: {
    readonly min: 280;
    readonly max: 760;
};
/** 岗位搜索输入后，等待前端过滤/接口刷新开始响应 */
export declare const JOB_SEARCH_ACTION_GAP_MS: {
    readonly min: 420;
    readonly max: 980;
};
/** 点击候选人卡片打开简历预览后，等待弹层/iframe 开始挂载 */
export declare const RESUME_PREVIEW_OPEN_GAP_MS: {
    readonly min: 420;
    readonly max: 1100;
};
/** 列表稳定轮询间隔（随机） */
export declare const LIST_POLL_MS: {
    readonly min: 420;
    readonly max: 780;
};
/** 列表为空时至少等待多久才认为稳定 */
export declare const LIST_MIN_BEFORE_EMPTY_OK_MS = 5000;
/** 登录态探测轮询间隔 */
export declare const PROBE_LOGIN_POLL_MS: {
    readonly min: 520;
    readonly max: 980;
};
/** 点击聊天输入框 */
export declare const SEND_INPUT_CLICK_MS: {
    readonly min: 45;
    readonly max: 160;
};
/** 逐字输入：字符间隔（随机） */
export declare const SEND_TYPING_GAP_MS: {
    readonly min: 38;
    readonly max: 125;
};
/** 按下 Enter 后、流程结束前短停顿 */
export declare const SEND_AFTER_ENTER_MS: {
    readonly min: 260;
    readonly max: 920;
};
/** `send` 中先发完文字后、再执行 `--action` 前的默认随机间隔（求简历 / 同意或拒绝附件等） */
export declare const SEND_BEFORE_RESUME_MS: {
    readonly min: 2800;
    readonly max: 5600;
};
/** 点击「沟通记录」后等待弹窗与列表渲染 */
export declare const CHAT_HISTORY_DIALOG_WAIT_MS: {
    readonly min: 500;
    readonly max: 1400;
};
/** 「同事沟通」/「我的沟通」切换后等待列表刷新 */
export declare const CHAT_HISTORY_TAB_SWITCH_MS: {
    readonly min: 350;
    readonly max: 900;
};
/** 点击「在线简历」后等待 iframe 出现 */
export declare const ONLINE_RESUME_IFRAME_APPEAR_MS: {
    readonly min: 600;
    readonly max: 1600;
};
/**
 * 点击后等待 c-resume iframe 出现、或判定为付费墙弹层的上限（毫秒）。
 * 仅在未出现付费墙时才会接近该时长；若先出现付费墙会提前结束（见 `waitForCResumeIframeOrPaywall`）。
 */
export declare const ONLINE_RESUME_IFRAME_WAIT_MAX_MS = 15000;
/** 打招呼点击后主文档付费弹层轮询上限（毫秒）；命中则提前结束，未命中时最多增加约此时长。 */
export declare const GREET_PAYWALL_WAIT_MAX_MS = 3500;
/** iframe 出现后等待简历区域渲染 */
export declare const ONLINE_RESUME_IFRAME_SETTLE_MS: {
    readonly min: 1800;
    readonly max: 4200;
};
/**
 * 逐字符输入，字符之间为随机间隔（末尾字符后不再额外等待）。
 */
export declare function typeTextWithRandomKeyDelay(page: Page, text: string, minGapMs: number, maxGapMs: number, signal?: AbortSignal): Promise<void>;
//# sourceMappingURL=human_delay.d.ts.map