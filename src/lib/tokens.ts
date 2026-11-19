import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const s = process.env.SITE_SECRET;
  if (!s || s.length < 32) throw new Error("SITE_SECRET must be set to at least 32 characters.");
  return s;
}

/** A link token that identifies a subscriber without exposing their email in the URL path in clear text. */
export function manageToken(email: string) {
  const e = Buffer.from(email.toLowerCase()).toString("base64url");
  const sig = createHmac("sha256", secret()).update(email.toLowerCase()).digest("base64url").slice(0, 22);
  return `${e}.${sig}`;
}

export function emailFromToken(token: string): string | null {
  const [e, sig] = decodeURIComponent(token).split(".");
  if (!e || !sig) return null;
  let email: string;
  try {
    email = Buffer.from(e, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", secret()).update(email).digest("base64url").slice(0, 22);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return email;
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Short-lived token handed to the browser after signup so it can add profile details (step 2). It can't manage or unsubscribe. */
export function profileToken(email: string, days = 7) {
  const e = Buffer.from(email.toLowerCase()).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + days * 86400;
  const sig = createHmac("sha256", secret()).update(`profile|${email.toLowerCase()}|${exp}`).digest("base64url").slice(0, 22);
  return `${e}.${exp}.${sig}`;
}

export function emailFromProfileToken(token: string): string | null {
  const [e, expRaw, sig] = String(token).split(".");
  const exp = Number(expRaw);
  if (!e || !sig || !exp || exp < Date.now() / 1000) return null;
  let email: string;
  try { email = Buffer.from(e, "base64url").toString("utf8"); } catch { return null; }
  const expected = createHmac("sha256", secret()).update(`profile|${email}|${exp}`).digest("base64url").slice(0, 22);
  return safeEqual(sig, expected) ? email : null;
}
