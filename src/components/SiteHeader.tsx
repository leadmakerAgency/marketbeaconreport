"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/desks/stocks", label: "Stocks" },
  { href: "/desks/mining-minerals", label: "Mining" },
  { href: "/desks/technology", label: "Tech" },
  { href: "/archive", label: "Archive" },
  { href: "/advertise", label: "Advertise" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="masthead">
      <div className="wrap row">
        <Logo />
        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} aria-current={path?.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </a>
          ))}
          <a className="btn small" href="/#subscribe">
            Subscribe free
          </a>
        </nav>
      </div>
    </header>
  );
}
