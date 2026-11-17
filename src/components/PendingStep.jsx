import { useEffect, useRef, useState } from 'react'
import { Check, Clock, Loader2, Mail } from 'lucide-react'
import Receipt, { Row } from './Receipt.jsx'
import TransactionId from './TransactionId.jsx'
import { money } from '../lib/plans.js'

// The provider took the card but the bank hasn't answered yet (3-D Secure,
// manual review). Access waits for the confirmation webhook.
const CONFIRM_AFTER = 8

export default function PendingStep({ email, plan, txId, onConfirmed }) {
  const h = useRef(null)
  const [left, setLeft] = useState(CONFIRM_AFTER)

  useEffect(() => { h.current?.focus() }, [])

  // stands in for polling the payment status
  useEffect(() => {
    if (left <= 0) return onConfirmed()
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Receipt
      ref={h}
      tone="pending"
      icon={Clock}
      pulse
      title={<>Payment <em className="not-italic text-red-soft">pending.</em></>}
      lead="We’re waiting for your bank to confirm the payment. This usually takes a few minutes."
      note={`Prototype: confirms automatically in ${left}s.`}
    >
      <ol className="space-y-3 rounded-2xl bg-paper p-4" aria-live="polite">
        <li className="flex items-center gap-3">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-green-ok text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
          <span className="text-ink">Payment submitted</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-red-tint text-red"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /></span>
          <span className="text-ink">Waiting for bank confirmation</span>
        </li>
      </ol>
      <dl className="mt-5 space-y-2.5">
        <TransactionId id={txId} />
        <Row label="Plan">RusnetVPN · {plan.label}</Row>
        <Row label="Status"><span className="inline-flex items-center gap-1.5 text-red"><span className="h-2 w-2 animate-pulse rounded-full bg-red" aria-hidden="true" />Pending</span></Row>
        <Row label="Amount" strong>{money(plan.price)}</Row>
      </dl>
      <p className="mt-5 flex items-center gap-2.5 rounded-2xl bg-paper p-3.5 text-[13px] text-ink-2">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white"><Mail className="h-4 w-4 text-red" aria-hidden="true" /></span>
        <span className="min-w-0">You can close this page. We’ll email <b className="font-semibold [overflow-wrap:anywhere]">{email}</b> once it’s confirmed.</span>
      </p>
    </Receipt>
  )
}
