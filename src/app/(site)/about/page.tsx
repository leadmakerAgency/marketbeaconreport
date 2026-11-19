import type { Metadata } from "next";

export const metadata: Metadata = { title: "About and methodology", description: "Who writes Market Beacon Report, how briefings are made, and the rules we write by." };

const STEPS = [
  ["Monitor", "Editors watch exchange announcements, filings, regulator releases, central bank calendars and commodity benchmarks across the US, Canada and Germany."],
  ["Select", "Every item has to pass one test: would a self-directed investor change what they watch because of it? If not, it's cut."],
  ["Write", "Each item says what happened, why it matters and what to watch next. Numbers are checked against the source."],
  ["Review and send", "A second editor checks accuracy and balance before the briefing goes out at its scheduled time."],
];
const STANDARDS = [
  ["Primary sources", "Every fact is checked against the announcement, filing or official data release it came from. We link the source where we can."],
  ["Editorial and sponsorship stay separate", "Sponsors never see, review or influence editorial copy. Sponsored blocks are written by the advertiser and labelled."],
  ["Holdings are disclosed", "If a writer holds a position in a company covered, the briefing says so. Writers don't trade a stock within 48 hours of covering it."],
  ["No tips or price targets", "We explain what happened and why it matters. We don't issue buy, sell or hold calls."],
  ["Corrections", "Material errors are corrected on the web version with a dated note, and in the next issue of the same briefing."],
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">About</div>
          <h1 className="h1">Market briefings for people who make their own decisions.</h1>
          <p className="lede">Market Beacon Report covers stocks, mining and minerals, and technology across the United States, Canada and Germany. Short, sourced briefings so you can keep up without a terminal.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-2">
          <div><div className="eyebrow">Methodology</div><h2 className="h2">How a briefing is made</h2></div>
          <ol className="steps">{STEPS.map(([h, p]) => <li key={h}><div><h3>{h}</h3><p>{p}</p></div></li>)}</ol>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap grid-2">
          <div><div className="eyebrow">Editorial standards</div><h2 className="h2">The rules we write by</h2></div>
          <ul className="steps">{STANDARDS.map(([h, p]) => <li key={h}><div><h3>{h}</h3><p>{p}</p></div></li>)}</ul>
        </div>
      </section>
    </>
  );
}
