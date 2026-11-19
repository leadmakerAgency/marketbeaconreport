// Sponsorship packages shown on /advertise. Prices in AUD, excluding GST.

export type Tier = {
  key: "desk" | "network" | "founding";
  name: string;
  price: number;
  term: string;
  summary: string;
  highlight?: boolean;
  inclusions: string[];
};

export const TIERS: Tier[] = [
  {
    key: "desk",
    name: "Desk Sponsor",
    price: 5000,
    term: "4 weeks",
    summary: "Own one desk for a month. Best for a single campaign aimed at one investor audience.",
    inclusions: [
      "Sponsored block in 8 briefings on one desk of your choice",
      "Sponsored placement on that desk's web pages for 30 days",
      "1 sponsored post on LinkedIn and X",
      "End of campaign report: impressions, clicks, click-through rate",
    ],
  },
  {
    key: "network",
    name: "Network Sponsor",
    price: 10000,
    term: "8 weeks",
    summary: "Reach every desk. Best for brand awareness across the full Market Beacon readership.",
    highlight: true,
    inclusions: [
      "Sponsored block in 4 editions of The Weekly Beacon",
      "Sponsored block in 12 desk briefings across all desks",
      "1 dedicated partner email to the full list",
      "Sitewide sponsored placement for 8 weeks",
      "2 sponsored social posts and 1 Instagram story",
      "Fortnightly performance reports",
    ],
  },
  {
    key: "founding",
    name: "Founding Partner",
    price: 50000,
    term: "12 months",
    summary: "Category exclusivity for a year. Best for issuers and brands building a long-term investor following.",
    inclusions: [
      "Category exclusivity: no competing sponsor in your sector",
      "Sponsored block in all 52 editions of The Weekly Beacon",
      "Named partner mention in 12 Monthly Reviews",
      "4 dedicated partner emails to the full list",
      "Homepage and sitewide placement for 12 months",
      "Quarterly sponsored interview or webinar feature",
      "Monthly social campaign across LinkedIn, X and Instagram",
      "Monthly performance reporting and a quarterly review",
    ],
  },
];

export function aud(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}
