'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import pricing from './pricing-data.json'

const MODELS = pricing.models || []
const STATS = [
  { value: MODELS.length || 31, suffix: '+', label: '可用模型' },
  { value: 2, suffix: '', label: '兼容协议' },
  { value: 3, suffix: '', label: '加速线路' }
]

const FEATURES = [
  { ico: 'link', t: '双协议兼容', d: '同时支持 OpenAI 与 Anthropic 两套协议,现有代码几乎零改动即可接入。' },
  { ico: 'smart_toy', t: '多家模型', d: 'Claude、GPT、Gemini、Qwen、DeepSeek、Grok 等主流模型,一个余额全部调用。' },
  { ico: 'speed', t: '三线路加速', d: '主线路、Global 线路、Global EdgeOne 线路,按网络环境就近选择。' },
  { ico: 'construction', t: '开箱即用', d: '在线调试、模型浏览、客户端接入教程齐全,几分钟跑通第一个请求。' }
]

const CSS = `
.oa-hero{position:relative;overflow:hidden;border-radius:20px;padding:72px 32px 60px;margin-top:8px;text-align:center;isolation:isolate}
.oa-hero::before{content:'';position:absolute;inset:-40% -20% auto -20%;height:160%;z-index:-1;
  background:
    radial-gradient(1100px 420px at 50% -80px, rgba(59,130,246,.30), transparent 70%),
    radial-gradient(820px 360px at 88% 8%, rgba(217,119,87,.20), transparent 60%),
    radial-gradient(680px 320px at 6% 22%, rgba(16,163,127,.18), transparent 60%);
  background-size:200% 200%;animation:oa-aurora 18s ease-in-out infinite}
.oa-hero-badge{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:5px 14px;border-radius:99px;background:rgba(59,130,246,.14);color:#3b82f6;margin-bottom:20px;opacity:0;animation:oa-up .6s .05s ease both}
.oa-hero-badge .oa-dot{width:7px;height:7px;border-radius:50%;background:#10a37f;box-shadow:0 0 0 0 rgba(16,163,127,.6);animation:oa-pulse 2s infinite}
.oa-hero h1{font-size:clamp(32px,5vw,54px);line-height:1.1;margin:0 0 16px;font-weight:800;letter-spacing:-.02em;opacity:0;animation:oa-up .6s .12s ease both}
.oa-hero-grad{background:linear-gradient(90deg,#3b82f6,#10a37f,#d97757,#3b82f6);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:oa-flow 8s linear infinite}
.oa-hero-sub{font-size:clamp(15px,2vw,19px);opacity:0;max-width:620px;margin:0 auto 28px;line-height:1.6;color:inherit;animation:oa-up .6s .2s ease both}
.oa-hero-sub span{opacity:.72}
.oa-hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;opacity:0;animation:oa-up .6s .28s ease both}
.oa-btn{display:inline-flex;align-items:center;gap:7px;padding:12px 26px;border-radius:11px;font-size:15px;font-weight:600;text-decoration:none;transition:transform .15s,box-shadow .25s,background .2s;cursor:pointer}
.oa-btn-primary{background:#3b82f6;color:#fff;box-shadow:0 8px 24px -8px rgba(59,130,246,.6)}
.oa-btn-primary:hover{background:#2563eb;transform:translateY(-2px);box-shadow:0 12px 30px -8px rgba(59,130,246,.75)}
.oa-btn-primary .oa-ar{transition:transform .2s}
.oa-btn-primary:hover .oa-ar{transform:translateX(4px)}
.oa-btn-ghost{background:rgba(125,125,125,.1);color:inherit;border:1px solid rgba(125,125,125,.25)}
.oa-btn-ghost:hover{background:rgba(125,125,125,.18);transform:translateY(-2px)}
.oa-stats{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-top:40px;opacity:0;animation:oa-up .6s .36s ease both}
.oa-stat-n{font-size:34px;font-weight:800;line-height:1;background:linear-gradient(90deg,#3b82f6,#10a37f);-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums}
.oa-stat-l{font-size:13px;opacity:.6;margin-top:6px}
.oa-feat{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:48px;text-align:left}
.oa-feat-card{border:1px solid rgba(125,125,125,.18);border-radius:14px;padding:20px;background:rgba(125,125,125,.03);transition:transform .18s,border-color .18s,box-shadow .18s;opacity:0;animation:oa-up .6s ease both}
.oa-feat-card:hover{transform:translateY(-4px);border-color:rgba(59,130,246,.4);box-shadow:0 14px 34px -14px rgba(59,130,246,.45)}
.oa-feat-ico{display:inline-flex;padding:9px;border-radius:11px;background:rgba(59,130,246,.12);color:#3b82f6;margin-bottom:12px;transition:transform .2s}
.oa-feat-card:hover .oa-feat-ico{transform:scale(1.1) rotate(-4deg)}
.oa-feat-card h3{margin:0 0 6px;font-size:16px;font-weight:700}
.oa-feat-card p{margin:0;font-size:14px;opacity:.66;line-height:1.55}
@keyframes oa-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes oa-flow{to{background-position:300% 0}}
@keyframes oa-aurora{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes oa-pulse{0%{box-shadow:0 0 0 0 rgba(16,163,127,.5)}70%{box-shadow:0 0 0 7px rgba(16,163,127,0)}100%{box-shadow:0 0 0 0 rgba(16,163,127,0)}}
@media (prefers-reduced-motion: reduce){
  .oa-hero::before,.oa-hero-grad,.oa-hero-badge .oa-dot{animation:none}
  .oa-hero-badge,.oa-hero h1,.oa-hero-sub,.oa-hero-cta,.oa-stats,.oa-feat-card{animation:none;opacity:1}
}
`

function useCountUp(target, run, duration = 1100) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(target)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = now => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return n
}

function Stat({ value, suffix, label, run }) {
  const n = useCountUp(value, run)
  return (
    <div>
      <div className="oa-stat-n">{n}{suffix}</div>
      <div className="oa-stat-l">{label}</div>
    </div>
  )
}

export function Hero() {
  const [run, setRun] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect() } },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div>
      <style>{CSS}</style>
      <section className="oa-hero" ref={ref}>
        <span className="oa-hero-badge"><span className="oa-dot" />OpenRealm · AI 模型 API</span>
        <h1>
          一个接口,<span className="oa-hero-grad">调用所有模型</span>
        </h1>
        <p className="oa-hero-sub">
          <span>OpenApi 用 OpenAI 与 Anthropic 兼容协议,统一接入 Claude、GPT、Gemini 等多家大模型。本站手把手教你从拿到 Key 到接入各类客户端。</span>
        </p>
        <div className="oa-hero-cta">
          <a className="oa-btn oa-btn-primary" href="/getting-started">
            快速开始 <Icon name="arrow_forward" size={18} style={{ display: 'inline' }} />
          </a>
          <a className="oa-btn oa-btn-ghost" href="/playground">在线调试</a>
        </div>
        <div className="oa-stats">
          {STATS.map(s => <Stat key={s.label} {...s} run={run} />)}
        </div>
        <div className="oa-feat">
          {FEATURES.map((f, i) => (
            <div className="oa-feat-card" key={f.t} style={{ animationDelay: 0.44 + i * 0.08 + 's' }}>
              <span className="oa-feat-ico"><Icon name={f.ico} size={22} /></span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
