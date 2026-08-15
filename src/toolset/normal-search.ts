import type { Frame, Page } from 'puppeteer-core';
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

  await frame.waitForFunction(
    `((kw) => {
      const input = document.querySelector(".search-input");
      return input instanceof HTMLInputElement && input.value === kw;
    })`,
    { timeout: 5_000 },
    keyword,
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
    await frame.waitForFunction(
      `((prev) => {
        const cur = (document.querySelector(".search-current-job")?.textContent ?? "").replace(/\\s+/g, " ").trim();
        return cur.length > 0 && cur !== prev;
      })`,
      { timeout: 8_000 },
      before,
    );
  } catch {
    // 当前岗位文案未变（可能本就是该岗）——不阻断，返回读到的 label。
  }
  await sleepRandom(JOB_SWITCH_SETTLE_MS.min, JOB_SWITCH_SETTLE_MS.max);
  return label;
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
  meta: { keyword: string; job: string },
): string {
  const titleKeyword = meta.keyword ? `关键词：${meta.keyword}` : '关键词：默认/热门词';
  const lines = [
    `常规搜索结果（${titleKeyword}${meta.job ? `；当前岗位：${meta.job}` : ''}）`,
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

export async function runNormalSearch(keyword?: string, jobKeyword?: string): Promise<string> {
  const kw = (keyword ?? '').trim();
  const jobKw = (jobKeyword ?? '').trim();
  if (kw.length > 20) {
    throw new Error('常规搜索关键词最多 20 个字符。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const frame = await ensureInNormalSearchPage(page);
      if (jobKw) {
        await selectNormalSearchJob(frame, jobKw);
      }
      if (kw) {
        await runKeywordSearch(frame, kw);
      }

      const [currentKeyword, currentJob, candidates] = await Promise.all([
        readNormalSearchKeyword(frame),
        readCurrentSearchJob(frame),
        readNormalSearchCandidates(frame),
      ]);
      return renderNormalSearchCandidates(candidates, {
        keyword: currentKeyword || kw,
        job: currentJob,
      });
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`读取常规搜索列表失败：${message}`);
  }
}
