"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Stethoscope,
  Truck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { signOut } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

export type AdminNavItem = {
  key: string
  label: string
  href: string
}

const MODULE_ICONS: Record<string, LucideIcon> = {
  departments: Building2,
  doctors: Stethoscope,
  careers: Briefcase,
  tenders: FileText,
  suppliers: Truck,
  homepage: LayoutTemplate,
  menus: MenuIcon,
  settings: SettingsIcon,
}

export function AdminSidebar({ items, hospitalName }: { items: AdminNavItem[]; hospitalName: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="border-b p-4">
        <p className="font-bold">{hospitalName}</p>
        <p className="text-xs text-muted-foreground">Admin CMS</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Admin">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
            pathname === "/admin" && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <LayoutDashboard className="size-4" aria-hidden="true" />
          Dashboard
        </Link>
        {items.map((item) => {
          const Icon = MODULE_ICONS[item.key] ?? LayoutDashboard
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
                active && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <form action={signOut} className="border-t p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign Out
        </button>
      </form>
    </aside>
  )
}
