import type { Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { clickBossSidebarMenuToPath } from '../common/boss_sidebar_nav.js';

/**
 * 人才库搜索（Boss 2026-07 新「搜索」页，/web/chat/search）：按关键词/岗位在全网牛人库搜索，
 * 可选对结果按序号点「立即沟通」发起打招呼（--greet，消耗每日沟通额度）。
 * 内容在 iframe（/web/frame/search/，注意与 /web/frame/search/ai 区分）。
 * iframe 会随职位切换/搜索重载导致句柄失效，所有 evaluate 均即时解析 frame（frameEval），不持久持有。
 * 平台规则：搜索结果姓名打码（如「张**」），建立沟通后可见；只读第一页。
 */
const BOSS_CHAT_SEARCH_PATH = '/web/chat/search';
const SEARCH_READY_TIMEOUT_MS = 30_000;
const RESULTS_WAIT_TIMEOUT_MS = 20_000;

export type TalentSearchItem = {
  name: string;
  active: string;
  meta: string;
  desc: string;
  tags: string[];
  expects: string[];
};

type GreetCardScan = { i: number; name: string; meta: string };

type GreetCardResult = GreetCardScan & { ok: boolean; msg: string };

async function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise.catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/** 即时解析搜索 iframe 并 evaluate；frame 不在/已 detach/主线程忙时返回 null，由调用方轮询或报错。 */
async function frameEval(page: Page, script: string, ms = 5_000): Promise<unknown> {
  const frame = page.frames().find((f) => {
    try {
      const u = f.url();
      return u.includes('/web/frame/search') && !u.includes('/web/frame/search/ai');
    } catch {
      return false;
    }
  });
  if (!frame) {
    return null;
  }
  return raceTimeout(frame.evaluate(script), ms);
}

async function waitForSearchReady(page: Page, timeoutMs = SEARCH_READY_TIMEOUT_MS): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await frameEval(
      page,
      `(() => {
        return !!document.querySelector(".search-wrap") && !!document.querySelector("input.search-input");
      })()`,
      4_000,
    );
    if (ok === true) {
      return;
    }
    await sleepRandom(500, 900);
  }
  throw new Error(`人才库搜索页未就绪（未找到 search iframe 或搜索框），请确认已登录并可访问 ${BOSS_CHAT_SEARCH_PATH}。`);
}

/** 结果区指纹：用于判断触发搜索后列表是否已刷新。 */
const RESULTS_MARKER_SCRIPT = `(() => {
  const cards = document.querySelectorAll(".card-list .geek-info-card");
  const first = cards[0];
  const t = first ? (first.textContent ?? "").replace(/\\s+/g, "").slice(0, 60) : "";
  return cards.length + "|" + t;
})()`;

async function readResultsMarker(page: Page): Promise<string> {
  const m = await frameEval(page, RESULTS_MARKER_SCRIPT, 4_000);
  return typeof m === 'string' ? m : '';
}

async function waitForResultsChange(
  page: Page,
  beforeMarker: string,
  timeoutMs = RESULTS_WAIT_TIMEOUT_MS,
): Promise<boolean> {
  const start = Date.now();
  let last = beforeMarker;
  while (Date.now() - start < timeoutMs) {
    await sleepRandom(700, 1200);
    const m = await readResultsMarker(page);
    if (m && m !== beforeMarker && !m.startsWith('0|')) {
      return true;
    }
    last = m || last;
  }
  // 超时未变化：可能结果确实相同或为空，交给读取阶段兜底
  return !last.startsWith('0|');
}

export async function selectTalentSearchJob(page: Page, keyword: string): Promise<string> {
  const kw = keyword.trim();
  const kwLiteral = JSON.stringify(kw);
  // ui-dropmenu 为 hover/点击展开，但选项 li 常驻 DOM，直接对匹配项派发点击即可
  await frameEval(
    page,
    `(() => {
      const label = document.querySelector(".search-job-list-C .ui-dropmenu-label");
      if (label instanceof HTMLElement) label.click();
    })()`,
    4_000,
  );
  await sleepRandom(300, 600);
  const picked = (await frameEval(
    page,
    `(() => {
      const kw = ${kwLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
      const rows = Array.from(document.querySelectorAll(".search-job-list-C .ui-dropmenu-list li[ka=search_select_job]"));
      if (rows.length === 0) return { ok: false, reason: "empty" };
      let target = null;
      if (norm(kw) === "不限" || norm(kw) === "不限职位") {
        target = rows.find((el) => norm(el.textContent).includes("不限职位")) ?? null;
      } else {
        target = rows.find((el) => {
          const name = norm(el.querySelector(".job-name")?.textContent || "");
          return name.includes(norm(kw));
        }) ?? null;
      }
      if (!(target instanceof HTMLElement)) return { ok: false, reason: "not_found" };
      const label = (target.querySelector(".job-name")?.textContent ?? target.textContent ?? "")
        .replace(/\\s+/g, " ").trim();
      target.scrollIntoView({ block: "center", inline: "nearest" });
      target.click();
      return { ok: true, label };
    })()`,
    5_000,
  )) as { ok: boolean; label?: string } | null;
  if (!picked || !picked.ok) {
    throw new Error(`人才库搜索页未找到匹配岗位“${kw}”（下拉 li[ka=search_select_job]）。`);
  }
  await sleepRandom(400, 800);
  return picked.label ?? kw;
}

