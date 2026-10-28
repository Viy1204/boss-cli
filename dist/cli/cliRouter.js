/**
 * CLI：子命令直接调用 toolset 中的 impl*。
 * 仅在 npm run dev 下无参数进入交互模式，逐行解析与 `boss <argv...>` 相同的命令。
 */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { closeRemoteBrowser, detachBrowserSession, probeRemoteHeadless, REMOTE_DEBUGGING_PORT, resolveHeadlessFromEnv, } from '../browser/index.js';
import { implChatAction, implLogin, implListCandidates, implListUnreadCandidates, implOpenChatByIndex, implListPositions, implListPositionsWithOptions, implNormalSearch, runReload, parseFilterLabels, implOpenChat, implRecommend, implPreview, implRecommendGreet, implSetBaiduCredentials, implBossSearch, implSendMessage, } from '../toolset/index.js';
import { printBossInteractiveBanner } from './banner.js';
import { printPackageUpdateNoticeIfDue, printVersionInfo, runPackageUpdate, } from './version.js';
import { acquireBusyLock, releaseBusyLock } from '../common/busy_lock.js';
class CliError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CliError';
    }
}
/**
 * 默认有头；`BOSS_BROWSER_HEADLESS` 显式覆盖，否则跟随共读的 `RECRUIT_BROWSER_HIDDEN`。
 * 与 `connectBrowser` 用的 `resolveHeadlessFromEnv` 同一套优先级（默认翻回有头的原因见那里）。
 */
function shouldRunHeadless() {
    return resolveHeadlessFromEnv();
}
function configureHeadlessForCommand(cmd) {
    if (cmd === 'login') {
        process.env.BOSS_BROWSER_HEADLESS = 'false';
        return;
    }
    process.env.BOSS_BROWSER_HEADLESS = shouldRunHeadless() ? 'true' : 'false';
}
/**
 * 一次性命令结束后：detach CDP，不关浏览器窗口。
 * 交互模式在循环内不调用；退出 REPL 时在 `runInteractiveLoop` 的 finally 里单独 detach（避免 Node 退出时拖死 Chrome）。
 */
