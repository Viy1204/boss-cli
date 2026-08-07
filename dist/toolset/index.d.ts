import { type ChatPageAction } from './action.js';
export type { ChatPageAction };
export type { DeepSearchGeekItem } from './deep-search.js';
export declare function implLogin(): Promise<string>;
export declare function implListCandidates(): Promise<string>;
export declare function implListUnreadCandidates(): Promise<string>;
export declare function implOpenChat(candidateName: string, exact: boolean): Promise<string>;
export declare function implOpenChatByIndex(params: {
    index: number;
    unreadOnly?: boolean;
    expectedName?: string;
    exact?: boolean;
}): Promise<string>;
export declare function implChatAction(params: {
    action: ChatPageAction;
    remark?: string;
}): Promise<string>;
export declare function implSendMessage(params: {
    text: string;
    requestResume?: boolean;
}): Promise<string>;
export declare function implListPositions(): Promise<string>;
export declare function implListPositionsWithOptions(opts: {
    detail?: boolean;
    name?: string;
}): Promise<string>;
export declare function implBossSearch(opts?: {
    jobKeyword?: string;
    coreRequirements?: string[];
    bonusRequirements?: string[];
    match?: boolean;
}): Promise<string>;
export declare function implNormalSearch(keyword?: string, jobKeyword?: string): Promise<string>;
export declare function implBossSearchSet(opts: {
    jobKeyword?: string;
    coreRequirements?: string[];
    bonusRequirements?: string[];
}): Promise<string>;
export declare function implRecommend(jobKeyword?: string): Promise<string>;
export declare function implPreview(opts: {
    candidateTarget: string;
}): Promise<string>;
export declare function implRecommendGreet(opts: {
    candidateTarget: string;
    jobKeyword?: string;
    index?: number;
    dryRun?: boolean;
}): Promise<string>;
export { implSetBaiduCredentials } from './baidu_credentials.js';
//# sourceMappingURL=index.d.ts.map