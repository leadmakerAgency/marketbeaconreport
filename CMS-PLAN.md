# Plan: Sveltia CMS for Market Beacon Report

Goal: manage Market Beacon Report blog posts through Sveltia CMS at `/admin`, the same way the South Africa SDR site does.

## How South Africa SDR does it (reference: `Desktop/South-Africa-SDR-main`)

- **Admin page:** `admin/index.html` loads Sveltia CMS from a CDN. It has no backend of its own.
- **Settings:** `admin/config.yml` uses the GitHub backend (`leadmakerAgency/South-Africa-SDR`, branch `main`). It defines one "Blog Posts" collection: title, slug, date, draft, excerpt, featured image, tags and body.
- **Where posts live:** each post is a Markdown file in `content/posts/`, with images in `content/media/`. When an editor saves, the CMS commits those files straight to GitHub. Vercel then rebuilds the site.
- **Showing posts:** Eleventy builds the blog from those files at deploy time. Drafts and future-dated posts are hidden in production (`lib/post-visibility.js`).

Market Beacon is Next.js, not Eleventy. So we copy the CMS part (admin page, Markdown files in GitHub, auto-deploy) and write a small Next.js loader in place of the Eleventy build.

## Steps

1. **Move the posts into the CMS folder.**
   Move the 10 exported posts from `posts/` to `content/posts/`. Take the title, preview, photo and sources out of the body, because the page draws those from the header fields. Photos stay in `public/images/posts/`.

2. **Add the admin page.**
   Add `public/admin/index.html` with a fixed Sveltia version (South Africa loads whatever version is newest, which can break without warning). Add a redirect in `next.config.ts` so `/admin` opens it.

3. **Add `public/admin/config.yml`.**
   It points at `leadmakerAgency/marketbeaconreport`, branch `main`. Media folder: `public/images/posts`, public path `/images/posts`. The fields follow what Market Beacon posts already have:
   - title, slug, date and time, draft
   - desk: a dropdown with The Weekly Beacon (`weekly`), Stocks (`stocks`), Mining and Minerals (`mining`), Technology (`tech`)
   - preview text and an optional disclosure
   - photo with alt text, caption, credit, credit link and licence
   - sources: a list of label and link
   - body in Markdown. A quote line (`>`) becomes the "The number" highlighted box.

4. **Change where the site reads posts.**
   `src/lib/posts.ts` reads `content/posts/*.md` instead of holding the posts in code. It turns Markdown into the same blocks the article page uses today, and hides drafts and future-dated posts the way South Africa does. The `Post` type stays the same, so the archive, desk pages, homepage card, sitemap and post pages keep working with only small edits. `src/lib/post-images.ts` goes away, because photo details move into each post and the photo size is read from the image file. `next.config.ts` gets the `content/` folder added to `outputFileTracingIncludes` so the files ship with the server.

5. **Keep the two signup boxes at fixed places.**
   Every post keeps the two blue signup boxes it has today, with the signup form inside. No new boxes are added.
   - **Middle box** ("Less hype. More insight."): moves to just before the first section heading (`##`) past the halfway point of the post, so it never cuts a section in two. Today it sits at the first heading after one third; change `signupIndex` in `src/lib/article.ts`. If a post has no heading past the half, it goes after the middle block.
   - **End box** ("Get the next one before the market opens."): stays at the end, after the sources and the general advice warning.
   - The site places both boxes on its own. Editors cannot move or remove them in the CMS, and nothing about them goes in the Markdown files.
   - This applies to all posts: CMS posts and Brevo briefings, since both use `src/components/Article.tsx`.
   - The Markdown loader (step 4) must give each heading, paragraph, list and quote as its own block, so the box can find the headings.

6. **Leave Brevo alone.**
   Tagged Brevo campaigns keep becoming posts at `/briefings/<id>-<title>` as now. The CMS only manages the website posts. The only change they get is the new middle box position from step 5.

7. **Sign-in.**
   Like South Africa, editors sign in with a GitHub account that can write to the repo. South Africa's config has no sign-in server, which as far as we know means signing in with a GitHub token pasted into the admin page. Option: add a small sign-in service for a one-click "Login with GitHub" button.

8. **Test before pushing.**
   Run `npm run build`, check that all 10 posts look the same as on the live site (apart from the middle box now sitting past the half), that every post shows both signup boxes in the right places, open `/admin`, and add a test post. Every push to `main` goes live on Vercel, so all of this is done locally first.

9. **Write setup notes.**
   Add a `CMS-SETUP.md` like South Africa's, covering how to sign in, write and publish.

## Status

Built on branch `claude/cms-blog-layout-boxes-1bfecb` (2026-11-27), not pushed yet.

- Steps 1 to 6, 8 and 9 are done. `npm run build` passes; all 10 posts render the same text, photos and sources as the live site, each with both signup boxes; archive, desk pages and sitemap list them; `/admin` loads Sveltia CMS 0.265.0.
- Not tested: signing in to `/admin` and saving a post through the CMS (needs a GitHub token, see `CMS-SETUP.md`). A CMS-style post file was tested instead.
- Step 7: sign-in is by GitHub access token for now; the one-click "Sign In with GitHub" button needs a sign-in service we haven't added.
