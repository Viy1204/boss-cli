import { randomUUID } from 'node:crypto';
import { TimeoutError } from 'puppeteer-core';
import { RESUME_PREVIEW_OPEN_GAP_MS, sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { SEARCH_CANDIDATE_READER_SCRIPT, VALIDATE_SEARCH_SNAPSHOT_SCRIPT, cancelGreetCardDialog, confirmGreetCardDialog, readGreetCardDialog, renderGreetCardDialog, selectGreetCardDialogJob, validatedSearchSelectionScript, waitForGreetCardDialog, } from '../common/boss_greet_card_dialog.js';
/** 点「畅聊卡」后等确认弹层出现**并渲染完**（职位列表是异步拉的）的最长时间 */
const GREET_CARD_DIALOG_WAIT_MS = 12_000;
const SEARCH_FRAME_READY_TIMEOUT_MS = 18_000;
const JOB_SWITCH_SETTLE_MS = { min: 700, max: 1300 };
/** 城市控件是输入即联想，等联想列表渲染；也顺带把连续点击拉开距离。 */
const CITY_SETTLE_MS = { min: 800, max: 1500 };
/** 等城市联想列表出现的上限。异步拉取，固定 sleep 会偶发误报「没有联想结果」。 */
const CITY_SUGGEST_TIMEOUT_MS = 8_000;
/** 等筛选面板（学历/院校）重渲染完成的上限。选完城市后整块会重挂。 */
const FILTER_PANEL_TIMEOUT_MS = 10_000;
/** 学历 / 院校勾选之间的间隔，别连点。 */
const FILTER_SETTLE_MS = { min: 600, max: 1200 };
/** 平台对「专业」的限制，弹层标题写死「最多选择10个」。 */
const MAJOR_MAX_SELECT = 10;
/** 滑块拖几次还没停在目标档位就认输报错，别无限纠偏。 */
const SLIDER_MAX_ATTEMPTS = 6;
/** 年龄下拉里「46岁+」这一项在 hidden 里存的哨兵值（实测）。 */
const AGE_PLUS_HIDDEN_VALUE = 10000;
/**
 * 页面上有两个 `.major-dialog`（专业、资格证书），没展开的那个 `display:none` 但仍在 DOM 里。
 * 所有弹层内的查找都得先挑出可见的那个，否则会操作到「资格证书」的控件上。
 */
const VISIBLE_MAJOR_DIALOG = 'Array.from(document.querySelectorAll(".major-dialog")).find((el) => getComputedStyle(el).display !== "none")';
/**
 * 专业**联想结果**（打字之后出现的那一列），必须限定在 `.major-lists` 里。
 *
 * 弹层里还有一棵分类树（工学 / 经管类 / 教育学…），它的条目**用的是同一个
 * `li[ka="search_select_major"]`**。不限定的话，输入框一清空就会立刻匹配到分类树，
 * 「等联想结果出现」直接空转，读到的候选是上一轮的或者整棵树。
 */
const MAJOR_SUGGEST_ITEMS = `Array.from(${VISIBLE_MAJOR_DIALOG}?.querySelectorAll('.major-lists li[ka="search_select_major"]') ?? [])`;
/**
 * 默认搜索城市。**不硬编码深圳**——这个包是公开发布的，别人不一定在深圳；
 * 不设这个变量时完全不碰城市控件，行为与加本功能之前一致。
 */
export function defaultSearchCityFromEnv() {
    return process.env.BOSS_SEARCH_CITY?.trim() ?? '';
}
/**
 * 解析 `--school` / `--status` / `--major` 这类可多选参数的逗号分隔值。
 * 中英文逗号都收——中文输入法下顺手打出全角逗号太常见，
 * 因此而报「院校要求没有『统招本科,985院校』这一项」纯属自找麻烦。
 */
export function parseFilterLabels(raw) {
    if (!raw) {
        return [];
    }
    return raw
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean);
}
/**
 * 「跳槽频率」的选项里有个 `时间≥1年`——`≥` 在键盘上打不出来。
 * 允许用户写 `>=`，映射到页面上的真实文案；其余一律按原样完全匹配。
 */
export function normalizeFilterLabel(raw) {
    return raw.trim().replace(/>=/g, '≥');
}
/**
 * 拆 `--exp-range` / `--age-range` 的 `下限-上限`。
 * 半角/全角连字符和波浪号都收，理由同逗号：中文输入法下这几个键太容易打串。
 */
export function parseRangeArg(raw) {
    const parts = raw
        .trim()
        .split(/[-－~～]/)
        .map((s) => s.trim())
        .filter(Boolean);
    if (parts.length !== 2) {
        throw new Error(`区间要写成「下限-上限」两段，收到「${raw}」。`);
    }
    return { min: parts[0], max: parts[1] };
}
/**
 * 经验滑块共 12 档，档位文案是实测出来的（拖到各个百分比读 tooltip）：
 * 1=在校/应届，2..11=「(档位-1)年」，12=10年以上。
 */
export const EXP_SLIDER_STOPS = 12;
export function expSliderLabel(index) {
    if (index === 1) {
        return '在校/应届';
    }
    if (index === EXP_SLIDER_STOPS) {
        return '10年以上';
    }
    return `${index - 1}年`;
}
/**
 * 学历滑块共 7 档，档位文案同样是实测 tooltip 读出来的，**不是照学历常识排的**
 * （第 2 档是「中专/中技」不是「中专」，写错就永远匹配不上）。
 */
export const DEGREE_SLIDER_LABELS = [
    '初中及以下',
    '中专/中技',
    '高中',
    '大专',
    '本科',
    '硕士',
    '博士',
];
export const DEGREE_SLIDER_STOPS = DEGREE_SLIDER_LABELS.length;
export function degreeSliderLabel(index) {
    return DEGREE_SLIDER_LABELS[index - 1] ?? `第${index}档`;
}
/** 把 `--degree-range` 的一段转成滑块档位；只认页面上那七个文案。 */
export function degreeTokenToIndex(token) {
    const t = token.trim();
    const i = DEGREE_SLIDER_LABELS.indexOf(t);
    if (i < 0) {
        throw new Error(`学历区间只认：${DEGREE_SLIDER_LABELS.join('｜')}，收到「${token}」。`);
    }
    return i + 1;
}
/**
 * 把 `--exp-range` 的一段转成滑块档位。收 `应届`、`0`~`10`、`10+`。
 * 不认的值直接报错——猜错档位＝搜错人群，而且用户不会发现。
 */
