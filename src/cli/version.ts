import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR } from '../config.js';

const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const UPDATE_CHECK_STATE_FILE = join(CACHE_DIR, 'version-check.json');

function getPackageJsonPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'package.json');
}

export function getPackageMeta(): { name: string; version: string } {
  const raw = readFileSync(getPackageJsonPath(), 'utf8');
  const parsed = JSON.parse(raw) as { name?: string; version?: string };
  const name = typeof parsed.name === 'string' ? parsed.name : '';
  const version = typeof parsed.version === 'string' ? parsed.version : '';
  if (!name || !version) {
    throw new Error('package.json 缺少有效的 name 或 version 字段');
  }
  return { name, version };
}

/** 比较 semver x.y.z（忽略预发布标签，仅比较主版本段） */
export function compareSemver(a: string, b: string): number {
  const core = (s: string) => s.split('-')[0] ?? '';
  const pa = core(a).split('.').map((x) => parseInt(x, 10));
  const pb = core(b).split('.').map((x) => parseInt(x, 10));
  if (pa.some((n) => Number.isNaN(n)) || pb.some((n) => Number.isNaN(n))) {
    throw new Error(`无法解析的版本号: ${JSON.stringify(a)} / ${JSON.stringify(b)}`);
  }
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) {
      return da > db ? 1 : -1;
    }
  }
  return 0;
}

export type PackageUpdateCheckResult = {
  checked: boolean;
  current: string;
  latest: string | null;
  updateAvailable: boolean;
};

type PackageUpdateCheckState = {
  checkedAt: string;
  packageName: string;
  currentVersion: string;
  latestVersion: string;
};

type CheckPackageUpdateOptions = {
  currentVersion?: string;
  fetchLatestVersion?: (packageName: string) => Promise<string>;
  force?: boolean;
  intervalMs?: number;
  now?: Date;
  packageName?: string;
  statePath?: string;
};

export async function fetchNpmLatestVersion(packageName: string): Promise<string> {
  const path = `${encodeURIComponent(packageName)}/latest`;
  const url = `https://registry.npmjs.org/${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`查询 npm 最新版本失败：HTTP ${res.status}（${url}）`);
  }
  const data = (await res.json()) as { version?: unknown };
  if (typeof data.version !== 'string' || data.version.length === 0) {
    throw new Error('npm registry 响应缺少有效的 version 字段');
  }
  return data.version;
}

function getUpdateCheckStatePath(): string {
  return process.env.BOSS_CLI_UPDATE_CHECK_STATE_PATH?.trim() || UPDATE_CHECK_STATE_FILE;
}

function shouldCheckFromState(
  state: PackageUpdateCheckState | null,
  now: Date,
  intervalMs: number,
): boolean {
  if (!state) {
    return true;
  }
  const checkedAtMs = Date.parse(state.checkedAt);
  if (Number.isNaN(checkedAtMs)) {
    throw new Error(`版本检查缓存 checkedAt 无法解析：${state.checkedAt}`);
  }
  return now.getTime() - checkedAtMs > intervalMs;
}

async function readUpdateCheckState(statePath: string): Promise<PackageUpdateCheckState | null> {
  if (!existsSync(statePath)) {
    return null;
  }
  const raw = await readFile(statePath, 'utf8');
  const parsed = JSON.parse(raw) as Partial<PackageUpdateCheckState>;
  if (
    typeof parsed.checkedAt !== 'string' ||
    typeof parsed.packageName !== 'string' ||
    typeof parsed.currentVersion !== 'string' ||
    typeof parsed.latestVersion !== 'string'
  ) {
    throw new Error(`版本检查缓存格式无效：${statePath}`);
  }
  return {
    checkedAt: parsed.checkedAt,
    packageName: parsed.packageName,
    currentVersion: parsed.currentVersion,
    latestVersion: parsed.latestVersion,
  };
}

async function writeUpdateCheckState(
  statePath: string,
  state: PackageUpdateCheckState,
): Promise<void> {
  await mkdir(dirname(statePath), { recursive: true });
  const tmpPath = `${statePath}.tmp`;
  await writeFile(tmpPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  await rename(tmpPath, statePath);
}

export function formatPackageUpdateNotice(result: PackageUpdateCheckResult): string {
  if (!result.updateAvailable || !result.latest) {
    throw new Error('没有可用更新，无法生成升级提示');
  }
  return `[boss-cli] boss-cli 需要升级：当前 ${result.current}，最新 ${result.latest}。请运行 boss update`;
}

export async function checkPackageUpdate(
  options: CheckPackageUpdateOptions = {},
): Promise<PackageUpdateCheckResult> {
  const meta = getPackageMeta();
  const packageName = options.packageName ?? meta.name;
  const current = options.currentVersion ?? meta.version;
  const now = options.now ?? new Date();
  const intervalMs = options.intervalMs ?? UPDATE_CHECK_INTERVAL_MS;
  const statePath = options.statePath ?? getUpdateCheckStatePath();
  const fetchLatestVersion = options.fetchLatestVersion ?? fetchNpmLatestVersion;
  const state = await readUpdateCheckState(statePath);

  if (!options.force && !shouldCheckFromState(state, now, intervalMs)) {
    const latest = state?.latestVersion ?? null;
    return {
      checked: false,
      current,
      latest,
      updateAvailable: latest ? compareSemver(latest, current) > 0 : false,
    };
  }

  const latest = await fetchLatestVersion(packageName);
  const result = {
    checked: true,
    current,
    latest,
    updateAvailable: compareSemver(latest, current) > 0,
  };
  await writeUpdateCheckState(statePath, {
    checkedAt: now.toISOString(),
    packageName,
    currentVersion: current,
    latestVersion: latest,
  });
  return result;
}

export async function printPackageUpdateNoticeIfDue(): Promise<void> {
  try {
    const result = await checkPackageUpdate();
    if (result.checked && result.updateAvailable) {
      console.error(formatPackageUpdateNotice(result));
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] 版本更新检查失败：${message}`);
  }
}

export async function printVersionInfo(): Promise<void> {
  const { name, version: current } = getPackageMeta();
  console.log(`${name} ${current}`);
  const result = await checkPackageUpdate({ force: true });
  if (result.updateAvailable) {
    console.log(formatPackageUpdateNotice(result));
  } else if (result.latest) {
    console.log(`未发现更新：当前 ${result.current}，npm latest ${result.latest}`);
  }
}

export async function runPackageUpdate(): Promise<string> {
  const { name } = getPackageMeta();
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = ['install', '-g', `${name}@latest`];
  console.error(`[boss-cli] 正在执行：npm install -g ${name}@latest`);

  const code = await new Promise<number>((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('close', (exitCode, signal) => {
      if (signal) {
        reject(new Error(`npm 更新进程被信号中断：${signal}`));
        return;
      }
      resolve(exitCode ?? 0);
    });
  });

  if (code !== 0) {
    throw new Error(`npm 更新失败，退出码 ${code}`);
  }
  return 'boss-cli 更新完成。请重新运行 boss version 确认当前版本。';
}
