import { SettingsForm } from "@/components/admin/settings-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  updateBrandingSettings,
  updateGeneralSettings,
  updateIntegrationSettings,
  updateSeoSettings,
  updateSocialSettings,
} from "@/lib/actions/admin/settings"
import { getSiteSettings } from "@/lib/data/settings"

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Changes here update <code className="rounded bg-muted px-1.5 py-0.5">margaret_settings</code> and take
          effect across the site immediately -- no redeploy required.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-6">
          <SettingsForm
            action={updateGeneralSettings}
            fields={[
              { name: "hospital_name", label: "Hospital name", required: true, defaultValue: settings.hospital_name },
              { name: "hospital_short_name", label: "Short name", required: true, defaultValue: settings.hospital_short_name },
              { name: "mission", label: "Mission statement", type: "textarea", defaultValue: settings.mission },
              { name: "vision", label: "Vision statement", type: "textarea", defaultValue: settings.vision },
              { name: "emergency_phone", label: "Emergency phone", required: true, defaultValue: settings.emergency_phone },
              { name: "ambulance_phone", label: "Ambulance phone", defaultValue: settings.ambulance_phone },
              { name: "address", label: "Address", defaultValue: settings.address },
            ]}
          />
        </TabsContent>

        <TabsContent value="branding" className="pt-6">
          <SettingsForm
            action={updateBrandingSettings}
            fields={[
              { name: "primary", label: "Primary color", defaultValue: settings.brand_colors.primary },
              { name: "deep", label: "Deep color", defaultValue: settings.brand_colors.deep },
              { name: "accent", label: "Accent color", defaultValue: settings.brand_colors.accent },
              { name: "dark_grey", label: "Dark grey", defaultValue: settings.brand_colors.dark_grey },
              { name: "light_grey", label: "Light grey", defaultValue: settings.brand_colors.light_grey },
              {
                name: "logo_url",
                label: "Logo",
                type: "image",
                hint: "Upload a new logo image or paste an image URL. Leave both blank to keep the current logo.",
                defaultValue: settings.logo_url ?? "",
              },
              {
                name: "favicon_url",
                label: "Favicon",
                type: "image",
                hint: "Upload a square favicon image or paste an image URL. Leave both blank to keep the current favicon.",
                defaultValue: settings.favicon_url ?? "",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="social" className="pt-6">
          <SettingsForm
            action={updateSocialSettings}
            fields={[
              { name: "facebook", label: "Facebook URL", defaultValue: settings.social_links.facebook ?? "" },
              { name: "twitter", label: "Twitter / X URL", defaultValue: settings.social_links.twitter ?? "" },
              { name: "instagram", label: "Instagram URL", defaultValue: settings.social_links.instagram ?? "" },
              { name: "linkedin", label: "LinkedIn URL", defaultValue: settings.social_links.linkedin ?? "" },
              { name: "youtube", label: "YouTube URL", defaultValue: settings.social_links.youtube ?? "" },
            ]}
          />
        </TabsContent>

        <TabsContent value="seo" className="pt-6">
          <SettingsForm
            action={updateSeoSettings}
            fields={[
              { name: "title", label: "Default meta title", defaultValue: settings.seo_defaults.title },
              { name: "description", label: "Default meta description", type: "textarea", defaultValue: settings.seo_defaults.description },
              { name: "og_image", label: "Default Open Graph image URL", defaultValue: settings.seo_defaults.og_image },
            ]}
          />
        </TabsContent>

        <TabsContent value="integrations" className="pt-6">
          <SettingsForm
            action={updateIntegrationSettings}
            fields={[
              { name: "google_analytics_id", label: "Google Analytics ID", defaultValue: settings.google_analytics_id },
              { name: "google_maps_embed_url", label: "Google Maps embed URL", defaultValue: settings.google_maps_embed_url },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
