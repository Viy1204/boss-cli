import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/toolset/send.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function fixture(requestError) {
  const state = { submissions: 0, requests: 0 };
  const page = {
    url: () => 'https://www.zhipin.com/web/chat/index',
    $: async () => ({ click: async () => {} }),
    keyboard: {
      down: async () => {},
      up: async () => {},
      press: async key => { if (key === 'Enter') state.submissions++; },
    },
  };
  const imports = {
    '../browser/index.js': {
      randomIntInclusive: () => 0,
      selectAllModifierKey: () => 'Control',
      SEND_AFTER_ENTER_MS: { min: 0, max: 0 },
      SEND_INPUT_CLICK_MS: { min: 0, max: 0 },
      SEND_TYPING_GAP_MS: { min: 0, max: 0 },
      sleepRandom: async () => {},
      typeTextWithRandomKeyDelay: async () => {},
    },
    '../common/auth.js': { isBossChatIndexUrl: () => true },
    '../common/boss_session_page.js': { withBossSessionPage: fn => fn(page) },
    './action.js': {
      runRequestAttachmentResume: async () => {
        state.requests++;
        if (requestError) throw requestError;
        return '已点击求简历确认';
      },
    },
  };
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    Error,
    require: specifier => {
      assert.ok(Object.hasOwn(imports, specifier), '未隔离的依赖：' + specifier);
      return imports[specifier];
    },
  });
  return { state, send: exports.runSendChatMessage };
}

test('按下 Enter 不能被报告为已送达或已发送成功', async () => {
  const f = fixture();
  const result = await f.send({ text: '测试消息' });
  assert.match(result, /已提交发送/);
  assert.match(result, /未确认送达/);
  assert.doesNotMatch(result, /已发送消息|发送成功/);
  assert.deepEqual(f.state, { submissions: 1, requests: 0 });
});

test('发送后索要附件失败时保留部分执行事实，不隐去原始错误', async () => {
  const failure = new Error('求简历入口不可用');
  const f = fixture(failure);
  await assert.rejects(f.send({ text: '测试消息', requestResume: true }), error => {
    assert.match(error.message, /已提交发送/);
    assert.match(error.message, /未确认送达/);
    assert.match(error.message, /求简历入口不可用/);
    assert.match(error.message, /不要直接重跑/);
    assert.equal(error.cause, failure);
    return true;
  });
  assert.deepEqual(f.state, { submissions: 1, requests: 1 });
});
