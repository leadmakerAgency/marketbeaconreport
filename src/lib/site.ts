export const SITE = {
  name: "Market Beacon Report",
  description:
    "Independent market briefings on stocks, mining and minerals, and technology for self-directed investors. Free. Pick the briefings you want.",
};

export function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export function contactEmail() {
  return process.env.CONTACT_EMAIL || "editor@marketbeaconreport.com";
}
export function postalAddress() {
  return process.env.SENDER_POSTAL_ADDRESS || "100 Mount St, North Sydney NSW 2060, Australia";
}
export function publisherName() {
  return process.env.PUBLISHER_NAME || "";
}
