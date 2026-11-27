// Deployed by Vercel from GitHub (leadmakerAgency/marketbeaconreport): every push to main goes to production.
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/**/*": ["./src/assets/fonts/**/*", "./content/posts/**/*"],
    // Post pages read each photo's size from the file.
    "/briefings/**/*": ["./public/images/posts/**/*"],
  },
  async redirects() {
    return [
      { source: "/issues/:id", destination: "/briefings/:id", permanent: true },
      // Sveltia CMS lives in public/admin/.
      { source: "/admin", destination: "/admin/index.html", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
