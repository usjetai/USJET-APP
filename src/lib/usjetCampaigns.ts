/** Crowdfunding — set VITE_INDIEGOGO_URL in Vercel env when the campaign is live. */
export const INDIEGOGO_CAMPAIGN_URL = import.meta.env.VITE_INDIEGOGO_URL?.trim() ?? "";

export function hasIndiegogoCampaign(): boolean {
  return INDIEGOGO_CAMPAIGN_URL.length > 0 && /^https?:\/\//i.test(INDIEGOGO_CAMPAIGN_URL);
}

/** Wefunder Form C reservation page — set VITE_WEFUNDER_RESERVATION_URL when live. */
export const WEFUNDER_RESERVATION_URL = import.meta.env.VITE_WEFUNDER_RESERVATION_URL?.trim() ?? "";

/** Live campaign slug — used when env is unset (covenant bridge routes here). */
export const WEFUNDER_CAMPAIGN_DEFAULT_URL = "https://wefunder.com/usjet.llc" as const;

export function hasWefunderReservation(): boolean {
  return WEFUNDER_RESERVATION_URL.length > 0 && /^https?:\/\//i.test(WEFUNDER_RESERVATION_URL);
}

/** Reservation destination for CTAs (env override, else planted slug). */
export function getWefunderReservationUrl(): string {
  return hasWefunderReservation() ? WEFUNDER_RESERVATION_URL : WEFUNDER_CAMPAIGN_DEFAULT_URL;
}

export const WEFUNDER_GOAL_DISPLAY = "$50,000" as const;

export const WEFUNDER_RESERVATION_FALLBACK_ROUTE = "/b2b" as const;
