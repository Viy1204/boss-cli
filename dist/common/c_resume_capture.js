import { writeFile } from 'node:fs/promises';
import { ONLINE_RESUME_IFRAME_SETTLE_MS } from '../browser/human_delay.js';
import { sleepRandom } from '../browser/timing.js';
import { resumeHeight, setTempHeight } from '../browser/viewport_temp.js';
/** 在线简历 iframe：`src` 常为相对路径 `/web/frame/c-resume/...`，故用子串匹配 */
export const C_RESUME_IFRAME_SELECTOR = 'iframe[src*="c-resume"], iframe[src*="frame/c-resume"]';
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
export async function frameHasVisibleCResumeIframe(frame) {
    try {
        return (await frame.evaluate(VISIBLE_C_RESUME_IN_FRAME_SCRIPT));
    }
    catch {
        return false;
    }
}
/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export function safeResumeScreenshotFileBase(name) {
    const t = name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 64);
    return t.length > 0 ? t : 'candidate';
}
/**
 * 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。含 `.boss-popup__close`、`.btn-quxiao`（取消）等。会在主文档与各子 frame 中尝试。
 *
 * 返回是否确认关净。**点到关闭按钮不等于关掉了**——关不净时旧面板会留在 DOM 里，
 * 后续截图会命中残留的旧 iframe（只有水印、没有正文），所以这里必须回报真实结果。
 */
export async function closeCResumePanel(page) {
    for (let round = 0; round < 5; round++) {
        if ((await countVisibleCResumeIframes(page)) === 0) {
            return true;
        }
        let clickedAny = false;
        for (const frame of page.frames()) {
            try {
                const clicked = (await frame.evaluate(CLOSE_C_RESUME_PANEL_SCRIPT));
                clickedAny = clickedAny || clicked;
            }
            catch {
                /* detached / 无权限 */
            }
        }
        if (!clickedAny) {
            break;
        }
        await sleepRandom(400, 800);
    }
    return (await countVisibleCResumeIframes(page)) === 0;
}
/**
 * 在任意 frame（含主 frame、`recommendFrame` 等）中收集所有已挂载且尺寸可见的 c-resume iframe，
 * 按文档顺序返回；同一文档里存在多个时，**最后一个**是最新打开的那个。
 */
async function collectVisibleCResumeIframeHandles(page) {
    const found = [];
    for (const frame of page.frames()) {
        let handles = [];
        try {
            handles = await frame.$$(C_RESUME_IFRAME_SELECTOR);
        }
        catch {
            continue; /* detached */
        }
        for (const handle of handles) {
            let visible = false;
            try {
                const box = await handle.boundingBox();
                visible = Boolean(box && box.width > 8 && box.height > 8);
            }
            catch {
                visible = false;
            }
            if (visible) {
                found.push(handle);
            }
            else {
                await handle.dispose();
            }
        }
    }
    return found;
}
/** 当前可见的 c-resume iframe 数量；>1 说明上一次弹层没关净。 */
export async function countVisibleCResumeIframes(page) {
    const handles = await collectVisibleCResumeIframeHandles(page);
    for (const handle of handles) {
        await handle.dispose();
    }
    return handles.length;
}
/**
 * 取**最后**一个可见 c-resume iframe。
 * 旧实现取第一个，一旦有残留旧面板就会一直截到那个空壳（recruiting-copilot#37）。
 */
export async function findVisibleCResumeIframeHandle(page) {
    const handles = await collectVisibleCResumeIframeHandles(page);
    const newest = handles.pop() ?? null;
    for (const handle of handles) {
        await handle.dispose();
    }
    return newest;
}
/**
 * 三态就绪判定：`not-ready` / `shell`（挂载好了但只有水印壳）/ `content`（正文已绘制）。
 * 正文是 canvas 像素渲染，`innerText` 常为 0 字，只看 `scrollHeight` 时空壳页也会判成就绪，
 * 故再要求「足够大的绘制面（canvas / img）或可读文本」作为正文的强信号。
 */
const C_RESUME_READY_STATE_SCRIPT = `(() => {
  const body = document.body;
  const doc = document.documentElement;
  const readyStateOk = document.readyState === "complete" || document.readyState === "interactive";
  const contentHeight = Math.max(body?.scrollHeight || 0, doc?.scrollHeight || 0);
  if (!readyStateOk || contentHeight <= 100) return "not-ready";
  var paintedArea = 0;
  var nodes = document.querySelectorAll("canvas, img");
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    var w = n.width || n.clientWidth || 0;
    var h = n.height || n.clientHeight || 0;
    paintedArea += w * h;
  }
  var textLen = (body && body.innerText ? body.innerText : "").replace(/\\s+/g, "").length;
  return paintedArea > 120000 || textLen > 80 ? "content" : "shell";
})()`;
/**
 * 等到 c-resume iframe 可见且内容就绪。
 * 只拿到「壳就绪」（`shell`）时不提前返回，会继续轮询到 `timeoutMs`——多等一会儿是纯收益，
 * 且到点仍只有壳时返回值与旧行为一致（true），不引入新的硬失败。
 */
