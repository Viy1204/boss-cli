/**
 * 百度 AI 开放平台：OAuth + 通用文字识别（高精度含位置版 accurate_basic）。
 * 需在环境变量中配置 `API_KEY`、`SECRET_KEY`（与百度控制台一致）。
 * @see https://ai.baidu.com/ai-doc/OCR/zk3h7xz52
 */
export declare function isBaiduOcrConfigured(): boolean;
/** 更换密钥后应调用，避免沿用旧 access_token。 */
export declare function clearBaiduTokenCache(): void;
/** 获取 access_token（带简单内存缓存，过期前 1 分钟刷新）。 */
export declare function getBaiduAccessToken(): Promise<string>;
/** 对整张 PNG/JPG 做高精度识别，返回合并文本（按行拼接）。 */
export declare function baiduOcrImageBase64(imageBase64: string): Promise<string>;
//# sourceMappingURL=baidu_ocr.d.ts.map