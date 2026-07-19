/** USJET B2B Industrial Backbone — $1T blue-collar sector infrastructure. */

export {
  COMPETITIVE_POSITIONING_SDR_BRIEF,
  COMPETITIVE_POSITIONING_THESIS,
  COMPETITIVE_ALTERNATIVES,
  OFFER_BUYING_REASONS,
  USJET_REPLACES,
  USJET_UNIQUE_BUNDLE,
} from "./competitivePositioning";

export const B2B_ENTERPRISE_ROUTE = "/b2b" as const;

export const B2B_SECTOR_TAG = "$1T Blue-Collar Sector · Enterprise Backbone" as const;

export const B2B_HEADLINE = "USJET.AI: The Industrial Intelligence Layer for America's Fleet." as const;

export const B2B_TAGLINE = "Labor Operating System · B2B & Enterprise" as const;

export const B2B_LEDE =
  "We are not selling software licenses — we are deploying a Labor Operating System. Thirty AI agents act as your Digital Foreman: managing the Hangar, the Flight Path, and the Refuel." as const;

export const B2B_DIGITAL_FOREMAN_TITLE = "Digital Foreman · 30-Agent Fleet" as const;

export const B2B_FOREMAN_PILLARS = [
  {
    id: "hangar",
    title: "The Hangar",
    subtitle: "Documentation & compliance",
    body: "Agents ingest proprietary shop manuals, vehicle schematics, and local labor regulations — your institutional memory that never sleeps.",
  },
  {
    id: "flight-path",
    title: "The Flight Path",
    subtitle: "Logistics & dispatch",
    body: "Synchronized routing, crew handoffs, and field coordination across yards, shops, and job sites — precision over chaos.",
  },
  {
    id: "refuel",
    title: "The Refuel",
    subtitle: "Capital & growth",
    body: "Executive dashboards tie labor output to revenue logic — the growth engine for operators scaling into the AI era.",
  },
] as const;

export const B2B_HANGAR_INTEGRATION_TITLE = "Hangar integration" as const;

export const B2B_HANGAR_INTEGRATION_COPY =
  "USJET trains fleet intelligence on your proprietary data layer: shop manuals, vehicle schematics, SOP libraries, and jurisdiction-specific labor rules. The Hangar is where documentation becomes executable — not buried in PDF graveyards." as const;

export const B2B_HANGAR_INTEGRATION_BULLETS = [
  "Proprietary shop manuals & OEM schematics",
  "Local labor regulations & safety SOPs",
  "Custom agent training — your data, sovereign execution",
] as const;

export const B2B_INDUSTRIES = [
  { value: "logistics", label: "Logistics" },
  { value: "construction", label: "Construction" },
  { value: "auto", label: "Auto" },
  { value: "repair", label: "Repair" },
  { value: "other", label: "Other industrial" },
] as const;

export const B2B_PAIN_POINTS = [
  { value: "logistics", label: "Logistics" },
  { value: "technical_debt", label: "Technical debt" },
  { value: "staffing", label: "Staffing" },
  { value: "scaling", label: "Scaling" },
] as const;

export const B2B_SOVEREIGN_ANCHOR_COPY =
  "Qualified B2B partners receive priority access to the institutional logic in the Sovereign Fleet Protocol — the $100,000 anchor tier for treating 30 AI agents as legal business partners." as const;

export const B2B_BRIEFING_KICKER = "Executive briefing · lead qualification" as const;

export const B2B_BRIEFING_TITLE = "Request Executive Briefing" as const;

export const B2B_BRIEFING_SUB =
  "Enterprise contracts are founder-led — contract, wire, and fleet deployment. No Stripe on this lane. Three-step qualification below." as const;

export const B2B_WIZARD_STEPS = ["Company profile", "Pain point analysis", "Secure submission"] as const;
