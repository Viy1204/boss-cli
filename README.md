# boss-cli — Boss直聘自动化 CLI | 批量发消息 · 自动打招呼 · AI Agent 招聘工具

[![npm version](https://img.shields.io/npm/v/@joohw/boss-cli)](https://www.npmjs.com/package/@joohw/boss-cli)
[![npm downloads](https://img.shields.io/npm/dm/@joohw/boss-cli)](https://www.npmjs.com/package/@joohw/boss-cli)
[![license](https://img.shields.io/github/license/joohw/boss-cli)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/joohw/boss-cli)](https://github.com/joohw/boss-cli)

官网主页：[boss-cli.com](https://boss-cli.com)

**boss-cli**（`@joohw/boss-cli`）是开源的 **Boss直聘自动化命令行工具**。基于 Puppeteer / CDP 协议驱动本机 Chrome，无需 Selenium，把 Boss直聘 B 端的核心 HR 操作搬进终端：**候选人列表**、**批量发消息**、**自动打招呼**、**在线简历预览**、**深度搜索**、**职位管理**。

适合 HR 日常提效，也适合 Claude / GPT / Gemini 等 **AI Agent** 通过子进程调用，搭建全自动化招聘流水线。

```bash
npm install -g @joohw/boss-cli@latest
boss login
boss help
```

> 纯 CLI，不内置对话式 Agent。每条命令输出结构化纯文本，Agent 可直接解析并编排多步流程。

---

## 为什么选择 boss-cli？

| 场景 | 命令 |
| --- | --- |
| Boss直聘批量发消息 | `boss send --text "..."` 配合脚本循环 |
| Boss直聘自动打招呼 | `boss greet <姓名> [--job <岗位>]` |
| Boss直聘候选人筛选 | `boss list` / `boss list --unread` |
| Boss直聘脚本自动化 | 本机 Chrome + CDP，Cookie 本地存储 |
| AI 招聘 Agent | 子进程调用，输出 Agent 友好 |
| 数据隐私 | 不经过第三方服务器，数据在 `~/.boss-cli/` |

---

## 安装

**要求**：Node.js ≥ 20，本机已安装 Chrome / Chromium。

```bash
npm install -g @joohw/boss-cli@latest
boss help
```

### 安装本 fork（含尚未进入上游的修复）

本仓库是 [`joohw/boss-cli`](https://github.com/joohw/boss-cli) 的 fork，包含风控页反弹熔断等
上游尚未发布的修复，以 `@viyzhu/boss-cli-fork` 单独发布：

```bash
npm install -g @viyzhu/boss-cli-fork@latest
boss version
```

两个包提供同名的 `boss` 命令，**不要同时装**；换装前先 `npm uninstall -g @joohw/boss-cli`。
也可以直接装仓库 tarball（等价于 main 最新提交）：

```bash
npm install -g https://github.com/Viy1204/boss-cli/archive/refs/heads/main.tar.gz
```

> 别用 `npm i -g github:Viy1204/boss-cli`：npm 会把全局包链到 npm cache 里的临时 clone，
> 缓存清理后 `boss` 直接 `Cannot find module`。

如果你觉得 boss-cli 好用，欢迎给本仓库一个 Star；使用中遇到问题请提交 Issue，新功能或改进也欢迎提交 PR。

> **macOS / Linux 权限问题**：系统 Node 默认全局前缀在 `/usr/local`，当前账户无写权限。建议先把全局前缀挪到用户目录（一次性配置）：
>
> ```bash
> mkdir -p ~/.npm-global
> npm config set prefix ~/.npm-global
> echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc   # bash 用 ~/.bash_profile
> source ~/.zshrc
> ```
>
> 使用 `fnm` / `nvm` / `volta` 的用户可跳过此步。Windows 用户无需此步。

---

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `boss login` | 打开 Boss直聘登录页（扫码/验证后手动完成） |
| `boss update` | 通过 npm 安装最新版 boss-cli |
| `boss reload` | 显式刷新当前已登录的 Boss 主壳页并检查侧栏；作废旧搜索快照，需重新执行查询，不接受参数 |
| `boss shutdown` | 关闭常驻浏览器，保留登录态；下条命令按现有配置重新启动 |
| `boss list [--unread]` | 读取聊天列表；`--unread` 仅未读 |
| `boss chat <姓名> [--strict]` | 打开指定候选人会话 |
| `boss chat [姓名] --index <序号> [--unread] [--strict]` | 按 `boss list` 输出序号打开会话；同名候选人建议用序号 |
| `boss send [--text <内容>]` | 向当前会话发送消息 |
| `boss action <操作>` | 索要简历 / 不合适 / 备注 / 交换微信等 |
| `boss recommend [岗位关键字]` | 读取推荐候选人列表 |
| `boss search [关键词] [--job] [--city] [--degree(-range)] [--school] [--exp(-range)] [--age(-range)] [--status] [--job-hop] [--major]` | 提供关键词查询牛人，可带城市 / 学历 / 院校 / 经验 / 年龄 / 求职状态 / 跳槽频率 / 专业筛选；无关键词仅进入表单并清除旧快照，不应用岗位/筛选、不输出结果（见下方「搜索筛选条件」） |
| `boss greet <姓名> [--job <岗位>]` | 在当前推荐/深度搜索页对候选人打招呼（不会自动跳转） |
| `boss greet [关键词] --index <序号> [--job <岗位>] [--dry-run]` | 搜索池打招呼。先 `boss search` 建立 15 分钟页面快照；后续按平台候选人标识、原卡片对象、完整资料与顺序校验身份，失效须重新搜索。关键词与序号须一致。正式执行优先账号权益，明确不足且确认不可用才切畅聊卡。提交确认不可撤回。`--dry-run` 仅在搜索池读取弹层后取消，推荐/深搜页会拒绝。提交确认不代表已发送或实际扣费，须人工核对 |
| `boss preview <姓名>` | 在线简历预览（每日次数有限） |
| `boss deep-search [岗位关键字] [--core <要求>] [--bonus <加分项>] [--clear-core] [--clear-bonus] [--match]` | 深度搜索表单状态；`--core` / `--bonus` 可重复，并按传入列表同步分组；`--clear-*` 清空分组；默认不输出候选列表，`--match` 输出最新 20 条 |
| `boss positions` | 读取职位列表 |
| `boss jd <名称>` | 抓取职位 JD 缓存到本地 |

完整用法：`boss help`；版本间的行为变更见 [CHANGELOG.md](./CHANGELOG.md)

---

搜索快照只保存在当前浏览器搜索 iframe 中，不写候选人资料到磁盘。旧版本搜索结果没有快照，升级后须重新 `boss search`。刷新页面、重建卡片、追加或重排列表、任何已读取资料变化及超过 15 分钟都会拒绝后续操作。`preview`、`greet --dry-run` 和正式 `greet` 不重写快照。开聊模式切换引起的按钮文案变化不属于身份资料。

不提供关键词的 `boss search` 只进入搜索页并清除旧快照，返回本次尚未查询的提示；即使页面已有关键词或候选列表也不复用旧结果，不应用岗位/筛选参数。只有显式提供关键词、取得匹配业务响应并通过结果校验，才输出候选结果和创建新快照。搜索 iframe URL 参数全空、卡片为零且提示「按回车键搜索」可以是合法初始表单，提供关键词后才会查询。

`search` 或 `recommend` 初始化超时会标明阶段、当前页面和原始超时信息。先在浏览器中确认登录和验证状态，再显式执行 `boss reload`；它只刷新当前已登录主壳并确认侧栏就绪，不代表候选结果已恢复。刷新会使旧搜索快照失效，之后需重新执行原只读命令，例如 `boss search TypeScript` 或 `boss recommend 前端工程师`。登录页、验证页和风险熔断状态须先人工处理；命令不会自动刷新或重新执行查询。已开始打招呼或发送的操作须核对平台状态，不能据此重试。

搜索初始化、切岗、清筛选和最终读取会等待请求空闲、真实 loading 消失及完整语义资料稳定，再校验当前主 URL、可见 iframe 绑定、岗位标签与选中项、关键词和指定城市。关键词搜索须取得本次 `geeks.json` 响应，精确匹配 keywords、page=1 与岗位 jobId，HTTP2xx、业务 code=0 后再核对响应和当前列表的 encryptGeekId 顺序完全一致。每次有关键词的查询先确保不限职位，提供 --job 时再选择唯一目标，因此重复相同岗位也重新建立同次选择触发的 getFilterConditions.encryptJobId 绑定；不限职位的 jobId 必须为空。窗口最小化时，主壳、侧栏导航、搜索及推荐列表和选岗的非动画状态等待使用 100ms 数值轮询，保留用户窗口状态。

经历与教育读取完整日期和 tooltip 的真实 `.t-tooltip-slot` 文本，排除 tooltip 浮层重复副本；真实资料变化仍使快照失效。`positions` 只读取 `/web/frame/job_v2/list` 的当前职位卡片。页面统计有职位但没有读到卡片时会报错，不能输出成功的零职位。

当前 UI 已验证卡片 Vue 组件 `$props.geek.geekCard.encryptGeekId` 与结果响应逐项对应。快照同时校验该标识、原 DOM 对象与完整资料；标识缺失会停止，同一 DOM 换人但资料相同也会失配。该标识仅用于当前平台会话，不承诺永久或跨平台稳定。搜索池 dry-run 会点击沟通入口；只在出现确认弹层时取消。入口点击后没有弹层时，CLI 会要求人工核对，不能承诺平台没有直接发送。

## 快速上手

```bash
# 1. 登录
boss login

# 2. 查看未读候选人
boss list --unread

# 3. 打开会话并发送消息
boss chat 张三
boss send --text "您好，请问方便发一下简历吗？"

# 同名或姓名定位失败时，按 list 序号打开；--unread 对应 list --unread 的序号
boss chat --index 2 --unread
boss chat 张三 --index 2 --unread --strict

# 4. 先进入推荐页，再在当前页打招呼
boss recommend 前端工程师
boss greet 张三 --job 前端工程师

# 5. 常规搜索牛人（可带筛选）
boss search "langgraph"
boss search "短视频" --city 深圳 --school 统招本科
boss search "投放" --job 数字广告 --degree 本科及以上
boss search "剪辑" --status 离职-随时到岗 --major 计算机科学与技术

# 6. 深度搜索：按传入列表同步分组条件，但不消耗匹配次数
boss deep-search --core "AI产品经理" --core "做过 RAG 或 Agent 产品落地" --bonus "有 ToB 平台经验"

# 只有明确添加 --match 才会点击「立即匹配」，会消耗今日匹配次数，并只输出最新 20 条
boss deep-search --match
```

---

## 搜索筛选条件

`boss search` 可以把平台自带的筛选条件一起设好再搜，省掉「搜出一大堆再人工剔」。

**提供关键词时先检查并清除旧筛选**，再按本次参数重设；没有残留时不重复点击清空。也就是说：这一轮生效的条件
只有你这条命令里写的，上一条命令设过的不会粘下来。

| 参数 | 说明 |
|---|---|
| `--job <岗位关键字>` | 岗位下拉里模糊匹配并切换。**不传则切「不限职位」** |
| `--city <城市>` | 如 `--city 深圳`。不传则读 `BOSS_SEARCH_CITY`，仍为空就不碰城市控件 |
| `--degree <学历>` | 不限 / 本科及以上 / 硕士及以上 / 博士 |
| `--school <院校要求>` | 统招本科 / 双一流院校 / 211院校 / 985院校 / 留学生 / QS 100 / QS 500 / 只看第一学历。多选用逗号分隔，中英文逗号都认 |
| `--degree-range <下限-上限>` | 自定义学历区间（拖滑块），如 `大专-本科`。两端取值：初中及以下 / 中专/中技 / 高中 / 大专 / 本科 / 硕士 / 博士。与 `--degree` 互斥 |
| `--exp <经验要求>` | 在校/应届 / 25年毕业 / 26年毕业 / 26年后毕业 / 1-3年 / 3-5年 / 5-10年。单选 |
| `--exp-range <下限-上限>` | 自定义经验区间（拖页面上那个滑块），如 `3-8`。两端收 `应届`、1-10 的整数年、`10+`。与 `--exp` 互斥 |
| `--age <年龄要求>` | 20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上。单选 |
| `--age-range <下限-上限>` | 自定义年龄区间，如 `23-27`。两端收 16-46 的整数、`46+`。与 `--age` 互斥 |
| `--status <求职状态>` | 离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 / 在职-月内到岗。可多选 |
| `--job-hop <跳槽频率>` | 5年少于3份 / 时间≥1年。单选；`≥` 可以写成 `>=` |
| `--major <专业>` | 只认完全匹配的专业名（如「计算机科学与技术」）。可多选，最多 10 个 |

```bash
export BOSS_SEARCH_CITY=深圳          # 每次都从深圳搜，不用每条命令都带 --city
boss search "短视频" --school 统招本科,985院校
boss search "剪辑" --status 离职-随时到岗 --major 计算机科学与技术
boss search "剪辑" --degree-range 大专-本科 --exp-range 3-8 --age-range 24-32
```

生效的条件会回显在结果标题里，便于确认这一轮到底按什么口径搜的：

```
常规搜索结果（关键词：剪辑；当前岗位：不限职位；城市：深圳；院校：统招本科；在职-考虑机会/离职-随时到岗；专业：软件工程/计算机科学与技术）
共 15 人
```

几个要注意的点：

- **有关键词的查询不传 `--job` 会切「不限职位」**，而不是沿用上次的岗位。以前跨命令沿用平台上的残留状态，
  同一条命令跑两次可能搜的是两个池子。**这是相对 0.7.x 的行为变更。**
- **城市只认完全匹配**。`--city 深圳市` 匹配不到就直接报错并列出候选，不会替你猜——
  猜错的代价是整轮搜索白跑且你不知道。`--major` 同理。
- **城市不在「清空筛选」的范围内**，它会跨命令留着（换 `--job` 时平台会自己把它清掉）。
  但城市一直在标题里实时回显，所以不会出现「悄悄挂着」的情况。
- **`只看第一学历`** 这一项页面提示写的是「第一学历为全日制本科」，卡非全日制学历时用它，
  比事后按「年龄减年限」推算可靠。
- 标题里的每一项都是**从页面实时读出来的**，不是把你传的参数原样打印——所以标题里没写的条件
  就是真没生效，写了的就是真生效了。
- `--major` 传多个时会**一个一个开弹层选**（平台的搜索框选中一项后就不再出联想，只能关掉重开），
  所以专业越多，这条命令越慢。
- 学历 / 经验 / 年龄的**自定义区间**用 `--degree-range` / `--exp-range` / `--age-range`，和对应的预设参数互斥
  （页面上本来就是二选一，选了自定义，预设那排的「不限」会自动取消）。
  `--degree-range` / `--exp-range` 是真的去拖那个滑块，比点选项慢几秒，而且拖完会按滑块的真实档位校验、
  不对就重拖——**拖偏一格就是搜错人群，且标题上看不出来**，所以宁可慢也不赌。
- 平台自带的「性别」「薪资区间」「牛人活跃度」「牛人职位要求」「资格证书」也没做
  （资格证书那一项平台本身就是隐藏的）。

---

## 与 AI Agent 集成

boss-cli 每条命令输出纯文本，适合 LLM 通过子进程编排：

```
1. boss list --unread     → 获取未读候选人
2. boss chat <姓名>       → 打开会话
   同名时用 boss chat [姓名] --index <序号> [--unread]
3. boss action resume     → 索要简历
4. boss send -t "..."     → 发送消息
5. boss recommend         → 读取推荐列表
6. boss search <关键词>   → 读取常规搜索列表
7. boss greet <姓名>      → 批量打招呼
```

详见 [AGENTS.md](./AGENTS.md)。

---

## 常见问题

**boss-cli 是什么？**
开源 Boss直聘自动化 CLI，用终端命令代替手动操作 Boss直聘网页，支持 AI Agent 编排。

**和 Selenium / Playwright 有什么区别？**
boss-cli 基于 CDP 连接本机 Chrome，复用已有登录态，针对 Boss直聘 B 端页面做了专用封装，开箱即用。

**需要额外下载浏览器吗？**
不需要。使用本机已安装的 Chrome / Chromium，通过 CDP 协议连接。

**数据会上传到服务器吗？**
不会。Cookie 和缓存仅存储在本地 `~/.boss-cli/`，CLI 不经过任何第三方服务器。

**浏览器是有头还是无头？能不能藏起来？**

**默认有头**（真窗口，和上游一致）。代价是窗口启动时会抢一次键盘焦点。

**不建议改成无头。** 本 fork 2026-08-19 之前默认无头，理由是不抢焦点；后来观测到两个独立的账号事故都指向无头，于是翻回有头：

- 一个账号被 BOSS 限制 **web 端登录**，页面文案明确写「检测到您的账号存在使用第三方招聘管理系统、插件、外挂、软件等辅助工具」——判定的是**工具指纹**，不是打招呼频率。
- 另一个团队用上游版（默认有头）长期没事，他们的 AI 擅自改走无头之后当天封号。

无头 Chrome 的 `User-Agent` 会自报 `HeadlessChrome/<ver>`，而 Client Hints 仍说 `Google Chrome`——这个自相矛盾本身就是强信号。

**注意 liepin-cli 那边默认仍是无头**：猎聘的风控形态一次都没观测过，没有证据支持翻它的默认。所以 `RECRUIT_BROWSER_HIDDEN` 的语义是**统一覆盖开关**而非「提供默认值」——不设时两个 CLI 各用自己的默认（boss 有头、liepin 无头），显式设了才把两家拉平。

真要无头（清楚这是在拿账号冒险）：

```bash
RECRUIT_BROWSER_HIDDEN=true boss list      # 招聘工具链共读的开关（boss / liepin / DSH 面板都认）
BOSS_BROWSER_HEADLESS=true boss list       # 只影响 boss-cli，优先级更高
```

**换了变量不会让已经在跑的那只切换模式** —— 先 `boss shutdown` 关掉它，下条命令才会按新模式重启。

**窗口会不会弹到前台？** 每条命令开头会把 Boss 标签页激活（`bringToFront`），Windows 上这会把**最小化**的窗口还原并抢焦点。现在的规则：窗口已被你最小化就不动它；想彻底禁止抢前台（比如把 CLI 接进后台系统定时跑），设：

```bash
BOSS_BROWSER_NO_FOREGROUND=true boss list
```

`boss login` 不受此开关影响，扫码必须看得见。

浏览器跨命令常驻（命令结束只断 CDP、不关窗口），跑完想释放内存就 `boss shutdown`（登录态保留）。

`boss login` **一直是有头的** —— 扫码必须看得见。真开了无头，它也会自己把无头实例关掉、以有头重启（登录态在 `~/.boss-cli/.cache/` 里，不会丢）。

想在不切窗口的前提下看浏览器在做什么，用 recruiting-copilot 的 DSH「招聘浏览器」面板：把画面推到 Web UI 里。**面板默认折叠、默认只读**——在面板里手动操作不受本 CLI 那套页面守卫的保护（守卫挂在 CLI 进程的 CDP session 上，进程一退出就全失效），所以招聘动作请走命令。

**如何自定义操作蒙层品牌？**
设置环境变量 `BOSS_CLI_AGENT_BRAND=你的品牌名`。

**`boss preview` 报「截图疑似空壳」是什么意思？**

截出来的 PNG 只有水印、没有简历正文。连续 preview 很多人时会出现（[recruiting-copilot#37](https://github.com/Viy1204/recruiting-copilot/issues/37)：约第 9 人起稳定复现，但**人眼看浏览器里正文是在的**，所以是截图路径的问题，不是平台不让看）。

0.7.2 起遇到这种情况会**直接报错**，不再假报成功；PNG 仍然落盘，方便你自己看。判据是 PNG 字节数 / 截图像素数，两个可调项：

```bash
BOSS_RESUME_BLANK_BYTES_PER_PIXEL=0.015   # 空壳阈值，设 0 关掉这个检查
BOSS_RESUME_SCREENSHOT_VIEWPORT_HEIGHT=1600   # 截图时临时拉高的视口高度（默认 5000）
```

如果报错里还提到「有 N 个可见在线简历面板」，说明上一次弹层没关净、截到了残留的旧面板 —— `boss shutdown` 重启浏览器可恢复。

**别把 preview 当批量工具**：它吃平台的每日查看额度，也是最容易踩上面这些坑的路径。先用列表卡片做硬否决，只对强候选 preview，其余走「打招呼 → 要简历附件」。

---

## 数据目录

| 路径 | 内容 |
| --- | --- |
| `~/.boss-cli/.cache/` | Cookie、浏览器用户数据 |
| `~/.boss-cli/jd/` | `boss jd` 缓存的岗位描述 |

---

## 开发

```bash
npm run build   # 编译到 dist/
npm run dev     # build + 交互模式
```

---

## 发布

仓库通过 GitHub Actions 自动发布，工作流文件是 `.github/workflows/tag-publish.yml`。

发布新版本时，本地只需要更新 `package.json` 版本号、提交代码、创建并推送 `v*` tag：

```bash
git tag -a v0.7.0 -m "v0.7.0"
git push origin main
git push origin v0.7.0
```

tag 推送后，workflow 会自动安装依赖、构建、检查 npm 版本、发布、更新 `latest` dist-tag，并创建或更新 GitHub Release。
本地不需要手动执行 `npm publish`。

**别用 `gh release create` 顺带建 tag**：那样 tag 是 Releases API 在服务端建的，
GitHub **不会**为它发 `push` 事件，`on: push.tags` 因此不触发（v0.6.8 和 v0.7.0 就是这么漏掉的，
最后靠手动 `workflow_dispatch` 才发出去）。workflow 现在额外挂了 `release: [published]` 兜底，
所以先建 Release 也能发；但推荐仍是先 `git push origin vX.Y.Z`，让 Release 由 workflow 自动生成。

**发的是哪个包**：workflow 用 `node -p "require('./package.json').name"` 取包名，所以本 fork 发布的是
**`@viyzhu/boss-cli-fork`**，不是上游的 `@joohw/boss-cli`。（此处此前写着上游包名，已订正。）

npm 发布依赖仓库 Secret `NPM_TOKEN`；**没配这个 secret 时 workflow 会打印
`NPM_TOKEN secret is missing; skipping publish.` 然后跳过发布，tag 推送本身仍然"成功"**——
所以推完 tag 要去 Actions 里确认那一步真的跑了。同名同版本已发布过时也会跳过。

---

## 许可

[GPL-3.0](./LICENSE)

---

## 相关链接

- 官网：[boss-cli.com](https://boss-cli.com)
- npm：[@joohw/boss-cli](https://www.npmjs.com/package/@joohw/boss-cli)
- GitHub：[joohw/boss-cli](https://github.com/joohw/boss-cli)
- 问题反馈：[Issues](https://github.com/joohw/boss-cli/issues)
