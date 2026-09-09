import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AnimatedCounter } from "@/components/common/animated-counter"
import { getStats } from "@/lib/data/homepage"

export async function StatsBar() {
  const stats = await getStats()
  if (stats.length === 0) return null

  return (
    <section aria-label="Hospital statistics" className="border-y bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = (stat.icon && (Icons as unknown as Record<string, LucideIcon>)[stat.icon]) || Icons.Activity
          return (
            <div key={stat.id} className="group flex flex-col items-center text-center">
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-brand-deep/10 text-brand-deep transition-transform duration-300 ease-out group-hover:scale-110 dark:bg-brand-accent/10 dark:text-brand-accent">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
