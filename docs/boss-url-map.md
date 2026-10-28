# Boss URL 与功能对照

本文件记录 boss-cli 已知页面 URL、对应命令和当前位置要求。修改页面导航、命令入口、help 或报错文案前，先对照这里，避免把某个命令改成隐式跳转或多路径兜底。

## 页面 URL

| URL / Path | 页面功能 | 相关命令 | 当前行为 |
| --- | --- | --- | --- |
| `https://www.zhipin.com/web/user/?ka=header-login` | 登录入口 | `boss login` | 打开可见登录页后立即返回，交还给人工扫码/验证；不等待或确认登录成功。已有无头实例时会关闭并以有头模式重启，保留浏览器数据目录。 |
| 当前 `/web/chat/*` | 已登录主壳页 | `boss reload` | 显式刷新当前主标签页，不接受参数；刷新前作废搜索 iframe 的旧快照，`load` 后校验仍在主壳且侧栏就绪。不主动关闭或新建浏览器、不导航至其他业务页、不执行查询。登录页、验证页、风险熔断或侧栏加载失败均拒绝成功输出。 |
| `/web/chat/index` | 沟通列表、候选人会话页 | `boss list`、`boss list --unread`、`boss chat <姓名>`、`boss chat [姓名] --index <序号> [--unread]`、`boss send`、`boss action` | `list` / `chat` 会先检查当前位置，不在该页时直接进入；`chat --index` 使用 `boss list` 输出的 1-based 序号，两者都从「全部」列表的非空姓名卡片编号，带 `--unread` 时按未读角标大于零筛选，不切平台未读页签；同时提供姓名时会校验序号对应候选人姓名，适合处理同名候选人；序号指当前加载列表，列表变化后应重新读取。`send` / `action` 要求当前会话已打开。 |
| `/web/chat/recommend` | 推荐候选人列表 | `boss recommend`、`boss preview <姓名>`、`boss preview [姓名] --index <序号>`、`boss greet <姓名>` | `recommend` 会先检查当前位置，不在该页时直接进入；以 `.candidate-card-wrap:not(.anonymous-geek-guide-card)` 为唯一候选根，不把外层 `.card-item` 重复计数，不把“热搜牛人推荐”跳转引导卡当作候选人。工作/教育从 `.work-exps` / `.edu-exps` 时间线读取日期、公司/岗位、院校/专业/学历，并纳入快照校验。`preview` 要求最近一次推荐列表快照有效，姓名须唯一匹配，或用全列表统一序号定位；`greet` 要求当前列表已加载，`greet --dry-run` 会在任何按钮点击前拒绝。 |
| `/web/chat/aiform` | 已下线的旧深度搜索 / Agent 搜索 | `boss deep-search`；`preview` / `greet` 的旧页分支 | **暂不可用**。实现仍导航到此路径并依赖旧表单、iframe 和候选列表；命令入口与旧参数保留，不代表新版已适配。旧页 `preview` / `greet` 分支也不代表可用能力。 |
| `/web/chat/search/ai` | 新版深度搜索 | 暂无已适配命令 | CLI 尚未适配，`deep-search`、`preview`、`greet` 均不能据此使用新版深度搜索；需要时在网页端人工操作。 |
| `/web/chat/search` | 常规搜索 | `boss search [关键词] [--job] [--city] [--degree|--degree-range] [--school] [--exp|--exp-range] [--age|--age-range] [--status] [--job-hop] [--major]`、`boss preview <姓名>`、`boss greet [关键词] --index <序号> [--job] [--dry-run]` | `search` 会先检查当前位置，不在该页时只点击已观测的侧栏 `.menu-geeksearch a[ka="menu-geek-search"]`，不使用 goto 重载或导航回退；带关键词时填入搜索框并回车搜索；**有关键词时先检查并清除旧筛选，再按本次参数重设；无残留不重复点击 `.reset-btn`**，筛选条件不跨命令粘连；有关键词时不传 `--job` 切「不限职位」；城市不在清空范围内（换岗位时平台自己会清）；学历 / 经验 / 年龄是三个独立的单选块（`.degree-ui` / `.exp-list-ui` / `.age-list-ui`，都**不在**「其他筛选」里），院校是多选（`.school-ui`），学历/经验/年龄的「自定义」区间走 `--degree-range` / `--exp-range`（拖 `.experience-select-custom-slider` 的双手柄滑块，按 hidden 的 `min,max` 档位校验纠偏）/ `--age-range`（`.age-custom` 两个下拉，值在 hidden 上：普通年龄存数字、46岁+ 存 10000、不限存 -1）；滑块拖完一律按 hidden 真实档位校验纠偏，且不许拖过对面手柄（两手柄重叠会让按下标取手柄失准）；结果标题里的条件全部实时读页面，不打入参；`preview <姓名>` / `preview [姓名] --index <序号>` 要求当前已在该页且最近一次搜索快照有效，复用搜索的唯一匹配与身份校验，仅以姓名匹配，不用摘要代替姓名，只点击目标姓名入口，不支持 `--job`。 |
| `/web/chat/job/list` | 职位管理列表 | `boss positions`、`boss jd <name>` | `positions` 或未命中本地缓存的 `jd` 通过侧栏进入职位管理页后读取；`jd` 缓存位于 `~/.boss-cli/jd/`，命中时直接返回文件内容，不连接浏览器或导航。当前列表 frame 为 `/web/frame/job_v2/list`，卡片根为 `.job-item-container`。只匹配该 frame URL，不扫描后台搜索 frame。统计大于零但卡片未加载、或主页面已离开职位页时拒绝成功输出。 |

