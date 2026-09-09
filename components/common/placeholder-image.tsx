import { Award, Building2, CalendarDays, Handshake, ImageIcon, Stethoscope, Users } from "lucide-react"

import { cn } from "@/lib/utils"

export type PlaceholderKind = "building" | "doctor" | "people" | "award" | "event" | "partner" | "generic"

const ICONS: Record<PlaceholderKind, typeof Building2> = {
  building: Building2,
  doctor: Stethoscope,
  people: Users,
  award: Award,
  event: CalendarDays,
  partner: Handshake,
  generic: ImageIcon,
}

/**
 * Stand-in for a real photo/video that hasn't been uploaded yet. Real
 * *_url columns are null until the hospital's media team uploads assets
 * through the admin CMS -- this keeps every layout looking finished
 * in the meantime instead of showing a broken image icon.
 */
export function PlaceholderImage({
  kind = "generic",
  label,
  className,
}: {
  kind?: PlaceholderKind
  label?: string
  className?: string
}) {
  const Icon = ICONS[kind]

  return (
    <div
      role="img"
      aria-label={label ?? "Image coming soon"}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-brand-deep via-brand-primary to-brand-accent text-white transition-transform duration-500 ease-out group-hover/card:scale-105",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0px,rgba(255,255,255,0.09)_2px,transparent_2px,transparent_14px)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.3),transparent_60%)]"
      />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-white/15 shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
        <Icon className="size-7 opacity-95" aria-hidden="true" />
      </span>
      {label ? (
        <span className="relative px-4 text-center text-xs font-medium opacity-90">{label}</span>
      ) : null}
    </div>
  )
}
