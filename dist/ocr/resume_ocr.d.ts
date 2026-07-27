/**
 * 是否对在线简历截图做 OCR。关闭：`BOSS_RESUME_OCR=0`。
 * 开启时需配置百度 `API_KEY` + `SECRET_KEY`（在线识别，无本地引擎）。
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