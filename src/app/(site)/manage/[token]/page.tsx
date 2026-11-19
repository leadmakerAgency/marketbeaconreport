import type { Metadata } from "next";
import { brevo } from "@/lib/brevo";
import { emailFromToken } from "@/lib/tokens";
import { DESKS } from "@/lib/config";
import { savePreferences, unsubscribeAll, resubscribe } from "../../actions";

export const metadata: Metadata = { title: "Manage your briefings", robots: { index: false } };
export const dynamic = "force-dynamic";

function Invalid() {
  return (
    <section className="hero"><div className="wrap" style={{ paddingBlock: "64px 72px", maxWidth: 760 }}>
      <div className="eyebrow">Link not valid</div><h1 className="h1">We couldn&rsquo;t open your preferences.</h1>
      <p className="lede">Use the Manage your briefings link at the bottom of any of our emails, or email editor@marketbeaconreport.com and we&rsquo;ll sort it out.</p>
    </div></section>
  );
}

export default async function Manage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ saved?: string; confirmUnsub?: string }> }) {
  const { token } = await params;
  const sp = await searchParams;
  const email = token === "invalid" ? null : emailFromToken(token);
  if (!email) return <Invalid />;
  const c = await brevo.getContact(email).catch(() => null);
  if (!c) return <Invalid />;
  return (
    <>
      <section className="page-hero"><div className="wrap"><div className="eyebrow">Your briefings</div><h1 className="h1">Manage your briefings</h1><p className="lede">{email}</p></div></section>
      <section className="section">
        <div className="wrap grid-2">
          {c.emailBlacklisted ? (
            <div className="card">
              <h2>You&rsquo;re unsubscribed</h2>
              <p className="muted">You don&rsquo;t receive any emails from us. Want them back?</p>
              <form action={resubscribe}><input type="hidden" name="token" value={token} /><button className="btn" type="submit">Resubscribe to the Weekly Beacon</button></form>
            </div>
          ) : (
            <form className="card" action={savePreferences}>
              <input type="hidden" name="token" value={token} />
              {sp.saved && <p className="msg ok">Saved. Changes apply from the next send.</p>}
              {sp.confirmUnsub && <p className="msg err">You unticked everything. To stop all emails, use the unsubscribe button.</p>}
              <div className="field"><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" defaultValue={c.attributes?.FIRSTNAME ?? ""} maxLength={60} /></div>
              <div className="opts">
                {DESKS.map((d) => (
                  <label className="opt" key={d.slug}>
                    <input type="checkbox" name="desk" value={d.listId} defaultChecked={c.listIds.includes(d.listId)} />
                    <span style={{ fontWeight: 700 }}>{d.name}</span>
                    <span className="meta">{d.sendTime}</span>
                  </label>
                ))}
              </div>
              <p className="hint" style={{ marginTop: -6 }}>Market Flash alerts and the Monthly Review go to every subscriber.</p>
              <button className="btn" type="submit">Save my briefings</button>
            </form>
          )}
          {!c.emailBlacklisted && (
            <div className="card" style={{ alignSelf: "start" }}>
              <h2>Stop all emails</h2>
              <p className="muted">Unsubscribe from every briefing. You can come back any time.</p>
              <form action={unsubscribeAll}><input type="hidden" name="token" value={token} /><button className="btn ghost" type="submit">Unsubscribe from everything</button></form>
              <p className="hint" style={{ marginTop: 16 }}>Want a copy of your data, or for us to delete it? Email editor@marketbeaconreport.com.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
