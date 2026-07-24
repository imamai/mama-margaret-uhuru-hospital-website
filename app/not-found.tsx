import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  )
}
