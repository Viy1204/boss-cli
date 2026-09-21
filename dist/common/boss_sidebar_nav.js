import { SIDEBAR_NAV_AFTER_CLICK_MS, sleepRandom } from '../browser/index.js';
const SIDEBAR_NAV_WAIT_MS = 15_000;
// 2026-07 起 Boss（index v10718+）SPA 侧栏菜单项对程序化 click / dispatchMouseEvent
// 不再触发路由导航，只有真实指针事件才跳转。故点击后先短等，超时则回退到 page.goto 直达。
const SIDEBAR_CLICK_NAV_WAIT_MS = 5_000;
/**
 * ⚠️ 目标 path 必须**内联**进脚本，不能走 `waitForFunction(fn, opts, arg)` 的入参：
 * puppeteer 对字符串形式的 pageFunction 是当表达式求值的，入参会被静默丢弃，
 * 求值结果是个函数对象 —— 恒为真，等待直接变空转。详见 AGENTS.md。
 */
const buildPathReachedPredicate = (path) => `(() => {
      try {
        const p = window.location.pathname.replace(/\\/+$/, "") || "/";
        return p === ${JSON.stringify(path)};
      } catch {
        return false;
      }
    })()`;
/**
 * 点击 Boss 左侧 `.menu-list` 中的菜单项，并等待导航到给定 pathname（如 `/web/chat/index`）。
 * 若合成点击未触发导航（Boss v10718+ SPA 对程序化点击无响应），回退到 `page.goto` 直达目标 URL。
 */
export async function clickBossSidebarMenuToPath(page, menuLabel, targetPath) {
    // 菜单文案和目标 path 同样要内联，理由见 buildPathReachedPredicate。
    // 走入参的话这里拿到的是函数对象（真值），「未找到菜单」永远不会报，而点击根本没发生。
    const clicked = (await page.evaluate(`(() => {
      const label = ${JSON.stringify(menuLabel)};
      const path = ${JSON.stringify(targetPath)};
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
    })()`));
    if (!clicked) {
        throw new Error(`未找到侧边栏菜单“${menuLabel}”，无法跳转到 ${targetPath}。`);
    }
    await sleepRandom(SIDEBAR_NAV_AFTER_CLICK_MS.min, SIDEBAR_NAV_AFTER_CLICK_MS.max);
    const pathReached = buildPathReachedPredicate(targetPath);
    try {
        await page.waitForFunction(pathReached, { timeout: SIDEBAR_CLICK_NAV_WAIT_MS });
        return;
    }
    catch {
        // 合成点击未导航（Boss v10718+），回退到直接 goto 目标 URL。
    }
    const targetUrl = new URL(targetPath, page.url()).toString();
    await page.goto(targetUrl, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForFunction(pathReached, { timeout: SIDEBAR_NAV_WAIT_MS });
}
//# sourceMappingURL=boss_sidebar_nav.js.map