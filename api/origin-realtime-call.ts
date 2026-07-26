/**
 * Proxies OpenAI Realtime WebRTC SDP exchange so OPENAI_API_KEY never reaches the browser.
 * Protocol mirrors met4citizen/HeadAudio openai.html → POST /v1/realtime/calls
 */

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

function resolveOpenAiKey(): string {
  return (process.env.OPENAI_API_KEY ?? "").trim().replace(/^['"]|['"]$/g, "");
}

function resolveModel(): string {
  return (process.env.ORIGIN_REALTIME_MODEL ?? process.env.VITE_ORIGIN_REALTIME_MODEL ?? "gpt-realtime-mini")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function parseBody(body: unknown): { sdp?: string; session?: string } {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as { sdp?: string; session?: string };
    } catch {
      return {};
    }
  }
  if (typeof body === "object") {
    return body as { sdp?: string; session?: string };
  }
  return {};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = resolveOpenAiKey();
  if (!apiKey) {
    return res.status(503).json({
      error: "OPENAI_API_KEY is not configured. Set it in Vercel / .env.local for Origin Realtime S2S.",
    });
  }

  const { sdp, session } = parseBody(req.body);
  if (!sdp?.trim() || !session?.trim()) {
    return res.status(400).json({ error: "sdp and session JSON strings required" });
  }

  const model = resolveModel();
  const fd = new FormData();
  fd.set("sdp", sdp);
  fd.set("session", session);

  try {
    const response = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: fd,
    });

    const answerSdp = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        error: "OpenAI Realtime SDP exchange failed",
        detail: answerSdp.slice(0, 800),
      });
    }

    res.setHeader("Content-Type", "application/sdp");
    const location = response.headers.get("Location");
    if (location) {
      res.setHeader("X-OpenAI-Realtime-Location", location);
    }
    return res.status(200).send(answerSdp);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Realtime call failed";
    return res.status(502).json({ error: message });
  }
}
