import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = { title: "General advice warning", description: "The general advice warning and disclaimer that applies to all Market Beacon Report content." };

export default function Disclaimer() {
  return (
    <LegalDoc title="General advice warning and disclaimer" updated="12 November 2026">
      <h2>General information only</h2>
      <p>
        All content published by Market Beacon Report, including emails, web pages and social media posts, is general information only. It does
        not take into account your objectives, financial situation or needs. It is not personal financial advice and is not a recommendation to
        buy, sell or hold any financial product.
      </p>
      <p>
        Before making any investment decision, consider whether the information is appropriate to your circumstances, read the relevant product
        disclosure statement, prospectus or offer document, and consider seeking advice from a licensed financial adviser.
      </p>
      <h2>Risk</h2>
      <p>
        Investing involves risk, including the loss of your capital. Past performance is not a reliable indicator of future performance. Shares in
        small-cap, exploration-stage and pre-revenue companies are highly speculative and can be illiquid. Commodity prices and exchange rates can
        move sharply.
      </p>
      <h2>Accuracy</h2>
      <p>
        We take care to check facts against primary sources, but information can change quickly and errors can occur. We do not guarantee that
        any information is complete, accurate or current. Market data may be delayed.
      </p>
      <h2>Holdings and conflicts</h2>
      <p>
        Writers and staff may hold positions in companies mentioned. Where a writer holds a position in a company covered, it is disclosed in that
        briefing. Writers do not trade a stock within 48 hours before or after covering it.
      </p>
      <h2>Sponsored content</h2>
      <p>
        Some content is paid for by sponsors. It is always labelled Sponsored or Paid promotion, names the advertiser and is not written by our
        editorial team. See the <a href="/sponsorship-policy">sponsorship policy</a>.
      </p>
      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, Market Beacon Report and its writers accept no liability for any loss arising from reliance on
        its content.
      </p>
    </LegalDoc>
  );
}
