"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as = "h2",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
  /**
   * The heading level. Defaults to h2, which is right for a section inside a
   * page. Pass "h1" where this IS the page's title -- every listing page used
   * this component for its main heading and so shipped with no h1 at all,
   * which leaves a crawler no statement of what the page is about.
   */
  as?: "h1" | "h2"
}) {
  const Heading = as
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left ml-0",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</Heading>
      {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
    </motion.div>
  )
}
