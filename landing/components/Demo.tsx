'use client'

const examples = [
  {
    title: '登录账号',
    lines: [
      { prompt: true, text: 'boss login' },
      { prompt: false, text: '打开浏览器，等待登录...' },
      { prompt: false, text: '认证成功', highlight: true },
    ]
  },
  {
    title: '查看候选人列表',
    lines: [
      { prompt: true, text: 'boss list --unread' },
      { prompt: false, text: '加载中...' },
      { prompt: false, text: '共找到 12 位未读候选人', highlight: true },
    ]
  },
  {
    title: '打开指定会话',
    lines: [
      { prompt: true, text: 'boss chat 张三' },
      { prompt: false, text: '正在打开会话...' },
      { prompt: false, text: '已打开 张三 的会话', highlight: true },
    ]
  },
  {
    title: '发送消息 & 操作候选人',
    lines: [
      { prompt: true, text: 'boss send --text "您好，请问方便发一下简历吗？"' },
      { prompt: false, text: '消息已发送', highlight: true },
      { prompt: true, text: 'boss action resume' },
      { prompt: false, text: '已请求简历', highlight: true },
    ]
  }
]

export default function Demo() {
  return (
    <section id="examples" className="py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">使用示例</h2>
        <p className="text-slate-400 mb-12">简单直观的命令，强大的招聘自动化能力。</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((ex, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                </div>
                <span className="text-slate-500 text-xs ml-2">{ex.title}</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-1.5">
                {ex.lines.map((line, j) => (
                  <div key={j} className="flex gap-2">
                    {line.prompt
                      ? <span className="text-teal-500 shrink-0">$</span>
                      : <span className="w-3 shrink-0"></span>
                    }
                    <span className={
                      line.prompt
                        ? 'text-white'
                        : (line as { highlight?: boolean }).highlight
                          ? 'text-teal-400'
                          : 'text-slate-500'
                    }>
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