async function cleanupAfterCommand(_cmd, nonInteractive) {
    if (!nonInteractive) {
        return;
    }
    await detachBrowserSession().catch(() => { });
}
function die(msg) {
    throw new CliError(msg);
}
/** `readline.question` 在 Ctrl+C 时会抛出 AbortError，视为正常结束而非业务错误 */
export function isReadlineAbortError(e) {
    if (e === null || typeof e !== 'object') {
        return false;
    }
    const err = e;
    return err.name === 'AbortError' || err.code === 'ABORT_ERR';
}
/** 类 shell 分词：支持双引号、单引号包裹含空格的参数 */
function splitShellLine(line) {
    const out = [];
    let cur = '';
    let quote = null;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (quote) {
            if (c === quote) {
                quote = null;
            }
            else {
                cur += c;
            }
            continue;
        }
        if (c === '"' || c === "'") {
            quote = c;
            continue;
        }
        if (/\s/.test(c)) {
            if (cur.length > 0) {
                out.push(cur);
                cur = '';
            }
            continue;
        }
        cur += c;
    }
    if (cur.length > 0) {
        out.push(cur);
    }
    return out;
}
/** 短命令为主；保留旧长名作为别名，避免已有脚本失效 */
function normalizeSubcommand(cmd) {
    switch (cmd) {
        case 'list-candidates':
            return 'list';
        case 'open-chat':
            return 'chat';
        case 'send-message':
            return 'send';
        case 'list-positions':
            return 'positions';
        default:
            return cmd;
    }
}
function printHelp() {
    console.error(`boss-cli — Boss 直聘浏览器自动化（纯 CLI，无 Agent 运行时）

用法与说明:
  boss
      无参数不支持交互模式；请使用 boss help 查看命令
      源码开发时通过 npm run dev 进入交互模式；提示符 boss>，exit / quit 退出；Ctrl+C 正常结束
  boss help | --help | -h
      显示本帮助
  boss version | ver（或 -v / --version）
      显示当前安装包名与版本，并检查 npm 是否有更新
  boss update
      通过 npm 全局更新当前安装包；本 fork 为 @viyzhu/boss-cli-fork
  boss shutdown
      关闭常驻浏览器，保留浏览器数据目录；登录是否有效以平台为准，下条业务命令会重新启动浏览器
      浏览器默认有头且跨命令常驻；BOSS_BROWSER_HEADLESS 优先于 RECRUIT_BROWSER_HIDDEN
      切换有头/无头配置后须先 boss shutdown，下条命令才按新配置启动
  boss reload
      刷新当前已登录的 Boss 主壳页并等待侧栏就绪；旧搜索快照失效，需重新执行原只读命令
      不接受参数；登录/验证页须先人工处理，不会自动刷新或重做招聘操作
  boss login
      打开可见登录页后立即返回，不等待或确认登录成功；请在浏览器中完成人工登录和验证
  boss list [--unread]
      读取「全部」聊天列表候选人；--unread 仅显示未读（角标>0）
  boss chat <姓名> [--strict]
      打开指定联系人会话；默认包含匹配，--strict 为精确匹配
  boss chat [姓名] --index <序号> [--unread] [--strict]
      按 boss list 输出的 1-based 序号打开会话；--unread 表示序号对应 boss list --unread
      同时提供姓名时会校验该序号候选人姓名，--strict 表示精确校验
      仅用于已建立联系的候选人（即在 list 里可见的会话对象）
  boss action <操作> [--remark <备注>]
      仅在当前聊天页已打开候选人详情时执行操作，并只返回 action 执行结果
      操作: resume | not-fit | remark | agree-resume | request-attachment-resume | history | wechat
      resume：直接读取在线简历，无须先索要附件或等对方回复；默认保存 PNG 并输出路径
      OCR 默认关闭，需显式设置 BOSS_RESUME_OCR=1 和百度密钥；仅识别截图，折叠内容不自动展开，不提供结构化简历 JSON
      agree-resume：同意接收附件简历请求；request-attachment-resume：工具栏「求简历」，确认后发送默认话术（需双方各至少发过一条消息）
      附件请求与在线简历读取独立；当前不提供附件下载命令
      操作为 remark 时必须提供 --remark
  boss send --text <内容> [--request-resume]
      向当前已打开的候选人会话发送文本；-t 是 --text 的别名
      --request-resume：发送后延迟片刻自动执行「求简历」操作
      返回仅确认已提交发送，不代表送达；后续求简历失败也可能已发出文本，请核对聊天记录后再决定是否重试
  boss positions
      读取当前职位列表（含开放/待开放/已关闭状态）；只读job_v2列表frame，统计有职位但无卡片时会报错
  boss jd <name>
      读取指定职位 JD，缓存到 ~/.boss-cli/jd/ 下的 .md；命中已有缓存时直接返回，不访问职位页
  boss recommend [岗位关键字]
      进入推荐页并读取推荐列表；带岗位关键字时先在岗位下拉中模糊匹配并切换
  boss search [关键词] [--job <岗位>] [--city <城市>] [--school <院校要求>]
              [--degree <学历>|--degree-range <下限-上限>]
              [--exp <经验要求>|--exp-range <下限-上限>]
              [--age <年龄要求>|--age-range <下限-上限>]
              [--status <求职状态>] [--job-hop <跳槽频率>] [--major <专业>]
      点击侧栏进入「搜索」页，不用goto重载；提供关键词才执行查询并输出经验证的结果
      无关键词仅进入表单并清旧快照，不应用岗位/筛选参数、不复用页面旧结果
      有关键词时先检查并清除旧筛选，再按参数重设；无残留不重复点击清空
      --job     先确保「不限职位」，再唯一匹配目标并绑定本次选岗请求；重复同岗位也重新绑定，不传只切不限职位
      --city    搜索城市，如 --city 深圳；不传则读环境变量 BOSS_SEARCH_CITY，仍为空则不操作城市控件
                城市不在清空筛选范围内，可能沿用页面已有值或被平台在换岗时清除；需要固定城市请显式指定
                只接受完全匹配的联想项，匹配不上会报错并列出候选，不会替你猜
      --degree  学历要求：不限 / 本科及以上 / 硕士及以上 / 博士
      --degree-range  学历要求的自定义区间（拖滑块），如 --degree-range 大专-本科；
                两端取值：初中及以下 / 中专/中技 / 高中 / 大专 / 本科 / 硕士 / 博士；与 --degree 互斥
      --school  院校要求，可多选用逗号分隔：统招本科 / 双一流院校 / 211院校 / 985院校 /
                留学生 / QS 100 / QS 500 / 只看第一学历（页面提示＝第一学历为全日制本科）
      --exp     经验要求，单选：在校/应届 / 25年毕业 / 26年毕业 / 26年后毕业 / 1-3年 /
                3-5年 / 5-10年
      --exp-range  经验要求的自定义区间（拖页面上那个滑块），如 --exp-range 3-8；
                两端收「应届」、1-10 的整数年、「10+」；与 --exp 互斥
      --age     年龄要求，单选：20-25 / 25-30 / 30-35 / 35-40 / 40-50 / 50以上
      --age-range  年龄要求的自定义区间，如 --age-range 23-27；
                两端收 16-46 的整数、「46+」；与 --age 互斥
      --status  求职状态，可多选用逗号分隔：离职-随时到岗 / 在职-暂不考虑 / 在职-考虑机会 /
                在职-月内到岗
      --job-hop 跳槽频率，单选：5年少于3份 / 时间≥1年（≥ 可以写成 >=）
      --major   专业，可多选用逗号分隔，最多 10 个；只认完全匹配（如「计算机科学与技术」）
      生效的筛选条件会回显在结果标题里，读的是页面实时状态而不是你传的参数
      最终验证当前可见搜索iframe及预期条件；geeks响应须匹配关键词/岗位、HTTP2xx且code0，候选人ID顺序与DOM一致后才创建快照
      隐藏/最小化时非动画DOM条件用100ms轮询；不改变用户窗口状态
  boss preview <姓名> 或 boss preview [姓名] --index <序号>
      直接预览在线简历，无须先打招呼或索要附件；须先运行 recommend 或带关键词的 search 加载当前列表
      须当前已在「推荐」(/web/chat/recommend) 或「常规搜索」(/web/chat/search)；不自动切换列表页
      --index 使用最近一次列表输出的 1-based 序号；同名须用序号，同时提供姓名时校验同一目标
      列表快照有效期15分钟；缺失、刷新、换序或资料变化会拒绝，请重新运行对应列表命令
      默认保存 PNG 并输出路径；OCR 默认关闭，不支持 --job；旧深搜页分支暂不可用
      注意：平台对在线简历每日可查看次数有限，请按需使用、谨慎查看
  boss greet <姓名> [--job <岗位关键字>]
      须当前已在「推荐」(/web/chat/recommend) 且列表已加载；不自动切换列表页；旧深搜页分支暂不可用
      对当前列表中的候选人点击“打招呼”
      可选 --job 先在岗位下拉中模糊匹配并切换（与 recommend 共用同一套选择逻辑）
      会消耗打招呼次数且单次成本较高，请谨慎使用
  boss greet [关键词] --index <序号> [--job <岗位关键字>] [--dry-run]
      当前在「常规搜索/搜索池」(/web/chat/search) 时生效；须先跑 boss search 加载列表
      --index 绑定最近一次 boss search 的页面快照，15 分钟有效；也可用唯一匹配的打码姓名/摘要关键词
      同时传关键词和 --index 时必须匹配同一张卡；列表自然刷新、沟通后卡片变化、换序、资料变化、DOM 重建或快照缺失/过期会停止，请重新 search
      详情打开后校验平台encryptGeekId、原卡片对象和完整资料，不按打码姓名重新定位；ID缺失或变化立即停止
      --job 可在确认弹层内改选职位
      --dry-run 仅支持搜索池：点击沟通入口后读取弹层并取消，不点确认、不修改持久开聊模式；推荐/深搜页明确拒绝
      正式执行先用账号权益；只有弹层明确权益不足且确认不可用时，才验证切卡模式后重试并确认
      入口点击后未出现弹层时须人工核对平台状态；dry-run 也不能保证平台未直接发送
      提交确认不可撤回；弹层关闭不证明发送成功或实际扣费，须人工核对，不能直接记为已发送
  boss deep-search（暂不可用）
      实现仍依赖已下线的 /web/chat/aiform，尚未适配新版 /web/chat/search/ai；请在网页端人工使用
      保留的旧页面参数：[岗位关键字] 或 --job <岗位关键字>；--core <核心要求>、--bonus <加分项>（可重复）
      --clear-core / --clear-bonus 清空对应分组；以上参数不表示新版已适配
      旧实现中仅显式提供 --match 才点击「立即匹配」并消耗匹配次数，最多输出最新 20 条
  
  !!鉴于boss的风控机制存在更新，且本cli的功能在逐步完善中，若遇到部分操作问题，请先检查版本更新
`);
}
/** 解析 `--key value` / `--key=value` / 布尔 `--flag` */
function parseOpts(argv) {
    const rest = [];
    const flags = new Set();
    const opts = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--') {
            rest.push(...argv.slice(i + 1));
            break;
        }
        if (a.startsWith('--')) {
            const eq = a.indexOf('=');
            if (eq !== -1) {
                const k = a.slice(2, eq);
                opts[k] = a.slice(eq + 1);
                continue;
            }
            const key = a.slice(2);
            const next = argv[i + 1];
            if (next !== undefined && !next.startsWith('-')) {
                opts[key] = next;
                i += 1;
            }
            else {
                flags.add(key);
            }
            continue;
        }
        if (a.startsWith('-') && a.length > 1 && !a.startsWith('--')) {
            const short = a.slice(1);
            const next = argv[i + 1];
            if (short === 't' && next !== undefined && !next.startsWith('-')) {
                opts.t = next;
                i += 1;
                continue;
            }
            if (!/^\d/.test(short)) {
                flags.add(short);
                continue;
            }
        }
        rest.push(a);
    }
    return { rest, flags, opts };
}
function splitRequirementArg(value) {
    return value
        .split(/\r?\n|[;；]/)
        .map((x) => x.trim())
        .filter(Boolean);
}
function parseDeepSearchArgs(argv) {
    const positional = [];
    const coreRequirements = [];
    const bonusRequirements = [];
    let jobKeyword = '';
    let match = false;
    let coreSpecified = false;
    let bonusSpecified = false;
    function readValue(i, key) {
        const next = argv[i + 1];
        if (next === undefined || next.startsWith('-')) {
            die(`❌ deep-search 参数 ${key} 需要提供值`);
        }
        return { value: next, nextIndex: i + 1 };
    }
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--match') {
            match = true;
            continue;
        }
        if (arg === '--clear-core') {
            coreSpecified = true;
            coreRequirements.length = 0;
            continue;
        }
        if (arg === '--clear-bonus') {
            bonusSpecified = true;
            bonusRequirements.length = 0;
            continue;
        }
        if (arg === '--job' || arg === '-j') {
            const read = readValue(i, arg);
            jobKeyword = read.value.trim();
            i = read.nextIndex;
            continue;
        }
        if (arg.startsWith('--job=')) {
            jobKeyword = arg.slice('--job='.length).trim();
            continue;
        }
        if (arg === '--core' || arg === '-c') {
            const read = readValue(i, arg);
            coreSpecified = true;
            coreRequirements.push(...splitRequirementArg(read.value));
            i = read.nextIndex;
            continue;
        }
        if (arg.startsWith('--core=')) {
            coreSpecified = true;
            coreRequirements.push(...splitRequirementArg(arg.slice('--core='.length)));
            continue;
        }
        if (arg === '--bonus' || arg === '-b') {
            const read = readValue(i, arg);
            bonusSpecified = true;
            bonusRequirements.push(...splitRequirementArg(read.value));
            i = read.nextIndex;
            continue;
        }
        if (arg.startsWith('--bonus=')) {
            bonusSpecified = true;
            bonusRequirements.push(...splitRequirementArg(arg.slice('--bonus='.length)));
            continue;
        }
        if (arg.startsWith('-')) {
            die(`❌ deep-search 不支持参数: ${arg}`);
        }
        positional.push(arg);
    }
    if (!jobKeyword && positional.length > 0) {
        jobKeyword = positional.join(' ').trim();
    }
    else if (jobKeyword && positional.length > 0) {
        die('❌ deep-search 已提供 --job 时，不再支持额外的位置参数');
    }
    return {
        jobKeyword: jobKeyword || undefined,
        coreRequirements: coreSpecified ? coreRequirements : undefined,
        bonusRequirements: bonusSpecified ? bonusRequirements : undefined,
        match,
    };
}
function printStdout(text) {
    const t = text.trimEnd();
    if (t.length > 0) {
        console.log(t);
    }
}
function startProcessingSpinner() {
    if (!output.isTTY) {
        return () => { };
    }
    const frames = ['|', '/', '-', '\\'];
    let idx = 0;
    output.write(`${frames[idx]}\r`);
    const timer = setInterval(() => {
        idx = (idx + 1) % frames.length;
        output.write(`${frames[idx]}\r`);
    }, 90);
    timer.unref();
    return () => {
        clearInterval(timer);
        output.write(' \r');
    };
}
/**
 * 执行一条子命令并返回结果（与传入 `process.argv` 切片语义一致，不含 `boss` 本身）。
 */
