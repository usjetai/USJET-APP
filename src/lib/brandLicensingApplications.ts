export type BrandLicensingApplicationPayload = {
  business_name: string;
  contact_name: string;
  contact_email: string;
  business_type: string;
  territory: string;
  proposed_use: string;
  verification_code: string;
  submitted_at: string;
};

const APPLICATIONS_URL =
  import.meta.env.VITE_BRAND_LICENSING_APPLICATIONS_URL ?? "/api/brand-licensing-applications";

export async function submitBrandLicensingApplication(
  payload: BrandLicensingApplicationPayload,
): Promise<boolean> {
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
