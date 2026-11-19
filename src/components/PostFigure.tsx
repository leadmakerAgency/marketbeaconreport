import Image from "next/image";
import type { PostImage } from "@/lib/post-images";

export function PostFigure({ img }: { img: PostImage }) {
  return (
    <figure className="post-figure">
      <Image src={img.src} width={img.width} height={img.height} alt={img.alt} sizes="(max-width: 760px) 100vw, 720px" priority />
      <figcaption>
        {img.caption}{" "}
        <span className="credit">
          Photo: <a href={img.creditUrl} target="_blank" rel="noopener nofollow">{img.credit}</a> / Wikimedia Commons
          {img.licenseUrl ? <>, <a href={img.licenseUrl} target="_blank" rel="noopener nofollow">{img.license}</a></> : <>, {img.license}</>}
        </span>
      </figcaption>
    </figure>
  );
}
