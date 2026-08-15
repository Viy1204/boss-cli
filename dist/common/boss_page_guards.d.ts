import type { Browser, Page } from 'puppeteer-core';
export type BossPageRiskKind = 'risk_navigation' | 'reload_loop';
export type BossPageRiskState = {
    kind: BossPageRiskKind;
    url: string;
    message: string;
};
/** 当前页是否已熔断（风控页反弹 / 刷新循环）；命令层据此明确报错而不是继续空转。 */
export declare function getBossPageRiskState(page: Page): BossPageRiskState | null;
/** 用户手动处理完验证后，可清掉熔断状态继续跑。 */
export declare function clearBossPageRiskState(page: Page): void;
export declare function installBossPageGuards(page: Page): Promise<void>;
export declare function installBossBrowserPageGuards(browser: Browser): Promise<void>;
//# sourceMappingURL=boss_page_guards.d.ts.map