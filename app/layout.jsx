import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Inter, JetBrains_Mono } from 'next/font/google'
import 'nextra-theme-docs/style.css'

// 自托管字体(构建时下载、打进产物,不依赖 Google CDN,适配国内 + 静态部署)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-openapi-sans'
})
const jbmono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-openapi-mono'
})

// 中文回退栈:拉丁字形用 Inter,中文交给系统苹方/雅黑
const SANS_STACK = `var(--font-openapi-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
const MONO_STACK = `var(--font-openapi-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

export const metadata = {
  title: {
    default: 'OpenApi 文档',
    template: '%s | OpenApi'
  },
  description: 'OpenApi —— OpenRealm 的 OpenAI 与 Claude 兼容 API 教学文档'
}

const navbar = <Navbar logo={<b>OpenApi</b>} />

const footer = (
  <Footer>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.875rem' }}>
        <a href="https://api.openrealm.cn" target="_blank" rel="noreferrer">主线路 · 大陆 CDN</a>
        <a href="https://global.api.openrealm.cn" target="_blank" rel="noreferrer">Global · 纯 API 加速</a>
        <a href="https://api.openapi.edgeone.gloabl.muhan.wiki" target="_blank" rel="noreferrer">Global EdgeOne · 连通性最好</a>
        <a href="https://api.openrealm.cn/pricing" target="_blank" rel="noreferrer">价格</a>
      </div>
      <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>
        © {new Date().getFullYear()} OpenApi · OpenRealm
      </p>
    </div>
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      dir="ltr"
      className={`${inter.variable} ${jbmono.variable}`}
      style={{ '--x-font-sans': SANS_STACK, '--x-font-mono': MONO_STACK }}
      suppressHydrationWarning
    >
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          // 如需启用页面右上角「编辑此页」,设置为你的仓库地址
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
