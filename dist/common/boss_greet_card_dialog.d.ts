import type { Page } from 'puppeteer-core';
export type GreetCardDialogState = {
    present: boolean;
    title: string;
    /** 弹层内可选职位；`active` 为当前选中项 */
    jobs: Array<{
        index: number;
        name: string;
        detail: string;
        active: boolean;
    }>;
    activeJob: string;
    /** 确认按钮文案，形如「搜索畅聊卡(3/13)」 */
    confirmLabel: string;
    cancelLabel: string;
};
export declare function readGreetCardDialog(page: Page): Promise<GreetCardDialogState>;
/** 轮询等待弹层出现并渲染完；超时返回最后一次读到的状态。 */
export declare function waitForGreetCardDialog(page: Page, timeoutMs: number): Promise<GreetCardDialogState>;
/** 在弹层内按关键字模糊选职位；不传或没匹配上时保持平台预选项不动。 */
export declare function selectGreetCardDialogJob(page: Page, keyword: string): Promise<string>;
/**
 * 点「取消」关闭弹层，不消耗畅聊卡。返回是否点到了取消按钮。
 * 按钮可能还没渲染出来，轮询重试到 timeoutMs 为止。
 */
export declare function cancelGreetCardDialog(page: Page, timeoutMs?: number): Promise<boolean>;
/**
 * 点确认按钮（`button.boss-btn-primary`，文案「搜索畅聊卡(N/M)」）真正发出招呼。
 * ⚠️ 不可逆：会消耗一张搜索畅聊卡。仅在调用方已明确要发起沟通时调用。
 */
export declare function confirmGreetCardDialog(page: Page): Promise<boolean>;
export declare function renderGreetCardDialog(state: GreetCardDialogState): string;
//# sourceMappingURL=boss_greet_card_dialog.d.ts.map