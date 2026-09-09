"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}) {
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
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
    </motion.div>
  )
}
