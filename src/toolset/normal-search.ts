import type { ElementHandle, Frame, Page } from 'puppeteer-core';
import { RESUME_PREVIEW_OPEN_GAP_MS, sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { ensurePage } from '../common/ensure_page.js';
import {
  cancelGreetCardDialog,
  confirmGreetCardDialog,
  readGreetCardDialog,
  renderGreetCardDialog,
  selectGreetCardDialogJob,
  waitForGreetCardDialog,
} from '../common/boss_greet_card_dialog.js';

const BOSS_CHAT_SEARCH_URL = 'https://www.zhipin.com/web/chat/search';
/** 点「畅聊卡」后等确认弹层出现**并渲染完**（职位列表是异步拉的）的最长时间 */
const GREET_CARD_DIALOG_WAIT_MS = 12_000;
const SEARCH_FRAME_READY_TIMEOUT_MS = 18_000;
const SEARCH_RESULT_SETTLE_MS = { min: 900, max: 1600 } as const;
const JOB_SWITCH_SETTLE_MS = { min: 700, max: 1300 } as const;
/** 城市控件是输入即联想，等联想列表渲染；也顺带把连续点击拉开距离。 */
const CITY_SETTLE_MS = { min: 800, max: 1500 } as const;
/** 等城市联想列表出现的上限。异步拉取，固定 sleep 会偶发误报「没有联想结果」。 */
const CITY_SUGGEST_TIMEOUT_MS = 8_000;
/** 等筛选面板（学历/院校）重渲染完成的上限。选完城市后整块会重挂。 */
const FILTER_PANEL_TIMEOUT_MS = 10_000;
/** 学历 / 院校勾选之间的间隔，别连点。 */
const FILTER_SETTLE_MS = { min: 600, max: 1200 } as const;
/** 平台对「专业」的限制，弹层标题写死「最多选择10个」。 */
const MAJOR_MAX_SELECT = 10;
/**
 * 页面上有两个 `.major-dialog`（专业、资格证书），没展开的那个 `display:none` 但仍在 DOM 里。
 * 所有弹层内的查找都得先挑出可见的那个，否则会操作到「资格证书」的控件上。
 */
const VISIBLE_MAJOR_DIALOG =
  'Array.from(document.querySelectorAll(".major-dialog")).find((el) => getComputedStyle(el).display !== "none")';
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
export function defaultSearchCityFromEnv(): string {
  return process.env.BOSS_SEARCH_CITY?.trim() ?? '';
}

/**
 * 解析 `--school` / `--status` / `--major` 这类可多选参数的逗号分隔值。
 * 中英文逗号都收——中文输入法下顺手打出全角逗号太常见，
 * 因此而报「院校要求没有『统招本科,985院校』这一项」纯属自找麻烦。
 */
export function parseFilterLabels(raw: string | undefined): string[] {
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
export function normalizeFilterLabel(raw: string): string {
  return raw.trim().replace(/>=/g, '≥');
}

type NormalSearchCandidate = {
  name: string;
  active: string;
  labels: string[];
  basicInfo: string;
  summary: string;
  tags: string[];
  expectation: string;
  work: string[];
  education: string;
  reason: string;
  contactText: string;
};

export function isBossChatSearchUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/search';
  } catch {
    return false;
  }
}

async function getSearchFrame(page: Page): Promise<Frame> {
  const iframe = await page.waitForSelector('iframe[name="searchFrame"]', {
    timeout: SEARCH_FRAME_READY_TIMEOUT_MS,
  });
  if (!iframe) {
    throw new Error('未找到常规搜索 iframe（iframe[name="searchFrame"]）。');
  }

  const deadline = Date.now() + SEARCH_FRAME_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const frame = await iframe.contentFrame();
    if (frame && frame.url().includes('/web/frame/search')) {
      return frame;
    }
    await sleepRandom(120, 220);
  }

  const iframeSrc = (await page.evaluate(
    `(() => document.querySelector('iframe[name="searchFrame"]')?.getAttribute("src") ?? "")()`,
  )) as string;
  const frameUrls = page.frames().map((f) => f.url()).join(' | ');
  throw new Error(
    `已检测到常规搜索 iframe，但无法获取其页面上下文。iframe src：${iframeSrc || 'unknown'}；frames：${frameUrls || 'empty'}`,
  );
}

async function ensureSearchFrameReady(frame: Frame): Promise<void> {
  await frame.waitForFunction(
    `(() => {
      const input = document.querySelector(".search-input");
      if (!(input instanceof HTMLInputElement)) return false;
      const list = document.querySelector(".geek-list-wrap, .card-list");
      const hasCard = document.querySelectorAll(".geek-info-card").length > 0;
      const empty = document.querySelector(".empty-tips");
      return !!list || hasCard || !!empty;
    })()`,
    { timeout: SEARCH_FRAME_READY_TIMEOUT_MS },
  );
}

