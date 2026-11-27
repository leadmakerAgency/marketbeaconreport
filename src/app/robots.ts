import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const PRIVATE = ["/api/", "/manage/", "/unsubscribed", "/confirm-again/", "/still-reading/", "/subscribe/", "/welcome"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // Named so it is explicit that search and AI answer engines may read and cite the briefings.
      { userAgent: ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "DuckAssistBot"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
