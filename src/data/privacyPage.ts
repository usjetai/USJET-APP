/** Public privacy policy — `/privacy` */

import { SITE_ORIGIN } from "./siteSeo";

export const PRIVACY_ROUTE = "/privacy" as const;

export const PRIVACY_CANONICAL_URL = `${SITE_ORIGIN}${PRIVACY_ROUTE}` as const;

export const PRIVACY_PAGE_TITLE = "Privacy Policy · USJET.AI" as const;

export const PRIVACY_META_DESCRIPTION =
  "How USJET LLC collects, uses, and protects information on USJET.AI — Stripe-only payments, Member ID verification, integrated cockpit navigation, and no OAuth sign-in.";

export const PRIVACY_EFFECTIVE_DATE = "June 18, 2026" as const;

export const PRIVACY_ENTITY = "USJET LLC" as const;

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "This Privacy Policy describes how USJET LLC (\"USJET,\" \"we,\" \"us\") handles information when you use USJET.AI — the sovereign AI fleet cockpit, member surfaces, and integrated partner handoffs.",
      "By using the site, you acknowledge this policy. If you do not agree, do not use USJET.AI.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    paragraphs: ["We collect only what the product needs to operate clearance, billing alignment, and cockpit routing:"],
    bullets: [
      "Member verification inputs you submit on Member Login — billing email, founder-issued access sentence, and/or Stripe Member ID (cus_…).",
      "Browser-local session data after successful verification (stored in localStorage on your device, not on a separate social identity provider).",
      "Technical signals your browser sends automatically — IP address, user agent, referrer, and basic request logs needed for security and uptime.",
      "Voluntary correspondence when you email ops@usjet.ai or submit support forms.",
      "Usage within gated surfaces (Hangar, Intel, Origin, Member Portal) needed to honor your subscription tier and in-product features.",
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: ["We use collected information to:"],
    bullets: [
      "Verify Stripe-backed membership and open the correct clearance tier.",
      "Operate the fleet cockpit, Hangar bays, and integrated same-window partner handoffs.",
      "Respond to support requests and institutional partnership inquiries.",
      "Maintain site security, diagnose outages, and improve reliability.",
      "Meet legal, accounting, and fraud-prevention obligations tied to paid subscriptions.",
    ],
  },
  {
    id: "auth-payments",
    title: "Authentication & payments",
    paragraphs: [
      "USJET does not offer Google, Apple, or other OAuth sign-in. Clearance is Stripe-only: you pay through Stripe Payment Links, then verify with billing email plus your access sentence or Stripe Member ID.",
      "Stripe processes card and subscription data on its own hosted checkout and customer portal. USJET does not store full payment card numbers on this site. Stripe's privacy policy governs payment data they collect.",
      "Tier pricing shown on Member Login: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo — all routed through Stripe.",
    ],
  },
  {
    id: "storage",
    title: "Cookies & local storage",
    paragraphs: [
      "USJET.AI uses browser storage (including localStorage) to remember a verified member session for up to twenty-four hours and to persist cockpit preferences such as Silent Hangar audio state.",
      "We do not use third-party advertising cookies. Clearing site data for the USJET hostname will sign you out and reset local preferences — see /sos for practical steps.",
    ],
  },
  {
    id: "third-parties",
    title: "Integrated navigation & third parties",
    paragraphs: [
      "Fleet and Hangar modules may load partner sites inside /cockpit in the same browser window. Those partners operate under their own privacy policies once you enter their module.",
      "USJET does not open partner revenue lanes in a separate tab by default — One Ship, One Cockpit. When a partner cannot embed, the cockpit may continue the module in this same window; use the return control to come back to USJET.",
      "We may use infrastructure providers (hosting, CDN, email routing) that process technical logs on our behalf under contractual safeguards.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "Verified browser sessions expire after twenty-four hours of age or immediately when you sign out.",
      "Stripe retains billing records according to its policies and applicable law. Support email and form submissions are kept as long as needed to resolve the request and maintain an institutional record.",
      "Server logs are rotated on a reasonable schedule for security and diagnostics.",
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    bullets: [
      "Sign out of the Member Portal to clear the local session immediately.",
      "Clear site data in your browser to remove stored preferences and cached state.",
      "Manage or cancel subscriptions through Stripe's customer tools or by contacting ops@usjet.ai.",
      "Do not submit verification data you are not authorized to use.",
    ],
    paragraphs: [],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "USJET.AI is a commercial operator platform, not directed to children under 13. We do not knowingly collect personal information from children. Contact ops@usjet.ai if you believe a child submitted data.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We apply reasonable technical and organizational measures appropriate to a subscription web product. No method of transmission or storage is perfectly secure; use a trusted network and confirm the address bar shows the USJET host you expect before entering billing or member identifiers.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy as the platform evolves. The effective date at the top will change when we do. Continued use after an update means you accept the revised policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "Questions about this policy or your data: ops@usjet.ai. Institutional entity: USJET LLC · Established in 2018.",
    ],
  },
];
