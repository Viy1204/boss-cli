import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import { promisify } from 'node:util';
import puppeteer from 'puppeteer-core';
import { BROWSER_USER_DATA_DIR, ensureAppDataLayout } from '../config.js';
/** 与 @puppeteer/browsers 一致，解析 Chrome 启动日志中的 CDP WebSocket URL（可能在 stdout 或 stderr）。 */
const CDP_WEBSOCKET_ENDPOINT_REGEX = /^DevTools listening on (ws:\/\/.*)$/;
const LAUNCH_READY_MS = 30_000;
/**
 * 固定的远程调试端口：boss-cli 使用独立的 user-data-dir，因此可以稳定占用一个端口，
 * 让多个命令直接通过 `http://127.0.0.1:<port>/json/version` 复用同一只浏览器。
 * 可用 `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` 覆盖。
 */
export const REMOTE_DEBUGGING_PORT = (() => {
    const raw = process.env.BOSS_BROWSER_REMOTE_DEBUGGING_PORT?.trim();
    if (raw) {
        const n = Number.parseInt(raw, 10);
        if (Number.isFinite(n) && n > 0 && n <= 65535)
            return n;
    }
    return 53470;
})();
let spawnedChromeChild = null;
export function clearSpawnedChromeProcessRef() {
    spawnedChromeChild = null;
}
/**
 * 是否以无头（隐藏）方式启动。
 *
 * 优先级：`BOSS_BROWSER_HEADLESS`（本 CLI 专属）> `RECRUIT_BROWSER_HIDDEN`（招聘工具链共读的
 * 统一覆盖开关，**只在显式设置时生效**）> **BOSS 自己的默认：有头**，与上游 `joohw/boss-cli` 一致。
 *
 * **2026-08-19：默认从无头翻回有头。** 本 fork 曾把默认改成无头，理由是招聘浏览器不该
 * 抢前景与键盘焦点，当时对代价的评估是「UA 里多个 `HeadlessChrome`，没有观测到实际危害」。
 * 现在观测到了：
 *
 * - 一个账号被 BOSS 限制 web 端登录，页面文案明确写「检测到您的账号存在使用第三方招聘
 *   管理系统、插件、外挂、软件等辅助工具」——判定的是**工具指纹**，不是打招呼频率。
 * - 另一个团队用上游版（默认有头）长期没事，他们的 AI 擅自改走无头之后当天封号。
 *
 * 两个独立样本都指向无头。抢焦点是体验问题，被限 web 端登录是业务问题。
 * 真要无头，显式设 `RECRUIT_BROWSER_HIDDEN=true`（或 `BOSS_BROWSER_HEADLESS=true`），
 * 并且清楚这是在拿账号冒险。
 *
 * **liepin-cli 那边默认仍是无头**：猎聘的风控形态一次都没观测过，没有证据支持翻它的默认。
 * 所以共读变量是「统一覆盖」而非「提供默认值」——不设时两个 CLI 各用自己的默认。
 */
export function resolveHeadlessFromEnv() {
    const own = process.env.BOSS_BROWSER_HEADLESS?.trim().toLowerCase();
    if (own === 'true' || own === '1' || own === 'yes' || own === 'y')
        return true;
    if (own === 'false' || own === '0' || own === 'no' || own === 'n')
        return false;
    const shared = process.env.RECRUIT_BROWSER_HIDDEN?.trim().toLowerCase();
    if (shared === 'true' || shared === '1' || shared === 'yes' || shared === 'y')
        return true;
    if (shared === 'false' || shared === '0' || shared === 'no' || shared === 'n')
        return false;
    return false;
}
/**
 * 无头模式追加的启动参数。
 *
 * 无头虚拟屏默认是 800x600（Chromium 文档化的默认值），这是个已知的强自动化指纹，
 * 而 `--window-size` **抬不动它** —— 实测只有 `--screen-info` 能改（Chrome 142+，
 * 且仅无头下有效）。`workAreaBottom=40` 让 `screen.availHeight` 小于 `screen.height`，
 * 模拟真实桌面的任务栏。注意命名参数是 workAreaTop/Bottom/Left/Right 四个分开写，
 * 写成 `workArea=` 会让 Chrome 直接启动失败。
 */
