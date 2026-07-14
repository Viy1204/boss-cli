import process from 'node:process';
import type { Page } from 'puppeteer-core';
import {
  JOB_SEARCH_ACTION_GAP_MS,
  JOB_SELECT_ACTION_GAP_MS,
  RESUME_PREVIEW_OPEN_GAP_MS,
  selectAllModifierKey,
  sleepRandom,
} from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { ensurePage } from '../common/ensure_page.js';

const BOSS_CHAT_AI_FORM_URL = 'https://www.zhipin.com/web/chat/aiform';

type SearchFormSnapshot = {
  selectedJob: string;
  coreRequirements: string[];
  bonusRequirements: string[];
  remainingCountText: string;
  remainingCount: number | null;
  matchButtonText: string;
  matchButtonDisabled: boolean;
};

export type DeepSearchGeekItem = {
  name: string;
  meta: string;
  work: string;
  edu: string;
  reason: string;
};

export type BossSearchOptions = {
  jobKeyword?: string;
  coreRequirements?: string[];
  bonusRequirements?: string[];
  match?: boolean;
};

export function isBossChatAiFormUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/aiform';
  } catch {
    return false;
  }
}

async function waitForAiFormReady(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => {
      const root = document.querySelector(".ai-form-left");
      const submit = document.querySelector(".ai-form-match-footer .btn-ai-match-v2");
      const selected = document.querySelector(".job-dropmenu-select .job-main-text");
      if (!root || !submit || !selected) {
        return false;
      }
      const text = (selected.textContent ?? "").replace(/\\s+/g, " ").trim();
      return text.length > 0;
    })()`,
    { timeout: 18_000 },
  );
}

export async function ensureInDeepSearchPage(page: Page): Promise<void> {
  if (!isBossChatAiFormUrl(page.url())) {
    throw new Error('当前不在深度搜索页（/web/chat/aiform），请先通过侧栏进入「深度搜索」。');
  }
  await waitForAiFormReady(page);
}

async function ensureDeepSearchPageReady(page: Page): Promise<void> {
  await ensurePage(page, {
    name: '深度搜索页',
    targetUrl: BOSS_CHAT_AI_FORM_URL,
    matches: isBossChatAiFormUrl,
  });
  await waitForAiFormReady(page);
}

async function clickAddConditionInSection(page: Page, titleKeyword: string): Promise<void> {
  const titleLiteral = JSON.stringify(titleKeyword);
  const clicked = (await page.evaluate(`((titleKeyword) => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function findFormSectionByTitle(kw) {
      const h3s = Array.from(document.querySelectorAll(".form-content .form-content-title-h3"));
      const h3 = h3s.find((el) => norm(el.textContent).includes(kw));
      return h3 ? h3.closest(".form-content") : null;
    }
    const section = findFormSectionByTitle(titleKeyword);
    if (!section) return false;
    const header = section.querySelector(".form-content-header");
    const titleBtn = header?.querySelector(".form-content-title-btn");
    if (!(titleBtn instanceof HTMLElement)) return false;
    if (!norm(titleBtn.textContent).includes("添加条件")) return false;
    titleBtn.scrollIntoView({ block: "center", inline: "nearest" });
    titleBtn.click();
    return true;
  })(${titleLiteral})`)) as boolean;
  if (!clicked) {
    throw new Error(`未找到「${titleKeyword}」区域的「添加条件」。`);
  }
  await sleepRandom(280, 520);
}

/** 等待指定区块内第 idx 行已出现在 DOM 中（岗位切换等可能导致列表晚于表单壳渲染）。 */
async function waitForRequirementRowPresent(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 5000,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const list = section.querySelector('.form-content-list');
        if (!list) return false;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        return !!items[idx].querySelector('.form-content-list-item-title');
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

/** 深度搜索条件行：Boss 用 `.form-content-word` 展示文案（挂载很快，超时不宜过长）。 */
async function waitForFormContentWordInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 1000,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const list = section.querySelector('.form-content-list');
        if (!list) return false;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        return !!items[idx].querySelector('.form-content-word');
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

function normFormText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/** 校验用：优先读 `.auto-resize-textarea-wrapper` 内 textarea/input，再读其它 input、最后 `.form-content-word`。 */
async function readRowRequirementShownText(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
): Promise<string> {
  return page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return '';
      const list = section.querySelector('.form-content-list');
      if (!list) return '';
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return '';
      const row = items[idx];
      const wrap = row.querySelector('.auto-resize-textarea-wrapper');
      if (wrap) {
        const ta = wrap.querySelector('textarea, input');
        if (ta instanceof HTMLTextAreaElement) {
          return norm(ta.value);
        }
        if (ta instanceof HTMLInputElement && ta.type !== 'hidden') {
          return norm(ta.value);
        }
      }
      const scope = row.querySelector('.form-content-list-item-content') ?? row;
      const inp = scope.querySelector('input, textarea');
      if (inp instanceof HTMLInputElement && inp.type !== 'hidden') {
        return norm(inp.value);
      }
      if (inp instanceof HTMLTextAreaElement) {
        return norm(inp.value);
      }
      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      return norm(word?.textContent ?? '');
    },
    titleKeyword,
    rowIndex,
  );
}

/** 点击行内 `.form-content-list-item-content`，Boss 会在内部挂载 `.auto-resize-textarea-wrapper` + textarea。 */
async function clickFormContentListItemContent(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const items = section.querySelectorAll('.form-content-list .form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const content = row.querySelector('.form-content-list-item-content');
      if (!(content instanceof HTMLElement)) return false;
      content.scrollIntoView({ block: 'center', inline: 'nearest' });
      content.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      content.click();
      return true;
    },
    titleKeyword,
    rowIndex,
  );
}

async function waitForAutoResizeTextareaInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 1800,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        const row = items[idx];
        const wrap = row.querySelector('.auto-resize-textarea-wrapper');
        if (!wrap) return false;
        const ta = wrap.querySelector('textarea, input');
        if (ta instanceof HTMLTextAreaElement) return true;
        if (ta instanceof HTMLInputElement && ta.type !== 'hidden' && ta.type !== 'button' && ta.type !== 'submit') {
          return true;
        }
        return false;
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

async function fillAutoResizeTextareaInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, val: string): void {
        const tracker = (el as unknown as { _valueTracker?: { setValue: (x: string) => void } })._valueTracker;
        if (tracker && typeof tracker.setValue === 'function') {
          tracker.setValue('');
        }
        const proto =
          el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc?.set) {
          desc.set.call(el, val);
        } else {
          el.value = val;
        }
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const items = section.querySelectorAll('.form-content-list .form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const wrap = row.querySelector('.auto-resize-textarea-wrapper');
      if (!wrap) return false;
      const el = wrap.querySelector('textarea, input');
      if (!(el instanceof HTMLTextAreaElement) && !(el instanceof HTMLInputElement)) return false;
      if (el instanceof HTMLInputElement && (el.type === 'hidden' || el.type === 'button' || el.type === 'submit')) {
        return false;
      }
      el.focus();
      setNativeValue(el, v);
      el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, data: v }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      const titleWrap = row.querySelector('.form-content-list-item-title');
      titleWrap?.classList.remove('error');
      el.blur();
      return true;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/** 用视口坐标点击 `.form-content-word` 中心，确保焦点落在真实文案节点上（比 programatic focus 更稳）。 */
async function clickFormContentWordCenter(page: Page, titleKeyword: string, rowIndex: number): Promise<boolean> {
  const pos = await page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return null;
      const list = section.querySelector('.form-content-list');
      if (!list) return null;
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return null;
      const row = items[idx];
      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (!(word instanceof HTMLElement)) return null;
      word.scrollIntoView({ block: 'center', inline: 'nearest' });
      const r = word.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    titleKeyword,
    rowIndex,
  );
  if (!pos || !(pos.x > 0 && pos.y > 0)) {
    return false;
  }
  await page.mouse.click(pos.x, pos.y);
  return true;
}

async function tryFillRowViaDomEvaluate(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const list = section.querySelector('.form-content-list');
      if (!list) return false;
      const items = list.querySelectorAll('.form-content-list-item');
      const row = items[idx];
      if (!row) return false;
      row.scrollIntoView({ block: 'center', inline: 'nearest' });

      const scope = row.querySelector('.form-content-list-item-content') ?? row;
      function walkInput(root: Element | ShadowRoot): HTMLInputElement | HTMLTextAreaElement | null {
        const direct = root.querySelectorAll('input, textarea');
        for (let i = 0; i < direct.length; i++) {
          const el = direct[i];
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') continue;
            return el;
          }
        }
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.shadowRoot) {
            const f = walkInput(el.shadowRoot);
            if (f) return f;
          }
        }
        return null;
      }
      const inp = walkInput(scope);
      if (inp) {
        const tracker = (inp as unknown as { _valueTracker?: { setValue: (x: string) => void } })._valueTracker;
        if (tracker && typeof tracker.setValue === 'function') tracker.setValue('');
        const proto =
          inp instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc?.set) desc.set.call(inp, v);
        else inp.value = v;
        inp.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, data: v }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (word instanceof HTMLElement) {
        word.focus();
        word.click();
        try {
          document.execCommand('selectAll', false);
          document.execCommand('insertText', false, v);
        } catch {
          /* 由外层 CDP/键盘兜底 */
        }
        return true;
      }
      return false;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/** 必须与目标文案一致（规范化空白后）；不用 includes，避免整段终端/回显误匹配。 */
function wordTextMatchesExpected(shown: string, expected: string): boolean {
  return normFormText(shown) === normFormText(expected);
}

/**
 * 直接改 DOM：文案在 `.form-content-list-item-title` > `.form-content-word` 内，无原生 input。
 * 同步写 inner 文本并向外层派发 input/change，并尝试去掉 error 态 class。
 */
async function setFormContentWordDirect(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const list = section.querySelector('.form-content-list');
      if (!list) return false;
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const titleWrap = row.querySelector('.form-content-list-item-title');
      let word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (!(word instanceof HTMLElement)) {
        if (titleWrap instanceof HTMLElement) {
          word = document.createElement('div');
          word.className = 'form-content-word';
          titleWrap.appendChild(word);
        } else {
          return false;
        }
      }
      word.textContent = v;
      if (titleWrap instanceof HTMLElement) {
        titleWrap.classList.remove('error');
      }
      function fire(el: Element): void {
        try {
          el.dispatchEvent(
            new InputEvent('input', { bubbles: true, composed: true, data: v, inputType: 'insertText' }),
          );
        } catch {
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      fire(word);
      if (titleWrap instanceof HTMLElement) {
        fire(titleWrap);
      }
      return true;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/**
 * 在区块内按行下标写入一条条件（有内容则直接覆盖）。
 * Boss：先点 `.form-content-list-item-content`，再填 `.auto-resize-textarea-wrapper` 内 textarea；失败再改 word div / 键盘。
 */
async function fillRowAtIndexInSection(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  text: string,
): Promise<boolean> {
  const rowPresent = await waitForRequirementRowPresent(page, titleKeyword, rowIndex);
  if (!rowPresent) {
    return false;
  }

  const contentClicked = await clickFormContentListItemContent(page, titleKeyword, rowIndex);
  let clickedIndex = rowIndex;
  if (!contentClicked) {
    clickedIndex = await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        function findFormSectionByTitle(keyword: string): HTMLElement | null {
          const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
          const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(keyword));
          const section = h3 ? h3.closest('.form-content') : null;
          if (!section?.querySelector('.form-content-list')) {
            return null;
          }
          return section as HTMLElement;
        }
        const section = findFormSectionByTitle(kw);
        if (!section) return -1;
        const list = section.querySelector('.form-content-list');
        if (!list) return -1;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return -1;
        const row = items[idx];
        const titleEl = row.querySelector('.form-content-list-item-title');
        if (!(titleEl instanceof HTMLElement)) return -1;
        titleEl.scrollIntoView({ block: 'center', inline: 'nearest' });
        titleEl.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window }),
        );
        titleEl.click();
        return idx;
      },
      titleKeyword,
      rowIndex,
    );
    if (clickedIndex < 0) {
      return false;
    }
  }

  await sleepRandom(120, 280);

  const tryVerify = async (): Promise<boolean> => {
    await sleepRandom(40, 100);
    const shown = await readRowRequirementShownText(page, titleKeyword, clickedIndex);
    return wordTextMatchesExpected(shown, text);
  };

  let hasAutoResize = await waitForAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, 1800);
  if (!hasAutoResize && contentClicked) {
    await clickFormContentListItemContent(page, titleKeyword, clickedIndex);
    await sleepRandom(80, 160);
    hasAutoResize = await waitForAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, 1200);
  }
  if (hasAutoResize) {
    await fillAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, text);
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const wrap = row?.querySelector('.auto-resize-textarea-wrapper');
        const ta = wrap?.querySelector('textarea, input');
        if (ta instanceof HTMLElement) {
          ta.focus();
          ta.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(50, 120);
    await fillAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, text);
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  let hasWord = await waitForFormContentWordInRow(page, titleKeyword, clickedIndex, 2000);
  if (!hasWord) {
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const list = section.querySelector('.form-content-list');
        if (!list) return;
        const items = list.querySelectorAll('.form-content-list-item');
        const row = items[idx];
        const titleEl = row?.querySelector('.form-content-list-item-title');
        if (titleEl instanceof HTMLElement) {
          titleEl.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
          titleEl.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(120, 240);
    hasWord = await waitForFormContentWordInRow(page, titleKeyword, clickedIndex, 1200);
  }

  if (await setFormContentWordDirect(page, titleKeyword, clickedIndex, text)) {
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
  );
  if (await setFormContentWordDirect(page, titleKeyword, clickedIndex, text)) {
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  await tryFillRowViaDomEvaluate(page, titleKeyword, clickedIndex, text);
  if (await tryVerify()) {
    await page.keyboard.press('Tab').catch(() => {});
    return true;
  }

  if (hasWord) {
    await clickFormContentWordCenter(page, titleKeyword, clickedIndex);
    await sleepRandom(60, 120);
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const word =
          row?.querySelector('.form-content-list-item-title .form-content-word') ||
          row?.querySelector('.form-content-word');
        if (word instanceof HTMLElement) {
          word.focus();
        }
      },
      titleKeyword,
      clickedIndex,
    );
  } else {
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const titleEl = row?.querySelector('.form-content-list-item-title');
        if (titleEl instanceof HTMLElement) {
          titleEl.scrollIntoView({ block: 'center', inline: 'nearest' });
          titleEl.focus();
          titleEl.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(60, 100);
  }

  const selectAllMod = selectAllModifierKey();
  await page.keyboard.down(selectAllMod);
  await page.keyboard.press('KeyA');
  await page.keyboard.up(selectAllMod);
  await sleepRandom(40, 80);
  await page.keyboard.type(text, { delay: 12 });
  await page.keyboard.press('Tab');
  await sleepRandom(50, 100);

  if (await tryVerify()) {
    return true;
  }

  return false;
}

/**
 * 每条条件按顺序对应第 0、1、2… 行：有行则覆盖内容；行不够则点「添加条件」再填。
 */
async function applyLinesToSection(page: Page, titleKeyword: string, lines: string[]): Promise<void> {
  let processed = 0;
  let nextRowIndex = 0;
  for (const raw of lines) {
    const text = raw.trim();
    if (!text) {
      continue;
    }
    let ok = await fillRowAtIndexInSection(page, titleKeyword, nextRowIndex, text);
    if (!ok) {
      await clickAddConditionInSection(page, titleKeyword);
      ok = await fillRowAtIndexInSection(page, titleKeyword, nextRowIndex, text);
    }
    if (!ok) {
      throw new Error(
        `「${titleKeyword}」第 ${processed + 1} 条条件无法填入（该区块无可用行或「添加条件」后仍失败）。`,
      );
    }
    processed += 1;
    nextRowIndex += 1;
  }
}

async function ensureRequirementGroupRow(page: Page, titleKeyword: string, rowIndex: number): Promise<void> {
  const titleLiteral = JSON.stringify(titleKeyword);
  for (let round = 0; round < 5; round++) {
    const state = (await page.evaluate(`(() => {
      const titleKeyword = ${titleLiteral};
      const rowIndex = ${rowIndex};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      function getGroup(title) {
        const headers = Array.from(document.querySelectorAll(".form-content-header"));
        const header = headers.find((el) => {
          const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
          return h.includes(title);
        });
        if (!(header instanceof HTMLElement)) return null;
        let node = header.nextElementSibling;
        while (node && !node.classList.contains("form-content-header")) {
          if (node.classList.contains("form-content-list")) return { header, list: node };
          node = node.nextElementSibling;
        }
        return null;
      }
      const group = getGroup(titleKeyword);
      if (!group) return { ok: false, reason: "missing_group", count: 0, x: 0, y: 0 };
      const count = group.list.querySelectorAll(".form-content-list-item").length;
      if (count > rowIndex) return { ok: true, count, x: 0, y: 0 };
      const add = group.header.querySelector(".form-content-title-btn");
      if (!(add instanceof HTMLElement)) return { ok: false, reason: "missing_add_button", count, x: 0, y: 0 };
      const disabled =
        add.getAttribute("aria-disabled") === "true" ||
        add.classList.contains("disabled") ||
        add.classList.contains("is-disabled");
      if (disabled) return { ok: false, reason: "add_button_disabled", count, x: 0, y: 0 };
      add.scrollIntoView({ block: "center", inline: "nearest" });
      const rect = add.getBoundingClientRect();
      return { ok: true, count, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`)) as { ok: boolean; reason?: string; count: number; x: number; y: number };
    if (!state.ok) {
      throw new Error(`未找到「${titleKeyword}」分组或添加条件按钮：${state.reason ?? 'unknown'}`);
    }
    if (state.count > rowIndex) {
      return;
    }
    await page.keyboard.press('Tab').catch(() => {});
    await sleepRandom(80, 140);
    await page.mouse.click(state.x, state.y);
    try {
      await page.waitForFunction(
        `(() => {
          const titleKeyword = ${titleLiteral};
          const rowIndex = ${rowIndex};
          const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
          const headers = Array.from(document.querySelectorAll(".form-content-header"));
          const header = headers.find((el) => {
            const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
            return h.includes(titleKeyword);
          });
          if (!header) return false;
          let node = header.nextElementSibling;
          while (node && !node.classList.contains("form-content-header")) {
            if (node.classList.contains("form-content-list")) {
              return node.querySelectorAll(".form-content-list-item").length > rowIndex;
            }
            node = node.nextElementSibling;
          }
          return false;
        })()`,
        { timeout: 1600 },
      );
      return;
    } catch {
      await sleepRandom(180, 260);
    }
  }
  throw new Error(`「${titleKeyword}」第 ${rowIndex + 1} 条条件未能创建。`);
}

async function fillRequirementGroupRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  const titleLiteral = JSON.stringify(titleKeyword);
  const valueLiteral = JSON.stringify(value);
  const clicked = (await page.evaluate(`(() => {
    const titleKeyword = ${titleLiteral};
    const rowIndex = ${rowIndex};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function getList(title) {
      const headers = Array.from(document.querySelectorAll(".form-content-header"));
      const header = headers.find((el) => {
        const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
        return h.includes(title);
      });
      if (!header) return null;
      let node = header.nextElementSibling;
      while (node && !node.classList.contains("form-content-header")) {
        if (node.classList.contains("form-content-list")) return node;
        node = node.nextElementSibling;
      }
      return null;
    }
    const list = getList(titleKeyword);
    const row = list?.querySelectorAll(".form-content-list-item")[rowIndex];
    if (!(row instanceof HTMLElement)) return false;
    const target =
      row.querySelector('[contenteditable="true"].auto-resize-textarea, [contenteditable="true"]') ||
      row.querySelector(".form-content-list-item-content, .form-content-list-item-title") ||
      row;
    if (!(target instanceof HTMLElement)) return false;
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return true;
  })()`)) as boolean;
  if (!clicked) {
    return false;
  }
  await sleepRandom(120, 220);

  const selectAllMod = selectAllModifierKey();
  await page.keyboard.down(selectAllMod);
  await page.keyboard.press('KeyA');
  await page.keyboard.up(selectAllMod);
  await sleepRandom(40, 80);
  await page.keyboard.type(value, { delay: 12 });
  await page.keyboard.press('Tab');
  await sleepRandom(120, 220);

  const typedShown = (await page.evaluate(`(() => {
    const titleKeyword = ${titleLiteral};
    const rowIndex = ${rowIndex};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function getList(title) {
      const headers = Array.from(document.querySelectorAll(".form-content-header"));
      const header = headers.find((el) => {
        const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
        return h.includes(title);
      });
      if (!header) return null;
      let node = header.nextElementSibling;
      while (node && !node.classList.contains("form-content-header")) {
        if (node.classList.contains("form-content-list")) return node;
        node = node.nextElementSibling;
      }
      return null;
    }
    const list = getList(titleKeyword);
    const row = list?.querySelectorAll(".form-content-list-item")[rowIndex];
    if (!(row instanceof HTMLElement)) return "";
    const word = row.querySelector(".form-content-word");
    const editable = row.querySelector('[contenteditable="true"]');
    const rowInput = row.querySelector("textarea, input");
    if (word && norm(word.textContent)) return norm(word.textContent);
    if (editable && norm(editable.textContent)) return norm(editable.textContent);
    if (rowInput && norm(rowInput.value)) return norm(rowInput.value);
    return norm(row.textContent);
  })()`)) as string;
  if (normFormText(typedShown) === normFormText(value)) {
    return true;
  }

  const shown = (await page.evaluate(`(() => {
    const titleKeyword = ${titleLiteral};
    const rowIndex = ${rowIndex};
    const value = ${valueLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function getList(title) {
      const headers = Array.from(document.querySelectorAll(".form-content-header"));
      const header = headers.find((el) => {
        const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
        return h.includes(title);
      });
      if (!header) return null;
      let node = header.nextElementSibling;
      while (node && !node.classList.contains("form-content-header")) {
        if (node.classList.contains("form-content-list")) return node;
        node = node.nextElementSibling;
      }
      return null;
    }
    function setNativeValue(el, val) {
      const tracker = el._valueTracker;
      if (tracker && typeof tracker.setValue === "function") tracker.setValue("");
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, "value");
      if (desc?.set) desc.set.call(el, val);
      else el.value = val;
    }
    function fire(el) {
      try {
        el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, data: value, inputType: "insertText" }));
      } catch {
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const list = getList(titleKeyword);
    const row = list?.querySelectorAll(".form-content-list-item")[rowIndex];
    if (!(row instanceof HTMLElement)) return "";
    const editable = row.querySelector('[contenteditable="true"]');
    let input = row.querySelector("textarea, input");
    if (input instanceof HTMLInputElement && (input.type === "hidden" || input.type === "button" || input.type === "submit")) {
      input = null;
    }
    if (editable instanceof HTMLElement) {
      editable.focus();
      editable.textContent = value;
      fire(editable);
      editable.blur();
    } else if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.focus();
      setNativeValue(input, value);
      fire(input);
      input.blur();
    } else {
      const title = row.querySelector(".form-content-list-item-title");
      if (!(title instanceof HTMLElement)) return "";
      let word = title.querySelector(".form-content-word");
      if (!(word instanceof HTMLElement)) {
        word = document.createElement("div");
        word.className = "form-content-word";
        title.appendChild(word);
      }
      word.textContent = value;
      title.classList.remove("error");
      fire(word);
      fire(title);
    }
    fire(row);
    fire(list);
    const word = row.querySelector(".form-content-word");
    const shownEditable = row.querySelector('[contenteditable="true"]');
    const rowInput = row.querySelector("textarea, input");
    if (word && norm(word.textContent)) return norm(word.textContent);
    if (shownEditable && norm(shownEditable.textContent)) return norm(shownEditable.textContent);
    if (rowInput && norm(rowInput.value)) return norm(rowInput.value);
    return norm(row.textContent);
  })()`)) as string;

  return normFormText(shown) === normFormText(value);
}

async function readRequirementGroupRowCount(page: Page, titleKeyword: string): Promise<number> {
  const titleLiteral = JSON.stringify(titleKeyword);
  return (await page.evaluate(`(() => {
    const titleKeyword = ${titleLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const headers = Array.from(document.querySelectorAll(".form-content-header"));
    const header = headers.find((el) => {
      const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
      return h.includes(titleKeyword);
    });
    if (!header) return -1;
    let node = header.nextElementSibling;
    while (node && !node.classList.contains("form-content-header")) {
      if (node.classList.contains("form-content-list")) {
        return node.querySelectorAll(".form-content-list-item").length;
      }
      node = node.nextElementSibling;
    }
    return -1;
  })()`)) as number;
}

async function removeRequirementGroupRowsAfter(
  page: Page,
  titleKeyword: string,
  desiredCount: number,
): Promise<void> {
  const titleLiteral = JSON.stringify(titleKeyword);
  for (let count = await readRequirementGroupRowCount(page, titleKeyword); count > desiredCount; count -= 1) {
    if (count < 0) {
      throw new Error(`未找到「${titleKeyword}」分组。`);
    }
    const targetIndex = count - 1;
    const pos = (await page.evaluate(`(() => {
      const titleKeyword = ${titleLiteral};
      const targetIndex = ${targetIndex};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const headers = Array.from(document.querySelectorAll(".form-content-header"));
      const header = headers.find((el) => {
        const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
        return h.includes(titleKeyword);
      });
      if (!header) return null;
      let node = header.nextElementSibling;
      while (node && !node.classList.contains("form-content-header")) {
        if (node.classList.contains("form-content-list")) {
          const row = node.querySelectorAll(".form-content-list-item")[targetIndex];
          const btn = row?.querySelector(".form-content-list-item-btn");
          if (!(btn instanceof HTMLElement)) return null;
          btn.scrollIntoView({ block: "center", inline: "nearest" });
          const rect = btn.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        node = node.nextElementSibling;
      }
      return null;
    })()`)) as { x: number; y: number } | null;
    if (!pos) {
      throw new Error(`「${titleKeyword}」第 ${targetIndex + 1} 条条件未找到删除按钮。`);
    }
    await page.mouse.click(pos.x, pos.y);
    await page.waitForFunction(
      `(() => {
        const titleKeyword = ${titleLiteral};
        const expectedCount = ${targetIndex};
        const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
        const headers = Array.from(document.querySelectorAll(".form-content-header"));
        const header = headers.find((el) => {
          const h = norm(el.querySelector(".form-content-title-h3")?.textContent);
          return h.includes(titleKeyword);
        });
        if (!header) return false;
        let node = header.nextElementSibling;
        while (node && !node.classList.contains("form-content-header")) {
          if (node.classList.contains("form-content-list")) {
            const items = Array.from(node.querySelectorAll(".form-content-list-item"));
            if (items.length === expectedCount) return true;
            if (expectedCount === 0 && items.length === 1) {
              const item = items[0];
              const word = norm(item.querySelector(".form-content-word")?.textContent);
              const input = norm(item.querySelector("input, textarea")?.value);
              const editable = norm(item.querySelector('[contenteditable="true"]')?.textContent);
              return !word && !input && !editable;
            }
            return false;
          }
          node = node.nextElementSibling;
        }
        return false;
      })()`,
      { timeout: 1800 },
    );
  }
}

async function applyLinesToRequirementGroup(page: Page, titleKeyword: string, lines: string[]): Promise<void> {
  let nextRowIndex = 0;
  for (const raw of lines) {
    const text = raw.trim();
    if (!text) {
      continue;
    }
    await ensureRequirementGroupRow(page, titleKeyword, nextRowIndex);
    const ok = await fillRequirementGroupRow(page, titleKeyword, nextRowIndex, text);
    if (!ok) {
      throw new Error(`「${titleKeyword}」第 ${nextRowIndex + 1} 条条件未能写入：${text}`);
    }
    nextRowIndex += 1;
  }
  await removeRequirementGroupRowsAfter(page, titleKeyword, nextRowIndex);
}

async function applyAiFormRequirementLists(
  page: Page,
  opts: { core?: string[]; bonus?: string[] },
): Promise<void> {
  if (opts.core !== undefined) {
    await applyLinesToRequirementGroup(page, '核心要求', opts.core);
  }
  if (opts.bonus !== undefined) {
    await applyLinesToRequirementGroup(page, '加分项', opts.bonus);
  }
}

async function readSearchFormSnapshot(page: Page): Promise<SearchFormSnapshot> {
  return (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function parseCount(text) {
      const m = String(text || "").match(/\\d+/);
      return m ? Number(m[0]) : null;
    }
    function getGroupList(titleKeyword) {
      const headers = Array.from(document.querySelectorAll(".form-content-header"));
      const header = headers.find((el) => {
        const title = norm(el.querySelector(".form-content-title-h3")?.textContent);
        return title.includes(titleKeyword);
      });
      if (!header) return null;
      let node = header.nextElementSibling;
      while (node && !node.classList.contains("form-content-header")) {
        if (node.classList.contains("form-content-list")) return node;
        node = node.nextElementSibling;
      }
      return null;
    }
    function itemLineText(item, groupTitle) {
      const word = item.querySelector(".form-content-word");
      const w = word ? norm(word.textContent) : "";
      if (w) return w;
      const inp = item.querySelector("input, textarea");
      if (inp && norm(inp.value)) return norm(inp.value);
      const ce = item.querySelector("[contenteditable='true']");
      if (ce) return norm(ce.textContent);
      const titleEl = item.querySelector(".form-content-list-item-title");
      const title = titleEl ? norm(titleEl.textContent) : "";
      if (!title) return "";
      if (title.includes("请至少输入") || title.includes("可输入")) return "";
      if (groupTitle && title.includes(groupTitle)) return "";
      return title;
    }
    function readGroup(titleKeyword) {
      const list = getGroupList(titleKeyword);
      if (!list) return [];
      return Array.from(list.querySelectorAll(".form-content-list-item"))
        .map((item) => itemLineText(item, titleKeyword))
        .filter(Boolean);
    }
    const selectedJob = norm(document.querySelector(".job-dropmenu-select .job-main-text")?.textContent);
    const remainingCountText = norm(document.querySelector(".ai-form-match-footer-text-count")?.textContent);
    const btn = document.querySelector(".ai-form-match-footer .btn-ai-match-v2");
    const btnText = norm(btn?.textContent);
    let matchButtonDisabled = true;
    if (btn instanceof HTMLElement) {
      const cls = String(btn.className || "");
      const style = getComputedStyle(btn);
      matchButtonDisabled =
        btn.getAttribute("disabled") !== null ||
        /disabled|forbid|ban/i.test(cls) ||
        style.pointerEvents === "none" ||
        Number(style.opacity) < 0.3;
    }
    return {
      selectedJob,
      coreRequirements: readGroup("核心要求"),
      bonusRequirements: readGroup("加分项"),
      remainingCountText,
      remainingCount: parseCount(remainingCountText),
      matchButtonText: btnText || "未知",
      matchButtonDisabled,
    };
  })()`)) as SearchFormSnapshot;
}

