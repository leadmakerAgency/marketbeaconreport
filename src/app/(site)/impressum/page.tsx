import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { contactEmail, postalAddress, publisherName } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", description: "Publisher details for Market Beacon Report under German law." };

export default function Impressum() {
  const name = publisherName() || "[Publisher name: set PUBLISHER_NAME]";
  const address = postalAddress();
  return (
    <LegalDoc title="Impressum" updated="12 November 2026">
      <p>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz). Information under section 5 of the German Digital Services Act.</p>
      <h2>Publisher (Anbieter)</h2>
      <p>{name}<br />Market Beacon Report<br />{address}</p>
      <h2>Contact (Kontakt)</h2>
      <p>Email: {contactEmail()}</p>
      <h2>Responsible for content (Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV)</h2>
      <p>{name}, {address}</p>
      <h2>No investment advice (Keine Anlageberatung)</h2>
      <p>All content is general information only and is not investment advice or a recommendation to buy or sell financial instruments. Alle Inhalte dienen ausschließlich der allgemeinen Information und stellen keine Anlageberatung dar. See the <a href="/disclaimer">general advice warning</a>.</p>
      <h2>Dispute resolution (Streitbeilegung)</h2>
      <p>We are not obliged or willing to take part in dispute resolution proceedings before a consumer arbitration board.</p>
    </LegalDoc>
  );
}
