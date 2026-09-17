import Link from "next/link"
import { AlertTriangle, CheckCircle2, ExternalLink, Info } from "lucide-react"

import { SearchPreview } from "@/components/admin/search-preview"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSeoAudit } from "@/lib/data/seo-audit"
import { getSiteSettings } from "@/lib/data/settings"
import { SITE_URL } from "@/lib/seo"

export const metadata = {
  title: "SEO Readiness",
  robots: { index: false, follow: false },
}

/** Google truncates around these lengths. Not rules -- guidance. */
const TITLE_MAX = 60
const DESC_MIN = 70
const DESC_MAX = 160

export default async function SeoReadinessPage() {
  const [rows, settings] = await Promise.all([getSeoAudit(), getSiteSettings()])

  const editable = rows.filter((r) => !r.inherits)
  const missing = editable.filter((r) => !r.seoTitle || !r.seoDescription)
  const noImage = rows.filter((r) => !r.hasImage)

  // A duplicate title is a page competing with its own sibling for the same
  // search. Compare the title that will actually be rendered, not just the
  // override, or every page falling back to its name looks unique when it is not.
  const counts = new Map<string, number>()
  for (const r of rows) {
    const key = (r.seoTitle || r.name).trim().toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const duplicates = new Set([...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k))

  const tooLong = editable.filter((r) => r.seoTitle && r.seoTitle.length > TITLE_MAX)
  const badDesc = editable.filter(
    (r) => r.seoDescription && (r.seoDescription.length < DESC_MIN || r.seoDescription.length > DESC_MAX),
  )

  const stats = [
    { label: "Published pages", value: rows.length, tone: "text-foreground" },
    { label: "Missing SEO title or description", value: missing.length, tone: missing.length ? "text-amber-600" : "text-emerald-600" },
    { label: "Duplicate titles", value: duplicates.size, tone: duplicates.size ? "text-destructive" : "text-emerald-600" },
    { label: "No share image", value: noImage.length, tone: noImage.length ? "text-amber-600" : "text-emerald-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SEO Readiness</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Which published pages are missing the fields Google and social networks read. This is a checklist, not a
          ranking score — no tool can predict where a page will rank. Every page still works without these fields; they
          just let you control the wording instead of letting the page guess.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <p className={`mt-2 text-3xl font-bold ${s.tone}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How your homepage looks in Google</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchPreview
            url={SITE_URL}
            title={settings.seo_defaults.title || settings.hospital_name}
            description={settings.seo_defaults.description || settings.mission}
          />
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Edit these under <Link href="/admin/settings" className="underline underline-offset-4">Settings</Link>. Google
              may still rewrite the title or description if it thinks another wording answers the search better — this is
              a preview, not a guarantee.
            </span>
          </p>
        </CardContent>
      </Card>

      {tooLong.length > 0 || badDesc.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Length warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {tooLong.map((r) => (
              <p key={`t-${r.path}`} className="text-muted-foreground">
                <span className="font-medium text-foreground">{r.name}</span> — SEO title is {r.seoTitle!.length}{" "}
                characters; Google usually cuts off around {TITLE_MAX}.
              </p>
            ))}
            {badDesc.map((r) => (
              <p key={`d-${r.path}`} className="text-muted-foreground">
                <span className="font-medium text-foreground">{r.name}</span> — description is{" "}
                {r.seoDescription!.length} characters; aim for {DESC_MIN}–{DESC_MAX}.
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Every published page</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Page</th>
                  <th className="px-5 py-3">SEO title</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => {
                  const key = (r.seoTitle || r.name).trim().toLowerCase()
                  const isDuplicate = duplicates.has(key)
                  const isMissing = !r.inherits && (!r.seoTitle || !r.seoDescription)
                  return (
                    <tr key={`${r.type}-${r.path}`} className="align-top hover:bg-muted/30">
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{r.type}</td>
                      <td className="px-5 py-3">
                        <Link href={r.editHref} className="font-medium hover:underline">
                          {r.name}
                        </Link>
                        <a
                          href={r.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                        >
                          {r.path} <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </td>
                      <td className="max-w-xs px-5 py-3 text-muted-foreground">
                        {r.seoTitle || <span className="italic opacity-60">built from the page</span>}
                      </td>
                      <td className="max-w-md px-5 py-3 text-muted-foreground">
                        {r.seoDescription || <span className="italic opacity-60">built from the page</span>}
                      </td>
                      <td className="px-5 py-3">
                        {isDuplicate ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="size-3" aria-hidden="true" /> Duplicate title
                          </Badge>
                        ) : isMissing ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <AlertTriangle className="size-3.5" aria-hidden="true" /> Using fallback
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="size-3.5" aria-hidden="true" /> Ready
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
