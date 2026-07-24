import type { MetadataRoute } from "next"

import { getSiteSettings } from "@/lib/data/settings"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()

  return {
    name: settings.hospital_name,
    short_name: settings.hospital_short_name,
    description: settings.seo_defaults.description || settings.mission,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: settings.brand_colors.deep,
    icons: settings.favicon_url
      ? [{ src: settings.favicon_url, sizes: "any", type: "image/png" }]
      : [],
  }
}
