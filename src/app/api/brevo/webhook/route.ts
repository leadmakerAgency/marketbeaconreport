import { NextResponse } from "next/server";
import { brevo } from "@/lib/brevo";
import { DESK_LIST_IDS } from "@/lib/config";
import { sendGoodbye, welcomeIfNeeded } from "@/lib/subscribers";
import { safeEqual } from "@/lib/tokens";

// Brevo marketing webhook: events listAddition and unsubscribed. URL carries ?key=BREVO_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const secret = process.env.BREVO_WEBHOOK_SECRET;
  const key = new URL(req.url).searchParams.get("key") || "";
  if (!secret || !safeEqual(key, secret)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const payload = await req.json().catch(() => null);
  const events: any[] = Array.isArray(payload) ? payload : payload ? [payload] : [];
  for (const e of events) {
    const email = String(e?.email || "").toLowerCase();
    if (!email) continue;
    try {
      if (e.event === "list_addition" || e.event === "listAddition") {
        const lists: number[] = (e.list_id || e.listIds || []).map(Number);
        if (lists.length && !lists.some((id) => DESK_LIST_IDS.includes(id))) continue;
        const c = await brevo.getContact(email);
        if (c) await welcomeIfNeeded(c);
      } else if (e.event === "unsubscribed") {
        const c = await brevo.getContact(email);
        // Only after a full unsubscribe (Brevo's own unsubscribe link), not a single-list change.
        if (c?.emailBlacklisted) await sendGoodbye(email, c.attributes?.FIRSTNAME);
      }
    } catch (err) {
      console.error("[webhook]", e?.event, err);
    }
  }
  return NextResponse.json({ ok: true });
}
