import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button.jsx'
import Receipt, { Row } from './Receipt.jsx'
import TransactionId from './TransactionId.jsx'
import { money } from '../lib/plans.js'

export default function FailedStep({ email, plan, txId, onRetry }) {
  const h = useRef(null)
  useEffect(() => { h.current?.focus() }, [])

  return (
    <Receipt
      ref={h}
      tone="failed"
      icon={X}
      title={<>Payment <em className="not-italic text-red-soft">failed.</em></>}
      lead="Your bank declined the payment. You haven’t been charged."
      action={<Button className="w-full" onClick={onRetry}>Try again</Button>}
    >
      <dl className="space-y-2.5">
        <TransactionId id={txId} />
        <Row label="Plan">RusnetVPN · {plan.label}</Row>
        <Row label="Account">{email}</Row>
        <Row label="Status"><span className="text-red-text">Failed</span></Row>
        <Row label="Amount" strong>{money(plan.price)}</Row>
      </dl>
      <p className="mt-5 rounded-2xl bg-paper p-3.5 text-[13px] leading-relaxed text-ink-2">
        Check the card details, make sure the card allows online payments, or try a different card.
      </p>
    </Receipt>
  )
}
