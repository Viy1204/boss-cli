/** 命令开始时写锁。任何失败都只是让面板失去这条信息，不该影响命令本身。 */
export declare function acquireBusyLock(command: string): void;
export declare function releaseBusyLock(): void;
//# sourceMappingURL=busy_lock.d.ts.map