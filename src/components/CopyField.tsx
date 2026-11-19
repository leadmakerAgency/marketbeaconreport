"use client";
import { useState } from "react";

export function CopyField({ value, id, label }: { value: string; id: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input id={id} className="input" readOnly value={value} aria-label={label} onFocus={(e) => e.currentTarget.select()} style={{ minWidth: 0 }} />
      <button className="btn small blue" type="button" onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1800); } catch { (document.getElementById(id) as HTMLInputElement | null)?.select(); } }}>
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
