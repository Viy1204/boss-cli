/**
 * 多数 Agent 客户端约定的 skills 根目录（如 `~/.agents/skills`）。
 * 可用 `BOSS_AGENT_SKILLS_DIR` 设为绝对路径以覆盖。
 */
export declare function getAgentSkillsDir(): string;
/** 应用主目录（业务数据在 .cache 下） */
export declare const APP_HOME: string;
/** 存放岗位 JD 的目录（每个岗位一个 .md 文件） */
export declare const JD_DIR: string;
/**
 * 应用缓存与生成数据根目录（浏览器配置等）
 */
export declare const CACHE_DIR: string;
/** Puppeteer 用户数据目录（与 CDP 启动默认目录一致） */
export declare const BROWSER_USER_DATA_DIR: string;
/** `chat` 抓取在线简历时对 iframe 区域截图保存目录 */
export declare const RESUME_SCREENSHOTS_DIR: string;
/** 在线简历截图经 OCR 后的纯文本保存目录（与截图同名 `.txt`） */
export declare const RESUME_OCR_DIR: string;
/** 确保 `~/.boss-cli/.cache` 目录存在（幂等） */
export declare function ensureAppDataLayout(): void;
//# sourceMappingURL=config.d.ts.map