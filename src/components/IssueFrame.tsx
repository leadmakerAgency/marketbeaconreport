"use client";
import { useRef } from "react";

/** Shows the sent email exactly as subscribers saw it, isolated from the site's styles. */
export function IssueFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  return (
    <iframe
      ref={ref}
      className="issue-frame"
      title={title}
      srcDoc={html}
      sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      onLoad={() => {
        const f = ref.current;
        try { if (f?.contentDocument) f.style.height = f.contentDocument.documentElement.scrollHeight + 8 + "px"; } catch {}
      }}
    />
  );
}
