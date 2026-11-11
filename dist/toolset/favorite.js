import { withBossSessionPage } from '../common/boss_session_page.js';
import { validatedSearchSelectionScript } from '../common/boss_greet_card_dialog.js';
import { closeCResumePanel } from '../common/c_resume_capture.js';
import { assertNormalSearchPageReadyForPreview, isBossChatSearchUrl, openNormalSearchResumeDetail, } from './normal-search.js';
import { assertRecommendPageReady, FAVORITE_LIST_STATE_SCRIPT, getCandidateListFrame, isBossChatRecommendUrl, openCandidateListResumeDetail, readRecommendList, validatedCandidateListSelectionScript, } from './recommend.js';
export async function runFavorite(command) {
    if (command.kind === 'set') {
        if (command.candidateIndex !== undefined && (!Number.isSafeInteger(command.candidateIndex) || command.candidateIndex < 1)) {
            throw new Error('候选人序号必须是从 1 开始的整数。');
        }
        if (!command.candidateTarget.trim() && command.candidateIndex === undefined) {
            throw new Error('请提供候选人姓名或 --index <序号>。');
        }
    }
    return withBossSessionPage(async (page) => {
        const url = new URL(page.url());
        const path = url.pathname.replace(/\/+$/, '');
        if (url.origin !== 'https://www.zhipin.com')
            throw new Error(`当前不在 Boss 主壳页，无法操作收藏。当前页面：${page.url()}`);
        try {
            if (!await closeCResumePanel(page))
                throw new Error('未确认已有在线简历弹层关净。');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`已有在线简历弹层关闭失败：${message}；未打开新详情或导航。`, { cause: error });
        }
        if (command.kind === 'list') {
            if (!path.startsWith('/web/chat/'))
                throw new Error('请先在浏览器中完成登录，进入 Boss 主壳页。');
            if (path !== '/web/chat/interaction') {
                await page.click('.menu-list a[href^="/web/chat/interaction"]');
                await page.waitForFunction('window.location.pathname.replace(/\\/+$/, "") === "/web/chat/interaction"', { timeout: 15_000, polling: 100 });
            }
            const frame = await getCandidateListFrame(page, 'favorites');
            await frame.evaluate('delete window.__bossCliFavoriteSnapshot; window.__bossCliFavoriteRead = { signature: null, since: 0 }');
            await frame.waitForSelector('li.tab-item[title="收藏牛人"]', { visible: true, timeout: 18_000 });
            await frame.click('li.tab-item[title="收藏牛人"]');
            const ready = await frame.waitForFunction(`(() => {
        try {
          const state = ${FAVORITE_LIST_STATE_SCRIPT};
          const settled = window.__bossCliFavoriteRead;
          if (!state.ready) { settled.signature = null; return false; }
          if (settled.signature !== state.signature) { settled.signature = state.signature; settled.since = Date.now(); return false; }
          return Date.now() - settled.since >= 500 && { kind: "ready", finished: state.finished };
        } catch (error) {
          return { kind: "error", message: error instanceof Error ? error.message : String(error) };
        }
      })()`, { timeout: 18_000, polling: 100 }).catch(error => {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`收藏列表未加载完成：${message}；未创建收藏快照。`, { cause: error });
            });
            const state = await ready.jsonValue();
            await ready.dispose();
            if (state.kind === 'error')
                throw new Error(state.message);
            const candidates = await readRecommendList(frame, 'favorites');
            if (candidates.length === 0)
                return '收藏牛人列表为空（平台已加载完成）。';
            return [
                `收藏牛人：当前已加载 ${candidates.length} 人${state.finished ? '（平台已加载完成）' : '（尚有未加载结果）'}`,
                '序号仅用于当前收藏列表；取消后须重新执行 boss favorite --list。',
                '',
                ...candidates.map(candidate => [
                    `${candidate.index}. ${candidate.name}`,
                    ...[candidate.baseInfo, candidate.salary, candidate.expect].filter(Boolean).map(value => `   ${value}`),
                ].join('\n')),
            ].join('\n');
        }
        let confirmedResult;
        let operationError;
        try {
            const target = command.candidateTarget.trim();
            let context;
            let selected;
            let sourceScript;
            let confirmationSourceScript;
            let searchDetail = false;
            const fromFavorites = path === '/web/chat/interaction';
            if (isBossChatSearchUrl(page.url())) {
                const frame = await assertNormalSearchPageReadyForPreview(page);
                const selection = await openNormalSearchResumeDetail(frame, target, command.candidateIndex);
                selected = selection;
                context = page;
                sourceScript = `${validatedSearchSelectionScript(selection)} const expectedId = candidateId(picked);`;
                confirmationSourceScript = sourceScript;
                searchDetail = true;
            }
            else if (isBossChatRecommendUrl(page.url()) || fromFavorites) {
                const source = fromFavorites ? 'favorites' : 'recommend';
                const frame = fromFavorites ? await getCandidateListFrame(page, source) : await assertRecommendPageReady(page, '操作收藏');
                const selection = await openCandidateListResumeDetail(frame, target, command.candidateIndex, source);
                selected = selection;
                context = frame;
                sourceScript = validatedCandidateListSelectionScript(selection);
                confirmationSourceScript = validatedCandidateListSelectionScript(selection, !(fromFavorites && command.desired === 'unsaved'));
            }
            else {
                throw new Error(`当前不在搜索、推荐或收藏列表页，未点击候选人。当前页面：${page.url()}；请先执行 boss search、boss recommend 或 boss favorite --list。`);
            }
            const detailScript = (validation) => `(() => {
        const expectedId = (() => { ${validation} return expectedId; })();
        const visible = el => {
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return false;
          for (let node = el; node; node = node.parentElement) {
            const style = window.getComputedStyle(node);
            if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
          }
          return true;
        };
        const details = Array.from(document.querySelectorAll(".resume-simple-box")).filter(visible);
        if (details.length === 0) return null;
        if (details.length !== 1) throw new Error("存在多个可见候选人详情，无法确认收藏目标。");
        const root = details[0];
        const component = root.__vue__;
        const id = ${searchDetail ? 'component?.$props?.geekInfo?.encryptGeekId' : 'component?.$props?.personInfo?.encryptGeekId'};
        if (typeof id !== "string" || !id || id !== expectedId) throw new Error("详情候选人标识与来源不一致；未继续操作收藏。");
        ${searchDetail ? '' : `
          const loading = component?.$data?.isLikeLoading;
          if (typeof loading !== "boolean") throw new Error("无法识别详情收藏加载状态。");
          if (loading) return { root, loading: true };
        `}
        const value = ${searchDetail ? 'component?.$props?.alreadyInterested' : 'component?.$data?.enshrineGeek'};
        const current = ${searchDetail ? 'value === 1 ? "saved" : value === 0 ? "unsaved" : null' : 'value === true ? "saved" : value === false ? "unsaved" : null'};
        const icon = root.querySelector(".like-icon-and-text > .like-icon");
        const text = (icon?.parentElement?.querySelector(".btn-text")?.textContent ?? "").replace(/\\s+/g, " ").trim();
        if (!current || !(icon instanceof HTMLElement) || !visible(icon) ||
            icon.classList.contains("like-icon-active") !== (current === "saved") || text !== (current === "saved" ? "已收藏" : "收藏")) {
          throw new Error("详情收藏状态未知或证据不一致；停止操作。");
        }
        return { root, icon, current, loading: false };
      })()`;
            const waitForDetail = async (readScript, desired) => {
                const handle = await context.waitForFunction(`(() => {
          try {
            const detail = ${readScript};
            return !!detail && !detail.loading && ${desired ? `detail.current === ${JSON.stringify(desired)}` : 'true'} && { kind: "ready" };
          } catch (error) {
            return { kind: "error", message: error instanceof Error ? error.message : String(error) };
          }
        })()`, { timeout: 8_000, polling: 100 });
                const outcome = await handle.jsonValue();
                await handle.dispose();
                if (outcome.kind === 'error')
                    throw new Error(outcome.message);
            };
            const readDetail = detailScript(sourceScript);
            await waitForDetail(readDetail);
            const action = await context.evaluate(`(() => {
        const before = ${readDetail};
        if (!before || before.loading) throw new Error("详情尚未就绪；未点击收藏。");
        if (before.current === ${JSON.stringify(command.desired)}) return "unchanged";
        before.icon.scrollIntoView({ block: "center", inline: "nearest" });
        const after = ${readDetail};
        if (!after || after.loading || after.root !== before.root || after.icon !== before.icon || after.current !== before.current) throw new Error("收藏目标或状态已变化；未点击。");
        if (after.icon.classList.contains("disabled") || after.icon.getAttribute("disabled") !== null || window.getComputedStyle(after.icon).pointerEvents === "none") throw new Error("收藏按钮不可用；未点击。");
        after.icon.click();
        return "clicked";
      })()`);
            const confirmedDetail = detailScript(action === 'clicked' ? confirmationSourceScript : sourceScript);
            try {
                await waitForDetail(confirmedDetail, command.desired);
                await context.evaluate(`(() => {
          const detail = ${confirmedDetail};
          if (!detail || detail.loading || detail.current !== ${JSON.stringify(command.desired)}) throw new Error("未能确认收藏终态。");
        })()`);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`${action === 'clicked' ? '已点击收藏控件，但' : ''}未能确认收藏结果：${message}；请核对平台状态。`, { cause: error });
            }
            const result = command.desired === 'saved' ? '已收藏' : '已取消收藏';
            confirmedResult = `#${selected.index} ${selected.name}：${result}${action === 'unchanged' ? '（原状态已满足，未重复点击）' : '（已确认）'}`;
            if (fromFavorites && command.desired === 'unsaved') {
                await context.evaluate('delete window.__bossCliFavoriteSnapshot');
                confirmedResult += '\n收藏列表快照已失效，请重新执行 boss favorite --list。';
            }
            return confirmedResult;
        }
        catch (error) {
            operationError = error instanceof Error ? error : new Error(String(error));
            throw operationError;
        }
        finally {
            try {
                if (!await closeCResumePanel(page))
                    throw new Error('在线简历弹层未确认关净。');
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                const detail = [confirmedResult, operationError?.message, `关闭在线简历弹层失败：${message}`].filter(Boolean).join('\n');
                throw new Error(detail, { cause: operationError ? new AggregateError([operationError, error], '收藏操作与详情收尾均失败。') : error });
            }
        }
    }, { ensureChatShell: false, ensureMenuList: false, retryOnContextDestroyed: false });
}
//# sourceMappingURL=favorite.js.map