async function ensureInNormalSearchPage(page: Page): Promise<Frame> {
  await ensurePage(page, {
    name: '常规搜索页',
    targetUrl: BOSS_CHAT_SEARCH_URL,
    matches: isBossChatSearchUrl,
  });
  const frame = await getSearchFrame(page);
  await ensureSearchFrameReady(frame);
  return frame;
}

export async function assertNormalSearchPageReadyForPreview(page: Page): Promise<Frame> {
  if (!isBossChatSearchUrl(page.url())) {
    throw new Error('当前不在常规搜索页（/web/chat/search），请先通过 boss search 进入。');
  }
  const frame = await getSearchFrame(page);
  await ensureSearchFrameReady(frame);
  return frame;
}

async function runKeywordSearch(frame: Frame, keyword: string): Promise<void> {
  const kwLiteral = JSON.stringify(keyword);
  const ok = (await frame.evaluate(`(() => {
    const input = document.querySelector(".search-input");
    if (!(input instanceof HTMLInputElement)) return false;
    const kw = ${kwLiteral};
    input.focus();
    input.value = kw;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    }));
    input.dispatchEvent(new KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    }));
    return true;
  })()`)) as boolean;
  if (!ok) {
    throw new Error('未找到常规搜索关键词输入框（.search-input）。');
  }

  /**
   * ⚠️ 判据必须**内联**进脚本字符串，不能走 `waitForFunction(fn, opts, arg)` 的入参。
   * puppeteer 对**字符串**形式的 pageFunction 是直接当表达式求值的，后面的入参会被静默丢弃：
   * `"((kw) => ...)"` 求值结果是个函数对象 → 恒为真 → 这个等待直接变成空转。
   * （本机实测：`waitForFunction("((x) => x === 'NEVER')", {timeout:3000}, 'NO')` 6ms 就通过了。）
   * 而 AGENTS.md 又要求 evaluate 一律用字符串脚本，所以只有 JSON.stringify 内联这一条路。
   */
  await frame.waitForFunction(
    `(() => {
      const input = document.querySelector(".search-input");
      return input instanceof HTMLInputElement && input.value === ${kwLiteral};
    })()`,
    { timeout: 5_000 },
  );
  await sleepRandom(SEARCH_RESULT_SETTLE_MS.min, SEARCH_RESULT_SETTLE_MS.max);
  await ensureSearchFrameReady(frame);
}

async function readNormalSearchKeyword(frame: Frame): Promise<string> {
  return (await frame.evaluate(
    `(() => document.querySelector(".search-input")?.value?.trim() ?? "")()`,
  )) as string;
}

async function readCurrentSearchJob(frame: Frame): Promise<string> {
  return (await frame.evaluate(
    `(() => (document.querySelector(".search-current-job")?.textContent ?? "").replace(/\\s+/g, " ").trim())()`,
  )) as string;
}

export async function readNormalSearchSelectedJobLabel(frame: Frame): Promise<string> {
  const label = await readCurrentSearchJob(frame);
  return label || '默认';
}

/**
 * 在常规搜索页（iframe）切换当前岗位。岗位选项常驻 `.job-name`（即账号自己的开放职位），
 * 模糊匹配 keyword 后点击，等待 `.search-current-job` 变更。keyword 为空则返回当前岗位。
 */
