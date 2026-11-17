import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Check, Gift } from 'lucide-react'
import Button from './Button.jsx'
import { PayLogo } from './PayLogos.jsx'
import { PLANS, BEST_DEAL, TRIAL_DAYS, money, trialEndDate } from '../lib/plans.js'
import { validateCard, demoOutcome } from '../lib/card.js'

// Number keypad on phones, and the value shaped as it is typed so nobody has
// to type spaces or the slash.
const digits = (v) => v.replace(/\D/g, '')
const CARD_FIELDS = [
  { key: 'number', label: 'Card number', placeholder: '1234 5678 9012 3456', autoComplete: 'cc-number', span: 'col-span-2',
    format: (v) => digits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ') },
  { key: 'expiry', label: 'Expiry date', placeholder: 'MM/YY', autoComplete: 'cc-exp',
    format: (v) => { const d = digits(v).slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d } },
  { key: 'cvv', label: 'CVV', placeholder: '123', autoComplete: 'cc-csc', format: (v) => digits(v).slice(0, 4) },
]

const reveal = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .4, delay: d } })

function CardHead({ n, title, right }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-red text-[12.5px] font-bold text-white">{n}</span>
      <b className="flex-1 text-[16px] font-semibold text-ink">{title}</b>
      {right}
    </div>
  )
}

