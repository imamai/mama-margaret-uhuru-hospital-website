import type { ReactNode } from "react"

/**
 * A row of logos that scrolls sideways, forever.
 *
 * Stays a server component: the movement is CSS, so nothing here ships
 * JavaScript to the visitor. See `.logo-marquee` in globals.css for how the
 * loop is made seamless and what happens under prefers-reduced-motion.
 *
 * Two details that matter more than they look:
 *
 * The set is repeated until it is comfortably wider than a large screen. Six
 * logos is about 1,200px; on a 1,920px monitor a single set would finish
 * mid-viewport and leave a visible gap travelling round with it.
 *
 * The second half is `inert` and `aria-hidden`, so a screen reader reads the
 * partners once rather than twice, and tabbing does not land on invisible
 * copies of the same link.
 */
export function LogoMarquee({
  items,
  /** Seconds for one full pass. Longer reads as calmer. */
  seconds = 40,
}: {
  items: { key: string; node: ReactNode }[]
  seconds?: number
}) {
  if (items.length === 0) return null

  // Enough logos per half to outrun a wide monitor.
  const MIN_PER_HALF = 10
  const repeats = Math.max(1, Math.ceil(MIN_PER_HALF / items.length))
  const half = Array.from({ length: repeats }, (_, r) =>
    items.map((item) => ({ ...item, key: `${item.key}-${r}`, repeat: r })),
  ).flat()

  const row = (copy: "original" | "duplicate") => (
    <ul
      data-marquee-copy={copy}
      className="logo-marquee-row flex shrink-0 items-center gap-x-12 px-6"
      {...(copy === "duplicate" ? { "aria-hidden": true, inert: true } : {})}
    >
      {half.map((item) => (
        <li key={`${copy}-${item.key}`} data-repeat={item.repeat} className="flex shrink-0 items-center">
          {item.node}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="logo-marquee">
      <div
        className="logo-marquee-track"
        style={{ "--marquee-duration": `${seconds}s` } as React.CSSProperties}
      >
        {row("original")}
        {row("duplicate")}
      </div>
    </div>
  )
}
