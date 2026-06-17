export type PartnershipApplicationPayload = {
  institution_name: string;
  department: string;
  corporate_hq: string;
  contact_name: string;
  contact_email: string;
  scope_ticker_placement: boolean;
  scope_api_gateway: boolean;
  scope_direct_sponsorship: boolean;
  budget_tier: string;
  verification_code: string;
  submitted_at: string;
};

const APPLICATIONS_URL = import.meta.env.VITE_PARTNERSHIP_APPLICATIONS_URL ?? "/api/partnership-applications";

export async function submitPartnershipApplication(payload: PartnershipApplicationPayload): Promise<boolean> {
  try {
    const r = await fetch(APPLICATIONS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return r.ok;
  } catch {
    return false;
  }
}
