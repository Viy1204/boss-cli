import { BOSS_CHAT_INDEX_URL, isBossChatShellUrl } from './auth.js';
import { ensureBrowserSession, getBrowserRef, getPageRef, setSessionPage, } from '../browser/browser_session.js';
import { bringToFrontUnlessMinimized } from '../browser/cdp_browser.js';
import { CONTEXT_DESTROY_RETRY_MS } from '../browser/human_delay.js';
import { sleepRandom } from '../browser/timing.js';
import { getBossPageRiskState, installBossPageGuards } from './boss_page_guards.js';
import { withBossSessionLock } from './boss_session_lock.js';
const SHOULD_DISABLE_JS = process.env.BOSS_BROWSER_DISABLE_JS === 'true' || process.env.BOSS_BROWSER_DISABLE_JS === '1';
/** Boss 为 SPA：`load` 后侧栏可能尚未挂载，需单独等待 `.menu-list` 出现 */
const MENU_LIST_MOUNT_TIMEOUT_MS = 30_000;
async function pickExistingPage(browser) {
    const pages = (await browser.pages()).filter((p) => !p.isClosed());
    if (pages.length === 0)
        return null;
    const urls = await Promise.all(pages.map((p) => {
        try {
            return p.url();
        }
        catch {
            return '';
        }
    }));
    const zhipin = pages.find((p, i) => {
        const u = urls[i] ?? '';
        return u.length > 0 && u !== 'about:blank' && u.includes('zhipin.com');
    });
    if (zhipin)
        return zhipin;
    const nonBlank = pages.find((p, i) => {
        const u = urls[i] ?? '';
        return u.length > 0 && u !== 'about:blank';
    });
    return nonBlank ?? null;
}
function normalizeMenuText(raw) {
    return (raw ?? '').replace(/\s+/g, ' ').trim();
}
async function readMenuListSnapshot(page) {
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
  })()`));
}
/**
 * 先按 URL 判断：不在 Boss 已登录主壳页（`/web/chat/*`）时跳到沟通页 `/web/chat/index`，
 * 再交由 {@link ensureMenuListMountedAfterLoad} 查 `.menu-list`。
 * 已经在 `/web/chat/recommend`、`/web/chat/aiform` 等主壳子页时直接跳过 goto，
 * 避免触发"先回到聊天页再切回业务页"的额外跳转。
 */
/** 页面守卫熔断（风控页反弹 / 自刷新循环）导致的中止，与普通页面异常区分开。 */
export class BossPageRiskError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BossPageRiskError';
    }
}
/**
 * 熔断后立刻停下：继续自动操作既拿不到正确页面，也会让风控进一步升级。
 * 错误信息直接给出人工处置动作。
 */
function assertNoPageRisk(page) {
    const risk = getBossPageRiskState(page);
    if (!risk)
        return;
    throw new BossPageRiskError(`${risk.message}\n处理方式：在浏览器中完成验证/重新登录，确认能正常停留在沟通页后再重试；` +
        `若确认无需拦截，可设 BOSS_BROWSER_ALLOW_RISK_NAV=1 让验证页直接渲染。`);
}
async function ensureBossChatShellUrlBeforeMenuList(page) {
    if (isBossChatShellUrl(page.url())) {
        return;
    }
    await page.goto(BOSS_CHAT_INDEX_URL, { waitUntil: 'load', timeout: 60_000 });
}
async function ensureMenuListMountedAfterLoad(page) {
    await page.waitForFunction(`(() => document.readyState === "complete" || document.readyState === "interactive")()`, { timeout: 12_000 });
    try {
        await page.waitForFunction(`(() => !!document.querySelector(".menu-list"))()`, { timeout: MENU_LIST_MOUNT_TIMEOUT_MS });
    }
    catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        const timedOut = err.name === 'TimeoutError' || /timeout|waiting failed/i.test(err.message);
        if (timedOut) {
            throw new Error(`在 ${MENU_LIST_MOUNT_TIMEOUT_MS / 1000}s 内未出现侧栏 .menu-list（页面或仍在加载，或未登录无法进入主壳）。`);
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
export async function withBossSessionPage(callback, options = {}) {
    const shouldEnsureChatShell = options.ensureChatShell !== false;
    const shouldEnsureMenuList = options.ensureMenuList !== false;
    return withBossSessionLock(async () => {
        const isContextDestroyed = (e) => {
            const msg = e instanceof Error ? e.message : String(e);
            return (msg.includes('Execution context was destroyed') ||
                msg.includes('Cannot find context with specified id') ||
                msg.includes('Most likely because of a navigation'));
        };
        const maxAttempts = 2;
        let lastErr;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let page = null;
            try {
                await ensureBrowserSession();
                const browser = getBrowserRef();
                if (!browser) {
                    throw new Error('无法获取浏览器实例。');
                }
                page = getPageRef();
                if (!page || page.isClosed()) {
                    page = (await pickExistingPage(browser)) ?? (await browser.newPage());
                }
                setSessionPage(page);
                await bringToFrontUnlessMinimized(page);
                await installBossPageGuards(page);
                if (shouldEnsureChatShell) {
                    await ensureBossChatShellUrlBeforeMenuList(page);
                }
                assertNoPageRisk(page);
                if (SHOULD_DISABLE_JS) {
                    await page.setJavaScriptEnabled(false);
                }
                if (shouldEnsureMenuList) {
                    try {
                        await ensureMenuListMountedAfterLoad(page);
                    }
                    catch (e) {
                        // 主壳加载不出来时，风控熔断信息比「未出现侧栏」更能定位问题。
                        assertNoPageRisk(page);
                        throw e;
                    }
                }
                return await callback(page);
            }
            catch (e) {
                lastErr = e;
                // 守卫熔断时，把「上下文被销毁」这类次生错误换成风控原因，并且不再重试。
                if (page && !(e instanceof BossPageRiskError)) {
                    assertNoPageRisk(page);
                }
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
//# sourceMappingURL=boss_session_page.js.map