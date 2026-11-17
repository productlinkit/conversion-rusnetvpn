import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Mail } from 'lucide-react'
import Button from './Button.jsx'
import TransactionId from './TransactionId.jsx'
import { ACCOUNT } from '../lib/account.js'
import { money, renewalDate } from '../lib/plans.js'

export default function SuccessStep({ email, account, plan, txId, onAccess }) {
  const h = useRef(null)
  const isNew = account === ACCOUNT.NEW
  useEffect(() => { h.current?.focus() }, [])

  return (
    <section className="pt-3 max-sm:text-center sm:pt-0">
      <motion.div initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative mx-auto mt-2 grid h-16 w-16 sm:mx-0 sm:ml-2 place-items-center rounded-full bg-green-ok text-white shadow-[0_20px_40px_-18px_rgba(18,183,106,.8)]">
        <motion.span className="absolute inset-0 rounded-full border-2 border-green-ok" initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.2, delay: .2 }} />
        <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
      </motion.div>

      <h1 ref={h} tabIndex={-1} className="mt-6 px-1 text-[34px] outline-none sm:text-[44px]">You’re All <span className="text-red">Set.</span></h1>
      <p className="mt-2 max-w-[34rem] px-1 max-sm:mx-auto text-[16px] leading-relaxed text-body">
        {isNew
          ? 'Your RusnetVPN account is ready. Check your email for your password.'
          : 'Your subscription is active. Log in with your existing password.'}
      </p>

      <div className="mt-6 rounded-[24px] bg-white p-5 sm:p-6 text-left text-[14px]">
        <dl className="space-y-2.5">
          <TransactionId id={txId} />
          <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium">RusnetVPN · {plan.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Payment method</dt><dd className="font-medium">Credit card</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Next renewal</dt><dd className="font-medium">{renewalDate(plan)}</dd></div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3"><dt className="font-semibold text-ink">Total paid</dt><dd className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</dd></div>
        </dl>
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-paper p-3 text-[13px] text-ink-2">
          <Mail className="h-4 w-4 flex-none text-red" aria-hidden="true" />
          <span className="min-w-0">{isNew ? 'Password sent to' : 'Account'} <b className="break-all font-semibold">{email}</b></span>
        </p>
      </div>

      <Button className="mt-6 w-full sm:w-auto sm:min-w-[280px]" onClick={onAccess}>Access RusnetVPN</Button>
      <p className="mt-3 px-1 text-[12px] text-muted">Prototype: payment and email are simulated.</p>
    </section>
  )
}
