import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@/styles/globals.css";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE.name} | Market briefings by email`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0A2A8C", colorScheme: "light", viewportFit: "cover" };

/** Google tag (Google Analytics via Tag Manager container). Loaded once, in the <head> of every page. */
const GOOGLE_TAG_ID = "GTM-TK922W5Q";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_ID}`} />
        <script
          id="google-tag"
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());",
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
