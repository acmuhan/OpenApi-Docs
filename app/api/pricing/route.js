// 同源代理:浏览器请求本站 /api/pricing,由服务端去取 openrealm。
// 原因:openrealm 的 /api/pricing 未开 CORS,浏览器直连会 Failed to fetch;
// 服务端之间无跨域限制,故在此中转。结果缓存 10 分钟。
export const revalidate = 600

export async function GET() {
  try {
    const res = await fetch('https://api.openrealm.cn/api/pricing', {
      next: { revalidate: 600 }
    })
    if (!res.ok) {
      return Response.json({ error: `上游返回 ${res.status}` }, { status: 502 })
    }
    const json = await res.json()
    return Response.json(json)
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 502 })
  }
}
