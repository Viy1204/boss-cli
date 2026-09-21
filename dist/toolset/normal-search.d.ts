import type { Frame, Page } from 'puppeteer-core';
/**
 * 默认搜索城市。**不硬编码深圳**——这个包是公开发布的，别人不一定在深圳；
 * 不设这个变量时完全不碰城市控件，行为与加本功能之前一致。
 */
export declare function defaultSearchCityFromEnv(): string;
/**
 * 解析 `--school` / `--status` / `--major` 这类可多选参数的逗号分隔值。
 * 中英文逗号都收——中文输入法下顺手打出全角逗号太常见，
 * 因此而报「院校要求没有『统招本科,985院校』这一项」纯属自找麻烦。
 */
export declare function parseFilterLabels(raw: string | undefined): string[];
/**
 * 「跳槽频率」的选项里有个 `时间≥1年`——`≥` 在键盘上打不出来。
 * 允许用户写 `>=`，映射到页面上的真实文案；其余一律按原样完全匹配。
 */
export declare function normalizeFilterLabel(raw: string): string;
export declare function isBossChatSearchUrl(url: string): boolean;
export declare function assertNormalSearchPageReadyForPreview(page: Page): Promise<Frame>;
export declare function readNormalSearchSelectedJobLabel(frame: Frame): Promise<string>;
/**
 * 在常规搜索页（iframe）切换当前岗位。岗位选项常驻 `.job-name`（即账号自己的开放职位），
 * 模糊匹配 keyword 后点击，等待 `.search-current-job` 变更。keyword 为空则返回当前岗位。
 */
export declare function selectNormalSearchJob(frame: Frame, keyword: string): Promise<string>;
/**
 * 把当前岗位切成「不限职位」——搜全池而不是被某个岗位的画像圈住。
 *
 * 它是岗位下拉的第一项，但**不带 `.job-name`**（那个 class 只给真实职位用），
 * 所以 `selectNormalSearchJob` 的选择器扫不到它，得单独按 `li[ka="search_select_job"]` 找。
 */
export declare function selectNormalSearchAnyJob(frame: Frame): Promise<string>;
/**
 * 选搜索城市。控件是「输入即联想」，不是普通下拉：
 * 点 `.city-wrap` 让输入框获焦 → 往 `.search-city-kw input` 里敲字 →
 * 冒出 `.city-box .search-result-item` → 点中文本完全相同的那一项。
 *
 * **必须走真实键盘输入**（ElementHandle.type）：页面是 Vue，直接改 `input.value`
 * 不触发 input 事件，联想列表根本不会出来。
 *
 * 已经是目标城市就直接返回，不做任何点击——少一次无谓交互就少一分自动化特征。
 */
export declare function selectNormalSearchCity(frame: Frame, city: string): Promise<string>;
/** 学历要求：`.degree-ui` 里的单选项，当前选中项带 `.active`（已选中就不重复点）。 */
export declare function selectNormalSearchDegree(frame: Frame, degree: string): Promise<string>;
/**
 * 经验要求：`.exp-list-ui` 里的单选项
 * （在校/应届 / 25年毕业 / 26年毕业 / 26年后毕业 / 1-3年 / 3-5年 / 5-10年）。
 *
 * 旁边还有个「自定义」滑块（`.experience-select-custom-slider`）没做——拖滑块的交互
 * 和点选项完全是两回事，等真有人需要「6-8年」这种区间再说。
 */
export declare function selectNormalSearchExp(frame: Frame, exp: string): Promise<string>;
/**
 * 年龄要求：`.age-list-ui` 里的单选项（20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上）。
 * 「自定义」那对下拉（`.age-custom`，默认 `display:none`）同样没做。
 */
export declare function selectNormalSearchAge(frame: Frame, age: string): Promise<string>;
/**
 * 院校要求：`.school-ui` 里的多选框（统招本科 / 双一流院校 / 211院校 / 985院校 /
 * 留学生 / QS 100 / QS 500），以及单独一个「只看第一学历」（提示语写明＝第一学历为全日制本科）。
 *
 * 逐个点，每点一个歇一下——一次性连点是很明显的机器行为。
 */
