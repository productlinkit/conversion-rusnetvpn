import { ArrowLeft, Check, Lock, RotateCcw, RefreshCw, ShieldCheck } from 'lucide-react'
import Logo from './Logo.jsx'
import { money, renewalDate } from '../lib/plans.js'

const STEPS = [
  { label: 'Your email', hint: 'Find or create your account' },
  { label: 'Plan & payment', hint: 'Pick a plan, pay by card' },
  { label: 'Access', hint: 'Install the app and connect' },
]

// Frame for every screen after the landing: a deep-red bento sidebar with the
// steps and the order, the form on the right in white cards. On phones the
// sidebar folds into a compact red header. Still no navbar or footer.
export default function FlowShell({ stage = 0, plan, onBack, children }) {
  return (
    <div className="min-h-dvh p-3 sm:p-4 lg:grid lg:grid-cols-[minmax(320px,380px)_1fr] lg:gap-4 lg:p-5">
      {/* ---------- sidebar (desktop) / header (phones) ---------- */}
      <aside className="on-dark relative isolate overflow-hidden rounded-[24px] p-4 text-white sm:p-5 lg:sticky lg:top-5 lg:flex lg:h-[calc(100dvh-40px)] lg:flex-col lg:rounded-[28px] lg:p-8"
        style={{ background: 'radial-gradient(120% 80% at 0% 0%, #8E1420 0%, #5E0A12 55%, #3F060C 100%)' }}>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-36 -z-10 h-[420px] w-[420px] rounded-full border border-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-[260px] w-[260px] rounded-full border border-white/10" />

        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white/12 text-white transition hover:bg-white hover:text-ink">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <Logo className="h-6 w-auto text-white lg:h-7" />
          <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-white/75 lg:hidden">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Secure
          </span>
        </div>

        {/* stepper: vertical on desktop, a row of pills on phones */}
        <nav aria-label="Progress" className="mt-4 lg:mt-12">
          <ol className="flex gap-1.5 lg:flex-col lg:gap-0">
            {STEPS.map((s, i) => {
              const done = i < stage
              const current = i === stage
              return (
                <li key={s.label} aria-current={current ? 'step' : undefined}
                  className={`relative flex flex-1 items-center gap-2 rounded-full px-2.5 py-1.5 lg:flex-none lg:items-start lg:gap-4 lg:rounded-none lg:px-0 lg:py-0 lg:pb-7 ${current ? 'bg-white text-ink lg:bg-transparent lg:text-white' : 'bg-white/10 lg:bg-transparent'}`}>
                  {i < STEPS.length - 1 && <span aria-hidden="true" className={`absolute left-[15px] top-9 hidden h-[calc(100%-40px)] w-[2px] rounded-full lg:block ${done ? 'bg-white/70' : 'bg-white/15'}`} />}
                  <span className={`grid h-5 w-5 flex-none place-items-center rounded-full text-[11px] font-bold lg:h-8 lg:w-8 lg:text-[13px] ${done ? 'bg-white text-deep' : current ? 'bg-red text-white lg:ring-4 lg:ring-red/30' : 'bg-white/15 text-white/70'}`}>
                    {done ? <Check className="h-3 w-3 lg:h-4 lg:w-4" strokeWidth={3} aria-hidden="true" /> : i + 1}
                  </span>
                  <span className="min-w-0 lg:pt-1">
                    <b className={`block truncate text-[11.5px] font-semibold lg:text-[15.5px] ${current ? '' : 'text-white/75 lg:text-white/70'} ${!current ? 'max-sm:sr-only' : ''}`}>{s.label}{done && <span className="sr-only"> (done)</span>}</b>
                    <span className="hidden text-[13px] text-white/60 lg:block">{s.hint}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* order summary */}
        {plan && (
          <section aria-label="Order summary" className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3 lg:mt-auto lg:block lg:rounded-[22px] lg:border-0 lg:bg-white/[.07] lg:p-5 lg:ring-1 lg:ring-white/15">
            <span className="min-w-0">
              <span className="block text-[12px] font-medium uppercase tracking-[.06em] text-white/60">Your order</span>
              <span className="block truncate text-[14px] font-semibold lg:mt-1 lg:text-[16px]">RusVPN · {plan.label}</span>
            </span>
            <span className="tnum flex-none text-[22px] font-bold leading-none tracking-[-.03em] lg:mt-3 lg:block lg:text-[40px]">
              {money(plan.price)}
              {plan.id !== '1w' && <span className="ml-2 align-middle text-[12px] font-medium tracking-normal text-white/60 max-lg:hidden">{money(plan.perMonth)}/mo</span>}
            </span>
            <ul className="mt-4 hidden space-y-2 text-[12.5px] leading-snug text-white/80 lg:block">
              <li className="flex gap-2"><RefreshCw className="mt-[2px] h-3.5 w-3.5 flex-none text-red-soft" aria-hidden="true" />Renews {plan.every} from {renewalDate(plan)}. Cancel anytime.</li>
              <li className="flex gap-2"><RotateCcw className="mt-[2px] h-3.5 w-3.5 flex-none text-red-soft" aria-hidden="true" />30-day money-back guarantee.</li>
              <li className="flex gap-2"><ShieldCheck className="mt-[2px] h-3.5 w-3.5 flex-none text-red-soft" aria-hidden="true" />Encrypted connection, strict no-logs policy.</li>
            </ul>
          </section>
        )}
        <p className="mt-5 hidden items-center gap-1.5 text-[12px] text-white/60 lg:flex">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout. We never see your card number.
        </p>
      </aside>

      {/* ---------- content ---------- */}
      <div className="mx-auto w-full max-w-[760px] pb-28 pt-6 sm:pt-8 lg:pb-10 lg:pt-6">
        {children}
      </div>
    </div>
  )
}
