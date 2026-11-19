import "server-only";
import { brevo, type Contact } from "./brevo";
import { DESKS, LISTS, TEMPLATES, DESK_LIST_IDS } from "./config";
import { manageToken } from "./tokens";
import { siteUrl } from "./site";

const today = () => new Date().toISOString().slice(0, 10);

export function desksForLists(listIds: number[]) {
  return DESKS.filter((d) => listIds.includes(d.listId)).map((d) => ({ name: d.name, when: d.sendTime }));
}

export function isSubscribed(c: Contact | null) {
  return Boolean(c && !c.emailBlacklisted && c.listIds.some((id) => DESK_LIST_IDS.includes(id)));
}

export function manageUrl(email: string) {
  return `${siteUrl()}/manage/${manageToken(email)}`;
}

/** Signup from the website form. Returns "pending" (confirmation sent) or "already" (existing subscriber updated). */
export async function subscribe(input: { email: string; firstName?: string; listIds: number[]; source?: string; ref?: string | null }) {
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName?.trim().slice(0, 60) || undefined;
  const existing = await brevo.getContact(email);

  if (isSubscribed(existing)) {
    const all = Array.from(new Set([...existing!.listIds, ...input.listIds]));
    await brevo.updateContact(email, {
      listIds: input.listIds,
      attributes: { MANAGE_TOKEN: manageToken(email), ...(firstName && !existing!.attributes?.FIRSTNAME ? { FIRSTNAME: firstName } : {}) },
    });
    await brevo.sendTemplate({
      templateId: TEMPLATES.already,
      to: { email, name: firstName },
      params: { FIRSTNAME: firstName || existing!.attributes?.FIRSTNAME || "", DESKS: desksForLists(all), MANAGE_URL: manageUrl(email) },
      tags: ["already-subscribed"],
    });
    return "already" as const;
  }

  const attributes: Record<string, unknown> = {
    SOURCE: input.source || "website",
    SIGNUP_AT: today(),
    REMINDED: false,
    WELCOMED: false,
    MANAGE_TOKEN: manageToken(email),
    PENDING_DESKS: input.listIds.join(","),
    ...(firstName ? { FIRSTNAME: firstName } : {}),
    ...(input.ref ? { REFERRER: input.ref.slice(0, 60) } : {}),
  };
  // Hold the signup on the Pending list (never mailed as a list) so the reminder job can find it.
  await brevo.upsertContact(email, attributes, [LISTS.pending]);
  await brevo.doubleOptIn({
    email,
    listIds: input.listIds,
    templateId: TEMPLATES.confirm,
    redirectionUrl: `${siteUrl()}/welcome`,
    attributes,
  });
  return "pending" as const;
}

/** Re-sends the confirmation email for a signup that has not been confirmed yet. Silent otherwise. */
export async function resendConfirmation(email: string) {
  const c = await brevo.getContact(email.trim().toLowerCase());
  if (!c || isSubscribed(c)) return false;
  const listIds = String(c.attributes?.PENDING_DESKS || LISTS.weekly)
    .split(",")
    .map(Number)
    .filter((id) => DESK_LIST_IDS.includes(id));
  await brevo.doubleOptIn({
    email: c.email,
    listIds: listIds.length ? listIds : [LISTS.weekly],
    templateId: TEMPLATES.confirm,
    redirectionUrl: `${siteUrl()}/welcome`,
  });
  return true;
}

/** Sends the welcome email once, after confirmation. Safe to call repeatedly. */
export async function welcomeIfNeeded(c: Contact) {
  if (!isSubscribed(c) || c.attributes?.WELCOMED === true) return false;
  await brevo.updateContact(c.email, {
    attributes: { WELCOMED: true, MANAGE_TOKEN: manageToken(c.email), LAST_ENGAGED: today() },
    unlinkListIds: c.listIds.includes(LISTS.pending) ? [LISTS.pending] : undefined,
  });
  await brevo.sendTemplate({
    templateId: TEMPLATES.welcome,
    to: { email: c.email, name: c.attributes?.FIRSTNAME || undefined },
    params: { FIRSTNAME: c.attributes?.FIRSTNAME || "", DESKS: desksForLists(c.listIds), MANAGE_URL: manageUrl(c.email) },
    tags: ["welcome"],
  });
  return true;
}

export async function sendGoodbye(email: string, firstName?: string) {
  if (process.env.SEND_GOODBYE_EMAIL === "false") return;
  await brevo.sendTemplate({ templateId: TEMPLATES.goodbye, to: { email }, params: { FIRSTNAME: firstName || "" }, tags: ["goodbye"] });
}