export async function waitForVisibleCResumeIframeReady(page, timeoutMs = 6_000) {
    const deadline = Date.now() + timeoutMs;
    let sawShell = false;
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
                    const state = (await contentFrame.evaluate(C_RESUME_READY_STATE_SCRIPT));
                    if (state === 'content') {
                        return true;
                    }
                    if (state === 'shell') {
                        sawShell = true;
                    }
                }
                catch {
                    return true; /* 跨域 iframe 读不到内容，按旧行为放行 */
                }
            }
        }
        finally {
            await iframe.dispose();
        }
        await sleepRandom(100, 180);
    }
    return sawShell;
}
/**
 * 空壳判定阈值：PNG 字节数 / 截图像素数。正常在线简历约 0.03–0.06，只有水印的空壳约 0.005–0.01
 * （recruiting-copilot#37 的实测：正常 90–300 KB、空壳 3–35 KB，同一尺寸）。
 * 用 `BOSS_RESUME_BLANK_BYTES_PER_PIXEL` 覆盖；设 `0` 关闭该检查。
 */
const DEFAULT_BLANK_BYTES_PER_PIXEL = 0.015;
export function blankBytesPerPixelThreshold() {
    const raw = Number.parseFloat(process.env.BOSS_RESUME_BLANK_BYTES_PER_PIXEL?.trim() ?? '');
    return Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_BLANK_BYTES_PER_PIXEL;
}
/**
 * 按「PNG 字节 / 像素」判 PNG 是否只有水印。
 * `borderline` 指虽然过线但不到阈值 2 倍——阈值本身是经验值，边缘样本要让用户看见以便校准。
 */
export function classifyResumeCaptureDensity(byteLength, pixels, threshold = blankBytesPerPixelThreshold()) {
    const density = pixels > 0 ? byteLength / pixels : Number.POSITIVE_INFINITY;
    if (threshold <= 0) {
        return { verdict: 'ok', density };
    }
    if (density < threshold) {
        return { verdict: 'blank', density };
    }
    return { verdict: density < threshold * 2 ? 'borderline' : 'ok', density };
}
/**
 * 在已出现 `c-resume` iframe 的页面上，对 iframe 整框截图并关闭弹层。
 * `preOpenViewport` 为打开弹层前的视口快照，请用 `snapshotBossPageViewport(page)`（`page.viewport()` 常为 null 时勿直接用默认尺寸）。
 */
export async function captureCResumeIframeToFile(page, preOpenViewport, absPath) {
    try {
        await setTempHeight(page, preOpenViewport);
        await waitForVisibleCResumeIframeReady(page, 2_000);
        const visibleIframes = await countVisibleCResumeIframes(page);
        const iframe = await findVisibleCResumeIframeHandle(page);
        if (!iframe) {
            return { ok: false, detail: '页面上已没有可见的在线简历 iframe。', visibleIframes };
        }
        await iframe.evaluate(`((el) => {
      el.scrollIntoView({ block: "start", inline: "nearest" });
    })`);
        const box = await iframe.boundingBox();
        if (!box) {
            await iframe.dispose();
            return { ok: false, detail: '在线简历 iframe 取不到 boundingBox。', visibleIframes };
        }
        // 拉高视口后 canvas 正文需要时间重绘；这段等待缺失时容易截到白图。
        await sleepRandom(ONLINE_RESUME_IFRAME_SETTLE_MS.min, ONLINE_RESUME_IFRAME_SETTLE_MS.max);
        let png;
        try {
            png = await iframe.screenshot({
                type: 'png',
                captureBeyondViewport: true,
            });
        }
        finally {
            await iframe.dispose();
        }
        await writeFile(absPath, png);
        await sleepRandom(C_RESUME_CLOSE_AFTER_CAPTURE_DELAY_MS, C_RESUME_CLOSE_AFTER_CAPTURE_DELAY_MS);
        const closed = await closeCResumePanel(page);
        const scale = preOpenViewport?.deviceScaleFactor ?? 1;
        const pixels = box.width * box.height * scale * scale;
        const threshold = blankBytesPerPixelThreshold();
        const { verdict, density } = classifyResumeCaptureDensity(png.byteLength, pixels, threshold);
        const measured = `${png.byteLength} 字节 / ${Math.round(pixels)} 像素 = ${density.toFixed(4)} B/px（阈值 ${threshold}）`;
        const staleNote = visibleIframes > 1
            ? `截图前页面上有 ${visibleIframes} 个可见在线简历面板，上一次弹层没关净——这是已知会截到旧空壳的成因。`
            : '';
        if (verdict === 'blank') {
            const detail = [
                `在线简历截图疑似空壳（只有水印、正文未渲染）：${measured}。`,
                `已保存供排查：${absPath}`,
                staleNote,
                '若为误判可调 BOSS_RESUME_BLANK_BYTES_PER_PIXEL（设 0 关闭该检查）。',
            ]
                .filter(Boolean)
                .join('\n');
            return { ok: false, blankShell: true, detail, visibleIframes };
        }
        if (verdict === 'borderline') {
            return {
                ok: true,
                visibleIframes,
                detail: [`截图接近空壳阈值，请确认正文完整：${measured}。`, staleNote]
                    .filter(Boolean)
                    .join('\n'),
            };
        }
        if (!closed) {
            // 截图本身有效，但下一次 preview 会截到这个残留面板，必须让调用方看到。
            return {
                ok: true,
                visibleIframes,
                detail: '截图已保存，但在线简历弹层未确认关净；建议下次预览前重启浏览器（boss shutdown）。',
            };
        }
        return { ok: true, visibleIframes };
    }
    finally {
        await resumeHeight(page, preOpenViewport);
    }
}
//# sourceMappingURL=c_resume_capture.js.map