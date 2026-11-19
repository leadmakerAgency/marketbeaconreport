import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESKS, getDesk } from "@/lib/config";
import { archive } from "@/lib/archive";
import { sponsorFor } from "@/lib/sponsors";
import { SubscribeForm } from "@/components/SubscribeForm";
import { IssueList } from "@/components/IssueList";
import { SponsorCard } from "@/components/SponsorCard";

export const revalidate = 600;
export function generateStaticParams() { return DESKS.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDesk((await params).slug);
  return d ? { title: d.name, description: d.description } : {};
}

export default async function DeskPage({ params }: { params: Promise<{ slug: string }> }) {
  const desk = getDesk((await params).slug);
  if (!desk) notFound();
  const items = (await archive(desk.tag)).slice(0, 9);
  const sponsor = sponsorFor(desk.slug);
  return (
    <>
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
