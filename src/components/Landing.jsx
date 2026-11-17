import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, EyeOff, Server, RotateCcw } from 'lucide-react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import ConnWidget from './ConnWidget.jsx'
import heroImg from '../assets/hero.jpg'
import { track, EVENTS } from '../lib/track.js'

// Same claims as the first campaign page (taken from rusnetvpn.vercel.app):
// encrypted connections, no-logs policy, 700+ servers, 30-day money-back.
const TILES = [
  { icon: Server, title: '700+ servers', text: 'Worldwide, fastest picked for you' },
  { icon: Lock, title: 'Encrypted traffic', text: 'Sent through an encrypted tunnel' },
  { icon: EyeOff, title: 'Strict no-logs', text: 'What you do online stays yours' },
  { icon: RotateCcw, title: '30-day refund', text: 'Money back if it’s not for you' },
]

const rise = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .8, delay: d, ease: [.21, .78, .26, 1] },
})

// One screen, no scroll: the LP's photo hero card on top, white bento tiles under it.
export default function Landing({ onStart }) {
  useEffect(() => { track(EVENTS.LP_VIEWED) }, [])
  const start = () => { track(EVENTS.CTA_CLICKED, { location: 'hero' }); onStart() }

  return (
    <main className="flex h-dvh flex-col gap-3 p-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:p-4 lg:gap-4 lg:p-5 short:gap-2! short:p-2!">
      <motion.section
        initial={{ opacity: 0, scale: .985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [.21, .78, .26, 1] }}
        aria-labelledby="hero-h"
        className="on-dark relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-5 text-white sm:p-8 lg:p-12 short:rounded-[20px]! short:p-4!"
      >
        <img src={heroImg} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[63%_30%] sm:object-[55%_30%] wide:object-[70%_40%]" />
        <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />

        <motion.div {...rise(.15)} className="flex flex-none items-center justify-between gap-3">
          <Logo className="h-6 w-auto text-white sm:h-7 short:h-5!" />
          <span className="tag inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium max-sm:hidden">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout
          </span>
        </motion.div>

        <div className="mt-auto flex flex-col gap-5 wide:flex-row wide:items-end wide:justify-between wide:gap-10">
          <div className="max-w-[640px]">
            <motion.ul {...rise(.3)} className="flex flex-wrap gap-2" aria-label="Highlights">
              <li className="tag rounded-full px-3 py-1.5 text-[12.5px] font-medium">No logs</li>
              <li className="tag rounded-full px-3 py-1.5 text-[12.5px] font-medium">Encrypted</li>
              <li className="tag rounded-full px-3 py-1.5 text-[12.5px] font-medium">30-day refund</li>
            </motion.ul>

            <motion.h1 {...rise(.42)} id="hero-h" className="mt-4 text-[clamp(32px,8.4vw,40px)] text-balance sm:text-[52px] lg:text-[clamp(48px,4.6vw,66px)] low:text-[30px] short:mt-2! short:text-[clamp(24px,4.2vw,34px)]!">
              Your privacy. <em className="not-italic text-red-soft">Switched on in a tap.</em>
            </motion.h1>

            <motion.p {...rise(.54)} className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-white/88 sm:mt-4 sm:text-[16.5px] low:hidden short:hidden!">
              Stay protected with encrypted VPN connections designed to keep your online activity more private, on every device.
            </motion.p>

            <motion.div {...rise(.66)} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-7 short:mt-3!">
              <Button variant="light" className="w-full sm:w-auto" onClick={start}>Protect my privacy</Button>
              <p className="text-center text-[12.5px] leading-snug text-white/80 sm:text-left sm:text-[13.5px]">
                Choose a plan • Pay securely • Get access by email
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: .8, ease: [.21, .78, .26, 1] }}
            className="flex-none max-lg:hidden short:block! short:w-[260px]! wide:w-[320px]"
          >
            <ConnWidget />
          </motion.div>
        </div>
      </motion.section>

      {/* white bento tiles; two compact rows on phones, one row from tablets up */}
      <motion.ul {...rise(.9)} aria-label="What you get" className="grid flex-none grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 low:hidden short:hidden!">
        {TILES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4 lg:rounded-[20px] lg:p-5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-red-tint text-red-text lg:h-10 lg:w-10">
              <Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <b className="block text-[13.5px] font-semibold leading-tight text-ink sm:text-[15px]">{title}</b>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted max-sm:hidden">{text}</span>
            </span>
          </li>
        ))}
      </motion.ul>
    </main>
  )
}
