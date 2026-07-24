import { redirect } from "next/navigation"
import {
  Briefcase,
  Building2,
  FileText,
  LayoutTemplate,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Stethoscope,
  Truck,
} from "lucide-react"

import { AdminSidebar, type AdminNavItem } from "@/components/admin/admin-sidebar"
import { getCurrentUser, getMyPermissions, isSuperAdmin } from "@/lib/auth/permissions"
import { getSiteSettings } from "@/lib/data/settings"

const MODULES: (AdminNavItem & { permissionPrefix: string })[] = [
  { key: "departments", label: "Departments", href: "/admin/departments", icon: Building2, permissionPrefix: "departments" },
  { key: "doctors", label: "Doctors", href: "/admin/doctors", icon: Stethoscope, permissionPrefix: "doctors" },
  { key: "careers", label: "Careers / Jobs", href: "/admin/jobs", icon: Briefcase, permissionPrefix: "careers" },
  { key: "tenders", label: "Tenders", href: "/admin/tenders", icon: FileText, permissionPrefix: "tenders" },
  { key: "suppliers", label: "Suppliers", href: "/admin/suppliers", icon: Truck, permissionPrefix: "tenders" },
  { key: "homepage", label: "Homepage Builder", href: "/admin/homepage", icon: LayoutTemplate, permissionPrefix: "homepage" },
  { key: "menus", label: "Menus", href: "/admin/menus", icon: MenuIcon, permissionPrefix: "menus" },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: SettingsIcon, permissionPrefix: "settings" },
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
