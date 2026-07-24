import Link from "next/link"

import { HeroCarousel } from "@/components/sections/hero-carousel"
import { Button } from "@/components/ui/button"
import { getHeroSlides } from "@/lib/data/homepage"
import { getSiteSettings } from "@/lib/data/settings"

export async function Hero() {
  const [slides, settings] = await Promise.all([getHeroSlides(), getSiteSettings()])

  if (slides.length === 0) {
    return (
      <section className="relative flex min-h-[28rem] items-center bg-gradient-to-br from-brand-deep to-brand-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            {settings.hospital_name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{settings.mission}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/appointments">Book an Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white">
              <Link href="/departments">Explore Departments</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return <HeroCarousel slides={slides} />
}
