// ESA Pages 边缘函数:代理 openrealm 的模型清单,补上 CORS 并归一化字段。
// 路由约定:functions/api/pricing.js -> 同源 /api/pricing(Pages Functions 模型)。
// 组件优先请求本函数获取「实时」模型;若本函数未就绪,组件会回退到构建期快照。
export async function onRequest() {
  try {
    const res = await fetch('https://api.openrealm.cn/api/pricing', {
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) return json({ error: `上游返回 ${res.status}` }, 502)
    const j = await res.json()
    const models = (Array.isArray(j.data) ? j.data : []).map(m => ({
      name: m.model_name,
      endpoints: m.supported_endpoint_types || [],
      groups: m.enable_groups || []
    }))
    return json({
      updatedAt: new Date().toISOString(),
      autoGroups: j.auto_groups || [],
      models
    })
  } catch (e) {
    return json({ error: String((e && e.message) || e) }, 502)
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=600'
    }
  })
}
