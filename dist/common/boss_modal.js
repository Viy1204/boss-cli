import { C_RESUME_IFRAME_SELECTOR } from './c_resume_capture.js';
import { sleepRandom } from '../browser/timing.js';
const CLOSE_BOSS_MODAL_SCRIPT = `(() => {
  function isVisible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width >= 20 && rect.height >= 20;
  }

  function tryClickClose(root) {
    const closeBtn =
      root.querySelector(".boss-popup__close, .boss-dialog__close, .drawer-close") ||
      root.querySelector(".dialog-header .close") ||
      root.querySelector(".close-btn") ||
      root.querySelector(".icon-close");
    if (closeBtn instanceof HTMLElement) {
      closeBtn.click();
      return true;
    }
    return false;
  }

  const roots = Array.from(
    document.querySelectorAll(".boss-popup__wrapper, .boss-dialog__wrapper, .dialog-container"),
  );
  for (const root of roots) {
    if (!isVisible(root)) continue;
    if (tryClickClose(root)) return true;
  }

  const resumeIframe = document.querySelector(${JSON.stringify(C_RESUME_IFRAME_SELECTOR)});
  if (resumeIframe instanceof HTMLElement && isVisible(resumeIframe)) {
    let node = resumeIframe.parentElement;
    for (let i = 0; i < 15 && node; i++) {
      if (tryClickClose(node)) return true;
      node = node.parentElement;
    }
  }

  return false;
})()`;
/**
 * 关闭当前可见的 Boss 弹层（通常同一时刻只会出现一个）。
 * 覆盖 `.boss-popup__wrapper` / `.boss-dialog__wrapper` / `.dialog-container`，
 * 以及含 c-resume 的简历预览层（`.close-btn`）。
 * 会在主文档与各子 frame 中尝试。返回是否执行了关闭。
 */
export async function closeBossModalIfPresent(page) {
    for (const frame of page.frames()) {
        try {
            const closed = (await frame.evaluate(CLOSE_BOSS_MODAL_SCRIPT));
            if (closed) {
                await sleepRandom(220, 480);
                return true;
            }
        }
        catch {
            /* detached / 无权限 */
        }
    }
    return false;
}
/**
 * 轮询直到出现可见弹层并关闭，或超时。
 * 用于操作完成后清理延迟出现的提示框（如「当前职位尚未开放」）。
 */
export async function waitAndCloseBossModalIfPresent(page, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (await closeBossModalIfPresent(page)) {
            return true;
        }
        await sleepRandom(160, 240);
    }
    return false;
}
//# sourceMappingURL=boss_modal.js.map