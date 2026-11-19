import { DESKS } from "@/lib/config";
import { SITE, siteUrl } from "@/lib/site";
import { archive } from "@/lib/archive";
import { sponsorFor } from "@/lib/sponsors";
import { FAQ } from "@/lib/faq";
import { SubscribeForm } from "@/components/SubscribeForm";
import { InboxPreview } from "@/components/InboxPreview";
import { IssueList } from "@/components/IssueList";
import { SponsorCard } from "@/components/SponsorCard";

export const revalidate = 600;

export default async function Home() {
  const latest = (await archive()).slice(0, 6);
  const sponsor = sponsorFor("home");
  const desks = DESKS.map((d) => ({ slug: d.slug, short: d.short }));
  const jsonLd = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: SITE.name, url: siteUrl(), logo: `${siteUrl()}/icon.svg` }, { "@type": "WebSite", name: SITE.name, url: siteUrl() }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">Free market briefings by email</div>
            <h1 className="h1">This lands in your inbox before the market opens.</h1>
            <p className="lede" style={{ marginBottom: 26 }}>Short, sourced briefings on stocks, mining and minerals, and technology for people who make their own investment decisions. Pick the ones you want.</p>
            <SubscribeForm desks={desks} source="home" compact />
          </div>
          <InboxPreview items={latest.slice(0, 4)} />
        </div>
      </section>

      <section className="section" id="briefings">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow">The briefings</div><h2 className="h2">Four briefings. Read the ones you want.</h2></div>
            <p>Each one is written to be read in a few minutes and arrives on a fixed schedule.</p>
          </div>
          <div className="desks">
            {DESKS.map((d) => (
              <article key={d.slug}>
                <span className="code">{d.code}</span>
                <h3 className="h3"><a href={`/desks/${d.slug}`} style={{ color: "var(--ink)", textDecoration: "none" }}>{d.name}</a> {d.flagship && <span className="flag">Flagship</span>}</h3>
                <p>{d.description}</p>
                <span className="when">{d.sendTime}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow">Archive</div><h2 className="h2">Recent briefings</h2></div>
            <a className="btn ghost small" href="/archive">See all briefings</a>
          </div>
          <IssueList items={latest} />
          {sponsor && <div style={{ marginTop: 32 }}><SponsorCard sponsor={sponsor} /></div>}
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div><div className="eyebrow">How we work</div><h2 className="h2">How every briefing is made</h2><p className="muted" style={{ marginTop: 14 }}>Read our full <a href="/about">editorial standards</a>.</p></div>
          <ol className="steps">
            <li><div><h3>Primary sources first</h3><p>Exchange filings, company announcements and official data, read at source before anything is written.</p></div></li>
            <li><div><h3>Written for decisions</h3><p>Every item says what happened, why it matters and what to watch next. Nothing else.</p></div></li>
            <li><div><h3>Disclosed and labelled</h3><p>Writer holdings are disclosed. Sponsored content is labelled, kept separate and carries a disclaimer.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2">
          <div><div className="eyebrow">Questions</div><h2 className="h2">Frequently asked</h2><p className="muted" style={{ marginTop: 14 }}>More on the <a href="/faq">FAQ page</a>.</p></div>
          <div className="faq">{FAQ.slice(0, 5).map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section style={{ background: "var(--blue)", color: "#fff" }}>
        <div className="wrap section tight" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--yellow)" }}>Advertise</div>
            <h2 className="h2" style={{ color: "#fff" }}>Reach self-directed investors by sector</h2>
            <p style={{ color: "var(--blue-muted)", margin: "10px 0 0" }}>Sponsorship packages from $5,000. Labelled, disclosed and targeted by briefing.</p>
          </div>
          <a className="btn" href="/advertise">See sponsorship packages</a>
        </div>
      </section>
    </>
  );
}
