/**
 * Origin Realtime availability probe — OpenAI key stays server-side.
 * Browser never receives the secret; SDP is proxied via /api/origin-realtime-call.
 */

type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = resolveOpenAiKey();
  const customWs = (process.env.ORIGIN_S2S_WS_URL ?? "").trim();
  /** Prefer custom S2S WS (PCM16 append protocol) when configured; else OpenAI WebRTC. */
  const transport = customWs ? "websocket" : apiKey ? "webrtc" : "none";

  return res.status(200).json({
    available: Boolean(apiKey) || Boolean(customWs),
    provider: customWs ? "custom-s2s" : apiKey ? "openai-realtime" : "none",
    model: resolveModel(),
    transport,
    customWsConfigured: Boolean(customWs),
    /** Public load-balancer / HF S2S endpoint — only returned when ORIGIN_S2S_WS_URL is set. */
    wsUrl: customWs || null,
  });
}
