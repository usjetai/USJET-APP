/**
 * Waiting-list intake.
 *
 * Storage deliberately has no database and no third-party form service:
 *
 *  1. Every submission is written to the function log. That happens with zero
 *     configuration, so a signup is never lost even before anything is set up.
 *  2. If WAITLIST_DISCORD_WEBHOOK is set, the submission is also pushed to
 *     Discord, which puts it on a phone within seconds. Discord is already the
 *     help desk, so that is the notification path.
 *  3. If WAITLIST_SMTP_USER and WAITLIST_SMTP_PASS are set, the submission is
 *     also mailed to the business's own mailbox, ops@usjet.ai. The harness on
 *     the Mac reads that mailbox on every run, and neither the function log
 *     nor Discord is visible to it. A signup that only exists in those two
 *     places never reaches the dashboard.
 *
 * On mail and DMARC: usjet.ai publishes DMARC p=quarantine, so anything sent
 * outside Porkbun's own SMTP lands silently in spam. Silently is the problem.
 * That is why path 3 goes through smtp.porkbun.com, authenticated as the
 * mailbox itself: that IS the domain's mail server, so SPF, DKIM and DMARC
 * all pass without touching a DNS record. Any other sender would need SPF
 * changed first. Do not "simplify" this to a third-party mail API.
 *
 * The response is 200 whenever the submission was captured, even if Discord
 * or the mail server is down or unconfigured. Nobody filling in a form should
 * be told their details were lost because a webhook failed.
 */

import { createTransport } from "nodemailer";

type WaitingListBody = {
  name?: string;
  email?: string;
  role?: string;
  quantity?: string;
  location?: string;
  notes?: string;
  /** Where they came from. Sent by the form, never typed by the person:
   *  the utm tag on the link they clicked, or the site that referred them.
   *  Without this a signup is anonymous about its own origin and there is no
   *  way to tell a Reddit reader from an Instagram one except by asking. */
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  /** Honeypot - a real person leaves this empty. */
  company?: string;
};

type ApiRequest = {
  method?: string;
  body?: WaitingListBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

type Entry = {
  at: string;
  name: string;
  email: string;
  role: string;
  quantity: string;
  location: string;
  notes: string;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
};

const MAX = {
  name: 120,
  email: 200,
  role: 80,
  quantity: 20,
  location: 120,
  notes: 2000,
  source: 60,
  medium: 60,
  campaign: 80,
  referrer: 200,
} as const;

/** The mailbox the harness reads. Path 3 always lands here, whoever sends it. */
const OPS_MAILBOX = "ops@usjet.ai";

/** Porkbun's outgoing server, implicit TLS. Per
 *  kb.porkbun.com/article/146-email-client-configuration-settings. */
const SMTP_HOST = "smtp.porkbun.com";
const SMTP_PORT = 465;

function parseBody(body: WaitingListBody | string | undefined): WaitingListBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as WaitingListBody;
    } catch {
      return {};
    }
  }
  return body;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") {
    return "";
  }
  // Strip control characters so nothing can forge lines in the log, in
  // Discord, or in the one-field-per-line mail body.
  return value.replace(/[\x00-\x1f\x7f]+/g, " ").trim().slice(0, max);
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function notifyDiscord(lines: string[]): Promise<void> {
  const webhook = process.env.WAITLIST_DISCORD_WEBHOOK;
  if (!webhook) {
    return;
  }
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "USJET waiting list",
        // Submitted text is untrusted; never let it ping anyone.
        allowed_mentions: { parse: [] },
        content: lines.join("\n").slice(0, 1900),
      }),
    });
  } catch {
    // Best effort only. Never allowed to fail the submission.
  }
}

/**
 * The mail body is one field per line, `key: value`, in a fixed order with
 * notes last. The harness parses it line by line, so the order and the key
 * names are part of the contract with agents/postmaster.js - change both or
 * neither. Every key is always present, even when empty, so the parser never
 * has to guess.
 */
function mailBody(entry: Entry): string {
  return [
    "name: " + entry.name,
    "email: " + entry.email,
    "role: " + entry.role,
    "quantity: " + entry.quantity,
    "location: " + entry.location,
    "source: " + entry.source,
    "campaign: " + entry.campaign,
    "referrer: " + entry.referrer,
    "at: " + entry.at,
    "notes: " + entry.notes,
  ].join("\n");
}

async function notifyMailbox(entry: Entry): Promise<void> {
  const user = process.env.WAITLIST_SMTP_USER;
  const pass = process.env.WAITLIST_SMTP_PASS;
  // Same rule as Discord: unset means skip, quietly. A missing mail setting
  // must never fail a signup.
  if (!user || !pass) {
    return;
  }
  try {
    const transport = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user, pass },
      // The person is waiting on this response. A slow mail server gets a
      // few seconds, not the whole function budget.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
    await transport.sendMail({
      // From is the authenticated mailbox so DMARC alignment holds; To is
      // always the ops mailbox because that is the one the harness reads.
      from: user,
      to: OPS_MAILBOX,
      subject: "WAITLIST: " + entry.name,
      text: mailBody(entry),
    });
  } catch (error) {
    // Best effort only. The log line above already has the signup; this just
    // says why the copy did not reach the mailbox. Never includes credentials.
    const reason = error instanceof Error ? error.message : String(error);
    console.log("WAITLIST mail not sent: " + reason.slice(0, 200));
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const raw = parseBody(req.body);

  // Honeypot: bots fill every field they find. Answer 200 so they stop retrying.
  if (clean(raw.company, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(raw.name, MAX.name);
  const email = clean(raw.email, MAX.email);

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  if (!looksLikeEmail(email)) {
    return res.status(400).json({ error: "That email address does not look right." });
  }

  const entry: Entry = {
    at: new Date().toISOString(),
    name,
    email,
    role: clean(raw.role, MAX.role),
    quantity: clean(raw.quantity, MAX.quantity),
    location: clean(raw.location, MAX.location),
    notes: clean(raw.notes, MAX.notes),
    source: clean(raw.source, MAX.source) || "direct",
    medium: clean(raw.medium, MAX.medium),
    campaign: clean(raw.campaign, MAX.campaign),
    referrer: clean(raw.referrer, MAX.referrer),
  };

  // Path 1 - always. Recoverable from the function logs with no setup at all.
  console.log("WAITLIST " + JSON.stringify(entry));

  // Paths 2 and 3 - best effort, side by side so neither waits on the other.
  await Promise.all([
    notifyDiscord(
      [
        "**New rig reservation**",
        "**Name** " + entry.name,
        "**Email** " + entry.email,
        entry.role ? "**Work** " + entry.role : "",
        entry.quantity ? "**Rigs** " + entry.quantity : "",
        entry.location ? "**Where** " + entry.location : "",
        entry.notes ? "**Notes** " + entry.notes : "",
        "**Came from** " + entry.source + (entry.campaign ? " / " + entry.campaign : ""),
      ].filter(Boolean),
    ),
    notifyMailbox(entry),
  ]);

  return res.status(200).json({ ok: true });
}
