import { contrastRatio } from "./lib/contrast.ts"

const WHITE = "#FFFFFF"
const DARK_BG = "#0A1116" // the dark-mode page behind Primary and Accent
const LOGO_HUE = 153 // measured from the hospital's badge (dominant #007040)

const CANDIDATES = {
  "Logo green": { primary: "#1FA36A", deep: "#00603A", accent: "#4FD39B", dark_grey: "#333A36", light_grey: "#F2F8F5" },
  "Hospital blue": { primary: "#1496E8", deep: "#0D5EA6", accent: "#19B5FE", dark_grey: "#3E4348", light_grey: "#F6F7F9" },
  "Forest green": { primary: "#2FBF4F", deep: "#0F5132", accent: "#4ADE80", dark_grey: "#33383C", light_grey: "#F3F7F4" },
  "Clinical teal": { primary: "#14B8A6", deep: "#0F5E58", accent: "#2DD4BF", dark_grey: "#35393D", light_grey: "#F2F8F7" },
  "Deep maroon": { primary: "#E05252", deep: "#8C2F39", accent: "#F08A8A", dark_grey: "#3B3A3C", light_grey: "#FAF5F5" },
  "Slate navy": { primary: "#6B8BA4", deep: "#25415B", accent: "#8FB3CC", dark_grey: "#2F3437", light_grey: "#F5F7F8" },
  // What the site is wearing right now, for comparison only.
  "(currently live)": { primary: "#27CA1C", deep: "#4C6D40", accent: "#19B5FE", dark_grey: "#3E4348", light_grey: "#F6F7F9" },
}

const rules = [
  ["deep", WHITE, 4.5, ">=", "buttons, emergency bar, link text"],
  ["dark_grey", WHITE, 4.5, ">=", "body text"],
  ["primary", DARK_BG, 4.5, ">=", "dark-mode buttons"],
  ["accent", DARK_BG, 4.5, ">=", "dark-mode emphasis"],
  ["light_grey", WHITE, 1.5, "<=", "section wash stays near white"],
]

function hue(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  if (mx === mn) return null
  const d = mx - mn
  let h
  if (mx === r) h = ((g - b) / d) % 6
  else if (mx === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return ((h * 60) % 360 + 360) % 360
}

function hueGap(hex) {
  const h = hue(hex)
  if (h === null) return null
  const raw = Math.abs(h - LOGO_HUE)
  return Math.min(raw, 360 - raw)
}

for (const [name, p] of Object.entries(CANDIDATES)) {
  const fails = []
  const parts = []
  for (const [key, against, limit, op, why] of rules) {
    const r = contrastRatio(p[key], against)
    const ok = op === ">=" ? r >= limit : r <= limit
    parts.push(`${key} ${r.toFixed(1)}${ok ? "" : "!"}`)
    if (!ok) fails.push(`${key} is ${r.toFixed(1)} but ${why} needs ${op} ${limit}`)
  }
  const gap = hueGap(p.deep)
  const match = gap === null ? "n/a" : gap <= 20 ? "matches logo" : gap <= 45 ? "near logo" : "unrelated hue"
  console.log(
    `${fails.length ? "FAIL" : "pass"}  ${name.padEnd(17)} ${parts.join("  ").padEnd(62)} deep hue ${String(
      Math.round(hue(p.deep) ?? 0)
    ).padStart(3)}deg  ${String(Math.round(gap ?? 0)).padStart(3)}deg from logo  ${match}`
  )
  for (const f of fails) console.log(`        ${f}`)
}
