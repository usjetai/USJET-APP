type PartnershipBody = {
  bayId?: string;
  label?: string;
  action?: string;
  path?: string;
  timestamp?: string;
  sessionId?: string;
};

type ApiRequest = {
  method?: string;
  body?: PartnershipBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: PartnershipBody | string | undefined): PartnershipBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as PartnershipBody;
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const event = parseBody(req.body);

  const record = {
    bayId: event.bayId ?? "unknown",
    label: event.label ?? "unknown",
    action: event.action ?? "unknown",
    path: event.path ?? "/",
    timestamp: event.timestamp ?? new Date().toISOString(),
    sessionId: event.sessionId ?? "anonymous",
  };

  console.log("[usjet-partnership-analytics]", JSON.stringify(record));

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/partnership_events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
    } catch (error) {
      console.error("[usjet-partnership-analytics] Supabase insert failed", error);
    }
  }

  return res.status(200).json({ ok: true });
}
