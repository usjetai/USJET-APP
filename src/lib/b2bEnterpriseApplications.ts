export type B2bEnterpriseInquiryPayload = {
  professional_name_title: string;
  company_name: string;
  industry: string;
  fleet_staff_size: string;
  primary_pain_point: string;
  contact_email: string;
  contact_phone?: string;
  briefing_notes?: string;
  verification_code: string;
  submitted_at: string;
};

const INQUIRIES_URL = import.meta.env.VITE_B2B_ENTERPRISE_INQUIRIES_URL ?? "/api/b2b-enterprise-inquiries";

export async function submitB2bEnterpriseInquiry(payload: B2bEnterpriseInquiryPayload): Promise<boolean> {
  try {
    const response = await fetch(INQUIRIES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
