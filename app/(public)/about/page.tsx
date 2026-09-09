import type { Metadata } from "next"
import { Download } from "lucide-react"

import { BlockContent } from "@/components/common/block-content"
import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { getPageBySlug } from "@/lib/data/pages"
import { getSiteSettings } from "@/lib/data/settings"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about")
  const settings = await getSiteSettings()
  return {
    title: page?.seo_title || "About Us",
    description: page?.seo_description || settings.mission,
  }
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPageBySlug("about"), getSiteSettings()])

  return (
    <div>
      <div className="relative h-48 sm:h-64">
        <SmartImage src={page?.featured_image_url} alt={page?.title ?? "About Us"} kind="building" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeading eyebrow="About us" title={page?.title ?? "About Us"} align="left" className="max-w-none" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {settings.mission ? (
            <div className="rounded-xl border p-5">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">Our Mission</h2>
              <p className="text-muted-foreground">{settings.mission}</p>
            </div>
          ) : null}
          {settings.vision ? (
            <div className="rounded-xl border p-5">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">Our Vision</h2>
              <p className="text-muted-foreground">{settings.vision}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-10">
          {page ? (
            <BlockContent content={page.content} />
          ) : (
            <p className="text-muted-foreground">More about our history and leadership is coming soon.</p>
          )}
        </div>

        {page && page.downloads.length > 0 ? (
          <div className="mt-10 border-t pt-8">
            <h2 className="mb-4 text-lg font-bold">Downloads</h2>
            <ul className="space-y-2">
              {page.downloads.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {file.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
