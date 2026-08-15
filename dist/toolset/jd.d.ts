export type ListOpenPositionsDeps = {
    settleWaitMsMin?: number;
    settleWaitMsMax?: number;
    detail?: boolean;
    detailName?: string;
    projectDir?: string;
    detailWaitMs?: number;
};
export declare function runListOpenPositions(deps?: ListOpenPositionsDeps): Promise<string>;
//# sourceMappingURL=jd.d.ts.map