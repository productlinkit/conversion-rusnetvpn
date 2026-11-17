import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// The LP's glass connection card, looping through a connect. Decorative: the
// state is described once in the aria-label, not announced on every change.
const LOOP = [
  { state: 'off', ms: 1600 },
  { state: 'connecting', ms: 1700 },
  { state: 'on', ms: 4200 },
]

function Flag({ code }) {
  // Australia, drawn simply enough to read at 24px; "you" is a neutral dot.
  if (code === 'au') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 flex-none rounded-full ring-1 ring-white/30" aria-hidden="true">
        <clipPath id="au-c"><circle cx="12" cy="12" r="12" /></clipPath>
        <g clipPath="url(#au-c)">
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 4l12 8M12 4L0 12" stroke="#fff" strokeWidth="2" />
          <path d="M6 4v8M0 8h12" stroke="#fff" strokeWidth="2.6" />
          <path d="M6 4v8M0 8h12" stroke="#C8102E" strokeWidth="1.4" />
          <g fill="#fff"><circle cx="6" cy="17.5" r="1.6" /><circle cx="17" cy="7" r=".9" /><circle cx="20" cy="12" r=".9" /><circle cx="15" cy="13" r=".9" /><circle cx="17.5" cy="18" r="1" /></g>
        </g>
      </svg>
    )
  }
  return <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white/15 ring-1 ring-white/30" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-white" /></span>
}

export default function ConnWidget({ className = '' }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % LOOP.length), LOOP[i].ms)
    return () => clearTimeout(t)
  }, [i, reduce])

  const state = reduce ? 'on' : LOOP[i].state
  const on = state === 'on'
  const label = on ? 'Protected' : state === 'connecting' ? 'Connecting…' : 'Not connected'
  const tone = on ? 'text-[#7EE2AE]' : state === 'connecting' ? 'text-[#FFC27A]' : 'text-white/70'
  const dot = on ? 'bg-green-ok' : state === 'connecting' ? 'bg-amber' : 'bg-white/50'

  return (
    <div role="img" aria-label="RusVPN app connecting to a server in Melbourne, Australia." className={`glass rounded-[20px] p-4 text-white sm:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.05em] ${tone}`}>
          <span className={`relative h-[7px] w-[7px] rounded-full ${dot}`}>
            {on && <span className="absolute inset-0 animate-ping rounded-full bg-green-ok/60" />}
          </span>
          {label}
        </span>
        <span className="tnum text-[12px] font-bold text-white/80">{on ? '38 ms' : '— ms'}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[14px] font-semibold">
        <Flag code="you" />
        <span>You</span>
        <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.5)_0_4px,transparent_4px_8px)]" />
        <span>Melbourne</span>
        <Flag code="au" />
      </div>
      <div className="bars mt-3 flex h-[22px] items-end gap-1">
        {Array.from({ length: 14 }).map((_, k) => (
          <i key={k} className={`block h-full flex-1 rounded-[2px] transition-colors duration-500 ${on ? 'bg-red' : 'bg-white/15'}`} style={{ animationDelay: `${k * .09}s`, animationPlayState: on ? 'running' : 'paused' }} />
        ))}
      </div>
    </div>
  )
}
