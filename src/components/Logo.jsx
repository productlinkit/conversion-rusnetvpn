import logoDark from '../assets/logo.png'
import logoLight from '../assets/logo-light.png'

// The RusnetVPN logo (shield + wordmark) from lp-rusnetvpn. `light` is the
// white-wordmark version for the deep-red tiles.
export default function Logo({ className = 'h-7 w-auto', light = false }) {
  return <img src={light ? logoLight : logoDark} alt="RusnetVPN" className={`select-none ${className}`} draggable="false" />
}
