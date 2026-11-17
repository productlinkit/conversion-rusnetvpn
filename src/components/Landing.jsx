import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, EyeOff, Server, Check } from 'lucide-react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import PhoneMockup, { useDemoLoop, LOOP_MS } from './PhoneMockup.jsx'
import heroImg from '../assets/hero.jpg'
import { track, EVENTS } from '../lib/track.js'

// Same claims and same order as the first campaign page: headline, the app
// in use, what you get, one button. Only the look follows lp-rusnetvpn.
const BENEFITS = [
  { icon: ShieldCheck, title: 'Secure Connection', text: 'Protected VPN connection' },
  { icon: Lock, title: 'Encrypted Traffic', text: 'Sent through an encrypted tunnel' },
  { icon: EyeOff, title: 'Privacy‑Focused', text: 'Strict no-logs policy' },
]

// The device is drawn at one fixed size and scaled to the room it gets, so on
// a short phone it shrinks as a whole instead of squashing its insides.
const BASE_W = 300
const BASE_H = 614
function useFit() {
  const ref = useRef(null)
  const [fit, setFit] = useState({ scale: 1, room: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const scale = Math.min(height / BASE_H, width / BASE_W, 1.05)
      setFit({ scale, room: (width / scale - BASE_W) / 2 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, fit]
}

const rise = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .7, delay: d, ease: [.21, .78, .26, 1] },
})

