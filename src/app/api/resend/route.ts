import { NextResponse } from "next/server";
import { z } from "zod";
import { resendConfirmation } from "@/lib/subscribers";
import { clientIp, rateLimited } from "@/lib/guard";

export async function POST(req: Request) {
  const parsed = z.object({ email: z.string().trim().toLowerCase().email() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  const { email } = parsed.data;
  if (rateLimited(`resend:${email}`, 1, 2 * 60_000) || rateLimited(`resend:${clientIp(req)}`, 6, 10 * 60_000))
    return NextResponse.json({ error: "Wait a couple of minutes before asking again." }, { status: 429 });
  try {
    await resendConfirmation(email);
  } catch (err) {
    console.error("[resend]", err);
  }
  return NextResponse.json({ ok: true });
}
