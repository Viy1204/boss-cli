# boss-cli · BOSS 直聘命令行工具

[![npm version](https://img.shields.io/npm/v/@viyzhu/boss-cli-fork)](https://www.npmjs.com/package/@viyzhu/boss-cli-fork)
[![license](https://img.shields.io/github/license/Viy1204/boss-cli)](./LICENSE)

这里是 [Viy1204/boss-cli](https://github.com/Viy1204/boss-cli)，基于 [joohw/boss-cli](https://github.com/joohw/boss-cli) 维护的 fork。npm 包名是 **`@viyzhu/boss-cli-fork`**，安装后的命令仍是 `boss`。

boss-cli 通过 Puppeteer 和 CDP 驱动本机浏览器，操作 BOSS 直聘招聘端。你可以读取聊天列表、候选人摘要、推荐和搜索结果，按需保存在线简历截图，也可以向已确认的候选人发送消息或打招呼。它输出纯文本，不内置对话式 Agent，也不提供 JSON 输出参数。

本 fork 维护搜索条件与结果校验、搜索池候选人定位、浏览器跨命令复用、验证页循环中止和简历截图等行为。当前源码版本为 0.8.5，使用变化见 [CHANGELOG.md](./CHANGELOG.md)。平台页面、账号权限和额度仍决定命令能否执行。

## 和招聘工具链的关系

| 项目 | 用途 |
| --- | --- |
| 本仓库 `boss-cli` | BOSS 直聘的命令行操作，可单独使用，也可供 Agent 调用 |
| [recruiting-copilot](https://github.com/Viy1204/recruiting-copilot) | 招聘工作流与进展看板，编排岗位梳理、寻源、初筛和面试协作 |
| [liepin-cli](https://github.com/Viy1204/liepin-cli) | 猎聘的命令行工具，使用独立命令和登录态 |

需要整套招聘流程时，从 recruiting-copilot 开始。只处理 BOSS 直聘时，可以直接安装本 CLI。

## 安装本 fork

准备以下环境：

- Node.js。建议使用仍受支持的 22 或更高版本，仓库发布流程使用 22。`package.json` 未声明 `engines`，锁定依赖的 Node.js 下限为 18；这不等于本项目验证了所有 18 及以上版本。
- 本机 Chrome、Edge 或 Chromium。CLI 使用 `puppeteer-core`，安装时不附带浏览器。
- 可登录 BOSS 直聘招聘端的账号，并具备所用功能的权限和额度。

```bash
npm install -g @viyzhu/boss-cli-fork@latest
```

安装后核对包名和版本。

```bash
boss version
```

再查看命令帮助。

```bash
boss help
```

`boss version` 显示安装包名和版本，并查询 npm 更新。应看到 `@viyzhu/boss-cli-fork`。`boss update` 根据当前安装包的包名更新，fork 会更新到 `@viyzhu/boss-cli-fork@latest`。

如果已安装上游包，先卸载上游再安装 fork。两者都提供 `boss` 命令，不要同时安装。

```bash
npm uninstall -g @joohw/boss-cli
```

```bash
npm install -g @viyzhu/boss-cli-fork@latest
```

需要安装 GitHub 上的当前源码包时，使用分支 tarball。它跟随 `main`，不固定版本。

```bash
npm install -g https://github.com/Viy1204/boss-cli/archive/refs/heads/main.tar.gz
```

仓库已跟踪编译后的 `dist/`。避免使用 `npm install -g github:Viy1204/boss-cli`，该安装方式曾出现命令链接依赖 npm 临时缓存、清缓存后失效的问题。

如果未找到浏览器，将 `CHROME_PATH` 或 `PUPPETEER_EXECUTABLE_PATH` 设为浏览器可执行文件的绝对路径。macOS 和 Linux 若遇到全局安装权限问题，使用 Node 版本管理器或可写的 npm 全局目录，并将其命令目录加入 `PATH`。

## 登录并读取候选人资料

### 1. 完成人工登录

```bash
boss login
```

浏览器打开登录页后，在窗口中完成扫码和验证。命令会立即返回，不等待或确认登录成功。Agent 调用时，在这里交还控制权，等用户完成登录再继续。

CLI 默认打开可见浏览器，并使用独立的本地浏览器数据目录。后续命令复用该浏览器和登录态。

### 2. 查看聊天列表与候选人摘要

```bash
boss list
```

只看未读列表。

```bash
boss list --unread
```

输出包含候选人序号。将下面的姓名和序号替换为实际列表中的人选。

按姓名精确匹配。

```bash
boss chat 张三 --strict
```

打开 `boss list --unread` 对应的第 2 人，并核对姓名。

```bash
boss chat 张三 --index 2 --unread --strict
```

序号从 1 开始，带 `--unread` 的序号只对应未读列表。

`chat` 输出候选人摘要、简历附件状态，以及当前页面已加载的聊天消息。它只打开已有会话，不向对方发送消息。聊天列表会变化，操作前核对当前候选人。

### 3. 按岗位查询候选人

```bash
boss positions
```

读取职位列表，确认岗位名称。岗位名称用你账号中的实际岗位替换。

```bash
boss recommend 前端工程师
```

进入推荐页，切换岗位并读取推荐列表。

```bash
boss search "TypeScript" --job 前端工程师 --city 深圳 --degree 本科及以上
```

进入常规搜索页并执行关键词查询。

有关键词的 `search` 会检查并清除旧筛选，再应用本次参数；不传 `--job` 会切到“不限职位”。不提供关键词的 `boss search` 只打开搜索表单并清除旧快照，不执行查询，也不应用岗位或筛选参数。

先根据列表资料筛选，再决定是否查看在线简历。搜索参数见下方参考。

### 4. 按需保存在线简历截图

在已经打开的候选人会话中读取在线简历：

```bash
boss action resume
```

在刚加载的推荐或常规搜索列表中预览候选人：

```bash
boss preview 张三
```

`preview` 要求当前已在推荐页或常规搜索页，且列表已加载。它不会自动切页，不支持 `--index` 或 `--job`。列表有重名或相同打码姓名时，先在网页核对目标。

这两条命令默认保存 PNG 并输出路径，不要求 OCR 密钥。平台对在线简历有每日查看额度，按需使用。

### 5. 结束浏览器会话

```bash
boss shutdown
```

普通命令结束只断开 CDP，浏览器仍常驻。`shutdown` 关闭浏览器并保留浏览器数据目录。登录是否仍然有效以平台为准，失效时重新运行 `boss login`。下条业务命令会重新启动浏览器。

## 命令参考

### 查询与资料读取

| 命令 | 行为与前提 |
| --- | --- |
| `boss list [--unread]` | 读取全部或未读聊天列表 |
| `boss chat <姓名> [--strict]` | 打开已有会话，默认包含匹配，`--strict` 精确匹配；输出摘要和当前已加载消息 |
| `boss chat [姓名] --index <序号> [--unread] [--strict]` | 按聊天列表序号打开会话，提供姓名时同时校验姓名 |
| `boss recommend [岗位关键字]` | 进入推荐页，可按岗位关键字切岗，读取推荐列表 |
| `boss search [关键词] [筛选参数]` | 进入搜索页，显式提供关键词才查询并输出本轮结果 |
| `boss preview <姓名>` | 在当前推荐或搜索列表预览在线简历并保存截图，消耗平台查看额度 |
| `boss action resume` | 在当前候选人会话打开在线简历并保存截图，受平台权限与额度限制 |
| `boss action history` | 在当前候选人会话读取“同事沟通”和“我的沟通”记录 |
| `boss positions` | 读取职位及开放、待开放、已关闭状态 |
| `boss jd <名称>` | 读取指定职位 JD，缓存到 `~/.boss-cli/jd/`；命中已有缓存时直接返回缓存 |

### 发送消息与处理会话

以下命令会直接执行平台操作。交给 Agent 或脚本调用前，先确认候选人、岗位、消息内容和允许使用的额度。CLI 不会额外等待逐项人工批准。

| 命令 | 行为与前提 |
| --- | --- |
| `boss send --text <内容>` | 向当前已打开会话发送文本，`-t` 是 `--text` 的别名 |
| `boss send --text <内容> --request-resume` | 发送文本后继续执行“求简历”操作 |
| `boss action request-attachment-resume` | 点击“求简历”并确认发送平台默认话术；需双方各至少发过一条消息 |
| `boss action agree-resume` | 同意接收候选人发送的附件简历请求，不是下载附件命令 |
| `boss action remark --remark <备注>` | 保存当前候选人的备注 |
| `boss action not-fit` | 将当前候选人标记为不合适 |
| `boss action wechat` | 发起交换微信并确认 |
| `boss greet <姓名> [--job <岗位>]` | 在当前已加载的推荐列表打招呼，不自动切页 |
| `boss greet [关键词] --index <序号> [--job <岗位>] [--dry-run]` | 在搜索池定位并操作人选，受下方快照与确认规则约束 |

`action resume` 是读取在线简历，索要附件简历用 `action request-attachment-resume`。`send` 一次发送给当前会话，`greet` 一次操作一个人选。CLI 没有批量发送命令。

### 搜索池打招呼的边界

先运行带关键词的 `boss search`，核对输出，再对本轮目标执行 `greet --index`。该序号属于搜索列表，与 `chat --index` 的聊天列表序号不同。

- 搜索快照只存在当前浏览器搜索页中，最多有效 15 分钟，不单独把候选人资料写入磁盘。
- 快照绑定平台候选人标识、原卡片对象、完整资料和列表顺序。刷新、换序、追加卡片、资料变化、DOM 重建或过期后会停止，须重新搜索。该标识不承诺跨平台或永久稳定。
- 关键词和 `--index` 同时提供时，必须指向同一张卡片。
- 正式执行优先使用账号权益。仅在弹层明确显示权益不足且确认不可用时，才切换并验证畅聊卡模式。切换开聊模式会影响后续平台操作。
- `--dry-run` 仅支持搜索池，会点击沟通入口，读取确认弹层后取消，不点最终确认，也不修改持久开聊模式。推荐页不支持此参数。入口点击后若没有弹层，须人工核对平台状态，不能保证没有直接发送。
- 提交确认不可撤回。命令退出成功或弹层关闭，只能说明已提交确认，不证明已发送或实际扣费。核对平台会话和额度后再登记结果，结果不明时不要自动补发。

### 会话与版本管理

| 命令 | 行为 |
| --- | --- |
| `boss login` | 打开可见登录页，交给人工登录和验证 |
| `boss reload` | 刷新当前已登录主壳页并检查侧栏，作废旧搜索快照；不接受参数，不自动重做查询或发送 |
| `boss shutdown` | 关闭常驻浏览器，保留浏览器数据目录；登录是否有效以平台为准 |
| `boss version` | 显示包名与版本，并查询 npm 更新 |
| `boss update` | 通过 npm 全局更新当前安装包 |
| `boss help` 或 `boss --help` | 显示完整命令与参数 |

直接运行不带参数的 `boss` 不进入交互模式。交互模式仅供源码开发时的 `npm run dev` 使用。

## 搜索筛选条件

这些参数仅在 `boss search` 显式提供关键词时生效。提供关键词的查询会清除旧的学历、院校、经验、年龄和其他筛选，再应用本次参数。城市独立处理。

| 参数 | 取值与规则 |
| --- | --- |
| `--job <岗位关键字>` | 匹配唯一岗位并切换；不传则切“不限职位” |
| `--city <城市>` | 城市联想项必须完全匹配，如 `深圳`。不传时读 `BOSS_SEARCH_CITY`，仍为空则不操作城市控件，并非强制不限城市 |
| `--degree <学历>` | 不限、本科及以上、硕士及以上、博士 |
| `--degree-range <下限-上限>` | 如 `大专-本科`。两端取值为初中及以下、中专/中技、高中、大专、本科、硕士、博士。与 `--degree` 互斥 |
| `--school <院校要求>` | 统招本科、双一流院校、211院校、985院校、留学生、QS 100、QS 500、只看第一学历。可多选 |
| `--exp <经验>` | 在校/应届、25年毕业、26年毕业、26年后毕业、1-3年、3-5年、5-10年。单选 |
| `--exp-range <下限-上限>` | 如 `3-8`。两端接受 `应届`、1 至 10 的整数、`10+`。与 `--exp` 互斥 |
| `--age <年龄>` | 20-25、25-30、30-35、35-40、40-50、50以上。单选 |
| `--age-range <下限-上限>` | 如 `23-27`。两端接受 16 至 46 的整数、`46+`。与 `--age` 互斥 |
| `--status <求职状态>` | 离职-随时到岗、在职-暂不考虑、在职-考虑机会、在职-月内到岗。可多选 |
| `--job-hop <跳槽频率>` | 5年少于3份、时间≥1年。单选，`≥` 可写成 `>=` |
| `--major <专业>` | 专业名必须完全匹配，如 `计算机科学与技术`。可多选，最多 10 个 |

多选值用半角或全角逗号分隔，含空格的参数值用引号包裹。

```bash
boss search "短视频" --city 深圳 --school "统招本科,985院校"
```

```bash
boss search "剪辑" --status "离职-随时到岗,在职-考虑机会" --major 计算机科学与技术
```

```bash
boss search "剪辑" --degree-range 大专-本科 --exp-range 3-8 --age-range 24-32
```

城市不属于“清空筛选”的范围，可能沿用页面已有值，换岗时也可能被平台清除。需要固定城市时，每次显式传 `--city`，或配置 `BOSS_SEARCH_CITY`。结果标题读取页面实际条件，检查标题后再使用结果。

CLI 会核对本次关键词、岗位响应和当前卡片的候选人标识顺序，通过后才输出结果并创建快照。性别、薪资区间、牛人活跃度、牛人职位要求和资格证书没有对应的 CLI 筛选参数。

## 配置与本地数据

可将配置放在 `~/.boss-cli/.env`，每行写一个 `KEY=VALUE`。程序也读取当前工作目录的 `.env`。不要把含密钥或候选人数据的文件提交到仓库。

| 配置 | 用途 |
| --- | --- |
| `CHROME_PATH` 或 `PUPPETEER_EXECUTABLE_PATH` | 浏览器可执行文件的绝对路径 |
| `BOSS_SEARCH_CITY` | `search` 未传 `--city` 时使用的城市 |
| `BOSS_BROWSER_NO_FOREGROUND=true` | 普通命令不主动把浏览器切到前台；`login` 仍会显示窗口，简历截图可能临时调整窗口 |
| `BOSS_BROWSER_HEADLESS` | 本 CLI 的无头模式覆盖项，优先于 `RECRUIT_BROWSER_HIDDEN`；未设置时跟随共读开关，仍无有效值时默认有界面 |
| `RECRUIT_BROWSER_HIDDEN` | 招聘工具链共用的浏览器隐藏开关；本 CLI 在未收到有效覆盖时默认有界面 |
| `BOSS_RESUME_OCR=1` | 显式开启百度在线 OCR，默认关闭 |
| `BOSS_CLI_AGENT_BRAND` | 自定义操作蒙层上的品牌名 |

改变有头或无头配置后，先执行 `boss shutdown`，下条命令才按新配置启动。已有浏览器会直接复用，不会即时切换。`boss login` 始终使用可见窗口。

需要 OCR 时，设置 `BOSS_RESUME_OCR=1`，并配置 `BOSS_BAIDU_API_KEY` 和 `BOSS_BAIDU_SECRET_KEY`。代码也接受 `API_KEY` 和 `SECRET_KEY`。OCR 会将在线简历截图发送给百度服务，使用前确认数据授权与该服务的额度。已有密钥也不会自动开启 OCR；开启后缺少密钥或识别失败会报错。

| 路径 | 内容 |
| --- | --- |
| `~/.boss-cli/.cache/browser-data/` | 默认浏览器用户数据和会话数据；登录是否有效以平台为准 |
| `~/.boss-cli/.cache/resume-screenshots/` | 在线简历 PNG 截图 |
| `~/.boss-cli/.cache/ocr/` | 开启 OCR 后生成的文本 |
| `~/.boss-cli/jd/` | 职位 JD 缓存 |
| `~/.boss-cli/.env` | 用户配置，可包含 OCR 密钥 |

CLI 本身不内置模型服务。浏览器会访问 BOSS 直聘，版本检查会访问 npm，显式开启 OCR 后会访问百度。外部 Agent 如何处理命令输出和截图，由调用方的配置决定。

## 已知限制与故障处理

### 深度搜索暂不可用

`boss deep-search` 仍保留命令入口，但实现依赖已下线的 `/web/chat/aiform`。新版深度搜索在 `/web/chat/search/ai`，本 CLI 尚未迁移。需要该功能时，先在网页端人工使用。

`boss help` 仍列出 `--core`、`--bonus`、`--clear-core`、`--clear-bonus` 和 `--match`，这些是旧页面参数，不表示新版已适配。旧实现中只有 `--match` 才点击“立即匹配”并消耗次数。

### 登录、验证或初始化超时

遇到验证页、反复跳转或账号限制时，停止自动操作，在可见浏览器中检查平台提示并人工处理。工具不能替代平台授权，也不保证账号不会受限。

`search` 或 `recommend` 初始化超时会带阶段和当前页面信息。确认登录、验证均完成且能正常进入主界面后，可以显式执行：

```bash
boss reload
```

刷新成功后，重新执行只读查询。

```bash
boss search "TypeScript" --city 深圳
```

`reload` 成功只代表主壳与侧栏就绪。它会作废旧搜索快照，之后重新运行所需的只读查询。已经开始发送或打招呼的操作，先核对平台结果，不据此重试。

### 在线简历截图疑似空壳

该错误表示截图检查发现疑似只有水印、缺少正文的 PNG。CLI 会报错并保留图片供检查，不应把该图片当作有效简历。

先打开输出路径确认正文。若错误同时提示有多个可见简历面板，可以关闭残留面板，或用 `boss shutdown` 重启浏览器，再重新查询目标。按需预览，避免逐人批量消耗查看额度。

## 源码开发与发布

```bash
git clone https://github.com/Viy1204/boss-cli.git
```

进入仓库目录。

```bash
cd boss-cli
```

安装依赖。

```bash
npm ci
```

编译 TypeScript。

```bash
npm run build
```

检查本地 CLI 的帮助输出。

```bash
node dist/cli/index.js --help
```

运行测试。

```bash
npm test
```

`npm run build` 编译到 `dist/`，`npm test` 先构建再运行 `tests/*.test.mjs`。`npm run dev` 构建后进入开发交互模式，输入 `exit` 或 `quit` 退出。

协作约定见 [AGENTS.md](./AGENTS.md)，页面与命令位置要求见 [docs/boss-url-map.md](./docs/boss-url-map.md)。

发布工作流是 [.github/workflows/tag-publish.yml](./.github/workflows/tag-publish.yml)，支持推送 `v*` 标签、发布 GitHub Release 和手动触发。它从 `package.json` 读取包名，发布本 fork 的 npm 包；预发布版本使用 `next`，正式版本使用 `latest`。先推送标签可由工作流生成 Release。

npm 发布依赖仓库 Secret `NPM_TOKEN`。缺少该 Secret 时，工作流会打印 `NPM_TOKEN secret is missing; skipping publish.` 并跳过 npm 发布；已有同版本也跳过发布。工作流成功不代表 npm 一定产生了新版本，维护者须检查发布步骤和 dist-tag。

## 许可与反馈

采用 [GPL-3.0](./LICENSE)。上游项目与作者信息保留在 [joohw/boss-cli](https://github.com/joohw/boss-cli)。

本 fork 的版本和问题反馈使用以下入口：

- [npm：@viyzhu/boss-cli-fork](https://www.npmjs.com/package/@viyzhu/boss-cli-fork)
- [GitHub：Viy1204/boss-cli](https://github.com/Viy1204/boss-cli)
- [问题反馈](https://github.com/Viy1204/boss-cli/issues)
- [版本记录](https://github.com/Viy1204/boss-cli/releases)
