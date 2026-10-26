import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { ensureInRecommendPage, selectRecommendJob } from '../dist/toolset/recommend.js';

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

const FIXTURE_SCRIPT = `(() => {
  window.__fixtureRafRequests = 0;
  window.requestAnimationFrame = () => { window.__fixtureRafRequests++; return 0; };
  window.__fixtureWaits = [];
  window.__fixtureWaitStarted = null;
  window.__fixtureReady = false;
  let phase = "initial";
  const mountList = () => {
    if (!document.querySelector(".card-list")) {
      const root = document.createElement("div");
      root.className = "card-list";
      root.innerHTML = '<div class="candidate-card-wrap"></div>';
      document.body.append(root);
    }
  };
  const originalQuery = Document.prototype.querySelector;
  document.querySelector = function(selector) {
    const result = originalQuery.call(this, selector);
    if (selector.includes(".candidate-card-wrap") && !result && phase === "initial") {
      phase = "initial-pending";
      setTimeout(mountList, 40);
    }
    if (window.__fixtureWaitStarted && selector === ".job-selecter-options" && !result) {
      phase = "dropdown-pending";
      setTimeout(mountDropdown, 40);
    }
    if (window.__fixtureWaitStarted && selector === ".job-selecter-wrap .ui-dropmenu-label" && phase === "selected") {
      phase = "selected-pending";
      setTimeout(() => {
        label.textContent = "前端工程师";
        window.__fixtureWaitStarted = () => { setTimeout(mountList, 40); };
      }, 40);
    }
    return result;
  };
  const wrapper = document.createElement("div");
  wrapper.className = "job-selecter-wrap";
  const label = document.createElement("button");
  label.className = "ui-dropmenu-label";
  label.textContent = "默认岗位";
  wrapper.append(label);
  document.body.append(wrapper);
  const mountDropdown = () => {
    const options = document.createElement("div");
    options.className = "job-selecter-options";
    options.style.cssText = "width:300px;height:100px";
    options.innerHTML = '<div class="top-chat-search"><input class="chat-job-search"></div><div class="job-list"></div>';
    document.body.append(options);
    options.querySelector("input").addEventListener("input", () => {
      window.__fixtureWaitStarted = () => {
        window.__fixtureWaitStarted = null;
        setTimeout(() => {
          const row = document.createElement("button");
          row.className = "job-item";
          row.innerHTML = '<span class="label">前端工程师</span>';
          row.onclick = () => {
            document.querySelector(".card-list")?.remove();
            phase = "selected";
            window.__fixtureWaitStarted = () => {};
          };
          options.querySelector(".job-list").append(row);
        }, 40);
      };
    });
  };
  label.onclick = () => {
    phase = "dropdown";
    window.__fixtureWaitStarted = () => {};
  };
  window.__fixtureReady = true;
})()`;

function boundFrame(frame) {
  return {
    url: () => 'data:text/html,/web/frame/recommend',
    evaluate: script => frame.evaluate(script),
    waitForFunction: async (script, options) => {
      await frame.evaluate('window.__fixtureWaits.push(' + JSON.stringify(options.timeout) + ')');
      const pending = frame.waitForFunction(script, { ...options, timeout: 700 });
      try {
        const [result] = await Promise.all([pending, frame.evaluate('window.__fixtureWaitStarted?.()')]);
        return result;
      } catch (error) {
        if (options.polling === undefined) {
          assert.ok(await frame.evaluate('window.__fixtureRafRequests > 0'), '真实轮询已请求 rAF');
          assert.ok(await frame.evaluate('!!document.querySelector(".card-list, .job-selecter-options")'), '超时时 timer 已挂载目标 DOM');
        }
        throw error;
      }
    },
  };
}

test('推荐异步DOM在rAF停转时仍应完成初始化和选岗', { skip: !executablePath && '本地未安装 Chrome/Edge', timeout: 20_000 }, async t => {
  const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
  try {
    const page = await browser.newPage();
    const source = '<!doctype html><meta charset="utf-8"><body><script>' + FIXTURE_SCRIPT + '</script>';
    await page.goto('data:text/html,' + encodeURIComponent('<!doctype html><iframe name="recommendFrame" src="data:text/html,' + encodeURIComponent(source) + '"></iframe>'));
    const iframe = await page.$('iframe[name="recommendFrame"]');
    const frame = await iframe.contentFrame();
    assert.equal(await frame.evaluate('window.__fixtureReady'), true);
    const bound = boundFrame(frame);
    const shell = {
      url: () => 'https://www.zhipin.com/web/chat/recommend',
      waitForSelector: async () => ({ contentFrame: async () => bound }),
    };
    await t.test('异步挂载列表后初始化就绪', async () => {
      assert.equal(await ensureInRecommendPage(shell), bound);
      assert.equal(await frame.evaluate('!!document.querySelector(".card-list")'), true);
    });
    await t.test('选岗依次等待dropdown、搜索选项、选中岗位和新列表', async () => {
      assert.equal(await selectRecommendJob(bound, '前端工程师'), '前端工程师');
      assert.equal(await frame.evaluate('document.querySelector(".job-selecter-wrap .ui-dropmenu-label").textContent'), '前端工程师');
      assert.equal(await frame.evaluate('!!document.querySelector(".candidate-card-wrap")'), true);
    });
    assert.deepEqual(await frame.evaluate('window.__fixtureWaits'), [18_000, 8_000, 10_000, 10_000, 18_000]);
  } finally {
    await browser.close();
  }
});
