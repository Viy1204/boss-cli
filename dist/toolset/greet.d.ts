export type GreetOptions = {
    candidateTarget: string;
    jobKeyword?: string;
    /** 搜索池按卡片序号定位（姓名被平台打码时用） */
    index?: number;
    /** 搜索池：只走到确认弹层就取消，不消耗畅聊卡 */
    dryRun?: boolean;
};
export declare function runRecommendGreet(options: GreetOptions): Promise<string>;
//# sourceMappingURL=greet.d.ts.map