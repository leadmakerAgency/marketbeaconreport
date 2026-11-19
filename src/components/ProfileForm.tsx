"use client";
import { useEffect, useState } from "react";
import { APPETITE, COUNTRIES, EXPERIENCE } from "@/lib/profile";

export function ProfileForm() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    try { setToken(JSON.parse(sessionStorage.getItem("mbr_signup") || "null")?.profile || null); } catch {}
  }, []);

  if (!token) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("saving");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, token }) }).catch(() => null);
    if (res?.ok) return setState("saved");
    const j = res ? await res.json().catch(() => ({})) : {};
    setError(j.error || "We couldn't save that. Try again in a minute.");
    setState("error");
  }

  return (
    <section className="section alt">
      <div className="wrap grid-2">
        <div>
          <div className="eyebrow">Optional, 20 seconds</div>
          <h2 className="h2">While you wait, tell us a bit about you</h2>
          <p className="muted" style={{ marginTop: 12 }}>It helps us decide what to cover and how much to explain. Every question is optional, and we never share your answers.</p>
        </div>
        {state === "saved" ? (
          <div className="card" style={{ alignSelf: "start" }}>
            <h3>Thanks. That&rsquo;s saved.</h3>
            <p className="muted" style={{ margin: 0 }}>Now go and click the confirmation link in your inbox.</p>
          </div>
        ) : (
          <form className="card" onSubmit={submit}>
            <div className="field"><label htmlFor="pf-name">First name</label><input id="pf-name" name="firstName" autoComplete="given-name" maxLength={60} /></div>
            <div className="field">
              <label htmlFor="pf-country">Country</label>
              <select id="pf-country" name="country" defaultValue="" autoComplete="country-name">
                <option value="">Choose</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pf-exp">How long have you been investing?</label>
              <select id="pf-exp" name="experience" defaultValue="">
                <option value="">Choose</option>
                {EXPERIENCE.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <fieldset style={{ border: 0, padding: 0, margin: "0 0 4px" }}>
              <legend style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>What&rsquo;s your style?</legend>
              <div className="opts">
                {APPETITE.map(([k, l, d]) => (
                  <label className="opt" key={k}>
                    <input type="radio" name="appetite" value={k} />
                    <span><span style={{ fontWeight: 700 }}>{l}</span><span className="meta" style={{ display: "block" }}>{d}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            {state === "error" && <p className="msg err">{error}</p>}
            <button className="btn" type="submit" disabled={state === "saving"}>{state === "saving" ? "Saving..." : "Save my details"}</button>
          </form>
        )}
      </div>
    </section>
  );
}
