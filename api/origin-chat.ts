/**
 * Origin Aura compatibility endpoint — zero-cost onboard answers only.
 * No Gemini / OpenRouter billing. Prefer the in-app knowledge brain;
 * this route stays for older clients and returns a short ship briefing.
 */

type ApiChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type OriginChatBody = {
  messages?: ApiChatMessage[];
};

type ApiRequest = {
  method?: string;
  body?: OriginChatBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: OriginChatBody | string | undefined): OriginChatBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as OriginChatBody;
    } catch {
      return {};
    }
  }
  return body;
}

function lastUserText(messages: ApiChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.role === "user" && message.content.trim()) {
      return message.content.trim();
    }
  }
  return "";
}

function onboardReply(userText: string): string {
  const q = userText.toLowerCase();
  if (!q.trim()) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nI'm Origin — onboard command. Ask about Hangar, Fleet, tiers, login, or a partner bay.";
  }
  if (/(price|tier|flight pass|hangar pro|enterprise)/.test(q)) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nStripe only: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo. Verify at /member/login.";
  }
  if (/(hangar|fleet|login|founder|intel|jet browser)/.test(q)) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nHangar (/), Fleet (/fleet), Jet Browser (/jet-browser), Intel (/intel). Login is Stripe-only at /member/login — no OAuth.";
  }
  return "Welcome to U. S. Jet.\n\nFlight Plan\nOrigin runs on ship knowledge at zero cloud cost. Open /origin in the app for the full onboard brain — fleet bays, tiers, Hangar, and ops.";
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = parseBody(req.body);
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }

  return res.status(200).json({ reply: onboardReply(lastUserText(messages)) });
}
