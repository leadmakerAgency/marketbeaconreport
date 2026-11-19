"use client";
import { useEffect, useState } from "react";
import { DESKS } from "@/lib/config";

type Signup = { email: string; desks: string[] };

export function CheckInbox({ part }: { part: "intro" | "actions" }) {
  const [s, setS] = useState<Signup | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "wait">("idle");
  useEffect(() => { try { setS(JSON.parse(sessionStorage.getItem("mbr_signup") || "null")); } catch {} }, []);

  if (part === "intro")
    return (
      <>
        <p className="lede">
          We sent a confirmation email{s ? <> to <strong style={{ color: "var(--ink)" }}>{s.email}</strong></> : null}. Click the button in it and your first briefing is on its way.
        </p>
        {s && <div className="chips" style={{ marginTop: 20 }}>{DESKS.filter((d) => s.desks.includes(d.slug)).map((d) => <span className="chip" key={d.slug} style={{ cursor: "default" }}>{d.name}</span>)}</div>}
      </>
    );

  async function resend() {
    if (!s) return;
    setState("sending");
    try {
      const r = await fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: s.email }) });
      setState(r.status === 429 ? "wait" : "sent");
    } catch { setState("idle"); }
  }
  return (
    <div style={{ marginTop: 18 }}>
      {state === "sent" && <p className="msg ok">Sent again. Give it a minute, then check junk too.</p>}
      {state === "wait" && <p className="msg err">We just sent one. Please wait two minutes before asking again.</p>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {s && <button className="btn" type="button" onClick={resend} disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Resend the email"}</button>}
        <a className="btn ghost" href="/#subscribe">Use a different email</a>
      </div>
    </div>
  );
}
