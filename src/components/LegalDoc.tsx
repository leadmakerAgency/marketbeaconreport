export function LegalDoc({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="page-hero"><div className="wrap"><div className="eyebrow">Legal</div><h1 className="h1">{title}</h1><p className="mono hint">Last updated {updated}</p></div></section>
      <div className="wrap doc narrow">{children}</div>
    </>
  );
}
