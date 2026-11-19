"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type DeskOption = { slug: string; short: string };

export function SubscribeForm({ desks, initial = ["weekly-beacon"], source = "website", compact = false, chips = true, button = "Subscribe free" }: { desks: DeskOption[]; initial?: string[]; source?: string; compact?: boolean; chips?: boolean; button?: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initial);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(Date.now());
  const ref = useRef<string | null>(null);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      ref.current = p.get("ref") || sessionStorage.getItem("mbr_ref");
      if (p.get("ref")) sessionStorage.setItem("mbr_ref", p.get("ref")!);
      const d = p.get("desk");
      if (d && desks.some((x) => x.slug === d)) setSelected((s) => Array.from(new Set([...s, d])));
    } catch {}
  }, [desks]);

  function toggle(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (!selected.length) return setError("Pick at least one briefing.");
    if (!consent) return setError("Tick the box to agree to receive the briefings.");
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, desks: selected, source, ref: ref.current, website: fd.get("website"), elapsed: Date.now() - started.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again in a minute.");
      try {
        sessionStorage.setItem("mbr_signup", JSON.stringify({ email: email.trim(), desks: selected, status: json.status, profile: json.profile || "" }));
      } catch {}
      router.push(json.status === "already" ? "/subscribe/already-subscribed" : "/subscribe/check-your-inbox");
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} noValidate id="subscribe">
      {chips && <fieldset style={{ border: 0, padding: 0, margin: "0 0 16px" }}>
        <legend className="hint" style={{ marginBottom: 10, fontWeight: 700, color: "var(--ink)" }}>Pick your briefings</legend>
        <div className="chips">
          {desks.map((d) => (
            <label className="chip" key={d.slug}>
              <input type="checkbox" checked={selected.includes(d.slug)} onChange={() => toggle(d.slug)} id={`sub-${source}-${d.slug}`} />
              <span className="tick" aria-hidden="true">{selected.includes(d.slug) ? "✓" : ""}</span>
              {d.short}
            </label>
          ))}
        </div>
      </fieldset>}
      {!compact && (
        <div className="field" style={{ maxWidth: 520 }}>
          <label htmlFor={`fn-${source}`}>First name <span className="hint">(optional)</span></label>
          <input id={`fn-${source}`} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={60} />
        </div>
      )}
      <div className="inline" style={{ maxWidth: chips ? 520 : undefined }}>
        <label className="sr-only" htmlFor={`em-${source}`}>Email address</label>
        <input id={`em-${source}`} className="input" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn" type="submit" disabled={busy}>{busy ? "Sending..." : button}</button>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`web-${source}`}>Website</label>
        <input id={`web-${source}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} id={`consent-${source}`} />
        <span>I agree to receive the briefings I picked. They are general information, not financial advice. Unsubscribe any time. <a href="/privacy">Privacy policy</a>.</span>
      </label>
      {error && <p className="msg err" role="alert" style={{ marginTop: 12 }}>{error}</p>}
    </form>
  );
}
