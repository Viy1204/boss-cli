'use client'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <div>
          <span className="text-teal-500 font-bold text-lg">boss</span>
          <span className="text-white font-bold text-lg">-cli</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">功能</a>
          <a href="#examples" className="text-slate-400 hover:text-white text-sm transition-colors">示例</a>
          <a href="#faq" className="text-slate-400 hover:text-white text-sm transition-colors">常见问题</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/joohw/boss-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@joohw/boss-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-md transition-colors"
          >
            立即安装
          </a>
        </div>
      </div>
    </header>
  )
}