const LAUNCH_ARGS_HEADLESS_SCREEN = ['--screen-info={0,0 1920x1080 workAreaBottom=40}'];
/**
 * 探测固定调试端口上已在跑的那只浏览器是不是无头：读 `/json/version` 的
 * User-Agent，无头 Chrome 报 `HeadlessChrome/<ver>`，有头报 `Chrome/<ver>`
 * （实测确认，这是两种模式之间唯一的指纹差异）。
 *
 * 必须这样读**进程外的真实状态**：一次性命令（如 `boss login`）刚起进程时，
 * 任何进程内变量都是空的，靠它们判断等于不判断。
 *
 * 返回 null 表示端口上没有实例在跑。
 *
 * ⚠️ 一旦决定伪装 UA 来规避指纹，这个判据就失效，需要换信号。
 */
export async function probeRemoteHeadless(port = REMOTE_DEBUGGING_PORT, timeoutMs = 800) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: ctrl.signal });
        if (!res.ok)
            return null;
        const data = (await res.json());
        const ua = data['User-Agent'];
        return typeof ua === 'string' ? /HeadlessChrome/i.test(ua) : null;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
}
/**
 * 关掉固定端口上已在跑的浏览器（本进程没有它的引用时用，例如一次性命令要切换模式）。
 * 登录态在 user-data-dir 里，不会因此丢失。
 */
export async function closeRemoteBrowser(port = REMOTE_DEBUGGING_PORT) {
    const wsUrl = await probeRemoteDebuggingWsEndpoint(port, 800);
    if (!wsUrl)
        return false;
    try {
        const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
        await browser.close();
        return true;
    }
    catch {
        return false;
    }
}
/**
 * 探测固定调试端口上是否已有在跑的 Chrome：直接命中 `/json/version` 拿当前
 * `webSocketDebuggerUrl`，避免依赖 `DevToolsActivePort` 这种二级状态文件
 * （可能被陈旧/清理/路径 UUID 漂移影响）。命中即可复用，未命中表示需要 spawn。
 */
async function probeRemoteDebuggingWsEndpoint(port, timeoutMs) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`, {
            signal: ctrl.signal,
        });
        if (!res.ok)
            return undefined;
        const data = (await res.json());
        const ws = data.webSocketDebuggerUrl;
        return typeof ws === 'string' && ws.length > 0 ? ws : undefined;
    }
    catch {
        return undefined;
    }
    finally {
        clearTimeout(timer);
    }
}
function waitForDevToolsWebSocketUrl(proc, userDataDir, timeoutMs) {
    const streams = [proc.stdout, proc.stderr].filter((s) => s != null);
    if (streams.length === 0) {
        return Promise.reject(new Error('浏览器子进程无 stdout/stderr，无法获取 CDP 地址'));
    }
    return new Promise((resolve, reject) => {
        const rls = [];
        let settled = false;
        let timer;
        const cleanup = () => {
            for (const rl of rls) {
                try {
                    rl.close();
                }
                catch {
                    /* ignore */
                }
            }
            rls.length = 0;
        };
        const finish = (fn) => {
            if (settled)
                return;
            settled = true;
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            proc.off('exit', onExit);
            proc.off('error', onProcError);
            cleanup();
            fn();
        };
        timer = setTimeout(() => {
            finish(() => {
                reject(new Error(`等待 Chrome 输出 DevTools 地址超时（${timeoutMs}ms）`));
            });
        }, timeoutMs);
        const onExit = (code) => {
            finish(() => {
                reject(new Error(code === 0
                    ? `浏览器进程立即以代码 0 退出：user-data-dir「${userDataDir}」可能正被另一只「无远程调试端口」的 Chrome 持有（Chrome 单例锁会让我们 spawn 的新进程把命令行交还给它后立刻退出）。请关闭占用该目录的 Chrome 窗口后重试。`
                    : `浏览器进程在就绪前退出（代码 ${code ?? 'unknown'}）`));
            });
        };
        const onProcError = (err) => {
            finish(() => {
                reject(err);
            });
        };
        const onLine = (line) => {
            const m = line.trim().match(CDP_WEBSOCKET_ENDPOINT_REGEX);
            if (m?.[1]) {
                finish(() => {
                    resolve(m[1]);
                });
            }
        };
        proc.once('exit', onExit);
        proc.once('error', onProcError);
        for (const s of streams) {
            const rl = readline.createInterface(s);
            rls.push(rl);
            rl.on('line', onLine);
        }
    });
}
const execFileAsync = promisify(execFile);
/**
 * 把 exe + argv 拼成一条 Windows 命令行（`CreateProcess` 的 `lpCommandLine` 语义）：
 * 含空白或引号的参数整体加双引号，内部 `"` 前补反斜杠，结尾反斜杠成对翻倍。
 *
 * `--screen-info={0,0 1920x1080 workAreaBottom=40}` 这类带空格的参数不加引号会被拆成多个
 * 参数，Chrome 直接启动失败。`spawn()` 在 Windows 上由 libuv 做同样的拼接，走 WMI 就得自己做。
 */
