import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG = { blue: "#0A2A8C", yellow: "#FFC72C", white: "#FFFFFF", soft: "#C9D3EE" };

export async function ogFonts() {
  const dir = path.join(process.cwd(), "src/assets/fonts");
  const [serif, sans, sansBold] = await Promise.all(["serif-600.woff", "sans-400.woff", "sans-700.woff"].map((f) => readFile(path.join(dir, f))));
  return [
    { name: "Serif", data: serif, weight: 600 as const, style: "normal" as const },
    { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Sans", data: sansBold, weight: 700 as const, style: "normal" as const },
  ];
}

export function OgMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" fill={OG.yellow} />
      <path d="M9 31V10h3.6L20 20.2 27.4 10H31v21h-3.8V16.6L20 26.4l-7.2-9.8V31z" fill={OG.blue} />
    </svg>
  );
}

export function OgCard({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: OG.blue, padding: 72, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <OgMark />
        <div style={{ display: "flex", flexDirection: "column", color: OG.white }}>
          <span style={{ fontFamily: "Serif", fontSize: 40, lineHeight: 1 }}>Market</span>
          <span style={{ fontFamily: "Sans", fontWeight: 700, fontSize: 15, letterSpacing: 4, textTransform: "uppercase", marginTop: 6, color: OG.soft }}>Beacon Report</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Sans", fontWeight: 700, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: OG.yellow, marginBottom: 18 }}>{kicker}</div>
        <div style={{ fontFamily: "Serif", fontSize: 66, lineHeight: 1.08, color: OG.white, maxWidth: 980 }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, background: OG.yellow, display: "flex" }} />
    </div>
  );
}
