import { NextResponse } from "next/server";
import { z } from "zod";
import { brevo, BrevoError } from "@/lib/brevo";
import { emailFromProfileToken } from "@/lib/tokens";
import { APPETITE, COUNTRIES, EXPERIENCE } from "@/lib/profile";
import { clientIp, rateLimited } from "@/lib/guard";

const Body = z.object({
  token: z.string().min(10).max(400),
  firstName: z.string().trim().max(60).optional().default(""),
  country: z.string().refine((v) => !v || COUNTRIES.includes(v)).optional().default(""),
  experience: z.string().refine((v) => !v || EXPERIENCE.some(([k]) => k === v)).optional().default(""),
  appetite: z.string().refine((v) => !v || APPETITE.some(([k]) => k === v)).optional().default(""),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check your answers and try again." }, { status: 400 });
  const b = parsed.data;
  const email = emailFromProfileToken(b.token);
  if (!email) return NextResponse.json({ error: "This form has expired. You can update your details from any briefing email." }, { status: 401 });
  if (rateLimited(`profile:${clientIp(req)}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const attrs: Record<string, string> = {};
  if (b.firstName) attrs.FIRSTNAME = b.firstName;
  if (b.country) attrs.COUNTRY = b.country;
  if (b.experience) attrs.EXPERIENCE = b.experience;
  if (b.appetite) attrs.RISK_APPETITE = b.appetite;
  if (!Object.keys(attrs).length) return NextResponse.json({ ok: true });

  try {
    await brevo.updateContact(email, { attributes: attrs });
  } catch (err) {
    // If the new attributes haven't been created in Brevo yet, still save the name.
    if (err instanceof BrevoError && err.status === 400 && attrs.FIRSTNAME) {
      console.error("[profile] attribute missing in Brevo, saved name only:", err.message);
      await brevo.updateContact(email, { attributes: { FIRSTNAME: attrs.FIRSTNAME } }).catch(() => {});
    } else {
      console.error("[profile]", err);
      return NextResponse.json({ error: "We couldn't save that just now. Try again in a minute." }, { status: 502 });
    }
  }
  return NextResponse.json({ ok: true });
}
