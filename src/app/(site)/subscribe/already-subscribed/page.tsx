import type { Metadata } from "next";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata: Metadata = { title: "You're already subscribed", robots: { index: false } };

export default function Page() {
  return (
    <>
    <section className="hero">
      <div className="wrap" style={{ paddingBlock: "64px 72px", maxWidth: 760 }}>
        <div className="eyebrow">Already subscribed</div>
        <h1 className="h1">You&rsquo;re already on the list.</h1>
        <p className="lede">This email address is already subscribed, so there&rsquo;s nothing to confirm. We&rsquo;ve added any new briefings you picked and sent you an email with the full list and a link to manage them.</p>
        <p style={{ marginTop: 26 }}><a className="btn" href="/archive">Read recent briefings</a></p>
      </div>
    </section>
    <ProfileForm />
    </>
  );
}
