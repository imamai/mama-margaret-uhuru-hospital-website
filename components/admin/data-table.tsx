"use client"

import { useMemo, useState, type ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type DataTableColumn = {
  key: string
  label: string
}

export type DataTableRow = {
  id: string
  /** Lowercased, pre-joined searchable text for this row (omit to exclude from search). */
  searchText?: string
  /** Rendered cell content, aligned 1:1 with the `columns` array. */
  cells: ReactNode[]
  /** Rendered actions content for this row (e.g. edit/delete buttons). */
  actions?: ReactNode
}

/**
 * Generic admin list view: search + table + a per-row actions slot. Each admin
 * module (a Server Component) pre-renders its cells/actions as JSX and passes
 * them as data here — render callbacks can't cross the Server->Client boundary.
 */
export function DataTable({
  columns,
  rows,
  searchable = false,
  toolbar,
  emptyMessage = "No records yet.",
}: {
  columns: DataTableColumn[]
  rows: DataTableRow[]
  searchable?: boolean
  toolbar?: ReactNode
  emptyMessage?: string
}) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query || !searchable) return rows
    const q = query.toLowerCase()
    return rows.filter((row) => (row.searchText ?? "").includes(q))
  }, [rows, query, searchable])

  const showActionsColumn = rows.some((row) => row.actions !== undefined)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchable ? (
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
              {showActionsColumn ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (showActionsColumn ? 1 : 0)} className="py-10 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell, i) => (
                    <TableCell key={columns[i]?.key ?? i}>{cell}</TableCell>
                  ))}
                  {showActionsColumn ? <TableCell className="text-right">{row.actions}</TableCell> : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
