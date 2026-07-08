/**
 * Boss B 端「主壳」会话：选页、必要时进入沟通页、侧栏 `.menu-list` 探测，
 * 再执行 {@link withBossSessionPage} 回调。与 `src/toolset/chat.ts`（按姓名打开会话等业务）无关。
 */
import type { Browser, Page } from 'puppeteer-core';
import { BOSS_CHAT_INDEX_URL, isBossChatShellUrl } from './auth.js';
import {
  ensureBrowserSession,
  getBrowserRef,
  getPageRef,
  setSessionPage,
} from '../browser/browser_session.js';
import { CONTEXT_DESTROY_RETRY_MS } from '../browser/human_delay.js';
import { sleepRandom } from '../browser/timing.js';
import { assertBossCliAvailable } from './boss_availability.js';
import { installBossPageGuards } from './boss_page_guards.js';
import { withBossSessionLock } from './boss_session_lock.js';

const SHOULD_DISABLE_JS =
  process.env.BOSS_BROWSER_DISABLE_JS === 'true' || process.env.BOSS_BROWSER_DISABLE_JS === '1';

/** Boss 为 SPA：`load` 后侧栏可能尚未挂载，需单独等待 `.menu-list` 出现 */
const MENU_LIST_MOUNT_TIMEOUT_MS = 30_000;

async function pickExistingPage(browser: Browser): Promise<Page | null> {
  const pages = (await browser.pages()).filter((p) => !p.isClosed());
  if (pages.length === 0) return null;

  const urls = await Promise.all(
    pages.map((p) => {
      try {
        return p.url();
      } catch {
        return '';
      }
    }),
  );

  const zhipin = pages.find((p, i) => {
    const u = urls[i] ?? '';
    return u.length > 0 && u !== 'about:blank' && u.includes('zhipin.com');
  });
  if (zhipin) return zhipin;

  const nonBlank = pages.find((p, i) => {
    const u = urls[i] ?? '';
    return u.length > 0 && u !== 'about:blank';
  });
  return nonBlank ?? null;
}

type MenuListSnapshot = {
  exists: boolean;
  signature: string;
};

type BossSessionPageOptions = {
  ensureChatShell?: boolean;
  ensureMenuList?: boolean;
};

function normalizeMenuText(raw: string | null | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim();
}

async function readMenuListSnapshot(page: Page): Promise<MenuListSnapshot> {
  return (await page.evaluate(`(() => {
    const root = document.querySelector(".menu-list");
    if (!root) {
      return { exists: false, signature: "" };
    }
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const links = Array.from(root.querySelectorAll("dl > dt > a"));
    const entries = links.map((a) => {
      const href = a.getAttribute("href") ?? "";
      const labelNode = a.querySelector(".menu-item-content span");
      const label = norm(labelNode?.textContent || a.textContent || "");
      return label + "::" + href;
    });
    return { exists: true, signature: entries.join("|") };
  })()`)) as MenuListSnapshot;
}

/**
 * 先按 URL 判断：不在 Boss 已登录主壳页（`/web/chat/*`）时跳到沟通页 `/web/chat/index`，
 * 再交由 {@link ensureMenuListMountedAfterLoad} 查 `.menu-list`。
 * 已经在 `/web/chat/recommend`、`/web/chat/aiform` 等主壳子页时直接跳过 goto，
 * 避免触发"先回到聊天页再切回业务页"的额外跳转。
 */
async function ensureBossChatShellUrlBeforeMenuList(page: Page): Promise<void> {
  if (isBossChatShellUrl(page.url())) {
    return;
  }
  await page.goto(BOSS_CHAT_INDEX_URL, { waitUntil: 'load', timeout: 60_000 });
}

async function ensureMenuListMountedAfterLoad(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => document.readyState === "complete" || document.readyState === "interactive")()`,
    { timeout: 12_000 },
  );

  try {
    await page.waitForFunction(
      `(() => !!document.querySelector(".menu-list"))()`,
      { timeout: MENU_LIST_MOUNT_TIMEOUT_MS },
    );
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const timedOut =
      err.name === 'TimeoutError' || /timeout|waiting failed/i.test(err.message);
    if (timedOut) {
      throw new Error(
        `在 ${MENU_LIST_MOUNT_TIMEOUT_MS / 1000}s 内未出现侧栏 .menu-list（页面或仍在加载，或未登录无法进入主壳）。`,
      );
    }
    throw e;
  }

  const first = await readMenuListSnapshot(page);
  if (!first.exists) {
    throw new Error('当前页面可能未登录或未进入 Boss 主界面。');
  }
  if (!normalizeMenuText(first.signature)) {
    throw new Error('检测到 .menu-list 但菜单内容为空，当前页面状态异常。');
  }
}

/**
 * 在已连接浏览器、且当前页为 Boss 主壳（含侧栏 `.menu-list`）的前提下执行回调。
 * 默认会先按 URL 确保落在 `/web/chat/*` 主壳页（已在主壳子页则保留原路径，否则跳回沟通页 `/web/chat/index`），
 * 再校验侧栏；需要严格使用当前页面的命令可通过 options 关闭这些预检查。
 */
export async function withBossSessionPage<T>(
  callback: (page: Page) => Promise<T>,
  options: BossSessionPageOptions = {},
): Promise<T> {
  await assertBossCliAvailable();
  const shouldEnsureChatShell = options.ensureChatShell !== false;
  const shouldEnsureMenuList = options.ensureMenuList !== false;

  return withBossSessionLock(async () => {
    const isContextDestroyed = (e: unknown): boolean => {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      msg.includes('Execution context was destroyed') ||
      msg.includes('Cannot find context with specified id') ||
      msg.includes('Most likely because of a navigation')
    );
  };

    const maxAttempts = 2;
    let lastErr: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await ensureBrowserSession();
      const browser = getBrowserRef();
      if (!browser) {
        throw new Error('无法获取浏览器实例。');
      }

      let page: Page | null = getPageRef();
      if (!page || page.isClosed()) {
        page = (await pickExistingPage(browser)) ?? (await browser.newPage());
      }
      setSessionPage(page);
      await page.bringToFront();

      await installBossPageGuards(page);

      if (shouldEnsureChatShell) {
        await ensureBossChatShellUrlBeforeMenuList(page);
      }
      if (SHOULD_DISABLE_JS) {
        await page.setJavaScriptEnabled(false);
      }
      if (shouldEnsureMenuList) {
        await ensureMenuListMountedAfterLoad(page);
      }

      return await callback(page);
    } catch (e) {
      lastErr = e;
      if (attempt < maxAttempts - 1 && isContextDestroyed(e)) {
        // Boss 页面偶发跳转/重渲染会销毁执行上下文；短暂等待并重试一次即可。
        await sleepRandom(CONTEXT_DESTROY_RETRY_MS.min, CONTEXT_DESTROY_RETRY_MS.max);
        continue;
      }
      throw e;
    }
  }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  });
}
