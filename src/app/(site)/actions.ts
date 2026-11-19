"use server";
import { redirect } from "next/navigation";
import { brevo } from "@/lib/brevo";
import { emailFromToken } from "@/lib/tokens";
import { DESKS, DESK_LIST_IDS, LISTS } from "@/lib/config";
import { resendConfirmation, sendGoodbye } from "@/lib/subscribers";

const today = () => new Date().toISOString().slice(0, 10);

function emailOr404(token: string) {
  const email = emailFromToken(token);
  if (!email) redirect("/manage/invalid");
  return email;
}

export async function savePreferences(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  const wanted = formData.getAll("desk").map(Number).filter((id) => DESK_LIST_IDS.includes(id));
  if (!wanted.length) redirect(`/manage/${token}?confirmUnsub=1`);
  const c = await brevo.getContact(email);
  if (!c) redirect("/manage/invalid");
  const current = c.listIds.filter((id) => DESK_LIST_IDS.includes(id));
  const add = wanted.filter((id) => !current.includes(id));
  const remove = current.filter((id) => !wanted.includes(id));
  const firstName = String(formData.get("firstName") ?? "").trim().slice(0, 60);
  await brevo.updateContact(email, {
    attributes: { FIRSTNAME: firstName, LAST_ENGAGED: today() },
    ...(add.length ? { listIds: add } : {}),
    ...(remove.length ? { unlinkListIds: remove } : {}),
  });
  redirect(`/manage/${token}?saved=1`);
}

export async function unsubscribeAll(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  const c = await brevo.getContact(email);
  if (c && !c.emailBlacklisted) {
    await brevo.updateContact(email, { emailBlacklisted: true, unlinkListIds: c.listIds.filter((id) => DESK_LIST_IDS.includes(id)) });
    await sendGoodbye(email, c.attributes?.FIRSTNAME).catch(() => {});
  }
  redirect(`/unsubscribed?t=${encodeURIComponent(token)}`);
}

export async function resubscribe(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  const only = String(formData.get("only") ?? "");
  const desk = DESKS.find((d) => d.slug === only);
  await brevo.updateContact(email, { emailBlacklisted: false, listIds: [desk ? desk.listId : LISTS.weekly], attributes: { LAST_ENGAGED: today() } });
  redirect(`/manage/${token}?saved=1`);
}

export async function weeklyOnly(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  const c = await brevo.getContact(email);
  const remove = (c?.listIds ?? []).filter((id) => DESK_LIST_IDS.includes(id) && id !== LISTS.weekly);
  await brevo.updateContact(email, { emailBlacklisted: false, listIds: [LISTS.weekly], ...(remove.length ? { unlinkListIds: remove } : {}), attributes: { LAST_ENGAGED: today() } });
  redirect(`/manage/${token}?saved=1`);
}

export async function saveReason(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailFromToken(token);
  const reason = String(formData.get("reason") ?? "").slice(0, 120);
  if (email && reason) await brevo.updateContact(email, { attributes: { UNSUB_REASON: reason } }).catch(() => {});
  redirect(`/unsubscribed?t=${encodeURIComponent(token)}&thanks=1`);
}

export async function confirmAgain(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  await resendConfirmation(email).catch(() => {});
  redirect(`/confirm-again/${token}?sent=1`);
}

export async function stillReading(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const email = emailOr404(token);
  await brevo.updateContact(email, { attributes: { LAST_ENGAGED: today() } }).catch(() => {});
  redirect(`/still-reading/${token}?done=1`);
}
