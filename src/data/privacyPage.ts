/** Public privacy policy — `/privacy` */

import { SITE_ORIGIN } from "./siteSeo";

export const PRIVACY_ROUTE = "/privacy" as const;

export const PRIVACY_CANONICAL_URL = `${SITE_ORIGIN}${PRIVACY_ROUTE}` as const;

export const PRIVACY_PAGE_TITLE = "Privacy Policy · USJET.AI" as const;

export const PRIVACY_META_DESCRIPTION =
  "How USJET LLC collects, uses, and protects information on USJET.AI — hardware orders and shipping addresses, waiting-list entries, payments, Do Not Track handling, and no accounts or OAuth sign-in.";

export const PRIVACY_EFFECTIVE_DATE = "September 3, 2026" as const;

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
      "Hardware order details when you buy an Operator's Rig — your name, email address, phone number if you give it, and the shipping address the machine goes to.",
      "Waiting-list entries you submit at /waiting-list — your name, email, the kind of work you do, how many machines you are asking about, your city and state, and anything you write in the notes field. Used to answer you about a rig and nothing else.",
      "Voluntary correspondence when you email ops@usjet.ai or submit support forms. Mail to that address is held by Porkbun LLC, our domain registrar and email host.",
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
      "USJET.AI does not require an account or sign-in to buy anything, and does not offer Google, Apple, or other OAuth sign-in.",
      "Operator's Rig hardware is invoiced directly and paid by bank transfer (ACH) or check. We see the payment confirmation from our bank. We never see or store your card number or your banking login.",
      "Where a card payment is offered, Stripe processes it on its own hosted checkout. USJET does not store full payment card numbers on this site. Stripe's privacy policy governs payment data they collect.",
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
    id: "processors",
    title: "Who processes data for us",
    paragraphs: [
      "We name these rather than describing them by category, because Rhode Island law requires it and because you should be able to see the whole list:",
    ],
    bullets: [
      "Vercel Inc. — website hosting and server logs.",
      "GitHub, Inc. — source code hosting. No customer data.",
      "Porkbun LLC — domain registration and the ops@usjet.ai mailbox.",
      "Novo Platform Inc. and its partner bank — invoicing and payment.",
      "Stripe, Inc. — card payments where a subscription is paid by card.",
      "Google LLC — Google Analytics 4, aggregate site usage only.",
      "The AI providers named under \"AI chat providers\" above, for in-product chat only.",
      "A shipping carrier — USPS, UPS or FedEx — receives the delivery address for a hardware order.",
    ],
  },
  {
    id: "the-machine",
    title: "What the machine you buy does not send us",
    paragraphs: [
      "The Operator's Rig runs its models locally. It does not report your prompts, your documents, or your usage to us or to anyone else. That is the point of the product.",
      "This policy covers usjet.ai — the website — and the order you place on it. It does not describe data collection on your own machine, because there isn't any.",
    ],
  },
  {
    id: "do-not-track",
    title: "Do Not Track",
    paragraphs: [
      "Some browsers send a \"Do Not Track\" signal. USJET does not run third-party advertising or retargeting networks, so there is no cross-site advertising profile to switch off. We use Google Analytics 4 for aggregate site usage only, and you can opt out of it using the methods listed under \"Cookies & analytics\" above.",
      "Because we do not track visitors across other websites, we do not alter site behavior in response to a Do Not Track header. This disclosure is made under California Business & Professions Code section 22575(b)(5).",
    ],
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
    id: "order-records",
    title: "How long we keep order records",
    paragraphs: [
      "Order records — your name, shipping address, and the machine's serial number — are kept for seven years. We need them for tax records, for your warranty, and so we can verify your purchase to Apple if you ever need a warranty or Activation Lock escalation.",
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
      "We maintain reasonable administrative, technical, and physical safeguards, as New York's SHIELD Act (GBL 899-bb) requires of any business holding a New York resident's private information. No method of transmission or storage is perfectly secure; use a trusted network and confirm the address bar shows the USJET host you expect before entering any personal information.",
      "If a breach affecting your information occurs, we will notify you within 30 days of discovering it, as GBL 899-aa requires, along with the New York Attorney General, Department of State, and State Police.",
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
