import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Crown, User, Power, Home, Server, LayoutGrid, Search, RefreshCw, Zap, Check, Heart, ChevronDown, ChevronUp,
  Lock, Download, ShieldCheck, Smartphone, Wifi, SlidersHorizontal, Bell, ChevronRight, MapPin,
} from 'lucide-react'

// A coded copy of the real app at rusnetvpn-app.vercel.app (Home, Select Server,
// Menu), looped like a video: pick a server, connect, look at the menu.
// The screens are laid out at the app's own 390px width and scaled into the
// device, so sizes below match the live app one to one.
const SCENES = [
  { screen: 'home', vpn: 'off', ms: 1300 },
  { screen: 'home', vpn: 'off', tap: 'tab-servers', ms: 380 },
  { screen: 'servers', vpn: 'off', ms: 900 },
  { screen: 'servers', vpn: 'off', tap: 'country', ms: 380 },
  { screen: 'servers', vpn: 'off', open: true, ms: 900 },
  { screen: 'servers', vpn: 'off', open: true, tap: 'city', ms: 500 },
  { screen: 'home', vpn: 'off', ms: 700 },
  { screen: 'home', vpn: 'off', tap: 'connect', ms: 420 },
  { screen: 'home', vpn: 'connecting', ms: 1500 },
  { screen: 'home', vpn: 'on', ms: 2600 },
  { screen: 'home', vpn: 'on', tap: 'tab-menu', ms: 380 },
  { screen: 'menu', vpn: 'on', ms: 2200 },
  { screen: 'menu', vpn: 'on', tap: 'tab-home', ms: 380 },
  { screen: 'home', vpn: 'on', ms: 1200 },
  { screen: 'home', vpn: 'on', tap: 'connect', ms: 420 },
]
const STILL = { screen: 'home', vpn: 'on' }

export const LOOP_MS = SCENES.reduce((t, sc) => t + sc.ms, 0)
const STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((t, sc) => t + sc.ms, 0))

export function useDemoLoop() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % SCENES.length), SCENES[i].ms)
    return () => clearTimeout(t)
  }, [i, reduce])
  return reduce ? STILL : { ...SCENES[i], index: i, start: STARTS[i] }
}

const RED = 'linear-gradient(100deg,#C8102E 0%,#E3262F 55%,#F5544F 100%)'
const RED_CARD = 'radial-gradient(120% 140% at 0% 0%,#FF8A8A 0%,#E9283A 45%,#DF1F33 70%,#F4574F 100%)'

/* ---------- flags ---------- */
const FLAGS = {
  ru: <><rect width="30" height="20" fill="#fff" /><rect y="6.67" width="30" height="6.67" fill="#0039A6" /><rect y="13.33" width="30" height="6.67" fill="#D52B1E" /></>,
  kz: <><rect width="30" height="20" fill="#00AFCA" /><circle cx="15" cy="10" r="3.6" fill="#FEC50C" /><rect x="2" width="1.6" height="20" fill="#FEC50C" /></>,
  tr: <><rect width="30" height="20" fill="#E30A17" /><circle cx="11.5" cy="10" r="5" fill="#fff" /><circle cx="12.8" cy="10" r="4" fill="#E30A17" /><circle cx="18" cy="10" r="1.6" fill="#fff" /></>,
  ar: <><rect width="30" height="20" fill="#74ACDF" /><rect y="6.67" width="30" height="6.67" fill="#fff" /><circle cx="15" cy="10" r="1.8" fill="#F6B40E" /></>,
  am: <><rect width="30" height="20" fill="#D90012" /><rect y="6.67" width="30" height="6.67" fill="#0033A0" /><rect y="13.33" width="30" height="6.67" fill="#F2A800" /></>,
}
function Flag({ code, className = '' }) {
  return <svg viewBox="0 0 30 20" preserveAspectRatio="none" className={`flex-none rounded-[6px] ring-1 ring-black/10 ${className}`} aria-hidden="true">{FLAGS[code]}</svg>
}

/* ---------- tap indicator ---------- */
function Tap({ show, className = '' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className={`pointer-events-none absolute z-30 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1F1416]/25 ring-[3px] ring-white/85 ${className}`}
          initial={{ scale: .3, opacity: 0 }}
          animate={{ scale: [0.3, 1, 0.85], opacity: [0, 1, .9] }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: .3 }}
        />
      )}
    </AnimatePresence>
  )
}

