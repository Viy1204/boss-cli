import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { waitForCResumeIframeOrPaywall } from '../dist/common/boss_paywall_popup.js';
import { countVisibleCResumeIframes } from '../dist/common/c_resume_capture.js';

const executablePath = [
  process.env.CHROME_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  ...[process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]
    .filter(Boolean)
    .flatMap(root => [join(root, 'Google/Chrome/Application/chrome.exe'), join(root, 'Microsoft/Edge/Application/msedge.exe')]),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find(path => path && existsSync(path));

const hiddenIframe = '<iframe src="about:blank#c-resume-old" srcdoc="<p>fixture</p>" style="display:none"></iframe>';
const visibleIframe = '<iframe src="about:blank#c-resume-new" srcdoc="<p>fixture</p>" style="width:320px;height:240px"></iframe>';

const cases = [
  { name: '只有可见简历', html: visibleIframe, visibleCount: 1, outcome: 'iframe' },
  { name: '只有隐藏旧简历', html: hiddenIframe, visibleCount: 0, outcome: 'neither' },
  { name: '隐藏旧简历不遮蔽后方可见简历', html: hiddenIframe + visibleIframe, visibleCount: 1, outcome: 'iframe' },
];

test('在线简历等待检测所有匹配 iframe 的可见性', { skip: !executablePath && '本地未安装 Chrome/Edge', timeout: 20_000 }, async t => {
  const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true, protocolTimeout: 5_000 });
  try {
    const page = await browser.newPage();
    for (const nested of [false, true]) {
      for (const scenario of cases) {
        await t.test(`${nested ? '推荐子 frame' : '主文档'}：${scenario.name}`, async () => {
          let owner;
          if (nested) {
            await page.setContent('<!doctype html><iframe name="recommendFrame" style="width:800px;height:600px"></iframe>', { waitUntil: 'load', timeout: 5_000 });
            const iframe = await page.$('iframe[name="recommendFrame"]');
            owner = await iframe.contentFrame();
            await iframe.dispose();
          } else {
            owner = page.mainFrame();
          }
          await owner.setContent('<!doctype html>' + scenario.html, { waitUntil: 'load', timeout: 5_000 });
          assert.equal(await countVisibleCResumeIframes(page), scenario.visibleCount);
          assert.equal(await waitForCResumeIframeOrPaywall(page, 700), scenario.outcome);
        });
      }
    }
  } finally {
    await browser.close();
  }
});
