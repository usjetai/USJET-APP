/**
 * USJET Brand Licensing & Authorized Partner applications.
 *
 * Supabase: create table `brand_licensing_applications` (or map env BRAND_LICENSING_APPLICATIONS_TABLE)
 * with columns matching the `record` object below (snake_case).
 */

type ApplicationBody = {
  business_name?: string;
  contact_name?: string;
  contact_email?: string;
  business_type?: string;
  territory?: string;
  proposed_use?: string;
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
  const businessName = raw.business_name?.trim();
  const contactName = raw.contact_name?.trim();
  const contactEmail = raw.contact_email?.trim().toLowerCase();
  const businessType = raw.business_type?.trim();
  const territory = raw.territory?.trim();
  const proposedUse = raw.proposed_use?.trim();

  if (!businessName || !contactName || !contactEmail || !businessType || !territory || !proposedUse) {
    return res.status(400).json({ error: "Missing required application fields." });
  }

  const record = {
    business_name: businessName,
    contact_name: contactName,
    contact_email: contactEmail,
    business_type: businessType,
    territory,
    proposed_use: proposedUse,
    verification_code: raw.verification_code?.trim() || "unknown",
    submitted_at: raw.submitted_at ?? new Date().toISOString(),
  };

  console.log("[usjet-brand-licensing-applications]", JSON.stringify(record));

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.BRAND_LICENSING_APPLICATIONS_TABLE?.trim() || "brand_licensing_applications";

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
        console.error("[usjet-brand-licensing-applications] Supabase insert failed", r.status, text);
      }
    } catch (error) {
      console.error("[usjet-brand-licensing-applications] Supabase insert error", error);
    }
  }

  return res.status(200).json({ ok: true, verificationCode: record.verification_code });
}
