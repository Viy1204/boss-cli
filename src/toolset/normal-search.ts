import type { Frame, Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { ensurePage } from '../common/ensure_page.js';

const BOSS_CHAT_SEARCH_URL = 'https://www.zhipin.com/web/chat/search';
const SEARCH_FRAME_READY_TIMEOUT_MS = 18_000;
const SEARCH_RESULT_SETTLE_MS = { min: 900, max: 1600 } as const;

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

export async function runNormalSearch(keyword?: string): Promise<string> {
  const kw = (keyword ?? '').trim();
  if (kw.length > 20) {
    throw new Error('常规搜索关键词最多 20 个字符。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const frame = await ensureInNormalSearchPage(page);
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
