import type { Frame, Page } from 'puppeteer-core';
export type ListOpenPositionsDeps = {
    settleWaitMsMin?: number;
    settleWaitMsMax?: number;
    detail?: boolean;
    detailName?: string;
    projectDir?: string;
    detailWaitMs?: number;
};
type JobListItem = {
    id: string;
    title: string;
    label: string;
    status: string;
    meta: string[];
    viewed: string;
    chatted: string;
    interested: string;
};
type JobReadState = {
    rows: number;
    totalText: string;
    title: string;
    url: string;
    bodyPreview: string;
};
type JobReadResult = JobReadState & {
    jobs: JobListItem[];
};
type JobListContext = {
    frame: Frame;
    data: JobReadResult;
    fromFrame: boolean;
    frameUrl: string;
    mainState: JobReadState;
};
export declare function readJobsFromFrame(frame: Frame): Promise<JobReadResult>;
export declare function waitForJobRowsReady(page: Page, timeoutMs: number): Promise<JobListContext>;
export declare function runListOpenPositions(deps?: ListOpenPositionsDeps): Promise<string>;
export {};
//# sourceMappingURL=jd.d.ts.map