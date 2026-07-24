"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { MenuItem } from "@/lib/data/menus"

export function MobileNav({ items, hospitalName }: { items: MenuItem[]; hospitalName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{hospitalName}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="Mobile">
          {items.map((item) => (
            <div key={item.id}>
              {item.url ? (
                <SheetClose asChild>
                  <Link
                    href={item.url}
                    className="block rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ) : (
                <span className="block px-3 py-2.5 text-sm font-semibold text-muted-foreground">
                  {item.label}
                </span>
              )}
              {item.children.length > 0 ? (
                <div className="ml-3 flex flex-col gap-1 border-l pl-3">
                  {item.children.map((child) => (
                    <SheetClose asChild key={child.id}>
                      <Link
                        href={child.url ?? "#"}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
