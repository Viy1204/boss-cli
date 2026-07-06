import type { Page } from 'puppeteer-core';
import { SIDEBAR_NAV_AFTER_CLICK_MS, sleepRandom } from '../browser/index.js';

const SIDEBAR_NAV_WAIT_MS = 15_000;
const SIDEBAR_CLICK_WAIT_MS = 25_000;
/** 单次读 pathname 的限时：Boss 改版后切页时主线程常被长任务阻塞，evaluate 会挂起，超时按"暂时读不到"处理继续轮询。 */
const READ_PATH_RACE_MS = 3_000;

function normalizePath(p: string | null | undefined): string {
  return (p ?? '').replace(/\/+$/, '') || '/';
}

async function readTopPathname(page: Page): Promise<string | null> {
  try {
    return await Promise.race([
      page.evaluate('location.pathname').catch(() => null) as Promise<string | null>,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), READ_PATH_RACE_MS)),
    ]);
  } catch {
    return null;
  }
}

type TopPathWaitResult = { ok: boolean; lastSeen: string | null };

/** 限时轮询等待顶层 pathname 命中目标；容忍页面主线程长任务阻塞（阻塞期间读不到就继续等）。 */
export async function waitForBossTopPath(
  page: Page,
  targetPath: string,
  timeoutMs: number,
): Promise<TopPathWaitResult> {
  const target = normalizePath(targetPath);
  const start = Date.now();
  let lastSeen: string | null = null;
  while (Date.now() - start < timeoutMs) {
    const p = await readTopPathname(page);
    if (typeof p === 'string') {
      lastSeen = normalizePath(p);
      if (lastSeen === target) {
        return { ok: true, lastSeen };
      }
    }
    await sleepRandom(400, 700);
  }
  return { ok: false, lastSeen };
}

async function clickSidebarMenu(page: Page, menuLabel: string, targetPath: string): Promise<boolean> {
  try {
    return (await page.evaluate(
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
  } catch {
    return false;
  }
}

/**
 * 导航到 Boss 左侧菜单对应的页面（如 `/web/chat/recommend`）。
 *
 * 2026-07 Boss 改版适配：
 * - 侧栏「推荐牛人」「搜索」等菜单项不再带 href（SPA click handler），且切页后页面主线程
 *   常被长任务阻塞 30~60s，期间 CDP Runtime 调用挂起，原先"点击后短等 + waitForFunction"必然超时。
 * - 各 /web/chat/* 路由当前可 goto 直达；异常态下（如未登录、灰度）可能被服务端重定向。
 *
 * 策略：goto 直达优先 + 限时轮询读 pathname；未落地时回退侧栏 SPA 点击（点一次不生效再点一次）。
 */
export async function clickBossSidebarMenuToPath(
  page: Page,
  menuLabel: string,
  targetPath: string,
): Promise<void> {
  const current = await readTopPathname(page);
  if (typeof current === 'string' && normalizePath(current) === normalizePath(targetPath)) {
    return;
  }

  const fullUrl = targetPath.startsWith('http') ? targetPath : `https://www.zhipin.com${targetPath}`;
  try {
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  } catch {
    // 忙时 goto 可能超时，导航可能仍在进行，交给轮询判定
  }
  await sleepRandom(SIDEBAR_NAV_AFTER_CLICK_MS.min, SIDEBAR_NAV_AFTER_CLICK_MS.max);
  let r = await waitForBossTopPath(page, targetPath, SIDEBAR_NAV_WAIT_MS);
  if (r.ok) {
    return;
  }

  const clicked = await clickSidebarMenu(page, menuLabel, targetPath);
  if (clicked) {
    r = await waitForBossTopPath(page, targetPath, SIDEBAR_CLICK_WAIT_MS);
    if (r.ok) {
      return;
    }
    // 忙时点击可能被吞，重点一次
    await clickSidebarMenu(page, menuLabel, targetPath);
    r = await waitForBossTopPath(page, targetPath, SIDEBAR_NAV_WAIT_MS);
    if (r.ok) {
      return;
    }
  }
  throw new Error(`未能导航到 ${targetPath}（侧边栏菜单“${menuLabel}”，当前停在 ${r.lastSeen ?? '未知页面'}）。`);
}
