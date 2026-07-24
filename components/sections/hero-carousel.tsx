"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PlaceholderImage } from "@/components/common/placeholder-image"

export type HeroSlide = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  cta_label: string | null
  cta_url: string | null
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const slide = slides[index]

  useEffect(() => {
    if (slides.length < 2 || reduceMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(timer)
  }, [slides.length, reduceMotion])

  if (!slide) return null

  return (
    <section
      className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-brand-dark-grey text-white sm:min-h-[38rem]"
      aria-roledescription="carousel"
      aria-label="Hospital highlights"
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7 }}
            className="absolute inset-0"
          >
            {slide.image_url ? (
              <Image src={slide.image_url} alt="" fill priority className="object-cover" />
            ) : (
              <PlaceholderImage kind="building" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{slide.title}</h1>
            {slide.subtitle ? <p className="mt-4 text-lg text-white/85 sm:text-xl">{slide.subtitle}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {slide.cta_url && slide.cta_label ? (
                <Button asChild size="lg">
                  <Link href={slide.cta_url}>{slide.cta_label}</Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                <Link href="/appointments">Book an Appointment</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-4 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition-colors hover:bg-white/20 sm:block"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition-colors hover:bg-white/20 sm:block"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
