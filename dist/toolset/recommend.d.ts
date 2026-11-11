import type { Frame, Page } from 'puppeteer-core';
export type RecommendCandidate = {
    index: number;
    geekId: string;
    name: string;
    salary: string;
    baseInfo: string;
    expect: string;
    experience: string;
    advantage: string;
    highlights: string[];
    canGreet: boolean;
    hasHistoryChat: boolean;
    hasViewed: boolean;
};
export type CandidateListSource = 'recommend' | 'favorites';
export type CandidateListSelection = {
    source: CandidateListSource;
    snapshotId: string;
    index: number;
    name: string;
    geekId: string;
};
export declare const FAVORITE_LIST_STATE_SCRIPT = "(() => {\n  \n  const candidateComponent = card => {\n    const root = card.__vue__;\n    const owners = [root, ...(root?.$children ?? [])].filter(component =>\n      component?.$options?.name === \"RecommendCandidateCard\" && component.$el === card);\n    if (owners.length > 1) throw new Error(\"\u5019\u9009\u5361\u7247\u5BF9\u5E94\u591A\u4E2A\u8EAB\u4EFD\u7EC4\u4EF6\uFF1B\u505C\u6B62\u64CD\u4F5C\u3002\");\n    return owners[0] ?? null;\n  };\n  const candidateId = card => {\n    const id = candidateComponent(card)?.$props?.geekInfo?.encryptGeekId;\n    return typeof id === \"string\" ? id.trim() : \"\";\n  };\n\n  const topWindow = window.top;\n  if (topWindow.location.origin !== \"https://www.zhipin.com\" || topWindow.location.pathname.replace(/\\/+$/, \"\") !== \"/web/chat/interaction\") throw new Error(\"\u4E3B\u9875\u9762\u5DF2\u79BB\u5F00\u6536\u85CF\u5165\u53E3\uFF1B\u505C\u6B62\u8BFB\u53D6\u3002\");\n  const visible = el => {\n    const rect = el.getBoundingClientRect();\n    if (rect.width <= 0 || rect.height <= 0) return false;\n    for (let node = el; node; node = node.parentElement) {\n      const style = topWindow.getComputedStyle(node);\n      if (style.display === \"none\" || style.visibility === \"hidden\" || Number(style.opacity) === 0) return false;\n    }\n    return true;\n  };\n  const frames = Array.from(topWindow.document.querySelectorAll('iframe[name=\"interactionFrame\"]')).filter(visible);\n  if (frames.length !== 1 || frames[0].contentDocument !== document) throw new Error(\"\u5F53\u524D\u6536\u85CF frame \u7ED1\u5B9A\u5DF2\u53D8\u5316\uFF1B\u505C\u6B62\u8BFB\u53D6\u3002\");\n  if (!document.querySelector('li.tab-item[title=\"\u6536\u85CF\u725B\u4EBA\"].curr')) return { ready: false };\n  const view = document.querySelector(\".list-wrap.card-list-wrap\")?.__vue__?.$props;\n  const pageList = document.querySelector(\".card-list\")?.__vue__?.$props?.pageList;\n  if (!view || !Array.isArray(pageList)) return { ready: false };\n  if (view.error !== false) throw new Error(\"\u5E73\u53F0\u6536\u85CF\u5217\u8868\u52A0\u8F7D\u51FA\u9519\uFF1B\u672A\u8BFB\u53D6\u6210\u529F\u3002\");\n  if (view.loading !== false) return { ready: false };\n  if (typeof view.finished !== \"boolean\") throw new Error(\"\u65E0\u6CD5\u8BC6\u522B\u6536\u85CF\u5217\u8868\u52A0\u8F7D\u72B6\u6001\u3002\");\n  const cards = Array.from(document.querySelectorAll(\".candidate-card-wrap\"));\n  const components = cards.map(candidateComponent);\n  if (components.some(component => !component) || cards.some(card => !candidateId(card))) return { ready: false };\n  if (components.some(component => component.$props.status !== 9)) throw new Error(\"\u5F53\u524D\u5217\u8868\u5E76\u975E\u6536\u85CF\u725B\u4EBA\uFF1B\u505C\u6B62\u64CD\u4F5C\u3002\");\n  if (cards.length !== pageList.length) return { ready: false };\n  if (cards.length === 0 && !view.finished) return { ready: false };\n  return {\n    ready: true, finished: view.finished,\n    signature: JSON.stringify([view.finished, cards.map(card => [candidateId(card), card.textContent])]),\n  };\n})()";
export declare function validatedCandidateListSelectionScript(selection: CandidateListSelection, validateList?: boolean): string;
export declare function isBossChatRecommendUrl(url: string): boolean;
export declare function getCandidateListFrame(page: Page, source: CandidateListSource): Promise<Frame>;
export declare function selectRecommendJob(frame: Frame, keyword: string): Promise<string>;
export declare function ensureInRecommendPage(page: Page): Promise<Frame>;
/**
 * 供 `preview` 使用：不导航；若当前主页面不在推荐页或未就绪推荐 iframe，直接抛错。
 */
export declare function assertRecommendPageReady(page: Page, actionName: string): Promise<Frame>;
export declare function assertRecommendPageReadyForPreview(page: Page): Promise<Frame>;
export declare function readRecommendList(frame: Frame, source?: CandidateListSource): Promise<RecommendCandidate[]>;
export declare function renderRecommendList(candidates: RecommendCandidate[]): string;
export declare function clickGreet(frame: Frame, target: string): Promise<{
    message: string;
}>;
export declare function markGreetProduced(before: RecommendCandidate[], after: RecommendCandidate[]): void;
export declare function openRecommendResumePreview(frame: Frame, target: string, index?: number): Promise<{
    name: string;
    index: number;
}>;
export declare function openCandidateListResumeDetail(frame: Frame, target: string, index?: number, source?: CandidateListSource): Promise<CandidateListSelection>;
export declare function runRecommend(jobKeyword?: string): Promise<string>;
//# sourceMappingURL=recommend.d.ts.map