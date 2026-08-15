import { GREET_PAYWALL_WAIT_MAX_MS, resumeHeight, setTempHeight, sleepRandom, snapshotBossPageViewport, } from '../browser/index.js';
import { closeBossModalIfPresent, waitAndCloseBossModalIfPresent } from '../common/boss_modal.js';
import { closeBossPaywallPopupIfPresent, describeBossPaywallPopupIfPresent, waitForBossPaywallPopup, } from '../common/boss_paywall_popup.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { clickGreetDeepSearch, ensureInDeepSearchPage, isBossChatAiFormUrl, readDeepSearchGeekList, renderGeekListSection, selectAiFormJob, } from './deep-search.js';
import { clickGreet, assertRecommendPageReady, markGreetProduced, readRecommendList, renderRecommendList, selectRecommendJob, } from './recommend.js';
import { greetSearchPoolOnPage, isBossChatSearchUrl } from './normal-search.js';
/** 打招呼前临时拉高父页视口，使 iframe 内更多卡片进入 DOM（与 recommend 列表读取已解耦）。 */
const RECOMMEND_GREET_EXPAND_HEIGHT_PX = 3000;
const RECOMMEND_GREET_EXPAND_SETTLE_MS = { min: 600, max: 1400 };
/** 操作完成后等待并关闭延迟出现的提示弹层（如「当前职位尚未开放」）。 */
const GREET_MODAL_CLEANUP_WAIT_MAX_MS = 4000;
async function assertNoGreetPaywallPopup(page) {
    if (await waitForBossPaywallPopup(page, GREET_PAYWALL_WAIT_MAX_MS)) {
        const paywall = await describeBossPaywallPopupIfPresent(page, 'greet');
        await closeBossPaywallPopupIfPresent(page);
        if (paywall) {
            throw new Error(paywall);
        }
        throw new Error('页面出现 VIP/付费购买弹层，打招呼可能需开通权益或充值直豆。');
    }
}
async function cleanupGreetModalIfPresent(page) {
    await waitAndCloseBossModalIfPresent(page, GREET_MODAL_CLEANUP_WAIT_MAX_MS);
}
export async function runRecommendGreet(options) {
    const t = options.candidateTarget.trim();
    const kw = (options.jobKeyword ?? '').trim();
    if (!t && options.index === undefined) {
        throw new Error('请提供打招呼目标（姓名），或在搜索池用 --index <序号>。');
    }
    try {
        return await withBossSessionPage(async (page) => {
            await closeBossModalIfPresent(page);
            const url = page.url();
            // 搜索池（/web/chat/search）是另一套机制：按钮为「畅聊卡 N/M」，点后弹职位确认层，
            // 且姓名被平台打码，因此支持 --index 按卡片序号定位。
            if (isBossChatSearchUrl(url)) {
                return greetSearchPoolOnPage(page, {
                    index: options.index,
                    target: t || undefined,
                    jobKeyword: kw || undefined,
                    dryRun: options.dryRun === true,
                });
            }
            if (!t) {
                throw new Error('请提供打招呼目标（姓名）。');
            }
            if (isBossChatAiFormUrl(url)) {
                await ensureInDeepSearchPage(page);
                let jobLine = '';
                if (kw) {
                    const label = await selectAiFormJob(page, kw);
                    await ensureInDeepSearchPage(page);
                    jobLine = `当前岗位：${label}`;
                }
                const greetResult = await clickGreetDeepSearch(page, t);
                await assertNoGreetPaywallPopup(page);
                await sleepRandom(380, 1000);
                const after = await readDeepSearchGeekList(page);
                await cleanupGreetModalIfPresent(page);
                const lines = [greetResult.message];
                if (jobLine) {
                    lines.unshift(jobLine);
                }
                lines.push('', '当前深度搜索列表：', renderGeekListSection('深度搜索匹配结果', after));
                return lines.join('\n');
            }
            const frame = await assertRecommendPageReady(page, '打招呼');
            const selectedJob = await selectRecommendJob(frame, kw);
            const jobLine = selectedJob ? `当前岗位：${selectedJob}` : '当前岗位：默认';
            const savedViewport = await snapshotBossPageViewport(page);
            try {
                await setTempHeight(page, savedViewport, RECOMMEND_GREET_EXPAND_HEIGHT_PX);
                await sleepRandom(RECOMMEND_GREET_EXPAND_SETTLE_MS.min, RECOMMEND_GREET_EXPAND_SETTLE_MS.max);
                const before = await readRecommendList(frame);
                const greetResult = await clickGreet(frame, t);
                await assertNoGreetPaywallPopup(page);
                await sleepRandom(380, 1000);
                const after = await readRecommendList(frame);
                markGreetProduced(before, after);
                await cleanupGreetModalIfPresent(page);
                return [jobLine, greetResult.message, '', '当前推荐列表（来源分组）：', renderRecommendList(after)].join('\n');
            }
            finally {
                await resumeHeight(page, savedViewport);
            }
        }, { ensureChatShell: false, ensureMenuList: false });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        throw new Error(`执行打招呼失败：${message}`);
    }
}
//# sourceMappingURL=greet.js.map