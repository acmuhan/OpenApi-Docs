// 构建时拉取 openrealm 的模型清单,写成静态 JSON 打进产物。
// 用于纯静态部署(如阿里云 ESA Pages):此时没有服务端代理,
// 浏览器又因上游 /api/pricing 未开 CORS 无法直连,故改为构建期烘焙。
// 拉取失败不应让构建中断:保留已有快照即可。
import { writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'components', 'pricing-data.json')
const SRC = 'https://api.openrealm.cn/api/pricing'

async function main() {
  try {
    const res = await fetch(SRC, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) throw new Error(`上游返回 ${res.status}`)
    const json = await res.json()
    const data = Array.isArray(json.data) ? json.data : []
    const payload = {
      updatedAt: new Date().toISOString(),
      autoGroups: json.auto_groups || [],
      models: data.map(m => ({
        name: m.model_name,
        endpoints: m.supported_endpoint_types || [],
        groups: m.enable_groups || []
      }))
    }
    await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n')
    console.log(`[fetch-pricing] 已写入 ${payload.models.length} 个模型 -> ${OUT}`)
  } catch (e) {
    // 网络失败时保留旧快照,不阻断构建
    try {
      await readFile(OUT)
      console.warn(`[fetch-pricing] 拉取失败(${e.message}),保留已有快照`)
    } catch {
      await writeFile(OUT, JSON.stringify({ updatedAt: null, autoGroups: [], models: [] }, null, 2) + '\n')
      console.warn(`[fetch-pricing] 拉取失败且无快照,已写入空清单`)
    }
  }
}

main()
