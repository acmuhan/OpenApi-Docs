'use client'

import { useEffect, useMemo, useState } from 'react'

// 走本站同源代理(app/api/pricing/route.js),绕开 openrealm /api/pricing 未开 CORS 的问题
const PRICING_URL = '/api/pricing'
const PROTO = {
  openai: { label: 'OpenAI', color: '#10a37f' },
  anthropic: { label: 'Anthropic', color: '#d97757' },
  gemini: { label: 'Gemini', color: '#4285f4' }
}

const CSS = `
.oa-ml-wrap{margin-top:20px}
.oa-ml-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.oa-ml-input,.oa-ml-select{padding:9px 12px;border-radius:9px;border:1px solid rgba(125,125,125,.28);background:rgba(125,125,125,.06);color:inherit;font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s}
.oa-ml-input{flex:1 1 220px}
.oa-ml-input:focus,.oa-ml-select:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.oa-ml-count{font-size:13px;opacity:.6;margin-bottom:12px}
.oa-ml-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:12px}
.oa-ml-card{border:1px solid rgba(125,125,125,.2);border-radius:12px;padding:14px;transition:border-color .15s,transform .15s,box-shadow .15s;background:rgba(125,125,125,.03)}
.oa-ml-card:hover{border-color:rgba(59,130,246,.5);transform:translateY(-2px);box-shadow:0 6px 20px -8px rgba(59,130,246,.35)}
.oa-ml-name{cursor:pointer;font-weight:600;word-break:break-all;font-size:14px;display:inline-flex;align-items:center;gap:6px}
.oa-ml-name:hover{color:#3b82f6}
.oa-ml-copied{font-size:11px;color:#10a37f;font-weight:500}
.oa-ml-tags{margin-top:9px;display:flex;gap:6px;flex-wrap:wrap}
.oa-ml-tag{font-size:11px;padding:2px 8px;border-radius:6px;font-weight:600}
.oa-ml-grp{font-size:11px;opacity:.55;margin-top:8px}
.oa-ml-msg{opacity:.7;padding:24px 0;text-align:center}
`

export function ModelList() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [proto, setProto] = useState('all')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    fetch(PRICING_URL, { cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        if (j.error) throw new Error(j.error)
        setData(j.data || [])
      })
      .catch(e => setErr(String(e.message || e)))
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(m => {
      if (q && !m.model_name.toLowerCase().includes(q.toLowerCase())) return false
      if (proto !== 'all' && !(m.supported_endpoint_types || []).includes(proto)) return false
      return true
    })
  }, [data, q, proto])

  function copy(name) {
    navigator.clipboard?.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(c => (c === name ? '' : c)), 1200)
  }

  return (
    <div className="oa-ml-wrap">
      <style>{CSS}</style>
      {err && <p className="oa-ml-msg" style={{ color: '#dc2626' }}>模型列表加载失败:{err}</p>}
      {!data && !err && <p className="oa-ml-msg">正在加载模型列表…</p>}
      {data && (
        <>
          <div className="oa-ml-bar">
            <input className="oa-ml-input" placeholder="搜索模型名…" value={q} onChange={e => setQ(e.target.value)} />
            <select className="oa-ml-select" value={proto} onChange={e => setProto(e.target.value)}>
              <option value="all">全部协议</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          <div className="oa-ml-count">共 {filtered.length} 个模型 · 点击模型名复制</div>
          <div className="oa-ml-grid">
            {filtered.map(m => (
              <div key={m.model_name} className="oa-ml-card">
                <code className="oa-ml-name" title="点击复制" onClick={() => copy(m.model_name)}>
                  {m.model_name}
                  {copied === m.model_name && <span className="oa-ml-copied">已复制</span>}
                </code>
                <div className="oa-ml-tags">
                  {(m.supported_endpoint_types || []).map(p => {
                    const info = PROTO[p] || { label: p, color: '#888' }
                    return (
                      <span key={p} className="oa-ml-tag" style={{ background: info.color + '22', color: info.color }}>
                        {info.label}
                      </span>
                    )
                  })}
                </div>
                <div className="oa-ml-grp">分组:{(m.enable_groups || []).join(' / ') || '—'}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
