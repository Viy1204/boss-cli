import type { Frame, Page } from 'puppeteer-core';
export type RecommendCandidate = {
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
    /** 卡片为灰色「已看过」样式（如 `.candidate-card-wrap.has-viewed` / `.card-inner.has-viewed`） */
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
/**
 * 在推荐 iframe 内根据姓名打开在线简历预览：点击候选人卡片主体 `.card-inner`（与侧栏「打招呼」分离）。
 * 父页随后出现 `c-resume` iframe（如 `source=recommend`）。旧版仅有「在线简历」链接时仍尝试点击链接。
 */
export declare function openRecommendResumePreview(frame: Frame, target: string): Promise<boolean>;
export declare function runRecommend(jobKeyword?: string): Promise<string>;
//# sourceMappingURL=recommend.d.ts.map