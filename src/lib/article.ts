import "server-only";
import { parse, type HTMLElement } from "node-html-parser";

/**
 * Turns a sent briefing email into article blocks for the website.
 * Takes the editorial body cell, drops the email-only parts (title, eyebrow, forward-to-a-friend box)
 * and returns the top-level blocks so a signup box can be placed between them.
 */
export function articleBlocks(emailHtml: string): string[] | null {
  try {
    const root = parse(emailHtml);
    const body = root.querySelectorAll("td").find((t) => /padding:\s*32px 28px 8px/.test(t.getAttribute("style") || ""));
    if (!body) return null;
    const blocks = (body.childNodes.filter((n) => n.nodeType === 1) as HTMLElement[])
      .filter((n, i) => !(i === 0 && /letter-spacing:2px/.test(n.getAttribute("style") || "")))
      .filter((n) => !/Know someone who should read this|Forward this email/i.test(n.text));
    if (blocks[0]?.rawTagName === "h1") blocks.shift();
    blocks.forEach((b) => b.querySelectorAll("script,style,iframe").forEach((x) => x.remove()));
    const out = blocks.map((b) => b.toString()).filter((s) => s.trim());
    return out.length ? out : null;
  } catch {
    return null;
  }
}

/**
 * Where the mid-article signup goes: just before the first section heading that starts past the
 * halfway point of the text, so it never splits a section. With no heading there, after the block
 * that holds the halfway point.
 */
export function signupIndex(blocks: string[]) {
  if (blocks.length < 4) return blocks.length;
  const lengths = blocks.map((b) => b.replace(/<[^>]*>/g, "").length);
  const half = lengths.reduce((a, b) => a + b, 0) / 2;
  let start = 0;
  let middle = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (start >= half && /^<h2/i.test(blocks[i])) return i;
    start += lengths[i];
    if (middle < 0 && start >= half) middle = i + 1;
  }
  return Math.min(middle, blocks.length);
}
