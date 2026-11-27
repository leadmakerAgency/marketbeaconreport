import Image from "next/image";
import type { PostImage } from "@/lib/posts";

export function PostFigure({ img }: { img: PostImage }) {
  return (
    <figure className="post-figure">
      <Image src={img.src} width={img.width} height={img.height} alt={img.alt} sizes="(max-width: 760px) 100vw, 720px" priority />
      {(img.caption || img.credit) && (
        <figcaption>
          {img.caption}{" "}
          {img.credit && (
            <span className="credit">
              Photo: {img.creditUrl ? <a href={img.creditUrl} target="_blank" rel="noopener nofollow">{img.credit}</a> : img.credit}
              {/wikimedia\.org/i.test(img.creditUrl) && " / Wikimedia Commons"}
              {img.license && (img.licenseUrl ? <>, <a href={img.licenseUrl} target="_blank" rel="noopener nofollow">{img.license}</a></> : <>, {img.license}</>)}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
