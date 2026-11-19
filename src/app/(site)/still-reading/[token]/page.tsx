import type { Metadata } from "next";
import { stillReading } from "../../actions";

export const metadata: Metadata = { title: "Stay subscribed", robots: { index: false } };

export default async function StillReading({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ done?: string }> }) {
  const { token } = await params;
  const { done } = await searchParams;
  return (
    <section className="hero">
      <div className="wrap" style={{ paddingBlock: "64px 72px", maxWidth: 760 }}>
        <div className="eyebrow">Stay subscribed</div>
        {done ? (
          <>
            <h1 className="h1">Thanks. You&rsquo;re staying on the list.</h1>
            <p className="lede">Your briefings will keep arriving as normal. Want fewer? <a href={`/manage/${token}`}>Choose your briefings</a>.</p>
          </>
        ) : (
          <>
            <h1 className="h1">Keep your briefings coming?</h1>
            <p className="lede" style={{ marginBottom: 24 }}>Press the button and we&rsquo;ll keep you subscribed.</p>
            <form action={stillReading}><input type="hidden" name="token" value={token} /><button className="btn" type="submit">Yes, keep me subscribed</button></form>
          </>
        )}
      </div>
    </section>
  );
}
