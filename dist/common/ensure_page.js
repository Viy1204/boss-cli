export async function ensurePage(page, opts) {
    const startUrl = page.url();
    if (!opts.matches(startUrl)) {
        await page.goto(opts.targetUrl, {
            waitUntil: 'load',
            timeout: opts.timeoutMs ?? 60_000,
        });
    }
    const currentUrl = page.url();
    if (!opts.matches(currentUrl)) {
        throw new Error(`进入${opts.name}失败。起始页面：${startUrl || 'unknown'}；当前页面：${currentUrl || 'unknown'}；目标页面：${opts.targetUrl}`);
    }
}
//# sourceMappingURL=ensure_page.js.map