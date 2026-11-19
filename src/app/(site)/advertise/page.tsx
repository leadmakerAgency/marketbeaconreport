import type { Metadata } from "next";
import { TIERS, aud } from "@/lib/sponsorship";
import { EXAMPLE_SPONSOR } from "@/lib/sponsors";
import { SponsorCard } from "@/components/SponsorCard";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Sponsor Market Beacon Report and reach self-directed investors who follow stocks, mining and minerals, and technology. Packages from $5,000.",
};

const FORMATS = [
  ["Sponsored block in briefings", "A labelled block inside the email, after the editorial content. Headline, two sentences and a link."],
  ["Web placement", "The same block on briefing pages and the archive, shown to every reader on the web."],
  ["Dedicated partner email", "A full email about your offer, sent to the whole list and labelled as a paid promotion."],
  ["Social posts", "Sponsored posts on LinkedIn, X and Instagram, labelled as a paid partnership."],
];

export default async function Advertise({ searchParams }: { searchParams: Promise<{ tier?: string }> }) {
  const { tier } = await searchParams;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Advertise</div>
          <h1 className="h1">Put your company in front of self-directed investors.</h1>
          <p className="lede">Readers pick their briefings, so your placement reaches people who already follow your sector. Every placement is labelled, disclosed and measured.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <div className="eyebrow">Placements</div>
            <h2 className="h2">Where sponsors appear</h2>
            <ul className="steps" style={{ marginTop: 24 }}>
              {FORMATS.map(([h, p]) => <li key={h}><div><h3>{h}</h3><p>{p}</p></div></li>)}
            </ul>
          </div>
          <div>
            <div className="eyebrow">Example placement</div>
            <h2 className="h2" style={{ marginBottom: 20 }}>How a sponsored block looks</h2>
            <SponsorCard sponsor={EXAMPLE_SPONSOR} preview />
            <p className="hint" style={{ marginTop: 10 }}>Example for illustration. The disclaimer is always included and can&rsquo;t be removed.</p>
          </div>
        </div>
      </section>

      <section className="section alt" id="packages">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow">Packages</div><h2 className="h2">Sponsorship packages</h2></div>
            <p>Prices in Australian dollars, excluding GST. Custom packages on request.</p>
          </div>
          <div className="tiers">
            {TIERS.map((t) => (
              <div key={t.key} className={`tier${t.highlight ? " hl" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <h3 className="h3">{t.name}</h3>
                  {t.highlight && <span className="flag">Most chosen</span>}
                </div>
                <div className="price tabular">{aud(t.price)}<small>{t.term}</small></div>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{t.summary}</p>
                <ul>{t.inclusions.map((i) => <li key={i}>{i}</li>)}</ul>
                <a className={`btn${t.highlight ? "" : " ghost"}`} href={`/advertise?tier=${t.key}#enquire`}>Request this package</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="enquire">
        <div className="wrap grid-2">
          <div>
            <div className="eyebrow">Request pricing</div>
            <h2 className="h2">Tell us about your campaign</h2>
            <p className="muted" style={{ marginTop: 12 }}>We reply within one business day with availability, audience numbers by briefing and a media kit.</p>
            <h3 className="h3" style={{ marginTop: 28, fontSize: 18 }}>What we accept</h3>
            <ul className="muted" style={{ paddingLeft: 18 }}>
              <li>Listed companies and issuers with a current disclosure document</li>
              <li>Licensed brokers, platforms, data and research providers</li>
              <li>Investor events, conferences and education</li>
            </ul>
            <h3 className="h3" style={{ marginTop: 20, fontSize: 18 }}>What we decline</h3>
            <ul className="muted" style={{ paddingLeft: 18 }}>
              <li>Promises of returns or price targets</li>
              <li>Unlicensed financial products or advice</li>
              <li>Crypto schemes, binary options and signal groups</li>
            </ul>
            <p className="hint">All sponsor copy is reviewed before it runs. See our <a href="/sponsorship-policy">sponsorship policy</a>.</p>
          </div>
          <EnquiryForm initialTier={tier} tiers={TIERS.map((t) => ({ key: t.key, label: `${t.name} (${aud(t.price)})` }))} />
        </div>
      </section>
    </>
  );
}
