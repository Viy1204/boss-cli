import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://github.com/joohw/boss-cli'
const title = 'boss-cli — Boss直聘自动化招聘工具'
const description =
  '专为 HR 和招聘团队打造的开源命令行工具。自动化候选人管理、批量发送消息、智能筛选简历，大幅提升招聘效率。支持 AI Agent 集成，一行命令搞定重复操作。'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | boss-cli',
  },
  description,
  keywords: [
    'Boss直聘',
    'Boss直聘自动化',
    'HR工具',
    '招聘自动化',
    '候选人管理',
    '简历筛选',
    '批量发送消息',
    'boss-cli',
    '招聘命令行工具',
    'AI招聘助手',
    '开源招聘工具',
    'HR效率工具',
  ],
  authors: [{ name: 'Joo', url: 'https://github.com/joohw' }],
  creator: 'Joo',
  publisher: 'boss-cli',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'boss-cli',
    title,
    description,
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary',
    title,
    description,
    creator: '@joohw',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
