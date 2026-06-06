'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

// 符合主题的自定义下拉框,替换原生 <select>。明暗适配、点击外部关闭。
const CSS = `
.oa-sel{position:relative}
.oa-sel-btn{width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:9px;border:1px solid rgba(125,125,125,.28);background:rgba(125,125,125,.06);color:inherit;font-size:14px;cursor:pointer;transition:border-color .15s,box-shadow .15s;box-sizing:border-box;text-align:left}
.oa-sel-btn:hover{border-color:rgba(125,125,125,.45)}
.oa-sel-btn.open{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.oa-sel-val{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oa-sel-ar{opacity:.5;transition:transform .18s;flex-shrink:0;transform:rotate(90deg)}
.oa-sel-btn.open .oa-sel-ar{transform:rotate(270deg)}
.oa-sel-menu{position:absolute;z-index:30;left:0;right:0;top:100%;margin-top:5px;max-height:280px;overflow:auto;border:1px solid rgba(125,125,125,.3);border-radius:10px;background:#fff;box-shadow:0 12px 34px -10px rgba(0,0,0,.45);padding:4px;animation:oa-sel-in .14s ease}
html[class~=dark] .oa-sel-menu{background:#1c1c22}
.oa-sel-opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;font-size:14px;cursor:pointer;transition:background .12s}
.oa-sel-opt:hover{background:rgba(59,130,246,.12)}
.oa-sel-opt.act{background:rgba(59,130,246,.16);font-weight:600}
.oa-sel-opt-ic{margin-left:auto;flex-shrink:0}
@keyframes oa-sel-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
`

// options: [{ value, label }] 或 string[]
export function Select({ value, onChange, options = [], icon, placeholder = '请选择' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  const current = opts.find(o => o.value === value)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="oa-sel" ref={ref}>
      <style>{CSS}</style>
      <button type="button" className={'oa-sel-btn' + (open ? ' open' : '')} onClick={() => setOpen(o => !o)}>
        {icon && <Icon name={icon} size={15} style={{ opacity: 0.7 }} />}
        <span className="oa-sel-val">{current ? current.label : placeholder}</span>
        <Icon name="arrow_forward" size={14} className="oa-sel-ar" />
      </button>
      {open && (
        <div className="oa-sel-menu">
          {opts.map(o => (
            <div
              key={o.value}
              className={'oa-sel-opt' + (o.value === value ? ' act' : '')}
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              {o.label}
              {o.value === value && <Icon name="check_circle" size={15} color="#3b82f6" className="oa-sel-opt-ic" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
