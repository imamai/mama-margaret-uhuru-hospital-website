/**
 * Contrast between two colours, by the WCAG 2.1 definition.
 *
 * Used to warn before a brand colour is saved that would make the site hard to
 * read. A hospital's visitors include people with poor sight and people using
 * a phone in daylight, and 4.5:1 is the line below which ordinary text stops
 * being legible for them.
 */

/** #RGB or #RRGGBB to 0-255 channels. Null when it is neither. */
function channels(hex: string): [number, number, number] | null {
  const value = hex.trim().replace(/^#/, "")

  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    const [r, g, b] = value.split("")
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)]
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16),
    ]
  }
  return null
}

/** WCAG relative luminance: sRGB channels linearised, then weighted. */
export function relativeLuminance(hex: string): number | null {
  const rgb = channels(hex)
  if (!rgb) return null

  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * The ratio between two colours, from 1 (identical) to 21 (black on white).
 * Null if either colour cannot be read.
 */
export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  if (la === null || lb === null) return null

  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG AA for ordinary text. */
export const MIN_TEXT_CONTRAST = 4.5

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1)}:1`
}
