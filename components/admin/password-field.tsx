"use client"

import { useState } from "react"
import { Check, Copy, Eye, EyeOff, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Characters a password may be built from.
 *
 * No 0/O, 1/l/I: these passwords get written on paper, read down a phone line
 * and typed by someone else, and a password nobody can transcribe is a
 * password that gets reset.
 */
const LOWER = "abcdefghijkmnopqrstuvwxyz"
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"
const DIGITS = "23456789"
const SYMBOLS = "!@#$%^&*-_=+?"

function pick(set: string, count = 1): string[] {
  const values = new Uint32Array(count)
  crypto.getRandomValues(values)
  return Array.from(values, (v) => set[v % set.length])
}

/**
 * A 16-character password with at least one of each kind, so it satisfies any
 * policy the auth server is configured with, then shuffled so the guaranteed
 * characters do not always sit in the same four places.
 */
function generatePassword(): string {
  const chars = [
    ...pick(LOWER),
    ...pick(UPPER),
    ...pick(DIGITS),
    ...pick(SYMBOLS),
    ...pick(LOWER + UPPER + DIGITS + SYMBOLS, 12),
  ]

  const order = new Uint32Array(chars.length)
  crypto.getRandomValues(order)
  return chars
    .map((char, i) => ({ char, key: order[i] }))
    .sort((a, b) => a.key - b.key)
    .map((entry) => entry.char)
    .join("")
}

/**
 * A password input you can read back.
 *
 * Hidden by default, because these are typed in offices with people walking
 * past, but revealable: typing a password you cannot see, twice, is how
 * mismatches happen. The generator reveals what it made, since whoever
 * generates a password for someone else has to be able to pass it on.
 */
export function PasswordField({
  id,
  name,
  required,
  autoComplete = "new-password",
  offerGenerator = false,
}: {
  id: string
  name: string
  required?: boolean
  autoComplete?: string
  offerGenerator?: boolean
}) {
  const [value, setValue] = useState("")
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused; the password is on screen to read.
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>

      {offerGenerator ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue(generatePassword())
              setVisible(true)
              setCopied(false)
            }}
          >
            <Wand2 className="size-3.5" aria-hidden="true" /> Generate
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={copy}>
              {copied ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" /> Copy
                </>
              )}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
