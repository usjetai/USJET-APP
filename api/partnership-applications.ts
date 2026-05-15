/**
 * Institutional PDRE (Prime Digital Real Estate) prospectus submissions.
 *
 * Supabase: create table `partnership_applications` (or map env PARTNERSHIP_APPLICATIONS_TABLE)
 * with columns matching the `record` object below (snake_case). Service role key is server-only.
 */

type ApplicationBody = {
  institution_name?: string;
  department?: string;
  corporate_hq?: string;
  contact_name?: string;
  contact_email?: string;
  scope_ticker_placement?: boolean;
  scope_api_gateway?: boolean;
  scope_direct_sponsorship?: boolean;
  budget_tier?: string;
  verification_code?: string;
  submitted_at?: string;
};

type ApiRequest = {
  method?: string;
  body?: ApplicationBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: ApplicationBody | string | undefined): ApplicationBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as ApplicationBody;
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

  const raw = parseBody(req.body);
  const institution = raw.institution_name?.trim();
  const department = raw.department?.trim();
  const hq = raw.corporate_hq?.trim();
  const contactName = raw.contact_name?.trim();
  const contactEmail = raw.contact_email?.trim().toLowerCase();
  const budget = raw.budget_tier?.trim();

  if (!institution || !department || !hq || !contactName || !contactEmail || !budget) {
    return res.status(400).json({ error: "Missing required application fields." });
  }

  const record = {
    institution_name: institution,
    department,
    corporate_hq: hq,
    contact_name: contactName,
    contact_email: contactEmail,
    scope_ticker_placement: Boolean(raw.scope_ticker_placement),
    scope_api_gateway: Boolean(raw.scope_api_gateway),
    scope_direct_sponsorship: Boolean(raw.scope_direct_sponsorship),
    budget_tier: budget,
    verification_code: raw.verification_code?.trim() || "unknown",
    submitted_at: raw.submitted_at ?? new Date().toISOString(),
  };

  console.log("[usjet-partnership-applications]", JSON.stringify(record));

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.PARTNERSHIP_APPLICATIONS_TABLE?.trim() || "partnership_applications";

  if (supabaseUrl && supabaseKey) {
    try {
      const r = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!r.ok) {
        const text = await r.text().catch(() => "");
        console.error("[usjet-partnership-applications] Supabase insert failed", r.status, text);
      }
    } catch (error) {
      console.error("[usjet-partnership-applications] Supabase insert error", error);
    }
  }

  return res.status(200).json({ ok: true, verificationCode: record.verification_code });
}
