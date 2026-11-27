import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { issue, fmtDate, briefingPath } from "@/lib/archive";
import { siteUrl } from "@/lib/site";

const idOf = (slug: string) => Number(/^(\d+)/.exec(slug)?.[1]);
import { IssueFrame } from "@/components/IssueFrame";
import { Article } from "@/components/Article";
import { articleBlocks } from "@/lib/article";
import { SAMPLE_POST } from "@/lib/sample-post";
import { postBySlug, isUnpublished, POST_LABEL, type Post } from "@/lib/posts";
import { PostFigure } from "@/components/PostFigure";

const DESK_FOR_TAG: Record<string, string> = { weekly: "weekly-beacon", stocks: "stocks", mining: "mining-minerals", tech: "technology" };

export const revalidate = 3600;
export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "sample") return { title: `${SAMPLE_POST.title} (sample)`, description: SAMPLE_POST.preview, robots: { index: false } };
  const post = postBySlug(slug);
  if (post) {
    const url = `${siteUrl()}/briefings/${post.slug}`;
    const img = post.image;
    const images = img ? [{ url: `${siteUrl()}${img.src}`, width: img.width, height: img.height, alt: img.alt }] : undefined;
    const tags = post.keywords.length ? post.keywords : undefined;
    return { title: post.title, description: post.preview, keywords: tags, alternates: { canonical: url }, openGraph: { type: "article", url, title: post.title, description: post.preview, publishedTime: post.date, modifiedTime: post.updated ?? post.date, section: POST_LABEL[post.tag], tags, images }, twitter: { card: "summary_large_image", images: images?.map((i) => i.url) } };
  }
  const c = await issue(idOf(slug));
  if (!c) return { title: "Briefing not found" };
  const url = `${siteUrl()}${briefingPath(c.id, c.subject.replace(/^FLASH:\s*/i, ""))}`;
  return { title: c.subject, description: c.previewText || undefined, alternates: { canonical: url }, openGraph: { type: "article", url, title: c.subject, description: c.previewText || undefined, publishedTime: c.sentDate } };
}

export default async function BriefingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "sample") return <SamplePost />;
  const post = postBySlug(slug);
  if (post) return <StaticPost post={post} />;
  const c = await issue(idOf(slug));
  if (!c) notFound();
  const path = briefingPath(c.id, c.subject.replace(/^FLASH:\s*/i, ""));
  if (`/briefings/${slug}` !== path) permanentRedirect(path);
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: c.subject, description: c.previewText || undefined, datePublished: c.sentDate, url: `${siteUrl()}${path}`, publisher: { "@type": "Organization", name: "Market Beacon Report", logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.svg` } } };
  const blocks = articleBlocks(c.webHtml);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{c.label} &middot; {fmtDate(c.sentDate || "")}</div>
          <h1 className="h1" style={{ maxWidth: "24ch" }}>{c.subject.replace(/^FLASH:\s*/i, "")}</h1>
          {c.previewText && <p className="lede">{c.previewText}</p>}
        </div>
      </section>
      {blocks ? (
        <Article blocks={blocks} desk={DESK_FOR_TAG[(c.tag || "").toLowerCase()] ?? "weekly-beacon"} source={`post:${c.id}`} />
      ) : (
        <IssueFrame html={c.webHtml} title={c.subject} />
      )}
    </>
  );
}

function SamplePost() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{SAMPLE_POST.label} &middot; {SAMPLE_POST.date} &middot; Sample</div>
          <h1 className="h1" style={{ maxWidth: "24ch" }}>{SAMPLE_POST.title}</h1>
          <p className="lede">{SAMPLE_POST.preview}</p>
        </div>
      </section>
      <Article blocks={SAMPLE_POST.blocks} desk={SAMPLE_POST.desk} source="post:sample" />
    </>
  );
}

const DESK_FOR_POST: Record<Post["tag"], string> = { weekly: "weekly-beacon", stocks: "stocks", mining: "mining-minerals", tech: "technology" };

function StaticPost({ post }: { post: Post }) {
  const url = `${siteUrl()}/briefings/${post.slug}`;
  const org = { "@type": "Organization", "@id": `${siteUrl()}/#organization`, name: "Market Beacon Report", url: siteUrl(), logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.svg` } };
  const deskUrl = `${siteUrl()}/desks/${DESK_FOR_POST[post.tag]}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline: post.title,
        description: post.preview,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: post.image ? { "@type": "ImageObject", url: `${siteUrl()}${post.image.src}`, width: post.image.width, height: post.image.height, caption: post.image.caption || post.image.alt } : undefined,
        articleSection: POST_LABEL[post.tag],
        keywords: post.keywords.length ? post.keywords.join(", ") : undefined,
        inLanguage: "en",
        isAccessibleForFree: true,
        author: org,
        publisher: org,
        citation: post.sources.length ? post.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })) : undefined,
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl() }, { "@type": "ListItem", position: 2, name: POST_LABEL[post.tag], item: deskUrl }, { "@type": "ListItem", position: 3, name: post.title, item: url }] },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{POST_LABEL[post.tag]} &middot; {fmtDate(post.date)}{isUnpublished(post) && <> &middot; Not published (only visible locally)</>}</div>
          <h1 className="h1" style={{ maxWidth: "24ch" }}>{post.title}</h1>
          {post.preview && <p className="lede">{post.preview}</p>}
        </div>
      </section>
      <Article blocks={post.blocks} desk={DESK_FOR_POST[post.tag]} source={`post:${post.slug}`} disclosure={post.disclosure} figure={post.image ? <PostFigure img={post.image} /> : undefined}>
        {post.sources.length > 0 && (
          <div className="sources">
            <h2>Sources</h2>
            <ul>{post.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener nofollow" target="_blank">{s.label}</a></li>)}</ul>
          </div>
        )}
      </Article>
    </>
  );
}
