"use client"

import { useMemo, useState, type ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type DataTableColumn<T> = {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

/**
 * Generic admin list view: search + table + a per-row actions slot. Each
 * admin module supplies its own columns/actions/create-dialog; this component
 * only owns the table chrome so every module looks and behaves consistently.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  searchKeys,
  toolbar,
  renderActions,
  emptyMessage = "No records yet.",
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  searchKeys?: (keyof T)[]
  toolbar?: ReactNode
  renderActions?: (row: T) => ReactNode
  emptyMessage?: string
}) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query || !searchKeys?.length) return rows
    const q = query.toLowerCase()
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    )
  }, [rows, query, searchKeys])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchKeys?.length ? (
          <Input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
            aria-label="Search records"
          />
        ) : (
          <div />
        )}
        {toolbar}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {renderActions ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="py-10 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}</TableCell>
                  ))}
                  {renderActions ? <TableCell className="text-right">{renderActions(row)}</TableCell> : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
