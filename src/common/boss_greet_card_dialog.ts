import type { Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/timing.js';

/**
 * 搜索池（/web/chat/search）点「畅聊卡 N/M」后弹出的确认弹层。
 *
 * 实测形态（2026-08-07，Boss 现网）：
 * - 渲染在**顶层 document**（不在 `iframe[name=searchFrame]` 里），根节点 `.common-job-list-dialog`
 *   （完整 class：`boss-popup__wrapper boss-dialog boss-dialog__wrapper common-job-list-dialog`），
 *   内层 `.job-list-dialog-main-ui`，外层还有个 `.dialog-wrap.active`。
 * - 标题「选择该牛人开聊职位」，副标题「畅聊卡可用于全部在线职位开聊，请放心激活」。
 * - 职位候选是 `.select-list li`，当前选中项带 `.active`；`boss search --job` 选过的岗位会被预选中。
 * - 底部两个按钮：`button.boss-btn-outline`（文案「取消」）与
 *   `button.boss-btn-primary`（文案「搜索畅聊卡(3/13)」——**不再是旧版的「沟通/确定」**，
 *   0.6.0 补丁里 `/沟通|确定/` 的正则因此匹配不到，是搜索池打招呼失效的直接原因之一）。
 *
 * 点「取消」后弹层消失、卡片按钮文案不变，不消耗畅聊卡额度。
 */
const DIALOG_ROOT_SELECTOR = '.common-job-list-dialog, .job-list-dialog-main-ui';

const DIALOG_WAIT_POLL_MS = { min: 220, max: 420 } as const;
const SEARCH_POOL_SNAPSHOT_MAX_AGE_MS = 15 * 60 * 1000;

export const SEARCH_CANDIDATE_READER_SCRIPT = `
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const unique = (items) => Array.from(new Set(items.map(norm).filter(Boolean)));
  const readExperience = el => {
    const fields = Array.from(el.querySelectorAll(".date, .t-tooltip-slot"));
    if (norm(el.textContent) && fields.length === 0) throw new Error("经历语义槽位已变化；无法完整核对资料，停止操作。");
    return fields.map(node => norm(node.textContent)).filter(Boolean).join(" ");
  };
  const candidateId = card => {
    const id = card.__vue__?.$props?.geek?.geekCard?.encryptGeekId;
    if (typeof id !== "string" || !id.trim()) throw new Error("缺少可核对的平台候选人标识 encryptGeekId；停止操作。");
    return id;
  };
  const readCandidate = (card) => ({
    candidateId: candidateId(card),
    name: norm(card.querySelector(".name-label")?.textContent),
    active: norm(card.querySelector(".active-desc-text")?.textContent),
    labels: unique(Array.from(card.querySelectorAll(".card-label")).map(el => el.textContent)),
    basicInfo: norm(card.querySelector(".info-labels")?.textContent),
    summary: norm(card.querySelector(".info-detail")?.textContent),
    tags: unique(Array.from(card.querySelectorAll(".info-tags:not(.info-tags-measure) .info-tags-item")).map(el => el.textContent)),
    expectation: norm(card.querySelector(".expect-exp-box")?.textContent),
    work: Array.from(card.querySelectorAll(".work-exp-box .work-exp-item")).map(readExperience).filter(Boolean),
    education: Array.from(card.querySelectorAll(".edu-exp-box li")).map(readExperience).filter(Boolean).join("；"),
    reason: norm(card.querySelector(".recommend-reason")?.textContent),
  });
`;

export const VALIDATE_SEARCH_SNAPSHOT_SCRIPT = `
  ${SEARCH_CANDIDATE_READER_SCRIPT}
  const snapshot = searchWindow.__bossCliSearchSnapshot;
  if (!snapshot) throw new Error("缺少搜索快照；请先重新执行 boss search。未点击沟通按钮。");
  if (Date.now() - snapshot.createdAt > ${SEARCH_POOL_SNAPSHOT_MAX_AGE_MS}) {
    throw new Error("搜索快照已超过 15 分钟；请重新执行 boss search。");
  }
  const cards = Array.from(searchDocument.querySelectorAll(".geek-info-card"));
  if (cards.length !== snapshot.cards.length || cards.some((card, i) =>
      card !== snapshot.cards[i] || JSON.stringify(readCandidate(card)) !== snapshot.fingerprints[i])) {
    throw new Error("搜索快照与当前列表身份或顺序不一致；请重新执行 boss search。未继续沟通或确认。");
  }
`;

export type SearchPoolSelection = { snapshotId: string; frameBinding: string; index: number; name: string };

export function validatedSearchSelectionScript(selection: SearchPoolSelection): string {
  return `
    const topWindow = window.top;
    if (topWindow.location.origin !== "https://www.zhipin.com" || topWindow.location.pathname.replace(/\\/+$/, "") !== "/web/chat/search") {
      throw new Error("主页面已离开搜索页；未继续沟通或确认。");
    }
    const searchFrames = Array.from(topWindow.document.querySelectorAll('iframe[name="searchFrame"]')).filter(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      for (let node = el; node; node = node.parentElement) {
        const style = topWindow.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      }
      return true;
    });
    if (searchFrames.length !== 1) throw new Error("当前可见搜索 frame 绑定已变化；未继续沟通或确认。");
    const searchDocument = searchFrames[0].contentDocument;
    const searchWindow = searchDocument?.defaultView;
    if (!searchWindow || searchWindow.__bossCliSearchFrameBinding !== ${JSON.stringify(selection.frameBinding)} ||
        (window !== topWindow && searchDocument !== document)) {
      throw new Error("当前搜索 frame 与原目标失去绑定；未继续沟通或确认。");
    }
    ${VALIDATE_SEARCH_SNAPSHOT_SCRIPT}
    if (snapshot.id !== ${JSON.stringify(selection.snapshotId)}) throw new Error("搜索快照已更换；未继续沟通或确认。");
    const pickedIndex = ${selection.index} - 1;
    const picked = snapshot.cards[pickedIndex];
    if (!picked || readCandidate(picked).name !== ${JSON.stringify(selection.name)}) throw new Error("候选人身份已变化；未继续沟通或确认。");
  `;
}

export type GreetCardDialogState = {
  present: boolean;
  title: string;
  /** 弹层内可选职位；`active` 为当前选中项 */
  jobs: Array<{ index: number; name: string; detail: string; active: boolean }>;
  activeJob: string;
  /** 确认按钮文案，形如「搜索畅聊卡(3/13)」 */
  confirmLabel: string;
  cancelLabel: string;
  /** 当前可见弹层全文，用于明确的权益不足提示。 */
  text: string;
  confirmDisabled: boolean;
};

const READ_DIALOG_SCRIPT = `(() => {
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const isVisible = (el) => {
    if (!(el instanceof HTMLElement)) return false;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 40 && r.height > 40;
  };
  const dlg = Array.from(document.querySelectorAll(${JSON.stringify(DIALOG_ROOT_SELECTOR)})).find(isVisible);
  if (!dlg) return { present: false, title: "", jobs: [], activeJob: "", confirmLabel: "", cancelLabel: "", text: "", confirmDisabled: true };
  const jobs = Array.from(dlg.querySelectorAll(".select-list li")).map((li, i) => ({
    index: i + 1,
    name: norm(li.querySelector("h3")?.textContent),
    detail: norm(li.querySelector("h3 + div")?.textContent),
    active: (li.className || "").split(/\\s+/).indexOf("active") !== -1,
  }));
  const buttons = Array.from(dlg.querySelectorAll("button"));
  const confirm = buttons.find((b) => (b.className || "").includes("boss-btn-primary"));
  const cancel = buttons.find((b) => (b.className || "").includes("boss-btn-outline"))
    || buttons.find((b) => norm(b.textContent) === "取消");
  return {
    present: true,
    title: norm(dlg.querySelector("h3")?.textContent),
    jobs,
    activeJob: (jobs.find((j) => j.active) || {}).name || "",
    confirmLabel: norm(confirm?.textContent),
    cancelLabel: norm(cancel?.textContent),
    text: (dlg.innerText ?? "").trim(),
    confirmDisabled: !confirm || confirm.disabled || confirm.getAttribute("aria-disabled") === "true" || /disabled|forbid|ban/i.test(confirm.className || ""),
  };
})()`;

export async function readGreetCardDialog(page: Page): Promise<GreetCardDialogState> {
  return (await page.evaluate(READ_DIALOG_SCRIPT)) as GreetCardDialogState;
}

/**
 * 弹层容器会先挂上、职位列表与按钮再异步渲染（实测有 1s 量级的空窗）。
 * 只判 `present` 会读到半成品（jobs 为空、按钮读不到，连「取消」都点不着），所以要等内容齐。
 */
function isDialogReady(state: GreetCardDialogState): boolean {
  return state.present && state.confirmLabel.length > 0 && (state.jobs.length > 0 || state.confirmDisabled);
}

/** 轮询等待弹层出现并渲染完；超时返回最后一次读到的状态。 */
export async function waitForGreetCardDialog(
  page: Page,
  timeoutMs: number,
): Promise<GreetCardDialogState> {
  const deadline = Date.now() + timeoutMs;
  let last = await readGreetCardDialog(page);
  while (Date.now() < deadline) {
    if (isDialogReady(last)) {
      return last;
    }
    await sleepRandom(DIALOG_WAIT_POLL_MS.min, DIALOG_WAIT_POLL_MS.max);
    last = await readGreetCardDialog(page);
  }
  return last;
}

/** 在弹层内按关键字模糊选职位；不传或没匹配上时保持平台预选项不动。 */
export async function selectGreetCardDialogJob(page: Page, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    return (await readGreetCardDialog(page)).activeJob;
  }
  // 注意：page.evaluate 传字符串时是「求值表达式」，额外参数会被忽略，
  // 所以关键字必须内联成字面量，不能靠 evaluate 的 args 传进去。
  const kwLiteral = JSON.stringify(kw);
  const picked = (await page.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const dlg = Array.from(document.querySelectorAll(${JSON.stringify(DIALOG_ROOT_SELECTOR)})).find(el => {
      if (!(el instanceof HTMLElement)) return false;
      const st = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) >= 0.05 && r.width > 40 && r.height > 40;
    });
    if (!dlg) return null;
    const li = Array.from(dlg.querySelectorAll(".select-list li"))
      .find((el) => norm(el.querySelector("h3")?.textContent).includes(norm(kw)));
    if (!(li instanceof HTMLElement)) return null;
    li.scrollIntoView({ block: "center", inline: "nearest" });
    li.click();
    return (li.querySelector("h3")?.textContent ?? "").replace(/\\s+/g, " ").trim();
  })()`)) as string | null;
  if (picked === null) {
    throw new Error(`打招呼弹层内未找到匹配职位“${kw}”。`);
  }
  await sleepRandom(260, 520);
  return picked;
}

/**
 * 点「取消」关闭弹层，不消耗畅聊卡。返回是否点到了取消按钮。
 * 按钮可能还没渲染出来，轮询重试到 timeoutMs 为止。
 */
export async function cancelGreetCardDialog(page: Page, timeoutMs = 5_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const clicked = (await page.evaluate(`(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const dlg = Array.from(document.querySelectorAll(${JSON.stringify(DIALOG_ROOT_SELECTOR)})).find(el => {
      if (!(el instanceof HTMLElement)) return false;
      const st = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) >= 0.05 && r.width > 40 && r.height > 40;
    });
      if (!dlg) return "gone";
      const btn = Array.from(dlg.querySelectorAll("button"))
        .find((b) => (b.className || "").includes("boss-btn-outline") || norm(b.textContent) === "取消");
      if (!(btn instanceof HTMLElement)) return "no_btn";
      btn.click();
      return "clicked";
    })()`)) as 'gone' | 'no_btn' | 'clicked';
    if (clicked === 'clicked') {
      await sleepRandom(500, 900);
      return true;
    }
    // 弹层本来就不在，视为已关闭
    if (clicked === 'gone') {
      return true;
    }
    if (Date.now() >= deadline) {
      return false;
    }
    await sleepRandom(DIALOG_WAIT_POLL_MS.min, DIALOG_WAIT_POLL_MS.max);
  }
}

/**
 * 点确认按钮（`button.boss-btn-primary`，文案「搜索畅聊卡(N/M)」）真正发出招呼。
 * ⚠️ 不可逆：会消耗一张搜索畅聊卡。仅在调用方已明确要发起沟通时调用。
 */
export async function confirmGreetCardDialog(page: Page, expected?: GreetCardDialogState, searchSelection?: SearchPoolSelection): Promise<boolean> {
  const clicked = (await page.evaluate(`(() => {
    ${searchSelection ? validatedSearchSelectionScript(searchSelection) : ''}
    const dlg = Array.from(document.querySelectorAll(${JSON.stringify(DIALOG_ROOT_SELECTOR)})).find(el => {
      if (!(el instanceof HTMLElement)) return false;
      const st = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) >= 0.05 && r.width > 40 && r.height > 40;
    });
    if (!dlg) return false;
    const btn = Array.from(dlg.querySelectorAll("button"))
      .find((b) => (b.className || "").includes("boss-btn-primary"));
    if (!(btn instanceof HTMLElement) || btn.disabled || btn.getAttribute("aria-disabled") === "true"
      || /disabled|forbid|ban/i.test(btn.className || "")) return false;
    const expected = ${JSON.stringify(expected ?? null)};
    if (expected) {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      if (norm(btn.textContent) !== expected.confirmLabel
        || norm(dlg.querySelector("h3")?.textContent) !== expected.title
        || norm(dlg.querySelector(".select-list li.active h3")?.textContent) !== expected.activeJob
        || norm(dlg.innerText) !== norm(expected.text)) return false;
    }
    btn.click();
    return true;
  })()`)) as boolean;
  if (clicked) {
    await sleepRandom(900, 1500);
  }
  return clicked;
}

export function renderGreetCardDialog(state: GreetCardDialogState): string {
  if (!state.present) {
    return '未检测到「搜索畅聊卡」确认弹层。';
  }
  const lines = [
    `弹层：${state.title || '选择该牛人开聊职位'}`,
    `当前选中职位：${state.activeJob || '（未选中）'}`,
    `按钮：[${state.cancelLabel || '取消'}] [${state.confirmLabel || '确认'}]`,
  ];
  if (state.jobs.length > 0) {
    lines.push('可选职位：');
    state.jobs.forEach((j) => {
      lines.push(`  ${j.active ? '●' : '○'} ${j.index}. ${j.name}${j.detail ? `｜${j.detail}` : ''}`);
    });
  }
  return lines.join('\n');
}
