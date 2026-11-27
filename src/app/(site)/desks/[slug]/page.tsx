import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESKS, getDesk } from "@/lib/config";
import { archive } from "@/lib/archive";
import { sponsorFor } from "@/lib/sponsors";
import { SubscribeForm } from "@/components/SubscribeForm";
import { IssueList } from "@/components/IssueList";
import { SponsorCard } from "@/components/SponsorCard";
import { postBySlug, POST_LABEL, type Post } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export const revalidate = 600;
export function generateStaticParams() { return DESKS.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDesk((await params).slug);
  if (!d) return {};
  const url = `${siteUrl()}/desks/${d.slug}`;
  const description = d.seoDescription ?? d.description;
  return { title: d.seoTitle ?? d.name, description, alternates: { canonical: url }, openGraph: { type: "website", url, title: d.seoTitle ?? d.name, description } };
}

export default async function DeskPage({ params }: { params: Promise<{ slug: string }> }) {
  const desk = getDesk((await params).slug);
  if (!desk) notFound();
  const items = (await archive(desk.tag)).slice(0, 9);
  const sponsor = sponsorFor(desk.slug);
  const guides = (desk.guides ?? []).map((s) => postBySlug(s)).filter((g): g is Post => !!g);
  const guideItems = guides.map((g, i) => ({ id: -1000 - i, title: g.title, preview: g.preview, tag: g.tag, label: POST_LABEL[g.tag], date: g.date, href: `/briefings/${g.slug}` }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: desk.seoTitle ?? desk.name, description: desk.seoDescription ?? desk.description, url: `${siteUrl()}/desks/${desk.slug}`, isPartOf: { "@type": "WebSite", name: "Market Beacon Report", url: siteUrl() } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl() }, { "@type": "ListItem", position: 2, name: desk.name, item: `${siteUrl()}/desks/${desk.slug}` }] },
      ...(guides.length ? [{ "@type": "ItemList", name: `${desk.name} guides`, itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl()}/briefings/${g.slug}`, name: g.title })) }] : []),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">{desk.code}</div>
            <h1 className="h1">{desk.name}</h1>
            <p className="lede" style={{ marginBottom: 10 }}>{desk.description}</p>
            <p style={{ fontWeight: 700, margin: "0 0 26px" }}>{desk.sendTime} &middot; {desk.readTime}</p>
            <SubscribeForm desks={DESKS.map((d) => ({ slug: d.slug, short: d.short }))} initial={[desk.slug]} source={`desk:${desk.slug}`} compact />
          </div>
          <div className="card">
            <h2>In every issue</h2>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>{desk.covers.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </div>
      </section>
      {guideItems.length > 0 && (
        <section className="section alt">
          <div className="wrap">
            <div className="section-head"><div><div className="eyebrow">Guides</div><h2 className="h2">Company guides and explainers</h2></div><p>Background on the companies and reporting rules that come up most in our {desk.name} briefings.</p></div>
            <IssueList items={guideItems} />
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap">
          <div className="section-head"><div><div className="eyebrow">Archive</div><h2 className="h2">Recent {desk.name} briefings</h2></div><a className="btn ghost small" href={`/archive?desk=${desk.tag}`}>All {desk.name} briefings</a></div>
          <IssueList items={items} empty="No briefings published here yet. Subscribe and the first one arrives in your inbox." />
          {sponsor && <div style={{ marginTop: 32 }}><SponsorCard sponsor={sponsor} /></div>}
        </div>
      </section>
    </>
  );
}
