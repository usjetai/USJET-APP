/** Public privacy policy — `/privacy` */

import { SITE_ORIGIN } from "./siteSeo";

export const PRIVACY_ROUTE = "/privacy" as const;

export const PRIVACY_CANONICAL_URL = `${SITE_ORIGIN}${PRIVACY_ROUTE}` as const;

export const PRIVACY_PAGE_TITLE = "Privacy Policy · USJET.AI" as const;

export const PRIVACY_META_DESCRIPTION =
  "How USJET LLC collects, uses, and protects information on USJET.AI — Stripe hardware checkout, site analytics, and no OAuth sign-in.";

export const PRIVACY_EFFECTIVE_DATE = "August 16, 2026" as const;

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
      "This Privacy Policy describes how USJET LLC (\"USJET,\" \"we,\" \"us\") handles information when you use USJET.AI — the Operator's Rig hardware shop, manuals, and associated pages.",
      "By using the site, you acknowledge this policy. If you do not agree, do not use USJET.AI.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    paragraphs: ["We collect only what the shop needs to take orders, ship hardware, and keep the site up:"],
    bullets: [
      "Member verification inputs you submit if you still use a leftover Stripe subscription login — billing email and Stripe Member ID (cus_…).",
      "Browser-local session data after successful verification (stored in localStorage on your device, not on a separate social identity provider).",
      "Technical signals your browser sends automatically — IP address, user agent, referrer, and basic request logs needed for security and uptime.",
      "Analytics on how the site is used — page views and in-product events — collected via Google Analytics 4. See \"Cookies & analytics\" below for how to opt out.",
      "Voluntary correspondence when you email ops@usjet.ai or submit support forms.",
      "Usage within leftover gated surfaces (if you still hold a leftover Stripe subscription) needed to honor that subscription.",
      "Messages you type into in-product AI chat surfaces, if those leftover pages are still reachable — sent to the third-party AI provider handling that conversation so it can generate a response. See \"AI chat providers\" below.",
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: ["We use collected information to:"],
    bullets: [
      "Verify Stripe-backed leftover membership if you still use those links, and open the correct leftover clearance.",
      "Operate the hardware shop, manuals, and same-window Amazon handoffs.",
      "Respond to support requests and institutional partnership inquiries.",
      "Maintain site security, diagnose outages, and improve reliability.",
      "Meet legal, accounting, and fraud-prevention obligations tied to paid subscriptions.",
    ],
  },
  {
    id: "auth-payments",
    title: "Authentication & payments",
    paragraphs: [
      "USJET does not offer Google, Apple, or other OAuth sign-in. Clearance is Stripe-only: you pay through Stripe Payment Links, then verify with billing email plus your Member ID.",
      "Stripe processes card and subscription data on its own hosted checkout and customer portal. USJET does not store full payment card numbers on this site. Stripe's privacy policy governs payment data they collect.",
      "Leftover subscription pricing that may still appear on Stripe: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo — all routed through Stripe. These are not the current shop.",
    ],
  },
  {
    id: "storage",
    title: "Cookies & analytics",
    paragraphs: [
      "USJET.AI uses browser storage (including localStorage) to remember a verified leftover member session for up to twenty-four hours and to persist site preferences such as audio mute state.",
      "We use Google Analytics 4 (GA4) to understand site usage, which sets its own cookies and sends usage data to Google. We do not use separate third-party advertising/retargeting cookies beyond what GA4 itself sets. Google's use of this data is governed by Google's own privacy policy.",
      "To opt out of GA4 tracking on this site, use your browser's tracking-protection settings, a browser extension such as Google's Analytics Opt-out Add-on, or contact ops@usjet.ai. Clearing site data for the USJET hostname will sign you out and reset local preferences — see /sos for practical steps.",
    ],
  },
  {
    id: "ai-chat-providers",
    title: "AI chat providers",
    paragraphs: [
      "Origin, Fleet bay assistants, and other in-product chat surfaces are powered by third-party AI models. Depending on the surface, your messages may be sent to OpenAI, Google Vertex AI, and/or models routed through OpenRouter to generate a response.",
      "These providers process the conversation text needed to answer you; USJET does not control how each provider retains or further processes that data beyond its own published terms. Do not share information in these chats that you would not want processed by a third-party AI provider.",
    ],
  },
  {
    id: "third-parties",
    title: "Integrated navigation & third parties",
    paragraphs: [
      "Fleet and Hangar modules may load partner sites inside /cockpit in the same browser window. Those partners operate under their own privacy policies once you enter their module.",
      "USJET does not open partner revenue lanes in a separate tab by default — One Ship, One Cockpit. When a partner cannot embed, the cockpit may continue the module in this same window; use the return control to come back to USJET.",
      "We may use infrastructure providers (hosting, CDN, email routing, payments) that process technical logs or order data on our behalf under contractual safeguards. See /terms for the full agreement governing your use of the Service.",
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
      "Sign out of any leftover member session to clear local storage immediately.",
      "Clear site data in your browser to remove stored preferences and cached state.",
      "Manage or cancel subscriptions through Stripe's customer tools or by contacting ops@usjet.ai.",
      "Do not submit verification data you are not authorized to use.",
    ],
    paragraphs: [],
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    paragraphs: [
      "Depending on where you live, you may have rights to know what personal information we hold about you, request its deletion, correct it, or opt out of certain processing (including analytics tracking, described above). We honor these requests to the extent required by applicable law.",
      "To exercise a rights request, email ops@usjet.ai from the address associated with your account. We may need to verify your identity before acting on the request.",
    ],
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
