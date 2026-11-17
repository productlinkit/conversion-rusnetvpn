import mark from '../assets/logo-mark.png'

// RusnetVPN logo: the red sphere mark + the wordmark as the app sets it
// ("Rusnet" + red "VPN"). Size it with a text size class; `light` is for the
// deep-red tiles, where the wordmark turns white.
export default function Logo({ className = 'text-[22px]', light = false }) {
  return (
    <span className={`inline-flex items-center gap-[.4em] font-extrabold leading-none tracking-[-.045em] ${light ? 'text-white' : 'text-ink'} ${className}`}>
      <img src={mark} alt="" className="h-[1.6em] w-[1.6em] flex-none select-none drop-shadow-[0_4px_8px_rgba(160,10,25,.35)]" draggable="false" />
      <span>Rusnet<span className={light ? 'text-red-soft' : 'text-red'}>VPN</span></span>
    </span>
  )
}