async function waitForAiFormJobDropdownReady(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => {
      const input = Array.from(
        document.querySelectorAll(
          ".ui-dropmenu-list input[type='text'], .ui-dropmenu-list input, .job-dropmenu-options .chat-job-search, .job-dropmenu-popover .chat-job-search, .top-chat-search .chat-job-search, input.chat-job-search",
        ),
      ).find((el) => {
        if (!(el instanceof HTMLInputElement)) return false;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      return !!input;
    })()`,
    { timeout: 8_000 },
  );
}

async function waitForAiFormJobSearchResults(page: Page, keyword: string): Promise<void> {
  await page.waitForFunction(
    `((kw) => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
      const rows = Array.from(
        document.querySelectorAll(
          ".job-dropmenu-list .job-dropmenu-item, .job-dropmenu-options .job-list .job-item, .job-dropmenu-popover .job-list .job-item, .job-dropmenu-options .job-item",
        ),
      );
      if (rows.length === 0) return false;
      return rows.some((el) => {
        const label = norm(el.querySelector(".job-option-text, .label")?.textContent || el.textContent || "");
        return label.includes(norm(kw));
      });
    })`,
    { timeout: 10_000 },
    keyword,
  );
}

async function waitForAiFormJobSelected(page: Page, expectedLabel: string): Promise<void> {
  await page.waitForFunction(
    `((label) => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const selected = norm(document.querySelector(".job-dropmenu-select .job-main-text")?.textContent);
      return !!selected && selected === label;
    })`,
    { timeout: 10_000 },
    expectedLabel,
  );
  await ensureInDeepSearchPage(page);
}

export async function selectAiFormJob(page: Page, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    throw new Error('岗位关键字不能为空。');
  }
  const kwLiteral = JSON.stringify(kw);

  const opened = (await page.evaluate(`(() => {
    const host = document.querySelector(".job-dropmenu-select");
    if (!(host instanceof HTMLElement)) return false;
    host.scrollIntoView({ block: "center", inline: "nearest" });
    host.click();
    return true;
  })()`)) as boolean;
  if (!opened) {
    throw new Error('未找到深度搜索页岗位下拉（.job-dropmenu-select）。');
  }
  await sleepRandom(JOB_SELECT_ACTION_GAP_MS.min, JOB_SELECT_ACTION_GAP_MS.max);
  await waitForAiFormJobDropdownReady(page);

  const searched = (await page.evaluate(`(() => {
    const kw = ${kwLiteral};
    const inputs = Array.from(
      document.querySelectorAll(
        ".ui-dropmenu-list input[type='text'], .ui-dropmenu-list input, .job-dropmenu-options .chat-job-search, .job-dropmenu-popover .chat-job-search, .top-chat-search .chat-job-search, input.chat-job-search",
      ),
    );
    const input = inputs.find((el) => {
      if (!(el instanceof HTMLInputElement)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!input) return false;
    input.focus();
    input.value = kw;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`)) as boolean;
  if (searched) {
    await sleepRandom(JOB_SEARCH_ACTION_GAP_MS.min, JOB_SEARCH_ACTION_GAP_MS.max);
    await waitForAiFormJobSearchResults(page, kw);
  }

  const picked = (await page.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const rows = Array.from(
      document.querySelectorAll(
        ".job-dropmenu-list .job-dropmenu-item, .job-dropmenu-options .job-list .job-item, .job-dropmenu-popover .job-list .job-item, .job-dropmenu-options .job-item",
      ),
    );
    if (rows.length === 0) return { ok: false, reason: "empty" };
    const target = rows.find((el) => {
      const label = norm(
        el.querySelector(".job-option-text, .label")?.textContent || el.textContent || "",
      );
      return label.includes(norm(kw));
    });
    if (!(target instanceof HTMLElement)) return { ok: false, reason: "not_found" };
    const label = (
      target.querySelector(".job-option-text, .label")?.textContent ?? target.textContent ?? ""
    )
      .replace(/\\s+/g, " ")
      .trim();
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label };
  })()`)) as { ok: boolean; label?: string; reason?: string };
  if (!picked.ok) {
    throw new Error(`未找到匹配岗位「${kw}」。`);
  }
  const label = picked.label ?? kw;
  await sleepRandom(JOB_SELECT_ACTION_GAP_MS.min, JOB_SELECT_ACTION_GAP_MS.max);
  await waitForAiFormJobSelected(page, label);
  return label;
}

/** 深度搜索页当前选中的岗位文案（无则「默认」） */
export async function readAiFormSelectedJobLabel(page: Page): Promise<string> {
  return (await page.evaluate(`(() => {
    const t = (document.querySelector(".job-dropmenu-select .job-main-text")?.textContent ?? "")
      .replace(/\\s+/g, " ")
      .trim();
    return t.length > 0 ? t : "默认";
  })()`)) as string;
}

/**
 * 在深度搜索（aiform）主文档中按姓名打开在线简历预览（与 {@link clickGreetDeepSearch} 同一卡片集合，排除「继续沟通」）。
 */
export async function openDeepSearchResumePreview(page: Page, target: string): Promise<boolean> {
  const raw = target.trim();
  const targetLiteral = JSON.stringify(raw);
  const opened = (await page.evaluate(`(() => {
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
  return (await page.evaluate(`(() => {
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
      .filter((x) => x !== null);
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

export async function clickGreetDeepSearch(page: Page, target: string): Promise<{ message: string }> {
  const targetLiteral = JSON.stringify(target.trim());
  const result = (await page.evaluate(
    `(() => {
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
    })()`,
  )) as
    | { kind: 'empty' }
    | { kind: 'all_continue' }
    | { kind: 'not_found'; target: string }
    | { kind: 'no_btn'; name: string }
    | { kind: 'not_greet'; name: string; label: string }
    | { kind: 'disabled'; name: string }
    | { kind: 'clicked'; name: string };

  switch (result.kind) {
    case 'empty':
      throw new Error('深度搜索暂无候选人列表，请先在页面点击「立即匹配」后再试。');
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

function renderFormSnapshotOnly(snap: SearchFormSnapshot): string {
  const core = snap.coreRequirements.length > 0 ? snap.coreRequirements.join('｜') : '（空）';
  const bonus = snap.bonusRequirements.length > 0 ? snap.bonusRequirements.join('｜') : '（空）';
  return [
    '已更新深度搜索表单（未触发「立即匹配」）。',
    `职位：${snap.selectedJob || '未知职位'}`,
    `核心要求(${snap.coreRequirements.length})：${core}`,
    `加分项(${snap.bonusRequirements.length})：${bonus}`,
    `今日匹配剩余：${snap.remainingCountText || '未知'}`,
    `来源页面：${BOSS_CHAT_AI_FORM_URL}`,
  ].join('\n');
}

function renderSearchFormSummary(snap: SearchFormSnapshot, actionLine: string): string {
  const core = snap.coreRequirements.length > 0 ? snap.coreRequirements.join('；') : '（空）';
  const bonus = snap.bonusRequirements.length > 0 ? snap.bonusRequirements.join('；') : '（空）';
  return [
    actionLine,
    `职位：${snap.selectedJob || '未知职位'}`,
    `核心要求(${snap.coreRequirements.length})：${core}`,
    `加分项(${snap.bonusRequirements.length})：${bonus}`,
    `今日匹配剩余：${snap.remainingCountText || '未知'}`,
    `匹配按钮：${snap.matchButtonText}${snap.matchButtonDisabled ? '（不可用）' : '（可用）'}`,
  ].join('\n');
}

function renderDeepSearchOutput(
  snap: SearchFormSnapshot,
  geeks: DeepSearchGeekItem[],
  actionLine: string,
  listTitle = '推荐简历',
): string {
  return [
    renderSearchFormSummary(snap, actionLine),
    '',
    renderGeekListSection(listTitle, geeks),
  ].join('\n');
}

async function triggerAiFormMatch(page: Page): Promise<void> {
  const before = await readSearchFormSnapshot(page);
  if (before.coreRequirements.length === 0) {
    throw new Error('深度搜索至少需要 1 条核心要求；请先使用 --core 添加核心要求。');
  }
  if (before.remainingCount !== null && before.remainingCount <= 0) {
    throw new Error(`今日匹配次数已用完：${before.remainingCountText || '0次'}`);
  }

  const beforeCountLiteral = JSON.stringify(before.remainingCountText);
  const clicked = (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const btn = document.querySelector(".ai-form-match-footer .btn-ai-match-v2");
    if (!(btn instanceof HTMLElement)) return { ok: false, reason: "missing_button" };
    const cls = String(btn.className || "");
    const style = getComputedStyle(btn);
    const disabled =
      btn.getAttribute("disabled") !== null ||
      /disabled|forbid|ban/i.test(cls) ||
      style.pointerEvents === "none" ||
      Number(style.opacity) < 0.3;
    if (disabled) return { ok: false, reason: "disabled", text: norm(btn.textContent) };
    btn.scrollIntoView({ block: "center", inline: "nearest" });
    btn.click();
    return { ok: true, text: norm(btn.textContent) };
  })()`)) as { ok: boolean; reason?: string; text?: string };

  if (!clicked.ok) {
    throw new Error(`无法点击「立即匹配」：${clicked.reason ?? 'unknown'}${clicked.text ? `（${clicked.text}）` : ''}`);
  }

  await sleepRandom(900, 1400);
  await page.waitForFunction(
    `(() => {
      const beforeCount = ${beforeCountLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const btnText = norm(document.querySelector(".ai-form-match-footer .btn-ai-match-v2")?.textContent);
      const countText = norm(document.querySelector(".ai-form-match-footer-text-count")?.textContent);
      const cards = document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item").length;
      const stillMatching = /停止匹配|匹配中|加载中|生成中/.test(btnText);
      return !stillMatching && cards > 0 && (!beforeCount || (countText && countText !== beforeCount));
    })()`,
    { timeout: 35_000 },
  );
  await ensureInDeepSearchPage(page);
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
      await ensureDeepSearchPageReady(page);

      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
        await ensureInDeepSearchPage(page);
        if (hasFormEdit) {
          await ensureInDeepSearchPage(page);
        }
      }

      if (hasFormEdit) {
        await applyAiFormRequirementLists(page, {
          core: coreReq,
          bonus: bonusReq,
        });
        await ensureInDeepSearchPage(page);
      }

      const snap = await readSearchFormSnapshot(page);
      return renderFormSnapshotOnly(snap);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] boss_search_set error: ${message}`);
    throw new Error(`设置深度搜索条件失败：${message}`);
  }
}

export async function runBossSearch(opts: BossSearchOptions = {}): Promise<string> {
  const jobKeyword = opts.jobKeyword?.trim();
  const coreReq = opts.coreRequirements;
  const bonusReq = opts.bonusRequirements;
  const hasFormEdit = coreReq !== undefined || bonusReq !== undefined;
  const shouldMatch = opts.match === true;

  try {
    return await withBossSessionPage(async (page) => {
      await ensureDeepSearchPageReady(page);

      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
        await ensureInDeepSearchPage(page);
      }

      if (hasFormEdit) {
        await applyAiFormRequirementLists(page, {
          core: coreReq,
          bonus: bonusReq,
        });
        await ensureInDeepSearchPage(page);
      }

      if (shouldMatch) {
        await triggerAiFormMatch(page);
      }

      const snap = await readSearchFormSnapshot(page);
      const actionLine = shouldMatch
        ? '深度搜索：已触发「立即匹配」。'
        : hasFormEdit
          ? '深度搜索：已更新表单，未触发「立即匹配」。'
          : '深度搜索：当前表单（未触发「立即匹配」）。';
      if (!shouldMatch) {
        return renderSearchFormSummary(snap, actionLine);
      }
      const geeks = (await readDeepSearchGeekList(page)).slice(0, 20);
      const listTitle = shouldMatch ? '本次新增推荐简历（最新20条）' : '推荐简历';
      return renderDeepSearchOutput(snap, geeks, actionLine, listTitle);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] boss_search error: ${message}`);
    throw new Error(`读取深度搜索列表失败：${message}`);
  }
}
