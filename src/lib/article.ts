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

/** Where the mid-article signup goes: the first section heading at or after a third of the way in. */
export function signupIndex(blocks: string[]) {
  if (blocks.length < 4) return blocks.length;
  const third = Math.ceil(blocks.length / 3);
  for (let i = third; i < blocks.length; i++) if (/^<h2/i.test(blocks[i])) return i;
  return third;
}
