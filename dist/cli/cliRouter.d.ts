/** `readline.question` 在 Ctrl+C 时会抛出 AbortError，视为正常结束而非业务错误 */
export declare function isReadlineAbortError(e: unknown): boolean;
/**
 * 执行一条子命令并返回结果（与传入 `process.argv` 切片语义一致，不含 `boss` 本身）。
 */
export declare function executeCommand(argv: string[]): Promise<string>;
export declare function runOneCommand(argv: string[]): Promise<void>;
export declare function runCli(argv: string[]): Promise<void>;
//# sourceMappingURL=cliRouter.d.ts.map