export async function selectNormalSearchJob(frame: Frame, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    return readNormalSearchSelectedJobLabel(frame);
  }
  const before = await readCurrentSearchJob(frame);
  const kwLiteral = JSON.stringify(kw);

  // 岗位下拉的选项（.job-name）常驻 DOM，但先点触发器展开以兼容折叠态。
  await frame.evaluate(`(() => {
    const h = document.querySelector(".search-job-list-C .ui-dropmenu-label")
      || document.querySelector(".ui-dropmenu-label");
    if (h instanceof HTMLElement) {
      h.scrollIntoView({ block: "center", inline: "nearest" });
      h.click();
    }
  })()`);
  await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);

  const picked = (await frame.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const items = Array.from(document.querySelectorAll(".job-name"));
    if (items.length === 0) return { ok: false, reason: "empty" };
    const target = items.find((el) => norm(el.textContent).includes(norm(kw)));
    if (!(target instanceof HTMLElement)) {
      return { ok: false, reason: "not_found", available: items.map((el) => (el.textContent ?? "").replace(/\\s+/g, " ").trim()) };
    }
    const label = (target.textContent ?? "").replace(/\\s+/g, " ").trim();
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label };
  })()`)) as { ok: boolean; label?: string; reason?: string; available?: string[] };

  if (!picked.ok) {
    if (picked.reason === 'not_found') {
      const avail = (picked.available ?? []).join('｜');
      throw new Error(`未找到匹配岗位“${kw}”。可选岗位：${avail || '（空）'}`);
    }
    throw new Error('未找到常规搜索岗位下拉选项（.job-name）。');
  }

  const label = picked.label ?? kw;
  try {
    // 判据内联，理由同 runKeywordSearch：字符串 pageFunction 收不到入参。
    await frame.waitForFunction(
      `(() => {
        const cur = (document.querySelector(".search-current-job")?.textContent ?? "").replace(/\\s+/g, " ").trim();
        return cur.length > 0 && cur !== ${JSON.stringify(before)};
      })()`,
      { timeout: 8_000 },
    );
  } catch {
    // 当前岗位文案未变（可能本就是该岗）——不阻断，返回读到的 label。
  }
  await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
  return label;
}

/**
 * 把当前岗位切成「不限职位」——搜全池而不是被某个岗位的画像圈住。
 *
 * 它是岗位下拉的第一项，但**不带 `.job-name`**（那个 class 只给真实职位用），
 * 所以 `selectNormalSearchJob` 的选择器扫不到它，得单独按 `li[ka="search_select_job"]` 找。
 */
export async function selectNormalSearchAnyJob(frame: Frame): Promise<string> {
  const current = await readCurrentSearchJob(frame);
  if (current.includes('不限职位')) {
    return current;
  }

  await frame.evaluate(`(() => {
    const h = document.querySelector(".search-job-list-C .ui-dropmenu-label")
      || document.querySelector(".ui-dropmenu-label");
    if (h instanceof HTMLElement) {
      h.scrollIntoView({ block: "center", inline: "nearest" });
      h.click();
    }
  })()`);
  await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);

  const ok = (await frame.evaluate(`(() => {
    const items = Array.from(document.querySelectorAll('li[ka="search_select_job"]'));
    const target = items.find((el) => (el.textContent ?? "").replace(/\\s+/g, "").includes("不限职位"));
    if (!(target instanceof HTMLElement)) return false;
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return true;
  })()`)) as boolean;

  if (!ok) {
    throw new Error('未找到岗位下拉里的「不限职位」项（li[ka="search_select_job"]）。');
  }
  await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
  return (await readCurrentSearchJob(frame)) || '不限职位';
}

/**
 * 读当前已选城市；未选时返回空串。
 *
 * ⚠️ **不能用 `gray-color` 判占位**：实测选中深圳之后该 class 仍然挂着，
 * 只有文案从「城市」变成「深圳」。所以判据是文案本身。
 */
async function readSelectedCity(frame: Frame): Promise<string> {
  return (await frame.evaluate(`(() => {
    const el = document.querySelector(".city-wrap .city");
    if (!el) return "";
    const t = (el.textContent ?? "").replace(/\\s+/g, " ").trim();
    return t === "城市" ? "" : t;
  })()`)) as string;
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
export async function selectNormalSearchCity(frame: Frame, city: string): Promise<string> {
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
  await input.click();
  await input.type(target, { delay: 90 });

  /**
   * 联想列表是异步拉的，**必须等它出现再读**——早先用固定 sleep 等，
   * 本机实测会偶发「没有联想结果」误报（sleep 到点了列表还没渲染）。
   */
  try {
    await frame.waitForFunction(
      `(() => document.querySelectorAll(".city-box .search-result-item").length > 0)()`,
      { timeout: CITY_SUGGEST_TIMEOUT_MS },
    );
  } catch {
    throw new Error(
      `城市「${target}」在 ${CITY_SUGGEST_TIMEOUT_MS / 1000}s 内没等到联想结果，换个写法试试（如「深圳」而不是「深圳市」）。`,
    );
  }
  await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);

  // 目标城市内联进脚本，理由同 runKeywordSearch：字符串 pageFunction 收不到入参，
  // 走入参的话这里恒为 `{}`，每次都报「查无此项」。
  const picked = (await frame.evaluate(
    `(() => {
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
    })()`,
  )) as { ok: boolean; label?: string; exact?: boolean; reason?: string; options?: string[] };

  if (!picked.ok) {
    if (picked.reason === 'no_exact') {
      throw new Error(
        `城市「${target}」没有完全匹配项，已中止以免选错。候选：${(picked.options ?? []).join('｜')}`,
      );
    }
    throw new Error(`城市「${target}」查无此项，换个写法试试（如「深圳」而不是「深圳市」）。`);
  }
  await sleepRandom(CITY_SETTLE_MS.min, CITY_SETTLE_MS.max);
  return picked.label ?? target;
}

/**
 * 等筛选面板挂上来。
 *
 * 选完城市后平台会重渲染整个筛选区，紧接着去点 `.school-ui` 会扑空
 * （本机实测报「未找到院校要求控件」）。所以碰学历/院校之前先等一下。
 */
type FilterClickResult = {
  ok: boolean;
  label?: string;
  already?: boolean;
  reason?: string;
  options?: string[];
};

/**
 * 在筛选面板里点一项，**查找与点击在同一次 evaluate 内完成**。
 *
 * 为什么不能「先等面板出现、再点」：选完城市后这块会异步重渲染，
 * 「等到了」和「去点」之间存在窗口期，元素在这中间被卸载 —— 本机实测稳定复现
 * 「等待通过、紧接着 querySelector 返回 null」。把两步合成一次原子操作，
 * 外层只负责在 `no_root` 时重试，重渲染就只是多试一轮而不是直接报错。
 */
async function clickFilterItem(
  frame: Frame,
  rootSel: string,
  itemSel: string,
  want: string,
  opts: { skipIfActive?: boolean } = {},
): Promise<FilterClickResult> {
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

  return evalWithPanelRetry<FilterClickResult>(frame, expr);
}

/**
 * 跑一段筛选面板脚本，只在它报 `no_root`（整块还没挂上来）时重试。
 * 选项本身不存在是用户传错了值，立即返回让上层报错。
 */
async function evalWithPanelRetry<T extends { ok: boolean; reason?: string }>(
  frame: Frame,
  expr: string,
): Promise<T> {
  const deadline = Date.now() + FILTER_PANEL_TIMEOUT_MS;
  for (;;) {
    const r = (await frame.evaluate(expr)) as T;
    if (r.ok || r.reason !== 'no_root' || Date.now() > deadline) {
      return r;
    }
    await sleepRandom(300, 600);
  }
}

/** 学历要求：`.degree-ui` 里的单选项，当前选中项带 `.active`（已选中就不重复点）。 */
export async function selectNormalSearchDegree(frame: Frame, degree: string): Promise<string> {
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

async function readSelectedExp(frame: Frame): Promise<string> {
  return readActiveFilterItem(frame, '.exp-list-ui', '.exp-item');
}

async function readSelectedAge(frame: Frame): Promise<string> {
  return readActiveFilterItem(frame, '.age-list-ui', '.age-item');
}

/**
 * 经验要求：`.exp-list-ui` 里的单选项
 * （在校/应届 / 25年毕业 / 26年毕业 / 26年后毕业 / 1-3年 / 3-5年 / 5-10年）。
 *
 * 旁边还有个「自定义」滑块（`.experience-select-custom-slider`）没做——拖滑块的交互
 * 和点选项完全是两回事，等真有人需要「6-8年」这种区间再说。
 */
export async function selectNormalSearchExp(frame: Frame, exp: string): Promise<string> {
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
export async function selectNormalSearchAge(frame: Frame, age: string): Promise<string> {
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

/**
 * 院校要求：`.school-ui` 里的多选框（统招本科 / 双一流院校 / 211院校 / 985院校 /
 * 留学生 / QS 100 / QS 500），以及单独一个「只看第一学历」（提示语写明＝第一学历为全日制本科）。
 *
 * 逐个点，每点一个歇一下——一次性连点是很明显的机器行为。
 */
export async function selectNormalSearchSchools(frame: Frame, labels: string[]): Promise<string[]> {
  const wanted = labels.map((s) => s.trim()).filter(Boolean);
  const done: string[] = [];
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
async function readSelectedDegree(frame: Frame): Promise<string> {
  return (await frame.evaluate(`(() => {
    const el = document.querySelector(".degree-ui .degree-item.active");
    const t = (el?.textContent ?? "").replace(/\\s+/g, " ").trim();
    return t === "不限" ? "" : t;
  })()`)) as string;
}

/**
 * 读「经验要求」/「年龄要求」当前选中项；「不限」＝没筛，返回空串。
 *
 * 这两块和 `.degree-ui` 长得一模一样（单选 `span`，选中带 `.active`），
 * 但它们**不在**「其他筛选」里，是两个独立的顶层块，别到 `.more-filter-container` 里找。
 */
async function readActiveFilterItem(frame: Frame, rootSel: string, itemSel: string): Promise<string> {
  return (await frame.evaluate(`(() => {
    const el = document.querySelector("${rootSel} ${itemSel}.active");
    const t = (el?.textContent ?? "").replace(/\\s+/g, " ").trim();
    return t === "不限" ? "" : t;
  })()`)) as string;
}

/** 读页面上当前勾中的院校要求。勾中态在 `input.checkbox-input` 的 `checked` 属性上。 */
async function readSelectedSchools(frame: Frame): Promise<string[]> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    return Array.from(document.querySelectorAll(".school-ui .checkbox"))
      .filter((el) => el.querySelector("input.checkbox-input")?.checked)
      .map((el) => norm(el.querySelector(".checkbox-text")?.textContent))
      .filter(Boolean);
  })()`)) as string[];
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
async function readOtherFilters(frame: Frame): Promise<string[]> {
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
  })()`)) as string[];
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
export async function resetNormalSearchFilters(frame: Frame): Promise<boolean> {
  const dirty =
    (await readSelectedDegree(frame)) !== '' ||
    (await readSelectedExp(frame)) !== '' ||
    (await readSelectedAge(frame)) !== '' ||
    (await readSelectedSchools(frame)).length > 0 ||
    (await readOtherFilters(frame)).length > 0;
  if (!dirty) {
    return false;
  }

  const clicked = await evalWithPanelRetry<{ ok: boolean; reason?: string }>(
    frame,
    `(() => {
      const btn = document.querySelector(".reset-btn");
      if (!btn) return { ok: false, reason: "no_root" };
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { ok: true };
    })()`,
  );
  if (!clicked.ok) {
    throw new Error(`未找到「清空筛选」按钮（.reset-btn），等了 ${FILTER_PANEL_TIMEOUT_MS / 1000}s。`);
  }

  // 清空会让整个筛选区重渲染一遍，等它落定再去设新条件，否则后面的点击会扑空。
  await frame.waitForFunction(
    `(() => {
      const isDefault = (sel) => {
        const el = document.querySelector(sel);
        return !el || (el.textContent ?? "").replace(/\\s+/g, "").trim() === "不限";
      };
      const schoolOk = Array.from(document.querySelectorAll(".school-ui input.checkbox-input")).every((el) => !el.checked);
      return isDefault(".degree-ui .degree-item.active")
        && isDefault(".exp-list-ui .exp-item.active")
        && isDefault(".age-list-ui .age-item.active")
        && schoolOk;
    })()`,
    { timeout: FILTER_PANEL_TIMEOUT_MS },
  );
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
export async function selectNormalSearchStatus(frame: Frame, labels: string[]): Promise<string[]> {
  const wanted = labels.map((s) => s.trim()).filter(Boolean);
  if (wanted.length === 0) {
    return [];
  }

  const opened = await evalWithPanelRetry<{ ok: boolean; reason?: string; index?: number }>(
    frame,
    `(() => {
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
    })()`,
  );
  if (!opened.ok) {
    throw new Error('未找到「求职状态」筛选项（.more-filter-container 里的 .mutil-select）。');
  }
  await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);

  const done: string[] = [];
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
    })()`)) as FilterClickResult;
    if (!picked.ok) {
      throw new Error(
        `求职状态没有「${label}」这一项。可选：${(picked.options ?? []).join('｜') || '（菜单未展开）'}`,
      );
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
export async function selectNormalSearchJobHop(frame: Frame, label: string): Promise<string> {
  const target = normalizeFilterLabel(label);
  if (!target) {
    return '';
  }

  const opened = await evalWithPanelRetry<{ ok: boolean; reason?: string }>(
    frame,
    `(() => {
      const wrap = document.querySelector('.more-filter-container input.ipt[placeholder="跳槽频率"]')?.closest(".dropdown-wrap");
      if (!wrap) return { ok: false, reason: "no_root" };
      const trigger = wrap.querySelector(".dropdown-select");
      if (!(trigger instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      trigger.scrollIntoView({ block: "center", inline: "nearest" });
      trigger.click();
      return { ok: true };
    })()`,
  );
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
  })()`)) as FilterClickResult;

  if (!picked.ok) {
    throw new Error(
      `跳槽频率没有「${target}」这一项。可选：${(picked.options ?? []).join('｜') || '（菜单未展开）'}`,
    );
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
export async function selectNormalSearchMajors(frame: Frame, labels: string[]): Promise<string[]> {
  const wanted = labels.map((s) => s.trim()).filter(Boolean);
  if (wanted.length === 0) {
    return [];
  }
  if (wanted.length > MAJOR_MAX_SELECT) {
    throw new Error(`专业最多选 ${MAJOR_MAX_SELECT} 个，收到 ${wanted.length} 个。`);
  }

  // 上一次跑崩留下的弹层会挡住后面所有点击，先收干净再开工。
  await closeMajorDialog(frame, false);

  const done: string[] = [];
  for (const label of wanted) {
    const input = await openMajorDialog(frame);
    try {
      await input.click();
      await input.type(label, { delay: 90 });
      try {
        await frame.waitForFunction(`(() => (${MAJOR_SUGGEST_ITEMS}).length > 0)()`, {
          timeout: CITY_SUGGEST_TIMEOUT_MS,
        });
      } catch {
        const blank = (await frame.evaluate(
          `(() => (${VISIBLE_MAJOR_DIALOG}?.querySelector(".major-lists .blank")?.textContent ?? "").replace(/\\s+/g, " ").trim())()`,
        )) as string;
        throw new Error(
          blank
            ? `专业「${label}」查无此项（平台提示：${blank}）。`
            : `专业「${label}」在 ${CITY_SUGGEST_TIMEOUT_MS / 1000}s 内没等到联想结果。`,
        );
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
      })()`)) as FilterClickResult;

      if (!picked.ok) {
        throw new Error(
          `专业「${label}」没有完全匹配项，已中止以免选错。候选（最多列 20 条）：${(picked.options ?? []).join('｜')}`,
        );
      }
      done.push(picked.label ?? label);
    } catch (e) {
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
async function openMajorDialog(frame: Frame): Promise<ElementHandle<Element>> {
  const opened = await evalWithPanelRetry<{ ok: boolean; reason?: string }>(
    frame,
    `(() => {
      const el = Array.from(document.querySelectorAll(".more-filter-container .major-input-ui"))
        .find((node) => {
          const item = node.closest(".filter-2-item");
          return item && getComputedStyle(item).display !== "none";
        });
      if (!(el instanceof HTMLElement)) return { ok: false, reason: "no_root" };
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
      return { ok: true };
    })()`,
  );
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
async function closeMajorDialog(frame: Frame, confirm: boolean): Promise<void> {
  const wantText = confirm ? '确定' : '取消';
  const ok = (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim();
    const btns = Array.from(${VISIBLE_MAJOR_DIALOG}?.querySelectorAll(".major-footer-btns *") ?? []);
    const hit = btns.find((el) => norm(el.textContent) === ${JSON.stringify(wantText)});
    if (!(hit instanceof HTMLElement)) return false;
    hit.click();
    return true;
  })()`)) as boolean;
  if (!ok && confirm) {
    throw new Error('「专业」弹层里没找到「确定」按钮，选中的专业可能没生效。');
  }
  if (ok) {
    await sleepRandom(FILTER_SETTLE_MS.min, FILTER_SETTLE_MS.max);
  }
}

export async function openNormalSearchResumePreview(frame: Frame, target: string): Promise<boolean> {
  const targetLiteral = JSON.stringify(target.trim());
  const opened = (await frame.evaluate(`(() => {
    const raw = ${targetLiteral};
    const bare = raw.replace(/\\*/g, "");
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cards = Array.from(document.querySelectorAll(".geek-info-card"));
    if (cards.length === 0) return false;
    const targetCard =
      cards.find((item) => {
        const name = norm(item.querySelector(".name-label")?.textContent);
        return name === raw || (!!bare && name.includes(bare));
      }) ?? null;
    if (!(targetCard instanceof HTMLElement)) return false;

    function tryOpen(el) {
      if (!(el instanceof HTMLElement)) return false;
      const st = window.getComputedStyle(el);
      if (st.pointerEvents === "none" || Number(st.opacity) < 0.3) return false;
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
      return true;
    }

    if (tryOpen(targetCard.querySelector(".name-label"))) return true;
    if (tryOpen(targetCard.querySelector(".info-detail"))) return true;
    if (tryOpen(targetCard.querySelector(".geek-info-main, .geek-card-main, .card-content"))) return true;
    if (tryOpen(targetCard.querySelector("a"))) return true;
    return tryOpen(targetCard);
  })()`)) as boolean;
  if (opened) {
    await sleepRandom(RESUME_PREVIEW_OPEN_GAP_MS.min, RESUME_PREVIEW_OPEN_GAP_MS.max);
  }
  return opened;
}

/**
 * 在搜索池按「序号 / 打码姓名 / 摘要关键词」定位卡片并点「畅聊卡 N/M」按钮。
 *
 * 搜索池姓名被平台打码（`崔**`），靠姓名精确定位不可靠，因此优先支持 1-based 序号
 * （与 `boss search` 输出的编号一致，仅在同一次列表内有效）；也允许用打码姓名或摘要关键词模糊命中。
 * 按钮实测为 `button.btn.btn-getcontact.btn-chat`，文案「畅聊卡 3/13」。
 */
async function clickSearchPoolContactButton(
  frame: Frame,
  locator: { index?: number; target?: string },
): Promise<
  | { kind: 'empty' }
  | { kind: 'not_found'; hint: string[] }
  | { kind: 'ambiguous'; hits: string[] }
  | { kind: 'no_btn'; name: string }
  | { kind: 'disabled'; name: string; text: string }
  | { kind: 'clicked'; index: number; name: string; text: string; summary: string }
> {
  const indexLiteral = JSON.stringify(locator.index ?? null);
  const targetLiteral = JSON.stringify((locator.target ?? '').trim());
  return (await frame.evaluate(`(() => {
    const wantIndex = ${indexLiteral};
    const raw = ${targetLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const loose = (v) => norm(v).replace(/[*＊\\s]/g, "").toLowerCase();
    const cards = Array.from(document.querySelectorAll(".geek-info-card"));
    if (cards.length === 0) return { kind: "empty" };

    const describe = (card, i) =>
      (i + 1) + ". " + norm(card.querySelector(".name-label")?.textContent);

    let picked = null;
    let pickedIndex = -1;
    if (wantIndex !== null) {
      if (wantIndex < 1 || wantIndex > cards.length) {
        return { kind: "not_found", hint: cards.map(describe) };
      }
      picked = cards[wantIndex - 1];
      pickedIndex = wantIndex - 1;
    } else {
      const key = loose(raw);
      const hits = [];
      cards.forEach((card, i) => {
        const name = loose(card.querySelector(".name-label")?.textContent);
        const summary = loose(card.querySelector(".info-detail")?.textContent);
        if ((key && name.includes(key)) || (key && summary.includes(key))) {
          hits.push({ card, i });
        }
      });
      if (hits.length === 0) return { kind: "not_found", hint: cards.map(describe) };
      if (hits.length > 1) return { kind: "ambiguous", hits: hits.map((h) => describe(h.card, h.i)) };
      picked = hits[0].card;
      pickedIndex = hits[0].i;
    }

    const name = norm(picked.querySelector(".name-label")?.textContent);
    const summary = norm(picked.querySelector(".info-detail")?.textContent).slice(0, 80);
    const btn = picked.querySelector("button.btn-getcontact, .btn-getcontact");
    if (!(btn instanceof HTMLElement)) return { kind: "no_btn", name };
    const text = norm(btn.textContent);
    const cls = btn.className || "";
    if (/disabled|forbid|ban/i.test(cls) || btn.getAttribute("disabled") !== null) {
      return { kind: "disabled", name, text };
    }
    btn.scrollIntoView({ block: "center", inline: "nearest" });
    btn.click();
    return { kind: "clicked", index: pickedIndex + 1, name, text, summary };
  })()`)) as never;
}

async function readNormalSearchCandidates(frame: Frame): Promise<NormalSearchCandidate[]> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const unique = (items) => Array.from(new Set(items.map(norm).filter(Boolean)));
    return Array.from(document.querySelectorAll(".geek-info-card")).map((card) => {
      const labels = unique(Array.from(card.querySelectorAll(".card-label")).map((el) => el.textContent));
      const tags = unique(
        Array.from(card.querySelectorAll(".info-tags:not(.info-tags-measure) .info-tags-item"))
          .map((el) => el.textContent),
      );
      const work = Array.from(card.querySelectorAll(".work-exp-box .work-exp-item"))
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      return {
        name: norm(card.querySelector(".name-label")?.textContent),
        active: norm(card.querySelector(".active-desc-text")?.textContent),
        labels,
        basicInfo: norm(card.querySelector(".info-labels")?.textContent),
        summary: norm(card.querySelector(".info-detail")?.textContent),
        tags,
        expectation: norm(card.querySelector(".expect-exp-box")?.textContent),
        work,
        education: norm(card.querySelector(".edu-exp-box")?.textContent),
        reason: norm(card.querySelector(".recommend-reason")?.textContent),
        contactText: norm(card.querySelector(".btn-getcontact")?.textContent),
      };
    }).filter((item) => item.name);
  })()`)) as NormalSearchCandidate[];
}