const screenAnim = {
  initial: { opacity: 0, x: 18 },
  animate: { opacity: 1, x: 0, transition: { duration: .28, ease: [.21, .78, .26, 1] } },
  exit: { opacity: 0, x: -18, transition: { duration: .15 } },
}

/* ---------- Home ---------- */
function Globe({ vpn }) {
  const on = vpn === 'on'
  return (
    <svg viewBox="0 0 390 330" className="block h-[282px] w-[333px]" aria-hidden="true">
      <defs>
        <radialGradient id="pm-sphere" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFF6F6" />
          <stop offset=".55" stopColor="#FAD2D3" />
          <stop offset="1" stopColor="#F0A9AC" />
        </radialGradient>
        <clipPath id="pm-clip"><circle cx="195" cy="162" r="131" /></clipPath>
      </defs>
      <circle cx="195" cy="162" r="162" fill="none" stroke="#F6D9DB" strokeWidth="1" />
      <circle cx="195" cy="162" r="148" fill="#FFF7F7" stroke="#F3D3D5" strokeWidth="1" />
      <circle cx="195" cy="162" r="131" fill="url(#pm-sphere)" stroke="#E4A2A6" strokeWidth="1.2" />
      <g clipPath="url(#pm-clip)" fill="none" stroke="#D9858C" strokeOpacity=".55" strokeWidth="1">
        {[46, 92].map((rx) => <ellipse key={rx} cx="195" cy="162" rx={rx} ry="131" />)}
        <line x1="195" y1="31" x2="195" y2="293" />
        {[[-92, 96, 18], [-44, 126, 26], [0, 131, 30], [44, 126, 26], [92, 96, 18]].map(([dy, rx, ry]) => (
          <ellipse key={dy} cx="195" cy={162 + dy} rx={rx} ry={ry} />
        ))}
      </g>
      {/* route */}
      <motion.path
        d="M135 227 C 140 145, 188 112, 240 137"
        fill="none"
        stroke={on ? '#D7192D' : '#E9848C'}
        strokeWidth={on ? 3 : 3}
        strokeLinecap="round"
        strokeDasharray={on ? '0 0' : '5 6'}
        animate={vpn === 'connecting' ? { strokeDashoffset: [0, -22] } : { strokeDashoffset: 0 }}
        transition={vpn === 'connecting' ? { duration: .6, repeat: Infinity, ease: 'linear' } : { duration: .2 }}
      />
      <circle cx="240" cy="137" r="17" fill={on ? '#F2A2A8' : '#F0B8BC'} opacity=".55" />
      {on && <motion.circle cx="240" cy="137" r="12" fill="none" stroke="#E3262F" strokeWidth="2" initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity }} style={{ transformOrigin: '240px 137px' }} />}
      <circle cx="240" cy="137" r="8.5" fill={on ? '#E3262F' : '#E7A1A7'} />
      <circle cx="135" cy="227" r="7.5" fill="#fff" stroke="#E3262F" strokeWidth="3" />
      <text x="208" y="111" fontSize="16.5" fontWeight="500" fill="#1F1416" stroke="#fff" strokeWidth="3" paintOrder="stroke">Novosibirsk</text>
      <text x="106" y="258" fontSize="16.5" fontWeight="500" fill="#1F1416" stroke="#fff" strokeWidth="3" paintOrder="stroke">You</text>
    </svg>
  )
}

function useTimer(running) {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!running) { setS(0); return }
    const t = setInterval(() => setS((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [running])
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
}

function useSpeeds(on) {
  const [v, setV] = useState([84.2, 21.6])
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setV([80 + Math.random() * 9, 19 + Math.random() * 5]), 1100)
    return () => clearInterval(t)
  }, [on])
  return v
}

