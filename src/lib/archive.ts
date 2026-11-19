import "server-only";
import { brevo, brevoConfigured, type Campaign } from "./brevo";
import { ARCHIVE_TAGS } from "./config";
import { POSTS } from "./posts";

/** Launch posts held in code until the CMS is connected. */
function staticItems(tag?: string): ArchiveItem[] {
  return POSTS.filter((p) => !tag || p.tag === tag).map((p, i) => ({ id: -(i + 1), title: p.title, preview: p.preview, tag: p.tag, label: ARCHIVE_TAGS[p.tag], date: p.date, href: `/briefings/${p.slug}` }));
}

const byDate = (a: ArchiveItem, b: ArchiveItem) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0);

export type ArchiveItem = { id: number; title: string; preview: string; tag: string; label: string; date: string; href: string };

/** Blog URL for a briefing: /briefings/123-chip-stocks-lead-futures. The number is what's looked up; the words are for readers and Google. */
export function briefingPath(id: number, title: string) {
  const words = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().split(/[\s-]+/).slice(0, 10).join("-");
  return `/briefings/${id}${words ? `-${words}` : ""}`;
}

/** Sent Brevo campaigns tagged with a desk tag become the public web archive. Partner offers are never listed. */
export async function archive(tag?: string): Promise<ArchiveItem[]> {
  return [...(await sentArchive(tag)), ...staticItems(tag)].sort(byDate);
}

async function sentArchive(tag?: string): Promise<ArchiveItem[]> {
  if (!brevoConfigured()) return [];
  try {
    const items: ArchiveItem[] = [];
    for (let offset = 0; offset < 500; offset += 100) {
      const res = await brevo.sentCampaigns({ limit: 100, offset });
      const list = res?.campaigns ?? [];
      for (const c of list) {
        const t = (c.tag || "").toLowerCase();
        if (!ARCHIVE_TAGS[t] || (tag && t !== tag)) continue;
        const title = c.subject.replace(/^(FLASH:\s*)/i, "");
        items.push({ id: c.id, title, preview: c.previewText || "", tag: t, label: ARCHIVE_TAGS[t], date: c.sentDate || c.scheduledAt || c.createdAt || "", href: briefingPath(c.id, title) });
      }
      if (list.length < 100) break;
    }
    return items;
  } catch (err) {
    console.error("[archive]", err);
    return [];
  }
}

/** Web version of a sent issue with personal merge tags and subscriber-only links removed. */
export async function issue(id: number): Promise<(Campaign & { label: string; webHtml: string }) | null> {
  if (!brevoConfigured() || !Number.isInteger(id)) return null;
  const c = await brevo.campaign(id).catch(() => null);
  const t = (c?.tag || "").toLowerCase();
  if (!c || c.status !== "sent" || !ARCHIVE_TAGS[t]) return null;
  const webHtml = (c.htmlContent || "")
    .replace(/\{\{\s*contact\.FIRSTNAME[^}]*\}\}/g, "there")
    .replace(/href="[^"]*\{\{[^"]*\}\}[^"]*"/g, 'href="/#subscribe" target="_top"')
    .replace(/\{\{[^}]*\}\}/g, "");
  return { ...c, label: ARCHIVE_TAGS[t], webHtml };
}

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "America/New_York", ...opts }).format(new Date(iso));
}
