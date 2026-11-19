import type { Metadata } from "next";
import { confirmAgain } from "../../actions";

export const metadata: Metadata = { title: "Confirm your subscription", robots: { index: false } };

export default async function ConfirmAgain({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ sent?: string }> }) {
  const { token } = await params;
  const { sent } = await searchParams;
  return (
    <section className="hero">
      <div className="wrap" style={{ paddingBlock: "64px 72px", maxWidth: 760 }}>
        <div className="eyebrow">Confirm your subscription</div>
        {sent ? (
          <>
            <h1 className="h1">Check your inbox.</h1>
            <p className="lede">We&rsquo;ve sent a fresh confirmation link. Click the button in it and your briefings start on their next scheduled day. Check junk if it doesn&rsquo;t arrive in a minute.</p>
          </>
        ) : (
          <>
            <h1 className="h1">One click and you&rsquo;re subscribed.</h1>
            <p className="lede" style={{ marginBottom: 24 }}>Confirmation links expire, so we&rsquo;ll send you a fresh one.</p>
            <form action={confirmAgain}><input type="hidden" name="token" value={token} /><button className="btn" type="submit">Send me a new confirmation link</button></form>
          </>
        )}
      </div>
    </section>
  );
}