export function expTokenToIndex(token) {
    const t = token.trim();
    if (t === '应届' || t === '在校' || t === '在校/应届' || t === '0') {
        return 1;
    }
    if (t === '10+' || t === '10以上' || t === '10年以上') {
        return EXP_SLIDER_STOPS;
    }
    const years = Number(t.replace(/年$/, ''));
    if (!Number.isInteger(years) || years < 1 || years > 10) {
        throw new Error(`经验区间只认「应届」、1-10 的整数年、或「10+」，收到「${token}」。`);
    }
    return years + 1;
}
/** 把 `--age-range` 的一段转成年龄下拉里的文案。收 `16`~`46` 与 `46+`。 */
export function ageTokenToLabel(token) {
    const t = token.trim();
    if (t === '46+' || t === '46以上' || t === '46岁+') {
        return '46岁+';
    }
    const age = Number(t.replace(/岁$/, ''));
    if (!Number.isInteger(age) || age < 16 || age > 46) {
        throw new Error(`年龄区间只认 16-46 的整数、或「46+」，收到「${token}」。`);
    }
    return `${age}岁`;
}
export function isBossChatSearchUrl(url) {
    try {
        const u = new URL(url);
        if (!u.hostname.includes('zhipin.com')) {
            return false;
        }
        const p = u.pathname.replace(/\/+$/, '') || '/';
        return p === '/web/chat/search';
    }
    catch {
        return false;
    }
}
const VISIBLE_SEARCH_IFRAME_SCRIPT = `
  const searchIframes = Array.from(document.querySelectorAll('iframe[name="searchFrame"]')).filter(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    for (let node = el; node; node = node.parentElement) {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    }
    return true;
  });
  if (searchIframes.length > 1) throw new Error("存在多个可见搜索 iframe；无法可靠定位。");
  const iframe = searchIframes[0];
`;
async function getSearchFrame(page) {
    const token = randomUUID();
    const binding = await page.evaluate(`(() => {
    ${VISIBLE_SEARCH_IFRAME_SCRIPT}
    const doc = iframe?.contentDocument;
    if (!doc) throw new Error("当前搜索 iframe 文档尚未就绪。");
    doc.defaultView.__bossCliSearchFrameBinding = ${JSON.stringify(token)};
    return { name: iframe.name, url: doc.location.href };
  })()`);
    const matches = page.frames().filter(frame => frame.name() === binding.name && frame.url() === binding.url);
    const verified = [];
    for (const frame of matches) {
        if (await frame.evaluate(`window.__bossCliSearchFrameBinding === ${JSON.stringify(token)}`))
            verified.push(frame);
    }
    if (verified.length !== 1)
        throw new Error('搜索 iframe 与读取 frame 不匹配；停止操作。');
    return verified[0];
}
async function ensureSearchFrameReady(frame) {
    await frame.waitForFunction(`(() => {
      const input = document.querySelector(".search-input");
      if (!(input instanceof HTMLInputElement)) return false;
      const list = document.querySelector(".geek-list-wrap, .card-list");
      const hasCard = document.querySelectorAll(".geek-info-card").length > 0;
      const empty = document.querySelector(".empty-tips");
      return !!list || hasCard || !!empty;
    })()`, { timeout: SEARCH_FRAME_READY_TIMEOUT_MS, polling: 100 });
}
async function invalidateSearchSnapshots(page) {
    for (const frame of page.frames()) {
        if (frame.name() !== 'searchFrame')
            continue;
        await frame.evaluate('delete window.__bossCliSearchSnapshot');
    }
}
export async function ensureInNormalSearchPage(page) {
    let stage = '搜索表单与当前 iframe 就绪';
    try {
        if (!isBossChatSearchUrl(page.url())) {
            stage = '侧栏进入 /web/chat/search';
            const clicked = await page.evaluate(`(() => {
        const link = document.querySelector('.menu-geeksearch a[ka="menu-geek-search"]');
        if (!(link instanceof HTMLElement)) throw new Error("未找到侧栏搜索入口；停止操作。");
        link.click();
        return true;
      })()`);
            if (!clicked)
                throw new Error('侧栏搜索入口点击失败；停止操作。');
            await page.waitForFunction('location.pathname === "/web/chat/search"', { timeout: SEARCH_FRAME_READY_TIMEOUT_MS, polling: 100 });
        }
        stage = '搜索表单与当前 iframe 就绪';
        return await settleNormalSearchFrame(page);
    }
    catch (error) {
        if (!(error instanceof TimeoutError))
            throw error;
        throw new Error(`search 初始化超时（阶段：${stage}；当前页面：${page.url()}）。${error.message}\n请先在浏览器中确认登录和验证状态，再显式执行 boss reload；主壳刷新成功后重新执行原 boss search 命令。`, { cause: error });
    }
}
const selectedSearchJobs = new WeakMap();
export async function settleNormalSearchFrame(page, expected = {}, phase = 'form') {
    if (!isBossChatSearchUrl(page.url()))
        throw new Error('搜索期间页面已离开 /web/chat/search；停止操作。');
    await page.waitForFunction('!!document.querySelector(\'iframe[name="searchFrame"]\')', { timeout: SEARCH_FRAME_READY_TIMEOUT_MS, polling: 100 });
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: SEARCH_FRAME_READY_TIMEOUT_MS });
    const token = randomUUID();
    await page.waitForFunction(`(() => {
    if (location.pathname !== "/web/chat/search") throw new Error("搜索期间页面已离开搜索页；停止操作。");
    ${VISIBLE_SEARCH_IFRAME_SCRIPT}
    const doc = iframe?.contentDocument;
    if (!doc || !["interactive", "complete"].includes(doc.readyState)) return false;
    return (() => {
      const document = doc;
      ${SEARCH_CANDIDATE_READER_SCRIPT}
      const visible = el => {
        if (!el || el.getBoundingClientRect().width <= 0 || el.getBoundingClientRect().height <= 0) return false;
        for (let node = el; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
        }
        return true;
      };
      if (!visible(iframe) || Array.from(document.querySelectorAll(".toast-con.toast-loading")).some(visible)) return false;
      const input = document.querySelector(".search-input");
      const job = norm(document.querySelector(".search-current-job")?.textContent);
      const active = document.querySelector('.search-job-list-C li[ka="search_select_job"].active');
      const activeJob = active?.querySelector(".job-name");
      const selectedJob = activeJob ? norm(activeJob.textContent) : norm(active?.textContent);
      const cityLabel = norm(document.querySelector(".city-wrap .city")?.textContent);
      const city = cityLabel === "城市" ? "" : cityLabel;
      const expected = ${JSON.stringify(expected)};
      const list = document.querySelector(".geek-list-wrap, .card-list");
      if (!input || !list || !job || selectedJob !== job) return false;
      if (expected.job !== undefined && job !== expected.job) return false;
      if (expected.keyword !== undefined && input.value !== expected.keyword) return false;
      if (expected.city !== undefined && city !== expected.city) return false;
      const cards = Array.from(document.querySelectorAll(".geek-info-card"));
      if (${phase === 'results'} && cards.length === 0 && !visible(document.querySelector(".empty-tips"))) return false;
      const signature = JSON.stringify({ job, keyword: input.value, city, candidates: ${phase === 'results'} ? cards.map(readCandidate) : [] });
      const previous = window.__bossCliSearchSettling;
      if (!previous || previous.token !== ${JSON.stringify(token)} || previous.doc !== doc || previous.signature !== signature) {
        window.__bossCliSearchSettling = { token: ${JSON.stringify(token)}, doc, signature, since: Date.now() };
        return false;
      }
      return Date.now() - previous.since >= 500;
    })();
  })()`, { timeout: SEARCH_FRAME_READY_TIMEOUT_MS, polling: 100 });
    if (!isBossChatSearchUrl(page.url()))
        throw new Error('搜索期间页面已离开 /web/chat/search；停止操作。');
    const frame = await getSearchFrame(page);
    const stillBound = await page.evaluate(`(() => {
    ${VISIBLE_SEARCH_IFRAME_SCRIPT}
    return iframe?.contentDocument === window.__bossCliSearchSettling?.doc;
  })()`);
    if (!stillBound || await getSearchFrame(page) !== frame)
        throw new Error('搜索结果 frame 已重建；请重新执行 boss search。');
    return frame;
}
export async function assertNormalSearchPageReadyForPreview(page) {
    if (!isBossChatSearchUrl(page.url())) {
        throw new Error('当前不在常规搜索页（/web/chat/search），请先通过 boss search 进入。');
    }
    const frame = await getSearchFrame(page);
    await ensureSearchFrameReady(frame);
    return frame;
}
export async function runKeywordSearch(page, frame, keyword, expected) {
    const selected = selectedSearchJobs.get(page);
    const jobId = expected.job === '不限职位' ? '' : selected && selected.label === expected.job ? selected.id : undefined;
    if (jobId === undefined)
        throw new Error('缺少当前已选岗位与请求 jobId 的绑定证据；停止关键词搜索。');
    const pending = new Set();
    let resolveResult;
    let rejectResult;
    const result = new Promise((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
    const started = (request) => {
        const url = new URL(request.url());
        if (request.frame() === frame && url.origin === 'https://www.zhipin.com' &&
            url.pathname === '/wapi/zpitem/web/boss/search/geeks.json' &&
            url.searchParams.get('keywords') === keyword && url.searchParams.get('jobId') === jobId && url.searchParams.get('page') === '1')
            pending.add(request);
    };
    const responded = (response) => { if (pending.has(response.request()))
        resolveResult(response); };
    page.on('request', started);
    page.on('response', responded);
    const timeout = setTimeout(() => rejectResult(new Error('没有等到与本次关键词及岗位绑定的结果响应；停止搜索。')), SEARCH_FRAME_READY_TIMEOUT_MS);
    try {
        const [dispatched, response] = await Promise.all([frame.evaluate(`(() => {
      const input = document.querySelector(".search-input");
      if (!(input instanceof HTMLInputElement)) throw new Error("未找到搜索关键词输入框。");
      input.focus(); input.value = ${JSON.stringify(keyword)};
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      ["keydown", "keyup"].forEach(type => input.dispatchEvent(new KeyboardEvent(type, {
        key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true,
      })));
      return true;
    })()`), result]);
        if (!dispatched)
            throw new Error('搜索关键词事件未触发；停止搜索。');
        if (response.status() < 200 || response.status() >= 300)
            throw new Error(`搜索结果 HTTP ${response.status()}；停止搜索。`);
        const payload = await response.json();
        if (payload?.code !== 0 || !Array.isArray(payload?.zpData?.geeks) || payload.zpData.page !== 1) {
            throw new Error(`搜索结果业务状态或数据结构异常（code=${payload?.code}）；停止搜索。`);
        }
        const ids = payload.zpData.geeks.map((geek) => geek?.geekCard?.encryptGeekId);
        if (ids.some((id) => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length) {
            throw new Error('结果响应缺少唯一候选人ID；停止搜索。');
        }
        try {
            await page.waitForFunction(`(() => {
        if (location.pathname !== "/web/chat/search") throw new Error("搜索期间页面已离开搜索页。");
        ${VISIBLE_SEARCH_IFRAME_SCRIPT}
        const doc = iframe?.contentDocument;
        if (!doc) return false;
        const expectedIds = ${JSON.stringify(ids)};
        const actualIds = Array.from(doc.querySelectorAll(".geek-info-card")).map(card => card.__vue__?.$props?.geek?.geekCard?.encryptGeekId);
        return actualIds.length === expectedIds.length && actualIds.every((id, i) => id === expectedIds[i]);
      })()`, { timeout: SEARCH_FRAME_READY_TIMEOUT_MS, polling: 100 });
        }
        catch (error) {
            throw new Error(`本次搜索结果候选人ID未应用到当前列表：${error instanceof Error ? error.message : String(error)}`);
        }
        const resultFrame = await settleNormalSearchFrame(page, { ...expected, keyword }, 'results');
        const applied = await resultFrame.evaluate(`(() => {
      const expectedIds = ${JSON.stringify(ids)};
      const actualIds = Array.from(document.querySelectorAll(".geek-info-card")).map(card => card.__vue__?.$props?.geek?.geekCard?.encryptGeekId);
      return actualIds.length === expectedIds.length && actualIds.every((id, i) => id === expectedIds[i]);
    })()`);
        if (!applied)
            throw new Error('当前搜索列表候选人ID与本次结果响应不一致；未创建搜索快照。');
        return { frame: resultFrame, candidateIds: ids };
    }
    finally {
        clearTimeout(timeout);
        page.off('request', started);
        page.off('response', responded);
    }
}
async function readNormalSearchKeyword(frame) {
    return (await frame.evaluate(`(() => document.querySelector(".search-input")?.value?.trim() ?? "")()`));
}
async function readCurrentSearchJob(frame) {
    return (await frame.evaluate(`(() => (document.querySelector(".search-current-job")?.textContent ?? "").replace(/\\s+/g, " ").trim())()`));
}
export async function readNormalSearchSelectedJobLabel(frame) {
    const label = await readCurrentSearchJob(frame);
    return label || '默认';
}
/**
 * 在常规搜索页（iframe）切换当前岗位。岗位选项常驻 `.job-name`（即账号自己的开放职位），
 * 模糊匹配 keyword 后点击，等待 `.search-current-job` 变更。keyword 为空则返回当前岗位。
 */
export async function selectNormalSearchJob(frame, keyword, page) {
    const kw = keyword.trim();
    if (!kw) {
        return readNormalSearchSelectedJobLabel(frame);
    }
    const kwLiteral = JSON.stringify(kw);
    // 岗位下拉的选项（.job-name）常驻 DOM，但先点触发器展开以兼容折叠态。
    await frame.evaluate(`(() => {
    const h = document.querySelector(".search-job-list-C .ui-dropmenu-label");
    if (h instanceof HTMLElement) {
      h.scrollIntoView({ block: "center", inline: "nearest" });
      h.click();
    }
  })()`);
    await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
    let selectedId;
    const recordJob = (request) => {
        const url = new URL(request.url());
        if (request.frame() === frame && url.origin === 'https://www.zhipin.com' && url.pathname === '/wapi/zpitem/web/boss/search/getFilterConditions.json') {
            const id = url.searchParams.get('encryptJobId');
            if (id)
                selectedId = id;
        }
    };
    page?.on('request', recordJob);
    try {
        const picked = (await frame.evaluate(`(() => {
      const kw = ${kwLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
      const items = Array.from(document.querySelectorAll('.search-job-list-C li[ka="search_select_job"] .job-name'));
      if (items.length === 0) return { ok: false, reason: "empty" };
      const matches = items.filter((el) => norm(el.textContent).includes(norm(kw)));
      if (matches.length > 1) return { ok: false, reason: "ambiguous", available: matches.map(el => (el.textContent ?? "").trim()) };
      const target = matches[0];
      if (!(target instanceof HTMLElement)) {
        return { ok: false, reason: "not_found", available: items.map((el) => (el.textContent ?? "").replace(/\\s+/g, " ").trim()) };
      }
      const label = (target.textContent ?? "").replace(/\\s+/g, " ").trim();
      target.scrollIntoView({ block: "center", inline: "nearest" });
      target.click();
      return { ok: true, label };
    })()`));
        if (!picked.ok) {
            if (picked.reason === 'ambiguous')
                throw new Error(`岗位关键词命中多人选项，请使用完整职位名称：${(picked.available ?? []).join('｜')}`);
            if (picked.reason === 'not_found') {
                const avail = (picked.available ?? []).join('｜');
                throw new Error(`未找到匹配岗位“${kw}”。可选岗位：${avail || '（空）'}`);
            }
            throw new Error('未找到常规搜索岗位下拉选项（.job-name）。');
        }
        const label = picked.label ?? kw;
        const selectedFrame = page ? await settleNormalSearchFrame(page, { job: label }) : frame;
        await waitForSelectedSearchJob(selectedFrame, label);
        await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
        if (page) {
            if (!selectedId)
                throw new Error('已选岗位缺少 getFilterConditions 请求绑定；停止搜索。');
            selectedSearchJobs.set(page, { label, id: selectedId });
        }
        return label;
    }
    finally {
        page?.off('request', recordJob);
    }
}
async function waitForSelectedSearchJob(frame, label) {
    await frame.waitForFunction(`(() => {
    const norm = v => (v ?? "").replace(/\\s+/g, " ").trim();
    return norm(document.querySelector(".search-current-job")?.textContent) === ${JSON.stringify(label)};
  })()`, { timeout: 8_000, polling: 100 });
    const actual = await readCurrentSearchJob(frame);
    if (actual !== label)
        throw new Error(`搜索岗位未生效：期望「${label}」，实际「${actual}」。`);
}
/**
 * 把当前岗位切成「不限职位」——搜全池而不是被某个岗位的画像圈住。
 *
 * 它是岗位下拉的第一项，但**不带 `.job-name`**（那个 class 只给真实职位用），
 * 所以 `selectNormalSearchJob` 的选择器扫不到它，得单独按 `li[ka="search_select_job"]` 找。
 */
export async function selectNormalSearchAnyJob(frame, page) {
    const current = await readCurrentSearchJob(frame);
    if (current === '不限职位') {
        return current;
    }
    await frame.evaluate(`(() => {
    const h = document.querySelector(".search-job-list-C .ui-dropmenu-label");
    if (h instanceof HTMLElement) {
      h.scrollIntoView({ block: "center", inline: "nearest" });
      h.click();
    }
  })()`);
    await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
    const ok = (await frame.evaluate(`(() => {
    const items = Array.from(document.querySelectorAll('li[ka="search_select_job"]'));
    const target = items.find((el) => (el.textContent ?? "").replace(/\\s+/g, "").trim() === "不限职位");
    if (!(target instanceof HTMLElement)) return false;
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return true;
  })()`));
    if (!ok) {
        throw new Error('未找到岗位下拉里的「不限职位」项（li[ka="search_select_job"]）。');
    }
    await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
    const selectedFrame = page ? await settleNormalSearchFrame(page, { job: '不限职位' }) : frame;
    await waitForSelectedSearchJob(selectedFrame, '不限职位');
    return '不限职位';
}
export async function prepareNormalSearchJob(page, frame, keyword) {
    await selectNormalSearchAnyJob(frame, page);
    let current = await settleNormalSearchFrame(page, { job: '不限职位' });
    const label = keyword ? await selectNormalSearchJob(current, keyword, page) : '不限职位';
    current = await settleNormalSearchFrame(page, { job: label });
    return { frame: current, label };
}
/**
 * 读当前已选城市；未选时返回空串。
 *
 * ⚠️ **不能用 `gray-color` 判占位**：实测选中深圳之后该 class 仍然挂着，
 * 只有文案从「城市」变成「深圳」。所以判据是文案本身。
 */
async function readSelectedCity(frame) {
    return (await frame.evaluate(`(() => {
    const el = document.querySelector(".city-wrap .city");
    if (!el) return "";
    const t = (el.textContent ?? "").replace(/\\s+/g, " ").trim();
    return t === "城市" ? "" : t;
  })()`));
}
/**
 * 选搜索城市。控件是「输入即联想」，不是普通下拉：
 * 点 `.city-wrap` 让输入框获焦 → 往 `.search-city-kw input` 里敲字 →
 * 冒出 `.city-box .search-result-item` → 点中文本完全相同的那一项。
 *
 * **必须走真实键盘输入**（ElementHandle.type）：页面是 Vue，直接改 `input.value`
 * 不触发 input 事件，联想列表根本不会出来。
 *
 * 已经是目标城市就直接返回，不做任何点击——少一次无谓交互就少一分自动化特征。
 */
export async function selectNormalSearchCity(frame, city) {
    const target = city.trim();
    if (!target) {
        return readSelectedCity(frame);
    }
    const current = await readSelectedCity(frame);
    if (current === target) {
        return current;
    }
    await frame.evaluate(`(() => {
    const el = document.querySelector(".city-wrap");
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
    }
  })()`);
    await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);
    const input = await frame.$('.search-city-kw input');
    if (!input) {
        throw new Error('未找到城市输入框（.search-city-kw input）。');
    }
    /**
     * 先清空残留再输入，否则会叠成「深圳深圳」，联想列表直接给「暂无结果」。
     *
     * ⚠️ **必须走 DOM 赋值 + 派发 input 事件**，不能用键盘 Backspace 清：
     * 本机实测按 4 次 Backspace 后 `input.value` 纹丝不动（Vue 受控输入，
     * 且这个框在 `hideCity` 状态下拿不到真实焦点）。派发 input 事件才是 v-model 认的那条路。
     * 清空之后再用真实键盘打字——打字本身没问题，有问题的只有清空。
     */
    await frame.evaluate(`(() => {
    const el = document.querySelector(".search-city-kw input");
    if (el) {
      el.value = "";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  })()`);
    await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);
    await input.type(target, { delay: 90 });
    /**
     * 联想列表是异步拉的，**必须等它出现再读**——早先用固定 sleep 等，
     * 本机实测会偶发「没有联想结果」误报（sleep 到点了列表还没渲染）。
     */
    try {
        await frame.waitForFunction(`(() => document.querySelectorAll(".city-box .search-result-item").length > 0)()`, { timeout: CITY_SUGGEST_TIMEOUT_MS, polling: 100 });
    }
    catch {
        throw new Error(`城市「${target}」在 ${CITY_SUGGEST_TIMEOUT_MS / 1000}s 内没等到联想结果，换个写法试试（如「深圳」而不是「深圳市」）。`);
    }
    await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);
    // 目标城市内联进脚本，理由同 runKeywordSearch：字符串 pageFunction 收不到入参，
    // 走入参的话这里恒为 `{}`，每次都报「查无此项」。
    const picked = (await frame.evaluate(`(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
      const want = ${JSON.stringify(target)};
      const all = Array.from(document.querySelectorAll(".city-box .search-result-item"));
      // 没命中时平台会渲染一条「暂无结果」占位项——它不是候选城市，别当成选项。
      const items = all.filter((el) => norm(el.textContent) !== "暂无结果");
      if (items.length === 0) return { ok: false, reason: "empty" };
      const exact = items.find((el) => norm(el.textContent) === norm(want));
      // 只点完全匹配项。模糊命中就点第一个太危险——「南京」可能点成「南京市六合区」。
      if (!exact) return { ok: false, reason: "no_exact", options: items.map((el) => norm(el.textContent)) };
      const label = norm(exact.textContent);
      exact.scrollIntoView({ block: "center", inline: "nearest" });
      exact.click();
      return { ok: true, label, exact: true };
    })()`));
    if (!picked.ok) {
        if (picked.reason === 'no_exact') {
            throw new Error(`城市「${target}」没有完全匹配项，已中止以免选错。候选：${(picked.options ?? []).join('｜')}`);
        }
        throw new Error(`城市「${target}」查无此项，换个写法试试（如「深圳」而不是「深圳市」）。`);
    }
    await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);
    return picked.label ?? target;
}
/**
 * 在筛选面板里点一项，**查找与点击在同一次 evaluate 内完成**。
 *
 * 为什么不能「先等面板出现、再点」：选完城市后这块会异步重渲染，
 * 「等到了」和「去点」之间存在窗口期，元素在这中间被卸载 —— 本机实测稳定复现
 * 「等待通过、紧接着 querySelector 返回 null」。把两步合成一次原子操作，
 * 外层只负责在 `no_root` 时重试，重渲染就只是多试一轮而不是直接报错。
 */
