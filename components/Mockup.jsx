'use client'

import { Icon } from './Icon'

const CSS = `
.oa-mk{border:1px solid rgba(125,125,125,.22);border-radius:12px;overflow:hidden;margin:18px 0;background:rgba(125,125,125,.03);box-shadow:0 8px 30px -16px rgba(0,0,0,.4)}
.oa-mk-bar{display:flex;align-items:center;gap:7px;padding:9px 13px;background:rgba(125,125,125,.1);border-bottom:1px solid rgba(125,125,125,.18)}
.oa-mk-dot{width:11px;height:11px;border-radius:50%}
.oa-mk-title{margin-left:8px;font-size:12px;opacity:.6;display:inline-flex;align-items:center;gap:6px}
.oa-mk-body{padding:18px}
.oa-mk-field{margin-bottom:14px}
.oa-mk-field:last-child{margin-bottom:0}
.oa-mk-lbl{font-size:12px;font-weight:600;opacity:.7;margin-bottom:5px;display:flex;align-items:center;gap:5px}
.oa-mk-inp{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;border:1px solid rgba(125,125,125,.3);background:rgba(125,125,125,.05);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px}
.oa-mk-inp.hl{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.16);background:rgba(59,130,246,.06)}
.oa-mk-inp.hl2{border-color:#10a37f;box-shadow:0 0 0 3px rgba(16,163,127,.16);background:rgba(16,163,127,.06)}
.oa-mk-tag{margin-left:auto;font-size:11px;font-weight:700;padding:1px 8px;border-radius:5px}
.oa-mk-tag.b{background:#3b82f622;color:#3b82f6}
.oa-mk-tag.g{background:#10a37f22;color:#10a37f}
.oa-mk-sel{display:flex;align-items:center;padding:9px 12px;border-radius:8px;border:1px solid rgba(125,125,125,.3);background:rgba(125,125,125,.05);font-size:13px}
.oa-mk-sel::after{content:'';margin-left:auto;border:5px solid transparent;border-top-color:currentColor;opacity:.5;transform:translateY(2px)}
.oa-mk-cap{font-size:12px;opacity:.55;text-align:center;margin:-8px 0 18px}
/* terminal */
.oa-tm{border-radius:12px;overflow:hidden;margin:18px 0;border:1px solid rgba(125,125,125,.22);background:#1e1e2e}
.oa-tm-body{padding:16px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;color:#cdd6f4;overflow-x:auto}
.oa-tm-line{white-space:pre}
.oa-tm-cmd{color:#a6e3a1}
.oa-tm-var{color:#89b4fa}
.oa-tm-cmt{color:#6c7086}
.oa-tm-out{color:#bac2de}
`

const DOTS = ['#ff5f57', '#febc2e', '#28c840']

function Frame({ title, titleIcon, children }) {
  return (
    <div className="oa-mk">
      <div className="oa-mk-bar">
        {DOTS.map(c => <span key={c} className="oa-mk-dot" style={{ background: c }} />)}
        <span className="oa-mk-title">
          {titleIcon && <Icon name={titleIcon} size={14} />}
          {title}
        </span>
      </div>
      <div className="oa-mk-body">{children}</div>
    </div>
  )
}

// 通用「设置面板」示意图:展示 Base URL 与 API Key 应填的位置
export function ConfigShot({ app = '设置 · 模型服务', baseLabel = 'API 地址', base, keyLabel = 'API 密钥', model, caption }) {
  return (
    <>
      <style>{CSS}</style>
      <Frame title={app} titleIcon="settings">
        <div className="oa-mk-field">
          <div className="oa-mk-lbl"><Icon name="dns" size={13} />{baseLabel}</div>
          <div className="oa-mk-inp hl">
            <span>{base}</span>
            <span className="oa-mk-tag b">Base URL</span>
          </div>
        </div>
        <div className="oa-mk-field">
          <div className="oa-mk-lbl"><Icon name="key" size={13} />{keyLabel}</div>
          <div className="oa-mk-inp hl2">
            <span>sk-••••••••••••••••</span>
            <span className="oa-mk-tag g">API Key</span>
          </div>
        </div>
        {model && (
          <div className="oa-mk-field">
            <div className="oa-mk-lbl"><Icon name="smart_toy" size={13} />模型</div>
            <div className="oa-mk-sel">{model}</div>
          </div>
        )}
      </Frame>
      {caption && <p className="oa-mk-cap">{caption}</p>}
    </>
  )
}

// 终端示意图:行数组,每行 {t, type}
export function TerminalShot({ title = 'Terminal', lines = [], caption }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="oa-tm">
        <div className="oa-mk-bar">
          {DOTS.map(c => <span key={c} className="oa-mk-dot" style={{ background: c }} />)}
          <span className="oa-mk-title"><Icon name="terminal" size={14} />{title}</span>
        </div>
        <div className="oa-tm-body">
          {lines.map((l, i) => (
            <div className="oa-tm-line" key={i}>
              <span className={'oa-tm-' + (l.type || 'out')}>{l.t || ' '}</span>
            </div>
          ))}
        </div>
      </div>
      {caption && <p className="oa-mk-cap">{caption}</p>}
    </>
  )
}
