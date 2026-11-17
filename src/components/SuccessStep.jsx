import { useEffect, useRef } from 'react'
import { Check, Mail } from 'lucide-react'
import Button from './Button.jsx'
import Receipt, { Row } from './Receipt.jsx'
import TransactionId from './TransactionId.jsx'
import { ACCOUNT } from '../lib/account.js'
import { money, trialEndDate, TRIAL_DAYS } from '../lib/plans.js'

export default function SuccessStep({ email, account, plan, txId, onAccess }) {
  const h = useRef(null)
  const isNew = account === ACCOUNT.NEW
  useEffect(() => { h.current?.focus() }, [])

  return (
    <Receipt
      ref={h}
      tone="success"
      icon={Check}
      title={<>Your free trial <em className="not-italic text-red-soft">has started.</em></>}
      lead={isNew
        ? `Enjoy ${TRIAL_DAYS} days of RusnetVPN free. Check your email for your password.`
        : `Enjoy ${TRIAL_DAYS} days of RusnetVPN free. Log in with your existing password.`}
      note="Prototype: payment and email are simulated."
      action={<Button className="w-full" onClick={onAccess}>Access RusnetVPN</Button>}
    >
      <dl className="space-y-2.5">
        <TransactionId id={txId} />
        <Row label="Plan">RusnetVPN · {plan.label}</Row>
        <Row label="Free trial ends">{trialEndDate()}</Row>
        <Row label="First charge">{money(plan.price)} on {trialEndDate()}</Row>
        <Row label="Charged today" strong>$0.00</Row>
      </dl>
      <p className="mt-5 flex items-center gap-2.5 rounded-2xl bg-paper p-3.5 text-[13px] text-ink-2">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white"><Mail className="h-4 w-4 text-red" aria-hidden="true" /></span>
        <span className="min-w-0">{isNew ? 'Password sent to' : 'Account'} <b className="font-semibold [overflow-wrap:anywhere]">{email}</b></span>
      </p>
    </Receipt>
  )
}
