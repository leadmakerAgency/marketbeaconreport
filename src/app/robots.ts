import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/manage/", "/unsubscribed", "/confirm-again/", "/still-reading/", "/subscribe/", "/welcome"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
