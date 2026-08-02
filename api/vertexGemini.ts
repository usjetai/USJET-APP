/**
 * Vertex AI Gemini — Origin Aura brain on the Founder's GCP project.
 * Auth: GOOGLE_SERVICE_ACCOUNT_JSON (same pattern as SEO indexing).
 */

export type VertexChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type VertexConfig = {
  project: string;
  location: string;
  model: string;
  credentials: Record<string, unknown>;
};

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

/** True when GCP project + service account JSON are present. */
export function resolveVertexConfig(): VertexConfig | null {
  const project = trimEnv(process.env.VERTEX_AI_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT);
  const location = trimEnv(process.env.VERTEX_AI_LOCATION ?? process.env.GOOGLE_CLOUD_LOCATION) || "us-central1";
  const model = trimEnv(process.env.VERTEX_AI_MODEL) || "gemini-2.0-flash-001";
  const credRaw = trimEnv(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  if (!project || !credRaw) {
    return null;
  }
  try {
    const credentials = JSON.parse(credRaw) as Record<string, unknown>;
    if (!credentials || typeof credentials !== "object") {
      return null;
    }
    return { project, location, model, credentials };
  } catch {
    return null;
  }
}

type VertexPart = { text: string };
type VertexContent = { role: "user" | "model"; parts: VertexPart[] };

/** Gemini API key from Cloud Console → "Create Gemini API key" (Google AI). */
export function resolveGeminiApiKey(): string {
  return trimEnv(
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? process.env.GOOGLE_API_KEY,
  );
}

function toVertexPayload(messages: VertexChatMessage[]) {
  const systemText = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join("\n\n");

  const contents: VertexContent[] = [];
  for (const message of messages) {
    if (message.role === "system") {
      continue;
    }
    const role: "user" | "model" = message.role === "assistant" ? "model" : "user";
    const text = message.content.trim();
    if (!text) {
      continue;
    }
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text = `${last.parts[0].text}\n\n${text}`;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  if (!contents.length) {
    contents.push({ role: "user", parts: [{ text: "Hello." }] });
  }
  if (contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Continue as Origin." }] });
  }

  return {
    ...(systemText
      ? {
          systemInstruction: {
            parts: [{ text: systemText }],
          },
        }
      : {}),
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };
}

async function getAccessToken(credentials: Record<string, unknown>): Promise<string> {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) {
    throw new Error("Could not obtain Vertex access token from service account.");
  }
  return token;
}

function extractReplyText(payload: unknown): string {
  const data = payload as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string };
  };
  if (data.error?.message) {
    throw new Error(data.error.message);
  }
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
  if (!text) {
    throw new Error("No reply text from Vertex Gemini.");
  }
  return text;
}

/** Call Vertex generateContent for Origin chat turns. */
export async function completeVertexGemini(messages: VertexChatMessage[]): Promise<string> {
  const config = resolveVertexConfig();
  if (!config) {
    throw new Error("Vertex Gemini is not configured.");
  }

  const token = await getAccessToken(config.credentials);
  const url =
    `https://${config.location}-aiplatform.googleapis.com/v1/` +
    `projects/${config.project}/locations/${config.location}/` +
    `publishers/google/models/${config.model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toVertexPayload(messages)),
  });

  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    /* keep null */
  }

  if (!response.ok) {
    const detail =
      parsed && typeof parsed === "object" && parsed !== null && "error" in parsed
        ? String((parsed as { error?: { message?: string } }).error?.message ?? raw)
        : raw;
    throw new Error(detail || `Vertex Gemini failed (${response.status})`);
  }

  return extractReplyText(parsed);
}

/**
 * Google AI Gemini via API key (Welcome → Create Gemini API key).
 * Still billed/associated to the GCP project — simplest founder path.
 */
export async function completeGeminiApiKey(messages: VertexChatMessage[]): Promise<string> {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  const model = trimEnv(process.env.GEMINI_MODEL) || "gemini-2.0-flash";
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toVertexPayload(messages)),
  });

  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    /* keep null */
  }

  if (!response.ok) {
    const detail =
      parsed && typeof parsed === "object" && parsed !== null && "error" in parsed
        ? String((parsed as { error?: { message?: string } }).error?.message ?? raw)
        : raw;
    throw new Error(detail || `Gemini API failed (${response.status})`);
  }

  return extractReplyText(parsed);
}
