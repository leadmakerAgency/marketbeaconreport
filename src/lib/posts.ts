import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { imageSize } from "image-size";

// Website posts, written in Sveltia CMS (/admin) and stored as Markdown in content/posts/.
// Each becomes a page at /briefings/<slug> and appears in the archive, on desk pages and in the
// homepage card alongside sent Brevo briefings.

export type PostImage = { src: string; width: number; height: number; alt: string; caption: string; credit: string; creditUrl: string; license: string; licenseUrl: string };

export type Post = {
  slug: string;
  title: string;
  preview: string;
  tag: "weekly" | "stocks" | "mining" | "tech";
  date: string; // ISO date
  draft: boolean;
  disclosure?: string;
  image?: PostImage;
  blocks: string[];
  sources: { label: string; url: string }[];
};

export const POST_LABEL: Record<Post["tag"], string> = { weekly: "The Weekly Beacon", stocks: "Stocks", mining: "Mining and Minerals", tech: "Technology" };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const isProd = process.env.NODE_ENV === "production";

/** Markdown to article blocks. A quote (`> ...`) becomes the highlighted "The number" box. */
const md = new Marked({
  gfm: true,
  renderer: {
    blockquote({ tokens }: Tokens.Blockquote) {
      const inner = this.parser.parse(tokens).trim();
      const single = /^<p>([\s\S]*)<\/p>$/.exec(inner);
      return `<div class="callout">${single && !single[1].includes("<p>") ? single[1] : inner}</div>`;
    },
  },
});

function toBlocks(body: string): string[] {
  const tokens = md.lexer(body);
  return tokens
    .filter((t) => t.type !== "space")
    .map((t) => md.parser(Object.assign([t], { links: tokens.links })).trim())
    .filter(Boolean);
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");
const TAGS = Object.keys(POST_LABEL) as Post["tag"][];

function readImage(photo: Record<string, unknown> | undefined, file: string): PostImage | undefined {
  const src = str(photo?.image);
  if (!src) return undefined;
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(PUBLIC_DIR, decodeURI(src))));
    if (!width || !height) throw new Error("no size");
    return { src, width, height, alt: str(photo?.alt), caption: str(photo?.caption), credit: str(photo?.credit), creditUrl: str(photo?.credit_url), license: str(photo?.license), licenseUrl: str(photo?.license_url) };
  } catch {
    console.warn(`[posts] ${file}: photo ${src} not found in public/, showing the post without it`);
    return undefined;
  }
}

function readPost(file: string): Post | null {
  try {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
    const title = str(data.title);
    const date = data.date instanceof Date ? data.date : new Date(str(data.date));
    if (!title || Number.isNaN(date.getTime())) throw new Error("needs a title and a date");
    const tag = TAGS.includes(data.desk) ? (data.desk as Post["tag"]) : "weekly";
    const sources = (Array.isArray(data.sources) ? data.sources : [])
      .map((s: Record<string, unknown>) => ({ label: str(s?.label) || str(s?.url), url: str(s?.url) }))
      .filter((s: { url: string }) => s.url);
    return {
      slug: slugify(str(data.slug) || title),
      title,
      preview: str(data.preview),
      tag,
      date: date.toISOString(),
      draft: data.draft === true,
      disclosure: str(data.disclosure) || undefined,
      image: readImage(data.photo, file),
      blocks: toBlocks(content),
      sources,
    };
  } catch (e) {
    console.error(`[posts] skipped ${file}: ${(e as Error).message}`);
    return null;
  }
}

let cache: Post[] | null = null;

/** Every post file, newest first, drafts and future posts included. */
function loadAll(): Post[] {
  if (cache && isProd) return cache;
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")) : [];
  const seen = new Set<string>();
  const posts = files.map(readPost).filter((p): p is Post => {
    if (!p) return false;
    if (seen.has(p.slug)) { console.error(`[posts] two posts share the slug "${p.slug}"; only the first is used`); return false; }
    seen.add(p.slug);
    return true;
  });
  posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  cache = posts;
  return posts;
}

/** Not published yet: a draft, or dated in the future. */
export const isUnpublished = (p: Post, now = Date.now()) => p.draft || Date.parse(p.date) > now;

/** Posts the public can see. In production drafts and future-dated posts are hidden; `next dev` shows them all. */
export function allPosts(): Post[] {
  const now = Date.now();
  return loadAll().filter((p) => !isProd || !isUnpublished(p, now));
}

export const postBySlug = (slug: string) => allPosts().find((p) => p.slug === slug);
