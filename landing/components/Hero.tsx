'use client'

export default function Hero() {
  return (
    <section className="pt-40 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span className="text-slate-300 text-xs">开源 · v0.3.4 · GPL-3.0</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          Boss直聘
          <br />
          <span className="text-teal-500">自动化工具</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
          boss-cli 是专为 HR 和招聘团队打造的开源命令行工具。基于 CDP 协议，自动化候选人管理、批量消息发送、智能简历筛选，让 Agent 代替你的 HR 工作。
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href="https://www.npmjs.com/package/@joohw/boss-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md text-sm transition-colors"
          >
            npm install
          </a>
          <a
            href="https://github.com/joohw/boss-cli#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-md text-sm font-medium transition-colors"
          >
            查看文档
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">快速开始</p>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-slate-600 select-none">$ </span>
              <span className="text-teal-400">npm install -g @joohw/boss-cli@latest</span>
            </div>
            <div>
              <span className="text-slate-600 select-none">$ </span>
              <span className="text-teal-400">boss help</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs mt-4">需要 Node.js 20+ 与本机 Chrome/Chromium</p>
        </div>
      </div>
    </section>
  )
}
