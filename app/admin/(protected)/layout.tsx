import { redirect } from "next/navigation"

import { AdminSidebar, type AdminNavItem } from "@/components/admin/admin-sidebar"
import { getCurrentUser, getMyPermissions, isSuperAdmin } from "@/lib/auth/permissions"
import { getSiteSettings } from "@/lib/data/settings"

const MODULES: (AdminNavItem & { permissionPrefix: string })[] = [
  { key: "departments", label: "Departments", href: "/admin/departments", permissionPrefix: "departments" },
  { key: "doctors", label: "Doctors", href: "/admin/doctors", permissionPrefix: "doctors" },
  { key: "careers", label: "Careers / Jobs", href: "/admin/jobs", permissionPrefix: "careers" },
  { key: "tenders", label: "Tenders", href: "/admin/tenders", permissionPrefix: "tenders" },
  { key: "suppliers", label: "Suppliers", href: "/admin/suppliers", permissionPrefix: "tenders" },
  { key: "homepage", label: "Homepage Builder", href: "/admin/homepage", permissionPrefix: "homepage" },
  { key: "menus", label: "Menus", href: "/admin/menus", permissionPrefix: "menus" },
  { key: "settings", label: "Settings", href: "/admin/settings", permissionPrefix: "settings" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  const [permissions, superAdmin, settings] = await Promise.all([
    getMyPermissions(),
    isSuperAdmin(),
    getSiteSettings(),
  ])

  const visibleModules = superAdmin
    ? MODULES
    : MODULES.filter((m) => permissions.includes(`${m.permissionPrefix}.view`))

  return (
    <div className="flex min-h-screen">
      <AdminSidebar items={visibleModules} hospitalName={settings.hospital_short_name} />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-8">{children}</main>
    </div>
  )
}