export async function executeCommand(argv) {
    if (argv.length === 0) {
        die('❌ 空命令');
    }
    const cmd = normalizeSubcommand(argv[0]);
    const tail = argv.slice(1);
    configureHeadlessForCommand(cmd);
    if (cmd === '_baidu-keys') {
        const { rest, opts } = parseOpts(tail);
        let apiKey = (opts['api-key'] ?? opts.apikey ?? '').trim();
        let secretKey = (opts['secret-key'] ?? opts.secretkey ?? '').trim();
        if (!apiKey && rest.length >= 2) {
            apiKey = rest[0].trim();
            secretKey = rest.slice(1).join(' ').trim();
        }
        if (!apiKey || !secretKey) {
            die('❌ 用法: _baidu-keys --api-key <KEY> --secret-key <SECRET>\n    或: _baidu-keys <KEY> <SECRET>（本命令不在 help 中列出）');
        }
        return implSetBaiduCredentials(apiKey, secretKey);
    }
    if (cmd === 'login') {
        return implLogin();
    }
    if (cmd === 'reload') {
        if (tail.length > 0)
            die('用法: reload');
        return runReload();
    }
    // 浏览器跨命令常驻，所以需要一个显式的退出口（跑完招聘想释放内存时用）。
    // 名字不能叫 quit —— 交互模式里 exit / quit 已经是退出 REPL 的别名。
    if (cmd === 'shutdown') {
        const headless = await probeRemoteHeadless();
        if (headless === null) {
            return `没有在跑的 Boss 浏览器（端口 ${REMOTE_DEBUGGING_PORT} 无响应），无需关闭`;
        }
        // 先撤掉本进程内可能持有的引用，再关端口上那只（一次性命令下本来就没有引用）
        await detachBrowserSession().catch(() => { });
        const closed = await closeRemoteBrowser();
        return closed
            ? `已关闭 Boss 浏览器（${headless ? '无头' : '有头'}，端口 ${REMOTE_DEBUGGING_PORT}）。登录态已保留，下条命令会自动重新拉起。`
            : `关闭失败：端口 ${REMOTE_DEBUGGING_PORT} 上的浏览器没有响应关闭请求，可手动结束该 Chrome 主进程。`;
    }
    if (cmd === 'update') {
        const { rest, opts, flags } = parseOpts(tail);
        if (rest.length > 0 || Object.keys(opts).length > 0 || flags.size > 0) {
            die('❌ 用法: update');
        }
        return runPackageUpdate();
    }
    if (cmd === 'list') {
        const { flags } = parseOpts(tail);
        if (flags.has('unread')) {
            return implListUnreadCandidates();
        }
        return implListCandidates();
    }
    if (cmd === 'chat') {
        const { rest, flags, opts } = parseOpts(tail);
        const nameArg = rest.join(' ').trim();
        if ((opts.action ?? '').trim().length > 0 || (opts.remark ?? '').trim().length > 0) {
            die('❌ chat 不再支持 --action/--remark。请改用: action <操作> [--remark <备注>]');
        }
        const allowedOpts = new Set(['index', 'i', 'action', 'remark']);
        const unsupportedOpts = Object.keys(opts).filter((key) => !allowedOpts.has(key));
        if (unsupportedOpts.length > 0) {
            die(`❌ chat 不支持参数: --${unsupportedOpts.join(', --')}`);
        }
        // 默认模糊匹配（包含）；仅在指定 --strict 时做精确匹配
        const exact = flags.has('strict');
        const indexRaw = (opts.index ?? opts.i ?? '').trim();
        if (indexRaw) {
            const index = Number(indexRaw);
            if (!Number.isInteger(index) || index < 1) {
                die(`❌ chat --index 必须是从 1 开始的整数，当前值: ${indexRaw}`);
            }
            return implOpenChatByIndex({
                index,
                unreadOnly: flags.has('unread'),
                expectedName: nameArg || undefined,
                exact,
            });
        }
        if (flags.has('unread')) {
            die('❌ chat 只有配合 --index 时才支持 --unread。用法: chat --index <序号> --unread');
        }
        if (!nameArg) {
            die('❌ 用法: chat <姓名> [--strict]；或 chat [姓名] --index <序号> [--unread]');
        }
        return implOpenChat(nameArg, exact);
    }
    if (cmd === 'action') {
        const { rest, opts } = parseOpts(tail);
        const raw = (rest[0] ?? opts.type ?? opts.action ?? '').trim().toLowerCase();
        const actionMap = {
            resume: 'resume',
            'not-fit': 'not-fit',
            remark: 'remark',
            'agree-resume': 'agree-resume',
            'request-attachment-resume': 'request-attachment-resume',
            'ask-attachment-resume': 'request-attachment-resume',
            'ask-resume': 'request-attachment-resume',
            history: 'history',
            'chat-history': 'history',
            wechat: 'exchange-wechat',
            'exchange-wechat': 'exchange-wechat',
        };
        const action = actionMap[raw];
        if (!action) {
            die('❌ 用法: action <resume|not-fit|remark|agree-resume|request-attachment-resume|history|wechat> [--remark <备注>]');
        }
        const remark = (opts.remark ?? '').trim();
        if (action === 'remark' && !remark) {
            die('❌ 当操作为 remark 时，必须提供 --remark <备注内容>。');
        }
        return implChatAction({ action, remark });
    }
    if (cmd === 'send') {
        const { flags, opts } = parseOpts(tail);
        const text = opts.text?.trim() || opts.t?.trim() || '';
        if (!text) {
            die('❌ 用法: send [--text <消息>] [-t <消息>] [--request-resume]');
        }
        const requestResume = flags.has('request-resume');
        return implSendMessage({ text, requestResume });
    }
    if (cmd === 'positions') {
        const { rest, opts, flags } = parseOpts(tail);
        if (rest.length > 0 || Object.keys(opts).length > 0 || flags.size > 0) {
            die('❌ 用法: positions');
        }
        return implListPositions();
    }
    if (cmd === 'jd') {
        const { flags, opts, rest } = parseOpts(tail);
        if (flags.has('detail')) {
            die('❌ jd 不再支持 --detail。请使用: jd <name>');
        }
        if (flags.size > 0) {
            const unsupportedFlags = Array.from(flags).join(', --');
            die(`❌ jd 不支持参数: --${unsupportedFlags}`);
        }
        const detailName = rest.join(' ').trim();
        if (!detailName) {
            die('❌ 用法: jd <name>');
        }
        const unknownOpts = Object.keys(opts);
        if (unknownOpts.length > 0) {
            die(`❌ jd 不支持参数: --${unknownOpts.join(', --')}`);
        }
        return implListPositionsWithOptions({ detail: true, name: detailName });
    }
    if (cmd === 'deep-search' || cmd === 'deepsearch') {
        return implBossSearch(parseDeepSearchArgs(tail));
    }
    if (cmd === 'search') {
        const { rest, opts, flags } = parseOpts(tail);
        const usage = '❌ 用法: search [关键词] [--job <岗位关键字>] [--city <城市>] [--degree <学历>|--degree-range <下限-上限>] [--school <院校要求,逗号分隔>] [--exp <经验要求>|--exp-range <下限-上限>] [--age <年龄要求>|--age-range <下限-上限>] [--status <求职状态,逗号分隔>] [--job-hop <跳槽频率>] [--major <专业,逗号分隔>]';
        if (flags.size > 0) {
            die(usage);
        }
        const allowed = new Set([
            'job',
            'city',
            'degree',
            'degree-range',
            'school',
            'exp',
            'exp-range',
            'age',
            'age-range',
            'status',
            'job-hop',
            'major',
        ]);
        const extraOpts = Object.keys(opts).filter((k) => !allowed.has(k));
        if (extraOpts.length > 0) {
            die(usage);
        }
        const keyword = rest.join(' ').trim();
        return implNormalSearch({
            keyword: keyword || undefined,
            jobKeyword: opts.job?.trim() || undefined,
            city: opts.city?.trim() || undefined,
            degree: opts.degree?.trim() || undefined,
            degreeRange: opts['degree-range']?.trim() || undefined,
            schools: parseFilterLabels(opts.school),
            exp: opts.exp?.trim() || undefined,
            expRange: opts['exp-range']?.trim() || undefined,
            age: opts.age?.trim() || undefined,
            ageRange: opts['age-range']?.trim() || undefined,
            status: parseFilterLabels(opts.status),
            jobHop: opts['job-hop']?.trim() || undefined,
            majors: parseFilterLabels(opts.major),
        });
    }
    if (cmd === 'preview') {
        const { rest, opts, flags } = parseOpts(tail);
        if (flags.size > 0) {
            die('❌ preview 不支持该 flag');
        }
        const unsupportedOpts = Object.keys(opts).filter((key) => key !== 'index');
        if (unsupportedOpts.length > 0) {
            die(`❌ preview 不支持: --${unsupportedOpts[0]}`);
        }
        const candidateTarget = rest.join(' ').trim();
        const indexRaw = opts.index;
        const candidateIndex = indexRaw === undefined ? undefined : Number(indexRaw);
        if (candidateIndex !== undefined && (!Number.isSafeInteger(candidateIndex) || candidateIndex < 1)) {
            die(`❌ preview --index 必须是从 1 开始的整数，当前值: ${indexRaw}`);
        }
        if (!candidateTarget && candidateIndex === undefined) {
            die('❌ 用法: preview <姓名> 或 preview [姓名] --index <序号>');
        }
        return implPreview({ candidateTarget, candidateIndex });
    }
    if (cmd === 'recommend') {
        const { rest, opts, flags } = parseOpts(tail);
        if (rest[0] === 'preview') {
            die('❌ 请改用: boss preview <姓名>（已不再使用 recommend preview）');
        }
        if (Object.keys(opts).length > 0 || flags.size > 0) {
            die('❌ 用法: recommend [岗位关键字]');
        }
        const jobKeyword = rest.join(' ').trim();
        return implRecommend(jobKeyword || undefined);
    }
    if (cmd === 'greet') {
        const { rest, opts, flags } = parseOpts(tail);
        const usage = '❌ 用法: greet <姓名> [--job <岗位关键字>]；搜索池: greet [关键词] --index <序号> [--dry-run]';
        const allowedFlags = new Set(['dry-run', 'dryrun']);
        const badFlags = Array.from(flags).filter((f) => !allowedFlags.has(f));
        if (badFlags.length > 0) {
            die(usage);
        }
        const jobKeyword = opts.job?.trim();
        const extraOpts = Object.keys(opts).filter((k) => k !== 'job' && k !== 'index' && k !== 'i');
        if (extraOpts.length > 0) {
            die(usage);
        }
        const indexRaw = (opts.index ?? opts.i ?? '').trim();
        let index;
        if (indexRaw) {
            const n = Number(indexRaw);
            if (!Number.isInteger(n) || n < 1) {
                die(`❌ greet --index 必须是从 1 开始的整数，当前值: ${indexRaw}`);
            }
            index = n;
        }
        const target = rest.join(' ').trim();
        if (!target && index === undefined) {
            die(usage);
        }
        return implRecommendGreet({
            candidateTarget: target,
            jobKeyword: jobKeyword || undefined,
            index,
            dryRun: flags.has('dry-run') || flags.has('dryrun'),
        });
    }
    die(`❌ 未知命令 “${argv[0]}”。输入 help 查看用法。`);
}
export async function runOneCommand(argv) {
    if (argv.length === 0) {
        return;
    }
    try {
        const text = await executeCommand(argv);
        printStdout(text);
    }
    catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
    }
}
async function runInteractiveLoop() {
    const rl = createInterface({ input, output, terminal: true });
    await printPackageUpdateNoticeIfDue();
    printBossInteractiveBanner();
    try {
        for (;;) {
            let line;
            try {
                line = await rl.question('boss> ');
            }
            catch (e) {
                if (isReadlineAbortError(e)) {
                    break;
                }
                throw e;
            }
            const trimmed = line.trim();
            if (!trimmed) {
                continue;
            }
            if (/^(exit|quit)$/i.test(trimmed)) {
                break;
            }
            if (/^help$/i.test(trimmed)) {
                printHelp();
                continue;
            }
            if (/^(version|ver)$/i.test(trimmed) || /^(-v|--version)$/.test(trimmed)) {
                await printVersionInfo();
                continue;
            }
            const argv = splitShellLine(trimmed);
            try {
                const stopSpinner = startProcessingSpinner();
                const text = await executeCommand(argv).finally(() => {
                    stopSpinner();
                });
                printStdout(text);
            }
            catch (e) {
                console.error(e instanceof Error ? e.message : e);
            }
        }
    }
    finally {
        rl.close();
        // 退出交互时进程即将结束，必须 detach + unref 子进程，否则 Chrome 常随 Node 一起退出
        await detachBrowserSession().catch(() => { });
    }
}
export async function runCli(argv) {
    if (argv.length === 0) {
        if (process.env.npm_lifecycle_event === 'dev') {
            await runInteractiveLoop();
        }
        else {
            console.error('❌ 生产环境不支持交互模式。请使用 boss --help 查看可用命令。');
            process.exit(1);
        }
        return;
    }
    if (argv[0] === 'version' ||
        argv[0] === 'ver' ||
        argv[0] === '-v' ||
        argv[0] === '--version') {
        await printVersionInfo();
        return;
    }
    if (normalizeSubcommand(argv[0] ?? '') !== 'update') {
        await printPackageUpdateNoticeIfDue();
    }
    if (argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
        printHelp();
        return;
    }
    // 告诉 DSH 面板「这条命令正在操作这只浏览器」：面板切换有头/无头要关掉浏览器
    // 重开，会打断我们，所以它需要一个能看见的信号（见 common/busy_lock.ts）。
    acquireBusyLock(argv[0] ?? '');
    try {
        await runOneCommand(argv);
    }
    finally {
        await cleanupAfterCommand(argv[0] ?? '', true);
        releaseBusyLock();
    }
}
//# sourceMappingURL=cliRouter.js.map