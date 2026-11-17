import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Server, Smartphone, Monitor, Laptop } from 'lucide-react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import PhoneMockup, { useDemoLoop, LOOP_MS } from './PhoneMockup.jsx'
import heroImg from '../assets/hero.jpg'
import { track, EVENTS } from '../lib/track.js'

// One screen laid out as a bento grid, the way lp-rusnetvpn builds its
// sections: a deep-red tile carries the message and the button, the app runs
// in its own tile, and a status tile follows the demo as it connects.
const BENEFITS = ['Secure connection', 'Encrypted traffic', 'Strict no-logs policy']

const BASE_W = 300
const BASE_H = 614
function useFit() {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      setScale(Math.min(height / BASE_H, width / BASE_W, 1.05))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, scale]
}

const tile = (d = 0) => ({
  initial: { opacity: 0, y: 18, scale: .985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: .8, delay: d, ease: [.21, .78, .26, 1] },
})

function Cta({ onStart, light = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <Button variant={light ? 'light' : 'ink'} className="w-full sm:w-auto" onClick={onStart}>Protect My Privacy</Button>
      <p className={`text-[12.5px] leading-snug ${light ? 'text-white/75' : 'text-center text-muted'}`}>Choose a plan • Pay securely • Get access by email</p>
    </div>
  )
}

