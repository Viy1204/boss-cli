import type { Page } from 'puppeteer-core';
export type DeepSearchGeekItem = {
    name: string;
    meta: string;
    work: string;
    edu: string;
    reason: string;
};
export type BossSearchOptions = {
    jobKeyword?: string;
    coreRequirements?: string[];
    bonusRequirements?: string[];
    match?: boolean;
};
export declare function isBossChatAiFormUrl(url: string): boolean;
export declare function ensureInDeepSearchPage(page: Page): Promise<void>;
export declare function selectAiFormJob(page: Page, keyword: string): Promise<string>;
/** 深度搜索页当前选中的岗位文案（无则「默认」） */
export declare function readAiFormSelectedJobLabel(page: Page): Promise<string>;
/**
 * 在深度搜索（aiform）主文档中按姓名打开在线简历预览（与 {@link clickGreetDeepSearch} 同一卡片集合，排除「继续沟通」）。
 */
export declare function openDeepSearchResumePreview(page: Page, target: string): Promise<boolean>;
export declare function readDeepSearchGeekList(page: Page): Promise<DeepSearchGeekItem[]>;
export declare function renderGeekListSection(title: string, items: DeepSearchGeekItem[]): string;
export declare function clickGreetDeepSearch(page: Page, target: string): Promise<{
    message: string;
}>;
export declare function runBossSearchSet(opts: {
    jobKeyword?: string;
    coreRequirements?: string[];
    bonusRequirements?: string[];
}): Promise<string>;
export declare function runBossSearch(opts?: BossSearchOptions): Promise<string>;
//# sourceMappingURL=deep-search.d.ts.map