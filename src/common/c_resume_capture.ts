import type { ElementHandle, Frame, Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/timing.js';
import { resumeHeight, setTempHeight } from '../browser/viewport_temp.js';

/** 在线简历 iframe：`src` 常为相对路径 `/web/frame/c-resume/...`，故用子串匹配 */
export const C_RESUME_IFRAME_SELECTOR =
  'iframe[src*="c-resume"], iframe[src*="frame/c-resume"]' as const;

const CLOSE_C_RESUME_PANEL_SCRIPT = `(() => {
  const sel = ${JSON.stringify(C_RESUME_IFRAME_SELECTOR)};
  function hasCResumeIframe(root) {
    return Array.from(root.querySelectorAll('iframe')).some((iframe) => {
      const src = iframe.getAttribute('src') || '';
      return src.includes('c-resume') || src.includes('frame/c-resume');
    });
  }
  const wraps = Array.from(document.querySelectorAll('.dialog-lib-resume, .boss-popup__wrapper, .boss-dialog__wrapper, .dialog-container'));
  for (var wi = 0; wi < wraps.length; wi++) {
    var w = wraps[wi];
    if (hasCResumeIframe(w)) {
      var c =
        w.querySelector('.close-btn') ||
        w.querySelector('.boss-popup__close') ||
        w.querySelector('.boss-dialog__close') ||
        w.querySelector('.drawer-close') ||
        w.querySelector('.icon-close') ||
        w.querySelector('.btn-quxiao');
      if (c) {
        c.click();
        return true;
      }
    }
  }
  var iframe = document.querySelector(sel);
  var node = iframe ? iframe.parentElement : null;
  for (var i = 0; i < 12 && node; i++) {
    var closeBtn = node.querySelector(
      '.close-btn, .boss-popup__close, .boss-dialog__close, .drawer-close, .icon-close, .btn-quxiao',
    );
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
    node = node.parentElement;
  }
  return false;
})()`;

const C_RESUME_CLOSE_AFTER_CAPTURE_DELAY_MS = 3_000;

const VISIBLE_C_RESUME_IN_FRAME_SCRIPT = `(() => {
  var iframe = document.querySelector(${JSON.stringify(C_RESUME_IFRAME_SELECTOR)});
  if (!(iframe instanceof HTMLElement)) return false;
  var r = iframe.getBoundingClientRect();
  return r.width > 8 && r.height > 8;
})()`;

export async function frameHasVisibleCResumeIframe(frame: Frame): Promise<boolean> {
  try {
    return (await frame.evaluate(VISIBLE_C_RESUME_IN_FRAME_SCRIPT)) as boolean;
  } catch {
    return false;
  }
}

/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export function safeResumeScreenshotFileBase(name: string): string {
  const t = name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 64);
  return t.length > 0 ? t : 'candidate';
}

/** 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。含 `.boss-popup__close`、`.btn-quxiao`（取消）等。会在主文档与各子 frame 中尝试。 */
export async function closeCResumePanel(page: Page): Promise<void> {
  try {
    for (let round = 0; round < 5; round++) {
      let closedAny = false;
      for (const frame of page.frames()) {
        try {
          const closed = (await frame.evaluate(CLOSE_C_RESUME_PANEL_SCRIPT)) as boolean;
          closedAny = closedAny || closed;
        } catch {
          /* detached / 无权限 */
        }
      }
      if (!closedAny) {
        break;
      }
      await sleepRandom(200, 450);
    }
  } catch {
    /* ignore */
  }
}

/**
 * 在任意 frame（含主 frame、`recommendFrame` 等）中查找已挂载且尺寸可见的 c-resume iframe。
 */
export async function findVisibleCResumeIframeHandle(page: Page): Promise<ElementHandle<Element> | null> {
  for (const frame of page.frames()) {
    try {
      if (!(await frameHasVisibleCResumeIframe(frame))) {
        continue;
      }
      const h = await frame.$(C_RESUME_IFRAME_SELECTOR);
      if (h) {
        return h;
      }
    } catch {
      /* detached */
    }
  }
  return null;
}

export async function waitForVisibleCResumeIframeReady(
  page: Page,
  timeoutMs = 6_000,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const iframe = await findVisibleCResumeIframeHandle(page);
    if (!iframe) {
      await sleepRandom(100, 180);
      continue;
    }
    try {
      const box = await iframe.boundingBox();
      const contentFrame = await iframe.contentFrame();
      if (box && box.width > 8 && box.height > 8) {
        if (!contentFrame) {
          return true;
        }
        try {
          const ready = (await contentFrame.evaluate(`(() => {
            const body = document.body;
            const doc = document.documentElement;
            const readyStateOk = document.readyState === "complete" || document.readyState === "interactive";
            const contentHeight = Math.max(body?.scrollHeight || 0, doc?.scrollHeight || 0);
            return readyStateOk && contentHeight > 100;
          })()`)) as boolean;
          if (ready) {
            return true;
          }
        } catch {
          return true;
        }
      }
    } finally {
      await iframe.dispose();
    }
    await sleepRandom(100, 180);
  }
  return false;
}

/**
 * 在已出现 `c-resume` iframe 的页面上，对 iframe 整框截图并关闭弹层。
 * `preOpenViewport` 为打开弹层前的视口快照，请用 `snapshotBossPageViewport(page)`（`page.viewport()` 常为 null 时勿直接用默认尺寸）。
 */
export async function captureCResumeIframeToFile(
  page: Page,
  preOpenViewport: Awaited<ReturnType<Page['viewport']>>,
  absPath: string,
): Promise<boolean> {
  try {
    await setTempHeight(page, preOpenViewport);
    await waitForVisibleCResumeIframeReady(page, 2_000);

    const iframe = await findVisibleCResumeIframeHandle(page);
    if (!iframe) {
      return false;
    }

    await iframe.evaluate(`((el) => {
      el.scrollIntoView({ block: "start", inline: "nearest" });
    })`);

    const box = await iframe.boundingBox();
    if (!box) {
      await iframe.dispose();
      return false;
    }

    try {
      await iframe.screenshot({
        path: absPath,
        type: 'png',
        captureBeyondViewport: true,
      });
    } finally {
      await iframe.dispose();
    }

    await sleepRandom(
      C_RESUME_CLOSE_AFTER_CAPTURE_DELAY_MS,
      C_RESUME_CLOSE_AFTER_CAPTURE_DELAY_MS,
    );
    await closeCResumePanel(page);
    return true;
  } finally {
    await resumeHeight(page, preOpenViewport);
  }
}
