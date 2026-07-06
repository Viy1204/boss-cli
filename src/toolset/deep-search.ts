import type { Frame, Page } from 'puppeteer-core';
import { RESUME_PREVIEW_OPEN_GAP_MS, sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { clickBossSidebarMenuToPath, waitForBossTopPath } from '../common/boss_sidebar_nav.js';

/**
 * 2026-07 Boss 改版适配：深度搜索从 /web/chat/aiform 迁到 /web/chat/search/ai（「搜索」页的 AI 搜索模式）。
 * 页面内容在 iframe[name=searchAiIframe]（/web/frame/search/ai）内；老「核心要求/加分项」两区块
 * 合并为单一「定制要求」输入列表（input.prompt-input-field，maxlength=50）。
 * 职位切换改为按 encryptId 直达：encryptId 即职位管理列表行的 data-id。
 * 新版「深度搜索」按钮每日有配额（如 10/10）；本模块保持只读语义，绝不点击该按钮。
 */
const BOSS_CHAT_AI_SEARCH_PATH = '/web/chat/search/ai';
const BOSS_CHAT_AI_SEARCH_URL = 'https://www.zhipin.com/web/chat/search/ai';
const AI_SEARCH_FRAME_URL_PART = '/web/frame/search/ai';
const SEARCH_FRAME_URL_PART = '/web/frame/search';
const JOB_LIST_FRAME_URL_PART = '/web/frame/job/list';
const AI_FORM_READY_TIMEOUT_MS = 35_000;
const PROMPT_INPUT_MAX_LEN = 50;

type SearchFormSnapshot = {
  selectedJob: string;
  requirements: string[];
  remainingCountText: string;
};

export type DeepSearchGeekItem = {
  name: string;
  meta: string;
  work: string;
  edu: string;
  reason: string;
};

export function isBossChatAiFormUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === BOSS_CHAT_AI_SEARCH_PATH;
  } catch {
    return false;
  }
}

/** 限时执行 frame/page 的 CDP 调用：Boss 切页后主线程长任务会挂起 Runtime 调用，超时按失败处理由外层轮询。 */
async function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise.catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

async function findFrame(
  page: Page,
  match: (f: Frame) => boolean,
  timeoutMs: number,
): Promise<Frame | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const frame = page.frames().find(match);
    if (frame) {
      const alive = await raceTimeout(frame.evaluate('1'), 3_000);
      if (alive === 1) {
        return frame;
      }
    }
    await sleepRandom(400, 700);
  }
  return null;
}

function isAiSearchFrame(f: Frame): boolean {
  try {
    return f.url().includes(AI_SEARCH_FRAME_URL_PART);
  } catch {
    return false;
  }
}

function isPlainSearchFrame(f: Frame): boolean {
  try {
    const u = f.url();
    return u.includes(SEARCH_FRAME_URL_PART) && !u.includes(AI_SEARCH_FRAME_URL_PART);
  } catch {
    return false;
  }
}

type AiFormState = { hasBtn: boolean; remaining: number; total: number; rows: number };

const AI_FORM_STATE_SCRIPT = `(() => {
  const btn = document.querySelector(".btn-ai-match-v2");
  const btnText = btn ? (btn.textContent ?? "").replace(/\\s+/g, " ").trim() : "";
  const m = btnText.match(/\\((\\d+)\\s*\\/\\s*(\\d+)\\)/);
  return {
    hasBtn: !!btn,
    remaining: m ? Number(m[1]) : -1,
    total: m ? Number(m[2]) : -1,
    rows: document.querySelectorAll(".prompt-list input.prompt-input-field").length,
  };
})()`;

/** 等 AI 搜索 iframe 就绪：按钮存在且（配额已加载或条件行已渲染）。配额初载短暂显示 (0/0)，total>0 才算加载完成。 */
async function waitForAiFormReady(page: Page, timeoutMs = AI_FORM_READY_TIMEOUT_MS): Promise<Frame> {
  const start = Date.now();
  let lastState: AiFormState | null = null;
  while (Date.now() - start < timeoutMs) {
    const frame = page.frames().find(isAiSearchFrame);
    if (frame) {
      const state = (await raceTimeout(frame.evaluate(AI_FORM_STATE_SCRIPT), 4_000)) as AiFormState | null;
      if (state) {
        lastState = state;
        if (state.hasBtn && (state.total > 0 || state.rows > 0)) {
          return frame;
        }
      }
    }
    await sleepRandom(500, 900);
  }
  throw new Error(
    `AI 搜索页未就绪（${lastState ? JSON.stringify(lastState) : '未找到 searchAiIframe'}），请确认已登录并可访问 ${BOSS_CHAT_AI_SEARCH_PATH}。`,
  );
}