function renderNormalSearchCandidates(
  candidates: NormalSearchCandidate[],
  meta: {
    keyword: string;
    job: string;
    city?: string;
    degree?: string;
    exp?: string;
    age?: string;
    schools?: string[];
    others?: string[];
  },
): string {
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

export type SearchPoolGreetOptions = {
  /** 1-based 序号，对应上一次 `boss search` 输出的编号（仅当次列表有效） */
  index?: number;
  /** 打码姓名或摘要关键词 */
  target?: string;
  /** 弹层内改选职位（不传则用平台预选，通常即 `--job` 选中的岗位） */
  jobKeyword?: string;
  /** true = 只走到弹层并取消，不发出招呼、不消耗畅聊卡 */
  dryRun: boolean;
};

/**
 * 搜索池打招呼：定位卡片 → 点「畅聊卡 N/M」→ 处理「选择该牛人开聊职位」确认弹层。
 * dryRun 时读完弹层就点「取消」，不消耗额度；否则点 `boss-btn-primary`（不可逆）。
 */
export async function greetSearchPoolOnPage(
  page: Page,
  options: SearchPoolGreetOptions,
): Promise<string> {
  const { index, target, jobKeyword, dryRun } = options;
  if (index === undefined && !(target ?? '').trim()) {
    throw new Error('请提供 --index <序号> 或候选人姓名/摘要关键词。');
  }
  {
    {
      const frame = await assertNormalSearchPageReadyForPreview(page);
      // 上一次跑残留的弹层会挡住卡片点击，先收干净
      if ((await readGreetCardDialog(page)).present) {
        await cancelGreetCardDialog(page);
      }
      const clicked = await clickSearchPoolContactButton(frame, { index, target });
      switch (clicked.kind) {
        case 'empty':
          throw new Error('搜索池列表为空，无法打招呼。请先执行 boss search。');
        case 'not_found':
          throw new Error(
            `未在搜索池定位到目标。当前列表：\n${clicked.hint.join('\n')}`,
          );
        case 'ambiguous':
          throw new Error(
            `关键词命中多人，请改用 --index 精确指定：\n${clicked.hits.join('\n')}`,
          );
        case 'no_btn':
          throw new Error(`候选人 ${clicked.name} 卡片上没有「畅聊」按钮。`);
        case 'disabled':
          throw new Error(`候选人 ${clicked.name} 的按钮不可点（${clicked.text}）。`);
        default:
          break;
      }

      const head = `目标：#${clicked.index} ${clicked.name}｜按钮：${clicked.text}`;
      const dialog = await waitForGreetCardDialog(page, GREET_CARD_DIALOG_WAIT_MS);
      if (!dialog.present) {
        return [
          head,
          '⚠️ 点击后未出现「搜索畅聊卡」确认弹层。可能是平台改版、风控拦截，或该卡片无需确认。',
          '未做进一步操作。请人工在浏览器确认当前状态。',
        ].join('\n');
      }

      let switched = '';
      if ((jobKeyword ?? '').trim()) {
        switched = await selectGreetCardDialogJob(page, jobKeyword!.trim());
      }
      const state = await readGreetCardDialog(page);
      const lines = [head, '', renderGreetCardDialog(state)];
      if (switched) {
        lines.push(`（已在弹层内切换职位为：${switched}）`);
      }

      if (dryRun) {
        const cancelled = await cancelGreetCardDialog(page);
        lines.push(
          '',
          cancelled
            ? '✅ dry-run：已点「取消」关闭弹层，未发出招呼、未消耗畅聊卡。'
            : '⚠️ dry-run：未找到「取消」按钮，弹层可能仍开着，请人工确认。',
        );
        return lines.join('\n');
      }

      const confirmed = await confirmGreetCardDialog(page);
      if (!confirmed) {
        await cancelGreetCardDialog(page);
        throw new Error('未找到弹层确认按钮（button.boss-btn-primary），已尝试取消。');
      }
      await sleepRandom(600, 1200);
      const after = await readGreetCardDialog(page);
      lines.push(
        '',
        after.present
          ? '⚠️ 已点确认，但弹层仍在，请人工确认是否发出。'
          : `✅ 已确认发出招呼（消耗一张搜索畅聊卡；点击前额度显示：${state.confirmLabel}）。`,
      );
      return lines.join('\n');
    }
  }
}

export async function runSearchPoolGreet(options: SearchPoolGreetOptions): Promise<string> {
  return withBossSessionPage((page) => greetSearchPoolOnPage(page, options), {
    ensureChatShell: false,
    ensureMenuList: false,
  });
}

export type NormalSearchOptions = {
  keyword?: string;
  jobKeyword?: string;
  /** 不传则读 `BOSS_SEARCH_CITY`；仍为空就完全不碰城市控件。 */
  city?: string;
  degree?: string;
  schools?: string[];
  /** 经验要求，单选：在校/应届 / 25年毕业 / 1-3年 / 3-5年 / 5-10年 等 */
  exp?: string;
  /** 年龄要求，单选：20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上 */
  age?: string;
  /** 求职状态，可多选：离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 / 在职-月内到岗 */
  status?: string[];
  /** 跳槽频率，单选：5年少于3份 / 时间≥1年 */
  jobHop?: string;
  /** 专业，可多选，最多 10 个 */
  majors?: string[];
};

export async function runNormalSearch(opts: NormalSearchOptions = {}): Promise<string> {
  const kw = (opts.keyword ?? '').trim();
  const jobKw = (opts.jobKeyword ?? '').trim();
  const city = (opts.city ?? defaultSearchCityFromEnv()).trim();
  const degree = (opts.degree ?? '').trim();
  const schools = (opts.schools ?? []).map((s) => s.trim()).filter(Boolean);
  const exp = (opts.exp ?? '').trim();
  const age = (opts.age ?? '').trim();
  const status = (opts.status ?? []).map((s) => s.trim()).filter(Boolean);
  const jobHop = (opts.jobHop ?? '').trim();
  const majors = (opts.majors ?? []).map((s) => s.trim()).filter(Boolean);
  if (kw.length > 20) {
    throw new Error('常规搜索关键词最多 20 个字符。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const frame = await ensureInNormalSearchPage(page);

      /**
       * 岗位：给了关键字就按关键字选，**没给就切「不限职位」**。
       * 以前没给是「保持上次的岗位」——跨命令沿用上一次的状态，结果不可预测，
       * 同一条命令跑两次可能搜的是两个池子。
       */
      if (jobKw) {
        await selectNormalSearchJob(frame, jobKw);
      } else {
        await selectNormalSearchAnyJob(frame);
      }

      /**
       * 清空上一轮残留的筛选条件，**再**按本次参数重设。
       * 不清的话「这次怎么只有 3 个人」永远得靠猜是不是上次的条件还挂着。
       * 必须在设条件之前——它会把学历 / 院校 / 其他筛选一起归零。
       */
      await resetNormalSearchFilters(frame);

      // 顺序固定：岗位 → 清空 → 城市 → 学历 → 院校 → 其他筛选 → 关键词。
      // 筛选条件都在关键词之前落定，否则先搜后筛会多打一次列表请求。
      if (city) {
        await selectNormalSearchCity(frame, city);
      }
      if (degree) {
        await selectNormalSearchDegree(frame, degree);
      }
      if (schools.length > 0) {
        await selectNormalSearchSchools(frame, schools);
      }
      if (exp) {
        await selectNormalSearchExp(frame, exp);
      }
      if (age) {
        await selectNormalSearchAge(frame, age);
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

      if (kw) {
        await runKeywordSearch(frame, kw);
      }

      // 回显一律读页面实时状态，不打入参——见 readSelectedDegree 的注释。
      const [
        currentKeyword,
        currentJob,
        currentCity,
        currentDegree,
        currentSchools,
        currentExp,
        currentAge,
        others,
        candidates,
      ] = await Promise.all([
        readNormalSearchKeyword(frame),
        readCurrentSearchJob(frame),
        readSelectedCity(frame),
        readSelectedDegree(frame),
        readSelectedSchools(frame),
        readSelectedExp(frame),
        readSelectedAge(frame),
        readOtherFilters(frame),
        readNormalSearchCandidates(frame),
      ]);
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
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`读取常规搜索列表失败：${message}`);
  }
}