## 约定

- 当前 URL 校验优先于 DOM 猜测。命令依赖特定页面时，先检查 path，再执行页面读取或点击。
- 不为高风险操作添加隐式兜底跳转。需要用户处于特定页面的命令，应直接报出当前 URL 与目标 URL。
- 页面入口发生变化时，同步更新本文件和相关命令 help 文案。

## CLI 帮助与本地行为

- 安装后的 `boss` 无参数会报错退出；交互模式仅由源码开发命令 `npm run dev` 启动，输入 `exit` / `quit` 或按 Ctrl+C 结束。`boss help`、`boss --help`、`boss -h` 输出同一份帮助。
- `version` 显示当前安装包名和版本并检查 npm；`update` 通过 npm 全局更新当前安装包，本 fork 为 `@viyzhu/boss-cli-fork`。
- 浏览器默认有头且跨命令常驻。`BOSS_BROWSER_HEADLESS` 的有效值优先于 `RECRUIT_BROWSER_HIDDEN`；修改配置不影响已运行的实例，须先 `boss shutdown` 再执行下一条业务命令。`shutdown` 保留浏览器数据目录，登录是否仍有效以平台为准。
- `jd` 先按请求名称查找 `~/.boss-cli/jd/` 下的 Markdown 缓存，命中即返回；无过期时间或刷新参数。`reload` 不更新 JD 缓存。
- `action resume` 和 `preview` 直接读取在线简历，无须先索要附件或等对方回复；推荐/搜索预览也无须先 `greet`。默认保存 PNG 并输出截图路径，目录为 `~/.boss-cli/.cache/resume-screenshots/`。OCR 默认关闭，显式设置 `BOSS_RESUME_OCR=1` 并配置百度密钥后才启用；OCR 为截图识别文本，不是结构化简历 JSON；页面折叠的“查看全部”等内容不会自动展开，不能据此声称已取到全文。开启 OCR 后仍输出截图路径；截图警告与失败原因保留。
- `preview [姓名] --index <序号>` 使用最近一次 `recommend` / `search` 的 1-based 序号，姓名与序号同时提供时必须匹配同一人；姓名匹配多张卡片时拒绝。两种列表快照有效期均为 15 分钟，缺失、过期、页面刷新、卡片重建、列表换序或资料变化后必须重新执行对应列表命令，不自动重搜。推荐按全列表统一编号，分组不重置序号。`preview` 不支持 `--job`；旧深搜不支持序号预览。
- `chat` 输出仅覆盖当前已加载聊天消息；“附件简历消息：未发现”只表示这些消息里没有附件卡片，不表示在线简历不可读。纯简历卡片会话可正常读取，不要求先发送文字。
- `action request-attachment-resume` 和 `action agree-resume` 是向候选人索取附件/同意接收请求的独立操作，不是在线简历的前提。当前没有附件下载命令，也没有按 `resume_id` 或跨来源 ID 读取简历的接口。
- `send` 返回“文本已提交发送（未确认送达）”，仅证明已按发送键。`send --request-resume` 的后续操作失败时，错误保留文本已提交的事实和原因，须核对聊天记录，不能直接重跑整条命令。

## 深度搜索暂不可用

`deep-search` 仍依赖已下线的 `/web/chat/aiform`，尚未迁移到 `/web/chat/search/ai`；新版暂须网页端人工使用。源码保留的旧页导航、表单操作及 `preview` / `greet` 分支不构成新版支持。

以下仅记录旧页面参数语义：岗位关键字可用位置参数或 `--job` 提供；`--core` / `--bonus` 可重复并同步对应分组，`--clear-core` / `--clear-bonus` 清空对应分组。旧实现默认只读表单与剩余匹配次数；仅显式传 `--match` 才点击“立即匹配”、消耗次数，并最多输出最新 20 条候选人。这些参数仍能解析，不表示当前功能可用。

## 搜索池 greet 的定位与确认