function currentAiSearchEncryptId(url: string): string {
  try {
    return new URL(url).searchParams.get('encryptId') ?? '';
  } catch {
    return '';
  }
}

async function navigateToAiSearchPage(page: Page, encryptId: string | null): Promise<Frame> {
  if (isBossChatAiFormUrl(page.url())) {
    if (!encryptId || currentAiSearchEncryptId(page.url()) === encryptId) {
      return waitForAiFormReady(page);
    }
  }
  const url = encryptId
    ? `${BOSS_CHAT_AI_SEARCH_URL}?encryptId=${encodeURIComponent(encryptId)}`
    : BOSS_CHAT_AI_SEARCH_URL;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  } catch {
    // 忙时 goto 可能超时，交给轮询判定
  }
  let r = await waitForBossTopPath(page, BOSS_CHAT_AI_SEARCH_PATH, 15_000);
  if (!r.ok) {
    // goto 被重定向时回退：搜索页 →「开启AI搜索」按钮（会带当前职位 encryptId 进入）
    await clickBossSidebarMenuToPath(page, '搜索', '/web/chat/search');
    const searchFrame = await findFrame(page, isPlainSearchFrame, 20_000);
    if (!searchFrame) {
      throw new Error('进入搜索页后未找到搜索 iframe（/web/frame/search/）。');
    }
    const clicked = await raceTimeout(
      searchFrame.evaluate(`(() => {
        const btn = document.querySelector(".btn-ai-common");
        if (!(btn instanceof HTMLElement)) return false;
        btn.scrollIntoView({ block: "center", inline: "nearest" });
        btn.click();
        return true;
      })()`),
      5_000,
    );
    if (clicked !== true) {
      throw new Error('搜索页未找到「开启AI搜索」入口（.btn-ai-common）。');
    }
    r = await waitForBossTopPath(page, BOSS_CHAT_AI_SEARCH_PATH, 25_000);
    if (!r.ok) {
      throw new Error(`未能进入 AI 搜索页（当前停在 ${r.lastSeen ?? '未知页面'}）。`);
    }
  }
  return waitForAiFormReady(page);
}

type JobRow = { id: string; title: string; status: string };

const READ_JOB_ROWS_SCRIPT = `(() => {
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  return Array.from(document.querySelectorAll(".job-jobInfo-warp")).map((el) => ({
    id: norm(el.getAttribute("data-id")),
    title: norm(el.querySelector(".job-title a")?.textContent),
    status: norm(el.querySelector(".job-status-wrapper .status-box")?.textContent),
  })).filter((j) => j.id && j.title);
})()`;

/** 经职位管理列表把岗位关键字解析成 encryptId（列表行 data-id 即 AI 搜索页的 encryptId）。 */
async function resolveJobByKeyword(page: Page, keyword: string): Promise<JobRow> {
  const kw = keyword.trim();
  await clickBossSidebarMenuToPath(page, '职位管理', '/web/chat/job/list');
  const start = Date.now();
  let jobs: JobRow[] = [];
  while (Date.now() - start < 25_000) {
    for (const frame of page.frames()) {
      try {
        if (!frame.url().includes(JOB_LIST_FRAME_URL_PART) && frame !== page.mainFrame()) {
          continue;
        }
      } catch {
        continue;
      }
      const rows = (await raceTimeout(frame.evaluate(READ_JOB_ROWS_SCRIPT), 4_000)) as JobRow[] | null;
      if (Array.isArray(rows) && rows.length > 0) {
        jobs = rows;
        break;
      }
    }
    if (jobs.length > 0) {
      break;
    }
    await sleepRandom(400, 800);
  }
  if (jobs.length === 0) {
    throw new Error('职位管理列表读取超时，无法解析岗位关键字。');
  }
  const exact = jobs.find((j) => j.title === kw);
  if (exact) {
    return exact;
  }
  const needle = kw.toLowerCase();
  const fuzzy = jobs.filter((j) => j.title.toLowerCase().includes(needle));
  if (fuzzy.length === 1) {
    return fuzzy[0] as JobRow;
  }
  if (fuzzy.length > 1) {
    const picks = fuzzy
      .slice(0, 8)
      .map((j, i) => `${i + 1}. ${j.title}`)
      .join('｜');
    throw new Error(`“${kw}”命中多个职位，请改用更精确名称。候选：${picks}`);
  }
  const available = jobs.slice(0, 10).map((j) => j.title).join('｜');
  throw new Error(`未找到匹配岗位“${kw}”。可选职位：${available}`);
}

