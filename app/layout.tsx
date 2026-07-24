import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/data/settings";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_defaults.title || settings.hospital_name,
      template: `%s | ${settings.hospital_short_name || settings.hospital_name}`,
    },
    description: settings.seo_defaults.description || settings.mission,
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
    openGraph: {
      title: settings.seo_defaults.title || settings.hospital_name,
      description: settings.seo_defaults.description || settings.mission,
      siteName: settings.hospital_name,
      images: settings.seo_defaults.og_image ? [settings.seo_defaults.og_image] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_defaults.title || settings.hospital_name,
      description: settings.seo_defaults.description || settings.mission,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const { brand_colors } = settings;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Admin-editable brand palette (margaret_settings.brand_colors) overrides
            the shipped CSS defaults at runtime -- no redeploy required to rebrand. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--brand-primary:${brand_colors.primary};--brand-deep:${brand_colors.deep};--brand-accent:${brand_colors.accent};--brand-dark-grey:${brand_colors.dark_grey};--brand-light-grey:${brand_colors.light_grey};}`,
          }}
        />
        {settings.google_analytics_id ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.google_analytics_id}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
