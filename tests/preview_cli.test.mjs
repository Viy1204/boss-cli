import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/cli/cliRouter.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function fixture() {
  const calls = [];
  const imports = {
    'node:readline/promises': {},
    'node:process': {},
    '../browser/index.js': { resolveHeadlessFromEnv: () => false },
    '../toolset/index.js': {
      implPreview: async options => {
        calls.push(JSON.parse(JSON.stringify(options)));
        return '预览完成';
      },
    },
    './banner.js': {},
    './version.js': {},
    '../common/busy_lock.js': {},
  };
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    process: { env: {} },
    require: specifier => {
      assert.ok(Object.hasOwn(imports, specifier), '未隔离的依赖：' + specifier);
      return imports[specifier];
    },
  });
  return { calls, execute: exports.executeCommand };
}

test('preview 保留姓名入口', async () => {
  const f = fixture();
  assert.equal(await f.execute(['preview', '张三']), '预览完成');
  assert.deepEqual(f.calls, [{ candidateTarget: '张三' }]);
});

test('preview 允许仅用列表序号定位', async () => {
  const f = fixture();
  assert.equal(await f.execute(['preview', '--index', '2']), '预览完成');
  assert.deepEqual(f.calls, [{ candidateTarget: '', candidateIndex: 2 }]);
});

test('preview 同时传递姓名与序号，由列表校验同一目标', async () => {
  const f = fixture();
  assert.equal(await f.execute(['preview', '张**', '--index=2']), '预览完成');
  assert.deepEqual(f.calls, [{ candidateTarget: '张**', candidateIndex: 2 }]);
});

test('preview 无效定位参数在访问浏览器前拒绝', async () => {
  for (const args of [
    [], ['--index'], ['--index='], ['--index', '0'], ['--index=-1'],
    ['--index', '1.5'], ['--index', 'NaN'], ['--index', '9007199254740992'],
    ['张三', '--job', '研发'], ['张三', '--json'],
  ]) {
    const f = fixture();
    await assert.rejects(f.execute(['preview', ...args]), /preview/);
    assert.deepEqual(f.calls, [], args.join(' '));
  }
});
