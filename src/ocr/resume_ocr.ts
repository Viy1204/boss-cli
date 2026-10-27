import { basename, join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { ensureAppDataLayout, RESUME_OCR_DIR } from '../config.js';
import { baiduOcrImageBase64, isBaiduOcrConfigured } from './baidu_ocr.js';

/**
 * 是否对在线简历截图做 OCR。默认**关闭**，显式开启：`BOSS_RESUME_OCR=1`。
 * 开启时需配置百度 `API_KEY` + `SECRET_KEY`（在线识别，无本地引擎）。
 *
 * 默认关闭的原因：OCR 依赖第三方密钥且会外发简历截图，未配置密钥时
 * 开启会导致 `boss preview` / 简历动作整体抛错；未配置密钥的使用者
 * 默认拿截图即可（多模态 Agent 可直接读图）。显式 =1 才走 OCR。
 */
export function isResumeOcrEnabled(): boolean {
  const v = process.env.BOSS_RESUME_OCR?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

/** 串行执行 OCR，避免并发请求交错 */
let ocrChain: Promise<unknown> = Promise.resolve();

/**
 * 对简历区域 PNG 调用百度 OCR，将结果写入 `~/.boss-cli/.cache/ocr/`（与截图同名 `.txt`）。
 */
export async function ocrResumePngToTextFile(pngAbsPath: string): Promise<{ textPath: string; text: string }> {
  ensureAppDataLayout();
  if (!isBaiduOcrConfigured()) {
    throw new Error(
      '已开启简历 OCR（BOSS_RESUME_OCR），但未配置百度密钥：请设置 API_KEY 与 SECRET_KEY（或 BOSS_BAIDU_API_KEY / BOSS_BAIDU_SECRET_KEY）。',
    );
  }

  const base = basename(pngAbsPath).replace(/\.png$/i, '.txt');
  const textPath = join(RESUME_OCR_DIR, base);

  const run = async (): Promise<{ textPath: string; text: string }> => {
    const buf = await readFile(pngAbsPath);
    const text = await baiduOcrImageBase64(buf.toString('base64'));
    await writeFile(textPath, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
    return { textPath, text };
  };

  const p = ocrChain.then(run);
  ocrChain = p.catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[boss-cli] resume OCR chain reset after failure:', msg);
  });
  return p;
}
