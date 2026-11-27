# CMS setup: Sveltia CMS (GitHub)

Website posts are written in Sveltia CMS at **https://marketbeaconreport.com/admin**.
Each post is a Markdown file in `content/posts/`; photos go in `public/images/posts/`.
Saving in the CMS commits straight to `main` on GitHub (`leadmakerAgency/marketbeaconreport`), and Vercel puts it live a minute or two later.

Brevo briefings are separate: tagged campaigns still appear at `/briefings/<id>-<title>` on their own. The CMS only manages website posts.

## Signing in

You need a GitHub account with write access to `leadmakerAgency/marketbeaconreport`.

1. On GitHub go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Resource owner: `leadmakerAgency`. Repository access: only `marketbeaconreport`.
3. Permissions: **Contents: Read and write** (Metadata: Read-only is added automatically).
4. Pick an expiry date, generate, and copy the token.
5. Open `/admin`, click **Sign In Using Access Token** and paste it. The browser remembers it until you sign out.

The **Sign In with GitHub** button does not work yet: it needs a small sign-in service (a GitHub OAuth app plus an auth server, e.g. Sveltia CMS Authenticator on Cloudflare Workers). If we add one, put its URL in `public/admin/config.yml` as `backend.base_url`.

## Writing a post

1. **Posts → New Post.**
2. Fill in:
   - **Title**, **Desk**, **Preview text** (shown under the title, in the archive and in Google).
   - **Slug**: the web address, `/briefings/<slug>`. Leave blank to make one from the title. Don't change it once the post is live, or old links break.
   - **Date and time**: when the post goes live.
   - **Disclosure** (optional): a box above the article, e.g. for sponsored posts.
   - **Photo** (required): upload a wide image (at least 1600 px across; it is cropped to 16:9), then alt text, caption, credit and licence.
   - **Body**: the article. Use **Heading 2** for section titles. A **quote** block becomes the yellow highlighted box, e.g. `**The number:** US$141 billion. ...`
   - **Sources**: one entry per source, label and link.
3. **Save.** The post goes live after the Vercel deploy finishes.

The two blue signup boxes are added by the site, not the editor: one just before the first section heading past the middle of the post, one at the end after the advice warning. Using Heading 2 for sections is what lets the middle box find its place.

## Drafts and scheduling

- **Draft** on: saved to GitHub, never shown on the site.
- **Date in the future**: hidden until that time. Pages refresh hourly, so it can take up to an hour after the set time to appear.
- When running the site locally (`npm run dev`), drafts and future posts are shown, marked "Not published".

## Testing locally

```
npm install
npm run dev
```

Open http://localhost:3000/admin and choose **Work with Local Repository** (Chrome or Edge), then pick this project folder. Edits are written to your local files instead of GitHub, so you can check a post at http://localhost:3000/briefings/<slug> before pushing.

## Autoblog (n8n)

`automation/n8n-autoblog-market-beacon.json` is an n8n workflow that writes and publishes one post a day, like the South Africa SDR autoblog.

Every day at 10:00 (n8n's time zone) it:

1. Takes the first keyword in the Google Sheet with **Used = No** and sets it to **Yes**.
2. Writes a headline (gpt-5-mini) and saves it in the sheet's **Title** column.
3. Writes the article (gpt-5-mini) in Market Beacon's house style: plain English, 700 to 1,100 words, `##` sections, one `> **The takeaway:**` box, and a closing "What we're watching" section. The prompt forbids invented figures, quotes and events, and buy or sell advice.
4. Writes an image prompt and generates a 1536 x 1024 JPEG photo (gpt-image-2) with no text or logos.
5. Commits the photo to `public/images/posts/` and the post to `content/posts/YYYY-MM-DD-<slug>.md` on `main`. Vercel puts it live a minute or two later. The photo caption says "AI-generated illustration."

### Setting it up

1. **Merge the CMS branch into `main` first.** The workflow writes posts in the new format, which the old site code can't read.
2. Make a Google Sheet with a header row: `Keyword | Desk | Title | Used`. Fill one keyword per row, set **Used** to `No`, and **Desk** to one of `The Weekly Beacon`, `Stocks`, `Mining and Minerals`, `Technology` (blank = The Weekly Beacon).
3. In n8n: **Import from File** and choose the JSON.
4. Open the three Google Sheets nodes (**Get Keyword**, **Mark keyword as Used**, **Save Title**) and pick your new sheet and tab. They use the same credentials as the South Africa workflow (Lead Agency Spreadsheet, Mark OpenAI Key, leadmakerAgency github); reselect them if n8n asks.
5. Run it once with **Test workflow**, check the post on the live site and in `/admin`, then switch the workflow to **Active**.

To have posts saved as drafts for review instead of going live, set `const DRAFT = true;` at the top of the **Normalize** node.

To change the prompts or nodes, edit `automation/build-workflow.mjs` and run `node automation/build-workflow.mjs automation/n8n-autoblog-market-beacon.json`, or edit the workflow in n8n directly.

## Updating Sveltia

`public/admin/index.html` loads a pinned version (`@sveltia/cms@0.265.0`) so the editor doesn't change without warning. To update, change the version there, test locally, then push.
