import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { SiteStatusNotice } from "@/components/layout/site-status-notice"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { JsonLd } from "@/components/seo/json-ld"
import { listDepartments } from "@/lib/data/departments"
import { getSiteSettings } from "@/lib/data/settings"
import { hospitalJsonLd, websiteJsonLd } from "@/lib/seo"
import { getPlatformStatus } from "@/lib/website-status"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const platform = await getPlatformStatus();
  if (platform.status !== "active") {
    return <SiteStatusNotice {...platform} />;
  }

  // The Hospital entity belongs on every public page, not just the homepage:
  // patients land on a department or a doctor from search far more often than
  // on "/", and that landing page is where Google reads who the hospital is.
  // Both reads are cache()-wrapped, so this costs nothing extra per request.
  const [settings, departments] = await Promise.all([getSiteSettings(), listDepartments()])

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={hospitalJsonLd(settings, departments.map((d) => d.name))} />
      <JsonLd data={websiteJsonLd(settings)} />
      <Header />
      <AnnouncementBar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
