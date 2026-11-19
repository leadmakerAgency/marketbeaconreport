import { LogoMark } from "./Logo";
import { fmtDate, type ArchiveItem } from "@/lib/archive";

const SHORT: Record<string, string> = { weekly: "WEEKLY", stocks: "STOCKS", mining: "MINING", tech: "TECH", monthly: "MONTHLY", flash: "FLASH" };

// Shown until the first briefing is sent. Markets, not tickers, so nothing can be mistaken for a real company.
const SAMPLE = {
  headline: "Chip stocks lead futures higher as German autos slip",
  rows: [
    ["US", "A large chipmaker beats on data centre orders and raises guidance", "+7.1%", "up"],
    ["CANADA", "A big-six bank lifts its dividend after a strong quarter", "+1.8%", "up"],
    ["GERMANY", "A carmaker cuts its full-year margin guidance on weaker China sales", "-5.2%", "down"],
  ],
};

function Band({ tag }: { tag: string }) {
  return (
    <div className="band">
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <LogoMark size={26} />
        <span style={{ font: "600 15px/1 var(--display)", letterSpacing: ".18em", textTransform: "uppercase" }}>Market</span>
      </span>
      <span className="tag">{tag}</span>
    </div>
  );
}

export function InboxPreview({ items = [] }: { items?: ArchiveItem[] }) {
  if (items.length) {
    const [top, ...rest] = items;
    return (
      <div className="inbox" aria-label="Latest briefings">
        <div className="ih"><span>From: Market Beacon Report</span><span>{fmtDate(top.date, { month: "short" })}</span></div>
        <Band tag={`LATEST · ${top.label.toUpperCase()}`} />
        <div className="em">
          <h3><a className="inbox-link" href={top.href}>{top.title}</a></h3>
          {top.preview && <p className="muted" style={{ margin: "0 0 12px", fontSize: 15 }}>{top.preview}</p>}
          {rest.length > 0 && (
            <div className="rows latest">
              {rest.slice(0, 3).map((i) => (
                <div key={i.id}>
                  <span className="tk">{SHORT[i.tag] ?? i.tag.toUpperCase()}</span>
                  <a className="inbox-link" href={i.href}>{i.title}</a>
                  <span className="ch">{fmtDate(i.date, { day: "numeric", month: "short", year: undefined })}</span>
                </div>
              ))}
            </div>
          )}
          <p style={{ margin: "12px 0 16px" }}><a href={top.href} style={{ fontWeight: 700 }}>Read the latest briefing &rarr;</a></p>
        </div>
      </div>
    );
  }
  return (
    <div className="inbox" aria-label="Sample briefing as it arrives in your inbox">
      <div className="ih"><span>From: Market Beacon Report</span><span>08:00 ET</span></div>
      <Band tag="STOCKS · BEFORE THE BELL" />
      <div className="em">
        <h3>{SAMPLE.headline}</h3>
        <div className="rows">
          <div className="rows-head"><span className="tk">Market</span><span /><span className="ch">Pre-mkt</span></div>
          {SAMPLE.rows.map((r) => (
            <div key={r[0]}>
              <span className="tk">{r[0]}</span>
              <span>{r[1]}</span>
              <span className={`ch ${r[3]}`}>{r[2]}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: "10px 0 14px" }}><span className="sample">Sample briefing</span></p>
      </div>
    </div>
  );
}
