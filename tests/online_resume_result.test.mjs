import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/toolset/action.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function fixture(capture, ocrEnabled = false, ocrError) {
  const state = { clicks: 0, captures: [], ocr: 0 };
  const button = {
    classList: { contains: () => false },
    scrollIntoView() {},
    click() { state.clicks++; },
  };
  const document = {
    querySelector: selector => {
      if (selector === '.base-info-single-container .name-box') return { textContent: '测试候选人' };
      if (selector.includes('.resume-btn-online')) return button;
      throw new Error('未预期的选择器：' + selector);
    },
  };
  const page = {
    url: () => 'https://www.zhipin.com/web/chat/index',
    $: async () => ({}),
    evaluate: async script => vm.runInNewContext(
      typeof script === 'function' ? `(${script.toString()})()` : script,
      { document },
    ),
  };
  const imports = {
    'node:path': { join },
    '../browser/index.js': {
      withWindowVisible: async (_page, fn) => fn(),
      snapshotBossPageViewport: async () => null,
    },
    '../common/auth.js': { isBossChatIndexUrl: () => true },
    '../common/boss_paywall_popup.js': { waitForCResumeIframeOrPaywall: async () => 'iframe' },
    '../common/c_resume_capture.js': {
      safeResumeScreenshotFileBase: value => value,
      waitForVisibleCResumeIframeReady: async () => true,
      closeCResumePanel: async () => true,
      captureCResumeIframeToFile: async (_page, _viewport, path) => {
        state.captures.push(path);
        return capture;
      },
    },
    '../config.js': { ensureAppDataLayout() {}, RESUME_SCREENSHOTS_DIR: 'resume-screenshots' },
    '../ocr/index.js': {
      isResumeOcrEnabled: () => ocrEnabled,
      ocrResumePngToTextFile: async () => {
        state.ocr++;
        if (ocrError) throw ocrError;
        return { text: '教育经历：测试大学' };
      },
    },
    './chat.js': {},
  };
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, Error,
    require: specifier => {
      assert.ok(Object.hasOwn(imports, specifier), '未隔离的依赖：' + specifier);
      return imports[specifier];
    },
  });
  return { state, run: () => exports.runChatActionOnCurrentConversation(page, { action: 'resume' }) };
}

test('在线简历截图警告必须传给调用者', async () => {
  const warning = '截图接近空壳阈值，请确认正文完整。';
  const f = fixture({ ok: true, detail: warning });
  const result = await f.run();
  assert.ok(result.includes(warning));
  assert.ok(result.includes(f.state.captures[0]));
  assert.equal(f.state.clicks, 1);
  assert.equal(f.state.ocr, 0);
});

test('OCR 输出仍保留截图路径与未关净警告', async () => {
  const warning = '在线简历弹层未确认关净';
  const f = fixture({ ok: true, detail: warning }, true);
  const result = await f.run();
  assert.ok(result.includes(f.state.captures[0]));
  assert.ok(result.includes(warning));
  assert.match(result, /教育经历：测试大学/);
});

test('OCR 失败保留已生成截图路径和原始错误', async () => {
  const failure = new Error('OCR 配额已耗尽');
  const f = fixture({ ok: true }, true, failure);
  await assert.rejects(f.run(), error => {
    assert.ok(error.message.includes(f.state.captures[0]));
    assert.match(error.message, /OCR 配额已耗尽/);
    assert.equal(error.cause, failure);
    return true;
  });
});

test('截图失败暴露实际原因且不继续 OCR', async () => {
  const f = fixture({ ok: false, detail: '在线简历 iframe 取不到 boundingBox。' }, true);
  await assert.rejects(f.run(), /取不到 boundingBox/);
  assert.equal(f.state.ocr, 0);
});
