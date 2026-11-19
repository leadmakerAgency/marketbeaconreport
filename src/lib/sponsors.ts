// Website sponsor placements. Set `active: true` and fill in the details when a sponsor goes live.
// Email sponsor blocks are added in the Brevo template for each issue.
export const SPONSOR_DISCLAIMER =
  "Sponsored content is paid for by the named advertiser and is not written by the Market Beacon Report editorial team. It is not a recommendation or endorsement of any financial product. Do your own research and consider independent advice.";

export type Sponsor = { sponsorName: string; headline: string; body: string; cta: string; url: string; desks: string[] | "all"; active: boolean };

export const EXAMPLE_SPONSOR: Sponsor = {
  sponsorName: "KRAIT Critical Minerals",
  headline: "Antimony is on the critical minerals list. KRAIT is building US supply.",
  body: "KRAIT Critical Minerals is advancing the Bales Antimony Project as part of a domestic critical minerals supply chain. Register to receive company updates.",
  cta: "Register for KRAIT updates",
  url: "https://example.com/krait",
  desks: ["mining-minerals"],
  active: false,
};

export const SPONSORS: Sponsor[] = [EXAMPLE_SPONSOR];

export function sponsorFor(desk: string | "home") {
  return SPONSORS.find((s) => s.active && (s.desks === "all" || (desk !== "home" && s.desks.includes(desk)))) ?? null;
}
