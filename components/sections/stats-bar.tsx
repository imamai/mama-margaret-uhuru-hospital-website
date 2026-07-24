import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { getStats } from "@/lib/data/homepage"

export async function StatsBar() {
  const stats = await getStats()
  if (stats.length === 0) return null

  return (
    <section aria-label="Hospital statistics" className="border-y bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = (stat.icon && (Icons as unknown as Record<string, LucideIcon>)[stat.icon]) || Icons.Activity
          return (
            <div key={stat.id} className="flex flex-col items-center text-center">
              <Icon className="mb-2 size-6 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
              <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
