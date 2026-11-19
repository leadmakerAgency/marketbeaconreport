import { NextResponse } from "next/server";
import { brevo, type Contact } from "@/lib/brevo";
import { DESK_LIST_IDS, LISTS, TEMPLATES } from "@/lib/config";
import { isSubscribed, welcomeIfNeeded } from "@/lib/subscribers";
import { manageToken, safeEqual } from "@/lib/tokens";
import { siteUrl } from "@/lib/site";

export const maxDuration = 60;
const DAY = 86_400_000;

async function all(listId: number, modifiedSince?: string) {
  const out: Contact[] = [];
  for (let offset = 0; offset < 20_000; offset += 500) {
    const res = await brevo.listContacts(listId, { limit: 500, offset, modifiedSince });
    out.push(...(res?.contacts ?? []));
    if ((res?.contacts?.length ?? 0) < 500) break;
  }
  return out;
}

/** Daily job (vercel.json): welcome backstop, confirmation reminder, and cleanup of stale unconfirmed signups. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const stats = { welcomed: 0, reminded: 0, deleted: 0, cleared: 0, errors: 0 };
  const now = Date.now();

  // 1. Welcome anyone confirmed in the last 3 days that the webhook missed.
  const since = new Date(now - 3 * DAY).toISOString();
  const seen = new Set<string>();
  for (const id of DESK_LIST_IDS) {
    for (const c of await all(id, since).catch(() => [])) {
      if (seen.has(c.email)) continue;
      seen.add(c.email);
      try { if (await welcomeIfNeeded(c)) stats.welcomed++; } catch { stats.errors++; }
    }
  }

  // 2. Pending list: remind once after 2 days, delete after 9, clear anyone who has since confirmed.
  for (const c of await all(LISTS.pending).catch(() => [])) {
    try {
      if (isSubscribed(c)) {
        await brevo.updateContact(c.email, { unlinkListIds: [LISTS.pending] });
        stats.cleared++;
        continue;
      }
      const signed = Date.parse(c.attributes?.SIGNUP_AT || c.createdAt || "");
      if (!signed) continue;
      const age = now - signed;
      if (age > 9 * DAY) {
        await brevo.deleteContact(c.email);
        stats.deleted++;
      } else if (age > 2 * DAY && c.attributes?.REMINDED !== true && !c.emailBlacklisted) {
        await brevo.sendTemplate({
          templateId: TEMPLATES.reminder,
          to: { email: c.email, name: c.attributes?.FIRSTNAME || undefined },
          params: { FIRSTNAME: c.attributes?.FIRSTNAME || "", RESEND_URL: `${siteUrl()}/confirm-again/${manageToken(c.email)}` },
          tags: ["confirm-reminder"],
        });
        await brevo.updateContact(c.email, { attributes: { REMINDED: true } });
        stats.reminded++;
      }
    } catch {
      stats.errors++;
    }
  }

  console.log("[cron]", stats);
  return NextResponse.json(stats);
}
