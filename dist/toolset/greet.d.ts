import type { Page } from 'puppeteer-core';
export type GreetOptions = {
    candidateTarget: string;
    jobKeyword?: string;
    /** 搜索池按卡片序号定位（姓名被平台打码时用） */
    index?: number;
    /** 仅搜索池：点击沟通入口，出现确认弹层后取消，不改变持久模式。 */
    dryRun?: boolean;
};
export declare function runRecommendGreet(options: GreetOptions): Promise<string>;
export declare function greetOnPage(page: Page, options: GreetOptions): Promise<string>;
//# sourceMappingURL=greet.d.ts.map