import type { Frame, Page } from 'puppeteer-core';
export type RecommendCandidate = {
    index: number;
    geekId: string;
    name: string;
    salary: string;
    baseInfo: string;
    expect: string;
    experience: string;
    advantage: string;
    highlights: string[];
    canGreet: boolean;
    hasHistoryChat: boolean;
    hasViewed: boolean;
};
export declare function isBossChatRecommendUrl(url: string): boolean;
export declare function selectRecommendJob(frame: Frame, keyword: string): Promise<string>;
export declare function ensureInRecommendPage(page: Page): Promise<Frame>;
/**
 * 供 `preview` 使用：不导航；若当前主页面不在推荐页或未就绪推荐 iframe，直接抛错。
 */
export declare function assertRecommendPageReady(page: Page, actionName: string): Promise<Frame>;
export declare function assertRecommendPageReadyForPreview(page: Page): Promise<Frame>;
export declare function readRecommendList(frame: Frame): Promise<RecommendCandidate[]>;
export declare function renderRecommendList(candidates: RecommendCandidate[]): string;
export declare function clickGreet(frame: Frame, target: string): Promise<{
    message: string;
}>;
export declare function markGreetProduced(before: RecommendCandidate[], after: RecommendCandidate[]): void;
export declare function openRecommendResumePreview(frame: Frame, target: string, index?: number): Promise<{
    name: string;
    index: number;
}>;
export declare function runRecommend(jobKeyword?: string): Promise<string>;
//# sourceMappingURL=recommend.d.ts.map