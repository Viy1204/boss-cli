import assert from 'node:assert/strict';
import test from 'node:test';

import {
  blankBytesPerPixelThreshold,
  classifyResumeCaptureDensity,
} from '../dist/common/c_resume_capture.js';

/** 跑一段代码，跑完把环境变量还原成原样。 */
function withEnv(vars, fn) {
  const saved = new Map(Object.keys(vars).map((k) => [k, process.env[k]]));
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = v;
      }
    }
  }
}

const KB = 1024;
/** 一屏 900 CSS px 宽、临时拉高到 5000 px 的整框截图，dpr 1 */
const TALL_CAPTURE_PIXELS = 900 * 5000;
/** 简历较短时的整框截图 */
const SHORT_CAPTURE_PIXELS = 900 * 3000;

test('recruiting-copilot#37 实测样本：正常截图判 ok，只有水印的空壳判 blank', () => {
  withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: undefined }, () => {
    for (const bytes of [90 * KB, 150 * KB, 300 * KB]) {
      assert.equal(classifyResumeCaptureDensity(bytes, SHORT_CAPTURE_PIXELS).verdict, 'ok');
    }
    for (const bytes of [3 * KB, 21 * KB, 24 * KB, 33 * KB, 35 * KB]) {
      assert.equal(classifyResumeCaptureDensity(bytes, SHORT_CAPTURE_PIXELS).verdict, 'blank');
      assert.equal(classifyResumeCaptureDensity(bytes, TALL_CAPTURE_PIXELS).verdict, 'blank');
    }
  });
});

test('过线但离阈值不到 2 倍的样本判 borderline，让调用方看见以便校准', () => {
  withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: undefined }, () => {
    const threshold = blankBytesPerPixelThreshold();
    const pixels = SHORT_CAPTURE_PIXELS;
    assert.equal(
      classifyResumeCaptureDensity(threshold * 1.5 * pixels, pixels).verdict,
      'borderline',
    );
    assert.equal(classifyResumeCaptureDensity(threshold * 2.5 * pixels, pixels).verdict, 'ok');
    // 恰好等于阈值不算空壳（判据是严格小于）
    assert.equal(classifyResumeCaptureDensity(threshold * pixels, pixels).verdict, 'borderline');
  });
});

test('阈值设 0 关闭该检查，一切都判 ok', () => {
  withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: '0' }, () => {
    assert.equal(blankBytesPerPixelThreshold(), 0);
    assert.equal(classifyResumeCaptureDensity(1, SHORT_CAPTURE_PIXELS).verdict, 'ok');
  });
});

test('阈值可调高，用来在自己的样本上收紧判定', () => {
  withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: '0.05' }, () => {
    assert.equal(blankBytesPerPixelThreshold(), 0.05);
    // 90 KB / 2.7M 像素 ≈ 0.034，在收紧后的阈值下会被判成空壳
    assert.equal(classifyResumeCaptureDensity(90 * KB, SHORT_CAPTURE_PIXELS).verdict, 'blank');
  });
});

test('非法或缺失的阈值回落到默认值', () => {
  for (const raw of [undefined, '', '  ', 'abc', '-1']) {
    withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: raw }, () => {
      assert.equal(blankBytesPerPixelThreshold(), 0.015);
    });
  }
});

test('像素数为 0 时不判空壳（拿不到 boundingBox 由调用方另行报错）', () => {
  withEnv({ BOSS_RESUME_BLANK_BYTES_PER_PIXEL: undefined }, () => {
    assert.equal(classifyResumeCaptureDensity(0, 0).verdict, 'ok');
  });
});
