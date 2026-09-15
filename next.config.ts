import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sedsjjmjnikppfaecaya.supabase.co",
        // Covers public objects, signed URLs and the render endpoint. Still one
        // host and one project — the optimizer cannot be pointed anywhere else.
        pathname: "/storage/v1/**",
      },
    ],

    /**
     * Next 16's image optimizer refuses an upstream whose hostname resolves to
     * anything it considers a private address. On a connection behind DNS64 —
     * common on Kenyan mobile networks — Supabase's AAAA records come back as
     * 64:ff9b::ac40:95f6, which is the RFC 6052 NAT64 prefix wrapping the
     * perfectly public Cloudflare address 172.64.149.246. The guard does not
     * unwrap that prefix, so every image fails locally with "resolved to
     * private ip" while the same URL loads fine in a browser.
     *
     * Switched off in development only. Production does not sit behind DNS64,
     * has never hit this, and keeps the protection — turning it off globally
     * would weaken a real defence to fix a local networking artefact.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
