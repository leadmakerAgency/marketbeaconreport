# Market Beacon Report

Next.js 15 site for marketbeaconreport.com. Brevo is the whole backend: subscribers, lists, double opt-in, transactional emails and campaigns. No database.

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it in Vercel (or drag the folder into vercel.com/new).
2. Framework Preset: **Next.js** (vercel.json sets it, but check it isn't "Other").
3. Add the environment variables from `.env.example` (Production and Preview). Generate secrets with `openssl rand -hex 32`.
4. Deploy, then add `marketbeaconreport.com` and `www` under Project > Domains and set the Namecheap records Vercel shows you.

## Brevo setup (already done)

| Thing | ID |
|---|---|
| Lists: Weekly Beacon / Stocks / Mining and Minerals / Technology | 4 / 5 / 6 / 7 |
| List: Pending confirmation (never mail this) | 8 |
| List: Sponsorship enquiries | 9 |
| Transactional: confirm (DOI), reminder, already subscribed, welcome, goodbye | 1, 2, 3, 4, 5 |
| Campaign templates: weekly, stocks, mining, tech, monthly, flash, promo, winback | 7 to 14 |

Contact attributes: COUNTRY, EXPERIENCE, RISK_APPETITE (create these three as Text in Brevo > Contacts > Settings > Contact attributes), SOURCE, REFERRER, SIGNUP_AT, WELCOMED, REMINDED, MANAGE_TOKEN, UNSUB_REASON, PENDING_DESKS, LAST_ENGAGED, COMPANY.

## Brevo setup (you do once the site is live)

1. **Webhook.** Brevo > Settings > Webhooks > Add a marketing webhook.
   URL: `https://marketbeaconreport.com/api/brevo/webhook?key=<BREVO_WEBHOOK_SECRET>`
   Events: *Contact added to list* and *Unsubscribed*. This sends the welcome email the moment someone confirms. The daily cron is a backstop.
2. **Sender domain.** Add the DKIM, Brevo code, SPF and DMARC records Brevo shows for marketbeaconreport.com, then click Authenticate.
3. **Plan.** Standard (removes Brevo branding, unlocks send-time features).

## How signup works

1. Form posts to `/api/subscribe`. The contact is saved to the Pending list and Brevo sends the confirmation email (template 1).
2. Clicking the button adds them to the chosen lists and redirects to `/welcome`.
3. Brevo fires the webhook, the site sends the welcome email (template 4) and takes them off Pending.
4. Not confirmed after 2 days: one reminder (template 2). After 9 days the unconfirmed contact is deleted.
5. Already subscribed and signs up again: new briefings are added and template 3 goes out instead.

## Sending a briefing

Create a campaign in Brevo from the matching template, send to that briefing's list, and **set the campaign tag** to one of `weekly`, `stocks`, `mining`, `tech`, `monthly`, `flash`. Tagged campaigns become blog posts at /briefings/<id>-<title> and show on the homepage card and archive within 10 minutes. The subject line is the post title and the preview text is its summary, so write both for readers and Google. `promo` and `winback` are never shown on the site.

Flash and Monthly go to lists 4, 5, 6 and 7 together (Brevo de-duplicates).

## Website sponsors

Edit `src/lib/sponsors.ts`. Set `active: true`, the real URL and which briefings it shows on. Email sponsor blocks live in the campaign itself.

## Local development

```
npm install
cp .env.example .env.local   # fill in BREVO_API_KEY and SITE_SECRET at minimum
npm run dev
```

## Routes

Public: `/`, `/desks/[slug]`, `/archive`, `/issues/[id]`, `/about`, `/advertise`, `/faq`, `/contact`, legal pages.
Subscriber flow: `/subscribe/check-your-inbox`, `/subscribe/already-subscribed`, `/welcome`, `/manage/[token]`, `/unsubscribed`, `/confirm-again/[token]`, `/still-reading/[token]`.
API: `/api/subscribe`, `/api/resend`, `/api/enquiry`, `/api/brevo/webhook`, `/api/cron` (daily, 20:00 UTC).
