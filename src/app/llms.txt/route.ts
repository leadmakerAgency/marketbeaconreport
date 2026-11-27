import { DESKS } from "@/lib/config";
import { allPosts, POST_LABEL } from "@/lib/posts";
import { SITE, siteUrl } from "@/lib/site";

// /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org).
export const revalidate = 3600;

export function GET() {
  const base = siteUrl();
  const posts = allPosts();
  const guideSlugs = new Set(DESKS.flatMap((d) => d.guides ?? []));
  const guides = posts.filter((p) => guideSlugs.has(p.slug));
  const latest = posts.filter((p) => !guideSlugs.has(p.slug)).slice(0, 40);
  const line = (p: (typeof posts)[number]) => `- [${p.title}](${base}/briefings/${p.slug}): ${p.preview}`;

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description} Coverage spans the United States, Canada and Germany, plus ASX-listed miners on the Mining and Minerals desk. General information only, not personal financial advice.`,
    "",
    "Every briefing says what happened, why it matters and what to watch next, and links its sources. We don't issue buy, sell or hold calls or price targets. Writers' holdings are disclosed.",
    "",
    "## Briefings (desks)",
    "",
    ...DESKS.map((d) => `- [${d.name}](${base}/desks/${d.slug}): ${d.seoDescription ?? d.description} ${d.cadence}.`),
    "",
    ...(guides.length ? ["## Company guides and explainers", "", ...guides.map(line), ""] : []),
    "## Latest briefings",
    "",
    ...latest.map((p) => `${line(p)} (${POST_LABEL[p.tag]}, ${p.date.slice(0, 10)})`),
    "",
    "## About",
    "",
    `- [About and methodology](${base}/about): who writes the briefings, how they are made and the editorial standards.`,
    `- [FAQ](${base}/faq): common questions, including JORC vs NI 43-101 and which mining companies we cover.`,
    `- [Archive](${base}/archive): every published briefing.`,
    `- [General advice warning](${base}/disclaimer)`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
