"use client"

import { useState } from "react"

import { ColorField, type ColorCheck } from "@/components/admin/color-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BRAND_PALETTES, type PaletteColors } from "@/lib/brand-palettes"
import { DEFAULT_BRAND_COLORS } from "@/lib/brand-defaults"

const DARK_PAGE = "#0A1116"

const FIELDS: {
  key: keyof PaletteColors
  label: string
  hint: string
  check: ColorCheck
}[] = [
  {
    key: "deep",
    label: "Deep",
    hint: "Buttons, the emergency bar and link text. This is the colour the site reads as.",
    check: { mode: "surface", used: "Button text, emergency bar text and link text" },
  },
  {
    key: "dark_grey",
    label: "Text",
    hint: "Body text, and the footer background.",
    check: { mode: "text", used: "Body text in this colour" },
  },
  {
    key: "light_grey",
    label: "Section background",
    hint: "The tint behind alternating sections.",
    check: { mode: "tint", used: "Text in those sections" },
  },
  {
    key: "primary",
    label: "Primary",
    hint: "Focus outlines, and buttons for visitors using dark mode.",
    check: { mode: "on-dark", used: "Dark-mode buttons in this colour" },
  },
  {
    key: "accent",
    label: "Accent",
    hint: "Emphasis in dark mode. Meant to be light.",
    check: { mode: "on-dark", used: "Dark-mode emphasis in this colour" },
  },
]

/**
 * The five brand colours, with ready-made sets and a preview.
 *
 * It owns the colours rather than letting each box keep its own, because the
 * preview has to see all five at once — and because Primary and Accent appear
 * only in dark mode, so without a preview nobody can tell what changing them
 * did.
 *
 * Every input is a real form field, so this sits inside the branding form and
 * submits with it. Nothing here writes anything: the palette reaches the site
 * when Save is pressed.
 */
export function BrandPaletteEditor({
  current,
  hospitalDefault,
}: {
  current: PaletteColors
  hospitalDefault: PaletteColors
}) {
  const [colors, setColors] = useState<PaletteColors>(current)

  const hospitalDefaultIsCustom =
    JSON.stringify(hospitalDefault) !== JSON.stringify(DEFAULT_BRAND_COLORS)

  const set = (key: keyof PaletteColors) => (next: string) =>
    setColors((prev) => ({ ...prev, [key]: next }))

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div>
          <p className="text-sm font-medium">Ready-made sets</p>
          <p className="text-xs text-muted-foreground">
            Sets all five colours at once. Each has been checked for readability.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {BRAND_PALETTES.map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => setColors({ ...palette.colors })}
              aria-label={`Use the ${palette.name} colours`}
              className="flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="flex shrink-0 gap-1" aria-hidden="true">
                {[palette.colors.deep, palette.colors.primary, palette.colors.accent].map((hex) => (
                  <span key={hex} className="size-5 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{palette.name}</span>
                <span className="block text-xs text-muted-foreground">{palette.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">Preview</p>
        <div className="overflow-hidden rounded-xl border">
          <div className="px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: colors.deep }}>
            Emergency: 0794-416-498
          </div>

          <div className="space-y-2 bg-white p-4">
            <p className="text-base font-bold" style={{ color: colors.dark_grey }}>
              Accident and Emergency
            </p>
            <p className="text-sm" style={{ color: colors.dark_grey }}>
              Open 24 hours. Walk in, or{" "}
              <span className="font-medium underline" style={{ color: colors.deep }}>
                book an appointment
              </span>
              .
            </p>
            <span
              className="inline-block rounded-lg px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: colors.deep }}
            >
              Book Appointment
            </span>
          </div>

          <div className="p-4" style={{ backgroundColor: colors.light_grey }}>
            <p className="text-sm" style={{ color: colors.dark_grey }}>
              Departments, clinics and visiting hours sit on this tint.
            </p>
          </div>

          <div className="space-y-2 p-4" style={{ backgroundColor: DARK_PAGE }}>
            <p className="text-[11px] tracking-wide text-white/50 uppercase">In dark mode</p>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-block rounded-lg px-3 py-1.5 text-xs font-medium"
                style={{ backgroundColor: colors.primary, color: DARK_PAGE }}
              >
                Book Appointment
              </span>
              <span className="text-sm font-medium" style={{ color: colors.accent }}>
                Find a doctor
              </span>
            </div>
          </div>

          <div className="px-4 py-3 text-xs text-white/70" style={{ backgroundColor: colors.dark_grey }}>
            © Mama Margaret Uhuru Hospital
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <ColorField
              id={field.key}
              name={field.key}
              value={colors[field.key]}
              onValueChange={set(field.key)}
              check={field.check}
            />
            <p className="text-xs text-muted-foreground">{field.hint}</p>
          </div>
        ))}
      </section>

      <label className="flex items-start gap-2.5 rounded-lg border p-3 text-sm">
        <input type="checkbox" name="setAsDefault" value="true" className="mt-0.5 size-4 rounded border-input" />
        <span>
          Make these the hospital&apos;s default colours
          <span className="block text-xs text-muted-foreground">
            Restore brings them back later. Tick this once you are happy with how the site looks.
          </span>
        </span>
      </label>

      <div className="space-y-2 rounded-lg border border-dashed p-3">
        <div className="flex flex-wrap gap-2">
          {hospitalDefaultIsCustom ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setColors({ ...hospitalDefault })}>
              Restore hospital colours
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={() => setColors({ ...DEFAULT_BRAND_COLORS })}>
            {hospitalDefaultIsCustom ? "Restore original site colours" : "Restore default colours"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Puts those values back in the boxes. Nothing changes on the site until you save.
        </p>
      </div>
    </div>
  )
}
