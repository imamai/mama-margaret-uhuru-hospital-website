import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type SeoAuditRow = {
  type: string
  name: string
  path: string
  editHref: string
  seoTitle: string | null
  seoDescription: string | null
  hasImage: boolean
  /** True when the entity has no per-entity SEO fields at all in the schema. */
  inherits: boolean
}

/**
 * Every published public page the CMS controls, with the SEO fields an editor
 * can actually fill in.
 *
 * Read directly rather than through the public list helpers because those
 * select only what their page renders -- the audit needs the SEO columns, and
 * needs them for drafts too so an editor can fix a page before publishing.
 */
export const getSeoAudit = cache(async (): Promise<SeoAuditRow[]> => {
  const supabase = await createClient()

  const [departments, clinics, news, pages, doctors] = await Promise.all([
    supabase
      .from("margaret_departments")
      .select("name, slug, seo_title, seo_description, banner_image_url")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("sort_order"),
    supabase
      .from("margaret_clinics")
      .select("name, slug, seo_title, seo_description, banner_image_url")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("sort_order"),
    supabase
      .from("margaret_news")
      .select("title, slug, seo_title, seo_description, featured_image_url")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase
      .from("margaret_pages")
      .select("title, slug, seo_title, seo_description, seo_og_image_url, featured_image_url")
      .is("deleted_at", null)
      .eq("status", "published"),
    supabase
      .from("margaret_doctors")
      .select("full_name, slug, photo_url")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("full_name"),
  ])

  return [
    ...(departments.data ?? []).map((d) => ({
      type: "Department",
      name: d.name,
      path: `/departments/${d.slug}`,
      editHref: "/admin/departments",
      seoTitle: d.seo_title,
      seoDescription: d.seo_description,
      hasImage: !!d.banner_image_url,
      inherits: false,
    })),
    ...(clinics.data ?? []).map((c) => ({
      type: "Clinic",
      name: c.name,
      path: `/clinics/${c.slug}`,
      editHref: "/admin/clinics",
      seoTitle: c.seo_title,
      seoDescription: c.seo_description,
      hasImage: !!c.banner_image_url,
      inherits: false,
    })),
    ...(news.data ?? []).map((n) => ({
      type: "News",
      name: n.title,
      path: `/news/${n.slug}`,
      editHref: "/admin/news",
      seoTitle: n.seo_title,
      seoDescription: n.seo_description,
      hasImage: !!n.featured_image_url,
      inherits: false,
    })),
    ...(pages.data ?? []).map((p) => ({
      type: "Page",
      name: p.title,
      path: `/${p.slug}`,
      editHref: "/admin/pages",
      seoTitle: p.seo_title,
      seoDescription: p.seo_description,
      hasImage: !!(p.seo_og_image_url || p.featured_image_url),
      inherits: false,
    })),
    ...(doctors.data ?? []).map((d) => ({
      type: "Doctor",
      name: d.full_name,
      path: `/doctors/${d.slug}`,
      editHref: "/admin/doctors",
      seoTitle: null,
      seoDescription: null,
      hasImage: !!d.photo_url,
      // margaret_doctors has no SEO columns; the profile page builds its title
      // and description from the name, specialisation and biography instead.
      inherits: true,
    })),
  ]
})
