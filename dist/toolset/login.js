import { detachBrowserSession, disconnectBrowserSession, ensureAndGetBrowser, ensureBrowserSession, getBrowserRef, getPageRef, setSessionPage, closeRemoteBrowser, probeRemoteHeadless, } from '../browser/index.js';
const BOSS_LOGIN_URL = 'https://www.zhipin.com/web/user/?ka=header-login';
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
/**
 * 登录（手动）：只负责打开 Boss 登录页，让用户在浏览器中自行完成登录。
 * 不做登录态校验/等待/超时判断；成功与否由后续命令自行体现。
 */
export async function runLogin() {
    // 登录必须可见：已在跑的实例若是无头，先关掉，再以有头重启。
    //
    // 判据必须读**进程外**的真实状态。此前这里用的是 `getBrowserRef()` 和
    // `wasLastChromeLaunchHeadless()`，两者都是模块级变量——而 `boss login` 是独立的
    // 一次性进程，刚起时它们必然是空的，整段检测形同不存在；随后 `ensureAndGetBrowser()`
    // 会 probe 到常驻的无头实例直接 connect，把登录页开在用户看不见的浏览器里。
    // 现在改问端口上那只浏览器自己：`/json/version` 的 UA 含 HeadlessChrome 即为无头。
    process.env.BOSS_BROWSER_HEADLESS = 'false';
    if ((await probeRemoteHeadless()) === true) {
        // 登录态在 user-data-dir 里，关掉重启不会丢。先清掉本进程内可能持有的引用
        // （交互模式下先跑过别的命令），再关远端那只。
        await disconnectBrowserSession().catch(() => { });
        await closeRemoteBrowser().catch(() => { });
    }
    let browser = null;
    try {
        browser = (await ensureAndGetBrowser()) ?? (getBrowserRef() ?? null);
        if (!browser) {
            await ensureBrowserSession();
            browser = getBrowserRef() ?? null;
        }
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`连接浏览器失败：${msg}`);
    }
    if (!browser) {
        throw new Error('无法获取浏览器实例，登录失败。');
    }
    let page = getPageRef() ?? null;
    if (!page || page.isClosed()) {
        page = (await pickExistingPage(browser)) ?? (await browser.newPage());
    }
    setSessionPage(page);
    await page.bringToFront();
    await page.goto(BOSS_LOGIN_URL, { waitUntil: 'load', timeout: 60_000 });
    await detachBrowserSession();
    // 不做任何登录校验：只把浏览器打开到登录页；立即断开 CDP，CLI 不与浏览器进程长期绑定。
    return [
        `已在浏览器中打开 Boss 登录页：${BOSS_LOGIN_URL}`,
        '本命令已同步结束并立即返回，CLI 不会等待 / 轮询 / 校验登录结果。',
        'Agent调用方：把控制权交还给人类，不要在这一步自行 sleep / poll / retry',
    ].join('\n');
}
//# sourceMappingURL=login.js.map