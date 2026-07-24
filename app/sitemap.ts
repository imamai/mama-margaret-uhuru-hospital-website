import type { MetadataRoute } from "next"

import { listDepartments } from "@/lib/data/departments"
import { listDoctors } from "@/lib/data/doctors"
import { listOpenJobs } from "@/lib/data/jobs"
import { listNews } from "@/lib/data/news"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const STATIC_ROUTES = ["", "/departments", "/doctors", "/news", "/careers", "/appointments", "/contact"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, doctors, news, jobs] = await Promise.all([
    listDepartments(),
    listDoctors(),
    listNews({}),
    listOpenJobs(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  const departmentEntries: MetadataRoute.Sitemap = departments.map((d) => ({
    url: `${SITE_URL}/departments/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const doctorEntries: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${SITE_URL}/doctors/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  const newsEntries: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    changeFrequency: "yearly",
    priority: 0.4,
  }))

  const jobEntries: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${SITE_URL}/careers/${j.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  return [...staticEntries, ...departmentEntries, ...doctorEntries, ...newsEntries, ...jobEntries]
}
