import type { Frame, Page } from 'puppeteer-core';
import { RESUME_PREVIEW_OPEN_GAP_MS, sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { ensurePage } from '../common/ensure_page.js';

const BOSS_CHAT_SEARCH_URL = 'https://www.zhipin.com/web/chat/search';
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
