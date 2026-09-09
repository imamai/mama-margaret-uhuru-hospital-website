"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

/**
 * Counts up from 0 to the leading number in `value` (e.g. "500+", "24/7",
 * "98%") once it scrolls into view, then renders the rest of the string
 * unchanged. Falls back to rendering the raw string when it has no leading
 * number, or instantly when the visitor prefers reduced motion.
 */
export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const reduceMotion = useReducedMotion()

  const match = value.match(/^(\d[\d,]*(?:\.\d+)?)/)
  const numeric = match ? Number(match[1].replace(/,/g, "")) : null
  const suffix = match ? value.slice(match[0].length) : ""
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0

  const [display, setDisplay] = useState(numeric === null || reduceMotion ? value : "0")

  useEffect(() => {
    if (numeric === null) return
    if (!inView || reduceMotion) {
      setDisplay(`${numeric.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`)
      return
    }

    const duration = 1200
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = numeric * eased
      setDisplay(`${current.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric, suffix, decimals, reduceMotion])

  return <span ref={ref}>{display}</span>
}
