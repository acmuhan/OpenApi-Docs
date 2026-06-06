'use client'

import pricing from './pricing-data.json'

// 取真实模型名做成无限横向滚动带。按协议着色,直观展示「调用所有模型」。
const PROTO_COLOR = { openai: '#10a37f', anthropic: '#d97757', gemini: '#4285f4' }

function colorOf(m) {
  const eps = m.endpoints || []
  for (const k of ['anthropic', 'gemini', 'openai']) if (eps.includes(k)) return PROTO_COLOR[k]
  return '#8b5cf6'
}

const ALL = (pricing.models || []).map(m => ({ name: m.name, color: colorOf(m) }))
const half = Math.ceil(ALL.length / 2) || 1
const ROW_A = ALL.slice(0, half)
const ROW_B = ALL.slice(half).length ? ALL.slice(half) : ALL.slice(0, half)

const CSS = `
.oa-mq{position:relative;margin:8px 0 4px;overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.oa-mq-row{display:flex;width:max-content;gap:10px;padding:6px 0}
.oa-mq-row.a{animation:oa-mq-l 40s linear infinite}
.oa-mq-row.b{animation:oa-mq-r 46s linear infinite;margin-top:4px}
.oa-mq:hover .oa-mq-row{animation-play-state:paused}
.oa-mq-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:99px;border:1px solid rgba(125,125,125,.2);background:rgba(125,125,125,.04);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;white-space:nowrap;transition:transform .15s,border-color .15s}
.oa-mq-chip:hover{transform:translateY(-2px)}
.oa-mq-d{width:8px;height:8px;border-radius:50%;flex-shrink:0}
@keyframes oa-mq-l{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes oa-mq-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@media (prefers-reduced-motion: reduce){.oa-mq-row{animation:none!important}.oa-mq{-webkit-mask-image:none;mask-image:none}.oa-mq-row{flex-wrap:wrap;width:auto}}
`

function Row({ items, cls }) {
  const doubled = [...items, ...items] // 首尾相接,实现无缝循环
  return (
    <div className={'oa-mq-row ' + cls}>
      {doubled.map((m, i) => (
        <span className="oa-mq-chip" key={i}>
          <span className="oa-mq-d" style={{ background: m.color }} />
          {m.name}
        </span>
      ))}
    </div>
  )
}

export function ModelMarquee() {
  if (!ALL.length) return null
  return (
    <div className="oa-mq">
      <style>{CSS}</style>
      <Row items={ROW_A} cls="a" />
      <Row items={ROW_B} cls="b" />
    </div>
  )
}
