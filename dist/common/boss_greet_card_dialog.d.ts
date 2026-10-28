import type { Page } from 'puppeteer-core';
export declare const SEARCH_CANDIDATE_READER_SCRIPT = "\n  const norm = (v) => (v ?? \"\").replace(/\\s+/g, \" \").trim();\n  const unique = (items) => Array.from(new Set(items.map(norm).filter(Boolean)));\n  const readExperience = el => {\n    const fields = Array.from(el.querySelectorAll(\".date, .t-tooltip-slot\"));\n    if (norm(el.textContent) && fields.length === 0) throw new Error(\"\u7ECF\u5386\u8BED\u4E49\u69FD\u4F4D\u5DF2\u53D8\u5316\uFF1B\u65E0\u6CD5\u5B8C\u6574\u6838\u5BF9\u8D44\u6599\uFF0C\u505C\u6B62\u64CD\u4F5C\u3002\");\n    return fields.map(node => norm(node.textContent)).filter(Boolean).join(\" \");\n  };\n  const candidateId = card => {\n    const id = card.__vue__?.$props?.geek?.geekCard?.encryptGeekId;\n    if (typeof id !== \"string\" || !id.trim()) throw new Error(\"\u7F3A\u5C11\u53EF\u6838\u5BF9\u7684\u5E73\u53F0\u5019\u9009\u4EBA\u6807\u8BC6 encryptGeekId\uFF1B\u505C\u6B62\u64CD\u4F5C\u3002\");\n    return id;\n  };\n  const readCandidate = (card) => ({\n    candidateId: candidateId(card),\n    name: norm(card.querySelector(\".name-label\")?.textContent),\n    active: norm(card.querySelector(\".active-desc-text\")?.textContent),\n    labels: unique(Array.from(card.querySelectorAll(\".card-label\")).map(el => el.textContent)),\n    basicInfo: norm(card.querySelector(\".info-labels\")?.textContent),\n    summary: norm(card.querySelector(\".info-detail\")?.textContent),\n    tags: unique(Array.from(card.querySelectorAll(\".info-tags-measure .info-tags-item\")).map(el => el.textContent)),\n    expectation: norm(card.querySelector(\".expect-exp-box\")?.textContent),\n    work: Array.from(card.querySelectorAll(\".work-exp-box .work-exp-item\")).map(readExperience).filter(Boolean),\n    education: Array.from(card.querySelectorAll(\".edu-exp-box li\")).map(readExperience).filter(Boolean).join(\"\uFF1B\"),\n    reason: norm(card.querySelector(\".recommend-reason\")?.textContent),\n  });\n";
export declare const VALIDATE_SEARCH_SNAPSHOT_SCRIPT = "\n  \n  const norm = (v) => (v ?? \"\").replace(/\\s+/g, \" \").trim();\n  const unique = (items) => Array.from(new Set(items.map(norm).filter(Boolean)));\n  const readExperience = el => {\n    const fields = Array.from(el.querySelectorAll(\".date, .t-tooltip-slot\"));\n    if (norm(el.textContent) && fields.length === 0) throw new Error(\"\u7ECF\u5386\u8BED\u4E49\u69FD\u4F4D\u5DF2\u53D8\u5316\uFF1B\u65E0\u6CD5\u5B8C\u6574\u6838\u5BF9\u8D44\u6599\uFF0C\u505C\u6B62\u64CD\u4F5C\u3002\");\n    return fields.map(node => norm(node.textContent)).filter(Boolean).join(\" \");\n  };\n  const candidateId = card => {\n    const id = card.__vue__?.$props?.geek?.geekCard?.encryptGeekId;\n    if (typeof id !== \"string\" || !id.trim()) throw new Error(\"\u7F3A\u5C11\u53EF\u6838\u5BF9\u7684\u5E73\u53F0\u5019\u9009\u4EBA\u6807\u8BC6 encryptGeekId\uFF1B\u505C\u6B62\u64CD\u4F5C\u3002\");\n    return id;\n  };\n  const readCandidate = (card) => ({\n    candidateId: candidateId(card),\n    name: norm(card.querySelector(\".name-label\")?.textContent),\n    active: norm(card.querySelector(\".active-desc-text\")?.textContent),\n    labels: unique(Array.from(card.querySelectorAll(\".card-label\")).map(el => el.textContent)),\n    basicInfo: norm(card.querySelector(\".info-labels\")?.textContent),\n    summary: norm(card.querySelector(\".info-detail\")?.textContent),\n    tags: unique(Array.from(card.querySelectorAll(\".info-tags-measure .info-tags-item\")).map(el => el.textContent)),\n    expectation: norm(card.querySelector(\".expect-exp-box\")?.textContent),\n    work: Array.from(card.querySelectorAll(\".work-exp-box .work-exp-item\")).map(readExperience).filter(Boolean),\n    education: Array.from(card.querySelectorAll(\".edu-exp-box li\")).map(readExperience).filter(Boolean).join(\"\uFF1B\"),\n    reason: norm(card.querySelector(\".recommend-reason\")?.textContent),\n  });\n\n  const snapshot = searchWindow.__bossCliSearchSnapshot;\n  if (!snapshot) throw new Error(\"\u7F3A\u5C11\u641C\u7D22\u5FEB\u7167\uFF1B\u8BF7\u5148\u91CD\u65B0\u6267\u884C boss search\u3002\u672A\u70B9\u51FB\u6C9F\u901A\u6309\u94AE\u3002\");\n  if (Date.now() - snapshot.createdAt > 900000) {\n    throw new Error(\"\u641C\u7D22\u5FEB\u7167\u5DF2\u8D85\u8FC7 15 \u5206\u949F\uFF1B\u8BF7\u91CD\u65B0\u6267\u884C boss search\u3002\");\n  }\n  const cards = Array.from(searchDocument.querySelectorAll(\".geek-info-card\"));\n  if (cards.length !== snapshot.cards.length || cards.some((card, i) =>\n      card !== snapshot.cards[i] || JSON.stringify(readCandidate(card)) !== snapshot.fingerprints[i])) {\n    throw new Error(\"\u641C\u7D22\u5FEB\u7167\u4E0E\u5F53\u524D\u5217\u8868\u8EAB\u4EFD\u6216\u987A\u5E8F\u4E0D\u4E00\u81F4\uFF1B\u8BF7\u91CD\u65B0\u6267\u884C boss search\u3002\u672A\u7EE7\u7EED\u6C9F\u901A\u6216\u786E\u8BA4\u3002\");\n  }\n";
export type SearchPoolSelection = {
    snapshotId: string;
    frameBinding: string;
    index: number;
    name: string;
};
export declare function validatedSearchSelectionScript(selection: SearchPoolSelection): string;
export type GreetCardDialogState = {
    present: boolean;
    title: string;
    /** 弹层内可选职位；`active` 为当前选中项 */
    jobs: Array<{
        index: number;
        name: string;
        detail: string;
        active: boolean;
    }>;
    activeJob: string;
    /** 确认按钮文案，形如「搜索畅聊卡(3/13)」 */
    confirmLabel: string;
    cancelLabel: string;
    /** 当前可见弹层全文，用于明确的权益不足提示。 */
    text: string;
    confirmDisabled: boolean;
};
export declare function readGreetCardDialog(page: Page): Promise<GreetCardDialogState>;
/** 轮询等待弹层出现并渲染完；超时返回最后一次读到的状态。 */
export declare function waitForGreetCardDialog(page: Page, timeoutMs: number): Promise<GreetCardDialogState>;
/** 在弹层内按关键字模糊选职位；不传或没匹配上时保持平台预选项不动。 */
export declare function selectGreetCardDialogJob(page: Page, keyword: string): Promise<string>;
/**
 * 点「取消」关闭弹层，不消耗畅聊卡。返回是否点到了取消按钮。
 * 按钮可能还没渲染出来，轮询重试到 timeoutMs 为止。
 */
export declare function cancelGreetCardDialog(page: Page, timeoutMs?: number): Promise<boolean>;
/**
 * 点确认按钮（`button.boss-btn-primary`，文案「搜索畅聊卡(N/M)」）真正发出招呼。
 * ⚠️ 不可逆：会消耗一张搜索畅聊卡。仅在调用方已明确要发起沟通时调用。
 */
export declare function confirmGreetCardDialog(page: Page, expected?: GreetCardDialogState, searchSelection?: SearchPoolSelection): Promise<boolean>;
export declare function renderGreetCardDialog(state: GreetCardDialogState): string;
//# sourceMappingURL=boss_greet_card_dialog.d.ts.map