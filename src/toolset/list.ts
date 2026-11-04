import type { Page } from 'puppeteer-core';
import {
  LIST_FILTER_GAP_MS,
  LIST_MIN_BEFORE_READY_MS,
  LIST_POLL_MS,
  sleepRandom,
} from '../browser/index.js';
import { BOSS_CHAT_INDEX_URL, isBossChatIndexUrl } from '../common/auth.js';
import { ensurePage } from '../common/ensure_page.js';
import { withBossSessionPage } from '../common/boss_session_page.js';

type CandidateItem = {
  name: string;
  job: string;
  time: string;
  message: string;
  unreadCount: number;
};

/** 未读角标解析：数字优先且 >0；否则含「新」至少计 1 */
export const UNREAD_BADGE_COUNT_JS = `const unreadCountFromBadgeText = (badgeText) => {
  const text = badgeText.replace(/\\s+/g, " ").trim();
  const count = parseInt(text.replace(/\\D/g, ""), 10) || 0;
  if (count > 0) return count;
  return text.includes("新") ? 1 : 0;
};`;

async function waitForCandidateListSettled(
  page: Page,
  opts: { timeoutMs: number; pollMsMin: number; pollMsMax: number; minMsBeforeReady: number },
): Promise<void> {
  const start = Date.now();
  let prevKey: string | null = null;
  let stable = 0;
  let lastCount = 0;
  while (Date.now() - start < opts.timeoutMs) {
    const snapshot = (await page.evaluate(
      `(() => {
        const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
        return Array.from(document.querySelectorAll(".geek-item")).map((el) => [
          norm(el.querySelector(".geek-name")?.textContent),
          norm(el.querySelector(".badge-count")?.textContent),
        ]);
      })()`,
    )) as Array<[string, string]>;
    lastCount = snapshot.length;
    const key = JSON.stringify(snapshot);
    if (key === prevKey) {
      stable++;
    } else {
      prevKey = key;
      stable = 1;
    }
    if (Date.now() - start >= opts.minMsBeforeReady && stable >= 2) {
      return;
    }
    await sleepRandom(opts.pollMsMin, opts.pollMsMax);
  }
  throw new Error(
    `候选人列表在 ${opts.timeoutMs}ms 内未稳定（仍在变化），拒绝读取未就绪数据。最后快照行数：${lastCount}`,
  );
}

async function clickChatFilterTab(page: Page, label: string): Promise<void> {
  const labelLiteral = JSON.stringify(label);
  await page.evaluate(`(() => {
    const targetText = ${labelLiteral};
    const container = document.querySelector(".chat-message-filter-left");
    if (!container) {
      throw new Error("未找到聊天筛选容器：.chat-message-filter-left");
    }
    const spans = Array.from(container.querySelectorAll("span"));
    const norm = (v) => (v ?? "").replace(/\\s+/g, "");
    const target = spans.find((el) => norm(el.textContent).includes(targetText));
    if (!target) {
      const labels = spans.map((el) => norm(el.textContent)).filter(Boolean).join(",");
      throw new Error("未找到聊天筛选项：" + targetText + "；当前筛选项：" + (labels || "空"));
    }
    target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    target.click();
  })()`);
}

async function waitForChatFilterTabSelected(page: Page, label: string): Promise<void> {
  const labelLiteral = JSON.stringify(label);
  await page.waitForFunction(
    `(() => {
      const targetText = ${labelLiteral};
      const container = document.querySelector(".chat-message-filter-left");
      if (!container) return false;
      const norm = (v) => (v ?? "").replace(/\\s+/g, "");
      const tabs = Array.from(container.querySelectorAll("span"));
      const tab = tabs.find((el) => norm(el.textContent).includes(targetText));
      if (!tab) return false;
      const cls = String(tab.className || "");
      const selectedByClass = /active|selected|current|checked/.test(cls);
      const selectedByAria = tab.getAttribute("aria-selected") === "true";
      const selectedByAncestor = !!tab.closest(".active, .selected, .current, .checked");
      return selectedByClass || selectedByAria || selectedByAncestor;
    })()`,
    { timeout: 8_000, polling: 100 },
  );
}

export async function ensureChatListReady(
  page: Page,
  filter: 'all' | 'unread' = 'all',
): Promise<void> {
  await ensurePage(page, {
    name: '沟通列表页',
    targetUrl: BOSS_CHAT_INDEX_URL,
    matches: isBossChatIndexUrl,
  });

  await page.waitForFunction(
    `(() => {
      const filter = document.querySelector(".chat-message-filter-left");
      if (!filter) return false;
      const tabs = Array.from(filter.querySelectorAll("span"));
      return tabs.length >= 2;
    })()`,
    { timeout: 15_000, polling: 100 },
  );

  const filterLabel = filter === 'unread' ? '未读' : '全部';
  await clickChatFilterTab(page, filterLabel);
  await sleepRandom(LIST_FILTER_GAP_MS.min, LIST_FILTER_GAP_MS.max);
  await waitForChatFilterTabSelected(page, filterLabel);
  await waitForCandidateListSettled(page, {
    timeoutMs: 18_000,
    pollMsMin: LIST_POLL_MS.min,
    pollMsMax: LIST_POLL_MS.max,
    minMsBeforeReady: LIST_MIN_BEFORE_READY_MS,
  });
}

export async function runGetCandidateList(
  opts: { unreadOnly?: boolean } = {},
): Promise<string> {
  const unreadOnly = opts.unreadOnly === true;

  try {
    return await withBossSessionPage(async (page) => {
      // 始终加载「全部」列表再在客户端按未读角标过滤：
      // Boss v10718+ 改版后「未读」筛选 tab 点击失效/筛出空列表，不能依赖平台过滤。
      await ensureChatListReady(page, 'all');

      const items = (await page.evaluate(
        `(() => {
          ${UNREAD_BADGE_COUNT_JS}
          const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
          return Array.from(document.querySelectorAll(".geek-item")).map((el) => {
            const name = norm(el.querySelector(".geek-name")?.textContent);
            const job = norm(el.querySelector(".source-job")?.textContent);
            const time = norm(el.querySelector(".time")?.textContent);
            const message = norm(el.querySelector(".push-text")?.textContent);
            const badge = el.querySelector(".badge-count");
            const unreadCount = unreadCountFromBadgeText(norm(badge?.textContent));
            return { name, job, time, message, unreadCount };
          });
        })()`,
      )) as CandidateItem[];

      const candidates = items.filter((it) => it.name) as CandidateItem[];
      const withUnread = candidates.filter((it) => it.unreadCount > 0).length;
      const visible = unreadOnly
        ? candidates.filter((it) => it.unreadCount > 0)
        : candidates;
      const lines = visible.map((it, idx) => {
        const base = `${idx + 1}. ${it.name}${it.job ? `｜${it.job}` : ''}`;
        const meta = [
          it.unreadCount > 0 ? `未读:${it.unreadCount}` : '',
          it.time ? `时间:${it.time}` : '',
          it.message ? `消息:${it.message}` : '',
        ]
          .filter(Boolean)
          .join('｜');
        return meta ? `${base}｜${meta}` : base;
      });
      const previewText =
        lines.length > 0 ? `候选人明细：\n${lines.join('\n')}` : '候选人明细：暂无。';

      return [
        unreadOnly
          ? `未读筛选：共 ${visible.length} 人（从全量列表按未读角标筛选）。`
          : `沟通列表共 ${candidates.length} 人，其中 ${withUnread} 人有未读消息。`,
        previewText,
      ]
        .filter(Boolean)
        .join('\n');
    });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`获取候选人列表失败：${String(e)}`);
  }
}