async function fillKeywordAndSearch(page: Page, keywords: string): Promise<void> {
  const kwLiteral = JSON.stringify(keywords);
  const filled = await frameEval(
    page,
    `(() => {
      const el = document.querySelector("input.search-input");
      if (!(el instanceof HTMLInputElement)) return false;
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.focus();
      const tracker = el._valueTracker;
      if (tracker && typeof tracker.setValue === "function") tracker.setValue("");
      const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (desc && desc.set) desc.set.call(el, ${kwLiteral}); else el.value = ${kwLiteral};
      el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()`,
    5_000,
  );
  if (filled !== true) {
    throw new Error('未找到人才库搜索关键词输入框（input.search-input）。');
  }
  await sleepRandom(300, 600);
  const triggered = await frameEval(
    page,
    `(() => {
      const icon = document.querySelector(".search-input-wrap .icon-search, .search-input-wrap i[class*=icon-search]");
      if (icon instanceof HTMLElement) {
        icon.click();
        return true;
      }
      const el = document.querySelector("input.search-input");
      if (!(el instanceof HTMLInputElement)) return false;
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
      return true;
    })()`,
    5_000,
  );
  if (triggered !== true) {
    throw new Error('未能触发搜索（icon-search 与 Enter 均失败）。');
  }
}

export async function readTalentSearchGeekList(page: Page): Promise<TalentSearchItem[]> {
  const list = await frameEval(
    page,
    `(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cards = Array.from(document.querySelectorAll(".card-list .geek-info-card"));
    return cards.map((item) => {
      const name = norm(item.querySelector(".name .name-label")?.textContent);
      const active = norm(item.querySelector(".name .active-desc-text")?.textContent);
      const labels = Array.from(item.querySelectorAll(".info-labels .label-text"))
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      const desc = norm(item.querySelector(".info-detail")?.textContent);
      const tags = Array.from(item.querySelectorAll(".info-tags:not(.info-tags-measure) .info-tags-item"))
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      const expects = Array.from(item.querySelectorAll(".geek-words-edus li"))
        .map((el) => {
          // 剔除 tooltip 的隐藏副本节点，否则公司/院校文本会重复一遍
          const clone = el.cloneNode(true);
          clone.querySelectorAll(".t-tooltip-content").forEach((n) => n.remove());
          return norm(clone.textContent);
        })
        .filter(Boolean);
      return {
        name,
        active,
        meta: labels.join(" · "),
        desc,
        tags: [...new Set(tags)],
        expects,
      };
    }).filter((x) => x.name);
  })()`,
    6_000,
  );
  return Array.isArray(list) ? (list as TalentSearchItem[]) : [];
}

function renderTalentSearchList(header: string, items: TalentSearchItem[]): string {
  const lines: string[] = [header, `共 ${items.length} 人（仅第一页；姓名为平台打码，建立沟通后可见）`, ''];
  items.forEach((g, i) => {
    const n = i + 1;
    lines.push(`${n}. ${g.name}${g.active ? `（${g.active}）` : ''}`);
    if (g.meta) {
      lines.push(`   信息：${g.meta}`);
    }
    if (g.desc) {
      lines.push(`   简介：${g.desc}`);
    }
    if (g.tags.length > 0) {
      lines.push(`   标签：${g.tags.join(' / ')}`);
    }
    if (g.expects.length > 0) {
      lines.push(`   期望/背景：${g.expects.join(' ｜ ')}`);
    }
    lines.push('');
  });
  return lines.join('\n').trimEnd();
}

async function readGreetBtnText(page: Page, i: number): Promise<string | null> {
  const t = await frameEval(
    page,
    `((() => {
      const card = Array.from(document.querySelectorAll(".card-list .geek-info-card"))[${i - 1}];
      const btn = card ? card.querySelector("button.position-rights, button[class*=position-rights]") : null;
      return btn ? (btn.textContent ?? "").replace(/\\s+/g, " ").trim() : null;
    })())`,
    4_000,
  );
  return typeof t === 'string' ? t : null;
}

