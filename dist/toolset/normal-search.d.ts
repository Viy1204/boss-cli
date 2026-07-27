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
export declare function runNormalSearch(keyword?: string, jobKeyword?: string): Promise<string>;
//# sourceMappingURL=normal-search.d.ts.map