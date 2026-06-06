'use client'

import { Icon } from './Icon'

const CSS = `
.oa-hero{position:relative;overflow:hidden;border-radius:20px;padding:64px 32px 56px;margin-top:8px;text-align:center;background:
  radial-gradient(1200px 400px at 50% -120px, rgba(59,130,246,.28), transparent 70%),
  radial-gradient(900px 360px at 90% 10%, rgba(217,119,87,.18), transparent 60%),
  radial-gradient(700px 300px at 5% 20%, rgba(16,163,127,.16), transparent 60%)}
.oa-hero-badge{display:inline-block;font-size:13px;font-weight:600;padding:5px 14px;border-radius:99px;background:rgba(59,130,246,.14);color:#3b82f6;margin-bottom:20px}
.oa-hero h1{font-size:clamp(32px,5vw,52px);line-height:1.1;margin:0 0 16px;font-weight:800;letter-spacing:-.02em}
.oa-hero-grad{background:linear-gradient(90deg,#3b82f6,#10a37f 55%,#d97757);-webkit-background-clip:text;background-clip:text;color:transparent}
.oa-hero p{font-size:clamp(15px,2vw,19px);opacity:.72;max-width:620px;margin:0 auto 28px;line-height:1.6}
.oa-hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.oa-btn{display:inline-flex;align-items:center;gap:7px;padding:12px 26px;border-radius:11px;font-size:15px;font-weight:600;text-decoration:none;transition:transform .12s,box-shadow .2s,background .2s;cursor:pointer}
.oa-btn-primary{background:#3b82f6;color:#fff;box-shadow:0 8px 24px -8px rgba(59,130,246,.6)}
.oa-btn-primary:hover{background:#2563eb;transform:translateY(-2px)}
.oa-btn-ghost{background:rgba(125,125,125,.1);color:inherit;border:1px solid rgba(125,125,125,.25)}
.oa-btn-ghost:hover{background:rgba(125,125,125,.18);transform:translateY(-2px)}
.oa-feat{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:40px}
.oa-feat-card{text-align:left;border:1px solid rgba(125,125,125,.18);border-radius:14px;padding:20px;background:rgba(125,125,125,.03);transition:transform .15s,border-color .15s,box-shadow .15s}
.oa-feat-card:hover{transform:translateY(-3px);border-color:rgba(59,130,246,.4);box-shadow:0 10px 30px -12px rgba(59,130,246,.4)}
.oa-feat-ico{display:inline-flex;padding:9px;border-radius:11px;background:rgba(59,130,246,.12);color:#3b82f6;margin-bottom:12px}
.oa-feat-card h3{margin:0 0 6px;font-size:16px;font-weight:700}
.oa-feat-card p{margin:0;font-size:14px;opacity:.66;line-height:1.55}
`

const FEATURES = [
  { ico: 'link', t: '双协议兼容', d: '同时支持 OpenAI 与 Anthropic 两套协议,现有代码几乎零改动即可接入。' },
  { ico: 'smart_toy', t: '多家模型', d: 'Claude、GPT、Gemini、Qwen、DeepSeek、Grok 等主流模型,一个余额全部调用。' },
  { ico: 'speed', t: '双线路加速', d: '大陆 CDN 与海外 Global 两条线路,就近接入,页面可一键测速。' },
  { ico: 'construction', t: '开箱即用', d: '在线调试、模型浏览、客户端接入教程齐全,几分钟跑通第一个请求。' }
]

export function Hero() {
  return (
    <div>
      <style>{CSS}</style>
      <section className="oa-hero">
        <span className="oa-hero-badge">OpenRealm · AI 模型 API</span>
        <h1>
          一个接口,<span className="oa-hero-grad">调用所有模型</span>
        </h1>
        <p>
          OpenApi 用 OpenAI 与 Anthropic 兼容协议,统一接入 Claude、GPT、Gemini 等多家大模型。
          本站手把手教你从拿到 Key 到接入各类客户端。
        </p>
        <div className="oa-hero-cta">
          <a className="oa-btn oa-btn-primary" href="/getting-started">
            快速开始 <Icon name="arrow_forward" size={18} />
          </a>
          <a className="oa-btn oa-btn-ghost" href="/playground">在线调试</a>
        </div>
        <div className="oa-feat">
          {FEATURES.map(f => (
            <div className="oa-feat-card" key={f.t}>
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