export async function ensureInDeepSearchPage(page: Page): Promise<void> {
  if (!isBossChatAiFormUrl(page.url())) {
    throw new Error(`当前不在深度搜索页（${BOSS_CHAT_AI_SEARCH_PATH}），请先通过「搜索 → 开启AI搜索」进入。`);
  }
  await waitForAiFormReady(page);
}

/** 切换 AI 搜索页岗位：解析 encryptId 后直达（会经过职位管理列表，页面会跳转）。 */
export async function selectAiFormJob(page: Page, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    throw new Error('岗位关键字不能为空。');
  }
  const job = await resolveJobByKeyword(page, kw);
  await navigateToAiSearchPage(page, job.id);
  return job.title;
}

/** AI 搜索页当前选中的岗位文案（职位 pill，如「3D角色建模师·深圳·本科·3-5年·15-25K·14薪」；无则「默认」） */
export async function readAiFormSelectedJobLabel(page: Page): Promise<string> {
  const frame = page.frames().find(isAiSearchFrame);
  if (!frame) {
    return '默认';
  }
  const label = await raceTimeout(
    frame.evaluate(`(() => {
      const el = document.querySelector(".search-condition input.ipt, input.ipt");
      const v = el && "value" in el ? String(el.value ?? "") : "";
      return v.replace(/\\s+/g, " ").trim();
    })()`),
    4_000,
  );
  return typeof label === 'string' && label.length > 0 ? label : '默认';
}

/**
 * 在 AI 搜索页按姓名打开在线简历预览（与 {@link clickGreetDeepSearch} 同一卡片集合，排除「继续沟通」）。
 */
export async function openDeepSearchResumePreview(page: Page, target: string): Promise<boolean> {
  const frame = page.frames().find(isAiSearchFrame);
  if (!frame) {
    return false;
  }
  const raw = target.trim();
  const targetLiteral = JSON.stringify(raw);
  const opened = (await frame.evaluate(`(() => {
    const raw = ${targetLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const allCards = Array.from(
      document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
    );
    if (allCards.length === 0) return false;
    const cards = allCards.filter((item) => {
      const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
      return !chatLabel.includes("继续沟通");
    });
    if (cards.length === 0) return false;
    const targetCard =
      cards.find((item) => {
        const name = norm(item.querySelector(".geek-name")?.textContent);
        return name === raw || name.includes(raw);
      }) ?? null;
    if (!targetCard) return false;

    function tryOpen(el) {
      if (!(el instanceof HTMLElement)) return false;
      if (el.classList.contains("disabled")) return false;
      const st = window.getComputedStyle(el);
      if (st.pointerEvents === "none" || Number(st.opacity) < 0.3) return false;
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
      return true;
    }

    const nameEl = targetCard.querySelector(".geek-name");
    if (nameEl instanceof HTMLElement) {
      nameEl.scrollIntoView({ block: "center", inline: "nearest" });
      nameEl.click();
      return true;
    }

    const resumeOnline = targetCard.querySelector("a.resume-btn-online");
    if (tryOpen(resumeOnline)) return true;
    const hrefResume = targetCard.querySelector('a[href*="c-resume"], a[href*="frame/c-resume"]');
    if (tryOpen(hrefResume)) return true;

    const links = Array.from(targetCard.querySelectorAll("a, button, .btn")).filter((node) => {
      const t = norm(node.textContent);
      return /在线简历|查看简历|简历预览|预览/.test(t);
    });
    if (links.length > 0 && tryOpen(links[0])) return true;

    const geekInfo = targetCard.querySelector(".geek-info, .geek-card-main, .card-content");
    if (geekInfo instanceof HTMLElement) {
      geekInfo.scrollIntoView({ block: "center", inline: "nearest" });
      geekInfo.click();
      return true;
    }

    return false;
  })()`)) as boolean;
  if (opened) {
    await sleepRandom(RESUME_PREVIEW_OPEN_GAP_MS.min, RESUME_PREVIEW_OPEN_GAP_MS.max);
  }
  return opened;
}

