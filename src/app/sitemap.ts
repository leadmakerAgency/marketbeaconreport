import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { DESKS } from "@/lib/config";
import { archive } from "@/lib/archive";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const statics = ["", "/archive", "/about", "/advertise", "/faq", "/contact", "/disclaimer", "/sponsorship-policy", "/privacy", "/terms", "/impressum"];
  const issues = await archive().catch(() => []);
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.6 })),
    ...DESKS.map((d) => ({ url: `${base}/desks/${d.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...issues.map((i) => ({ url: `${base}${i.href}`, lastModified: i.date ? new Date(i.date) : undefined, priority: 0.7 })),
  ];
}
