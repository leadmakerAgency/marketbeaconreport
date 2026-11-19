import { signupIndex } from "@/lib/article";
import { InlineSignup } from "./InlineSignup";

export function Article({ blocks, desk, source, disclosure, figure, children }: { blocks: string[]; desk: string; source: string; disclosure?: string; figure?: React.ReactNode; children?: React.ReactNode }) {
  const at = signupIndex(blocks);
  return (
    <div className="wrap article-wrap">
      <article className="article">
        {figure}
        {disclosure && <div className="disclosure" role="note">{disclosure}</div>}
        <div dangerouslySetInnerHTML={{ __html: blocks.slice(0, at).join("") }} />
        <InlineSignup desk={desk} variant="mid" source={source} />
        <div dangerouslySetInnerHTML={{ __html: blocks.slice(at).join("") }} />
        {children}
        <p className="warning"><strong>General advice warning.</strong> This briefing is general information only. It does not take into account your objectives, financial situation or needs, and is not a recommendation to buy or sell any financial product. <a href="/disclaimer">Read the full disclaimer</a>.</p>
        <InlineSignup desk={desk} variant="end" source={source} />
      </article>
    </div>
  );
}
