import type { Page } from 'puppeteer-core';
/**
 * 点击 Boss 左侧 `.menu-list` 中的菜单项，并等待导航到给定 pathname（如 `/web/chat/index`）。
 * 若合成点击未触发导航（Boss v10718+ SPA 对程序化点击无响应），回退到 `page.goto` 直达目标 URL。
 */
export declare function clickBossSidebarMenuToPath(page: Page, menuLabel: string, targetPath: string): Promise<void>;
//# sourceMappingURL=boss_sidebar_nav.d.ts.map