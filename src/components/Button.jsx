import { ArrowUpRight, Loader2 } from 'lucide-react'

// The LP's pill: label + round red arrow chip that turns 45° on hover.
// 'ink' on light surfaces, 'light' on the photo card and the deep-red tile.
export default function Button({ children, busy = false, busyLabel, variant = 'ink', className = '', type = 'button', ...rest }) {
  const light = variant === 'light' || variant === 'white'
  return (
    <button
      type={type}
      aria-busy={busy || undefined}
      disabled={busy || rest.disabled}
      className={`btn ${light ? 'btn-light' : 'btn-ink'} group inline-flex min-h-[52px] items-center justify-between gap-3 rounded-full py-2 pl-6 pr-2 text-[15.5px] font-semibold leading-none whitespace-nowrap active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
      {...rest}
    >
      <span className="flex-1 text-center">{busy && busyLabel ? busyLabel : children}</span>
      <span className="arw grid h-9 w-9 flex-none place-items-center rounded-full bg-red text-white" aria-hidden="true">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />}
      </span>
    </button>
  )
}
