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
 *
 * Mail is deliberately NOT used here: usjet.ai publishes DMARC p=quarantine, so
 * anything sent outside Porkbun's own SMTP lands silently in spam. Silently is
 * the problem. Adding a sender means changing SPF first.
 *
 * The response is 200 whenever the submission was captured, even if Discord is
 * down or unconfigured. Nobody filling in a form should be told their details
 * were lost because a webhook failed.
 */

type WaitingListBody = {
  name?: string;
  email?: string;
  role?: string;
  quantity?: string;
  location?: string;
  notes?: string;
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

const MAX = {
  name: 120,
  email: 200,
  role: 80,
  quantity: 20,
  location: 120,
  notes: 2000,
} as const;

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
  // Strip control characters so nothing can forge lines in the log or in Discord.
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

  const entry = {
    at: new Date().toISOString(),
    name,
    email,
    role: clean(raw.role, MAX.role),
    quantity: clean(raw.quantity, MAX.quantity),
    location: clean(raw.location, MAX.location),
    notes: clean(raw.notes, MAX.notes),
  };

  // Path 1 - always. Recoverable from the function logs with no setup at all.
  console.log("WAITLIST " + JSON.stringify(entry));

  // Path 2 - best effort notification.
  await notifyDiscord(
    [
      "**New rig reservation**",
      "**Name** " + entry.name,
      "**Email** " + entry.email,
      entry.role ? "**Work** " + entry.role : "",
      entry.quantity ? "**Rigs** " + entry.quantity : "",
      entry.location ? "**Where** " + entry.location : "",
      entry.notes ? "**Notes** " + entry.notes : "",
    ].filter(Boolean),
  );

  return res.status(200).json({ ok: true });
}
