import { DESKS } from "@/lib/config";
import { LogoMark } from "./Logo";
import { SubscribeForm } from "./SubscribeForm";

/** On-brand signup box placed inside and at the end of every briefing post. */
export function InlineSignup({ desk, variant, source }: { desk: string; variant: "mid" | "end"; source: string }) {
  const d = DESKS.find((x) => x.slug === desk) ?? DESKS[0];
  const initial = Array.from(new Set(["weekly-beacon", d.slug]));
  const mid = variant === "mid";
  return (
    <aside className={`signup-box ${variant}`} aria-label="Subscribe to Market Beacon Report">
      <div className="kick"><LogoMark size={20} /> Market Beacon Report</div>
      <h3>{mid ? "Less hype. More insight." : "Get the next one before the market opens."}</h3>
      <p className="sub">{mid ? `Get ${d.flagship ? "The Weekly Beacon" : `the ${d.name} briefing`} in your inbox, free.` : "Pick the briefings you want. It takes ten seconds."}</p>
      {mid && <p className="body">Short, sourced briefings on the companies and numbers that matter. No stock tips. No pressure to invest. Just information worth your time.</p>}
      <div className="panel">
        <SubscribeForm desks={DESKS.map((x) => ({ slug: x.slug, short: x.short }))} initial={initial} source={`${source}:${variant}`} compact chips={!mid} button={mid ? "Get the briefing free" : "Subscribe free"} />
      </div>
      <p className="foot">Sourced research. Real developments. Your inbox, your choice.</p>
    </aside>
  );
}
