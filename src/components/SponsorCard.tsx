import { SPONSOR_DISCLAIMER, type Sponsor } from "@/lib/sponsors";

export function SponsorCard({ sponsor, preview = false }: { sponsor: Sponsor; preview?: boolean }) {
  return (
    <aside className="sponsored" aria-label={`Sponsored by ${sponsor.sponsorName}`}>
      <div className="lr"><span>Sponsored</span><span>From {sponsor.sponsorName}</span></div>
      <h4>{sponsor.headline}</h4>
      <p>{sponsor.body}</p>
      <a href={preview ? "#enquire" : sponsor.url} rel="sponsored noopener" target={preview ? undefined : "_blank"} style={{ fontWeight: 700 }}>
        {sponsor.cta} &rarr;
      </a>
      <p className="disc">{SPONSOR_DISCLAIMER} <a href="/sponsorship-policy">Sponsorship policy</a>.</p>
    </aside>
  );
}
