import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

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
        <a href="https://api.openrealm.cn" target="_blank" rel="noreferrer">主站 · 大陆 CDN</a>
        <a href="https://global.api.openrealm.cn" target="_blank" rel="noreferrer">Global 线路 · 海外加速</a>
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
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
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
