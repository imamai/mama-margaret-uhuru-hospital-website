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
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-deep via-brand-primary to-brand-accent text-white",
        className
      )}
    >
      <Icon className="size-8 opacity-90" aria-hidden="true" />
      {label ? (
        <span className="px-4 text-center text-xs font-medium opacity-90">{label}</span>
      ) : null}
    </div>
  )
}
