/**
 * 在线简历预览：须在「推荐」页、「深度搜索 aiform」页或「常规搜索」页且列表已加载；不自动跳转，否则报错。
 */
import { join } from 'node:path';
import { ONLINE_RESUME_IFRAME_WAIT_MAX_MS, snapshotBossPageViewport } from '../browser/index.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import {
  closeBossPaywallPopupIfPresent,
  describeBossPaywallPopupIfPresent,
  waitForCResumeIframeOrPaywall,
} from '../common/boss_paywall_popup.js';
import {
  captureCResumeIframeToFile,
  closeCResumePanel,
  safeResumeScreenshotFileBase,
  waitForVisibleCResumeIframeReady,
} from '../common/c_resume_capture.js';
import { ensureAppDataLayout, RESUME_SCREENSHOTS_DIR } from '../config.js';
import { isResumeOcrEnabled, ocrResumePngToTextFile } from '../ocr/index.js';
import {
  ensureInDeepSearchPage,
  isBossChatAiFormUrl,
  openDeepSearchResumePreview,
  readAiFormSelectedJobLabel,
} from './deep-search.js';
import {
  assertRecommendPageReadyForPreview,
  isBossChatRecommendUrl,
  openRecommendResumePreview,
} from './recommend.js';
import {
  assertNormalSearchPageReadyForPreview,
  isBossChatSearchUrl,
  openNormalSearchResumePreview,
  readNormalSearchSelectedJobLabel,
} from './normal-search.js';

export type PreviewOptions = {
  candidateTarget: string;
};

export async function runPreview(options: PreviewOptions): Promise<string> {
  const target = options.candidateTarget.trim();
  if (!target) {
    throw new Error('请提供候选人姓名。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const url = page.url();
      let jobLine: string;
      let savedOriginal: Awaited<ReturnType<typeof snapshotBossPageViewport>>;
      let opened: boolean;

      if (isBossChatAiFormUrl(url)) {
        await ensureInDeepSearchPage(page);
        const label = await readAiFormSelectedJobLabel(page);
        jobLine = `当前岗位：${label}`;
        savedOriginal = await snapshotBossPageViewport(page);
        opened = await openDeepSearchResumePreview(page, target);
      } else if (isBossChatRecommendUrl(url)) {
        const frame = await assertRecommendPageReadyForPreview(page);
        jobLine = '当前岗位：当前推荐列表';
        savedOriginal = await snapshotBossPageViewport(page);
        opened = await openRecommendResumePreview(frame, target);
      } else if (isBossChatSearchUrl(url)) {
        const frame = await assertNormalSearchPageReadyForPreview(page);
        const label = await readNormalSearchSelectedJobLabel(frame);
        jobLine = `当前岗位：${label}`;
        savedOriginal = await snapshotBossPageViewport(page);
        opened = await openNormalSearchResumePreview(frame, target);
      } else {
        throw new Error('当前不在推荐列表页、深度搜索页或常规搜索页，无法预览候选人。');
      }

      if (!opened) {
        throw new Error('未在列表中找到该候选人，或点击未能打开简历预览。');
      }

      const outcome = await waitForCResumeIframeOrPaywall(page, ONLINE_RESUME_IFRAME_WAIT_MAX_MS);
      if (outcome !== 'iframe') {
        const paywall = await describeBossPaywallPopupIfPresent(page);
        await closeBossPaywallPopupIfPresent(page);
        if (paywall) {
          throw new Error(paywall);
        }
        throw new Error('点击后未出现在线简历 iframe（c-resume）。');
      }
      const ready = await waitForVisibleCResumeIframeReady(page);
      if (!ready) {
        throw new Error('在线简历 iframe 已出现，但内容未在预期时间内渲染完成。');
      }
      ensureAppDataLayout();
      const fileName = `preview-${safeResumeScreenshotFileBase(target)}-${Date.now()}.png`;
      const absPath = join(RESUME_SCREENSHOTS_DIR, fileName);

      const ok = await captureCResumeIframeToFile(page, savedOriginal, absPath);
      if (!ok) {
        await closeCResumePanel(page);
        throw new Error('在线简历 iframe 截图失败。');
      }

      const disclaimer =
        '说明：平台对在线简历的每日可查看次数有限，请按需使用、谨慎查看。';

      if (!isResumeOcrEnabled()) {
        return [jobLine, `简历预览截图：${absPath}`, '', disclaimer].join('\n');
      }
      try {
        const ocr = await ocrResumePngToTextFile(absPath);
        return [
          jobLine,
          `简历预览截图：${absPath}`,
          '',
          '在线简历 OCR 正文：',
          '',
          ocr.text,
          '',
          disclaimer,
        ].join('\n');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`简历预览截图已保存，但 OCR 失败：${msg}`);
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`简历预览失败：${message}`);
  }
}
