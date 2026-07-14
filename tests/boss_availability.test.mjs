import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  assertBossCliAvailable,
  BossAvailabilityError,
} from '../dist/common/boss_availability.js';

const SNAPSHOT_ROOT = path.resolve('docs/research/boss-online-js/2026-07-15');
const manifest = JSON.parse(await readFile(path.join(SNAPSHOT_ROOT, 'manifest.json'), 'utf8'));
const entryPageByUrl = new Map(manifest.entryPages.map((entry) => [entry.url, entry]));
const assetByUrl = new Map(manifest.entries.map((entry) => [entry.url, entry]));
const originalFetch = globalThis.fetch;

function installSnapshotFetch({ corruptUrl } = {}) {
  globalThis.fetch = async (input) => {
    const url = String(input);
    const entryPage = entryPageByUrl.get(url);
    if (entryPage) {
      const html = entryPage.scripts
        .map((scriptUrl) => `<script src="${scriptUrl}"></script>`)
        .join('');
      return new Response(html, { status: 200 });
    }

    const asset = assetByUrl.get(url);
    if (!asset) {
      return new Response('not found', { status: 404, statusText: 'Not Found' });
    }
    let body = await readFile(path.join(SNAPSHOT_ROOT, asset.localPath));
    if (url === corruptUrl) {
      body = Buffer.concat([body, Buffer.from('\ncorrupted')]);
    }
    return new Response(body, { status: 200 });
  };
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('accepts the archived 2026-07-15 Boss frontend snapshot', async () => {
  installSnapshotFetch();
  await assert.doesNotReject(assertBossCliAvailable());
});

test('rejects a guarded script whose archived hash changes', async () => {
  const guardedUrl = 'https://static.zhipin.com/zhipin-boss/index/v10723/static/js/app.js';
  installSnapshotFetch({ corruptUrl: guardedUrl });
  await assert.rejects(
    assertBossCliAvailable(),
    (error) =>
      error instanceof BossAvailabilityError &&
      error.message.includes('boss-index app SHA-256 不一致'),
  );
});
