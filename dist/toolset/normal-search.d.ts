import type { Frame, Page } from 'puppeteer-core';
export declare function isBossChatSearchUrl(url: string): boolean;
export declare function assertNormalSearchPageReadyForPreview(page: Page): Promise<Frame>;
export declare function readNormalSearchSelectedJobLabel(frame: Frame): Promise<string>;
/**
 * 在常规搜索页（iframe）切换当前岗位。岗位选项常驻 `.job-name`（即账号自己的开放职位），
 * 模糊匹配 keyword 后点击，等待 `.search-current-job` 变更。keyword 为空则返回当前岗位。
 */
export declare function selectNormalSearchJob(frame: Frame, keyword: string): Promise<string>;
export declare function openNormalSearchResumePreview(frame: Frame, target: string): Promise<boolean>;
export type SearchPoolGreetOptions = {
    /** 1-based 序号，对应上一次 `boss search` 输出的编号（仅当次列表有效） */
    index?: number;
    /** 打码姓名或摘要关键词 */
    target?: string;
    /** 弹层内改选职位（不传则用平台预选，通常即 `--job` 选中的岗位） */
    jobKeyword?: string;
    /** true = 只走到弹层并取消，不发出招呼、不消耗畅聊卡 */
    dryRun: boolean;
};
/**
 * 搜索池打招呼：定位卡片 → 点「畅聊卡 N/M」→ 处理「选择该牛人开聊职位」确认弹层。
 * dryRun 时读完弹层就点「取消」，不消耗额度；否则点 `boss-btn-primary`（不可逆）。
 */
export declare function greetSearchPoolOnPage(page: Page, options: SearchPoolGreetOptions): Promise<string>;
export declare function runSearchPoolGreet(options: SearchPoolGreetOptions): Promise<string>;
export declare function runNormalSearch(keyword?: string, jobKeyword?: string): Promise<string>;
//# sourceMappingURL=normal-search.d.ts.map