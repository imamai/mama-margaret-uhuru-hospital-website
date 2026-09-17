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
import { DEFAULT_BRAND_COLORS } from "@/lib/brand-defaults"

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
              { name: "ambulance_phone", label: "Ambulance phone", defaultValue: settings.ambulance_phone, hint: "A number, or text such as Coming soon — text is shown without a call link." },
              { name: "general_phone", label: "Reception phone", defaultValue: settings.general_phone },
              { name: "email", label: "General email", defaultValue: settings.email },
              { name: "address", label: "Address", defaultValue: settings.address },
            ]}
          />
        </TabsContent>

        <TabsContent value="branding" className="pt-6">
          <SettingsForm
            action={updateBrandingSettings}
            defaults={{ ...DEFAULT_BRAND_COLORS }}
            restoreLabel="Restore default colours"
            fields={[
              {
                name: "primary",
                label: "Primary",
                type: "color",
                defaultValue: settings.brand_colors.primary,
                hint: "The main brand colour. Used for links and highlights.",
              },
              {
                name: "deep",
                label: "Deep",
                type: "color",
                defaultValue: settings.brand_colors.deep,
                hint: "The darker shade: buttons, headings and the emergency bar. This is the colour most of the site reads as.",
              },
              {
                name: "accent",
                label: "Accent",
                type: "color",
                defaultValue: settings.brand_colors.accent,
                hint: "The lighter shade, used sparingly for emphasis and in dark mode.",
              },
              {
                name: "dark_grey",
                label: "Text",
                type: "color",
                defaultValue: settings.brand_colors.dark_grey,
                hint: "Body text and the footer background. Keep it dark enough to read comfortably.",
              },
              {
                name: "light_grey",
                label: "Section background",
                type: "color",
                defaultValue: settings.brand_colors.light_grey,
                hint: "The tint behind alternating sections. Keep it very close to white.",
              },
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
