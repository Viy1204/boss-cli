import { open, readFile, rm } from 'node:fs/promises';
import { hostname } from 'node:os';
import { join } from 'node:path';
import { sleepRandom } from '../browser/timing.js';
import { CACHE_DIR, ensureAppDataLayout } from '../config.js';

const SESSION_LOCK_FILE = join(CACHE_DIR, 'session.lock');
const SESSION_LOCK_WAIT_MAX_MS = 30_000;
const SESSION_LOCK_POLL_MS = 250;

type SessionLockMeta = {
  pid: number;
  createdAt: number;
  hostname: string;
  cwd: string;
  command: string;
};

function buildSessionLockMeta(): SessionLockMeta {
  return {
    pid: process.pid,
    createdAt: Date.now(),
    hostname: hostname(),
    cwd: process.cwd(),
    command: process.argv.join(' ').trim(),
  };
}

async function readSessionLockMeta(): Promise<SessionLockMeta | null> {
  try {
    const raw = await readFile(SESSION_LOCK_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SessionLockMeta>;
    if (
      typeof parsed.pid !== 'number' ||
      typeof parsed.createdAt !== 'number' ||
      typeof parsed.hostname !== 'string' ||
      typeof parsed.cwd !== 'string' ||
      typeof parsed.command !== 'string'
    ) {
      return null;
    }
    return {
      pid: parsed.pid,
      createdAt: parsed.createdAt,
      hostname: parsed.hostname,
      cwd: parsed.cwd,
      command: parsed.command,
    };
  } catch {
    return null;
  }
}

async function processExists(pid: number): Promise<boolean> {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : '';
    return code === 'EPERM';
  }
}

async function clearStaleSessionLockIfNeeded(): Promise<void> {
  const meta = await readSessionLockMeta();
  if (!meta) {
    await rm(SESSION_LOCK_FILE, { force: true }).catch(() => {});
    return;
  }
  if (meta.hostname !== hostname()) {
    return;
  }
  if (await processExists(meta.pid)) {
    return;
  }
  await rm(SESSION_LOCK_FILE, { force: true }).catch(() => {});
}

function formatSessionLockOwner(meta: SessionLockMeta | null): string {
  if (!meta) {
    return 'unknown';
  }
  const ageSeconds = Math.max(0, Math.floor((Date.now() - meta.createdAt) / 1000));
  return [
    'pid=' + meta.pid,
    'host=' + meta.hostname,
    'age=' + ageSeconds + 's',
    meta.command ? 'cmd=' + meta.command : '',
  ]
    .filter(Boolean)
    .join(', ');
}

export async function withBossSessionLock<T>(callback: () => Promise<T>): Promise<T> {
  ensureAppDataLayout();
  const deadline = Date.now() + SESSION_LOCK_WAIT_MAX_MS;

  while (true) {
    try {
      const handle = await open(SESSION_LOCK_FILE, 'wx');
      let lockCreated = false;
      try {
        await handle.writeFile(JSON.stringify(buildSessionLockMeta()), 'utf8');
        lockCreated = true;
      } finally {
        await handle.close().catch(() => {});
      }

      if (!lockCreated) {
        await rm(SESSION_LOCK_FILE, { force: true }).catch(() => {});
        throw new Error('Boss session lock creation failed.');
      }

      try {
        return await callback();
      } finally {
        await rm(SESSION_LOCK_FILE, { force: true }).catch(() => {});
      }
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? error.code : '';
      if (code !== 'EEXIST') {
        throw error;
      }

      await clearStaleSessionLockIfNeeded();
      if (Date.now() >= deadline) {
        const meta = await readSessionLockMeta();
        throw new Error(
          'Boss session is busy for more than 30s. Lock owner: ' + formatSessionLockOwner(meta),
        );
      }
      await sleepRandom(SESSION_LOCK_POLL_MS, SESSION_LOCK_POLL_MS);
    }
  }
}
