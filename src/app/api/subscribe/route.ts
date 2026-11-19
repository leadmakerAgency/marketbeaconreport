import { NextResponse } from "next/server";
import { z } from "zod";
import { DESKS, DESK_SLUGS } from "@/lib/config";
import { subscribe } from "@/lib/subscribers";
import { BrevoError } from "@/lib/brevo";
import { clientIp, rateLimited } from "@/lib/guard";
import { profileToken } from "@/lib/tokens";

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  firstName: z.string().trim().max(60).optional().default(""),
  desks: z.array(z.enum(DESK_SLUGS)).min(1).max(DESKS.length),
  source: z.string().max(40).optional(),
  ref: z.string().max(60).nullish(),
  website: z.string().nullish(),
  elapsed: z.number().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return NextResponse.json({ error: field === "desks" ? "Pick at least one briefing." : "Enter a valid email address." }, { status: 400 });
  }
  const b = parsed.data;
  // Bots: filled honeypot or submitted faster than a person can. Pretend it worked.
  if (b.website || (typeof b.elapsed === "number" && b.elapsed < 1500)) return NextResponse.json({ status: "pending", profile: "" });
  if (rateLimited(`sub:${clientIp(req)}`, 8, 10 * 60_000) || rateLimited(`sub:${b.email}`, 3, 10 * 60_000))
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });

  const listIds = DESKS.filter((d) => b.desks.includes(d.slug)).map((d) => d.listId);
  try {
    const status = await subscribe({ email: b.email, firstName: b.firstName, listIds, source: b.source, ref: b.ref });
    return NextResponse.json({ status, profile: profileToken(b.email) });
  } catch (err) {
    console.error("[subscribe]", err);
    const msg = err instanceof BrevoError && err.status === 400 ? "That email address can't receive email. Check it and try again." : "We couldn't sign you up just now. Try again in a minute.";
    return NextResponse.json({ error: msg }, { status: err instanceof BrevoError && err.status === 400 ? 400 : 502 });
  }
}
