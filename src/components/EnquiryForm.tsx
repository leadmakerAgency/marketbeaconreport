"use client";
import { useState } from "react";

export function EnquiryForm({ tiers, initialTier }: { tiers: { key: string; label: string }[]; initialTier?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [started] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, elapsed: Date.now() - started }),
    }).catch(() => null);
    if (res?.ok) return setState("sent");
    const j = res ? await res.json().catch(() => ({})) : {};
    setError(j.error || "Something went wrong. Email editor@marketbeaconreport.com instead.");
    setState("error");
  }

  if (state === "sent")
    return (
      <div className="card">
        <h3>Thanks. We&rsquo;ve got it.</h3>
        <p className="muted" style={{ margin: 0 }}>We reply within one business day with availability, audience numbers by briefing and a media kit.</p>
      </div>
    );

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="field"><label htmlFor="eq-name">Your name</label><input id="eq-name" name="name" required maxLength={80} autoComplete="name" /></div>
      <div className="field"><label htmlFor="eq-email">Work email</label><input id="eq-email" name="email" type="email" required maxLength={120} autoComplete="email" /></div>
      <div className="field"><label htmlFor="eq-company">Company</label><input id="eq-company" name="company" required maxLength={120} autoComplete="organization" /></div>
      <div className="field">
        <label htmlFor="eq-tier">Package</label>
        <select id="eq-tier" name="tier" defaultValue={initialTier || ""}>
          <option value="">Not sure yet</option>
          {tiers.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="eq-msg">What are you promoting?</label><textarea id="eq-msg" name="message" rows={4} maxLength={2000} /></div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" && <p className="msg err">{error}</p>}
      <button className="btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Request pricing"}</button>
    </form>
  );
}
