/** 固定休眠（支持 AbortSignal，与原先 auth.sleep 行为一致） */
export declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
/** 含两端在内的随机整数（使用 crypto.randomInt） */
export declare function randomIntInclusive(min: number, max: number): number;
/** 在 [minMs, maxMs] 内随机等待 */
export declare function sleepRandom(minMs: number, maxMs: number, signal?: AbortSignal): Promise<void>;
//# sourceMappingURL=timing.d.ts.map