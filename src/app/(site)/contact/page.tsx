import type { Metadata } from "next";
import { contactEmail } from "@/lib/site";
import { CopyField } from "@/components/CopyField";

export const metadata: Metadata = { title: "Contact", description: "How to reach the Market Beacon Report editors." };

export default function Contact() {
  return (
    <>
      <section className="page-hero"><div className="wrap"><div className="eyebrow">Contact</div><h1 className="h1">Contact the editors</h1><p className="lede">We reply to every email, usually within one business day.</p></div></section>
      <section className="section">
        <div className="wrap grid-2">
          <div className="card">
            <h3>Email</h3>
            <p className="muted" style={{ marginTop: 0 }}>Story tips, corrections, subscription help and sponsorship enquiries.</p>
            <CopyField value={contactEmail()} id="contact-email" label="Email address" />
            <p className="hint" style={{ marginTop: 12 }}>You can also reply to any briefing. Replies reach the editor.</p>
          </div>
          <div className="card">
            <h3>Quick links</h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              <li>Change or stop your briefings: use the Manage your briefings link at the bottom of any email.</li>
              <li>Sponsorship: <a href="/advertise#enquire">request pricing</a>.</li>
              <li>Corrections: email us with the briefing title and the error.</li>
              <li>Common questions: <a href="/faq">FAQ</a>.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
