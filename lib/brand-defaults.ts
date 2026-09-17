/**
 * The palette the site ships with.
 *
 * One source for the two places that need it in TypeScript: the fallback when
 * no palette is stored, and the "Restore default colours" button in Settings →
 * Branding. `app/globals.css` keeps its own copy as the CSS-level fallback for
 * the moment before the stored palette is applied — the comment there says so.
 *
 * Plain module, not server-only: the settings page hands these to a client
 * component so the button can put them back.
 */
export const DEFAULT_BRAND_COLORS = {
  primary: "#1496E8",
  deep: "#0D5EA6",
  accent: "#19B5FE",
  dark_grey: "#3E4348",
  light_grey: "#F6F7F9",
} as const
