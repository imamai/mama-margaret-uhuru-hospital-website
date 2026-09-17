import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

/**
 * What crawlers may fetch.
 *
 * Disallow stops crawling, not indexing -- a URL linked from elsewhere can
 * still appear in results without ever being fetched. Every private route
 * below therefore also carries `robots: { index: false }` in its own metadata;
 * this file is the first line of defence, not the only one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",          // control centre, including its login and reset flows
        "/api",            // internal endpoints
        "/suppliers/login",
        "/suppliers/dashboard", // a supplier's own tender documents and bids
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
