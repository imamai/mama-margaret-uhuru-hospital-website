import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { SiteStatusNotice } from "@/components/layout/site-status-notice"
import { getPlatformStatus } from "@/lib/website-status"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const platform = await getPlatformStatus();
  if (platform.status !== "active") {
    return <SiteStatusNotice {...platform} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
