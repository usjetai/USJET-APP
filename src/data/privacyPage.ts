/** Public privacy policy — `/privacy` */

import { SITE_ORIGIN } from "./siteSeo";

export const PRIVACY_ROUTE = "/privacy" as const;

export const PRIVACY_CANONICAL_URL = `${SITE_ORIGIN}${PRIVACY_ROUTE}` as const;

export const PRIVACY_PAGE_TITLE = "Privacy Policy · USJET.AI" as const;

export const PRIVACY_META_DESCRIPTION =
  "How USJET LLC collects, uses, and protects information on USJET.AI — Stripe checkout for AI Computers orders, site analytics, and no accounts required.";

export const PRIVACY_EFFECTIVE_DATE = "August 31, 2026" as const;

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
      "This Privacy Policy describes how USJET LLC (\"USJET,\" \"we,\" \"us\") handles information when you use USJET.AI — the AI Computers hardware store, AI Book Series, and associated pages.",
      "By using the site, you acknowledge this policy. If you do not agree, do not use USJET.AI.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    paragraphs: ["We collect only what the product needs to operate checkout and support:"],
    bullets: [
      "Order and shipping information you submit at Stripe checkout — name, address, email, and payment details, handled directly by Stripe (see \"Authentication & payments\" below).",
      "Technical signals your browser sends automatically — IP address, user agent, referrer, and basic request logs needed for security and uptime.",
      "Analytics on how the site is used — page views and in-product events — collected via Google Analytics 4. See \"Cookies & analytics\" below for how to opt out.",
      "Voluntary correspondence when you email ops@usjet.ai or submit support forms.",
      "Messages you type into an on-page partner AI chat launch — sent to the third-party AI provider handling that conversation so it can generate a response. See \"AI chat providers\" below.",
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: ["We use collected information to:"],
    bullets: [
      "Process and ship your order.",
      "Respond to support requests and institutional partnership inquiries.",
      "Maintain site security, diagnose outages, and improve reliability.",
      "Meet legal, accounting, and fraud-prevention obligations tied to orders.",
    ],
  },
  {
    id: "auth-payments",
    title: "Authentication & payments",
    paragraphs: [
      "USJET.AI does not require an account or sign-in to buy anything. AI Computers orders are one-time purchases processed through Stripe's hosted checkout.",
      "Stripe processes card and order data on its own hosted checkout. USJET does not store full payment card numbers on this site. Stripe's privacy policy governs payment data they collect.",
      "AI Book Series purchases are completed on Amazon; Amazon's own privacy policy governs that transaction, not this one.",
    ],
  },
  {
    id: "storage",
    title: "Cookies & analytics",
    paragraphs: [
      "USJET.AI uses browser storage (including localStorage) to remember lightweight site preferences on your device, such as cart contents and interface state.",
      "We use Google Analytics 4 (GA4) to understand site usage, which sets its own cookies and sends usage data to Google. We do not use separate third-party advertising/retargeting cookies beyond what GA4 itself sets. Google's use of this data is governed by Google's own privacy policy.",
      "To opt out of GA4 tracking on this site, use your browser's tracking-protection settings, a browser extension such as Google's Analytics Opt-out Add-on, or contact ops@usjet.ai. Clearing site data for the USJET hostname will reset local preferences and cart contents — see /sos for practical steps.",
    ],
  },
  {
    id: "ai-chat-providers",
    title: "AI chat providers",
    paragraphs: [
      "Some AI Computers product pages let you launch a partner AI assistant in the same window to preview the machine's local AI stack. Depending on the surface, your messages may be sent to OpenAI, Google Vertex AI, and/or models routed through OpenRouter to generate a response.",
      "These providers process the conversation text needed to answer you; USJET does not control how each provider retains or further processes that data beyond its own published terms. Do not share information in these chats that you would not want processed by a third-party AI provider.",
    ],
  },
  {
    id: "third-parties",
    title: "Integrated navigation & third parties",
    paragraphs: [
      "A partner AI chat launch may load a partner's own page inside the same browser window (see \"AI chat providers\" above). Those partners operate under their own privacy policies once you enter their module; use the return control to come back to USJET.",
      "We may use infrastructure providers (hosting, CDN, email routing, payments) that process technical logs or order data on our behalf under contractual safeguards. See /terms for the full agreement governing your use of the Service.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "Stripe retains billing records according to its policies and applicable law. Support email and form submissions are kept as long as needed to resolve the request and maintain an institutional record.",
      "Server logs are rotated on a reasonable schedule for security and diagnostics.",
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    bullets: [
      "Clear site data in your browser to remove stored preferences and cart contents.",
      "Manage a completed order through Stripe's customer emails or by contacting ops@usjet.ai.",
      "Do not submit information you are not authorized to use.",
    ],
    paragraphs: [],
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    paragraphs: [
      "Depending on where you live, you may have rights to know what personal information we hold about you, request its deletion, correct it, or opt out of certain processing (including analytics tracking, described above). We honor these requests to the extent required by applicable law.",
      "To exercise a rights request, email ops@usjet.ai from the address associated with your order. We may need to verify your identity before acting on the request.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "USJET.AI is a commercial hardware storefront, not directed to children under 13. We do not knowingly collect personal information from children. Contact ops@usjet.ai if you believe a child submitted data.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We apply reasonable technical and organizational measures appropriate to a small e-commerce site. No method of transmission or storage is perfectly secure; use a trusted network and confirm the address bar shows the USJET host you expect before entering any personal information.",
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
