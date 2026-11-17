import { forwardRef } from 'react'
import { motion } from 'framer-motion'

// A centred ticket for the payment outcome screens: a coloured head with the
// status, a perforated tear line, then the receipt body and the next action.
const TONES = {
  success: { head: 'radial-gradient(120% 120% at 50% 0%, #9A1624 0%, #5E0A12 60%, #3F060C 100%)', badge: 'bg-green-ok text-white', halo: 'border-green-ok' },
  pending: { head: 'radial-gradient(120% 120% at 50% 0%, #9A1624 0%, #5E0A12 60%, #3F060C 100%)', badge: 'bg-white text-red', halo: 'border-white' },
  failed: { head: 'radial-gradient(120% 120% at 50% 0%, #3A2A2D 0%, #1F1416 70%)', badge: 'bg-red text-white', halo: 'border-red' },
}

const Receipt = forwardRef(function Receipt({ tone = 'success', icon: Icon, pulse = false, title, lead, children, action, note }, ref) {
  const t = TONES[tone]
  return (
    <section className="mx-auto w-full max-w-[540px] pt-1 text-center lg:pt-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .6, ease: [.21, .78, .26, 1] }}
        className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-50px_rgba(31,20,22,.5)]"
      >
        {/* head */}
        <div className="on-dark relative isolate overflow-hidden px-6 pb-9 pt-9 text-white sm:px-10 sm:pt-11" style={{ background: t.head }}>
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-120px] -z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full border border-white/10" />
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-200px] -z-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full border border-white/[.07]" />
          {tone === 'success' && [[10, 14], [90, 12], [20, 32], [80, 30], [31, 8], [69, 9]].map(([x, y], i) => (
            <motion.span key={i} aria-hidden="true" className="absolute -z-10 h-1.5 w-1.5 rounded-full bg-red-soft"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, .5], scale: [0, 1.4, 1] }} transition={{ duration: 1, delay: .3 + i * .08 }} />
          ))}

          <motion.div initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: .15 }}
            className={`relative mx-auto grid h-[72px] w-[72px] place-items-center rounded-full ring-[6px] ring-white/10 ${t.badge}`}>
            <motion.span className={`absolute inset-0 rounded-full border-2 ${t.halo}`} initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.7, opacity: 0 }}
              transition={pulse ? { duration: 1.6, repeat: Infinity, ease: 'easeOut' } : { duration: 1.2, delay: .35 }} />
            <Icon className="h-9 w-9" strokeWidth={3} aria-hidden="true" />
          </motion.div>

          <h1 ref={ref} tabIndex={-1} className="mt-6 text-[30px] outline-none sm:text-[38px]">{title}</h1>
          <p className="mx-auto mt-2 max-w-[30rem] text-[15px] leading-relaxed text-white/80">{lead}</p>
        </div>

        {/* tear line */}
        <div className="relative h-6" aria-hidden="true">
          <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
          <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
          <span className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-ink/10" />
        </div>

        {/* body */}
        <div className="px-5 pb-6 text-left text-[14px] sm:px-8 sm:pb-8">
          {children}
          {action && <div className="mt-6">{action}</div>}
        </div>
      </motion.div>
      {note && <p className="mt-4 text-[12px] text-muted">{note}</p>}
    </section>
  )
})

export default Receipt

// One label/value row of the receipt.
export function Row({ label, children, strong = false }) {
  return strong ? (
    <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3.5">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="tnum text-[28px] font-bold leading-none tracking-[-.03em] text-ink">{children}</dd>
    </div>
  ) : (
    <div className="flex justify-between gap-3"><dt className="text-muted">{label}</dt><dd className="min-w-0 truncate text-right font-medium">{children}</dd></div>
  )
}
