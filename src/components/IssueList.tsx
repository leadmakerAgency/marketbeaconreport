import type { ArchiveItem } from "@/lib/archive";
import { fmtDate } from "@/lib/archive";

export function IssueList({ items, empty }: { items: ArchiveItem[]; empty?: string }) {
  if (!items.length)
    return <div className="empty">{empty ?? "The first briefings are being prepared. Subscribe and they will arrive in your inbox the day they are published."}</div>;
  return (
    <div className="issues">
      {items.map((i) => (
        <article key={i.id}>
          <div className="kicker"><b>{i.label}</b><span>{fmtDate(i.date, { month: "short" })}</span></div>
          <h3><a href={i.href}>{i.title}</a></h3>
          {i.preview && <p>{i.preview}</p>}
        </article>
      ))}
    </div>
  );
}
