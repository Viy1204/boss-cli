import type { Page } from 'puppeteer-core';
/**
 * 在聊天页左侧工具栏点击「求简历」，并在确认弹窗中点「确定」。
 * 平台规则：双方需各至少发送一条消息后该入口才可点；否则按钮为禁用态。
 */
export declare function runRequestAttachmentResume(page: Page): Promise<string>;
export type ChatPageAction = 'resume' | 'not-fit' | 'remark' | 'agree-resume' | 'request-attachment-resume' | 'history' | 'exchange-wechat';
export declare function runChatActionOnCurrentConversation(page: Page, options: {
    action: ChatPageAction;
    remark?: string;
}): Promise<string>;
//# sourceMappingURL=action.d.ts.map