async function clickGreetOnCard(page: Page, i: number): Promise<{ ok: boolean; msg: string }> {
  const before = await readGreetBtnText(page, i);
  if (before === null) {
    return { ok: false, msg: '卡片或沟通按钮消失' };
  }
  if (before.includes('已沟通') || before.includes('继续')) {
    return { ok: true, msg: `已沟通过(${before})` };
  }
  const clicked = await frameEval(
    page,
    `((() => {
      const card = Array.from(document.querySelectorAll(".card-list .geek-info-card"))[${i - 1}];
      const btn = card ? card.querySelector("button.position-rights, button[class*=position-rights]") : null;
      if (!btn) return false;
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return true;
    })())`,
    4_000,
  );
  if (clicked !== true) {
    return { ok: false, msg: '点击沟通按钮失败' };
  }
  // 效果校验：按钮应变为「继续沟通/已沟通」或额度递减；不变视为可疑（弹层/风控/额度用尽）
  await sleepRandom(1200, 2000);
  const after = await readGreetBtnText(page, i);
  const changed = after !== null && after !== before;
  return {
    ok: changed,
    msg: changed ? `已发起沟通(${before} -> ${after})` : `点击后状态未变(${before})，疑似弹层/风控/额度问题`,
  };
}

async function scanTalentSearchCards(page: Page): Promise<GreetCardScan[]> {
  const scan = await frameEval(
    page,
    `((() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const cards = Array.from(document.querySelectorAll(".card-list .geek-info-card"));
      return cards.map((card, idx) => {
        const name = norm(card.querySelector(".name .name-label")?.textContent);
        const labels = Array.from(card.querySelectorAll(".info-labels .label-text")).map((e) => norm(e.textContent));
        return { i: idx + 1, name, meta: labels.join(" · ") };
      });
    })())`,
    6_000,
  );
  return Array.isArray(scan) ? (scan as GreetCardScan[]) : [];
}

/** 对本次结果按序号点「立即沟通」；逐个点击、随机间隔，点后校验状态，连续 2 次无效果自动中止（防弹层/风控空转）。 */
async function greetTalentSearch(page: Page, indexes: number[]): Promise<GreetCardResult[]> {
  const scan = await scanTalentSearchCards(page);
  const byIndex = new Map(scan.map((c) => [c.i, c]));
  const targets = indexes.map((i) => byIndex.get(i)).filter((c): c is GreetCardScan => Boolean(c));
  const results: GreetCardResult[] = [];
  let consecutiveFailures = 0;
  for (const c of targets) {
    const clicked = await clickGreetOnCard(page, c.i);
    results.push({ ...c, ...clicked });
    consecutiveFailures = clicked.ok ? 0 : consecutiveFailures + 1;
    if (consecutiveFailures >= 2) {
      // 连续失败大概率是弹层/风控/额度用尽，止损：剩余目标不再点击
      const remaining = targets.slice(targets.indexOf(c) + 1);
      for (const r of remaining) {
        results.push({ ...r, ok: false, msg: '中止:连续 2 次点击无效果，剩余目标未执行' });
      }
      break;
    }
    await sleepRandom(1800, 3200);
  }
  return results;
}

function renderGreetResults(results: GreetCardResult[]): string {
  const lines = ['', '打招呼结果（人才库搜索页）：'];
  for (const r of results) {
    lines.push(`  #${r.i} ${r.name || ''}${r.meta ? ' | ' + r.meta : ''} -> ${r.ok ? '✅' : '❌'} ${r.msg}`);
  }
  return lines.join('\n');
}

export async function runTalentSearch(opts: {
  keywords?: string;
  jobKeyword?: string;
  greetIndexes?: number[];
}): Promise<string> {
  const keywords = (opts.keywords ?? '').trim();
  const jobKeyword = (opts.jobKeyword ?? '').trim();
  if (!keywords && !jobKeyword) {
    throw new Error('请至少提供搜索关键词或 --job 岗位关键字。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      await clickBossSidebarMenuToPath(page, '搜索', BOSS_CHAT_SEARCH_PATH);
      await waitForSearchReady(page);
      let jobLabel = '';
      let marker = await readResultsMarker(page);
      if (jobKeyword) {
        jobLabel = await selectTalentSearchJob(page, jobKeyword);
        await waitForResultsChange(page, marker, 12_000);
        await waitForSearchReady(page);
        marker = await readResultsMarker(page);
      }
      if (keywords) {
        await fillKeywordAndSearch(page, keywords);
        await waitForResultsChange(page, marker);
        await waitForSearchReady(page);
      }
      const items = await readTalentSearchGeekList(page);
      const parts: string[] = [];
      if (jobLabel) {
        parts.push(`职位：${jobLabel}`);
      }
      if (keywords) {
        parts.push(`关键词：${keywords}`);
      }
      const header = `人才库搜索结果（${parts.join('｜') || '默认条件'}）`;
      if (items.length === 0) {
        return [header, '未读取到结果：可能确实无人匹配，或结果区 DOM 有变（先用浏览器确认页面上是否有人）。'].join('\n');
      }
      const listOut = renderTalentSearchList(header, items);
      if (opts.greetIndexes && opts.greetIndexes.length > 0) {
        const greetResults = await greetTalentSearch(page, opts.greetIndexes);
        return listOut + '\n' + renderGreetResults(greetResults);
      }
      return listOut;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] talent_search error: ${message}`);
    throw new Error(`人才库搜索失败：${message}`);
  }
}
