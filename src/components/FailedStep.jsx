import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button.jsx'
import TransactionId from './TransactionId.jsx'
import { money } from '../lib/plans.js'

export default function FailedStep({ email, plan, txId, onRetry }) {
  const h = useRef(null)
  useEffect(() => { h.current?.focus() }, [])

  return (
    <section>
      <motion.div initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-red text-white shadow-[0_20px_40px_-18px_rgba(225,29,42,.8)]">
        <X className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
      </motion.div>

      <h1 ref={h} tabIndex={-1} className="mt-6 px-1 text-[34px] outline-none sm:text-[44px]">Payment <span className="text-red">Failed.</span></h1>
      <p className="mt-2 max-w-[34rem] px-1 text-[16px] leading-relaxed text-body">
        Your bank declined the payment. You haven’t been charged.
      </p>

      <div className="mt-6 rounded-[24px] bg-white p-5 sm:p-6 text-left text-[14px]">
        <dl className="space-y-2.5">
          <TransactionId id={txId} />
          <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-medium">RusVPN · {plan.label}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Account</dt><dd className="min-w-0 truncate font-medium">{email}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">Status</dt><dd className="font-medium text-red-text">Failed</dd></div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/[.07] pt-3"><dt className="font-semibold text-ink">Amount</dt><dd className="tnum text-[26px] font-bold leading-none tracking-[-.03em] text-ink">{money(plan.price)}</dd></div>
        </dl>
        <p className="mt-4 rounded-xl bg-paper p-3 text-[13px] leading-relaxed text-ink-2">
          Check the card details, make sure the card allows online payments, or try a different card.
        </p>
      </div>

      <Button className="mt-6 w-full sm:w-auto sm:min-w-[280px]" onClick={onRetry}>Try again</Button>
    </section>
  )
}
