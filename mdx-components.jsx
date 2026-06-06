// Nextra v4 要求项目根目录提供该文件:把主题自带的 MDX 组件与页面级自定义组件合并。
// catch-all 路由(app/[[...mdxPath]]/page.jsx)会从这里取 `wrapper` 来包裹每个文档页。
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = components => ({
  ...docsComponents,
  ...components
})
