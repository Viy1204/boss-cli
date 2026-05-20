'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '什么是 boss-cli？',
    a: 'boss-cli 是一个开源命令行工具，专为 HR 和招聘团队设计。基于 CDP 协议连接本机 Chrome，提供候选人管理、消息发送、职位管理等全流程招聘自动化能力。'
  },
  {
    q: '如何安装？',
    a: '确保已安装 Node.js 20+ 和本机 Chrome/Chromium，然后运行 npm install -g @joohw/boss-cli@latest。安装完成后执行 boss help 查看所有命令。'
  },
  {
    q: '数据安全吗？',
    a: '代码完全开源可审查。所有数据仅存储在本地 ~/.boss-cli/.cache/ 目录，不会上传到任何第三方服务器。CLI 直接连接本机浏览器，无中间层。'
  },
  {
    q: '可以集成到 AI Agent 中吗？',
    a: '完全支持。boss-cli 是纯 CLI 工具，设计上就是为了被脚本或外层 Agent 通过子进程调用，轻松构建全自动化招聘工作流。'
  },
  {
    q: '运行时需要打开浏览器窗口吗？',
    a: '默认有头（headful）模式，会显示浏览器窗口，login 命令也需要有头模式以便手动登录。其他命令可通过设置环境变量 BOSS_BROWSER_HEADLESS=true 切换为无头模式。'
  },
  {
    q: '如何贡献代码或反馈问题？',
    a: '欢迎通过 GitHub Issues 提交 Bug 或功能建议，也欢迎直接提交 Pull Request 参与贡献。'
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">常见问题</h2>
        <p className="text-slate-400 mb-12">
          更多问题可在{' '}
          <a
            href="https://github.com/joohw/boss-cli/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            GitHub Issues
          </a>{' '}
          提出。
        </p>

        <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
          {faqs.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-900 transition-colors"
              >
                <span className="text-white text-sm font-medium">{item.q}</span>
                <span className="text-slate-500 text-xs ml-4 shrink-0">{open === i ? '-' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 py-4 bg-slate-900/50 text-slate-400 text-sm leading-relaxed border-t border-slate-800">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
