'use client'

import { useState } from 'react'
import { Icon } from './Icon'

const BASES = [
  { name: '主站 · 大陆 CDN', url: 'https://api.openrealm.cn/v1' },
  { name: 'Global · 海外加速', url: 'https://global.api.openrealm.cn/v1' }
]

const CSS = `
.oa-mm{border:1px solid rgba(125,125,125,.2);border-radius:14px;padding:18px;margin-top:20px;background:rgba(125,125,125,.03)}
.oa-mm-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
.oa-mm-lbl{font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px;opacity:.85}
.oa-mm-f{margin-top:6px;padding:9px 12px;border-radius:9px;border:1px solid rgba(125,125,125,.28);background:rgba(125,125,125,.06);color:inherit;font-size:14px;box-sizing:border-box;outline:none;transition:border-color .15s,box-shadow .15s;width:100%}
.oa-mm-f:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.oa-mm-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:9px;border:none;background:#3b82f6;color:#fff;cursor:pointer;font-size:14px;font-weight:600;transition:background .15s,transform .1s;white-space:nowrap}
.oa-mm-btn:hover:not(:disabled){background:#2563eb}
.oa-mm-btn:active:not(:disabled){transform:scale(.97)}
.oa-mm-btn:disabled{opacity:.55;cursor:default}
.oa-mm-err{margin-top:14px;padding:12px 14px;border-radius:10px;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.3);color:#dc2626;font-size:13px;display:flex;gap:8px;align-items:flex-start}
.oa-mm-head{margin-top:16px;display:flex;align-items:center;gap:8px;font-size:13px;opacity:.7}
.oa-mm-search{margin:12px 0;}
.oa-mm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.oa-mm-chip{display:flex;align-items:center;gap:8px;border:1px solid rgba(125,125,125,.2);border-radius:9px;padding:8px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;cursor:pointer;transition:border-color .15s,background .15s;word-break:break-all}
.oa-mm-chip:hover{border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.06)}
.oa-mm-copied{margin-left:auto;font-size:11px;color:#10a37f;font-weight:600;font-family:system-ui;flex-shrink:0}
.oa-mm-note{font-size:12px;opacity:.55;margin:12px 0 0;display:flex;align-items:flex-start;gap:6px}
.oa-mm-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#fff;animation:oa-mmb 1.2s infinite}
.oa-mm-dot:nth-child(2){animation-delay:.15s}.oa-mm-dot:nth-child(3){animation-delay:.3s}
@keyframes oa-mmb{0%,80%,100%{opacity:.3}40%{opacity:1}}
`

export function MyModels() {
  const [apiKey, setApiKey] = useState('')
  const [base, setBase] = useState(BASES[0].url)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState('')

  async function query() {
    setLoading(true)
    setError('')
    setModels(null)
    try {
      const res = await fetch(base + '/models', {
        headers: { Authorization: 'Bearer ' + apiKey }
      })
      const text = await res.text()
      let json
      try {
        json = JSON.parse(text)
      } catch {
        throw new Error(text.slice(0, 300))
      }
      if (!res.ok) throw new Error((json.error && json.error.message) || `HTTP ${res.status}`)
      const list = (json.data || []).map(m => m.id || m.model_name).filter(Boolean).sort()
      setModels(list)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  function copy(name) {
    navigator.clipboard?.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(c => (c === name ? '' : c)), 1200)
  }

  const filtered = models ? models.filter(m => m.toLowerCase().includes(q.toLowerCase())) : []

  return (
    <div className="oa-mm">
      <style>{CSS}</style>
      <div className="oa-mm-row">
        <label style={{ flex: '2 1 240px' }}>
          <span className="oa-mm-lbl"><Icon name="key" size={14} />API Key</span>
          <input className="oa-mm-f" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
        </label>
        <label style={{ flex: '1 1 180px' }}>
          <span className="oa-mm-lbl"><Icon name="dns" size={14} />线路</span>
          <select className="oa-mm-f" value={base} onChange={e => setBase(e.target.value)}>
            {BASES.map(b => <option key={b.url} value={b.url}>{b.name}</option>)}
          </select>
        </label>
        <button className="oa-mm-btn" onClick={query} disabled={loading || !apiKey}>
          {loading
            ? <><span className="oa-mm-dot" /><span className="oa-mm-dot" /><span className="oa-mm-dot" /></>
            : <><Icon name="search" size={16} />查询</>}
        </button>
      </div>

      {error && (
        <div className="oa-mm-err">
          <Icon name="warning" size={16} color="#dc2626" style={{ marginTop: 1 }} />
          <span>{error}<br /><span style={{ opacity: .8 }}>常见原因:Key 无效或填错线路。</span></span>
        </div>
      )}

      {models && (
        <>
          <div className="oa-mm-head">
            <Icon name="check_circle" size={16} color="#10a37f" />
            该 Key 可调用 <strong>{filtered.length}</strong> 个模型
          </div>
          <input className="oa-mm-f oa-mm-search" placeholder="过滤模型名…" value={q} onChange={e => setQ(e.target.value)} />
          <div className="oa-mm-grid">
            {filtered.map(m => (
              <code key={m} className="oa-mm-chip" title="点击复制" onClick={() => copy(m)}>
                {m}
                {copied === m && <span className="oa-mm-copied">已复制</span>}
              </code>
            ))}
          </div>
        </>
      )}

      <p className="oa-mm-note">
        <Icon name="key" size={14} style={{ opacity: .6, marginTop: 1 }} />
        查询直接发往所选线路(OpenAI 标准 <code>/v1/models</code>),Key 不经过本站服务器。返回的是该 Key 所属分组实际可用的模型。
      </p>
    </div>
  )
}
