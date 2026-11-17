// Plans and prices as they appear on rusnetvpn.vercel.app. The source there marks
// them "PLACEHOLDER PRICES", so confirm with billing before running paid traffic.
// Only price and term are typed; everything else is derived.
const RAW = [
  { id: '1w',  label: '1 Week',   name: '1-Week plan',   per: 'Week',     price: 2.99,  months: 1 / 4.345, term: 'week',     every: 'every week',     days: 7 },
  { id: '1m',  label: '1 Month',  name: '1-Month plan',  per: 'Month',    price: 7.99,  months: 1,         term: 'month',    every: 'every month',    days: 30 },
  { id: '3m',  label: '3 Months', name: '3-Months plan', per: '3-Months', price: 17.99, months: 3,         term: '3 months', every: 'every 3 months', days: 91 },
  { id: '6m',  label: '6 Months', name: '6-Months plan', per: '6-Months', price: 29.99, months: 6,         term: '6 months', every: 'every 6 months', days: 182 },
  { id: '1y',  label: '1 Year',   name: '1-Year plan',   per: 'Year',     price: 47.99, months: 12,        term: 'year',     every: 'every year',     days: 365 },
]

const monthly = RAW.find((p) => p.id === '1m')

const PAID = RAW.map((p) => {
  const perMonth = p.price / p.months
  const saving = Math.round((1 - perMonth / monthly.price) * 100)
  return { ...p, perMonth, saving: saving > 0 ? saving : 0, dueToday: p.price }
})

// Free trial: its own plan. The card is taken today, nothing is charged for
// TRIAL_DAYS, then it continues as the 1-Month plan unless cancelled before.
// The paid plans above are charged today and have no trial.
export const TRIAL_DAYS = 7
const TRIAL = {
  id: 'trial', label: `${TRIAL_DAYS}-Day Free Trial`, name: 'Free trial', trial: true,
  price: 0, dueToday: 0, perMonth: 0, saving: 0, days: TRIAL_DAYS,
  then: monthly, // what it becomes
  every: monthly.every,
}

// shown in this order: the trial first, then longest plan to shortest
export const PLANS = [TRIAL, ...[...PAID].reverse()]

export const DEFAULT_PLAN = 'trial'
export const BEST_DEAL = '1y'

export const money = (n) => '$' + n.toFixed(2)

const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const addDays = (n, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + n); return d }

// the day the trial ends and the first charge is taken
export function trialEndDate(from = new Date()) {
  return fmt(addDays(TRIAL_DAYS, from))
}

// the next charge after today: the end of the trial, or the end of the paid term
export function renewalDate(plan, from = new Date()) {
  return fmt(addDays(plan.days, from))
}

// what the next charge will be
export function nextCharge(plan) {
  return plan.trial ? plan.then.price : plan.price
}