function Status({ vpn }) {
  const on = vpn === 'on'
  const connecting = vpn === 'connecting'
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={vpn} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .25 }}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[.05em] ${on ? 'bg-green-tint text-green-text' : connecting ? 'bg-amber-tint text-amber-text' : 'bg-paper text-muted'}`}>
        <span className={`relative h-[7px] w-[7px] rounded-full ${on ? 'bg-green-ok' : connecting ? 'bg-amber' : 'bg-line-ui'}`}>
          {on && <span className="absolute inset-0 animate-ping rounded-full bg-green-ok/60" />}
        </span>
        {on ? 'Protected' : connecting ? 'Connecting…' : 'Not connected'}
      </motion.span>
    </AnimatePresence>
  )
}

export default function Landing({ onStart }) {
  const scene = useDemoLoop()
  const on = scene.vpn === 'on'
  const [fitRef, scale] = useFit()

  useEffect(() => { track(EVENTS.LP_VIEWED) }, [])
  const start = () => { track(EVENTS.CTA_CLICKED, { location: 'hero' }); onStart() }

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1360px] min-h-0 flex-1 flex-col gap-3 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-5 lg:gap-4 lg:px-6 lg:pb-6 short:gap-2! short:px-2! short:pb-2!">
        <header className="flex flex-none items-center justify-between px-1 pt-3 sm:pt-4 lg:pt-5 short:pt-2!">
          <Logo className="h-7 w-auto sm:h-8 short:h-6!" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink-2">
            <Lock className="h-3.5 w-3.5 text-red" aria-hidden="true" /> Secure checkout
          </span>
        </header>

        {/* phones stack: message, app, button. Wide screens: a 12-column bento. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 wide:grid wide:grid-cols-12 wide:grid-rows-2 lg:gap-4 short:grid-cols-[1.15fr_.85fr]! short:grid-rows-1! short:gap-2!">

          {/* A: the message, on the LP's deep-red tile */}
          <motion.section {...tile(0)} aria-labelledby="hero-h"
            className="on-dark relative isolate flex flex-none flex-col overflow-hidden rounded-[24px] p-5 text-white sm:p-7 wide:col-span-5 wide:row-span-2 wide:justify-between wide:rounded-[28px] lg:p-10 short:col-span-1! short:justify-center! short:p-5! max-sm:items-center max-sm:text-center"
            style={{ background: 'radial-gradient(120% 90% at 0% 0%, #8E1420 0%, #5E0A12 55%, #3F060C 100%)' }}>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 -z-10 h-[420px] w-[420px] rounded-full border border-white/10" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-[260px] w-[260px] rounded-full border border-white/10" />

            <ul className="hidden flex-wrap gap-2 wide:flex short:hidden!" aria-label="Highlights">
              {['No logs', 'Encrypted', '30-day refund'].map((t) => (
                <li key={t} className="tag rounded-full px-3 py-1.5 text-[12.5px] font-medium">{t}</li>
              ))}
            </ul>

            <div>
              <h1 id="hero-h" className="text-[clamp(28px,8vw,38px)] text-balance sm:text-[46px] lg:text-[clamp(44px,4.2vw,64px)] short:text-[clamp(22px,3.8vw,30px)]!">
                Your privacy, <em className="not-italic text-red-soft">switched on in a tap.</em>
              </h1>
              <p className="mt-3 max-w-[40ch] text-[14px] max-sm:mx-auto leading-[1.6] text-white/80 sm:text-[15.5px] lg:mt-5 lg:text-[16.5px] low:hidden short:hidden!">
                Stay protected with encrypted VPN connections designed to keep your online activity more private.
              </p>
              <ul className="mt-5 hidden space-y-2 wide:block short:hidden!">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-[14.5px] font-medium text-white/90">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15"><Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /></span>{b}
                  </li>
                ))}
              </ul>
              <Cta onStart={start} light className="mt-7 hidden wide:flex short:mt-3!" />
            </div>
          </motion.section>

          {/* B: the app in use */}
          <motion.div {...tile(.1)}
            className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-white p-3 sm:p-5 wide:col-span-4 wide:row-span-2 wide:rounded-[28px] short:col-span-1! short:p-2!">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,#FCE9EA_0%,#FFF6F6_55%,#FFFFFF_100%)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[45%] -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full [background:repeating-radial-gradient(circle,transparent_0_46px,rgba(225,39,48,.07)_46px_47px)]" />
            <div className="relative min-h-0 flex-1">
              <div ref={fitRef} className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex-none" style={{ width: BASE_W * scale, height: BASE_H * scale }}>
                  <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
                    <PhoneMockup scene={scene} className="h-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex-none" aria-hidden="true">
              <div className="mx-auto h-[3px] w-[min(200px,55%)] overflow-hidden rounded-full bg-ink/10">
                {scene.index !== undefined && (
                  <motion.div key={scene.index} className="h-full rounded-full bg-red"
                    initial={{ width: `${(scene.start / LOOP_MS) * 100}%` }}
                    animate={{ width: `${((scene.start + scene.ms) / LOOP_MS) * 100}%` }}
                    transition={{ duration: scene.ms / 1000, ease: 'linear' }} />
                )}
              </div>
            </div>
          </motion.div>

          {/* C: people using it (wide screens) */}
          <motion.div {...tile(.2)} className="on-dark relative isolate hidden overflow-hidden rounded-[28px] p-6 text-white wide:col-span-3 wide:flex wide:flex-col wide:justify-end short:hidden!">
            <img src={heroImg} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_30%]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(40,4,10,.9)_0%,rgba(40,4,10,.25)_55%,rgba(40,4,10,0)_100%)]" />
            <p className="text-[19px] font-semibold leading-tight tracking-[-.02em]">One account, every device</p>
            <div className="mt-3 flex gap-2" aria-label="iPhone, Android, Windows and Mac">
              {[Smartphone, Monitor, Laptop].map((I, k) => <span key={k} className="tag grid h-9 w-9 place-items-center rounded-full"><I className="h-4 w-4" aria-hidden="true" /></span>)}
            </div>
          </motion.div>

          {/* D: live status, follows the demo (wide screens) */}
          <motion.div {...tile(.3)} className="hidden flex-col justify-between rounded-[28px] bg-white p-6 wide:col-span-3 wide:flex short:hidden!">
            <div className="flex items-center justify-between gap-2">
              <Status vpn={scene.vpn} />
              <span className="tnum text-[12.5px] font-bold text-muted">{on ? '40 ms' : '— ms'}</span>
            </div>
            <div>
              <p className="text-[13px] text-muted">Connected to</p>
              <p className="text-[18px] font-semibold tracking-[-.02em] text-ink">Russia · Novosibirsk</p>
              <div className="mt-3 flex h-6 items-end gap-[3px]" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.i key={i} className="block flex-1 rounded-[2px]"
                    animate={{ height: on ? ['25%', '100%', '35%'] : '20%', backgroundColor: on ? '#E12730' : '#F1E7E8' }}
                    transition={{ duration: 1.6, repeat: on ? Infinity : 0, delay: i * .07, ease: 'easeInOut' }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-ink/[.07] pt-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-tint text-red-text"><Server className="h-[18px] w-[18px]" aria-hidden="true" /></span>
              <span className="leading-tight">
                <b className="block text-[20px] font-bold tracking-[-.03em] text-ink">700+</b>
                <span className="text-[12.5px] text-muted">servers worldwide</span>
              </span>
            </div>
          </motion.div>

          {/* phones: the button sits under the thumb, below the app */}
          <motion.div {...tile(.2)} className="flex-none wide:hidden">
            <ul className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 low:hidden" aria-label="What you get">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-red text-white"><Check className="h-2.5 w-2.5" strokeWidth={3.4} aria-hidden="true" /></span>{b}
                </li>
              ))}
            </ul>
            <Cta onStart={start} className="sm:items-center" />
          </motion.div>
        </div>
      </div>
    </main>
  )
}