async function clickFilterItem(frame, rootSel, itemSel, want, opts = {}) {
    const expr = `(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
    const root = document.querySelector(${JSON.stringify(rootSel)});
    if (!root) return { ok: false, reason: "no_root" };
    const items = Array.from(root.querySelectorAll(${JSON.stringify(itemSel)}));
    const target = items.find((el) => norm(el.textContent) === norm(${JSON.stringify(want)}));
    if (!(target instanceof HTMLElement)) {
      return { ok: false, reason: "not_found", options: items.map((el) => norm(el.textContent)) };
    }
    const label = norm(target.textContent);
    if (${opts.skipIfActive ? 'true' : 'false'} && target.className.includes("active")) {
      return { ok: true, label, already: true };
    }
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label, already: false };
  })()`;
    return evalWithPanelRetry(frame, expr);
}
/**
 * 跑一段筛选面板脚本，只在它报 `no_root`（整块还没挂上来）时重试。
 * 选项本身不存在是用户传错了值，立即返回让上层报错。
 */
async function evalWithPanelRetry(frame, expr) {
    const deadline = Date.now() + FILTER_PANEL_TIMEOUT_MS;
    for (;;) {
        const r = (await frame.evaluate(expr));
        if (r.ok || r.reason !== 'no_root' || Date.now() > deadline) {
            return r;
        }
        await sleepRandom(300, 600);
    }
}
/** 学历要求：`.degree-ui` 里的单选项，当前选中项带 `.active`（已选中就不重复点）。 */
export async function selectNormalSearchDegree(frame, degree) {
    const target = degree.trim();
    if (!target) {
        return '';
    }
    const picked = await clickFilterItem(frame, '.degree-ui', '.degree-item', target, {
        skipIfActive: true,
    });
    if (!picked.ok) {
        if (picked.reason === 'not_found') {
            throw new Error(`学历要求没有「${target}」这一项。可选：${(picked.options ?? []).join('｜')}`);
        }
        throw new Error(`未找到学历要求控件（.degree-ui），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    if (!picked.already) {
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    return picked.label ?? target;
}
/**
 * 经验要求：预设项和自定义滑块是互斥的两条路，读的时候两条都得看。
 * 只看预设项的话，用自定义区间筛出来的结果标题里会什么都不显示。
 */
async function readSelectedExp(frame) {
    const preset = await readActiveFilterItem(frame, '.exp-list-ui', '.exp-item');
    if (preset) {
        return preset;
    }
    const range = await readSliderRange(frame, EXP_SLIDER);
    return range ? `${expSliderLabel(range.min)}-${expSliderLabel(range.max)}（自定义）` : '';
}
/** 年龄要求：同上，预设项之外还要看自定义的那两个下拉。 */
async function readSelectedAge(frame) {
    const preset = await readActiveFilterItem(frame, '.age-list-ui', '.age-item');
    if (preset) {
        return preset;
    }
    const range = await readAgeCustomRange(frame);
    return range ? `${range.min}-${range.max}（自定义）` : '';
}
/**
 * 经验要求：`.exp-list-ui` 里的单选项
 * （在校/应届 / 25年毕业 / 26年毕业 / 26年后毕业 / 1-3年 / 3-5年 / 5-10年）。
 *
 * 旁边还有个「自定义」滑块（`.experience-select-custom-slider`）没做——拖滑块的交互
 * 和点选项完全是两回事，等真有人需要「6-8年」这种区间再说。
 */
export async function selectNormalSearchExp(frame, exp) {
    const target = exp.trim();
    if (!target) {
        return '';
    }
    const picked = await clickFilterItem(frame, '.exp-list-ui', '.exp-item', target, {
        skipIfActive: true,
    });
    if (!picked.ok) {
        if (picked.reason === 'not_found') {
            throw new Error(`经验要求没有「${target}」这一项。可选：${(picked.options ?? []).join('｜')}`);
        }
        throw new Error(`未找到经验要求控件（.exp-list-ui），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    if (!picked.already) {
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    return picked.label ?? target;
}
/**
 * 年龄要求：`.age-list-ui` 里的单选项（20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上）。
 * 「自定义」那对下拉（`.age-custom`，默认 `display:none`）同样没做。
 */
export async function selectNormalSearchAge(frame, age) {
    const target = age.trim();
    if (!target) {
        return '';
    }
    const picked = await clickFilterItem(frame, '.age-list-ui', '.age-item', target, {
        skipIfActive: true,
    });
    if (!picked.ok) {
        if (picked.reason === 'not_found') {
            throw new Error(`年龄要求没有「${target}」这一项。可选：${(picked.options ?? []).join('｜')}`);
        }
        throw new Error(`未找到年龄要求控件（.age-list-ui），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    if (!picked.already) {
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    return picked.label ?? target;
}
const EXP_SLIDER = {
    wrap: '.experience-select-custom-slider',
    stops: EXP_SLIDER_STOPS,
    label: expSliderLabel,
    name: '经验',
};
const DEGREE_SLIDER = {
    wrap: '.degree-select-custom-slider',
    stops: DEGREE_SLIDER_STOPS,
    label: degreeSliderLabel,
    name: '学历',
};
/** 读滑块的当前档位；`null` 表示还是默认的整段（＝没用自定义）。 */
async function readSliderRange(frame, spec) {
    const { min, max } = await readSliderIndices(frame, spec);
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        return null;
    }
    if (min === 1 && max === spec.stops) {
        return null;
    }
    return { min, max };
}
/**
 * 拖经验滑块到指定档位区间。
 *
 * ⚠️ **拖完必须按 hidden input 的真实档位校验并纠偏**，不能拖完就当成了：
 * 本机实测按百分比一把拖过去经常差一格（要第 4 档落在第 3 档、要第 9 档落在第 8 档），
 * 因为按下的位置是手柄中心、而手柄本身有 12px 宽，半格的偏移足够跨过吸附边界。
 * 差一格就是搜错人群，而且用户完全看不出来。
 *
 * 也没有键盘可用——手柄拿不到焦点，方向键实测无效。
 */
async function dragSliderRange(page, frame, spec, minIndex, maxIndex) {
    const bar = await frame.$(`${spec.wrap} .ui-slider-wrap`);
    const barBox = await bar?.boundingBox();
    if (!barBox) {
        throw new Error(`未找到${spec.name}自定义滑块（${spec.wrap}）。`);
    }
    const stepPx = barBox.width / (spec.stops - 1);
    // 先拖右手柄再拖左手柄：清空后默认是整段，右手柄往左收不会被左手柄挡住。
    await dragOneHandle(page, frame, spec, barBox.x, stepPx, 1, maxIndex);
    await dragOneHandle(page, frame, spec, barBox.x, stepPx, 0, minIndex);
}
async function dragOneHandle(page, frame, spec, barLeft, stepPx, handleIndex, targetIndex) {
    const targetX = barLeft + (targetIndex - 1) * stepPx;
    /**
     * 拖完按 hidden 的真实档位校验，没到位就把「差了几格」累积成像素偏置，
     * 拖到**绝对目标位置 + 偏置**再来一次。实测三轮内收敛。
     *
     * 不按「从当前手柄位置相对移动几格」算：那样会在差一格的位置反复横跳，六次全废。
     * 也不要试图给某个手柄写死一个固定偏移——组件的响应跟手柄的起始位置有关
     * （同一个指针位置，从第 7 档拖过来落在第 4 档，从第 6 档拖过来落在第 5 档），
     * 写死偏移能修好学历滑块就会弄坏经验滑块。只有"拖完读真值再纠"这条路是通的。
     */
    let biasPx = 0;
    for (let attempt = 0; attempt < SLIDER_MAX_ATTEMPTS; attempt++) {
        const handles = await frame.$$(`${spec.wrap} .ui-slider-button-wrap`);
        const box = await handles[handleIndex]?.boundingBox();
        if (!box) {
            throw new Error(`未找到${spec.name}滑块的拖动手柄（.ui-slider-button-wrap）。`);
        }
        const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        const landed = await readSliderIndices(frame, spec);
        const current = handleIndex === 0 ? landed.min : landed.max;
        if (current === targetIndex) {
            return;
        }
        if (attempt > 0) {
            biasPx += (targetIndex - current) * stepPx;
        }
        /**
         * 钳住：**不许拖到对面手柄的位置上去**。
         * 两个手柄一旦重叠，`$$` 出来的第 0 / 第 1 个就分不清谁是谁了，后面每一轮都在抓错的那个，
         * 纠偏彻底失效——本机实测就这么把 [1,7] 拖成了 [7,7] 然后六轮全废。
         */
        const otherIndex = handleIndex === 0 ? landed.max : landed.min;
        const otherX = barLeft + (otherIndex - 1) * stepPx;
        const to = handleIndex === 0
            ? Math.min(targetX + biasPx, otherX - stepPx / 2)
            : Math.max(targetX + biasPx, otherX + stepPx / 2);
        /**
         * 松手前那一下 0.5px 的微动 + 停顿是必须的：最后一个 mousemove 会被帧合并吃掉，
         * 组件按上一帧的位置吸附。加上之后实测 5 次里 4 次一把到位。
         */
        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await sleepRandom(120, 200);
        await page.mouse.move(to, from.y, { steps: 20 });
        await sleepRandom(120, 200);
        await page.mouse.move(to + 0.5, from.y);
        await sleepRandom(300, 420);
        await page.mouse.up();
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    const final = await readSliderIndices(frame, spec);
    const got = handleIndex === 0 ? final.min : final.max;
    if (got !== targetIndex) {
        throw new Error(`${spec.name}滑块拖了 ${SLIDER_MAX_ATTEMPTS} 次也没停在「${spec.label(targetIndex)}」，当前停在「${spec.label(got)}」。`);
    }
}
async function readSliderIndices(frame, spec) {
    const raw = (await frame.evaluate(`(() => document.querySelector("${spec.wrap} .ui-slider input[type=hidden]")?.value ?? "")()`));
    const [min, max] = raw.split(',').map((s) => Number(s));
    return { min, max };
}
/**
 * 经验要求（自定义区间）：拖 `.experience-select-custom-slider` 的双手柄滑块。
 * 一拖动，预设那排的「不限」就会自动取消，两者是互斥的。
 */
export async function selectNormalSearchExpRange(page, frame, minToken, maxToken) {
    return setSliderRange(page, frame, EXP_SLIDER, expTokenToIndex(minToken), expTokenToIndex(maxToken));
}
/**
 * 学历要求（自定义区间）：拖 `.degree-select-custom-slider`，七档
 * 初中及以下 → 博士。预设那排只有「本科及以上 / 硕士及以上 / 博士」，
 * 想要「大专-本科」这种带上限的区间只能走这里。
 */
export async function selectNormalSearchDegreeRange(page, frame, minToken, maxToken) {
    return setSliderRange(page, frame, DEGREE_SLIDER, degreeTokenToIndex(minToken), degreeTokenToIndex(maxToken));
}
async function setSliderRange(page, frame, spec, minIndex, maxIndex) {
    if (minIndex > maxIndex) {
        throw new Error(`${spec.name}区间的下限「${spec.label(minIndex)}」比上限「${spec.label(maxIndex)}」还大。`);
    }
    await dragSliderRange(page, frame, spec, minIndex, maxIndex);
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    return `${spec.label(minIndex)}-${spec.label(maxIndex)}`;
}
/**
 * 读年龄自定义的两个下拉；没展开或没选满两头就返回 `null`。
 *
 * ⚠️ 值在 **`input[type=hidden]`** 上，不在可见的那个 `input.ipt`——后者选完仍然是空的
 * （和「跳槽频率」那种把文案写进 `span.ipt` 的下拉不是一个渲染方式）。
 * 取值实测：普通年龄存数字本身，「46岁+」存 `10000`，「不限」存 `-1`，没选过是 `0`。
 */
async function readAgeCustomRange(frame) {
    const raw = (await frame.evaluate(`(() => {
    const box = document.querySelector(".age-custom");
    if (!box || getComputedStyle(box).display === "none") return null;
    const vals = Array.from(box.querySelectorAll(".dropdown-wrap")).map((w) => w.querySelector('input[type=hidden]')?.value ?? "");
    return vals.length === 2 ? vals : null;
  })()`));
    if (!raw) {
        return null;
    }
    const labels = raw.map((v) => ageHiddenToLabel(v));
    if (labels.some((v) => !v)) {
        return null;
    }
    return { min: labels[0], max: labels[1] };
}
/** 年龄下拉的 hidden 值 → 页面文案；`0`（没选）和 `-1`（不限）都算"没筛"。 */
function ageHiddenToLabel(raw) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n === 0 || n === -1) {
        return '';
    }
    return n >= AGE_PLUS_HIDDEN_VALUE ? '46岁+' : `${n}岁`;
}
/**
 * 年龄要求（自定义区间）：点「自定义」展开 `.age-custom`，里面是两个下拉（16岁…46岁+）。
 * 和经验那个滑块不一样，这里是规规矩矩的下拉，选完读回 `span.ipt` 校验。
 */
export async function selectNormalSearchAgeRange(frame, minToken, maxToken) {
    const minLabel = ageTokenToLabel(minToken);
    const maxLabel = ageTokenToLabel(maxToken);
    const opened = await evalWithPanelRetry(frame, `(() => {
      const custom = document.querySelector(".age-list-ui .custom");
      if (!(custom instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      const box = document.querySelector(".age-custom");
      if (box && getComputedStyle(box).display !== "none") return { ok: true };
      custom.scrollIntoView({ block: "center", inline: "nearest" });
      custom.click();
      return { ok: true };
    })()`);
    if (!opened.ok) {
        throw new Error(`未找到年龄的「自定义」入口（.age-list-ui .custom），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    await pickAgeCustomDropdown(frame, 0, minLabel);
    await pickAgeCustomDropdown(frame, 1, maxLabel);
    // 两头都选完再校验一次页面上真实显示的值，别拿入参当结果。
    const got = await readAgeCustomRange(frame);
    if (!got || got.min !== minLabel || got.max !== maxLabel) {
        throw new Error(`年龄自定义区间没落到「${minLabel}-${maxLabel}」，页面现在显示：${got ? `${got.min}-${got.max}` : '（空）'}。`);
    }
    return `${minLabel}-${maxLabel}`;
}
async function pickAgeCustomDropdown(frame, index, label) {
    const opened = await evalWithPanelRetry(frame, `(() => {
      const wrap = document.querySelectorAll(".age-custom .dropdown-wrap")[${index}];
      if (!wrap) return { ok: false, reason: "no_root" };
      const trigger = wrap.querySelector(".dropdown-select");
      if (!(trigger instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      trigger.scrollIntoView({ block: "center", inline: "nearest" });
      trigger.click();
      return { ok: true };
    })()`);
    if (!opened.ok) {
        throw new Error('未找到年龄自定义的下拉（.age-custom .dropdown-wrap）。');
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    const picked = (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
    const wrap = document.querySelectorAll(".age-custom .dropdown-wrap")[${index}];
    if (!wrap) return { ok: false, reason: "no_root" };
    const options = Array.from(wrap.querySelectorAll(".dropdown-menu li"));
    const hit = options.find((el) => norm(el.textContent) === norm(${JSON.stringify(label)}));
    if (!(hit instanceof HTMLElement)) {
      return { ok: false, reason: "not_found", options: options.map((el) => norm(el.textContent)) };
    }
    hit.click();
    return { ok: true, label: norm(hit.textContent) };
  })()`));
    if (!picked.ok) {
        throw new Error(`年龄下拉里没有「${label}」这一项。可选：${(picked.options ?? []).join('｜') || '（菜单未展开）'}`);
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
}
/**
 * 院校要求：`.school-ui` 里的多选框（统招本科 / 双一流院校 / 211院校 / 985院校 /
 * 留学生 / QS 100 / QS 500），以及单独一个「只看第一学历」（提示语写明＝第一学历为全日制本科）。
 *
 * 逐个点，每点一个歇一下——一次性连点是很明显的机器行为。
 */
export async function selectNormalSearchSchools(frame, labels) {
    const wanted = labels.map((s) => s.trim()).filter(Boolean);
    const done = [];
    for (const label of wanted) {
        const picked = await clickFilterItem(frame, '.school-ui', '.checkbox-text', label);
        if (!picked.ok) {
            if (picked.reason === 'not_found') {
                throw new Error(`院校要求没有「${label}」这一项。可选：${(picked.options ?? []).join('｜')}`);
            }
            throw new Error(`未找到院校要求控件（.school-ui），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
        }
        done.push(picked.label ?? label);
        // 逐个点、每点一个歇一下——一次性连点是很明显的机器行为。
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    return done;
}
/**
 * 读页面上**当前生效**的学历要求；「不限」＝没筛，返回空串。
 *
 * 回显必须读页面，不能把入参原样打印：筛选条件是平台侧状态、跨命令粘着，
 * 打入参的话「上次设过、这次没传」的条件会照样生效却不显示，用户会以为没筛。
 */
async function readSelectedDegree(frame) {
    const preset = await readActiveFilterItem(frame, '.degree-ui', '.degree-item');
    if (preset) {
        return preset;
    }
    const range = await readSliderRange(frame, DEGREE_SLIDER);
    return range
        ? `${degreeSliderLabel(range.min)}-${degreeSliderLabel(range.max)}（自定义）`
        : '';
}
/**
 * 读「经验要求」/「年龄要求」当前选中项；「不限」＝没筛，返回空串。
 *
 * 这两块和 `.degree-ui` 长得一模一样（单选 `span`，选中带 `.active`），
 * 但它们**不在**「其他筛选」里，是两个独立的顶层块，别到 `.more-filter-container` 里找。
 */
async function readActiveFilterItem(frame, rootSel, itemSel) {
    return (await frame.evaluate(`(() => {
    const el = document.querySelector("${rootSel} ${itemSel}.active");
    const t = (el?.textContent ?? "").replace(/\\s+/g, " ").trim();
    return t === "不限" ? "" : t;
  })()`));
}
/** 读页面上当前勾中的院校要求。勾中态在 `input.checkbox-input` 的 `checked` 属性上。 */
async function readSelectedSchools(frame) {
    return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    return Array.from(document.querySelectorAll(".school-ui .checkbox"))
      .filter((el) => el.querySelector("input.checkbox-input")?.checked)
      .map((el) => norm(el.querySelector(".checkbox-text")?.textContent))
      .filter(Boolean);
  })()`));
}
/**
 * 读「其他筛选」里当前非默认的条件。
 *
 * 三类控件的判据不一样：
 * - 下拉型（性别 / 牛人活跃度 / 跳槽频率）：`input.ipt` 的 `placeholder` 一直在，
 *   拿它和显示文案 `span.ipt` 比，不同即已选。这也是选中之后唯一还认得出「这是哪一项」的锚点。
 * - 多选型（求职状态 / 牛人职位要求）：选中后 `.input-container` 挂上 `not-default-select`，
 *   占位文案 `.defalut-select` 被替换成若干 `.select-item`——**没有** placeholder 可读，
 *   所以只回显值不回显项名（值本身够自解释，如「离职-随时到岗」）。
 * - 专业 / 资格证书：`.major-input-ui` 的文案直接被选中项替换掉。
 */
async function readOtherFilters(frame) {
    return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const out = [];
    const root = document.querySelector(".more-filter-container");
    if (!root) return out;

    root.querySelectorAll(".dropdown-wrap").forEach((wrap) => {
      const ph = norm(wrap.querySelector("input.ipt")?.getAttribute("placeholder"));
      const shown = norm(wrap.querySelector("span.ipt")?.textContent);
      if (ph && shown && shown !== ph && shown !== "不限") out.push(ph + "：" + shown);
    });

    root.querySelectorAll(".input-container.not-default-select").forEach((box) => {
      const vals = Array.from(box.querySelectorAll(".select-item")).map((el) => norm(el.textContent));
      if (vals.length > 0) out.push(vals.join("/"));
    });

    root.querySelectorAll(".major-input-ui").forEach((el) => {
      const t = norm(el.textContent);
      if (t && t !== "专业" && t !== "资格证书") out.push("专业：" + t);
    });

    const salary = norm(root.querySelector(".salary-container")?.textContent);
    if (salary && salary !== "薪资区间") out.push("薪资：" + salary);

    return out;
  })()`));
}
/**
 * 点「清空筛选」把筛选条件归零。
 *
 * 为什么每次搜索前都要清：条件存在**平台侧**、跨命令粘着。不清的话「这次怎么只有 3 个人」
 * 永远得靠猜是不是上次设的条件还挂着——这跟「不传 --job 就切不限职位」是同一个理由。
 *
 * 实测 `.reset-btn` 清的是学历 / 院校 / 其他筛选；关键词、当前岗位、城市**不动**
 * （那三项本来就由 `--job` / `--city` / 关键词各自显式管）。
 *
 * 已经全是默认态就跳过——少一次无谓点击就少一分自动化特征。
 */
export async function assertNormalSearchFiltersClear(frame) {
    const [degree, exp, age, schools, others] = await Promise.all([
        readSelectedDegree(frame), readSelectedExp(frame), readSelectedAge(frame), readSelectedSchools(frame), readOtherFilters(frame),
    ]);
    if (degree || exp || age || schools.length > 0 || others.length > 0) {
        throw new Error(`清空筛选未生效：${[degree, exp, age, ...schools, ...others].filter(Boolean).join('｜')}；停止搜索。`);
    }
}
export async function resetNormalSearchFilters(frame, page) {
    const dirty = (await readSelectedDegree(frame)) !== '' ||
        (await readSelectedExp(frame)) !== '' ||
        (await readSelectedAge(frame)) !== '' ||
        (await readSelectedSchools(frame)).length > 0 ||
        (await readOtherFilters(frame)).length > 0;
    if (!dirty) {
        return false;
    }
    const clicked = await evalWithPanelRetry(frame, `(() => {
      const btn = document.querySelector(".reset-btn");
      if (!btn) return { ok: false, reason: "no_root" };
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { ok: true };
    })()`);
    if (!clicked.ok) {
        throw new Error(`未找到「清空筛选」按钮（.reset-btn），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    const resetFrame = page ? await settleNormalSearchFrame(page) : frame;
    await resetFrame.waitForFunction(`(() => {
      const isDefault = (sel) => {
        const el = document.querySelector(sel);
        return !el || (el.textContent ?? "").replace(/\\s+/g, "").trim() === "不限";
      };
      const schoolOk = Array.from(document.querySelectorAll(".school-ui input.checkbox-input")).every((el) => !el.checked);
      // 自定义区间也要回到默认，否则下一轮会在上一轮的滑块位置上继续拖。
      const sliderDefault = (sel, stops) => {
        const el = document.querySelector(sel + " .ui-slider input[type=hidden]");
        return !el || el.value === "1," + stops;
      };
      const sliderOk = sliderDefault(".experience-select-custom-slider", ${EXP_SLIDER_STOPS})
        && sliderDefault(".degree-select-custom-slider", ${DEGREE_SLIDER_STOPS});
      const ageBox = document.querySelector(".age-custom");
      const ageOk = !ageBox || getComputedStyle(ageBox).display === "none";
      return isDefault(".degree-ui .degree-item.active")
        && isDefault(".exp-list-ui .exp-item.active")
        && isDefault(".age-list-ui .age-item.active")
        && schoolOk && sliderOk && ageOk;
    })()`, { timeout: FILTER_PANEL_TIMEOUT_MS, polling: 100 });
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    return true;
}
/**
 * 求职状态：`.mutil-select` 多选下拉（离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 / 在职-月内到岗）。
 *
 * 只能先展开再点选项——菜单是展开时才挂上 DOM 的。而占位文案「求职状态」一旦选中第一项就被
 * 替换掉，所以**先记住它在 `.filter-2-item` 里的下标**，后续都按下标操作，不再按文案找。
 * （这里能靠下标是因为每次搜索前都清过筛选，展开时占位文案一定还在。）
 */
export async function selectNormalSearchStatus(frame, labels) {
    const wanted = labels.map((s) => s.trim()).filter(Boolean);
    if (wanted.length === 0) {
        return [];
    }
    const opened = await evalWithPanelRetry(frame, `(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
      const items = Array.from(document.querySelectorAll(".more-filter-container .filter-2-item"));
      if (items.length === 0) return { ok: false, reason: "no_root" };
      const index = items.findIndex((el) => norm(el.querySelector(".defalut-select")?.textContent) === "求职状态");
      if (index < 0) return { ok: false, reason: "not_found" };
      const trigger = items[index].querySelector(".input-container");
      if (!(trigger instanceof HTMLElement)) return { ok: false, reason: "not_found" };
      trigger.scrollIntoView({ block: "center", inline: "nearest" });
      trigger.click();
      return { ok: true, index };
    })()`);
    if (!opened.ok) {
        throw new Error('未找到「求职状态」筛选项（.more-filter-container 里的 .mutil-select）。');
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    const done = [];
    for (const label of wanted) {
        const picked = (await frame.evaluate(`(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
      const item = document.querySelectorAll(".more-filter-container .filter-2-item")[${opened.index}];
      if (!item) return { ok: false, reason: "no_root" };
      const options = Array.from(item.querySelectorAll('li[ka="search_dropdown_menu_click"]'));
      const target = options.find((el) => norm(el.textContent) === norm(${JSON.stringify(label)}));
      if (!(target instanceof HTMLElement)) {
        return { ok: false, reason: "not_found", options: options.map((el) => norm(el.textContent)) };
      }
      target.click();
      return { ok: true, label: norm(target.textContent) };
    })()`));
        if (!picked.ok) {
            throw new Error(`求职状态没有「${label}」这一项。可选：${(picked.options ?? []).join('｜') || '（菜单未展开）'}`);
        }
        done.push(picked.label ?? label);
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    // 收起菜单，别让它挂在页面上挡住后面的点击。
    await frame.evaluate(`(() => {
    const item = document.querySelectorAll(".more-filter-container .filter-2-item")[${opened.index}];
    const trigger = item?.querySelector(".input-container");
    if (trigger instanceof HTMLElement) trigger.click();
  })()`);
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    return done;
}
/**
 * 跳槽频率：`.work-year-select` 单选下拉（不限 / 5年少于3份 / 时间≥1年）。
 *
 * 锚点用 `input.ipt` 的 placeholder 而不是文案——「性别」和「牛人活跃度」共用
 * `.gender-select` 这个 class，只有 placeholder 能把三个下拉分开。
 */
export async function selectNormalSearchJobHop(frame, label) {
    const target = normalizeFilterLabel(label);
    if (!target) {
        return '';
    }
    const opened = await evalWithPanelRetry(frame, `(() => {
      const wrap = document.querySelector('.more-filter-container input.ipt[placeholder="跳槽频率"]')?.closest(".dropdown-wrap");
      if (!wrap) return { ok: false, reason: "no_root" };
      const trigger = wrap.querySelector(".dropdown-select");
      if (!(trigger instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      trigger.scrollIntoView({ block: "center", inline: "nearest" });
      trigger.click();
      return { ok: true };
    })()`);
    if (!opened.ok) {
        throw new Error(`未找到「跳槽频率」筛选项，等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    const picked = (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
    const wrap = document.querySelector('.more-filter-container input.ipt[placeholder="跳槽频率"]')?.closest(".dropdown-wrap");
    if (!wrap) return { ok: false, reason: "no_root" };
    const options = Array.from(wrap.querySelectorAll(".dropdown-menu li"));
    const want = norm(${JSON.stringify(target)});
    const hit = options.find((el) => norm(el.textContent) === want);
    if (!(hit instanceof HTMLElement)) {
      return { ok: false, reason: "not_found", options: options.map((el) => norm(el.textContent)) };
    }
    hit.click();
    return { ok: true, label: norm(hit.textContent) };
  })()`));
    if (!picked.ok) {
        throw new Error(`跳槽频率没有「${target}」这一项。可选：${(picked.options ?? []).join('｜') || '（菜单未展开）'}`);
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    return picked.label ?? target;
}
/**
 * 专业：点 `.major-input-ui` 弹出 `.major-dialog` 弹层（`v-transfer-dom`，挂在 body 上，
 * 但仍在同一个 iframe 文档里），在搜索框里打专业名 → 点联想项 → 点「确定」。
 *
 * 和城市一样**只认完全匹配**：搜「计算机」会出几十条（计算机科学与技术 / 计算机应用工程 /
 * 计算机速录……），替用户挑一条的代价是整轮白跑且他不知道。平台限选 10 个。
 *
 * ⚠️ **一个专业开一次弹层**。平台的搜索框选中一项之后就不再出联想了——本机实测：
 * 选完「计算机科学与技术」再打「软件工程」，`.major-lists` 根本不渲染，失焦重聚焦、
 * 多敲一个字再退格都救不回来。而「确定」关掉再重开，搜索框就恢复正常，
 * 且已选的专业还在。所以多个专业只能一个一个来，这是平台行为不是效率取舍。
 */
export async function selectNormalSearchMajors(frame, labels) {
    const wanted = labels.map((s) => s.trim()).filter(Boolean);
    if (wanted.length === 0) {
        return [];
    }
    if (wanted.length > MAJOR_MAX_SELECT) {
        throw new Error(`专业最多选 ${MAJOR_MAX_SELECT} 个，收到 ${wanted.length} 个。`);
    }
    // 上一次跑崩留下的弹层会挡住后面所有点击，先收干净再开工。
    await closeMajorDialog(frame, false);
    const done = [];
    for (const label of wanted) {
        const input = await openMajorDialog(frame);
        try {
            await input.click();
            await input.type(label, { delay: 90 });
            try {
                await frame.waitForFunction(`(() => (${MAJOR_SUGGEST_ITEMS}).length > 0)()`, {
                    timeout: CITY_SUGGEST_TIMEOUT_MS, polling: 100,
                });
            }
            catch {
                const blank = (await frame.evaluate(`(() => (${VISIBLE_MAJOR_DIALOG}?.querySelector(".major-lists .blank")?.textContent ?? "").replace(/\\s+/g, " ").trim())()`));
                throw new Error(blank
                    ? `专业「${label}」查无此项（平台提示：${blank}）。`
                    : `专业「${label}」在 ${CITY_SUGGEST_TIMEOUT_MS / 1000}s 内没等到联想结果。`);
            }
            await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
            const picked = (await frame.evaluate(`(() => {
        const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
        const options = ${MAJOR_SUGGEST_ITEMS};
        if (options.length === 0) return { ok: false, reason: "no_root" };
        const want = norm(${JSON.stringify(label)});
        const hit = options.find((el) => norm(el.textContent) === want);
        if (!(hit instanceof HTMLElement)) {
          return { ok: false, reason: "not_found", options: options.map((el) => norm(el.textContent)).slice(0, 20) };
        }
        hit.click();
        return { ok: true, label: norm(hit.textContent) };
      })()`));
            if (!picked.ok) {
                throw new Error(`专业「${label}」没有完全匹配项，已中止以免选错。候选（最多列 20 条）：${(picked.options ?? []).join('｜')}`);
            }
            done.push(picked.label ?? label);
        }
        catch (e) {
            // 报错也得把弹层收掉，否则下一条命令一上来就被这个遮罩挡死。
            await closeMajorDialog(frame, false);
            throw e;
        }
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
        await closeMajorDialog(frame, true);
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
    return done;
}
/**
 * 展开「专业」弹层，返回里面的搜索框。
 *
 * 触发器认「`.more-filter-container` 里那个没被 `display:none` 藏起来的 `.major-input-ui`」——
 * 不能按文案找「专业」：选中之后文案会被选中的专业名替换掉，第二轮就找不着了。
 * 另一个 `.major-input-ui` 是「资格证书」，它所在的 `.filter-2-item` 一直是 `display:none`。
 */
async function openMajorDialog(frame) {
    const opened = await evalWithPanelRetry(frame, `(() => {
      const el = Array.from(document.querySelectorAll(".more-filter-container .major-input-ui"))
        .find((node) => {
          const item = node.closest(".filter-2-item");
          return item && getComputedStyle(item).display !== "none";
        });
      if (!(el instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
      return { ok: true };
    })()`);
    if (!opened.ok) {
        throw new Error(`未找到「专业」筛选项（.major-input-ui），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
    }
    /**
     * ⚠️ 必须带 `visible: true`：页面上有**两个** `.major-dialog`（专业、资格证书），
     * 没展开的那个是 `display:none` 但仍在 DOM 里，不挑可见的会抓到「资格证书」的输入框。
     */
    const input = await frame.waitForSelector('.major-dialog .major-input input', {
        timeout: FILTER_PANEL_TIMEOUT_MS,
        visible: true,
    });
    if (!input) {
        throw new Error('「专业」弹层没出来（.major-dialog .major-input input）。');
    }
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    return input;
}
/**
 * 关「专业」弹层：`confirm` 为真点「确定」落选中项，否则点「取消」丢弃。
 * 弹层本来就没开时点不到按钮，对「取消」来说这不是错（收拾残局用得上）。
 */
async function closeMajorDialog(frame, confirm) {
    const wantText = confirm ? '确定' : '取消';
    const ok = (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
    const btns = Array.from(${VISIBLE_MAJOR_DIALOG}?.querySelectorAll(".major-footer-btns *") ?? []);
    const hit = btns.find((el) => norm(el.textContent) === ${JSON.stringify(wantText)});
    if (!(hit instanceof HTMLElement)) return false;
    hit.click();
    return true;
  })()`));
    if (!ok && confirm) {
        throw new Error('「专业」弹层里没找到「确定」按钮，选中的专业可能没生效。');
    }
    if (ok) {
        await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
    }
}
export async function openNormalSearchResumePreview(frame, target, index) {
    const selection = await selectSearchPoolCandidate(frame, { target, index, match: 'name' });
    await frame.evaluate(`(() => {
    ${validatedSearchSelectionScript(selection)}
    const nameLabel = picked.querySelector(".name-label");
    if (!(nameLabel instanceof HTMLElement)) throw new Error("候选人简历入口 .name-label 不存在；未点击。");
    nameLabel.scrollIntoView({ block: "center", inline: "nearest" });
    (() => { ${validatedSearchSelectionScript(selection)} })();
    if (picked.querySelector(".name-label") !== nameLabel) throw new Error("候选人简历入口已变化；未点击。");
    nameLabel.click();
  })()`);
    await sleepRandom(RESUME_PREVIEW_OPEN_GAP_MS.min, RESUME_PREVIEW_OPEN_GAP_MS.max);
    return { name: selection.name, index: selection.index };
}
/**
 * 搜索池卡片上「开聊」按钮的文案白名单（前缀匹配）。
 *
 * ⚠️ 平台 2026-10 改版：按钮文案由「畅聊卡 N/M」变为「立即沟通(N/M)」，类名也由
 * `btn-getcontact` 变为 `btn position-rights`。同卡片还有「不感兴趣」，故只能按文案
 * 白名单挑按钮，不能取卡片里第一个 `button`——取错会把候选人标成不合适。
 * 加了 `^` 前缀锚定：宁可漏判（报错文案会列出卡片内按钮供排查），也不误点。
 *
 * ⚠️ 2026-10-10 补充：部分候选人卡片上没有「畅聊/立即沟通」，只显示「联系Ta」——
 * 「联系Ta」只表示开聊入口，实际凭据须由模式和确认弹层验证，
 * 故并入白名单（大小写用 `[Tt][Aa]` 兜住）。
 */
export const SEARCH_POOL_CONTACT_LABEL_PATTERN = '^(立即沟通|继续沟通|畅聊卡|畅聊|沟通|联系[Tt][Aa])';
async function selectSearchPoolCandidate(frame, locator) {
    return (await frame.evaluate(`(() => {
    const frameBinding = window.__bossCliSearchFrameBinding;
    if (!frameBinding) throw new Error("缺少当前搜索 frame 绑定；请重新执行 boss search。");
    const searchWindow = window;
    const searchDocument = document;
    ${VALIDATE_SEARCH_SNAPSHOT_SCRIPT}
    const wantIndex = ${JSON.stringify(locator.index ?? null)};
    const raw = ${JSON.stringify((locator.target ?? '').trim())};
    const loose = (v) => norm(v).replace(/[*＊\\s]/g, "").toLowerCase();
    const key = loose(raw);
    const nameOnly = ${JSON.stringify(locator.match === 'name')};
    const matches = card => key && (loose(readCandidate(card).name).includes(key) ||
      (!nameOnly && loose(readCandidate(card).summary).includes(key)));
    let index = wantIndex;
    if (index !== null) {
      if (!Number.isInteger(index) || index < 1 || index > cards.length) throw new Error("搜索快照中没有此序号。");
      if (raw && !matches(cards[index - 1])) throw new Error("--index 与候选人关键词不匹配，目标冲突；未点击任何候选人。");
    } else {
      const hits = cards.map((card, i) => matches(card) ? i + 1 : null).filter(i => i !== null);
      if (hits.length !== 1) throw new Error("搜索快照中关键词没有唯一匹配；请核对后用 --index 指定。");
      index = hits[0];
    }
    const name = readCandidate(cards[index - 1]).name;
    if (!name) throw new Error("搜索快照目标没有可核对的姓名；未点击候选人。");
    return { snapshotId: snapshot.id, frameBinding, index, name };
  })()`));
}
async function validateSearchPoolSelection(frame, selection) {
    await frame.evaluate(`(() => { ${validatedSearchSelectionScript(selection)} })()`);
}
async function clickSearchPoolContactButton(frame, selection) {
    return (await frame.evaluate(`(() => {
    ${validatedSearchSelectionScript(selection)}
    const { name, summary } = readCandidate(picked);
    const contactByText = new RegExp(${JSON.stringify(SEARCH_POOL_CONTACT_LABEL_PATTERN)});
    const btn = Array.from(picked.querySelectorAll("button, .btn-getcontact"))
      .find(el => contactByText.test(norm(el.textContent)));
    if (!(btn instanceof HTMLElement)) return { kind: "no_btn", name, hint: Array.from(picked.querySelectorAll("button")).map(el => norm(el.textContent)).filter(Boolean).slice(0, 8) };
    const text = norm(btn.textContent);
    if (/disabled|forbid|ban/i.test(btn.className || "") || btn.getAttribute("disabled") !== null) return { kind: "disabled", name, text };
    btn.scrollIntoView({ block: "center", inline: "nearest" });
    (() => { ${validatedSearchSelectionScript(selection)} })();
    if (!Array.from(picked.querySelectorAll("button, .btn-getcontact")).includes(btn) || norm(btn.textContent) !== text ||
        /disabled|forbid|ban/i.test(btn.className || "") || btn.getAttribute("disabled") !== null) {
      throw new Error("沟通按钮已变化；未点击。");
    }
    btn.click();
    return { kind: "clicked", index: pickedIndex + 1, name, text, summary };
  })()`));
}
const CHAT_MODE_WRAP_SELECTOR = '.change-chat-mode-wrap';
const READ_CHAT_MODE_SCRIPT = `(() => {
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const wrap = document.querySelector(${JSON.stringify(CHAT_MODE_WRAP_SELECTOR)});
  if (!wrap) return { present: false, current: "", options: [] };
  const modes = Array.from(wrap.querySelectorAll(".chat-mode"));
  const checked = modes.find((m) => (m.className || "").split(/\\s+/).indexOf("checked") !== -1);
  return {
    present: true,
    current: norm(checked === undefined || checked === null ? "" : checked.textContent),
    options: modes.map((m) => norm(m.textContent)),
  };
})()`;
export async function readSearchPoolChatMode(page) {
    return (await page.evaluate(READ_CHAT_MODE_SCRIPT));
}
/** 悬停详情面板的 caret，展开「选择开聊模式」浮层（`.chat-modes` 初始 display:none）。 */
const REVEAL_CHAT_MODE_POPOVER_SCRIPT = `(() => {
  const wrap = document.querySelector(${JSON.stringify(CHAT_MODE_WRAP_SELECTOR)});
  if (!wrap) return false;
  const arrow = wrap.querySelector(".arrow") || wrap;
  ["mouseenter", "mouseover"].forEach((ev) => arrow.dispatchEvent(new MouseEvent(ev, { bubbles: true })));
  return true;
})()`;
/** 按明确文案选择账号权益或畅聊卡模式。 */
function pickChatModeScript(mode) {
    const pattern = mode === 'card' ? '^使用畅聊卡进行沟通$' : '^使用(?:VVIP)?账号权益进行沟通$';
    return `(() => {
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const wrap = document.querySelector(${JSON.stringify(CHAT_MODE_WRAP_SELECTOR)});
  if (!wrap) return "no-wrap";
  const target = Array.from(wrap.querySelectorAll(".chat-mode")).find((m) => new RegExp(${JSON.stringify(pattern)}).test(norm(m.textContent)));
  if (!target) return "no-option";
  ["mousedown", "mouseup", "click"].forEach((ev) => target.dispatchEvent(new MouseEvent(ev, { bubbles: true })));
  return "picked";
})()`;
}
/**
 * 验证详情面板开聊模式；须先打开候选人详情。
 * 已是该模式则原样返回，不重复点。返回切换后的状态。
 */
export async function ensureSearchPoolChatMode(page, mode) {
    const pattern = mode === 'card' ? '^使用畅聊卡进行沟通$' : '^使用(?:VVIP)?账号权益进行沟通$';
    const matches = (text) => new RegExp(pattern).test(text);
    const before = await readSearchPoolChatMode(page);
    if (!before.present || !before.current)
        throw new Error('无法识别详情面板当前开聊模式；停止操作。');
    if (matches(before.current))
        return before;
    await page.evaluate(REVEAL_CHAT_MODE_POPOVER_SCRIPT);
    await sleepRandom(240, 460);
    const picked = await page.evaluate(pickChatModeScript(mode));
    if (picked !== 'picked')
        throw new Error(`无法切换开聊模式（${picked}）；当前：${before.current}；可选：${before.options.join(' | ')}`);
    await page.waitForFunction(`(() => {
    const checked = document.querySelector(${JSON.stringify(CHAT_MODE_WRAP_SELECTOR)})?.querySelector(".chat-mode.checked");
    return new RegExp(${JSON.stringify(pattern)}).test((checked?.textContent ?? "").replace(/\\s+/g, " ").trim());
  })()`, { timeout: 5000, polling: 100 });
    const after = await readSearchPoolChatMode(page);
    if (!after.present || !matches(after.current))
        throw new Error('开聊模式切换未生效；停止操作。');
    return after;
}
/** 既有入口；调用方必须先确认账号权益明确不足。 */
export async function ensureSearchPoolChatCardMode(page) {
    return ensureSearchPoolChatMode(page, 'card');
}
async function openSearchPoolCardDetail(frame, selection) {
    await frame.evaluate(`(() => {
    ${validatedSearchSelectionScript(selection)}
    const nameLabel = picked.querySelector(".name-label");
    if (!(nameLabel instanceof HTMLElement)) throw new Error("候选人详情入口不存在；未点击沟通按钮。");
    ["mousedown", "mouseup", "click"].forEach(ev => {
      (() => { ${validatedSearchSelectionScript(selection)} })();
      if (picked.querySelector(".name-label") !== nameLabel) throw new Error("候选人详情入口已变化；未继续点击。");
      nameLabel.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
    });
  })()`);
    await sleepRandom(1200, 1800);
    await validateSearchPoolSelection(frame, selection);
}
/**
 * 账号权益弹层「使用VVIP账号沟通权益联系牛人」的确认按钮是「立即沟通」，
 * 与畅聊卡弹层的「搜索畅聊卡(N/M)」区分开——只有后者才真的走畅聊卡。
 * 仅用于识别按钮类型，不能据此判断账号权益是否耗尽。
 */
export function isChatCardDialog(label) {
    return /畅聊卡/.test(label);
}
/** 标题不是耗尽证据；只接受当前弹层明确不足且确认不可用。 */
export function searchPoolDialogFunding(state) {
    if (!state.present)
        return 'unknown';
    if (state.title === '选择该牛人开聊职位' && /^搜索畅聊卡(?:[（(]\d+\/\d+[）)]| \d+\/\d+)$/.test(state.confirmLabel))
        return state.confirmDisabled ? 'unknown' : 'card';
    if (state.title !== '使用VVIP账号沟通权益联系牛人' || state.confirmLabel !== '立即沟通')
        return 'unknown';
    const exhausted = /^\s*(?:VVIP)?账号(?:沟通)?权益(?:已耗尽|已用完|不足)[。！!；;]?\s*$/m.test(state.text);
    if (state.confirmDisabled && exhausted)
        return 'exhausted';
    if (state.confirmDisabled || exhausted)
        return 'unknown';
    return 'account';
}
export async function captureSearchPoolSnapshot(frame, expectedCandidateIds, expectedState) {
    return (await frame.evaluate(`(() => {
    ${SEARCH_CANDIDATE_READER_SCRIPT}
    const expected = ${JSON.stringify(expectedState ?? null)};
    if (expected) {
      const topWindow = window.top;
      if (topWindow.location.origin !== "https://www.zhipin.com" || topWindow.location.pathname.replace(/\\/+$/, "") !== "/web/chat/search") {
        throw new Error("采集快照时主页面已离开搜索页；未创建搜索快照。");
      }
      const boundIframe = (() => {
        const document = topWindow.document;
        const window = topWindow;
        ${VISIBLE_SEARCH_IFRAME_SCRIPT}
        return iframe;
      })();
      if (!boundIframe || boundIframe.contentDocument !== document) throw new Error("采集快照时当前搜索 iframe 绑定已变化；未创建搜索快照。");
      const job = norm(document.querySelector(".search-current-job")?.textContent);
      const keyword = document.querySelector(".search-input")?.value;
      const cityLabel = norm(document.querySelector(".city-wrap .city")?.textContent);
      const city = cityLabel === "城市" ? "" : cityLabel;
      if ((expected.job !== undefined && job !== expected.job) ||
          (expected.keyword !== undefined && keyword !== expected.keyword) ||
          (expected.city !== undefined && city !== expected.city)) {
        throw new Error("采集快照时搜索条件已变化；未创建搜索快照。");
      }
    }
    const cards = Array.from(document.querySelectorAll(".geek-info-card"));
    const candidates = cards.map(readCandidate);
    if (new Set(candidates.map(candidate => candidate.candidateId)).size !== candidates.length) throw new Error("搜索结果候选人ID重复；不能创建可靠快照。");
    const expectedCandidateIds = ${JSON.stringify(expectedCandidateIds ?? null)};
    if (expectedCandidateIds && (candidates.length !== expectedCandidateIds.length ||
        candidates.some((candidate, i) => candidate.candidateId !== expectedCandidateIds[i]))) {
      throw new Error("采集快照时当前候选人ID与本次结果响应不一致；未创建搜索快照。");
    }
    window.__bossCliSearchSnapshot = {
      id: ${JSON.stringify(randomUUID())}, createdAt: Date.now(), cards,
      fingerprints: candidates.map(candidate => JSON.stringify(candidate)),
    };
    return candidates.map((candidate, i) => ({ ...candidate,
      contactText: norm(cards[i].querySelector(".btn-getcontact")?.textContent),
    }));
  })()`));
}
function renderNormalSearchCandidates(candidates, meta) {
    const titleKeyword = meta.keyword ? `关键词：${meta.keyword}` : '关键词：默认/热门词';
    // 生效的筛选条件要回显：否则「怎么只有 3 个人」得靠猜是不是自己上次设的条件还挂着。
    // meta 里的每一项都来自**页面实时状态**，不是入参——打入参的话粘在平台上的旧条件不会显示。
    const conds = [
        meta.job ? `当前岗位：${meta.job}` : '',
        meta.city ? `城市：${meta.city}` : '',
        meta.degree ? `学历：${meta.degree}` : '',
        (meta.schools ?? []).length > 0 ? `院校：${(meta.schools ?? []).join('+')}` : '',
        meta.exp ? `经验：${meta.exp}` : '',
        meta.age ? `年龄：${meta.age}` : '',
        ...(meta.others ?? []),
    ].filter(Boolean);
    const lines = [
        `常规搜索结果（${titleKeyword}${conds.length > 0 ? `；${conds.join('；')}` : ''}）`,
        `共 ${candidates.length} 人`,
    ];
    if (candidates.length === 0) {
        return lines.join('\n');
    }
    lines.push('');
    candidates.forEach((item, idx) => {
        const labelText = item.labels.length > 0 ? `｜标签:${item.labels.join('/')}` : '';
        const activeText = item.active ? `｜${item.active}` : '';
        lines.push(`${idx + 1}. ${item.name}${activeText}${item.basicInfo ? `｜${item.basicInfo}` : ''}${labelText}`);
        if (item.summary) {
            lines.push(`   摘要: ${item.summary}`);
        }
        if (item.tags.length > 0) {
            lines.push(`   亮点: ${item.tags.join(' / ')}`);
        }
        if (item.expectation) {
            lines.push(`   ${item.expectation}`);
        }
        if (item.work.length > 0) {
            lines.push(`   经历: ${item.work.join('；')}`);
        }
        if (item.education) {
            lines.push(`   ${item.education}`);
        }
        if (item.reason) {
            lines.push(`   ${item.reason}`);
        }
    });
    return lines.join('\n');
}
export async function greetSearchPoolOnPage(page, options) {
    const { index, target, jobKeyword, dryRun } = options;
    if (index === undefined && !(target ?? '').trim()) {
        throw new Error('请提供 --index <序号> 或候选人姓名/摘要关键词。');
    }
    {
        {
            const frame = await assertNormalSearchPageReadyForPreview(page);
            // 上一次跑残留的弹层会挡住卡片点击，先收干净
            if ((await readGreetCardDialog(page)).present) {
                if (!(await cancelGreetCardDialog(page)) || (await readGreetCardDialog(page)).present) {
                    throw new Error('无法关闭残留弹层；未点击候选人。');
                }
            }
            // dry-run 只预览当前模式，不能修改全局持久选择。
            const selection = await selectSearchPoolCandidate(frame, { index, target });
            if (!dryRun) {
                await openSearchPoolCardDetail(frame, selection);
                await ensureSearchPoolChatMode(page, 'account');
            }
            const clicked = await clickSearchPoolContactButton(frame, selection);
            switch (clicked.kind) {
                case 'no_btn':
                    throw new Error(`候选人 ${clicked.name} 卡片上没有「畅聊」按钮。\n卡片内按钮：${(clicked.hint ?? []).join(' | ')}`);
                case 'disabled':
                    throw new Error(`候选人 ${clicked.name} 的按钮不可点（${clicked.text}）。`);
                default:
                    break;
            }
            const head = `目标：#${clicked.index} ${clicked.name}｜按钮：${clicked.text}`;
            let dialog = await waitForGreetCardDialog(page, GREET_CARD_DIALOG_WAIT_MS);
            if (!dialog.present) {
                return [
                    head,
                    '⚠️ 点击后未出现确认弹层。可能是平台改版、风控拦截，或该卡片无需确认。',
                    '未做进一步操作。请人工在浏览器确认当前状态。',
                ].join('\n');
            }
            let switched = '';
            if ((jobKeyword ?? '').trim()) {
                switched = await selectGreetCardDialogJob(page, jobKeyword.trim());
            }
            const state = await readGreetCardDialog(page);
            const lines = [head, '', renderGreetCardDialog(state)];
            if (switched) {
                lines.push(`（已在弹层内切换职位为：${switched}）`);
            }
            if (dryRun) {
                const cancelled = await cancelGreetCardDialog(page);
                lines.push('', cancelled
                    ? 'dry-run：已取消弹层，未确认招呼、未修改持久开聊模式。'
                    : '⚠️ dry-run：未找到「取消」按钮，弹层可能仍开着，请人工确认。');
                return lines.join('\n');
            }
            let funding = searchPoolDialogFunding(state);
            if (funding === 'exhausted') {
                if (!(await cancelGreetCardDialog(page)) || (await readGreetCardDialog(page)).present)
                    throw new Error('权益不足但无法关闭弹层；未切卡、未重试。');
                await ensureSearchPoolChatMode(page, 'card');
                const retried = await clickSearchPoolContactButton(frame, selection);
                if (retried.kind !== 'clicked' || retried.name !== selection.name)
                    throw new Error('切卡后候选人定位失败；未确认、未继续重试。');
                dialog = await waitForGreetCardDialog(page, GREET_CARD_DIALOG_WAIT_MS);
                if ((jobKeyword ?? '').trim())
                    await selectGreetCardDialogJob(page, jobKeyword.trim());
                Object.assign(state, await readGreetCardDialog(page));
                funding = searchPoolDialogFunding(state);
                if (funding !== 'card') {
                    await cancelGreetCardDialog(page);
                    throw new Error(`切卡后未得到可用畅聊卡弹层（${state.title} / ${state.confirmLabel}）；未确认、未继续重试。`);
                }
                lines.push('账号权益明确不足且确认不可用；已验证切卡模式和新弹层。', renderGreetCardDialog(state));
            }
            else if (funding !== 'account') {
                await cancelGreetCardDialog(page);
                throw new Error(`无法可靠确认账号权益状态（${state.title} / ${state.confirmLabel}）；未确认、未切卡、未重试。`);
            }
            if (!state.activeJob || !state.jobs.some(j => j.active && j.name === state.activeJob)) {
                await cancelGreetCardDialog(page);
                throw new Error('没有可验证的已选职位；未确认。');
            }
            try {
                await validateSearchPoolSelection(frame, selection);
            }
            catch (error) {
                await cancelGreetCardDialog(page);
                throw error;
            }
            const confirmed = await confirmGreetCardDialog(page, state, selection);
            if (!confirmed) {
                await cancelGreetCardDialog(page);
                throw new Error('确认按钮不可用或弹层状态已变化，已尝试取消；未重试。');
            }
            await sleepRandom(600, 1200);
            const after = await readGreetCardDialog(page);
            lines.push('', after.present
                ? '已点击确认但弹层仍在；发送结果未确认，未自动补发。'
                : `已提交${funding === 'account' ? '账号权益' : '畅聊卡'}确认（${state.confirmLabel}）；弹层已关闭，发送和实际扣费结果未确认，未自动补发。`);
            return lines.join('\n');
        }
    }
}
export async function runSearchPoolGreet(options) {
    return withBossSessionPage((page) => greetSearchPoolOnPage(page, options), {
        ensureChatShell: false,
        ensureMenuList: false,
    });
}
export async function runNormalSearch(opts = {}, withSessionPage = withBossSessionPage) {
    const kw = (opts.keyword ?? '').trim();
    const jobKw = (opts.jobKeyword ?? '').trim();
    const city = (opts.city ?? defaultSearchCityFromEnv()).trim();
    const degree = (opts.degree ?? '').trim();
    const degreeRange = (opts.degreeRange ?? '').trim();
    const schools = (opts.schools ?? []).map((s) => s.trim()).filter(Boolean);
    const exp = (opts.exp ?? '').trim();
    const expRange = (opts.expRange ?? '').trim();
    const age = (opts.age ?? '').trim();
    const ageRange = (opts.ageRange ?? '').trim();
    if (degree && degreeRange) {
        throw new Error('--degree 和 --degree-range 只能给一个：预设档位和自定义区间在页面上是互斥的。');
    }
    if (exp && expRange) {
        throw new Error('--exp 和 --exp-range 只能给一个：预设档位和自定义区间在页面上是互斥的。');
    }
    if (age && ageRange) {
        throw new Error('--age 和 --age-range 只能给一个：预设档位和自定义区间在页面上是互斥的。');
    }
    const status = (opts.status ?? []).map((s) => s.trim()).filter(Boolean);
    const jobHop = (opts.jobHop ?? '').trim();
    const majors = (opts.majors ?? []).map((s) => s.trim()).filter(Boolean);
    if (kw.length > 20) {
        throw new Error('常规搜索关键词最多 20 个字符。');
    }
    try {
        return await withSessionPage(async (page) => {
            await invalidateSearchSnapshots(page);
            let frame = await ensureInNormalSearchPage(page);
            if (!kw) {
                return '未提供关键词，本次仅进入搜索页，未执行查询。\n已清除旧搜索快照。请提供关键词执行 boss search <关键词>。';
            }
            /**
             * 岗位：给了关键字就按关键字选，**没给就切「不限职位」**。
             * 以前没给是「保持上次的岗位」——跨命令沿用上一次的状态，结果不可预测，
             * 同一条命令跑两次可能搜的是两个池子。
             */
            const selectedJob = await prepareNormalSearchJob(page, frame, jobKw);
            const expectedJob = selectedJob.label;
            frame = selectedJob.frame;
            /**
             * 清空上一轮残留的筛选条件，**再**按本次参数重设。
             * 不清的话「这次怎么只有 3 个人」永远得靠猜是不是上次的条件还挂着。
             * 必须在设条件之前——它会把学历 / 院校 / 其他筛选一起归零。
             */
            await resetNormalSearchFilters(frame, page);
            frame = await settleNormalSearchFrame(page, { job: expectedJob });
            await assertNormalSearchFiltersClear(frame);
            // 顺序固定：岗位 → 清空 → 城市 → 学历 → 院校 → 其他筛选 → 关键词。
            // 筛选条件都在关键词之前落定，否则先搜后筛会多打一次列表请求。
            if (city) {
                await selectNormalSearchCity(frame, city);
                frame = await settleNormalSearchFrame(page, { job: expectedJob, city });
            }
            if (degree) {
                await selectNormalSearchDegree(frame, degree);
            }
            if (degreeRange) {
                const { min, max } = parseRangeArg(degreeRange);
                await selectNormalSearchDegreeRange(page, frame, min, max);
            }
            if (schools.length > 0) {
                await selectNormalSearchSchools(frame, schools);
            }
            if (exp) {
                await selectNormalSearchExp(frame, exp);
            }
            if (expRange) {
                const { min, max } = parseRangeArg(expRange);
                await selectNormalSearchExpRange(page, frame, min, max);
            }
            if (age) {
                await selectNormalSearchAge(frame, age);
            }
            if (ageRange) {
                const { min, max } = parseRangeArg(ageRange);
                await selectNormalSearchAgeRange(frame, min, max);
            }
            if (status.length > 0) {
                await selectNormalSearchStatus(frame, status);
            }
            if (jobHop) {
                await selectNormalSearchJobHop(frame, jobHop);
            }
            if (majors.length > 0) {
                await selectNormalSearchMajors(frame, majors);
            }
            const result = await runKeywordSearch(page, frame, kw, { job: expectedJob, ...(city ? { city } : {}) });
            frame = await settleNormalSearchFrame(page, { job: expectedJob, keyword: kw, ...(city ? { city } : {}) }, 'results');
            // 回显一律读页面实时状态，不打入参——见 readSelectedDegree 的注释。
            const [currentKeyword, currentJob, currentCity, currentDegree, currentSchools, currentExp, currentAge, others,] = await Promise.all([
                readNormalSearchKeyword(frame),
                readCurrentSearchJob(frame),
                readSelectedCity(frame),
                readSelectedDegree(frame),
                readSelectedSchools(frame),
                readSelectedExp(frame),
                readSelectedAge(frame),
                readOtherFilters(frame),
            ]);
            if (currentJob !== expectedJob || (kw && currentKeyword !== kw) || (city && currentCity !== city)) {
                throw new Error('读取结果时搜索条件已变化；未创建搜索快照。');
            }
            if (!isBossChatSearchUrl(page.url()) || await getSearchFrame(page) !== frame)
                throw new Error('读取结果时页面或搜索 frame 已变化；未创建搜索快照。');
            const candidates = await captureSearchPoolSnapshot(frame, result.candidateIds, { job: expectedJob, keyword: kw, ...(city ? { city } : {}) });
            return renderNormalSearchCandidates(candidates, {
                keyword: currentKeyword || kw,
                job: currentJob,
                city: currentCity,
                degree: currentDegree,
                schools: currentSchools,
                exp: currentExp,
                age: currentAge,
                others,
            });
        });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        throw new Error(`读取常规搜索列表失败：${message}`, { cause: e });
    }
}
//# sourceMappingURL=normal-search.js.map