export declare function selectNormalSearchSchools(frame: Frame, labels: string[]): Promise<string[]>;
/**
 * 点「清空筛选」把筛选条件归零。
 *
 * 为什么每次搜索前都要清：条件存在**平台侧**、跨命令粘着。不清的话「这次怎么只有 3 个人」
 * 永远得靠猜是不是上次设的条件还挂着——这跟「不传 --job 就切不限职位」是同一个理由。
 *
 * 实测 `.reset-btn` 清的是学历 / 院校 / 其他筛选；关键词、当前岗位、城市**不动**
 * （那三项本来就由 `--job` / `--city` / 关键词各自显式管）。
 *
 * 已经全是默认态就跳过——少一次无谓点击就少一分自动化特征。
 */
export declare function resetNormalSearchFilters(frame: Frame): Promise<boolean>;
/**
 * 求职状态：`.mutil-select` 多选下拉（离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 / 在职-月内到岗）。
 *
 * 只能先展开再点选项——菜单是展开时才挂上 DOM 的。而占位文案「求职状态」一旦选中第一项就被
 * 替换掉，所以**先记住它在 `.filter-2-item` 里的下标**，后续都按下标操作，不再按文案找。
 * （这里能靠下标是因为每次搜索前都清过筛选，展开时占位文案一定还在。）
 */
export declare function selectNormalSearchStatus(frame: Frame, labels: string[]): Promise<string[]>;
/**
 * 跳槽频率：`.work-year-select` 单选下拉（不限 / 5年少于3份 / 时间≥1年）。
 *
 * 锚点用 `input.ipt` 的 placeholder 而不是文案——「性别」和「牛人活跃度」共用
 * `.gender-select` 这个 class，只有 placeholder 能把三个下拉分开。
 */
export declare function selectNormalSearchJobHop(frame: Frame, label: string): Promise<string>;
/**
 * 专业：点 `.major-input-ui` 弹出 `.major-dialog` 弹层（`v-transfer-dom`，挂在 body 上，
 * 但仍在同一个 iframe 文档里），在搜索框里打专业名 → 点联想项 → 点「确定」。
 *
 * 和城市一样**只认完全匹配**：搜「计算机」会出几十条（计算机科学与技术 / 计算机应用工程 /
 * 计算机速录……），替用户挑一条的代价是整轮白跑且他不知道。平台限选 10 个。
 *
 * ⚠️ **一个专业开一次弹层**。平台的搜索框选中一项之后就不再出联想了——本机实测：
 * 选完「计算机科学与技术」再打「软件工程」，`.major-lists` 根本不渲染，失焦重聚焦、
 * 多敲一个字再退格都救不回来。而「确定」关掉再重开，搜索框就恢复正常，
 * 且已选的专业还在。所以多个专业只能一个一个来，这是平台行为不是效率取舍。
 */
export declare function selectNormalSearchMajors(frame: Frame, labels: string[]): Promise<string[]>;
export declare function openNormalSearchResumePreview(frame: Frame, target: string): Promise<boolean>;
export type SearchPoolGreetOptions = {
    /** 1-based 序号，对应上一次 `boss search` 输出的编号（仅当次列表有效） */
    index?: number;
    /** 打码姓名或摘要关键词 */
    target?: string;
    /** 弹层内改选职位（不传则用平台预选，通常即 `--job` 选中的岗位） */
    jobKeyword?: string;
    /** true = 只走到弹层并取消，不发出招呼、不消耗畅聊卡 */
    dryRun: boolean;
};
/**
 * 搜索池打招呼：定位卡片 → 点「畅聊卡 N/M」→ 处理「选择该牛人开聊职位」确认弹层。
 * dryRun 时读完弹层就点「取消」，不消耗额度；否则点 `boss-btn-primary`（不可逆）。
 */
export declare function greetSearchPoolOnPage(page: Page, options: SearchPoolGreetOptions): Promise<string>;
export declare function runSearchPoolGreet(options: SearchPoolGreetOptions): Promise<string>;
export type NormalSearchOptions = {
    keyword?: string;
    jobKeyword?: string;
    /** 不传则读 `BOSS_SEARCH_CITY`；仍为空就完全不碰城市控件。 */
    city?: string;
    degree?: string;
    schools?: string[];
    /** 经验要求，单选：在校/应届 / 25年毕业 / 1-3年 / 3-5年 / 5-10年 等 */
    exp?: string;
    /** 年龄要求，单选：20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上 */
    age?: string;
    /** 求职状态，可多选：离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 / 在职-月内到岗 */
    status?: string[];
    /** 跳槽频率，单选：5年少于3份 / 时间≥1年 */
    jobHop?: string;
    /** 专业，可多选，最多 10 个 */
    majors?: string[];
};
export declare function runNormalSearch(opts?: NormalSearchOptions): Promise<string>;
//# sourceMappingURL=normal-search.d.ts.map