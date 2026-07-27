import type { Page } from 'puppeteer-core';
export declare function ensureChatListReady(page: Page, filter?: 'all' | 'unread'): Promise<void>;
export declare function runGetCandidateList(opts?: {
    unreadOnly?: boolean;
}): Promise<string>;
//# sourceMappingURL=list.d.ts.map