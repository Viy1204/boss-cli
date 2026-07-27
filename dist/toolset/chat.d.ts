import type { Page } from 'puppeteer-core';
export declare function runGetCommunicationHistory(page: Page): Promise<string>;
export declare function runOpenCandidateChatByIndex(page: Page, params: {
    index: number;
    filter?: 'all' | 'unread';
    expectedName?: string;
    exact?: boolean;
}): Promise<string>;
export declare function runOpenCandidateChat(page: Page, candidateName: string, exact?: boolean): Promise<string>;
//# sourceMappingURL=chat.d.ts.map