"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"

const HEX = /^#[0-9a-fA-F]{6}$/

/**
 * A colour, chosen from a swatch or typed as a hex code.
 *
 * The setting has always been a text box expecting "#0D5EA6", which is a fair
 * thing to ask of a designer and no thing at all to ask of the person running
 * a hospital's website. The swatch opens the operating system's colour picker;
 * the hex box stays, because a brand colour usually arrives written down.
 *
 * The two are kept in step, and the text input is what the form submits, so an
 * exact code pasted in is preserved rather than rounded by the picker.
 */
export function ColorField({
  id,
  name,
  defaultValue,
}: {
  id: string
  name: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue ?? "#000000")
  const valid = HEX.test(value)

  return (
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
        className="w-32 font-mono uppercase"
      />
      {!valid ? (
        <span className="text-xs text-destructive">Use a hex code, e.g. #0D5EA6</span>
      ) : null}
    </div>
  )
}
