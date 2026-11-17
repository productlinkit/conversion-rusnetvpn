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
      <aside className="on-dark relative isolate overflow-hidden rounded-[20px] px-3 py-2.5 text-white sm:rounded-[24px] sm:p-4 lg:sticky lg:top-5 lg:flex lg:h-[calc(100dvh-40px)] lg:flex-col lg:rounded-[28px] lg:p-8"
        style={{ background: 'radial-gradient(120% 80% at 0% 0%, #8E1420 0%, #5E0A12 55%, #3F060C 100%)' }}>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-36 -z-10 h-[420px] w-[420px] rounded-full border border-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-[260px] w-[260px] rounded-full border border-white/10" />

        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/12 text-white transition hover:bg-white hover:text-ink lg:h-10 lg:w-10">
              <ArrowLeft className="h-[18px] w-[18px]" />
            </button>
          )}
          <Logo light className="text-[17px] sm:text-[19px] lg:text-[23px]" />
          {/* phones: where you are, in words, instead of the stepper */}
          <span className="ml-auto text-right leading-tight lg:hidden">
            <span className="block text-[11px] font-medium text-white/65">Step {stage + 1} of {STEPS.length}</span>
            <b className="block text-[13px] font-semibold">{STEPS[stage].label}</b>
          </span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 lg:hidden" aria-hidden="true">
          {STEPS.map((s, i) => <span key={s.label} className={`h-1 rounded-full ${i <= stage ? 'bg-white' : 'bg-white/20'}`} />)}
        </div>

        {/* stepper: desktop only */}
        <nav aria-label="Progress" className="mt-12 hidden lg:block">
          <ol className="flex flex-col">
            {STEPS.map((s, i) => {
              const done = i < stage
              const current = i === stage
              return (
                <li key={s.label} aria-current={current ? 'step' : undefined} className="relative flex items-start gap-4 pb-7">
                  {i < STEPS.length - 1 && <span aria-hidden="true" className={`absolute left-[15px] top-9 h-[calc(100%-40px)] w-[2px] rounded-full ${done ? 'bg-white/70' : 'bg-white/15'}`} />}
                  <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[13px] font-bold ${done ? 'bg-white text-deep' : current ? 'bg-red text-white ring-4 ring-red/30' : 'bg-white/15 text-white/70'}`}>
                    {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : i + 1}
                  </span>
                  <span className="min-w-0 pt-1">
                    <b className={`block truncate text-[15.5px] font-semibold ${current ? '' : 'text-white/70'}`}>{s.label}{done && <span className="sr-only"> (done)</span>}</b>
                    <span className="block text-[13px] text-white/60">{s.hint}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* order summary */}
        {plan && (
          <section aria-label="Order summary" className="mt-auto hidden rounded-[22px] bg-white/[.07] p-5 ring-1 ring-white/15 lg:block">
            <span className="min-w-0">
              <span className="block text-[12px] font-medium uppercase tracking-[.06em] text-white/60">Your order</span>
              <span className="block truncate text-[14px] font-semibold lg:mt-1 lg:text-[16px]">RusnetVPN · {plan.label}</span>
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
      <div className="mx-auto w-full max-w-[760px] pb-32 pt-5 sm:pt-8 lg:pb-10 lg:pt-6">
        {children}
      </div>
    </div>
  )
}
