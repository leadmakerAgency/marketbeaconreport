import type { Metadata } from "next";
import { ARCHIVE_TAGS } from "@/lib/config";
import { archive } from "@/lib/archive";
import { IssueList } from "@/components/IssueList";

export const metadata: Metadata = { title: "Archive", description: "Every published Market Beacon Report briefing." };
export const revalidate = 600;

export default async function Archive({ searchParams }: { searchParams: Promise<{ desk?: string }> }) {
  const { desk } = await searchParams;
  const tag = desk && ARCHIVE_TAGS[desk] ? desk : undefined;
  const items = await archive(tag);
  return (
    <>
      <section className="page-hero"><div className="wrap"><div className="eyebrow">Archive</div><h1 className="h1">Every published briefing</h1><p className="lede">Subscribers get each one in their inbox on the day it is published.</p></div></section>
      <section className="section">
        <div className="wrap">
          <nav className="filters" aria-label="Filter by briefing">
            <a href="/archive" aria-current={!tag ? "true" : undefined}>All</a>
            {Object.entries(ARCHIVE_TAGS).map(([k, v]) => <a key={k} href={`/archive?desk=${k}`} aria-current={tag === k ? "true" : undefined}>{v}</a>)}
          </nav>
          <IssueList items={items} empty={tag ? "Nothing published in this briefing yet." : undefined} />
        </div>
      </section>
    </>
  );
}
