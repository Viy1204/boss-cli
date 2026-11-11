import { randomUUID } from 'node:crypto';
import { TimeoutError } from 'puppeteer-core';
import { JOB_SEARCH_ACTION_GAP_MS, JOB_SELECT_ACTION_GAP_MS, RESUME_PREVIEW_OPEN_GAP_MS, sleepRandom, } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { ensurePage } from '../common/ensure_page.js';
const BOSS_CHAT_RECOMMEND_URL = 'https://www.zhipin.com/web/chat/recommend';
/** 会话内记录：通过 greet 新出现的推荐卡片（以 geekId 识别） */
const sessionGreetProducedGeekIds = new Set();
const RECOMMEND_CARD_ROOT_SELECTOR = '.candidate-card-wrap:not(.anonymous-geek-guide-card)';
const RECOMMEND_SNAPSHOT_MAX_AGE_MS = 15 * 60 * 1000;
const CANDIDATE_LISTS = {
    recommend: {
        label: '推荐', command: 'recommend', path: '/web/chat/recommend',
        frame: 'recommendFrame', framePath: '/web/frame/recommend', snapshot: '__bossCliRecommendSnapshot',
        root: RECOMMEND_CARD_ROOT_SELECTOR,
    },
    favorites: {
        label: '收藏', command: 'favorite --list', path: '/web/chat/interaction',
        frame: 'interactionFrame', framePath: '/web/frame/recommend/interaction', snapshot: '__bossCliFavoriteSnapshot',
        root: '.candidate-card-wrap',
    },
};
const CANDIDATE_COMPONENT_SCRIPT = `
  const candidateComponent = card => {
    const root = card.__vue__;
    const owners = [root, ...(root?.$children ?? [])].filter(component =>
      component?.$options?.name === "RecommendCandidateCard" && component.$el === card);
    if (owners.length > 1) throw new Error("候选卡片对应多个身份组件；停止操作。");
    return owners[0] ?? null;
  };
  const candidateId = card => {
    const id = candidateComponent(card)?.$props?.geekInfo?.encryptGeekId;
    return typeof id === "string" ? id.trim() : "";
  };
`;
export const FAVORITE_LIST_STATE_SCRIPT = `(() => {
  ${CANDIDATE_COMPONENT_SCRIPT}
  const topWindow = window.top;
  if (topWindow.location.origin !== "https://www.zhipin.com" || topWindow.location.pathname.replace(/\\/+$/, "") !== "/web/chat/interaction") throw new Error("主页面已离开收藏入口；停止读取。");
  const visible = el => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    for (let node = el; node; node = node.parentElement) {
      const style = topWindow.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    }
    return true;
  };
  const frames = Array.from(topWindow.document.querySelectorAll('iframe[name="interactionFrame"]')).filter(visible);
  if (frames.length !== 1 || frames[0].contentDocument !== document) throw new Error("当前收藏 frame 绑定已变化；停止读取。");
  if (!document.querySelector('li.tab-item[title="收藏牛人"].curr')) return { ready: false };
  const view = document.querySelector(".list-wrap.card-list-wrap")?.__vue__?.$props;
  const pageList = document.querySelector(".card-list")?.__vue__?.$props?.pageList;
  if (!view || !Array.isArray(pageList)) return { ready: false };
  if (view.error !== false) throw new Error("平台收藏列表加载出错；未读取成功。");
  if (view.loading !== false) return { ready: false };
  if (typeof view.finished !== "boolean") throw new Error("无法识别收藏列表加载状态。");
  const cards = Array.from(document.querySelectorAll(".candidate-card-wrap"));
  const components = cards.map(candidateComponent);
  if (components.some(component => !component) || cards.some(card => !candidateId(card))) return { ready: false };
  if (components.some(component => component.$props.status !== 9)) throw new Error("当前列表并非收藏牛人；停止操作。");
  if (cards.length !== pageList.length) return { ready: false };
  if (cards.length === 0 && !view.finished) return { ready: false };
  return {
    ready: true, finished: view.finished,
    signature: JSON.stringify([view.finished, cards.map(card => [candidateId(card), card.textContent])]),
  };
})()`;
function candidateReaderScript(source) {
    const list = CANDIDATE_LISTS[source];
    return `
  ${CANDIDATE_COMPONENT_SCRIPT}
  const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
  const readIdentity = item => {
    const geekId = candidateId(item);
    if (!geekId) throw new Error(${JSON.stringify(`${list.label}候选人缺少可核对平台标识；停止操作。`)});
    const timeline = selector => Array.from(item.querySelectorAll(selector)).map(row => {
      const time = Array.from(row.querySelectorAll(".join-text-wrap.time span")).map(el => norm(el.textContent)).filter(Boolean).join("-");
      const content = Array.from(row.querySelectorAll(".join-text-wrap.content span")).map(el => norm(el.textContent)).filter(Boolean).join(" · ");
      return [time, content].filter(Boolean).join(" ");
    }).filter(Boolean).join("；");
    const work = timeline(".work-exps .timeline-item");
    const education = timeline(".edu-exps .timeline-item");
    return {
      geekId,
      name: norm(item.querySelector(".name-wrap .name")?.textContent) || norm(item.querySelector(".name")?.textContent),
      salary: norm(item.querySelector(".salary-wrap span")?.textContent),
      baseInfo: Array.from(item.querySelectorAll(".base-info span")).map(el => norm(el.textContent)).filter(Boolean).join(" / "),
      expect: norm(item.querySelector(".expect-wrap .content")?.textContent) || norm(item.querySelector(".expect-wrap .join-text-wrap")?.textContent),
      experience: [work ? "工作: " + work : "", education ? "教育: " + education : ""].filter(Boolean).join(" | "),
      advantage: norm(item.querySelector(".geek-desc .content")?.textContent),
      highlights: [
        ...Array.from(item.querySelectorAll(".operate .labels .label")),
        ...Array.from(item.querySelectorAll(".tags-wrap .tag-item")),
      ].map(el => norm(el.textContent)).filter(Boolean),
    };
  };
`;
}
function candidateSnapshotScript(source, validateList = true) {
    const list = CANDIDATE_LISTS[source];
    return `
    ${candidateReaderScript(source)}
    const snapshot = window[${JSON.stringify(list.snapshot)}];
    if (!snapshot || typeof snapshot.id !== "string" || !snapshot.id) throw new Error(${JSON.stringify(`缺少${list.label}列表快照或快照标识；请先执行 boss ${list.command}。`)});
    if (Date.now() - snapshot.createdAt > ${RECOMMEND_SNAPSHOT_MAX_AGE_MS}) throw new Error(${JSON.stringify(`${list.label}列表快照已超过 15 分钟；请重新执行 boss ${list.command}。`)});
    const currentJob = norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent);
    if (currentJob !== snapshot.job) throw new Error(${JSON.stringify(`${list.label}岗位已变化；请重新执行 boss ${list.command}。`)});
    ${source === 'favorites' ? `
      if (!document.querySelector('li.tab-item[title="收藏牛人"].curr')) throw new Error("当前已离开收藏牛人标签；请重新执行 boss favorite --list。");
      ${validateList ? `
        const state = ${FAVORITE_LIST_STATE_SCRIPT};
        if (!state.ready) throw new Error("收藏列表尚未就绪；停止操作。");
      ` : ''}
    ` : ''}
    const cards = Array.from(document.querySelectorAll(${JSON.stringify(list.root)}));
    ${validateList ? `
      if (cards.length !== snapshot.cards.length || cards.some((card, index) =>
        card !== snapshot.cards[index] || JSON.stringify(readIdentity(card)) !== snapshot.fingerprints[index])) {
        throw new Error(${JSON.stringify(`${list.label}列表与快照身份、资料或顺序不一致；请重新执行 boss ${list.command}。`)});
      }
    ` : ''}
  `;
}
export function validatedCandidateListSelectionScript(selection, validateList = true) {
    const list = CANDIDATE_LISTS[selection.source];
    return `
    const topWindow = window.top;
    if (topWindow.location.origin !== "https://www.zhipin.com" || topWindow.location.pathname.replace(/\\/+$/, "") !== ${JSON.stringify(list.path)}) {
      throw new Error("主页面已离开原候选列表；停止操作。");
    }
    const frames = Array.from(topWindow.document.querySelectorAll(${JSON.stringify(`iframe[name="${list.frame}"]`)})).filter(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      for (let node = el; node; node = node.parentElement) {
        const style = topWindow.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      }
      return true;
    });
    if (frames.length !== 1) throw new Error("当前可见候选列表 frame 绑定已变化；停止操作。");
    const listDocument = frames[0].contentDocument;
    if (!listDocument || (window !== topWindow && listDocument !== document)) throw new Error("候选列表 frame 与原目标失去绑定；停止操作。");
    (() => {
      const document = listDocument;
      const window = listDocument.defaultView;
      ${candidateSnapshotScript(selection.source, validateList)}
      if (snapshot.id !== ${JSON.stringify(selection.snapshotId)}) throw new Error("候选列表快照已更换；停止操作。");
      ${validateList ? `
        const picked = snapshot.cards[${selection.index - 1}];
        const identity = picked && readIdentity(picked);
        if (!identity || identity.name !== ${JSON.stringify(selection.name)} || identity.geekId !== ${JSON.stringify(selection.geekId)}) throw new Error("候选人身份已变化；停止操作。");
      ` : ''}
    })();
    const expectedId = ${JSON.stringify(selection.geekId)};
  `;
}
export function isBossChatRecommendUrl(url) {
    try {
        const u = new URL(url);
        if (!u.hostname.includes('zhipin.com')) {
            return false;
        }
        const p = u.pathname.replace(/\/+$/, '') || '/';
        return p === '/web/chat/recommend';
    }
    catch {
        return false;
    }
}
export async function getCandidateListFrame(page, source) {
    const list = CANDIDATE_LISTS[source];
    const timeoutMs = 18_000;
    const iframe = await page.waitForSelector(`iframe[name="${list.frame}"]`, {
        timeout: timeoutMs,
    });
    if (!iframe) {
        throw new Error(`未找到${list.label} iframe（iframe[name="${list.frame}"]）。`);
    }
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const frame = await iframe.contentFrame();
        const frameUrl = frame?.url();
        if (frame && frameUrl) {
            let currentUrl;
            try {
                currentUrl = new URL(frameUrl);
            }
            catch (error) {
                throw new Error(`${list.label} iframe 的 frame URL 无效：${frameUrl}；无法确认 ${list.framePath}。`, { cause: error });
            }
            if (currentUrl.pathname.replace(/\/+$/, '') === list.framePath)
                return frame;
        }
        await sleepRandom(120, 220);
    }
    const iframeSrc = (await page.evaluate(`(() => document.querySelector(${JSON.stringify(`iframe[name="${list.frame}"]`)})?.getAttribute("src") ?? "")()`));
    const frameUrls = page.frames().map((f) => f.url()).join(' | ');
    throw new Error(`已检测到${list.label} iframe，但无法获取其页面上下文。iframe src：${iframeSrc || 'unknown'}；frames：${frameUrls || 'empty'}`);
}
async function ensureRecommendFrameReady(frame) {
    await frame.waitForFunction(`(() => {
      const sel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
      if (document.querySelector(sel)) return true;
      const root = document.querySelector(".card-list, .geek-list-wrap .geek-list");
      return !!root;
    })()`, { timeout: 18_000, polling: 100 });
}
async function readCurrentRecommendJobLabel(frame) {
    return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    return norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent);
  })()`));
}
async function waitForRecommendJobDropdownReady(frame) {
    await frame.waitForFunction(`(() => {
      const options = document.querySelector(".job-selecter-options");
      if (!(options instanceof HTMLElement)) return false;
      const rect = options.getBoundingClientRect();
      const style = window.getComputedStyle(options);
      if (rect.width <= 0 || rect.height <= 0 || style.display === "none" || style.visibility === "hidden") {
        return false;
      }
      return !!options.querySelector(".top-chat-search .chat-job-search");
    })()`, { timeout: 8_000, polling: 100 });
}
async function waitForRecommendJobSearchResults(frame, keyword) {
    // 关键词内联，不能走入参：字符串 pageFunction 收不到，判据恒为真、等待变空转。详见 AGENTS.md。
    await frame.waitForFunction(`(() => {
      const kw = ${JSON.stringify(keyword)};
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
      const rows = Array.from(document.querySelectorAll(".job-selecter-options .job-list .job-item"));
      if (rows.length === 0) return false;
      if (!kw) return true;
      return rows.some((el) => {
        const label = norm(el.querySelector(".label")?.textContent || el.textContent || "");
        return label.includes(norm(kw));
      });
    })()`, { timeout: 10_000, polling: 100 });
}
async function waitForRecommendJobSelected(frame, expectedLabel) {
    await frame.waitForFunction(`(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const current = norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent);
      return !!current && current === ${JSON.stringify(expectedLabel)};
    })()`, { timeout: 10_000, polling: 100 });
    await ensureRecommendFrameReady(frame);
}
export async function selectRecommendJob(frame, keyword) {
    const kw = keyword.trim();
    if (!kw) {
        return readCurrentRecommendJobLabel(frame);
    }
    const kwLiteral = JSON.stringify(kw);
    const opened = (await frame.evaluate(`(() => {
    const host = document.querySelector(".job-selecter-wrap .ui-dropmenu-label");
    if (!(host instanceof HTMLElement)) return false;
    host.scrollIntoView({ block: "center", inline: "nearest" });
    host.click();
    return true;
  })()`));
    if (!opened) {
        throw new Error('未找到岗位下拉入口（.job-selecter-wrap .ui-dropmenu-label）。');
    }
    await sleepRandom(JOB_SELECT_ACTION_GAP_MS.min, JOB_SELECT_ACTION_GAP_MS.max);
    await waitForRecommendJobDropdownReady(frame);
    const searched = (await frame.evaluate(`(() => {
    const kw = ${kwLiteral};
    const input = document.querySelector(".job-selecter-options .top-chat-search .chat-job-search");
    if (!(input instanceof HTMLInputElement)) return false;
    input.focus();
    input.value = kw;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`));
    if (!searched) {
        throw new Error('已打开岗位下拉，但未找到职位搜索框（.chat-job-search）。');
    }
    await sleepRandom(JOB_SEARCH_ACTION_GAP_MS.min, JOB_SEARCH_ACTION_GAP_MS.max);
    await waitForRecommendJobSearchResults(frame, kw);
    const picked = (await frame.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const rows = Array.from(document.querySelectorAll(".job-selecter-options .job-list .job-item"));
    if (rows.length === 0) return { ok: false, reason: "empty" };
    const target = rows.find((el) => {
      const label = norm(el.querySelector(".label")?.textContent || el.textContent || "");
      return label.includes(norm(kw));
    });
    if (!(target instanceof HTMLElement)) return { ok: false, reason: "not_found" };
    const label = (target.querySelector(".label")?.textContent ?? target.textContent ?? "")
      .replace(/\\s+/g, " ")
      .trim();
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label };
  })()`));
    if (!picked.ok) {
        throw new Error(`未找到匹配岗位“${kw}”。`);
    }
    const label = picked.label ?? kw;
    await sleepRandom(JOB_SELECT_ACTION_GAP_MS.min, JOB_SELECT_ACTION_GAP_MS.max);
    await waitForRecommendJobSelected(frame, label);
    return label;
}
export async function ensureInRecommendPage(page) {
    let stage = '进入 /web/chat/recommend';
    try {
        await ensurePage(page, {
            name: '推荐列表页',
            targetUrl: BOSS_CHAT_RECOMMEND_URL,
            matches: isBossChatRecommendUrl,
        });
        stage = '获取推荐 iframe';
        const frame = await getCandidateListFrame(page, 'recommend');
        stage = '推荐列表就绪';
        await ensureRecommendFrameReady(frame);
        return frame;
    }
    catch (error) {
        if (!(error instanceof TimeoutError))
            throw error;
        throw new Error(`recommend 初始化超时（阶段：${stage}；当前页面：${page.url()}）。${error.message}\n请先在浏览器中确认登录和验证状态，再显式执行 boss reload；主壳刷新成功后重新执行原 boss recommend 命令。`, { cause: error });
    }
}
/**
 * 供 `preview` 使用：不导航；若当前主页面不在推荐页或未就绪推荐 iframe，直接抛错。
 */
