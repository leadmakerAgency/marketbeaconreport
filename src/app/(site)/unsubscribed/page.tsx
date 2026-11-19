import type { Metadata } from "next";
import { emailFromToken } from "@/lib/tokens";
import { saveReason, resubscribe, weeklyOnly } from "../actions";

export const metadata: Metadata = { title: "Unsubscribed", robots: { index: false } };
export const dynamic = "force-dynamic";

const REASONS = ["Too many emails", "Not relevant to what I invest in", "I didn't sign up", "I get this elsewhere", "Something else"];

export default async function Unsubscribed({ searchParams }: { searchParams: Promise<{ t?: string; thanks?: string }> }) {
  const sp = await searchParams;
  const token = sp.t && emailFromToken(sp.t) ? sp.t : null;
  return (
    <section className="hero">
      <div className="wrap grid">
        <div>
          <div className="eyebrow">Unsubscribed</div>
          <h1 className="h1">Sorry to see you go.</h1>
          <p className="lede">You won&rsquo;t receive any more emails from Market Beacon Report. If a send was already under way, one last email may arrive in the next few minutes.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
            {token ? (
              <>
                <form action={resubscribe}><input type="hidden" name="token" value={token} /><button className="btn" type="submit">Resubscribe</button></form>
                <form action={weeklyOnly}><input type="hidden" name="token" value={token} /><button className="btn ghost" type="submit">Just the Weekly Beacon instead</button></form>
              </>
            ) : (
              <a className="btn" href="/#subscribe">Resubscribe</a>
            )}
          </div>
        </div>
        {token && (
          <form className="card" action={saveReason}>
            <input type="hidden" name="token" value={token} />
            {sp.thanks ? (
              <><h2>Thank you</h2><p className="muted" style={{ margin: 0 }}>That helps us get better.</p></>
            ) : (
              <>
                <h2>Mind telling us why?</h2>
                <p className="muted" style={{ margin: 0 }}>One click. It helps us get better.</p>
                <div className="opts">{REASONS.map((r) => <label className="opt" key={r}><input type="radio" name="reason" value={r} /> {r}</label>)}</div>
                <button className="btn" type="submit">Send</button>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