export async function readDeepSearchGeekList(page: Page): Promise<DeepSearchGeekItem[]> {
  const frame = page.frames().find(isAiSearchFrame);
  if (!frame) {
    return [];
  }
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const items = Array.from(
      document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
    );
    return items
      .map((item) => {
        const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
        if (chatLabel.includes("继续沟通")) {
          return null;
        }
        const name = norm(item.querySelector(".geek-name")?.textContent);
        const splits = Array.from(item.querySelectorAll(".geek-exp .split"))
          .map((el) => norm(el.getAttribute("title") || el.textContent || ""))
          .filter(Boolean);
        const meta = splits.join(" · ");
        const work = norm(item.querySelector(".geek-works span")?.textContent);
        const edu = norm(item.querySelector(".geek-edus span")?.textContent);
        const recEl = item.querySelector(".geek-recommend-text");
        let reason = "";
        if (recEl) {
          reason = norm(recEl.textContent).replace(/^推荐理由\\s*/, "").trim();
        }
        return { name, meta, work, edu, reason };
      })
      .filter((x) => x !== null && x.name);
  })()`)) as DeepSearchGeekItem[];
}

export function renderGeekListSection(title: string, items: DeepSearchGeekItem[]): string {
  const lines: string[] = [title, `共 ${items.length} 人`, ''];
  items.forEach((g, i) => {
    const n = i + 1;
    lines.push(`${n}. ${g.name || '（无姓名）'}`);
    if (g.meta) {
      lines.push(`   概要：${g.meta}`);
    }
    if (g.work) {
      lines.push(`   经历：${g.work}`);
    }
    if (g.edu) {
      lines.push(`   教育：${g.edu}`);
    }
    if (g.reason) {
      lines.push(`   推荐：${g.reason}`);
    }
    lines.push('');
  });
  return lines.join('\n').trimEnd();
}

type GreetClickResult =
  | { kind: 'empty' }
  | { kind: 'all_continue' }
  | { kind: 'not_found'; target: string }
  | { kind: 'no_btn'; name: string }
  | { kind: 'not_greet'; name: string; label: string }
  | { kind: 'disabled'; name: string }
  | { kind: 'clicked'; name: string };

export async function clickGreetDeepSearch(page: Page, target: string): Promise<{ message: string }> {
  const frame = page.frames().find(isAiSearchFrame);
  if (!frame) {
    throw new Error('未找到 AI 搜索 iframe，无法打招呼。');
  }
  const targetLiteral = JSON.stringify(target.trim());
  const result = (await frame.evaluate(`(() => {
      const raw = ${targetLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const allCards = Array.from(
        document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
      );
      if (allCards.length === 0) {
        return { kind: "empty" };
      }
      const cards = allCards.filter((item) => {
        const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
        return !chatLabel.includes("继续沟通");
      });
      if (cards.length === 0) {
        return { kind: "all_continue" };
      }
      const targetCard =
        cards.find((item) => {
          const name = norm(item.querySelector(".geek-name")?.textContent);
          return name === raw || name.includes(raw);
        }) ?? null;
      if (!targetCard) {
        return { kind: "not_found", target: raw };
      }

      const name = norm(targetCard.querySelector(".geek-name")?.textContent);
      const btn =
        targetCard.querySelector(".geek-chat .btn-ai-v2") ||
        targetCard.querySelector(".geek-chat span.btn-ai-v2") ||
        targetCard.querySelector(".geek-chat span[class*='btn-ai']");
      if (!(btn instanceof HTMLElement)) {
        return { kind: "no_btn", name };
      }
      const label = norm(btn.textContent);
      if (!label.includes("打招呼")) {
        return { kind: "not_greet", name, label };
      }
      const cls = btn.className ?? "";
      const disabled = /disabled|forbid|ban/i.test(cls) || btn.getAttribute("disabled") !== null;
      if (disabled) {
        return { kind: "disabled", name };
      }
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { kind: "clicked", name };
    })()`)) as GreetClickResult;
  switch (result.kind) {
    case 'empty':
      throw new Error('深度搜索暂无候选人列表，请先在页面点击「深度搜索」按钮生成匹配后再试。');
    case 'all_continue':
      throw new Error('当前列表均为「继续沟通」状态，已无待打招呼人选（与 boss deep-search 列表展示一致）。');
    case 'not_found':
      throw new Error(
        `未在可打招呼的深度搜索列表中找到目标：${result.target}（「继续沟通」人选已排除，请用 boss deep-search 核对姓名）。`,
      );
    case 'no_btn':
      throw new Error(`候选人 ${result.name} 缺少「打招呼」按钮，无法执行。`);
    case 'not_greet':
      throw new Error(`候选人 ${result.name} 当前按钮为「${result.label}」，无法执行打招呼。`);
    case 'disabled':
      throw new Error(`候选人 ${result.name} 的打招呼不可用（可能已打过招呼）。`);
    case 'clicked':
      return { message: `已对 ${result.name} 在深度搜索页点击「打招呼」。` };
    default: {
      const _x: never = result;
      throw new Error(`未知结果：${String(_x)}`);
    }
  }
}

const READ_SNAPSHOT_SCRIPT = `(() => {
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const pill = document.querySelector(".search-condition input.ipt, input.ipt");
  const selectedJob = pill && "value" in pill ? norm(String(pill.value ?? "")) : "";
  const requirements = Array.from(document.querySelectorAll(".prompt-list input.prompt-input-field"))
    .map((el) => norm(el.value))
    .filter(Boolean);
  const btn = document.querySelector(".btn-ai-match-v2");
  const btnText = btn ? norm(btn.textContent) : "";
  const m = btnText.match(/\\((\\d+)\\s*\\/\\s*(\\d+)\\)/);
  return {
    selectedJob,
    requirements,
    remainingCountText: m ? m[1] + "/" + m[2] : "",
  };
})()`;

async function readSearchFormSnapshot(page: Page): Promise<SearchFormSnapshot> {
  const frame = await waitForAiFormReady(page);
  return (await frame.evaluate(READ_SNAPSHOT_SCRIPT)) as SearchFormSnapshot;
}

/**
 * 把条件写入「定制要求」列表（老版核心要求/加分项已合并为这一个列表，按 core、bonus 顺序拼接）。
 * 逐行覆盖，行不够时点「添加更多要求」（button.prompt-add）。单条上限 50 字（Boss 输入框 maxlength）。
 * 返回被截断的原始条目（超长告知调用方）。
 */
async function applyAiFormRequirementLists(
  page: Page,
  opts: { core?: string[]; bonus?: string[] },
): Promise<string[]> {
  const merged = [...(opts.core ?? []), ...(opts.bonus ?? [])].map((s) => s.trim()).filter(Boolean);
  const truncated: string[] = [];
  if (merged.length === 0) {
    return truncated;
  }
  const frame = await waitForAiFormReady(page);
  for (let i = 0; i < merged.length; i++) {
    let text = merged[i] as string;
    if (text.length > PROMPT_INPUT_MAX_LEN) {
      truncated.push(text);
      text = text.slice(0, PROMPT_INPUT_MAX_LEN);
    }
    let rows = (await frame.evaluate(
      `document.querySelectorAll(".prompt-list input.prompt-input-field").length`,
    )) as number;
    if (i >= rows) {
      const added = (await frame.evaluate(`(() => {
        const btn = document.querySelector(".prompt-list button.prompt-add, button.prompt-add");
        if (!(btn instanceof HTMLElement)) return false;
        btn.scrollIntoView({ block: "center", inline: "nearest" });
        btn.click();
        return true;
      })()`)) as boolean;
      if (!added) {
        throw new Error(`定制要求第 ${i + 1} 条：未找到「添加更多要求」按钮（button.prompt-add），无法加行。`);
      }
      await sleepRandom(300, 600);
      rows = (await frame.evaluate(
        `document.querySelectorAll(".prompt-list input.prompt-input-field").length`,
      )) as number;
      if (i >= rows) {
        throw new Error(`定制要求第 ${i + 1} 条：点击「添加更多要求」后仍无可用输入行。`);
      }
    }
    const fillOnce = async (): Promise<void> => {
      await frame.evaluate(`((idx, v) => {
        const fields = document.querySelectorAll(".prompt-list input.prompt-input-field");
        const el = fields[idx];
        if (!(el instanceof HTMLInputElement)) return false;
        el.scrollIntoView({ block: "center", inline: "nearest" });
        el.focus();
        const tracker = el._valueTracker;
        if (tracker && typeof tracker.setValue === "function") tracker.setValue("");
        const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        if (desc && desc.set) desc.set.call(el, v); else el.value = v;
        el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, data: v }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.blur();
        return true;
      })(${i}, ${JSON.stringify(text)})`);
    };
    const verify = async (): Promise<boolean> => {
      const shown = (await frame.evaluate(`((idx) => {
        const fields = document.querySelectorAll(".prompt-list input.prompt-input-field");
        const el = fields[idx];
        return el ? String(el.value ?? "").replace(/\\s+/g, " ").trim() : "";
      })(${i})`)) as string;
      return shown === text.replace(/\s+/g, ' ').trim();
    };
    await fillOnce();
    await sleepRandom(120, 260);
    if (!(await verify())) {
      await fillOnce();
      await sleepRandom(120, 260);
      if (!(await verify())) {
        throw new Error(`定制要求第 ${i + 1} 条写入失败（内容未生效）。`);
      }
    }
  }
  return truncated;
}

function renderFormSnapshotOnly(snap: SearchFormSnapshot, truncated: string[]): string {
  const reqs = snap.requirements.length > 0 ? snap.requirements.join('｜') : '（空）';
  const lines = [
    '已更新深度搜索条件（未点击「深度搜索」按钮，不消耗当日次数）。',
    `职位：${snap.selectedJob || '未知职位'}`,
    `定制要求(${snap.requirements.length})：${reqs}`,
    `今日深度搜索剩余：${snap.remainingCountText || '未知'}`,
    `来源页面：${BOSS_CHAT_AI_SEARCH_URL}`,
  ];
  if (truncated.length > 0) {
    lines.push(`注意：${truncated.length} 条要求超过 ${PROMPT_INPUT_MAX_LEN} 字已截断（Boss 输入框上限）。`);
  }
  return lines.join('\n');
}

export async function runBossSearchSet(opts: {
  jobKeyword?: string;
  coreRequirements?: string[];
  bonusRequirements?: string[];
}): Promise<string> {
  const jobKeyword = opts.jobKeyword?.trim();
  const coreReq = opts.coreRequirements;
  const bonusReq = opts.bonusRequirements;
  const hasFormEdit = coreReq !== undefined || bonusReq !== undefined;
  if (!jobKeyword && !hasFormEdit) {
    throw new Error('请至少指定 --job/-j、--core/-c 或 --bonus/-b 之一。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
      } else {
        await navigateToAiSearchPage(page, null);
      }
      let truncated: string[] = [];
      if (hasFormEdit) {
        truncated = await applyAiFormRequirementLists(page, {
          core: coreReq,
          bonus: bonusReq,
        });
      }
      const snap = await readSearchFormSnapshot(page);
      return renderFormSnapshotOnly(snap, truncated);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] boss_search_set error: ${message}`);
    throw new Error(`设置深度搜索条件失败：${message}`);
  }
}

export async function runBossSearch(opts: { jobKeyword?: string } = {}): Promise<string> {
  const jobKeyword = opts.jobKeyword?.trim();
  try {
    return await withBossSessionPage(async (page) => {
      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
      } else {
        await navigateToAiSearchPage(page, null);
      }
      const geeks = await readDeepSearchGeekList(page);
      const title = jobKeyword
        ? `深度搜索当前列表（岗位：${jobKeyword}，未触发「深度搜索」按钮）`
        : '深度搜索当前匹配结果（未触发「深度搜索」按钮）';
      const body = renderGeekListSection(title, geeks);
      if (geeks.length === 0) {
        const snap = await readSearchFormSnapshot(page);
        return [
          body,
          '',
          '提示：该职位暂无匹配记录。匹配记录需在 AI 搜索页点击「深度搜索」按钮生成（消耗当日次数），',
          `当前剩余：${snap.remainingCountText || '未知'}。`,
        ].join('\n');
      }
      return body;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] boss_search error: ${message}`);
    throw new Error(`读取深度搜索列表失败：${message}`);
  }
}
