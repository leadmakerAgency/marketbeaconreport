import "server-only";

const API = process.env.BREVO_API_BASE || "https://api.brevo.com/v3";

export class BrevoError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function brevoConfigured() {
  return Boolean(process.env.BREVO_API_KEY);
}

async function call<T = any>(path: string, init: RequestInit & { allow404?: boolean; revalidate?: number } = {}): Promise<T | null> {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new BrevoError(503, "BREVO_API_KEY is not set");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "api-key": key, accept: "application/json", "content-type": "application/json", ...(init.headers || {}) },
    ...(init.revalidate ? { next: { revalidate: init.revalidate } } : { cache: "no-store" as const }),
  });
  if (res.status === 404 && init.allow404) return null;
  if (res.status === 204) return {} as T;
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new BrevoError(res.status, json?.message || res.statusText);
  return json as T;
}

export type Contact = {
  id: number;
  email: string;
  emailBlacklisted: boolean;
  listIds: number[];
  attributes: Record<string, any>;
  modifiedAt?: string;
  createdAt?: string;
};

export const brevo = {
  getContact: (email: string) => call<Contact>(`/contacts/${encodeURIComponent(email)}`, { allow404: true }),

  upsertContact: (email: string, attributes: Record<string, unknown>, listIds?: number[]) =>
    call(`/contacts`, { method: "POST", body: JSON.stringify({ email, attributes, listIds, updateEnabled: true }) }),

  updateContact: (email: string, body: { attributes?: Record<string, unknown>; listIds?: number[]; unlinkListIds?: number[]; emailBlacklisted?: boolean }) =>
    call(`/contacts/${encodeURIComponent(email)}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteContact: (email: string) => call(`/contacts/${encodeURIComponent(email)}`, { method: "DELETE", allow404: true }),

  doubleOptIn: (opts: { email: string; listIds: number[]; templateId: number; redirectionUrl: string; attributes?: Record<string, unknown> }) =>
    call(`/contacts/doubleOptinConfirmation`, {
      method: "POST",
      body: JSON.stringify({ email: opts.email, includeListIds: opts.listIds, templateId: opts.templateId, redirectionUrl: opts.redirectionUrl, attributes: opts.attributes }),
    }),

  sendTemplate: (opts: { templateId: number; to: { email: string; name?: string }; params?: Record<string, unknown>; tags?: string[] }) =>
    call(`/smtp/email`, {
      method: "POST",
      body: JSON.stringify({ templateId: opts.templateId, to: [opts.to], params: opts.params, tags: opts.tags }),
    }),

  sendHtml: (opts: { to: string; subject: string; html: string; replyTo?: string }) =>
    call(`/smtp/email`, {
      method: "POST",
      body: JSON.stringify({
        sender: { name: "Market Beacon Report", email: "editor@marketbeaconreport.com" },
        to: [{ email: opts.to }],
        subject: opts.subject,
        htmlContent: opts.html,
        replyTo: opts.replyTo ? { email: opts.replyTo } : undefined,
      }),
    }),

  listContacts: (listId: number, opts: { limit?: number; offset?: number; modifiedSince?: string } = {}) => {
    const q = new URLSearchParams({ limit: String(opts.limit ?? 500), offset: String(opts.offset ?? 0) });
    if (opts.modifiedSince) q.set("modifiedSince", opts.modifiedSince);
    return call<{ contacts: Contact[]; count: number }>(`/contacts/lists/${listId}/contacts?${q}`);
  },

  sentCampaigns: (opts: { limit?: number; offset?: number } = {}) => {
    const q = new URLSearchParams({ status: "sent", type: "classic", limit: String(opts.limit ?? 100), offset: String(opts.offset ?? 0), sort: "desc", excludeHtmlContent: "true" });
    return call<{ campaigns: Campaign[]; count: number }>(`/emailCampaigns?${q}`, { revalidate: 600 });
  },

  campaign: (id: number) => call<Campaign>(`/emailCampaigns/${id}`, { allow404: true, revalidate: 3600 }),
};

export type Campaign = {
  id: number;
  name: string;
  subject: string;
  previewText?: string;
  tag?: string;
  status: string;
  sentDate?: string;
  scheduledAt?: string;
  createdAt?: string;
  htmlContent?: string;
  shareLink?: string;
};
