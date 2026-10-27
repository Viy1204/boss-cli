import { isBossChatShellUrl } from '../common/auth.js';
import {
  assertNoPageRisk,
  ensureMenuListMountedAfterLoad,
  withBossSessionPage,
} from '../common/boss_session_page.js';

function isReloadableBossShell(url: string): boolean {
  return isBossChatShellUrl(url) && new URL(url).origin === 'https://www.zhipin.com';
}

export async function runReload(withSessionPage = withBossSessionPage): Promise<string> {
  return withSessionPage(async (page) => {
    assertNoPageRisk(page);
    if (!isReloadableBossShell(page.url())) {
      throw new Error(`当前不在已登录的 Boss 主壳页（/web/chat/*），无法刷新。当前页面：${page.url()}；请先在浏览器中完成登录或验证。`);
    }
    await page.evaluate(`(() => {
      for (const iframe of document.querySelectorAll('iframe[name="searchFrame"]')) {
        if (iframe.contentWindow) delete iframe.contentWindow.__bossCliSearchSnapshot;
      }
    })()`);
    await page.reload({ waitUntil: 'load', timeout: 60_000 });
    assertNoPageRisk(page);
    if (!isReloadableBossShell(page.url())) {
      throw new Error(`刷新后未停留在 Boss 主壳页。当前页面：${page.url()}；请先在浏览器中完成登录或验证。`);
    }
    await ensureMenuListMountedAfterLoad(page);
    assertNoPageRisk(page);
    if (!isReloadableBossShell(page.url())) {
      throw new Error(`刷新期间已离开 Boss 主壳页。当前页面：${page.url()}；请先在浏览器中完成登录或验证。`);
    }
    return '已刷新当前 Boss 主壳页，侧栏已就绪。旧搜索快照已失效，请重新执行 boss search 或原只读命令。';
  }, { ensureChatShell: false, ensureMenuList: false, retryOnContextDestroyed: false });
}
