import type { SVGProps } from "react"

/**
 * lucide-react v1 dropped trademarked brand/logo glyphs, so the handful of
 * social icons the footer needs are hand-drawn here instead of pulling in a
 * whole brand-icon package for five paths.
 */
function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props} />
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.3c0-.87.24-1.46 1.49-1.46H16.6V4.14C16.3 4.1 15.3 4 14.13 4c-2.44 0-4.13 1.49-4.13 4.22V10.5H7.5v3H10V21h3.5Z" />
    </IconBase>
  )
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M18.9 3H21l-6.44 7.36L22 21h-6.12l-4.79-6.27L5.6 21H3.47l6.9-7.88L3 3h6.27l4.32 5.72L18.9 3Zm-1.07 16.2h1.18L7.28 4.72H6.02L17.83 19.2Z" />
    </IconBase>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3.2c2.4 0 2.7 0 3.6.05 2.4.11 3.5 1.24 3.6 3.6.05.9.06 1.2.06 3.6s0 2.7-.06 3.6c-.1 2.36-1.2 3.5-3.6 3.6-.9.05-1.2.06-3.6.06s-2.7 0-3.6-.06c-2.4-.1-3.5-1.24-3.6-3.6-.05-.9-.06-1.2-.06-3.6s0-2.7.06-3.6c.1-2.36 1.2-3.5 3.6-3.6.9-.05 1.2-.06 3.6-.06ZM12 2c-2.44 0-2.75 0-3.7.06-3.07.14-4.79 1.85-4.93 4.93C3.3 7.94 3.3 8.25 3.3 10.68v2.63c0 2.44 0 2.75.06 3.7.14 3.07 1.85 4.79 4.93 4.93.95.05 1.26.06 3.71.06s2.75 0 3.7-.06c3.07-.14 4.79-1.85 4.93-4.93.05-.95.06-1.26.06-3.7v-2.63c0-2.44 0-2.75-.06-3.7-.14-3.07-1.85-4.79-4.93-4.93C14.75 2 14.44 2 12 2Zm0 4.8a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.58a3.38 3.38 0 1 1 0-6.76 3.38 3.38 0 0 1 0 6.76Zm5.4-8.78a1.22 1.22 0 1 1-2.43 0 1.22 1.22 0 0 1 2.43 0Z" />
    </IconBase>
  )
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.5 21h-3.37v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.4V21H9.16V8.5h3.24v1.7h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V21Z" />
    </IconBase>
  )
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M21.6 7.7a2.75 2.75 0 0 0-1.93-1.95C18 5.3 12 5.3 12 5.3s-6 0-7.67.45A2.75 2.75 0 0 0 2.4 7.7 28.8 28.8 0 0 0 2 12a28.8 28.8 0 0 0 .4 4.3 2.75 2.75 0 0 0 1.93 1.95C6 18.7 12 18.7 12 18.7s6 0 7.67-.45a2.75 2.75 0 0 0 1.93-1.95c.27-1.42.4-2.86.4-4.3a28.8 28.8 0 0 0-.4-4.3ZM10.1 15.02V8.98L15.4 12l-5.3 3.02Z" />
    </IconBase>
  )
}
