"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

function NavGroup({ group, pathname, onNavigate }: { group: AdminNavGroup; pathname: string; onNavigate?: () => void }) {
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
              onClick={onNavigate}
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

function SidebarNav({
  groups,
  pathname,
  onNavigate,
}: {
  groups: AdminNavGroup[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
      <Link
        href="/admin"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
          pathname === "/admin" && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <LayoutDashboard className="size-4" aria-hidden="true" />
        Dashboard
      </Link>

      {groups.map((group) => (
        <NavGroup key={group.key} group={group} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}

function SignOutForm() {
  return (
    <form action={signOut} className="border-t p-3">
      <button
        type="submit"
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Sign Out
      </button>
    </form>
  )
}

export function AdminSidebar({ groups, hospitalName }: { groups: AdminNavGroup[]; hospitalName: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-sidebar p-3 text-sidebar-foreground lg:hidden">
        <div>
          <p className="font-bold">{hospitalName}</p>
          <p className="text-xs text-muted-foreground">Admin CMS</p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open admin menu">
              <MenuIcon className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col bg-sidebar p-0 text-sidebar-foreground">
            <SheetHeader className="border-b">
              <SheetTitle>{hospitalName}</SheetTitle>
            </SheetHeader>
            <SidebarNav groups={groups} pathname={pathname} onNavigate={() => setOpen(false)} />
            <SignOutForm />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="border-b p-4">
          <p className="font-bold">{hospitalName}</p>
          <p className="text-xs text-muted-foreground">Admin CMS</p>
        </div>
        <SidebarNav groups={groups} pathname={pathname} />
        <SignOutForm />
      </aside>
    </>
  )
}
