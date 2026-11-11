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
      runFavorite: async command => {
        calls.push(JSON.parse(JSON.stringify(command)));
        return '收藏结果';
      },
    },
    './banner.js': {},
    './version.js': {},
    '../common/busy_lock.js': {},
  };
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, process: { env: {} },
    require: name => {
      assert.ok(Object.hasOwn(imports, name), '未隔离的依赖：' + name);
      return imports[name];
    },
  });
  return { calls, execute: exports.executeCommand };
}

for (const [args, command] of [
  [['张三'], { kind: 'set', candidateTarget: '张三', desired: 'saved' }],
  [['--index', '2'], { kind: 'set', candidateTarget: '', candidateIndex: 2, desired: 'saved' }],
  [['张**', '--index=2'], { kind: 'set', candidateTarget: '张**', candidateIndex: 2, desired: 'saved' }],
  [['--remove', '张**', '--index', '2'], { kind: 'set', candidateTarget: '张**', candidateIndex: 2, desired: 'unsaved' }],
  [['--list'], { kind: 'list' }],
]) {
  test('favorite 传递明确的目标终态：' + args.join(' '), async () => {
    const f = fixture();
    assert.equal(await f.execute(['favorite', ...args]), '收藏结果');
    assert.deepEqual(f.calls, [command]);
  });
}

for (const args of [
  [], ['--remove'], ['--list', '张三'], ['--list', '--index', '1'], ['--list', '--remove'],
  ['--list', '--source', 'search'], ['张三', '--unknown'], ['--remove=false', '张三'],
  ['--index'], ['--index='], ['--index', '0'], ['--index', '-1'], ['--index=1.5'],
  ['--index=NaN'], ['--index=1e2'], ['--index=0x2'], ['--index=9007199254740992'],
  ['--index', '1', '--index', '2'], ['张三', '--job', '工程师'], ['--list=true'],
]) {
  test('favorite 参数错误在调用业务前拒绝：' + args.join(' '), async () => {
    const f = fixture();
    await assert.rejects(f.execute(['favorite', ...args]), /favorite/);
    assert.deepEqual(f.calls, []);
  });
}
