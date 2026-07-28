"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  GalleryHorizontal,
  Handshake,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  LogOut,
  Megaphone,
  Menu as MenuIcon,
  MessageSquareQuote,
  Newspaper,
  PanelBottom,
  Phone,
  Settings as SettingsIcon,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Tags,
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

export type AdminNavGroup = {
  key: string
  label: string
  items: AdminNavItem[]
}

const MODULE_ICONS: Record<string, LucideIcon> = {
  departments: Building2,
  doctors: Stethoscope,
  "service-categories": Tags,
  services: ClipboardList,
  clinics: HeartPulse,
  facilities: Hospital,
  pages: FileText,
  news: Newspaper,
  "news-categories": Tags,
  "press-releases": Megaphone,
  events: CalendarDays,
  announcements: AlertTriangle,
  homepage: LayoutTemplate,
  "hero-slides": GalleryHorizontal,
  stats: BarChart3,
  testimonials: MessageSquareQuote,
  gallery: GalleryHorizontal,
  awards: Award,
  careers: Briefcase,
  tenders: FileText,
  suppliers: Truck,
  "supplier-categories": Layers,
  research: FlaskConical,
  "clinical-trials": Syringe,
  "library-items": BookOpen,
  partners: Handshake,
  "insurance-partners": ShieldCheck,
  contacts: Phone,
  menus: MenuIcon,
  "footer-sections": PanelBottom,
  downloads: Download,
  settings: SettingsIcon,
}

function NavGroup({ group, pathname }: { group: AdminNavGroup; pathname: string }) {
  const hasActiveItem = group.items.some((item) => pathname.startsWith(item.href))

  return (
    <details className="group/details" open={hasActiveItem}>
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground">
        {group.label}
        <span className="text-[10px] transition-transform group-open/details:rotate-90">▶</span>
      </summary>
      <div className="space-y-0.5 pb-1">
        {group.items.map((item) => {
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
      </div>
    </details>
  )
}

export function AdminSidebar({ groups, hospitalName }: { groups: AdminNavGroup[]; hospitalName: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="border-b p-4">
        <p className="font-bold">{hospitalName}</p>
        <p className="text-xs text-muted-foreground">Admin CMS</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
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

        {groups.map((group) => (
          <NavGroup key={group.key} group={group} pathname={pathname} />
        ))}
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
