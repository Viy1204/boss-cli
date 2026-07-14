import type { Page } from 'puppeteer-core';
import { SIDEBAR_NAV_AFTER_CLICK_MS, sleepRandom } from '../browser/index.js';

const SIDEBAR_NAV_WAIT_MS = 15_000;
// 2026-07 起 Boss（index v10718+）SPA 侧栏菜单项对程序化 click / dispatchMouseEvent
// 不再触发路由导航，只有真实指针事件才跳转。故点击后先短等，超时则回退到 page.goto 直达。
const SIDEBAR_CLICK_NAV_WAIT_MS = 5_000;

const buildPathReachedPredicate = (): string =>
  `((path) => {
      try {
        const p = window.location.pathname.replace(/\\/+$/, "") || "/";
        return p === path;
      } catch {
        return false;
      }
    })`;

/**
 * 点击 Boss 左侧 `.menu-list` 中的菜单项，并等待导航到给定 pathname（如 `/web/chat/index`）。
 * 若合成点击未触发导航（Boss v10718+ SPA 对程序化点击无响应），回退到 `page.goto` 直达目标 URL。
 */
export async function clickBossSidebarMenuToPath(
  page: Page,
  menuLabel: string,
  targetPath: string,
): Promise<void> {
  const clicked = (await page.evaluate(
    `(({ label, path }) => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "");
      const links = Array.from(document.querySelectorAll(".menu-list a"));
      const target = links.find((a) => {
        const href = a.getAttribute("href") ?? "";
        if (href.includes(path)) {
          return true;
        }
        const text = norm(a.querySelector(".menu-item-content span")?.textContent ?? a.textContent);
        return text.includes(label);
      });
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      target.scrollIntoView({ block: "center", inline: "nearest" });
      target.click();
      return true;
    })`,
    { label: menuLabel, path: targetPath },
  )) as boolean;

  if (!clicked) {
    throw new Error(`未找到侧边栏菜单“${menuLabel}”，无法跳转到 ${targetPath}。`);
  }

  await sleepRandom(SIDEBAR_NAV_AFTER_CLICK_MS.min, SIDEBAR_NAV_AFTER_CLICK_MS.max);

  const pathReached = buildPathReachedPredicate();

  try {
    await page.waitForFunction(pathReached, { timeout: SIDEBAR_CLICK_NAV_WAIT_MS }, targetPath);
    return;
  } catch {
    // 合成点击未导航（Boss v10718+），回退到直接 goto 目标 URL。
  }

  const targetUrl = new URL(targetPath, page.url()).toString();
  await page.goto(targetUrl, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForFunction(pathReached, { timeout: SIDEBAR_NAV_WAIT_MS }, targetPath);
}