function HomeScreen({ vpn, tap }) {
  const on = vpn === 'on'
  const connecting = vpn === 'connecting'
  const time = useTimer(on)
  const [down, up] = useSpeeds(on)
  return (
    <motion.div {...screenAnim} className="absolute inset-0 bg-[linear-gradient(160deg,#FFFFFF_0%,#FFFFFF_55%,#FDECEC_100%)]">
      {/* header */}
      <div className="absolute inset-x-0 top-[22px] flex items-center justify-between px-[22px]">
        <span className="text-[25px] font-extrabold tracking-[-.04em] text-[#1F1416]">Rusnet<span className="text-[#E3262F]">VPN</span></span>
        <span className="flex items-center gap-2.5">
          <span className="flex h-[34px] items-center gap-1.5 rounded-full px-4 text-[14px] font-bold text-white shadow-[0_10px_20px_-10px_rgba(200,16,46,.8)]" style={{ background: RED }}>
            <Crown className="h-4 w-4" strokeWidth={2.2} /> Upgrade
          </span>
          <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-white shadow-[0_6px_18px_-8px_rgba(31,20,22,.35)]"><User className="h-5 w-5 text-[#1F1416]" strokeWidth={2} /></span>
        </span>
      </div>

      {/* status pill */}
      <div className="absolute inset-x-0 top-[76px] flex justify-center">
        <span className="flex h-[34px] items-center gap-2.5 rounded-full bg-white px-5 text-[14px] font-medium text-[#1F1416] shadow-[0_6px_20px_-10px_rgba(31,20,22,.3)]">
          <span className={`h-2 w-2 rounded-full ${on ? 'bg-[#E3262F] ring-4 ring-[#E3262F]/15' : connecting ? 'bg-[#F9D49B]' : 'bg-[#B9AFB1]'}`} />
          {on ? 'Connected' : connecting ? 'Connecting…' : 'Not connected'}
        </span>
      </div>

      <div className="absolute left-[28px] top-[116px]"><Globe vpn={vpn} /></div>

      {/* server card */}
      <div className="absolute inset-x-[20px] top-[404px] rounded-[32px] border border-[#F4E4E5] bg-white px-[18px] pb-[18px] pt-[22px] shadow-[0_20px_40px_-30px_rgba(31,20,22,.35)]">
        <div className="flex items-center gap-3">
          <Flag code="ru" className="h-[28px] w-[37px]" />
          <span className="min-w-0 flex-1 leading-tight">
            <b className="block text-[17px] font-bold text-[#1F1416]">Russia</b>
            <span className="text-[13px] text-[#6E6064]">Novosibirsk · 40 ms</span>
          </span>
          <span className="rounded-full bg-[#FCE6E8] px-4 py-[7px] text-[14px] font-bold text-[#C8102E]">Change</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="tnum text-[38px] font-extrabold tracking-[-.02em] text-[#1F1416]">{time}</span>
          <span className="text-[13px] text-[#6E6064]">{on ? 'Connected time' : connecting ? 'Securing…' : 'Ready to connect'}</span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {[['Download', on ? down.toFixed(1) : '—', 'Mb/s'], ['Upload', on ? up.toFixed(1) : '—', 'Mb/s'], ['Data left', '∞', 'Unlimited']].map(([l, v, u]) => (
            <div key={l} className="rounded-[18px] border border-[#F1E4E5] bg-[#FFFCFC] px-3 py-2.5">
              <span className="block text-[12.5px] text-[#6E6064]">{l}</span>
              <span className="tnum mt-1 block whitespace-nowrap text-[19px] font-bold leading-none text-[#1F1416]">{v} <span className="text-[12px] font-medium text-[#6E6064]">{u}</span></span>
            </div>
          ))}
        </div>
        <div className="relative mt-4 h-[58px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={vpn}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .25 }}
              className="absolute inset-0 flex items-center justify-center gap-3 rounded-full text-[17px] font-bold text-white shadow-[0_16px_30px_-16px_rgba(200,16,46,.9)]"
              style={{ background: connecting ? 'linear-gradient(100deg,#3A2A2D,#1F1416)' : RED }}>
              <Power className="h-5 w-5" strokeWidth={2.4} />
              {on ? 'Disconnect' : connecting ? 'Cancel' : 'Connect'}
            </motion.span>
          </AnimatePresence>
          <Tap show={tap === 'connect'} className="left-1/2 top-1/2" />
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Select Server ---------- */
const COUNTRIES = [
  { code: 'ru', name: 'Russia', sub: '4 locations', ms: 40 },
  { code: 'kz', name: 'Kazakhstan', sub: '2 locations', ms: 58 },
  { code: 'tr', name: 'Turkey', sub: '2 locations', ms: 41 },
  { code: 'ar', name: 'Argentina', sub: '1 location', pro: true },
  { code: 'am', name: 'Armenia', sub: '1 location', pro: true },
]
const CITIES = [['Moscow', 67], ['Saint Petersburg', 97], ['Novosibirsk', 40], ['Yekaterinburg', 117]]

function Signal() {
  return <span className="flex h-[14px] items-end gap-[2px]">{[6, 10, 14].map((h) => <i key={h} className="block w-[3px] rounded-[1px] bg-[#16A34A]" style={{ height: h }} />)}</span>
}

function ServersScreen({ open, tap }) {
  return (
    <motion.div {...screenAnim} className="absolute inset-0 bg-white px-[20px]">
      <div className="mt-[28px] flex items-center justify-between">
        <span className="text-[23px] font-bold tracking-[-.03em] text-[#1F1416]">Select Server</span>
        <span className="grid h-[40px] w-[40px] place-items-center rounded-full border border-[#EFE6E7] bg-white"><RefreshCw className="h-[18px] w-[18px] text-[#1F1416]" /></span>
      </div>
      <div className="mt-4 flex h-[46px] items-center gap-3 rounded-full border border-[#EEE4E5] px-4 text-[14.5px] text-[#8A7B7F]">
        <Search className="h-[18px] w-[18px] text-[#6E6064]" /> Search countries, cities, or IP…
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-[26px] px-4 py-[18px] text-white shadow-[0_18px_30px_-18px_rgba(223,31,51,.9)]" style={{ background: RED_CARD }}>
        <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-white/20"><Zap className="h-5 w-5" strokeWidth={2} /></span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[11.5px] font-bold tracking-[.06em] text-white/80">SMART LOCATION</span>
          <b className="mt-0.5 block text-[17px] font-bold">Fastest server</b>
          <span className="text-[13px] text-white/90">Novosibirsk, Russia · 40 ms</span>
        </span>
        <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#1F1416]"><Check className="h-[18px] w-[18px]" strokeWidth={2.6} /></span>
      </div>
      <div className="mt-4 grid grid-cols-2 rounded-[22px] bg-[#F9EEF0] p-[5px] text-[14.5px] font-semibold">
        <span className="rounded-[18px] py-[12px] text-center text-white" style={{ background: RED }}>All Servers</span>
        <span className="py-[12px] text-center text-[#6E6064]">Favorites</span>
      </div>
      <div className="mt-5 flex items-center justify-between px-1">
        <b className="text-[15px] font-bold text-[#1F1416]">All locations</b>
        <span className="text-[12.5px] text-[#6E6064]">14 countries</span>
      </div>
      <ul className="mt-2.5 space-y-2.5">
        {COUNTRIES.map((c, i) => {
          const isOpen = i === 0 && open
          return (
            <li key={c.code} className="relative rounded-[24px] border border-[#F2E6E7] bg-white px-[14px]">
              <div className="flex h-[68px] items-center gap-3">
                <Flag code={c.code} className="h-[30px] w-[42px]" />
                <span className="min-w-0 flex-1 leading-tight">
                  <b className="block text-[15.5px] font-bold text-[#1F1416]">{c.name}</b>
                  <span className="text-[12.5px] text-[#6E6064]">{c.sub}</span>
                </span>
                {c.pro ? (
                  <>
                    <span className="rounded-full bg-[#FCE6E8] px-3 py-1 text-[12px] font-bold text-[#C8102E]">PRO</span>
                    <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#FCE6E8]"><Lock className="h-4 w-4 text-[#C8102E]" /></span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#1F1416]"><Signal />{c.ms} ms</span>
                    <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#F7F0F1]"><Heart className="h-4 w-4 text-[#B9AFB1]" /></span>
                    <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#F7F0F1]">{isOpen ? <ChevronUp className="h-4 w-4 text-[#1F1416]" /> : <ChevronDown className="h-4 w-4 text-[#B9AFB1]" />}</span>
                  </>
                )}
                {i === 0 && <Tap show={tap === 'country'} className="left-[45%] top-[34px]" />}
              </div>
              {i === 0 && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} className="overflow-hidden">
                      {CITIES.map(([name, ms]) => {
                        const picked = name === 'Novosibirsk'
                        const hit = picked && tap === 'city'
                        return (
                          <li key={name} className={`relative mb-1.5 flex h-[44px] items-center gap-2.5 rounded-[14px] px-3 text-[13.5px] transition-colors ${hit || picked ? 'bg-[#FCE6E8]' : 'bg-[#FBF6F6]'}`}>
                            <MapPin className={`h-4 w-4 ${picked ? 'text-[#C8102E]' : 'text-[#6E6064]'}`} />
                            <span className="flex-1 font-medium text-[#1F1416]">{name}</span>
                            <span className="text-[12px] text-[#6E6064]">{ms} ms</span>
                            <span className={`grid h-[18px] w-[18px] place-items-center rounded-full border-2 ${picked ? 'border-[#E3262F] bg-[#E3262F]' : 'border-[#D9CFD1]'}`}>{picked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}</span>
                            {picked && <Tap show={tap === 'city'} className="left-[40%] top-1/2" />}
                          </li>
                        )
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              )}
            </li>
          )
        })}
      </ul>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </motion.div>
  )
}

/* ---------- Menu ---------- */
const EXPIRES = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
})()

function Toggle({ on }) {
  return (
    <span className="relative h-[30px] w-[50px] flex-none rounded-full" style={{ background: on ? RED : '#EFE6E7' }}>
      <span className={`absolute top-[3px] h-[24px] w-[24px] rounded-full bg-white shadow ${on ? 'left-[23px]' : 'left-[3px]'}`} />
    </span>
  )
}

function Row({ icon: Icon, title, sub, right }) {
  return (
    <li className="flex h-[64px] items-center gap-3 border-b border-[#F5ECED] px-[14px] last:border-0">
      <span className="grid h-[40px] w-[40px] flex-none place-items-center rounded-[14px] bg-[#FDECEC]"><Icon className="h-[18px] w-[18px] text-[#D7192D]" strokeWidth={2} /></span>
      <span className="min-w-0 flex-1 leading-tight">
        <b className="block text-[15px] font-semibold text-[#1F1416]">{title}</b>
        <span className="text-[12.5px] text-[#6E6064]">{sub}</span>
      </span>
      {right}
    </li>
  )
}

function MenuScreen() {
  return (
    <motion.div {...screenAnim} className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#FDF1F1_100%)] px-[20px]">
      <p className="mt-[24px] text-[30px] font-bold tracking-[-.035em] text-[#1F1416]">Menu</p>
      <div className="relative mt-3 overflow-hidden rounded-[28px] px-[18px] pb-[18px] pt-[18px] text-white shadow-[0_20px_34px_-20px_rgba(223,31,51,.9)]" style={{ background: RED_CARD }}>
        <span className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full border border-white/20" />
        <div className="flex items-center gap-3.5">
          <span className="grid h-[54px] w-[54px] flex-none place-items-center rounded-full bg-white"><Crown className="h-6 w-6 text-[#D7192D]" strokeWidth={2} /></span>
          <span className="min-w-0 leading-tight">
            <b className="block text-[17px] font-bold">RusnetVPN Premium</b>
            <span className="text-[13px] text-white/90">demo@email.com</span>
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/25 pt-3.5">
          <span className="leading-tight">
            <span className="block text-[12.5px] text-white/85">1-Year plan · renews</span>
            <b className="text-[15px] font-bold">{EXPIRES}</b>
          </span>
          <span className="rounded-full bg-white px-4 py-[9px] text-[14px] font-bold text-[#C8102E]">Manage</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {[[Download, 'Unlimited', 'Data'], [ShieldCheck, '12 m', 'Time protected'], [Smartphone, '1 / 5', 'Devices']].map(([Icon, v, l]) => (
          <div key={l} className="rounded-[22px] bg-white px-3.5 py-3 shadow-[0_10px_24px_-16px_rgba(31,20,22,.35)]">
            <Icon className="h-[18px] w-[18px] text-[#D7192D]" strokeWidth={2} />
            <b className="mt-2 block text-[16px] font-bold text-[#1F1416]">{v}</b>
            <span className="text-[11.5px] text-[#6E6064]">{l}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 px-1 text-[13px] font-semibold text-[#6E6064]">Quick settings</p>
      <ul className="mt-2 rounded-[22px] bg-white shadow-[0_10px_24px_-18px_rgba(31,20,22,.35)]">
        <Row icon={Power} title="Kill switch" sub="Block internet if VPN drops" right={<Toggle on />} />
        <Row icon={Wifi} title="Auto-connect" sub="On public Wi-Fi networks" right={<Toggle />} />
      </ul>
      <p className="mt-4 px-1 text-[13px] font-semibold text-[#6E6064]">VPN settings</p>
      <ul className="mt-2 rounded-[22px] bg-white shadow-[0_10px_24px_-18px_rgba(31,20,22,.35)]">
        <Row icon={ShieldCheck} title="Protocol" sub="WireGuard" right={<ChevronRight className="h-4 w-4 text-[#B9AFB1]" />} />
        <Row icon={SlidersHorizontal} title="Connection settings" sub="DNS, split tunneling" right={<ChevronRight className="h-4 w-4 text-[#B9AFB1]" />} />
        <Row icon={Bell} title="Notifications" sub="3 alerts on" right={<ChevronRight className="h-4 w-4 text-[#B9AFB1]" />} />
      </ul>
    </motion.div>
  )
}

/* ---------- tab bar (the app's dark bar with a lifted red button) ---------- */
const TABS = [['home', Home, 'Home'], ['servers', Server, 'Server List'], ['menu', LayoutGrid, 'Menu']]

function TabBar({ screen, tap }) {
  return (
    <div className="absolute inset-x-[16px] bottom-[14px] z-20 grid h-[70px] grid-cols-3 rounded-[26px] bg-[#1F1A1C]">
      {TABS.map(([key, Icon, label]) => {
        const active = screen === key
        return (
          <span key={key} className="relative flex flex-col items-center justify-end pb-[9px]">
            {active ? (
              <motion.span layoutId="pm-tab" transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute -top-[22px] grid h-[74px] w-[74px] place-items-center rounded-full bg-white/90">
                <span className="grid h-[56px] w-[56px] place-items-center rounded-full shadow-[0_10px_20px_-8px_rgba(200,16,46,.9)]" style={{ background: 'linear-gradient(160deg,#E9283A,#C8102E)' }}>
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </span>
              </motion.span>
            ) : (
              <Icon className="mb-1 h-[22px] w-[22px] text-[#A99FA2]" strokeWidth={1.8} />
            )}
            <span className={`text-[11.5px] ${active ? 'font-bold text-white' : 'font-medium text-[#A99FA2]'}`}>{label}</span>
            <Tap show={tap === `tab-${key}`} className="left-1/2 top-1/2" />
          </span>
        )
      })}
    </div>
  )
}

// inner screen of the device: 286 x 600 px; the app is laid out at 390 wide
const APP_W = 390
const SCALE = 286 / APP_W
const APP_H = 600 / SCALE

export default function PhoneMockup({ scene, className = '' }) {
  const { screen, vpn, tap, open } = scene
  const on = vpn === 'on'
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-full rounded-[2.6rem] bg-[#1F1416] p-[7px] shadow-[0_60px_120px_-50px_rgba(31,20,22,.65),0_30px_60px_-34px_rgba(31,20,22,.5)] ring-1 ring-black/40">
        <div className="relative h-full overflow-hidden rounded-[2.15rem] bg-white">
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: APP_W, height: APP_H, transform: `scale(${SCALE})` }}>
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 z-30 flex h-[44px] items-center justify-between px-[30px] text-[14px] font-semibold text-[#1F1416]">
              <span className="tnum">9:41</span>
              <span className="absolute left-1/2 top-[10px] h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-[#1F1416]" />
              <span className="flex items-center gap-1.5">
                <AnimatePresence>{on && <motion.span initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-[5px] bg-[#1F1416] px-1.5 text-[10px] leading-[16px] text-white">VPN</motion.span>}</AnimatePresence>
                <span className="h-[12px] w-[24px] rounded-[4px] border border-[#1F1416]/70 p-[1.5px]"><span className="block h-full w-3/4 rounded-[2px] bg-[#1F1416]" /></span>
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[30px]">
              <AnimatePresence initial={false}>
                {screen === 'home' && <HomeScreen key="home" vpn={vpn} tap={tap} />}
                {screen === 'servers' && <ServersScreen key="servers" open={open} tap={tap} />}
                {screen === 'menu' && <MenuScreen key="menu" />}
              </AnimatePresence>
            </div>
            <TabBar screen={screen} tap={tap} />
          </div>
        </div>
      </div>
      <p className="sr-only">Illustration of the RusnetVPN app: choosing Novosibirsk, Russia in the server list, connecting, then opening the menu. This is an animated demo, not a live connection.</p>
    </div>
  )
}
