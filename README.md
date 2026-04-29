# boss-cli

在终端里使用的 Boss 直聘沟通页自动化工具：**登录**、**候选人列表**、**打开会话**、**发送消息**，以及读取本地 `~/.boss-cli/jd` 岗位说明。本仓库是**纯 CLI**（不内置对话式 Agent），可由脚本或外层 Agent 通过子进程调用。

发布版本以 npm 为准；本地可执行 `boss version`（或 `ver`、`-v`、`--version`）查看当前版本并比对 registry 最新版。

---

## 依赖

- Node.js **≥ 20**
- 本机 **Chrome/Chromium**（不随包下载；由 Puppeteer 连接本机浏览器）

---

## 安装与本地运行

### 全局安装（推荐，免 sudo）

> macOS / Linux 用户：系统 Node 默认把 npm 全局前缀放在 `/usr/local`（Apple Silicon 是 `/opt/homebrew`），当前账户没有写权限，**任何** `npm install -g` 都会报 EACCES。先把全局前缀挪到用户目录（**一次性配置，所有全局包通用**）：
>
> ```bash
> mkdir -p ~/.npm-global
> npm config set prefix ~/.npm-global
>
> # zsh 用 ~/.zshrc，bash 用 ~/.bash_profile
> echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
> source ~/.zshrc
> ```
>
> 已经在用 `fnm` / `nvm` / `volta` 接管 Node 的可跳过此步——它们默认就把全局前缀放在 `~` 下。
>
> Windows 用户无需此步，npm 全局前缀本来就在用户目录。

```bash
npm install -g @joohw/boss-cli@latest
boss help
```

业务数据落在 `~/.boss-cli/` 用户目录下，由 CLI 进程自己创建。

> 不推荐用 `sudo npm install -g`：能装上，但全局 `node_modules` 会变成 root 所有，后续升级 / 卸载都得继续带 `sudo`，且任何带 postinstall 的包都会以 root 身份动你的 home。

### 从源码

```bash
npm install
npm run build
```

构建产物入口为 `dist/cli/index.js`，等价于命令 `boss`（见 `package.json` 的 `bin`）。

---

## 命令

与 `boss help` 一致：


| 用法 | 说明 |
| --- | --- |
| `boss` | 交互模式 |
| `boss help` | 打印帮助 |
| `boss version` / `ver` / `-v` / `--version` | 显示当前版本并检查 npm 是否有更新 |
| `boss login` | 打开登录页（不校验登录状态；需自行完成登录） |
| `boss list [--unread]` | 读取「全部」聊天列表候选人；`--unread` 仅显示未读 |
| `boss chat <姓名> [--strict]` | 打开指定联系人会话（须为已建立联系的候选人）；默认包含匹配，`--strict` 为精确匹配 |
| `boss action <操作> [--remark <备注>]` | 在当前聊天页已打开候选人详情时执行操作；操作见下 |
| `boss send [--text <内容>] [-t <内容>]` | 仅向当前会话发送文本消息 |
| `boss positions` | 读取当前职位列表（含开放/待开放/已关闭） |
| `boss jd <名称或序号>` | 抓取职位详情并缓存为 `~/.boss-cli/jd` 下同名 `.md` |
| `boss deep-search [岗位]` / `boss deep-search set ...` | 「深度搜索」：读列表或带岗触发「立即匹配」；`set` 仅配置表单条件 |
| `boss recommend [岗位关键字]` | 进入推荐页读取推荐列表；可传岗位关键字做模糊匹配切换 |
| `boss greet <姓名或序号>` | 在推荐页对指定候选人点击「打招呼」（有次数成本，请谨慎使用） |

**`action` 可用操作**：`resume`、`not-fit`、`remark`、`agree-resume`、`history`、`exchange-wechat`。操作为 `remark` 时必须提供 `--remark <备注>`。


**交互模式**

- 支持单引号/双引号包裹含空格的参数。
- 启动时 banner 会展示当前版本号与 GitHub/Issue 提示，命令执行期间会显示纯字符处理动画。
- 输入 `help` 查看帮助，`version` / `ver` 查看版本与更新提示，`exit` / `quit` 退出；**Ctrl+C** 正常退出

---

## 数据目录

默认数据在 `~/.boss-cli/.cache/`（Cookie、缓存、浏览器用户数据目录等），细节见 `src/config.ts`。仓库内 **[AGENTS.md](./AGENTS.md)** 供自动化/协作参考。

---

## 浏览器生命周期

命令结束（含一次性子命令）时**不会**关闭浏览器窗口：CLI 只断开与浏览器的 CDP 连接，便于 Node 进程退出，浏览器进程仍保留；需要时请自行关闭窗口。

交互模式（无参数 `boss`）退出时同样**不会**关闭浏览器。

---

## Headless / Headful（是否显示浏览器窗口）

- 默认 **headful**（显示浏览器窗口）。
- **`boss login`**：同样为有头（便于扫码/验证/手动登录）。
- 若希望其它命令**无头**运行：设置环境变量 `BOSS_BROWSER_HEADLESS=true`（或 `1` / `yes`）。

```bash
# macOS/Linux
export BOSS_BROWSER_HEADLESS=true

# Windows PowerShell
$env:BOSS_BROWSER_HEADLESS="true"
```

---

## 开发脚本


| 命令              | 作用                             |
| --------------- | ------------------------------ |
| `npm run build` | `tsc` 编译到 `dist/`              |
| `npm run dev`   | 先 `build` 再执行无参 `boss`（进入交互模式） |


---

## 许可

本项目以 **GNU General Public License v3.0**（**GPL-3.0**）发布，全文见仓库根目录 [LICENSE](./LICENSE)。