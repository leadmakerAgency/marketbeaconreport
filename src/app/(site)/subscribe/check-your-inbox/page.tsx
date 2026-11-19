import type { Metadata } from "next";
import { CheckInbox } from "@/components/CheckInbox";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata: Metadata = { title: "Check your inbox", robots: { index: false } };

export default function Page() {
  return (
    <>
      <section className="hero">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">One more step</div>
            <h1 className="h1">Check your inbox to confirm.</h1>
            <CheckInbox part="intro" />
          </div>
          <div className="card">
            <h2>Can&rsquo;t find it?</h2>
            <div className="tips">
              <div><b>Wait a minute</b><span>It usually arrives within 60 seconds.</span></div>
              <div><b>Check junk</b><span>Look in spam, junk or promotions for an email from <strong>editor@marketbeaconreport.com</strong>.</span></div>
              <div><b>Mark it safe</b><span>If you find it there, mark it as not spam so future briefings reach your inbox.</span></div>
            </div>
            <CheckInbox part="actions" />
          </div>
        </div>
      </section>
      <ProfileForm />
      <section className="section">
        <div className="wrap narrow">
          <h2 className="h2" style={{ marginBottom: 18 }}>What happens next</h2>
          <ol className="steps">
            <li><div><h3>Confirm your email</h3><p>One click in the email we just sent. This stops anyone signing you up without your permission.</p></div></li>
            <li><div><h3>Get a welcome email</h3><p>It lists exactly what arrives and when.</p></div></li>
            <li><div><h3>Your first briefing</h3><p>Arrives on the next scheduled day for each briefing you picked.</p></div></li>
          </ol>
        </div>
      </section>
    </>
  );
}
