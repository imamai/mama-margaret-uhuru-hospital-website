"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

function toCsvValue(value: unknown) {
  const str = String(value ?? "")
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function ExportCsvButton<T extends Record<string, unknown>>({
  rows,
  columns,
  filename,
}: {
  rows: T[]
  columns: { key: keyof T; label: string }[]
  filename: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        const header = columns.map((c) => toCsvValue(c.label)).join(",")
        const lines = rows.map((row) => columns.map((c) => toCsvValue(row[c.key])).join(","))
        const csv = [header, ...lines].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
      }}
    >
      <Download className="size-4" aria-hidden="true" /> Export CSV
    </Button>
  )
}
