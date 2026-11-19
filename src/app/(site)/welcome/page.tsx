import type { Metadata } from "next";
import { DESKS } from "@/lib/config";

export const metadata: Metadata = { title: "Subscription confirmed", robots: { index: false } };

export default function Welcome() {
  return (
    <>
      <section className="hero">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">Subscription confirmed</div>
            <h1 className="h1">You&rsquo;re in. Welcome to Market Beacon Report.</h1>
            <p className="lede">A welcome email is on its way. Here is when each briefing arrives.</p>
          </div>
          <div>
            <table className="sched"><tbody>{DESKS.map((d) => <tr key={d.slug}><td>{d.name}</td><td>{d.sendTime}</td></tr>)}</tbody></table>
            <p className="hint">You get the briefings you picked. Market Flash alerts and the Monthly Review go to every subscriber.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2 className="h2" style={{ marginBottom: 12 }}>Make sure every briefing reaches your inbox</h2>
            <p className="muted">Add <strong style={{ color: "var(--ink)" }}>editor@marketbeaconreport.com</strong> to your contacts. It takes ten seconds.</p>
            <div className="tips">
              <div><b>Gmail</b><span>Open the welcome email, click our name, then Add to contacts. If it landed in Promotions, drag it to Primary.</span></div>
              <div><b>Outlook</b><span>Right-click the email and choose Add to Safe Senders.</span></div>
              <div><b>Apple Mail</b><span>Open the email, tap our name, then Add to Contacts.</span></div>
            </div>
          </div>
          <div className="card">
            <h2>One quick question</h2>
            <p className="muted">Reply to the welcome email and tell us which companies or commodities you follow. Every reply is read by the editor.</p>
            <a className="btn" href="/archive">Read recent briefings</a>
          </div>
        </div>
      </section>
    </>
  );
}
