import { ImageResponse } from "next/og";
import { ogFonts, OgCard } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Market Beacon Report: free market briefings on stocks, mining and minerals, and technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgCard kicker="Free market briefings by email" title="Stocks, mining and minerals, and technology. Before the market opens." />, { ...size, fonts: await ogFonts() });
}
