import assert from 'node:assert/strict';
import test from 'node:test';

import { isResumeOcrEnabled } from '../dist/ocr/resume_ocr.js';

/** 还原环境变量。 */
function withEnv(vars, fn) {
  const saved = new Map();
  for (const [k, v] of Object.entries(vars)) {
    saved.set(k, process.env[k]);
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test('未设置 BOSS_RESUME_OCR 时默认关闭（未配百度密钥不应整体抛错）', () => {
  withEnv({ BOSS_RESUME_OCR: undefined }, () => {
    assert.equal(isResumeOcrEnabled(), false);
  });
});

test('显式开启：1/true/yes/on 各写法都开', () => {
  for (const v of ['1', 'true', 'yes', 'on', ' TRUE ']) {
    withEnv({ BOSS_RESUME_OCR: v }, () => {
      assert.equal(isResumeOcrEnabled(), true, `v=${v}`);
    });
  }
});

test('显式关闭：0/false/no/off 各写法都关', () => {
  for (const v of ['0', 'false', 'no', 'off']) {
    withEnv({ BOSS_RESUME_OCR: v }, () => {
      assert.equal(isResumeOcrEnabled(), false, `v=${v}`);
    });
  }
});
