import Link from "next/link"
import Image from "next/image"

import { EmergencyBar } from "@/components/layout/emergency-bar"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { getPrimaryNav } from "@/lib/data/menus"
import { getSiteSettings } from "@/lib/data/settings"

export async function Header() {
  const [settings, primaryNav] = await Promise.all([getSiteSettings(), getPrimaryNav()])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <EmergencyBar emergencyPhone={settings.emergency_phone} ambulancePhone={settings.ambulance_phone} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.hospital_name} width={36} height={36} className="rounded" />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-deep text-sm font-bold text-white">
              {settings.hospital_short_name.slice(0, 3)}
            </span>
          )}
          <span className="hidden text-sm leading-tight sm:block">
            <span className="block text-base font-bold text-foreground">{settings.hospital_short_name}</span>
            <span className="block text-xs font-normal text-muted-foreground">{settings.hospital_name}</span>
          </span>
        </Link>

        <NavigationMenu viewport={false} className="hidden max-w-none lg:flex" aria-label="Primary">
          <NavigationMenuList>
            {primaryNav.map((item) =>
              item.children.length > 0 ? (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuTrigger className="bg-transparent text-foreground/80">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <Link href={child.url ?? "#"}>{child.label}</Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.url ?? "#"}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {null}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/appointments">Book Appointment</Link>
          </Button>
          {null}
        </div>
      </div>
    </header>
  )
}
