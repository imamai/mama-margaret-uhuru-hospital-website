import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbJsonLd } from "@/lib/seo"

export type Crumb = { name: string; path: string }

/**
 * The visible breadcrumb trail and its BreadcrumbList JSON-LD, emitted
 * together so the two can never describe different paths -- Google treats a
 * mismatch between them as a structured-data error.
 *
 * `onDark` covers the coloured hero headers the department, clinic and doctor
 * pages open with.
 */
export function Breadcrumbs({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${onDark ? "text-white/70" : "text-muted-foreground"}`}>
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {i > 0 ? <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 opacity-60" /> : null}
                {isLast ? (
                  <span aria-current="page" className={onDark ? "text-white" : "text-foreground"}>
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="underline-offset-4 hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
