import { DEFAULT_BRAND_COLORS } from "@/lib/brand-defaults"

/**
 * Ready-made palettes, applied to all five colours at once.
 *
 * Every one is checked before it ships, by scripts/check-palettes.mjs:
 *
 *   Deep          >= 4.5:1 against white   (buttons, emergency bar, link text)
 *   Text          >= 4.5:1 against white   (body copy)
 *   Primary       >= 4.5:1 against #0A1116 (dark-mode buttons)
 *   Accent        >= 4.5:1 against #0A1116 (dark-mode emphasis)
 *   Section wash  <= 1.5:1 against white   (stays a wash)
 *
 * "Matches the badge" is measured, not judged by eye: the hospital's logo is
 * an emerald green whose dominant colour is #007040, hue 153°, and each
 * palette's hue is compared with that. Run the script after changing any of
 * these — a palette that fails is one somebody cannot read.
 */
/** The five colours a palette sets, as free-form hex rather than literals. */
export type PaletteColors = Record<keyof typeof DEFAULT_BRAND_COLORS, string>

export type BrandPalette = {
  name: string
  description: string
  colors: PaletteColors
}

export const BRAND_PALETTES: BrandPalette[] = [
  {
    name: "Logo green",
    description: "Built from the hospital's own badge — 3° off its green.",
    colors: {
      primary: "#1FA36A",
      deep: "#00603A",
      accent: "#4FD39B",
      dark_grey: "#333A36",
      light_grey: "#F2F8F5",
    },
  },
  {
    name: "Forest green",
    description: "The same family, deeper and quieter.",
    colors: {
      primary: "#2FBF4F",
      deep: "#0F5132",
      accent: "#4ADE80",
      dark_grey: "#33383C",
      light_grey: "#F3F7F4",
    },
  },
  {
    name: "Clinical teal",
    description: "Green edging towards blue. Reads as clinical rather than civic.",
    colors: {
      primary: "#14B8A6",
      deep: "#0F5E58",
      accent: "#2DD4BF",
      dark_grey: "#35393D",
      light_grey: "#F2F8F7",
    },
  },
  {
    name: "Hospital blue",
    description: "The colours the site was built in.",
    colors: { ...DEFAULT_BRAND_COLORS },
  },
  {
    name: "Slate navy",
    description: "Sober and low-contrast in tone, though not in legibility.",
    colors: {
      primary: "#6B8BA4",
      deep: "#25415B",
      accent: "#8FB3CC",
      dark_grey: "#2F3437",
      light_grey: "#F5F7F8",
    },
  },
  {
    name: "Deep maroon",
    description: "Warm and formal. Furthest from the badge.",
    colors: {
      primary: "#E05252",
      deep: "#8C2F39",
      accent: "#F08A8A",
      dark_grey: "#3B3A3C",
      light_grey: "#FAF5F5",
    },
  },
]