export function toWindowsCommandLine(exe, args) {
    const quote = (s) => {
        if (s.length > 0 && !/[\s"]/.test(s))
            return s;
        let out = '"';
        let pendingBackslashes = 0;
        for (const ch of s) {
            if (ch === '\\') {
                pendingBackslashes++;
                continue;
            }
            if (ch === '"') {
                out += '\\'.repeat(pendingBackslashes * 2 + 1) + '"';
                pendingBackslashes = 0;
                continue;
            }
            out += '\\'.repeat(pendingBackslashes) + ch;
            pendingBackslashes = 0;
        }
        return out + '\\'.repeat(pendingBackslashes * 2) + '"';
    };
    return [exe, ...args].map(quote).join(' ');
}
/**
 * Windows 上是否让浏览器脱离调用方的 Job Object（默认开；`BOSS_SPAWN_BREAKAWAY=false` 关）。
 *
 * recruiting-copilot#43（与 liepin-cli#21 同因）：从 AI Agent 宿主调用 CLI 时，宿主会把整棵
 * 进程树放进一个 `KILL_ON_JOB_CLOSE` 的 Job Object。`spawn({ detached: true })` 在 Windows 上
 * 只是新建进程组，**逃不出 Job**，于是 CLI 进程一结束 Chrome 就被连带 `TerminateProcess`：
 * profile 留下 `exit_type: Crashed`，会话级 cookie 随进程消失，只能反复重新扫码——而高频
 * 重登本身就是平台风控信号。
 */
export function shouldBreakawayFromJob() {
    if (process.platform !== 'win32')
        return false;
    const v = process.env.BOSS_SPAWN_BREAKAWAY?.trim().toLowerCase();
    return !(v === 'false' || v === '0' || v === 'no' || v === 'n');
}
/**
 * 经 WMI `Win32_Process.Create` 拉起浏览器：进程由系统服务 `WmiPrvSE.exe` 创建，因此不在
 * 调用方的 Job Object 里，但仍属于当前交互登录会话（有头窗口照常可见）。
 * 命令行经环境变量交给 PowerShell，省掉再套一层引号转义。
 *
 * 起不来直接抛错，不静默退回 `spawn`：退回等于把 #43 原样带回来且无人察觉。
 */
async function spawnViaWmi(commandLine) {
    let stdout;
    try {
        ({ stdout } = await execFileAsync('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            '$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create ' +
                '-Arguments @{CommandLine=$env:BOSS_SPAWN_CMDLINE}; ' +
                'if ($r.ReturnValue -ne 0) { exit 1 }; $r.ProcessId',
        ], {
            env: { ...process.env, BOSS_SPAWN_CMDLINE: commandLine },
            timeout: 15_000,
            windowsHide: true,
        }));
    }
    catch (e) {
        throw new Error(`经 WMI 启动浏览器失败（${e instanceof Error ? e.message : String(e)}）。` +
            'WMI 用于让浏览器脱离调用方的 Job Object，否则 CLI 一退出 Chrome 就被连带杀掉、登录态丢失。' +
            '若本机禁用了 WMI/PowerShell，可显式设 BOSS_SPAWN_BREAKAWAY=false 退回普通启动（届时 #43 会复现）。');
    }
    const pid = Number.parseInt(stdout.trim(), 10);
    if (!Number.isFinite(pid) || pid <= 0) {
        throw new Error(`WMI 已受理启动请求但未返回有效 PID（stdout: ${JSON.stringify(stdout)}）。`);
    }
    return pid;
}
/** 进程是否还活着（signal 0 只做存在性探测，不投递信号）。 */
function isProcessAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * WMI 路径下没有子进程的 stdout/stderr 可读，改为轮询固定调试端口等待就绪。
 * 端口本来就是固定的（见 `REMOTE_DEBUGGING_PORT`），不需要解析 Chrome 启动日志。
 */
async function waitForRemoteDebuggingWsEndpoint(pid, userDataDir, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const wsUrl = await probeRemoteDebuggingWsEndpoint(REMOTE_DEBUGGING_PORT, 800);
        if (wsUrl)
            return wsUrl;
        if (!isProcessAlive(pid)) {
            throw new Error(`浏览器进程在就绪前退出：user-data-dir「${userDataDir}」可能正被另一只「无远程调试端口」的 Chrome 持有（Chrome 单例锁会让新进程把命令行交还给它后立刻退出）。请关闭占用该目录的 Chrome 窗口后重试。`);
        }
        await new Promise((r) => setTimeout(r, 300));
    }
    throw new Error(`等待浏览器在端口 ${REMOTE_DEBUGGING_PORT} 就绪超时（${timeoutMs}ms，PID ${pid}）。`);
}
/** 在未配置路径时，尝试常见安装位置（Chrome / Edge / Chromium）。 */
function findLocalChromiumExecutable() {
    const candidates = [];
    if (process.platform === 'win32') {
        const local = process.env.LOCALAPPDATA;
        const pf = process.env.PROGRAMFILES;
        const pf86 = process.env['PROGRAMFILES(X86)'];
        if (local) {
            candidates.push(path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'));
        }
        if (pf) {
            candidates.push(path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'));
            candidates.push(path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
        }
        if (pf86) {
            candidates.push(path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'));
            candidates.push(path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
        }
    }
    else if (process.platform === 'darwin') {
        candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium');
    }
    else {
        candidates.push('/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge-stable', '/usr/bin/microsoft-edge');
    }
    for (const p of candidates) {
        if (existsSync(p))
            return p;
    }
    return undefined;
}
/** 减轻「正受到自动测试软件的控制」提示与常见自动化特征（非万能，站点仍可能用其它方式检测）。手动开 Chrome 并接 CDP 时可复用。 */
export const LAUNCH_ARGS_LESS_AUTOMATION = [
    '--disable-infobars',
];
/** 仅用于本地调试：尽量放宽同源/CORS 限制，便于跨域 iframe/canvas 处理。 */
export const LAUNCH_ARGS_ALLOW_ALL_CORS = [
    '--disable-web-security',
    '--allow-running-insecure-content',
];
/**
 * 启动本机浏览器（puppeteer-core 底层为 Chrome DevTools Protocol）。
 *
 * 环境变量（可选）：
 * - `CHROME_PATH` / `PUPPETEER_EXECUTABLE_PATH` — 启动本机浏览器可执行文件路径（高于自动探测）
 * - `BOSS_BROWSER_USER_DATA_DIR` — 启动浏览器时复用的用户数据目录；未设置时默认 `~/.boss-cli/.cache/browser-data`
 * - `BOSS_BROWSER_PROFILE_DIRECTORY` — 启动浏览器时指定 profile（如 `Default`）
 * - `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` — 远程调试端口（默认 53470）；同一 user-data-dir 跨命令复用该端口
 * - `BOSS_BROWSER_ALLOW_ALL_CORS` — 设为 `true` 时附加放宽同源/CORS 的启动参数（仅调试）
 * - `BOSS_BROWSER_DISABLE_GPU` — 设为 `true` 时附加 `--disable-gpu`
 *
 * 若以上均未设置，会按系统尝试常见 Chrome / Edge / Chromium 安装路径。
 * - `RECRUIT_BROWSER_HIDDEN` — 招聘工具链共读的隐藏开关；**默认有界面**，设为 `true` 才无头（有账号风险，见 `resolveHeadlessFromEnv`）。
 * - `BOSS_BROWSER_HEADLESS` — 本 CLI 专属覆盖项，优先级高于 `RECRUIT_BROWSER_HIDDEN`。
 * - `BOSS_BROWSER_VIEWPORT_WIDTH` / `BOSS_BROWSER_VIEWPORT_HEIGHT` — 启动时显式指定视口；未设置时不覆盖浏览器窗口尺寸
 */
/** 启动浏览器时的默认视口（与环境变量一致）；截图恢复时 `viewport()` 为 null 也可用其兜底。 */
export function defaultViewportFromEnv() {
    const w = Number.parseInt(process.env.BOSS_BROWSER_VIEWPORT_WIDTH?.trim() ?? '', 10);
    const h = Number.parseInt(process.env.BOSS_BROWSER_VIEWPORT_HEIGHT?.trim() ?? '', 10);
    return {
        width: Number.isFinite(w) && w > 0 ? w : 1280,
        height: Number.isFinite(h) && h > 0 ? h : 1200,
    };
}
/** 仅在显式配置了视口环境变量时返回启动视口；否则返回 null，不覆盖浏览器实际窗口尺寸。 */
function launchViewportFromEnv() {
    const rawW = process.env.BOSS_BROWSER_VIEWPORT_WIDTH?.trim() ?? '';
    const rawH = process.env.BOSS_BROWSER_VIEWPORT_HEIGHT?.trim() ?? '';
    if (!rawW && !rawH) {
        return null;
    }
    return defaultViewportFromEnv();
}
export async function connectBrowser(options = {}) {
    const executablePath = options.executablePath?.trim() ||
        process.env.CHROME_PATH?.trim() ||
        process.env.PUPPETEER_EXECUTABLE_PATH?.trim() ||
        findLocalChromiumExecutable();
    const envUserData = process.env.BOSS_BROWSER_USER_DATA_DIR?.trim();
    if (!envUserData) {
        ensureAppDataLayout();
    }
    const userDataDir = options.userDataDir?.trim() || envUserData || BROWSER_USER_DATA_DIR;
    const profileDirectory = options.profileDirectory?.trim() || process.env.BOSS_BROWSER_PROFILE_DIRECTORY?.trim();
    if (!executablePath) {
        throw new Error('未找到本机 Chrome/Edge：请设置 CHROME_PATH / PUPPETEER_EXECUTABLE_PATH（可执行文件路径）。');
    }
    const headless = options.headless ?? resolveHeadlessFromEnv();
    const allowAllCors = options.allowAllCors ?? process.env.BOSS_BROWSER_ALLOW_ALL_CORS === 'true';
    const disableGpu = process.env.BOSS_BROWSER_DISABLE_GPU === 'true';
    clearSpawnedChromeProcessRef();
    /**
     * 优先直连固定调试端口上的已有实例：boss-cli 使用独立 user-data-dir，
     * 端口稳定可期，命中即跨命令复用同一只浏览器（同一登录态、同一标签）。
     */
    const existingWsUrl = await probeRemoteDebuggingWsEndpoint(REMOTE_DEBUGGING_PORT, 800);
    if (existingWsUrl) {
        return await puppeteer.connect({
            browserWSEndpoint: existingWsUrl,
            defaultViewport: launchViewportFromEnv(),
        });
    }
    // 默认保留 WebAssembly：`typeof WebAssembly === 'undefined'` 本身就是强自动化指纹。
    // aegis_bg.wasm 已在 CDP `Fetch.enable` 层被阻断，不需要再禁用 WASM 引擎。
    // 仅当显式设置 BOSS_BROWSER_DISABLE_WASM=true/1 时才追加 --noexpose_wasm。
    const disableWasm = process.env.BOSS_BROWSER_DISABLE_WASM === 'true' || process.env.BOSS_BROWSER_DISABLE_WASM === '1';
    const userArgs = [
        ...LAUNCH_ARGS_LESS_AUTOMATION,
        // 上一只若被外力杀掉（Job Object 连带、任务管理器），别弹「要恢复页面吗？Chrome 未正确关闭」
        '--hide-crash-restore-bubble',
        ...(headless ? LAUNCH_ARGS_HEADLESS_SCREEN : []),
        ...(disableGpu ? ['--disable-gpu'] : []),
        ...(disableWasm ? ['--js-flags=--noexpose_wasm'] : []),
        ...(allowAllCors ? LAUNCH_ARGS_ALLOW_ALL_CORS : []),
        ...(profileDirectory ? [`--profile-directory=${profileDirectory}`] : []),
    ];
    let chromeArgs = puppeteer
        .defaultArgs({
        browser: 'chrome',
        userDataDir,
        headless,
        args: userArgs,
    })
        .filter((a) => a !== '--enable-automation' && a !== 'about:blank' && a !== 'data:,');
    if (!chromeArgs.some((a) => a.startsWith('--remote-debugging-'))) {
        chromeArgs.push(`--remote-debugging-port=${REMOTE_DEBUGGING_PORT}`);
    }
    /**
     * Windows 默认经 WMI 启动，让浏览器脱离调用方的 Job Object（见 `shouldBreakawayFromJob`）。
     * 这条路径没有子进程句柄，因此既不会被 Job 连带杀掉，也不会有 stdio 管道拖住 Node 退出。
     */
    if (shouldBreakawayFromJob()) {
        const pid = await spawnViaWmi(toWindowsCommandLine(executablePath, chromeArgs));
        const wsUrl = await waitForRemoteDebuggingWsEndpoint(pid, userDataDir, LAUNCH_READY_MS);
        return await puppeteer.connect({
            browserWSEndpoint: wsUrl,
            defaultViewport: launchViewportFromEnv(),
        });
    }
    /**
     * 不使用 `puppeteer.launch()`：其依赖的 `@puppeteer/browsers` 会在 **Node 进程 `exit` 时 kill 浏览器子进程**，
     * 导致交互模式 / `npm run dev` 退出时窗口被一并关掉。改为自行 `spawn` + `connect`，退出时只断 CDP，浏览器可保留。
     */
    const proc = spawn(executablePath, chromeArgs, {
        detached: true,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    spawnedChromeChild = proc;
    let wsUrl;
    try {
        wsUrl = await waitForDevToolsWebSocketUrl(proc, userDataDir, LAUNCH_READY_MS);
    }
    catch (e) {
        try {
            proc.kill();
        }
        catch {
            /* ignore */
        }
        clearSpawnedChromeProcessRef();
        throw e;
    }
    /**
     * `resume()` 排空管道（不读会把 Chrome 的 stderr 写满阻塞住），`unref()` 解掉管道对
     * event loop 的引用——`proc.unref()` 只作用于子进程句柄，**解不掉 stdio 管道**，
     * 少了这一步 Node 要等常驻 Chrome 退出才返回（#43 里「结果已打印却挂住」的直接原因）。
     */
    try {
        for (const s of [proc.stdout, proc.stderr]) {
            if (!s)
                continue;
            s.resume();
            // 运行时是 net.Socket（有 unref），Readable 的类型签名里没有
            s.unref?.();
        }
    }
    catch {
        /* ignore */
    }
    /** 单例移交时子进程已退出，无句柄可 unref；仅在本进程真正拉起 Chrome 时 unref，避免拖住 Node 退出。 */
    if (proc.exitCode === null && proc.signalCode === null) {
        try {
            proc.unref();
        }
        catch {
            /* ignore */
        }
    }
    else {
        clearSpawnedChromeProcessRef();
    }
    try {
        return await puppeteer.connect({
            browserWSEndpoint: wsUrl,
            defaultViewport: launchViewportFromEnv(),
        });
    }
    catch (e) {
        try {
            proc.kill();
        }
        catch {
            /* ignore */
        }
        clearSpawnedChromeProcessRef();
        throw e;
    }
}
/**
 * 是否禁止 CLI 把 Boss 窗口抢到前台。
 *
 * 默认允许：`page.bringToFront()` 走 `Target.activateTarget`，Windows 上会把**最小化**的窗口
 * 还原并夺取前台焦点。把 CLI 接进后台系统定时跑的人（例如把 boss-cli 打通到内部招聘系统）
 * 会被每条命令弹一次窗口打断办公，所以给一个显式关闭项。
 */
export function resolveNoForegroundFromEnv() {
    const v = process.env.BOSS_BROWSER_NO_FOREGROUND?.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes' || v === 'y';
}
/**
 * 判定这次要不要抢前台：环境变量关了 → 不抢；窗口已被人最小化 → 不抢（尊重人的选择）；
 * 其余情况照旧。抽出来是为了让判定逻辑不依赖真实浏览器就能测。
 */
export function decideBringToFront(windowState, noForeground) {
    if (noForeground)
        return 'skipped-env';
    if (windowState === 'minimized')
        return 'skipped-minimized';
    return 'raised';
}
/**
 * `page.bringToFront()` 的替代：先问 `Browser.getWindowForTarget` 窗口状态，最小化就不动它。
 * 单标签窗口下不抢前台对自动化没有影响；CDP 操作不需要窗口可见。
 */
export async function bringToFrontUnlessMinimized(page) {
    const noForeground = resolveNoForegroundFromEnv();
    let windowState;
    if (!noForeground) {
        const cdp = await page.createCDPSession();
        try {
            ({ windowState } = (await cdp.send('Browser.getWindowForTarget')).bounds);
        }
        finally {
            await cdp.detach();
        }
    }
    const outcome = decideBringToFront(windowState, noForeground);
    if (outcome === 'raised')
        await page.bringToFront();
    return outcome;
}
/**
 * 需要真实渲染的操作（在线简历 canvas、截图）在**最小化**窗口里会永远等不到新帧
 * （实测 `Page.captureScreenshot` 第二次起就挂死）。这里临时把窗口还原成 normal，
 * 跑完立刻再最小化——短暂闪一下，但不把「最小化」这个人的选择永久推翻。
 * 窗口本来没最小化时什么都不做。
 */
export async function withWindowVisible(page, fn) {
    const cdp = await page.createCDPSession();
    let windowId;
    let wasMinimized;
    try {
        const info = await cdp.send('Browser.getWindowForTarget');
        windowId = info.windowId;
        wasMinimized = info.bounds.windowState === 'minimized';
        if (wasMinimized) {
            await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } });
        }
    }
    catch (e) {
        await cdp.detach();
        throw e;
    }
    try {
        return await fn();
    }
    finally {
        try {
            if (wasMinimized) {
                await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } });
            }
        }
        finally {
            await cdp.detach();
        }
    }
}
/** 对某一页创建原生 CDP Session（需要低层域如 `Network.*`、`Fetch.*` 时使用）。 */
export async function createPageCDPSession(page) {
    return page.createCDPSession();
}
//# sourceMappingURL=cdp_browser.js.map