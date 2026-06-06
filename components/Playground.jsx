'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import pricing from './pricing-data.json'

// 模型清单:构建期快照作初始/兜底值;挂载后请求边缘函数 /api/pricing 拿实时数据覆盖。
const SNAPSHOT_MODELS = (pricing.models || [])
  .filter(m => (m.endpoints || []).includes('openai'))
  .map(m => m.name)

const BASES = [
  { name: '主站 · 大陆 CDN', url: 'https://api.openrealm.cn/v1' },
  { name: 'Global · 海外加速', url: 'https://global.api.openrealm.cn/v1' }
]

const CSS = `
.oa-pg{border:1px solid rgba(125,125,125,.2);border-radius:14px;padding:18px;margin-top:20px;background:rgba(125,125,125,.03)}
.oa-pg-grid{display:grid;gap:14px}
.oa-pg-lbl{font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px;opacity:.85}
.oa-pg-row{display:flex;gap:12px;flex-wrap:wrap}
.oa-pg-f{width:100%;margin-top:6px;padding:9px 12px;border-radius:9px;border:1px solid rgba(125,125,125,.28);background:rgba(125,125,125,.06);color:inherit;font-size:14px;box-sizing:border-box;outline:none;transition:border-color .15s,box-shadow .15s;font-family:inherit}
.oa-pg-f:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.oa-pg-ta{resize:vertical;min-height:64px}
.oa-pg-modelbox{position:relative}
.oa-pg-menu{position:absolute;z-index:20;left:0;right:0;top:100%;margin-top:4px;max-height:240px;overflow:auto;border:1px solid rgba(125,125,125,.3);border-radius:9px;background:#fff;box-shadow:0 12px 32px -10px rgba(0,0,0,.5)}
html[class~=dark] .oa-pg-menu{background:#1c1c22}
.oa-pg-opt{padding:8px 12px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:ui-monospace,monospace}
.oa-pg-opt:hover,.oa-pg-opt.act{background:rgba(59,130,246,.14)}
.oa-pg-opt-tag{margin-left:auto;font-size:10px;padding:1px 6px;border-radius:4px;background:#3b82f622;color:#3b82f6;font-family:system-ui}
.oa-pg-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;border-radius:9px;border:none;background:#3b82f6;color:#fff;cursor:pointer;font-size:14px;font-weight:600;justify-self:start;transition:background .15s,transform .1s}
.oa-pg-btn:hover:not(:disabled){background:#2563eb}
.oa-pg-btn:active:not(:disabled){transform:scale(.97)}
.oa-pg-btn:disabled{opacity:.55;cursor:default}
.oa-pg-out{margin-top:14px;padding:14px;border-radius:10px;white-space:pre-wrap;word-break:break-word;font-size:14px;line-height:1.6}
.oa-pg-ok{background:rgba(16,163,127,.08);border:1px solid rgba(16,163,127,.25)}
.oa-pg-err{background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.3);color:#dc2626;font-size:13px}
.oa-pg-note{font-size:12px;opacity:.55;margin:12px 0 0;display:flex;align-items:flex-start;gap:6px}
.oa-pg-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#fff;animation:oa-bounce 1.2s infinite}
.oa-pg-dot:nth-child(2){animation-delay:.15s}.oa-pg-dot:nth-child(3){animation-delay:.3s}
@keyframes oa-bounce{0%,80%,100%{opacity:.3}40%{opacity:1}}
`

export function Playground() {
  const [apiKey, setApiKey] = useState('')
  const [base, setBase] = useState(BASES[0].url)
  const [model, setModel] = useState('gpt-5.5')
  const [prompt, setPrompt] = useState('用一句话介绍你自己')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const [models, setModels] = useState(SNAPSHOT_MODELS)

  useEffect(() => {
    let alive = true
    fetch('/api/pricing', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!alive || !j || !Array.isArray(j.models)) return
        const list = j.models.filter(m => (m.endpoints || []).includes('openai')).map(m => m.name)
        if (list.length) setModels(list)
      })
      .catch(() => {}) // 边缘函数未就绪时静默保留快照
    return () => { alive = false }
  }, [])

  useEffect(() => {
    function onDoc(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const matches = models.filter(m => m.toLowerCase().includes(model.toLowerCase())).slice(0, 30)

  async function send() {
    setLoading(true)
    setOutput('')
    setError('')
    try {
      const res = await fetch(base + '/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] })
      })
      const text = await res.text()
      let json
      try {
        json = JSON.parse(text)
      } catch {
        throw new Error(text.slice(0, 500))
      }
      if (!res.ok) throw new Error((json.error && json.error.message) || text.slice(0, 500))
      setOutput(json.choices?.[0]?.message ? json.choices[0].message.content : JSON.stringify(json, null, 2))
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="oa-pg">
      <style>{CSS}</style>
      <div className="oa-pg-grid">
        <label>
          <span className="oa-pg-lbl"><Icon name="key" size={14} />API Key</span>
          <input className="oa-pg-f" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
        </label>
        <div className="oa-pg-row">
          <label style={{ flex: '1 1 200px' }}>
            <span className="oa-pg-lbl"><Icon name="dns" size={14} />线路</span>
            <select className="oa-pg-f" value={base} onChange={e => setBase(e.target.value)}>
              {BASES.map(b => <option key={b.url} value={b.url}>{b.name}</option>)}
            </select>
          </label>
          <label style={{ flex: '1 1 200px' }}>
            <span className="oa-pg-lbl"><Icon name="smart_toy" size={14} />模型 {models.length > 0 && <span style={{ opacity: .5, fontWeight: 400 }}>({models.length} 个可选)</span>}</span>
            <div className="oa-pg-modelbox" ref={boxRef}>
              <input
                className="oa-pg-f"
                value={model}
                onChange={e => { setModel(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                placeholder="输入或选择模型"
              />
              {open && matches.length > 0 && (
                <div className="oa-pg-menu">
                  {matches.map(m => (
                    <div key={m} className={'oa-pg-opt' + (m === model ? ' act' : '')} onClick={() => { setModel(m); setOpen(false) }}>
                      {m}
                      {m === model && <Icon name="check_circle" size={14} color="#3b82f6" style={{ marginLeft: 'auto' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
        <label>
          <span className="oa-pg-lbl"><Icon name="chat" size={14} />消息</span>
          <textarea className="oa-pg-f oa-pg-ta" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} />
        </label>
        <button className="oa-pg-btn" onClick={send} disabled={loading || !apiKey}>
          {loading
            ? <><span className="oa-pg-dot" /><span className="oa-pg-dot" /><span className="oa-pg-dot" /></>
            : <><Icon name="bolt" size={16} />发送请求</>}
        </button>
      </div>
      {error && <pre className="oa-pg-out oa-pg-err">错误:{error}</pre>}
      {output && <pre className="oa-pg-out oa-pg-ok">{output}</pre>}
      <p className="oa-pg-note">
        <Icon name="key" size={14} style={{ opacity: .6, marginTop: 1 }} />
        Key 只保存在你当前浏览器内存中,请求直接发往所选线路,不经过本站服务器。建议使用额度有限的测试 Key。
      </p>
    </div>
  )
}
