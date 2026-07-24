import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon, YouTubeIcon } from "@/components/common/social-icons"
import { getFooterNav } from "@/lib/data/menus"
import { getFooterSections } from "@/lib/data/footer"
import { getInsurancePartners } from "@/lib/data/homepage"
import { getSiteSettings } from "@/lib/data/settings"

const SOCIAL_ICONS: Record<string, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
}

export async function Footer() {
  const [settings, footerNav, footerSections, insurancePartners] = await Promise.all([
    getSiteSettings(),
    getFooterNav(),
    getFooterSections(),
    getInsurancePartners(),
  ])

  const socialEntries = Object.entries(settings.social_links).filter(([, url]) => url)

  return (
    <footer className="border-t bg-brand-dark-grey text-white/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-bold text-white">{settings.hospital_name}</p>
          <p className="text-sm text-white/70">{settings.mission}</p>
          {socialEntries.length > 0 ? (
            <div className="flex gap-3 pt-2">
              {socialEntries.map(([platform, url]) => {
                const Icon = SOCIAL_ICONS[platform] ?? Mail
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Quick Links</p>
          <ul className="space-y-2 text-sm text-white/70">
            {footerNav.map((item) => (
              <li key={item.id}>
                <Link href={item.url ?? "#"} className="hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {footerSections.map((section) => {
          const content = section.content as { body?: string; links?: { label: string; url: string }[] }
          return (
            <div key={section.id}>
              <p className="mb-3 text-sm font-semibold text-white">{section.title}</p>
              {content?.body ? <p className="text-sm text-white/70">{content.body}</p> : null}
              {content?.links?.length ? (
                <ul className="space-y-2 text-sm text-white/70">
                  {content.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} className="hover:text-white hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {settings.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${settings.emergency_phone}`} className="hover:text-white hover:underline">
                {settings.emergency_phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {insurancePartners.length > 0 ? (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <p className="mb-4 text-xs font-semibold tracking-wide text-white/60 uppercase">Insurance Partners</p>
            <div className="flex flex-wrap items-center gap-6 opacity-80">
              {insurancePartners.map((partner) => (
                <span key={partner.id} className="text-sm font-medium text-white/70">
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {settings.hospital_name}. All rights reserved.
          </p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}
