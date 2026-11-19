import { DESKS } from "@/lib/config";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="cols">
          <div>
            <h5>{SITE.name}</h5>
            <p style={{ margin: 0, maxWidth: "34ch" }}>Independent market briefings on stocks, mining and minerals, and technology for self-directed investors.</p>
          </div>
          <div>
            <h5>Briefings</h5>
            <ul>{DESKS.map((d) => <li key={d.slug}><a href={`/desks/${d.slug}`}>{d.name}</a></li>)}</ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="/about">About and methodology</a></li>
              <li><a href="/archive">Archive</a></li>
              <li><a href="/advertise">Advertise</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li><a href="/disclaimer">General advice warning</a></li>
              <li><a href="/sponsorship-policy">Sponsorship policy</a></li>
              <li><a href="/privacy">Privacy policy</a></li>
              <li><a href="/terms">Terms of use</a></li>
              <li><a href="/impressum">Impressum</a></li>
            </ul>
          </div>
        </div>
        <div className="warn">
          <strong style={{ color: "#fff" }}>General advice warning.</strong> Everything published by {SITE.name} is general information only. It does not take into
          account your objectives, financial situation or needs and is not a recommendation to buy or sell any financial product. Consider whether it suits you
          and seek independent advice before acting. Past performance is not a reliable indicator of future performance. Sponsored content is labelled.
        </div>
        <div className="legal">
          <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
          <span>editor@marketbeaconreport.com</span>
        </div>
      </div>
    </footer>
  );
}
