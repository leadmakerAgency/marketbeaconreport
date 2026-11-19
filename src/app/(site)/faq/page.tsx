import type { Metadata } from "next";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = { title: "FAQ", description: "Answers to common questions about Market Beacon Report." };

export default function FaqPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero"><div className="wrap"><div className="eyebrow">FAQ</div><h1 className="h1">Frequently asked questions</h1></div></section>
      <section className="section"><div className="wrap narrow faq">{FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
    </>
  );
}
