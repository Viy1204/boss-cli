'use client'

export default function CTA() {
  return (
    <section className="py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">立即开始使用</h2>
          <p className="text-slate-400 mb-8 max-w-lg">
            一行命令安装，开箱即用。无论是个人 HR 还是招聘团队，boss-cli 都能大幅提升你的招聘效率。完全开源免费。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.npmjs.com/package/@joohw/boss-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-md transition-colors"
            >
              npm install -g @joohw/boss-cli@latest
            </a>
            <a
              href="https://github.com/joohw/boss-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-medium rounded-md transition-colors"
            >
              在 GitHub 查看源码
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
