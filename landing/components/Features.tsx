'use client'

const features = [
  {
    title: '候选人列表管理',
    description: '一键读取 Boss直聘全部聊天列表，支持筛选未读消息，快速掌握所有候选人动态。'
  },
  {
    title: '智能会话操作',
    description: '按姓名精准打开候选人会话，支持收简历、标记不合适、备注、同意交换微信等全流程操作。'
  },
  {
    title: '批量消息发送',
    description: '自动向当前会话发送文本消息，配合外层 Agent 实现批量招聘沟通，大幅降低重复劳动。'
  },
  {
    title: '职位与简历管理',
    description: '读取职位列表、抓取职位详情并缓存为 Markdown，轻松管理开放/待开放/已关闭职位。'
  },
  {
    title: '深度搜索与推荐',
    description: '触发深度搜索「立即匹配」，读取推荐候选人列表，对目标人才一键打招呼。'
  },
  {
    title: 'AI Agent 集成',
    description: '纯 CLI 设计，可由脚本或外层 Agent 通过子进程调用，轻松构建全自动化招聘工作流。'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">核心功能</h2>
        <p className="text-slate-400 mb-12">为 HR 和招聘团队精心打造，让招聘效率翻倍。</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-950 p-6 hover:bg-slate-900 transition-colors">
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
