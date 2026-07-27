export declare function getPackageMeta(): {
    name: string;
    version: string;
};
/** 比较 semver x.y.z（忽略预发布标签，仅比较主版本段） */
export declare function compareSemver(a: string, b: string): number;
export type PackageUpdateCheckResult = {
    checked: boolean;
    current: string;
    latest: string | null;
    updateAvailable: boolean;
};
type CheckPackageUpdateOptions = {
    currentVersion?: string;
    fetchLatestVersion?: (packageName: string) => Promise<string>;
    force?: boolean;
    intervalMs?: number;
    now?: Date;
    packageName?: string;
    statePath?: string;
};
export declare function fetchNpmLatestVersion(packageName: string): Promise<string>;
export declare function formatPackageUpdateNotice(result: PackageUpdateCheckResult): string;
export declare function checkPackageUpdate(options?: CheckPackageUpdateOptions): Promise<PackageUpdateCheckResult>;
export declare function printPackageUpdateNoticeIfDue(): Promise<void>;
export declare function printVersionInfo(): Promise<void>;
export declare function runPackageUpdate(): Promise<string>;
export {};
//# sourceMappingURL=version.d.ts.map