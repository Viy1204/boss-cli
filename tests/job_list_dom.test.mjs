import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readJobsFromFrame, waitForJobRowsReady } from '../dist/toolset/jd.js';

function fixture({ rows = true, total = '共147个职位/每页20个', url = 'https://www.zhipin.com/web/frame/job_v2/list?jobversion=11570' } = {}) {
  const text = value => ({ textContent: value });
  const row = {
    getAttribute: () => null,
    querySelector: selector => ({ '.job-name': text('动捕导演'), '.job-labels .base-label': text('竞'), '.status-box': text('开放中') })[selector] ?? null,
    querySelectorAll: selector => selector === '.info-labels .divider-label-text' ? ['深圳', '5-10年', '本科', '500-1000元/天', '兼职'].map(text)
      : selector === '.job-about-num-wrapper .num' ? ['104', '23', '2'].map(text) : [],
  };
  const document = { title: '职位管理', body: { innerText: '职位管理' },
    querySelector: selector => selector === '.total-num' && total ? text(total) : null,
    querySelectorAll: selector => selector === '.job-item-container' && rows ? [row] : [],
  };
  return { url: () => url, evaluate: async script => vm.runInNewContext(script, { document, location: { href: url } }) };
}

test('当前 job_v2 卡片必须解析职位名称、状态、元信息和统计', async () => {
  const result = await readJobsFromFrame(fixture());
  assert.equal(result.rows, 1);
  assert.equal(result.jobs[0].title, '动捕导演');
  assert.equal(result.jobs[0].status, '开放中');
  assert.equal(result.jobs[0].label, '竞');
  assert.deepEqual(Array.from(result.jobs[0].meta), ['深圳', '5-10年', '本科', '500-1000元/天', '兼职']);
  assert.equal(result.jobs[0].viewed, '104');
  assert.equal(result.jobs[0].chatted, '23');
  assert.equal(result.jobs[0].interested, '2');
});

test('职位统计大于零而没有卡片不能视为加载成功', async () => {
  const main = fixture({ rows: false, total: '', url: 'https://www.zhipin.com/web/chat/job/list' });
  const job = fixture({ rows: false });
  const page = { mainFrame: () => main, frames: () => [main, job] };
  await assert.rejects(waitForJobRowsReady(page, 1), /职位列表|卡片/);
});

test('不能从后台残留 search frame 读取职位统计', async () => {
  const main = fixture({ rows: false, total: '', url: 'https://www.zhipin.com/web/chat/job/list' });
  const search = fixture({ total: '共99人', url: 'https://www.zhipin.com/web/frame/search' });
  const job = fixture();
  const page = { mainFrame: () => main, frames: () => [main, search, job] };
  const result = await waitForJobRowsReady(page, 1000);
  assert.equal(result.frame, job);
  assert.equal(result.data.jobs.length, 1);
});


test('仅明确共0个职位且无卡片才接受空列表', async () => {
  const main = fixture({ rows: false, total: '', url: 'https://www.zhipin.com/web/chat/job/list' });
  const job = fixture({ rows: false, total: '共0个职位/每页20个' });
  const page = { mainFrame: () => main, frames: () => [main, job] };
  const result = await waitForJobRowsReady(page, 1000);
  assert.equal(result.data.jobs.length, 0);
  assert.equal(result.frame, job);
});

test('离开职位页后不能从残留job frame报告成功', async () => {
  const main = fixture({ rows: false, total: '', url: 'https://www.zhipin.com/web/chat/search' });
  const job = fixture();
  await assert.rejects(waitForJobRowsReady({ mainFrame: () => main, frames: () => [main, job] }, 1000), /离开/);
});
