/**
 * B2B Enterprise briefing requests — lead generation only (no Stripe).
 */

type InquiryBody = {
  professional_name_title?: string;
  company_name?: string;
  industry?: string;
  fleet_staff_size?: string;
  primary_pain_point?: string;
  contact_email?: string;
  contact_phone?: string;
  briefing_notes?: string;
  verification_code?: string;
  submitted_at?: string;
};

type ApiRequest = {
  method?: string;
  body?: InquiryBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: InquiryBody | string | undefined): InquiryBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as InquiryBody;
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
  const professional = raw.professional_name_title?.trim();
  const company = raw.company_name?.trim();
  const industry = raw.industry?.trim();
  const fleetStaff = raw.fleet_staff_size?.trim();
  const painPoint = raw.primary_pain_point?.trim();
  const contactEmail = raw.contact_email?.trim().toLowerCase();

  if (!professional || !company || !industry || !fleetStaff || !painPoint || !contactEmail) {
    return res.status(400).json({ error: "Missing required briefing fields." });
  }

  const record = {
    professional_name_title: professional,
    company_name: company,
    industry,
    fleet_staff_size: fleetStaff,
    primary_pain_point: painPoint,
    contact_email: contactEmail,
    contact_phone: raw.contact_phone?.trim() || null,
    briefing_notes: raw.briefing_notes?.trim() || null,
    verification_code: raw.verification_code?.trim() || "unknown",
    submitted_at: raw.submitted_at ?? new Date().toISOString(),
  };

  console.log("[usjet-b2b-enterprise-inquiries]", JSON.stringify(record));

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.B2B_ENTERPRISE_INQUIRIES_TABLE?.trim() || "b2b_enterprise_inquiries";

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("[usjet-b2b-enterprise-inquiries] Supabase insert failed", response.status, text);
      }
    } catch (error) {
      console.error("[usjet-b2b-enterprise-inquiries] Supabase insert error", error);
    }
  }

  return res.status(200).json({ ok: true, verificationCode: record.verification_code });
}
