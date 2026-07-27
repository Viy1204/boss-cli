/** 业务实现聚合出口：impl* 供 CLI 与其它模块调用 */
import { runLogin } from './login.js';
import { runGetCandidateList } from './list.js';
import { runListOpenPositions } from './jd.js';
import { runOpenCandidateChat, runOpenCandidateChatByIndex } from './chat.js';
import { runChatActionOnCurrentConversation, } from './action.js';
import { runSendChatMessage } from './send.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { runBossSearch, runBossSearchSet } from './deep-search.js';
import { runNormalSearch } from './normal-search.js';
import { runRecommend } from './recommend.js';
import { runPreview } from './preview.js';
import { runRecommendGreet } from './greet.js';
export async function implLogin() {
    return runLogin();
}
export async function implListCandidates() {
    return runGetCandidateList();
}
export async function implListUnreadCandidates() {
    return runGetCandidateList({ unreadOnly: true });
}
export async function implOpenChat(candidateName, exact) {
    return withBossSessionPage(async (page) => runOpenCandidateChat(page, candidateName, exact));
}
export async function implOpenChatByIndex(params) {
    return withBossSessionPage(async (page) => runOpenCandidateChatByIndex(page, {
        index: params.index,
        filter: params.unreadOnly ? 'unread' : 'all',
        expectedName: params.expectedName,
        exact: params.exact,
    }));
}
export async function implChatAction(params) {
    return withBossSessionPage(async (page) => runChatActionOnCurrentConversation(page, params));
}
export async function implSendMessage(params) {
    return runSendChatMessage({
        text: params.text || undefined,
        requestResume: params.requestResume,
    });
}
export async function implListPositions() {
    return runListOpenPositions();
}
export async function implListPositionsWithOptions(opts) {
    return runListOpenPositions({
        detail: opts.detail,
        detailName: opts.name,
    });
}
export async function implBossSearch(opts = {}) {
    return runBossSearch(opts);
}
export async function implNormalSearch(keyword, jobKeyword) {
    return runNormalSearch(keyword, jobKeyword);
}
export async function implBossSearchSet(opts) {
    return runBossSearchSet(opts);
}
export async function implRecommend(jobKeyword) {
    return runRecommend(jobKeyword);
}
export async function implPreview(opts) {
    return runPreview(opts);
}
export async function implRecommendGreet(opts) {
    return runRecommendGreet(opts);
}
export { implSetBaiduCredentials } from './baidu_credentials.js';
//# sourceMappingURL=index.js.map