// Opens under the email card once the address is known not to have a
// subscription: a grid of plan tiles, then one card with the card fields,
// the total and the button. The order summary lives in the sidebar.
export default function CheckoutStep({ planId, setPlanId, charging, onPay }) {
  const id = useId()
  const plan = PLANS.find((p) => p.id === planId)
  // Card details stay in this component: never lifted, tracked or sent anywhere.
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})

  function submit(e) {
    e.preventDefault()
    if (charging) return
    const errors = validateCard(card)
    setCardErrors(errors)
    const first = Object.keys(errors)[0]
    if (first) return document.getElementById(`${id}-${first}`)?.focus()
    onPay(demoOutcome(card.number))
  }

  function changeCard(field, value) {
    setCard((c) => ({ ...c, [field.key]: field.format(value) }))
    setCardErrors((errs) => ({ ...errs, [field.key]: undefined }))
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 space-y-4">
      {/* plans as bento tiles: the selected one turns deep red */}
      <motion.div {...reveal()} id="plans" className="scroll-mt-3 rounded-[24px] bg-white p-4 sm:p-6">
        <CardHead n="2" title="Choose your plan" />
        <p className="mb-3 flex items-center gap-2.5 rounded-2xl bg-green-tint px-3.5 py-2.5 text-[13px] text-ink-2">
          <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-green-ok text-white"><Gift className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" /></span>
          <span><b className="font-semibold text-green-text">Every plan starts with a {TRIAL_DAYS}-day free trial.</b> $0 today, cancel anytime before {trialEndDate()}.</span>
        </p>
        <fieldset disabled={charging}>
          <legend className="sr-only">Plan</legend>
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-2.5">
            {[...PLANS].reverse().map((p) => {
              const sel = p.id === planId
              const best = p.id === BEST_DEAL
              return (
                <label key={p.id}
                  className={`relative flex cursor-pointer rounded-[18px] transition has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink sm:flex-col sm:rounded-[20px] sm:p-4 ${sel ? 'on-dark bg-deep text-white shadow-[0_18px_30px_-18px_rgba(94,10,18,.9)]' : 'bg-paper text-ink hover:bg-red-tint'}`}>
                  <input type="radio" name={`${id}-plan`} value={p.id} checked={sel} onChange={() => setPlanId(p.id)} className="sr-only" />

                  {/* phones: one compact row per plan */}
                  <span className="flex min-h-[60px] w-full items-center gap-3 px-3.5 py-2.5 sm:hidden">
                    <span className={`grid h-5 w-5 flex-none place-items-center rounded-full ${sel ? 'bg-white text-deep' : 'border-2 border-line-ui/60'}`}>
                      {sel && <Check className="h-3 w-3" strokeWidth={3.4} aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <b className="text-[15px] font-semibold">{p.label}</b>
                        {best && <span className="rounded-full bg-red px-1.5 py-[2px] text-[9.5px] font-bold uppercase tracking-[.05em] text-white">Best deal</span>}
                      </span>
                      <span className={`mt-0.5 block text-[12.5px] ${sel ? 'text-white/75' : 'text-muted'}`}>
                        {p.id === '1w' ? 'Billed weekly' : `${money(p.perMonth)}/mo`}
                        {p.saving > 0 && <span className={`font-semibold ${sel ? 'text-white' : 'text-green-text'}`}> · Save {p.saving}%</span>}
                      </span>
                    </span>
                    <b className="tnum flex-none text-[17px] font-bold tracking-[-.02em]">{money(p.price)}</b>
                  </span>

                  {/* tablets and up: a tile */}
                  <span className="hidden items-center justify-between gap-2 sm:flex">
                    <b className="text-[14.5px] font-semibold">{p.label}</b>
                    <span className={`grid h-5 w-5 flex-none place-items-center rounded-full ${sel ? 'bg-white text-deep' : 'border-2 border-line-ui/60'}`}>
                      {sel && <Check className="h-3 w-3" strokeWidth={3.4} aria-hidden="true" />}
                    </span>
                  </span>
                  <b className="tnum mt-3 hidden text-[24px] font-bold leading-none tracking-[-.03em] sm:block">{money(p.price)}</b>
                  <span className={`mt-1.5 hidden text-[12.5px] sm:block ${sel ? 'text-white/75' : 'text-muted'}`}>
                    {p.id === '1w' ? 'Billed weekly' : `${money(p.perMonth)}/mo`}
                  </span>
                  {(best || p.saving > 0) && (
                    <span className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                      {best && <span className={`rounded-full px-2 py-[3px] text-[10px] font-bold uppercase tracking-[.06em] ${sel ? 'bg-red text-white' : 'bg-red text-white'}`}>Best deal</span>}
                      {p.saving > 0 && <span className={`rounded-full px-2 py-[3px] text-[10px] font-bold uppercase tracking-[.06em] ${sel ? 'bg-white/15 text-white' : 'bg-green-tint text-green-text'}`}>Save {p.saving}%</span>}
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>
      </motion.div>

      {/* card details + total */}
      <motion.div {...reveal(.06)} className="rounded-[24px] bg-white p-4 sm:p-6">
        <CardHead n="3" title="Card details" right={<PayLogo id="card" className="h-[16px] w-auto flex-none" />} />
        <fieldset disabled={charging}>
          <legend className="sr-only">Card details</legend>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
            {CARD_FIELDS.map((f) => {
              const err = cardErrors[f.key]
              return (
                <div key={f.key} className={`min-w-0 ${f.span || ''}`}>
                  <label htmlFor={`${id}-${f.key}`} className="text-[13px] font-medium text-ink-2">{f.label}</label>
                  <input
                    id={`${id}-${f.key}`}
                    name={f.autoComplete}
                    type="text"
                    inputMode="numeric"
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    value={card[f.key]}
                    onChange={(e) => changeCard(f, e.target.value)}
                    aria-invalid={!!err || undefined}
                    aria-describedby={err ? `${id}-${f.key}-err` : undefined}
                    className={`tnum mt-1.5 h-[52px] w-full rounded-2xl border bg-paper px-4 text-[16.5px] text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:bg-white focus:ring-4 focus:ring-ink/10 ${err ? 'border-red-text ring-4 ring-red/10' : 'border-transparent'}`}
                  />
                  {err && <p id={`${id}-${f.key}-err`} role="alert" className="mt-1.5 text-[13px] font-medium text-red-text">{err}</p>}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-[12px] text-muted">Prototype: card details aren’t sent or stored. In production these fields come from the payment provider.</p>
        </fieldset>

        {/* what happens to the card, said plainly before the button */}
        <div className="mt-5 rounded-2xl bg-paper p-4 text-[13px] max-lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-ink">Due today</span>
            <b className="tnum text-[28px] font-bold leading-none tracking-[-.03em] text-ink">$0.00</b>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-muted">
            <span>From {trialEndDate()} · RusnetVPN {plan.label}</span>
            <span className="tnum font-semibold text-ink">{money(plan.price)} {plan.every}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end max-lg:hidden">
          <Button type="submit" className="min-w-[280px]" busy={charging} busyLabel="Starting trial…">Start {TRIAL_DAYS}-day free trial</Button>
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted lg:justify-end lg:text-right">
          <Lock className="mt-[2px] h-3 w-3 flex-none" aria-hidden="true" />
          <span>Your card is charged {money(plan.price)} on {trialEndDate()} unless you cancel before. Then {plan.every}. 30-day money-back guarantee.</span>
        </p>
      </motion.div>

      {/* mobile: what's due today + one big button under the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/[.08] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_30px_-20px_rgba(31,20,22,.35)] backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-[760px] items-center gap-3">
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12px] text-muted">Due today</span>
            <b className="tnum block text-[20px] font-bold tracking-[-.03em] text-ink">$0.00</b>
            <span className="block truncate text-[11px] text-muted">then {money(plan.price)}</span>
          </span>
          <Button type="submit" className="ml-auto flex-1 max-w-[260px]" busy={charging} busyLabel="Starting…">Start free trial</Button>
        </div>
      </div>
    </form>
  )
}
