import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Home, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { listDepartments } from "@/lib/data/departments"
import { getSiteSettings } from "@/lib/data/settings"

// Next returns a real 404 status for this route; the noindex is belt and
// braces for the case where a 404 is linked from somewhere external.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: "/departments", label: "Departments" },
  { href: "/clinics", label: "Clinics" },
  { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" },
  { href: "/patients", label: "Patient information" },
  { href: "/contact", label: "Contact" },
]

/**
 * Lives outside the (public) group, so it renders without the site header and
 * footer. A patient who lands here from a stale link would otherwise have no
 * way onward at all, so the route offers its own way back -- including the
 * emergency number, which is the one thing someone on a hospital site may
 * urgently need.
 */
export default async function NotFound() {
  const [settings, departments] = await Promise.all([getSiteSettings(), listDepartments()])

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-20">
      <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Here is where most people go next.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" aria-hidden="true" /> Back to homepage
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/appointments">
            Book an appointment <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        {settings.emergency_phone ? (
          <Button asChild variant="outline">
            <a href={`tel:${settings.emergency_phone.replace(/\s/g, "")}`}>
              <Phone className="size-4" aria-hidden="true" /> Emergency: {settings.emergency_phone}
            </a>
          </Button>
        ) : null}
      </div>

      <nav aria-label="Main sections" className="mt-10">
        <h2 className="text-sm font-semibold">Main sections</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-muted"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {departments.length > 0 ? (
        <nav aria-label="Departments" className="mt-8">
          <h2 className="text-sm font-semibold">Popular departments</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {departments.slice(0, 8).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/departments/${d.slug}`}
                  className="inline-flex rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
