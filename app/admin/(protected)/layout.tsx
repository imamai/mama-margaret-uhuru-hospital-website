import { redirect } from "next/navigation"

import { AdminSidebar, type AdminNavGroup } from "@/components/admin/admin-sidebar"
import { getCurrentUser, getMyPermissions, isSuperAdmin } from "@/lib/auth/permissions"
import { getSiteSettings } from "@/lib/data/settings"

const GROUPS: { key: string; label: string; items: { key: string; label: string; href: string; permissionPrefix: string }[] }[] = [
  {
    key: "hospital",
    label: "Hospital",
    items: [
      { key: "departments", label: "Departments", href: "/admin/departments", permissionPrefix: "departments" },
      { key: "doctors", label: "Doctors", href: "/admin/doctors", permissionPrefix: "doctors" },
      { key: "service-categories", label: "Service Categories", href: "/admin/service-categories", permissionPrefix: "services" },
      { key: "services", label: "Services", href: "/admin/services", permissionPrefix: "services" },
      { key: "clinics", label: "Clinics", href: "/admin/clinics", permissionPrefix: "clinics" },
      { key: "facilities", label: "Facilities", href: "/admin/facilities", permissionPrefix: "facilities" },
    ],
  },
  {
    key: "content",
    label: "Content",
    items: [
      { key: "pages", label: "Pages", href: "/admin/pages", permissionPrefix: "pages" },
      { key: "news", label: "News", href: "/admin/news", permissionPrefix: "news" },
      { key: "news-categories", label: "News Categories", href: "/admin/news-categories", permissionPrefix: "news" },
      { key: "press-releases", label: "Press Releases", href: "/admin/press-releases", permissionPrefix: "media" },
      { key: "events", label: "Events", href: "/admin/events", permissionPrefix: "events" },
      { key: "announcements", label: "Announcements", href: "/admin/announcements", permissionPrefix: "announcements" },
    ],
  },
  {
    key: "homepage",
    label: "Homepage",
    items: [
      { key: "homepage", label: "Homepage Builder", href: "/admin/homepage", permissionPrefix: "homepage" },
      { key: "hero-slides", label: "Hero Slides", href: "/admin/hero-slides", permissionPrefix: "hero_slides" },
      { key: "stats", label: "Stats", href: "/admin/stats", permissionPrefix: "homepage" },
      { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", permissionPrefix: "testimonials" },
      { key: "gallery", label: "Gallery", href: "/admin/gallery", permissionPrefix: "gallery" },
      { key: "awards", label: "Awards", href: "/admin/awards", permissionPrefix: "awards" },
    ],
  },
  {
    key: "careers-procurement",
    label: "Careers & Procurement",
    items: [
      { key: "careers", label: "Careers / Jobs", href: "/admin/jobs", permissionPrefix: "careers" },
      { key: "tenders", label: "Tenders", href: "/admin/tenders", permissionPrefix: "tenders" },
      { key: "suppliers", label: "Suppliers", href: "/admin/suppliers", permissionPrefix: "tenders" },
      { key: "supplier-categories", label: "Supplier Categories", href: "/admin/supplier-categories", permissionPrefix: "tenders" },
    ],
  },
  {
    key: "research",
    label: "Research & Library",
    items: [
      { key: "research", label: "Research", href: "/admin/research", permissionPrefix: "research" },
      { key: "clinical-trials", label: "Clinical Trials", href: "/admin/clinical-trials", permissionPrefix: "research" },
      { key: "library-items", label: "Library", href: "/admin/library-items", permissionPrefix: "library" },
    ],
  },
  {
    key: "partners",
    label: "Partners & Contacts",
    items: [
      { key: "partners", label: "Partners", href: "/admin/partners", permissionPrefix: "partners" },
      { key: "insurance-partners", label: "Insurance Partners", href: "/admin/insurance-partners", permissionPrefix: "partners" },
      { key: "contacts", label: "Contacts", href: "/admin/contacts", permissionPrefix: "contacts" },
    ],
  },
  {
    key: "site",
    label: "Site",
    items: [
      { key: "menus", label: "Menus", href: "/admin/menus", permissionPrefix: "menus" },
      { key: "footer-sections", label: "Footer Sections", href: "/admin/footer-sections", permissionPrefix: "footer" },
      { key: "downloads", label: "Downloads", href: "/admin/downloads", permissionPrefix: "downloads" },
      { key: "settings", label: "Settings", href: "/admin/settings", permissionPrefix: "settings" },
    ],
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  const [permissions, superAdmin, settings] = await Promise.all([
    getMyPermissions(),
    isSuperAdmin(),
    getSiteSettings(),
  ])

  const visibleGroups: AdminNavGroup[] = GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    items: superAdmin ? group.items : group.items.filter((m) => permissions.includes(`${m.permissionPrefix}.view`)),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar groups={visibleGroups} hospitalName={settings.hospital_short_name} />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-8">{children}</main>
    </div>
  )
}
