/**
 * 是否对在线简历截图做 OCR。默认**关闭**，显式开启：`BOSS_RESUME_OCR=1`。
 * 开启时需配置百度 `API_KEY` + `SECRET_KEY`（在线识别，无本地引擎）。
 *
 * 默认关闭的原因：OCR 依赖第三方密钥且会外发简历截图，未配置密钥时
 * 开启会导致 `boss preview` / 简历动作整体抛错；未配置密钥的使用者
 * 默认拿截图即可（多模态 Agent 可直接读图）。显式 =1 才走 OCR。
 */
export declare function isResumeOcrEnabled(): boolean;
/**
 * 对简历区域 PNG 调用百度 OCR，将结果写入 `~/.boss-cli/.cache/ocr/`（与截图同名 `.txt`）。
 */
export declare function ocrResumePngToTextFile(pngAbsPath: string): Promise<{
    textPath: string;
    text: string;
}>;
//# sourceMappingURL=resume_ocr.d.ts.map