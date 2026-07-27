import type { Page } from 'puppeteer-core';
export type EnsurePageOptions = {
    name: string;
    targetUrl: string;
    matches: (url: string) => boolean;
    timeoutMs?: number;
};
export declare function ensurePage(page: Page, opts: EnsurePageOptions): Promise<void>;
//# sourceMappingURL=ensure_page.d.ts.map