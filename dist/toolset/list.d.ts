import type { Page } from 'puppeteer-core';
/** 未读角标解析：数字优先且 >0；否则含「新」至少计 1 */
export declare const UNREAD_BADGE_COUNT_JS = "const unreadCountFromBadgeText = (badgeText) => {\n  const text = badgeText.replace(/\\s+/g, \" \").trim();\n  const count = parseInt(text.replace(/\\D/g, \"\"), 10) || 0;\n  if (count > 0) return count;\n  return text.includes(\"\u65B0\") ? 1 : 0;\n};";
export declare function ensureChatListReady(page: Page, filter?: 'all' | 'unread'): Promise<void>;
export declare function runGetCandidateList(opts?: {
    unreadOnly?: boolean;
}): Promise<string>;
//# sourceMappingURL=list.d.ts.map