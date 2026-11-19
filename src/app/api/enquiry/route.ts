import { NextResponse } from "next/server";
import { z } from "zod";
import { brevo } from "@/lib/brevo";
import { LISTS } from "@/lib/config";
import { contactEmail } from "@/lib/site";
import { TIERS } from "@/lib/sponsorship";
import { clientIp, escapeHtml, rateLimited } from "@/lib/guard";

const Body = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  company: z.string().trim().min(1).max(120),
  tier: z.string().max(20).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().nullish(),
  elapsed: z.number().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Fill in your name, work email and company." }, { status: 400 });
  const b = parsed.data;
  if (b.website || (typeof b.elapsed === "number" && b.elapsed < 2500)) return NextResponse.json({ ok: true });
  if (rateLimited(`enq:${clientIp(req)}`, 4, 30 * 60_000)) return NextResponse.json({ error: "Too many requests. Email us instead." }, { status: 429 });

  const tier = TIERS.find((t) => t.key === b.tier)?.name || "Not sure yet";
  const rows = [["Name", b.name], ["Email", b.email], ["Company", b.company], ["Package", tier], ["Message", b.message || "(none)"]]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6478;vertical-align:top">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join("");
  try {
    await brevo.sendHtml({
      to: contactEmail(),
      replyTo: b.email,
      subject: `Sponsorship enquiry: ${b.company} (${tier})`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0e1630"><h2 style="margin:0 0 12px">New sponsorship enquiry</h2><table>${rows}</table></div>`,
    });
    await brevo.upsertContact(b.email, { FIRSTNAME: b.name.split(" ")[0], COMPANY: b.company, SOURCE: "advertise" }, [LISTS.enquiries]).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[enquiry]", err);
    return NextResponse.json({ error: `We couldn't send that. Email ${contactEmail()} instead.` }, { status: 502 });
  }
}
