import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { SPONSOR_DISCLAIMER } from "@/lib/sponsors";

export const metadata: Metadata = { title: "Sponsorship policy", description: "How Market Beacon Report labels, reviews and separates sponsored content." };

export default function SponsorshipPolicy() {
  return (
    <LegalDoc title="Sponsorship and disclosure policy" updated="12 November 2026">
      <p>Market Beacon Report is free to read because sponsors pay for clearly labelled placements. This policy explains how we keep them separate from editorial content.</p>
      <h2>How sponsored content is labelled</h2>
      <ul>
        <li>Every sponsored block is labelled <strong>Sponsored</strong> and names the advertiser.</li>
        <li>Dedicated partner emails are labelled <strong>Partner offer</strong> in the banner and <strong>[Partner]</strong> in the subject line, and state that they are a paid promotion.</li>
        <li>Sponsored social posts use each platform's paid partnership label.</li>
        <li>Sponsored links carry rel=&quot;sponsored&quot; so search engines treat them as paid.</li>
      </ul>
      <h2>The disclaimer shown with every placement</h2>
      <blockquote style={{ margin: 0, padding: "14px 18px", background: "var(--surface)", borderLeft: "3px solid var(--yellow)" }}>{SPONSOR_DISCLAIMER}</blockquote>
      <h2>Editorial independence</h2>
      <p>Sponsors do not see, review or influence editorial content before or after publication. Sponsoring a briefing does not buy coverage. Editors may cover a sponsor, including critically, and will disclose the commercial relationship when they do.</p>
      <h2>What we review before accepting</h2>
      <ul>
        <li>The advertiser&apos;s identity, licences and, for issuers, current disclosure documents.</li>
        <li>Copy is checked for promises of returns, price targets, misleading statements and missing risk warnings.</li>
        <li>Offers of securities must comply with the securities law of every market where the offer is promoted, and the advertiser is responsible for that compliance.</li>
      </ul>
      <h2>What we do not accept</h2>
      <ul>
        <li>Guaranteed or projected returns, or price targets.</li>
        <li>Unlicensed financial products or advice.</li>
        <li>Binary options, signal groups, unregistered crypto schemes or anything we cannot verify.</li>
      </ul>
      <h2>Measurement</h2>
      <p>We count email sends and web views of sponsored blocks, and clicks on sponsor links. We share these totals with sponsors. We never share subscriber email addresses or personal data with sponsors.</p>
    </LegalDoc>
  );
}