- `search` 完成筛选与实时读取后，将原卡片 DOM 对象、完整可读资料、顺序、快照编号和创建时间保存在搜索 iframe 中。开始新搜索会先作废旧快照，失败不会恢复旧快照。
- `greet` 要求当前位置是 `/web/chat/search`，不会为定位失败自动导航或重新搜索。最近一次成功搜索的快照最多有效 15 分钟。缺失、刷新、卡片 DOM 重建、列表换序/追加或资料变化都会拒绝操作，需重新 `boss search`。
- 关键词与 `--index` 同时提供时，必须对应同一张卡片。正式操作在详情打开后保留原卡片对象，沟通入口点击前、切卡重试前、最终确认前均重新校验。不会按打码姓名重找。
- `--dry-run` 只在搜索池支持，保留持久开聊模式，点击沟通入口并读取确认弹层后取消。推荐和深搜页会先拒绝，零按钮点击。搜索池入口若未出现弹层，须人工核对平台状态。
- 正式执行优先账号权益；只有当前弹层明确不足且确认不可用时，才切换并验证畅聊卡模式。提交确认和实际发送、扣费是不同结果，不能仅凭退出码零登记为已发送。
- 当前 UI 已验证 `.geek-info-card.__vue__.$props.geek.geekCard.encryptGeekId` 与结果响应的候选人标识对应。快照加入该标识，缺失或变更立即停止；不承诺永久或跨平台稳定。旧版本 search 没有快照，升级后须重新搜索。

## 搜索加载与窗口状态

- 初始化、切换岗位后以及最终读取前，只从当前主页面的 `iframe[name="searchFrame"]` 获取绑定 frame。允许只读搜索在初始化/切岗后重新取得该 iframe；greet 不会借此重新定位人选。
- 主页面必须仍为 `/web/chat/search`。等待网络空闲、可见 loading 消失、岗位标签与 active 项一致、指定关键词/城市匹配，以及完整语义资料连续 500ms 稳定。初始化和选岗使用 form-ready，合法初始使用说明页只须输入框、列表容器、岗位控件就绪，不要求已产生结果。匹配业务响应后使用 results-ready，空查询结果必须存在可见 `.empty-tips`，无卡片本身不是查询成功证据。
- 关键词变化时，只有输入框回填不能说明结果更新；必须收到同一动作 frame 新发起的 `/wapi/zpitem/web/boss/search/geeks.json` 响应，keywords 精确匹配、page=1；不限岗位 jobId 必须为空，明确岗位 jobId 必须等于同次选岗 `getFilterConditions.encryptJobId` 的绑定值。HTTP2xx、code=0 且 zpData.geeks 数组有效后，响应/当前 DOM 的 encryptGeekId 必须按顺序完全一致。无关埋点、autoSuggest 和仅资料变化均不作为成功依据。
- 清空筛选后重新读取学历、经验、年龄、院校和其他筛选，仍有残留则停止。最终创建快照前再校验主 URL、当前 iframe 绑定及岗位/关键词/指定城市。
- 城市仅在有关键词时应用：`--city` 优先，否则读取 `BOSS_SEARCH_CITY`；仍为空则不操作城市控件，并非强制“不限城市”。城市不在清空筛选范围内，可能沿用页面已有值，也可能被平台在换岗时清除；需要固定城市应每次显式指定或配置该环境变量，再核对结果标题的页面实际条件。
- 主壳、侧栏导航、搜索及推荐列表/岗位下拉/岗位搜索/选中状态，以及聊天列表/筛选/会话详情/消息就绪的非动画 DOM 条件使用 100ms 数值 polling，不依赖隐藏页面可能停止的 requestAnimationFrame。不会为这些等待恢复最小化窗口或提高 protocolTimeout。在线简历截图仍沿用可见窗口绘制 canvas 的既有流程。
- work/education 按 `.date` 和 `.t-tooltip-slot` 完整语义文本读取，排除 `.t-tooltip-content` 中的重复浮层副本；实际日期、公司、岗位、院校或专业变化仍会触发身份失配。
- 搜索标签从 `.info-tags-measure .info-tags-item` 的完整语义集合读取。可见 `.info-tags` 会因窗口隐藏或宽度截断为零至若干项，不能作为资料快照来源；显示布局变化不使快照失效，真实标签变化仍拒绝。

- 每次有关键词的 search 先确保不限职位，再按 --job 选择唯一目标，连续相同岗位也建立新的选岗请求绑定，不跨 CLI 进程沿用 jobId 缓存。

- 公开 `boss search` 不提供关键词时只进入表单并清除旧搜索快照，不应用岗位/筛选参数、不输出候选结果；暖页面已有关键词或结果也不会复用。所有候选结果输出必须来自本轮显式关键词的匹配业务响应，并通过 results-ready 和平台ID顺序校验后创建快照。
- 搜索 iframe URL 参数全空、零卡片和「按回车键搜索」可以是合法初始表单，不作为页面故障判据。
- 仅 `search` / `recommend` 的只读初始化入口对 Puppeteer `TimeoutError` 增补阶段、当前页面、原始 message 与 cause，并提示确认登录/验证后显式 `boss reload`，再重新执行原只读命令；非超时错误原样传播，不自动刷新或重试。`preview` / `greet` 的就绪判断不附该恢复提示。`reload` 成功仅表示主壳与侧栏就绪，旧搜索快照已失效，不能据此认定搜索结果已恢复。
- `boss shutdown` 实际关闭端口上的浏览器并保留 profile；`boss reload` 使用现有会话生命周期，只刷新当前主壳页，不通过关闭或另建浏览器恢复。
