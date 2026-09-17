import type { MetadataRoute } from "next"

import { listClinics } from "@/lib/data/clinics"
import { listDepartments } from "@/lib/data/departments"
import { listDoctors } from "@/lib/data/doctors"
import { listOpenJobs } from "@/lib/data/jobs"
import { listNews } from "@/lib/data/news"
import { listTenders } from "@/lib/data/tenders"
import { SITE_URL } from "@/lib/seo"

/**
 * Every indexable public URL, built from the CMS so a newly published
 * department, clinic, doctor or article appears without a code change.
 *
 * Deliberately absent: /admin and /api (private), /suppliers/login and
 * /suppliers/dashboard (a portal, noindex), and anything unpublished -- the
 * list helpers already filter on status = 'published' and deleted_at is null,
 * so a draft cannot leak in here.
 *
 * `priority` and `changeFrequency` are hints Google has said it ignores; they
 * are kept only because they cost nothing. `lastModified` is the field that
 * still matters, so every entry carries a real one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, clinics, doctors, news, jobs, tenders] = await Promise.all([
    listDepartments(),
    listClinics(),
    listDoctors(),
    listNews({}),
    listOpenJobs(),
    listTenders(),
  ])

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = ([
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/departments`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/clinics`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/doctors`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/patients`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/appointments`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/careers`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/tenders`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/suppliers/register`, changeFrequency: "yearly", priority: 0.3 },
  ] as const).map((entry) => ({ ...entry, lastModified: now }))

  const dated = (value: string | null | undefined) => (value ? new Date(value) : now)

  return [
    ...staticEntries,
    ...departments.map((d) => ({
      url: `${SITE_URL}/departments/${d.slug}`,
      lastModified: dated(d.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...clinics.map((c) => ({
      url: `${SITE_URL}/clinics/${c.slug}`,
      lastModified: dated(c.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...doctors.map((d) => ({
      url: `${SITE_URL}/doctors/${d.slug}`,
      lastModified: dated(d.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      lastModified: dated(n.updated_at ?? n.published_at),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...jobs.map((j) => ({
      url: `${SITE_URL}/careers/${j.slug}`,
      lastModified: dated(j.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tenders.map((t) => ({
      url: `${SITE_URL}/tenders/${t.slug}`,
      lastModified: dated(t.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ]
}
