import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = { title: "Terms of use", description: "Terms that apply to the Market Beacon Report website and emails." };

export default function Terms() {
  return (
    <LegalDoc title="Terms of use" updated="12 November 2026">
      <h2>Using our content</h2>
      <p>You may read, share links to and quote short extracts from Market Beacon Report with attribution. You may not republish whole briefings, resell them or use them to train automated systems without written permission.</p>
      <h2>No advice</h2>
      <p>Our content is general information only. Read the <a href="/disclaimer">general advice warning</a> before relying on anything we publish.</p>
      <h2>Subscriptions</h2>
      <p>Subscriptions are free. We may change the briefings we offer, their schedule or their format. We may end any subscription that is used abusively.</p>
      <h2>Third-party links and sponsors</h2>
      <p>We are not responsible for the content of websites we link to, including sponsor websites. Sponsored content is the responsibility of the advertiser.</p>
      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows when they last changed. Continuing to use the service means you accept the current terms.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of New South Wales, Australia.</p>
    </LegalDoc>
  );
}
