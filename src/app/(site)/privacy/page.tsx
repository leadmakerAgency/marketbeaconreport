import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: "How Market Beacon Report collects, uses and protects your personal information." };

export default function Privacy() {
  const email = contactEmail();
  return (
    <LegalDoc title="Privacy policy" updated="12 November 2026">
      <p>This policy explains what personal information Market Beacon Report collects and how we handle it, in line with the EU General Data Protection Regulation (GDPR) and German data protection law for readers in the EU, Canada&rsquo;s PIPEDA and anti-spam law (CASL), US CAN-SPAM rules and the Australian Privacy Principles.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address and, if you give them, your first name, country, investing experience and investing style.</li>
        <li>The briefings you choose, the date you signed up and confirmed, and the page you signed up from.</li>
        <li>Whether the emails we send are delivered, opened or clicked, reported by our email provider.</li>
        <li>If you unsubscribe and choose to tell us why, the reason you picked.</li>
      </ul>
      <h2>Legal basis</h2>
      <p>We email you on the basis of your consent (GDPR Article 6(1)(a); express consent under CASL), which you give through double opt-in and can withdraw at any time. We keep signup records to prove that consent (legitimate interests, Article 6(1)(f)).</p>
      <h2>How we use it</h2>
      <p>Only to send the briefings you chose, a welcome email after you confirm, emails that go to every subscriber (Market Flash alerts, the Monthly Review and labelled partner offers), and to measure and improve our emails. We never sell or rent your information and never give subscriber details to sponsors.</p>
      <h2>Service providers</h2>
      <p>We use Brevo (Sendinblue SAS, France) to store subscriber records and send email, and Vercel to host the website. They process data on our behalf. Brevo stores data in the EU. Vercel may process website requests in other countries, including the United States, under standard contractual clauses.</p>
      <h2>Your choices and rights</h2>
      <ul>
        <li>Unsubscribe at any time using the link in every email. One-click unsubscribe is supported by major email providers.</li>
        <li>Change your briefings from the Manage your briefings page linked in every email.</li>
        <li>Ask for a copy of your data, a correction, or permanent deletion by emailing {email}.</li>
      </ul>
      <h2>Cookies and analytics</h2>
      <p>The website uses cookieless analytics to count page views. We don&rsquo;t use advertising cookies or tracking pixels on the website. Our emails contain standard open and click tracking from Brevo.</p>
      <h2>Retention</h2>
      <p>Unconfirmed signups are deleted after about nine days. If you unsubscribe, we keep your email address on a suppression list so we don&rsquo;t email you again by mistake. Ask us to delete it entirely and we will.</p>
      <h2>Contact and complaints</h2>
      <p>Email {email}. If you&rsquo;re not satisfied with our response, contact your data protection authority: in Germany, the authority for your federal state; in Canada, the Office of the Privacy Commissioner (priv.gc.ca); in Australia, the OAIC (oaic.gov.au).</p>
    </LegalDoc>
  );
}
