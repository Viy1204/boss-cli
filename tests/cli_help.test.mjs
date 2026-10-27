import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('../dist/cli/index.js', import.meta.url));
const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const offlineGuard = 'data:text/javascript,' + encodeURIComponent(`
  import childProcess from 'node:child_process';
  import net from 'node:net';
  import { syncBuiltinESMExports } from 'node:module';
  const blocked = () => { throw new Error('离线帮助测试禁止网络连接和启动外部进程'); };
  globalThis.fetch = blocked;
  net.Socket.prototype.connect = blocked;
  childProcess.spawn = blocked;
  childProcess.execFile = blocked;
  syncBuiltinESMExports();
`);

function cliFixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'boss-cli-help-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const statePath = join(dir, 'version-check.json');
  writeFileSync(statePath, JSON.stringify({
    checkedAt: new Date().toISOString(),
    packageName: name,
    currentVersion: version,
    latestVersion: version,
  }));
  return args => {
    const result = spawnSync(process.execPath, ['--import', offlineGuard, cliPath, ...args], {
      cwd: dir,
      env: { ...process.env, BOSS_CLI_UPDATE_CHECK_STATE_PATH: statePath, npm_lifecycle_event: '' },
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null);
    assert.equal(result.stdout, '');
    assert.doesNotMatch(result.stderr, /版本更新检查失败|离线帮助测试禁止/);
    return result;
  };
}

test('help、--help 和 -h 离线输出一致，并说明当前能力与限制', t => {
  const run = cliFixture(t);
  const help = run(['help']);
  assert.equal(help.status, 0, help.stderr);
  for (const alias of ['--help', '-h']) {
    const result = run([alias]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, help.stderr);
  }

  assert.match(help.stderr, /无参数不支持交互模式/);
  assert.match(help.stderr, /npm run dev[\s\S]*exit \/ quit/);
  assert.match(help.stderr, /更新当前安装包/);
  assert.match(help.stderr, /~\/\.boss-cli\/jd\/[\s\S]*命中.*缓存/);
  assert.doesNotMatch(help.stderr, /缓存到项目目录/);
  assert.match(help.stderr, /仍为空则不操作城市控件/);
  assert.doesNotMatch(help.stderr, /仍为空则不限城市/);
  assert.match(help.stderr, /暂不可用[\s\S]*已下线[\s\S]*\/web\/chat\/aiform[\s\S]*尚未适配[\s\S]*\/web\/chat\/search\/ai/);
  assert.match(help.stderr, /旧页面参数[\s\S]*--core[\s\S]*--bonus[\s\S]*--clear-core[\s\S]*--clear-bonus[\s\S]*--match/);
  assert.match(help.stderr, /旧实现.*--match.*消耗/);
  assert.doesNotMatch(help.stderr, /推荐.*「深度搜索」.*且列表已加载/);
  assert.match(help.stderr, /默认保存 PNG 并输出路径/);
});

test('生产入口无参数时离线报错，不进入交互模式', t => {
  const result = cliFixture(t)([]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /生产环境不支持交互模式.*boss --help/);
  assert.doesNotMatch(result.stderr, /boss>/);
});
