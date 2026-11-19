export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap" style={{ paddingBlock: "64px 72px", maxWidth: 760 }}>
        <div className="eyebrow">404</div>
        <h1 className="h1">That page isn&rsquo;t here.</h1>
        <p className="lede" style={{ marginBottom: 24 }}>It may have moved, or the link was mistyped.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><a className="btn" href="/">Go to the homepage</a><a className="btn ghost" href="/archive">Browse the archive</a></div>
      </div>
    </section>
  );
}
