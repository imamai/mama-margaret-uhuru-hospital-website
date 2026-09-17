"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { MIN_TEXT_CONTRAST, contrastRatio, formatRatio } from "@/lib/contrast"

const HEX = /^#[0-9a-fA-F]{6}$/
const WHITE = "#FFFFFF"

/**
 * How a colour is used, which is what decides whether it is readable.
 *
 *   text    - shown as words on a white page, so it must be dark enough
 *   surface - filled behind white words, so it must also be dark enough
 *   tint    - a background wash that should stay close to white
 */
export type ColorCheck = { mode: "text" | "surface" | "tint"; used: string }

function warningFor(value: string, check: ColorCheck): string | null {
  const ratio = contrastRatio(value, WHITE)
  if (ratio === null) return null

  if (check.mode === "tint") {
    // Not a contrast failure but the same kind of mistake: a "light background"
    // dark enough to fight the text that sits on it.
    return ratio > 1.5
      ? `This is a background wash and should stay close to white. ${check.used} may be hard to read on it.`
      : null
  }

  if (ratio >= MIN_TEXT_CONTRAST) return null

  return check.mode === "text"
    ? `${check.used} would have contrast ${formatRatio(ratio)} on white. ${formatRatio(
        MIN_TEXT_CONTRAST
      )} is the minimum for readable text — choose something darker.`
    : `White text on this colour would have contrast ${formatRatio(ratio)}. ${formatRatio(
        MIN_TEXT_CONTRAST
      )} is the minimum for readable text — choose something darker.`
}

/**
 * A colour, chosen from a swatch or typed as a hex code, checked as you go.
 *
 * The setting has always been a text box expecting "#0D5EA6", which is a fair
 * thing to ask of a designer and no thing at all to ask of the person running
 * a hospital's website. The swatch opens the operating system's colour picker;
 * the hex box stays, because a brand colour usually arrives written down.
 *
 * The warning is advisory and never blocks saving: it is the hospital's site,
 * and there are reasons to override a guideline. But nobody should discover
 * that the new green made every link unreadable by hearing it from a patient.
 */
export function ColorField({
  id,
  name,
  defaultValue,
  check,
}: {
  id: string
  name: string
  defaultValue?: string
  check?: ColorCheck
}) {
  const [value, setValue] = useState(defaultValue ?? "#000000")
  const valid = HEX.test(value)
  const warning = valid && check ? warningFor(value, check) : null

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick a colour"
          value={valid ? value.toLowerCase() : "#000000"}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          className="size-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1"
        />
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          aria-invalid={!valid}
          aria-describedby={warning ? `${id}-warning` : undefined}
          className="w-32 font-mono uppercase"
        />
        {!valid ? <span className="text-xs text-destructive">Use a hex code, e.g. #0D5EA6</span> : null}
      </div>

      {warning ? (
        <p
          id={`${id}-warning`}
          className="flex items-start gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-2 text-xs"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{warning}</span>
        </p>
      ) : null}
    </div>
  )
}
