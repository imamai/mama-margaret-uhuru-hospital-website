import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type BrandColors = {
  primary: string
  deep: string
  accent: string
  dark_grey: string
  light_grey: string
}

export type SiteSettings = {
  hospital_name: string
  hospital_short_name: string
  mission: string
  vision: string
  brand_colors: BrandColors
  logo_url: string | null
  favicon_url: string | null
  emergency_phone: string
  ambulance_phone: string
  address: string
  social_links: Record<string, string>
  seo_defaults: { title: string; description: string; og_image: string }
  google_analytics_id: string
  google_maps_embed_url: string
}

// next.config.ts only whitelists this host for next/image; anything else (e.g. a
// stale Google Drive link from before logo_url/favicon_url became file uploads)
// would crash the app at render time, so drop it here instead.
const ALLOWED_ASSET_HOST_PREFIX = "https://sedsjjmjnikppfaecaya.supabase.co/storage/v1/object/public/"

function sanitizeAssetUrl(url: string | null | undefined): string | null {
  return url && url.startsWith(ALLOWED_ASSET_HOST_PREFIX) ? url : null
}

const DEFAULTS: SiteSettings = {
  hospital_name: "Mama Margaret Uhuru Hospital",
  hospital_short_name: "MMUH",
  mission: "",
  vision: "",
  brand_colors: {
    primary: "#1496E8",
    deep: "#0D5EA6",
    accent: "#19B5FE",
    dark_grey: "#3E4348",
    light_grey: "#F6F7F9",
  },
  logo_url: null,
  favicon_url: null,
  emergency_phone: "999",
  ambulance_phone: "",
  address: "",
  social_links: {},
  seo_defaults: { title: "Mama Margaret Uhuru Hospital", description: "", og_image: "" },
  google_analytics_id: "",
  google_maps_embed_url: "",
}

/**
 * Reads all rows from margaret_settings (publicly readable key/value store)
 * and folds them into a single typed object so the rest of the app never
 * touches the raw rows directly.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient()
  const { data } = await supabase.from("margaret_settings").select("setting_key, setting_value")

  const settings = { ...DEFAULTS }
  for (const row of data ?? []) {
    const key = row.setting_key as keyof SiteSettings
    if (key in settings && row.setting_value !== null) {
      // @ts-expect-error -- jsonb value shape matches the settings key at runtime
      settings[key] = row.setting_value
    }
  }
  settings.logo_url = sanitizeAssetUrl(settings.logo_url)
  settings.favicon_url = sanitizeAssetUrl(settings.favicon_url)
  return settings
})
