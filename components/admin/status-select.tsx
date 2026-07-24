"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { ActionResult } from "@/lib/actions/forms"

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (next: T) => Promise<ActionResult>
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as T
        startTransition(async () => {
          const result = await onChange(next)
          if (!result.success) toast.error(result.error)
          else toast.success("Status updated.")
          router.refresh()
        })
      }}
      className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
