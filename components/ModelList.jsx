'use client'

import { useEffect, useMemo, useState } from 'react'
import pricing from './pricing-data.json'
import { Select } from './Select'

// 数据策略:构建期快照(pricing-data.json)作为初始/兜底值,确保静态导出后立即有内容;
// 挂载后再请求边缘函数 /api/pricing(functions/api/pricing.js)拿实时数据覆盖。
// 边缘函数未就绪或失败时,静默保留快照,不显示错误。
const SNAPSHOT = pricing.models || []
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
  const [models, setModels] = useState(SNAPSHOT)
  const [q, setQ] = useState('')
  const [proto, setProto] = useState('all')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    let alive = true
    fetch('/api/pricing', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (alive && j && Array.isArray(j.models) && j.models.length) setModels(j.models)
      })
      .catch(() => {}) // 边缘函数未就绪时静默保留快照
    return () => { alive = false }
  }, [])

  const filtered = useMemo(() => {
    return models.filter(m => {
      if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false
      if (proto !== 'all' && !(m.endpoints || []).includes(proto)) return false
      return true
    })
  }, [models, q, proto])

  function copy(name) {
    navigator.clipboard?.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(c => (c === name ? '' : c)), 1200)
  }

  if (!models.length) {
    return <p className="oa-ml-msg" style={{ color: '#dc2626' }}>暂无模型数据,请稍后再试。</p>
  }

  return (
    <div className="oa-ml-wrap">
      <style>{CSS}</style>
      <div className="oa-ml-bar">
        <input className="oa-ml-input" placeholder="搜索模型名…" value={q} onChange={e => setQ(e.target.value)} />
        <div style={{ flex: '0 0 160px' }}>
          <Select
            value={proto}
            onChange={setProto}
            icon="tune"
            options={[
              { value: 'all', label: '全部协议' },
              { value: 'openai', label: 'OpenAI' },
              { value: 'anthropic', label: 'Anthropic' },
              { value: 'gemini', label: 'Gemini' }
            ]}
          />
        </div>
      </div>
      <div className="oa-ml-count">共 {filtered.length} 个模型 · 点击模型名复制</div>
      <div className="oa-ml-grid">
        {filtered.map(m => (
          <div key={m.name} className="oa-ml-card">
            <code className="oa-ml-name" title="点击复制" onClick={() => copy(m.name)}>
              {m.name}
              {copied === m.name && <span className="oa-ml-copied">已复制</span>}
            </code>
            <div className="oa-ml-tags">
              {(m.endpoints || []).map(p => {
                const info = PROTO[p] || { label: p, color: '#888' }
                return (
                  <span key={p} className="oa-ml-tag" style={{ background: info.color + '22', color: info.color }}>
                    {info.label}
                  </span>
                )
              })}
            </div>
            <div className="oa-ml-grp">分组:{(m.groups || []).join(' / ') || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