export default function Landing({ onStart }) {
  const scene = useDemoLoop()
  const on = scene.vpn === 'on'
  const [fitRef, { scale, room }] = useFit()
  // floating cards only when there is room beside the device, and only on the
  // home screen (they would sit on the server list and the menu)
  const showChips = room >= 60
  const chipsVisible = scene.screen === 'home'
  const chipL = Math.min(150, room + 30)
  const chipR = Math.min(140, room + 30)

  useEffect(() => { track(EVENTS.LP_VIEWED) }, [])
  const start = () => { track(EVENTS.CTA_CLICKED, { location: 'hero' }); onStart() }

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1320px] min-h-0 flex-1 flex-col px-4 sm:px-6 lg:px-8 short:px-3!">
        <motion.div {...rise(0)} className="flex flex-none items-center justify-center pt-4 sm:pt-5 wide:justify-between lg:pt-6 short:justify-start! short:pt-2!">
          <Logo className="h-6 w-auto text-ink sm:h-7 short:h-5!" />
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-2 lg:inline-flex">
            <Lock className="h-3.5 w-3.5 text-red" aria-hidden="true" /> Secure checkout
          </span>
        </motion.div>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-4 sm:gap-5 sm:pt-5 wide:grid-cols-[1fr_1fr] wide:grid-rows-1 wide:items-stretch wide:gap-6 lg:pb-6 lg:pt-5 short:grid-cols-[1.2fr_.8fr]! short:gap-3! short:py-2!">
          {/* copy: when stacked its children join the grid so the phone sits between them */}
          <div className="contents wide:flex wide:flex-col wide:justify-center wide:pr-6 xl:pr-12">
            <div className="order-1 text-center wide:text-left">
              <motion.ul {...rise(.04)} className="mb-4 hidden flex-wrap gap-2 wide:flex short:hidden!" aria-label="Highlights">
                {['No logs', 'Encrypted', '30-day refund'].map((t) => (
                  <li key={t} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-2">{t}</li>
                ))}
              </motion.ul>
              <motion.h1 {...rise(.08)} className="text-[clamp(30px,8.6vw,40px)] text-balance sm:text-[52px] lg:text-[clamp(50px,5vw,74px)] short:text-[clamp(24px,4.2vw,34px)]!">
                Your Privacy. <span className="text-red">Our Priority.</span>
              </motion.h1>
              <motion.p {...rise(.14)} className="mx-auto mt-3 max-w-[20rem] text-[14.5px] leading-[1.55] text-body sm:mt-4 sm:max-w-[30rem] sm:text-[16.5px] wide:mx-0 lg:mt-5 lg:text-[17.5px] lg:leading-[1.6] short:mt-2! short:text-[13.5px]!">
                <b className="block font-semibold text-ink">Secure Connection. Private Browsing.</b>
                Stay protected with encrypted VPN connections designed to keep your online activity more private.
              </motion.p>
            </div>

            <div className="order-3 lg:mt-8 short:mt-3!">
              {/* compact check list: phones, either way up */}
              <motion.ul {...rise(.2)} className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:hidden short:flex! short:justify-start!" aria-label="What you get">
                {BENEFITS.map(({ title }) => (
                  <li key={title} className="flex items-center gap-1.5">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-red text-white"><Check className="h-2.5 w-2.5" strokeWidth={3.4} aria-hidden="true" /></span>
                    <span className="text-[12.5px] font-semibold text-ink">{title}</span>
                  </li>
                ))}
              </motion.ul>

              {/* white bento tiles: tablets and up */}
              <motion.ul {...rise(.2)} className="mx-auto hidden max-w-[40rem] grid-cols-3 gap-3 sm:grid wide:mx-0 short:hidden!" aria-label="What you get">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-[20px] bg-white p-4 text-left">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-red-tint text-red-text">
                      <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <b className="mt-3 block text-[14px] font-semibold leading-tight text-ink">{title}</b>
                    <span className="mt-1 block text-[12.5px] leading-snug text-muted">{text}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div {...rise(.28)} className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-5 wide:justify-start lg:mt-7 short:mt-3! short:gap-3!">
                <Button className="w-full sm:w-auto" onClick={start}>Protect My Privacy</Button>
                <p className="text-center text-[12.5px] leading-snug text-muted sm:text-left sm:text-[13.5px] short:text-[12px]!">
                  Choose a plan • Pay securely • Get access by email
                </p>
              </motion.div>
            </div>
          </div>

          {/* the app in use, on the LP's photo tile */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .9, delay: .12, ease: [.21, .78, .26, 1] }}
            className="on-dark relative isolate order-2 flex min-h-0 flex-col overflow-hidden rounded-[28px] p-4 sm:p-6 short:rounded-[20px]! short:p-2!"
          >
            <img src={heroImg} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_35%]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_55%,rgba(40,4,10,.35),rgba(40,4,10,.82)_75%)]" />

            <div className="relative min-h-0 flex-1">
              <div ref={fitRef} className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex-none" style={{ width: BASE_W * scale, height: BASE_H * scale }}>
                  <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
                    <PhoneMockup scene={scene} className="h-full" />

                    <motion.div style={{ left: -chipL }} initial={{ opacity: 0 }} animate={{ opacity: chipsVisible ? 1 : 0, y: chipsVisible ? 0 : 8 }} transition={{ duration: .35 }}
                      className={`glass absolute top-[12%] items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-white ${showChips ? 'inline-flex' : 'hidden'}`}>
                      <Server className="h-3.5 w-3.5 text-red-soft" aria-hidden="true" /> 700+ servers worldwide
                    </motion.div>

                    <motion.div style={{ right: -chipR }} initial={{ opacity: 0 }} animate={{ opacity: chipsVisible ? 1 : 0, y: chipsVisible ? 0 : 8 }} transition={{ duration: .35 }}
                      className={`glass absolute top-[36%] w-[210px] rounded-[20px] p-4 text-white ${showChips ? 'block' : 'hidden'}`} aria-hidden="true">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={on ? 'on' : scene.vpn} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.05em] ${on ? 'text-[#7EE2AE]' : scene.vpn === 'connecting' ? 'text-[#FFC27A]' : 'text-white/70'}`}>
                          <span className={`relative h-[7px] w-[7px] rounded-full ${on ? 'bg-green-ok' : scene.vpn === 'connecting' ? 'bg-amber' : 'bg-white/50'}`}>
                            {on && <span className="absolute inset-0 animate-ping rounded-full bg-green-ok/60" />}
                          </span>
                          {on ? 'Protected' : scene.vpn === 'connecting' ? 'Connecting…' : 'Not connected'}
                        </motion.span>
                      </AnimatePresence>
                      <p className="mt-2 text-[13.5px] font-semibold">Russia · Novosibirsk</p>
                      <div className="mt-2.5 flex h-5 items-end gap-[3px]">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <motion.i key={i} className="block flex-1 rounded-[2px]"
                            animate={{ height: on ? ['25%', '100%', '35%'] : '20%', backgroundColor: on ? '#E12730' : 'rgba(255,255,255,.16)' }}
                            transition={{ duration: 1.6, repeat: on ? Infinity : 0, delay: i * .07, ease: 'easeInOut' }} />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* plays like a video: a thin timeline, nothing to click */}
            <div className="mt-3 flex-none short:mt-1.5!" aria-hidden="true">
              <div className="mx-auto h-[3px] w-[min(220px,60%)] overflow-hidden rounded-full bg-white/20">
                {scene.index !== undefined && (
                  <motion.div
                    key={scene.index}
                    className="h-full rounded-full bg-white"
                    initial={{ width: `${(scene.start / LOOP_MS) * 100}%` }}
                    animate={{ width: `${((scene.start + scene.ms) / LOOP_MS) * 100}%` }}
                    transition={{ duration: scene.ms / 1000, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