export async function assertRecommendPageReady(page, actionName) {
    if (!isBossChatRecommendUrl(page.url())) {
        throw new Error(`当前不在推荐列表页（/web/chat/recommend），无法${actionName}。`);
    }
    const frame = await getCandidateListFrame(page, 'recommend');
    await ensureRecommendFrameReady(frame);
    return frame;
}
export async function assertRecommendPageReadyForPreview(page) {
    return assertRecommendPageReady(page, '预览候选人');
}
export async function readRecommendList(frame, source = 'recommend') {
    const list = CANDIDATE_LISTS[source];
    return (await frame.evaluate(`(async () => {
    delete window[${JSON.stringify(list.snapshot)}];
    ${candidateReaderScript(source)}
    let cards = Array.from(document.querySelectorAll(${JSON.stringify(list.root)}));
    ${source === 'recommend' ? `
      const deadline = Date.now() + 18_000;
      while (true) {
        const view = document.querySelector(".list-wrap.card-list-wrap")?.__vue__?.$props;
        if (view?.error === true) throw new Error("推荐列表加载出错；未创建快照。");
        const missingId = cards.map(candidateId).some(id => !id);
        const emptyPending = cards.length === 0 && view?.finished !== true;
        if (view?.loading !== true && !emptyPending && !missingId) break;
        if (Date.now() >= deadline) throw new Error("推荐列表数据或候选人平台标识未在预期时间内就绪；未创建快照。");
        await new Promise(resolve => setTimeout(resolve, 100));
        cards = Array.from(document.querySelectorAll(${JSON.stringify(list.root)}));
      }
    ` : ''}
    const identities = cards.map(readIdentity);
    if (identities.some(item => !item.name)) throw new Error(${JSON.stringify(`${list.label}候选人缺少姓名；无法创建列表快照。`)});
    if (new Set(identities.map(item => item.geekId)).size !== identities.length) throw new Error(${JSON.stringify(`${list.label}候选人平台标识重复；无法创建列表快照。`)});
    ${source === 'favorites' ? `
      const state = ${FAVORITE_LIST_STATE_SCRIPT};
      const settled = window.__bossCliFavoriteRead;
      if (!state.ready || !settled || settled.signature !== state.signature || Date.now() - settled.since < 500) throw new Error("收藏列表尚未稳定；未创建快照。");
      delete window.__bossCliFavoriteRead;
    ` : ''}
    const candidates = cards.map((item, index) => {
      const inner = item.querySelector(".card-inner");
      const greetBtn = item.querySelector(".button-chat-wrap .btn.btn-greet");
      const disabled = !greetBtn || /disabled|forbid|ban/i.test(greetBtn.className ?? "") || greetBtn.getAttribute("disabled") !== null;
      const hasHistoryChat = !!item.querySelector(".tooltip-wrap.chat-history .icon-chat-history") ||
        Array.from(item.querySelectorAll("use")).some(u => {
          const href = u.getAttribute("href") ?? u.getAttributeNS("http://www.w3.org/1999/xlink", "href") ?? "";
          return href.includes("icon-chat-history");
        });
      return {
        ...identities[index], index: index + 1,
        highlights: [...new Set(identities[index].highlights)],
        canGreet: !disabled,
        hasHistoryChat,
        hasViewed: item.classList.contains("has-viewed") || inner.classList.contains("has-viewed"),
      };
    });
    window[${JSON.stringify(list.snapshot)}] = {
      id: ${JSON.stringify(randomUUID())}, createdAt: Date.now(), cards,
      job: norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent),
      fingerprints: identities.map(item => JSON.stringify(item)),
    };
    return candidates;
  })()`));
}
export function renderRecommendList(candidates) {
    if (candidates.length === 0) {
        return '推荐列表为空。';
    }
    const greetProduced = [];
    const normal = [];
    candidates.forEach((c) => {
        if (c.geekId && sessionGreetProducedGeekIds.has(c.geekId)) {
            greetProduced.push(c);
        }
        else {
            normal.push(c);
        }
    });
    const renderItems = (title, items) => {
        const lines = [];
        lines.push(`${title}（${items.length}）`);
        if (items.length === 0) {
            lines.push('  - 暂无');
            return lines;
        }
        items.forEach((m) => {
            const advantageText = m.advantage ||
                (m.highlights.length > 0 ? m.highlights.slice(0, 3).join(' / ') : '（无）');
            const fields = [
                m.salary ? `薪资:${m.salary}` : '',
                m.baseInfo ? `信息:${m.baseInfo}` : '',
                m.expect ? `期望:${m.expect}` : '',
                m.experience ? `经历:${m.experience}` : '',
                m.hasHistoryChat ? '同事沟通过' : '',
                m.canGreet ? '可打招呼' : '已打招呼',
            ]
                .filter(Boolean)
                .join('｜');
            const nameWithViewed = m.hasViewed ? `${m.name} | 看过` : m.name;
            lines.push(`  - ${m.index}. ${nameWithViewed}｜${fields}`);
            lines.push(`    优势: ${advantageText}`);
        });
        return lines;
    };
    const out = [];
    out.push(`推荐列表（按来源分组）：共 ${candidates.length} 人。`);
    out.push('');
    out.push(...renderItems('常规推荐', normal));
    out.push('');
    out.push(...renderItems('打招呼产生的推荐', greetProduced));
    return out.join('\n');
}
export async function clickGreet(frame, target) {
    const targetLiteral = JSON.stringify(target.trim());
    const result = (await frame.evaluate(`(() => {
      const raw = ${targetLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const cardSel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
      const cards = Array.from(document.querySelectorAll(cardSel));
      if (cards.length === 0) {
        return { kind: "empty" };
      }
      const targetCard = cards.find((item) => {
        const name =
          norm(item.querySelector(".name-wrap .name")?.textContent) ||
          norm(item.querySelector(".name")?.textContent);
        return name === raw || name.includes(raw);
      }) ?? null;
      if (!targetCard) {
        return { kind: "not_found", target: raw };
      }

      const name =
        norm(targetCard.querySelector(".name-wrap .name")?.textContent) ||
        norm(targetCard.querySelector(".name")?.textContent);
      const inner = targetCard.querySelector(".card-inner") || targetCard;
      const geekId =
        inner?.getAttribute("data-geekid") ??
        inner?.getAttribute("data-geek") ??
        "";
      const btn = targetCard.querySelector(".button-chat-wrap .btn.btn-greet");
      if (!(btn instanceof HTMLElement)) {
        return { kind: "no_btn", name };
      }
      const cls = btn.className ?? "";
      const disabled = /disabled|forbid|ban/i.test(cls) || btn.getAttribute("disabled") !== null;
      if (disabled) {
        return { kind: "disabled", name };
      }
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { kind: "clicked", name, geekId };
    })()`));
    switch (result.kind) {
        case 'empty':
            throw new Error('推荐列表为空，无法执行打招呼。');
        case 'not_found':
            throw new Error(`未在推荐列表中找到目标：${result.target}`);
        case 'no_btn':
            throw new Error(`候选人 ${result.name} 缺少“打招呼”按钮，无法执行。`);
        case 'disabled':
            throw new Error(`候选人 ${result.name} 已打招呼。`);
        case 'clicked':
            return {
                message: `已对 ${result.name} 点击“打招呼”。`,
            };
        default: {
            const _x = result;
            throw new Error(`未知结果：${String(_x)}`);
        }
    }
}
export function markGreetProduced(before, after) {
    const beforeIds = new Set(before.map((x) => x.geekId).filter(Boolean));
    after.forEach((x) => {
        if (x.geekId && !beforeIds.has(x.geekId)) {
            sessionGreetProducedGeekIds.add(x.geekId);
        }
    });
}
export async function openRecommendResumePreview(frame, target, index) {
    const selected = await openCandidateListResumeDetail(frame, target, index);
    return { name: selected.name, index: selected.index };
}
export async function openCandidateListResumeDetail(frame, target, index, source = 'recommend') {
    const list = CANDIDATE_LISTS[source];
    const selected = (await frame.evaluate(`(() => {
    ${candidateSnapshotScript(source)}
    const raw = ${JSON.stringify(target.trim())};
    const matches = card => raw && readIdentity(card).name.includes(raw);
    let index = ${JSON.stringify(index ?? null)};
    if (index !== null) {
      if (!Number.isSafeInteger(index) || index < 1 || index > cards.length) throw new Error(${JSON.stringify(`${list.label}快照中没有此序号。`)});
      if (raw && !matches(cards[index - 1])) throw new Error("--index 与候选人姓名不匹配；未点击候选人。");
    } else {
      const hits = cards.map((card, i) => matches(card) ? i + 1 : null).filter(i => i !== null);
      if (hits.length !== 1) throw new Error(${JSON.stringify(`${list.label}列表姓名没有唯一匹配；请核对后用 --index 指定。`)});
      index = hits[0];
    }
    const identity = readIdentity(cards[index - 1]);
    return { source: ${JSON.stringify(source)}, snapshotId: snapshot.id, name: identity.name, geekId: identity.geekId, index };
  })()`));
    await frame.evaluate(`(() => {
    ${validatedCandidateListSelectionScript(selected)}
    const targetCard = window[${JSON.stringify(list.snapshot)}].cards[${selected.index - 1}];
    const inner = targetCard.querySelector(".card-inner");
    if (!(inner instanceof HTMLElement)) throw new Error("候选人缺少简历入口 .card-inner；未点击。");
    const style = window.getComputedStyle(inner);
    if (inner.classList.contains("disabled") || style.pointerEvents === "none" || Number(style.opacity) < 0.3) throw new Error("候选人简历入口不可用；未点击。");
    inner.scrollIntoView({ block: "center", inline: "nearest" });
    (() => { ${validatedCandidateListSelectionScript(selected)} })();
    if (targetCard.querySelector(".card-inner") !== inner) throw new Error("候选人简历入口已变化；未点击。");
    inner.click();
  })()`);
    await sleepRandom(RESUME_PREVIEW_OPEN_GAP_MS.min, RESUME_PREVIEW_OPEN_GAP_MS.max);
    return selected;
}
export async function runRecommend(jobKeyword) {
    try {
        return await withBossSessionPage(async (page) => {
            const frame = await ensureInRecommendPage(page);
            const selectedJob = await selectRecommendJob(frame, (jobKeyword ?? '').trim());
            const candidates = await readRecommendList(frame);
            const title = selectedJob ? `当前岗位：${selectedJob}` : '当前岗位：默认';
            return [title, '', renderRecommendList(candidates)].join('\n');
        });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        throw new Error(`读取推荐列表失败：${message}`, { cause: e });
    }
}
//# sourceMappingURL=recommend.js.map