'use client'

import { useState } from 'react'

const LINES = [
  { name: '主线路 · 大陆 CDN', url: 'https://api.openrealm.cn' },
  { name: 'Global · 纯 API 加速', url: 'https://global.api.openrealm.cn' },
  { name: 'Global EdgeOne 线路', url: 'https://api.openapi.edgeone.gloabl.muhan.wiki' }
]

const PROBE_PATH = '/v1/models' // 该端点 CORS 全开,适合测速(401 也能测往返延迟)
const ROUNDS = 5

function rate(ms) {
  if (ms == null) return { label: '—', color: 'inherit', pct: 0 }
  if (ms < 150) return { label: '极快', color: '#10a37f', pct: 100 }
  if (ms < 400) return { label: '良好', color: '#ca8a04', pct: 65 }
  return { label: '较慢', color: '#dc2626', pct: 35 }
}

const CSS = `
.oa-sp{border:1px solid rgba(125,125,125,.2);border-radius:14px;padding:18px;margin-top:20px;background:rgba(125,125,125,.03)}
.oa-sp-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.oa-sp-hd strong{font-size:15px}
.oa-sp-btn{padding:7px 18px;border-radius:9px;border:none;background:#3b82f6;color:#fff;cursor:pointer;font-size:14px;font-weight:500;transition:background .15s,transform .1s}
.oa-sp-btn:hover:not(:disabled){background:#2563eb}
.oa-sp-btn:active:not(:disabled){transform:scale(.97)}
.oa-sp-btn:disabled{opacity:.6;cursor:default}
.oa-sp-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-top:1px solid rgba(125,125,125,.16)}
.oa-sp-info{flex:1 1 auto;min-width:0}
.oa-sp-info code{font-size:12px;opacity:.6}
.oa-sp-track{height:6px;border-radius:99px;background:rgba(125,125,125,.18);margin-top:7px;overflow:hidden}
.oa-sp-fill{height:100%;border-radius:99px;transition:width .5s ease,background .3s}
.oa-sp-ms{font-variant-numeric:tabular-nums;font-size:14px;min-width:62px;text-align:right}
.oa-sp-badge{font-weight:600;font-size:13px;min-width:38px;text-align:right}
.oa-sp-note{font-size:12px;opacity:.55;margin:12px 0 0}
@keyframes oa-pulse{0%,100%{opacity:.4}50%{opacity:1}}
.oa-sp-testing{animation:oa-pulse 1s ease-in-out infinite}
`

export function LineSpeedTest() {
  const [results, setResults] = useState({})
  const [testing, setTesting] = useState(false)

  async function probe(url) {
    const times = []
    for (let i = 0; i < ROUNDS; i++) {
      const t0 = performance.now()
      try {
        await fetch(url + PROBE_PATH, { cache: 'no-store' })
        times.push(performance.now() - t0)
      } catch {
        /* 忽略单次失败 */
      }
    }
    if (!times.length) return null
    times.sort((a, b) => a - b)
    return Math.round(times[Math.floor(times.length / 2)])
  }

  async function runAll() {
    setTesting(true)
    setResults({})
    for (const line of LINES) {
      const ms = await probe(line.url)
      setResults(r => ({ ...r, [line.url]: ms }))
    }
    setTesting(false)
  }

  return (
    <div className="oa-sp">
      <style>{CSS}</style>
      <div className="oa-sp-hd">
        <strong>线路测速</strong>
        <button className="oa-sp-btn" onClick={runAll} disabled={testing}>
          {testing ? '测速中…' : '开始测速'}
        </button>
      </div>
      {LINES.map(line => {
        const ms = results[line.url]
        const r = rate(ms)
        const pending = testing && ms === undefined
        return (
          <div className="oa-sp-row" key={line.url}>
            <div className="oa-sp-info">
              <div>{line.name}</div>
              <code>{line.url}</code>
              <div className="oa-sp-track">
                <div className="oa-sp-fill" style={{ width: r.pct + '%', background: r.color === 'inherit' ? 'transparent' : r.color }} />
              </div>
            </div>
            <span className={'oa-sp-ms' + (pending ? ' oa-sp-testing' : '')}>
              {ms == null ? (pending ? '测试中' : '—') : ms + ' ms'}
            </span>
            <span className="oa-sp-badge" style={{ color: r.color }}>{r.label}</span>
          </div>
        )
      })}
      <p className="oa-sp-note">测速在你的浏览器本地进行,结果受本地网络影响,仅供参考。</p>
    </div>
  )
}
