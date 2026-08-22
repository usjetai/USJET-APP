/**
 * Competitive positioning — SDR / outbound / objection memory.
 * USJET vs fragmented stacks, generic AI platforms, and custom builds.
 * Keep in sync with founderManifesto COMPETITIVE_POSITIONING_JUL_2026 + AGENTS.md.
 */

/** One-line frame for every outbound email and discovery call. */
export const COMPETITIVE_POSITIONING_THESIS =
  "USJET sells computers that already have AI in them. Homes is the house shop. Business is the shop and office shop. The product is the Operator's Rig — hardware plus a local stack (engine, screen, private document vault, operator manuals) — not a Mac from a box store and not another ChatGPT tab." as const;

/** What prospects already use — and why those fail at fleet scale. */
export const COMPETITIVE_ALTERNATIVES = [
  {
    id: "fragmented-stack",
    label: "Fragmented fleet / aviation software stacks",
    prospectUses:
      "Amazon Mac Mini + three weekends of Docker, Ollama flags, model weights, and forum threads — or five cloud logins that do not talk to each other.",
    usjetAdvantage:
      "One Operator's Rig: engine, ChatGPT-like face, private vault, AI Book Series, one-click desktop start. Homes for the house. Business for the shop.",
    objectionHandle:
      "You are not buying another tab. You are buying a machine that already thinks, with a book that talks like a wrench.",
  },
  {
    id: "generic-ai",
    label: "Generic AI platforms (ChatGPT, Claude, Midjourney alone)",
    prospectUses:
      "ChatGPT / Claude in the browser — $20 a month, files pasted into someone else's server, nothing that belongs to the house.",
    usjetAdvantage:
      "Local models on your hardware. AnythingLLM reads YOUR PDFs. Nothing has to leave the box. That is the premium.",
    objectionHandle:
      "Generic AI is a rented brain. A USJET rig is a brain you own — sitting on the desk, drawing 30 watts, not a subscription.",
  },
  {
    id: "custom-build",
    label: "Custom internal AI / ops builds",
    prospectUses:
      "Hire a shop to stand up a local LLM workstation — Docker, RAG, dashboards, weeks of burn, brittle when the kid who set it up leaves.",
    usjetAdvantage:
      "We buy the exact SKU, load the stack, ship the manual. You paid for the setup hours. You did not invent an installer.",
    objectionHandle:
      "Custom builds spend runway inventing the installer. USJET already cleared it — you buy the Rig, not a six-month ticket.",
  },
] as const;

/** Concrete replacements — use in “what does this replace?” replies. */
export const USJET_REPLACES = [
  "A mute Mac from a box store plus three weekends of Docker and forum threads",
  "Renting ChatGPT / Claude in a browser and pasting family or shop files into someone else's server",
  "Hiring a shop to stand up a local LLM workstation that dies when the kid who set it up leaves",
  "Bookmark collections of AI tools with no computer that actually belongs to you",
] as const;

/** Unique bundle — hardware + books. */
export const USJET_UNIQUE_BUNDLE = [
  {
    id: "hardware",
    title: "The computer",
    body: "We buy the listed machine and ship it as an Operator's Rig — local engine, screen, private vault, one-click start.",
  },
  {
    id: "manuals",
    title: "The books",
    body: "USJET.AI Engineering Series in the box and on Manuals — Kindle and paperback by Ameer Karim.",
  },
  {
    id: "privacy",
    title: "Your files stay home",
    body: "Models run on THIS computer. Documents do not have to leave the box for a cloud chat bill.",
  },
  {
    id: "support",
    title: "A human on email",
    body: "ops@usjet.ai for orders, shipping, and a box that landed wrong. Responses in 1–3 business days.",
  },
] as const;

/**
 * Leftover Stripe subscriptions from the prior site. Kept so products are not deleted.
 * Not the shop. Hardware + books are the offer.
 */
export const OFFER_BUYING_REASONS = [
  {
    id: "flight-pass",
    offer: "Flight Pass (leftover)",
    priceDisplay: "$19.90/mo",
    replaces: "Nothing the Operator's Rig already covers — leftover monthly Stripe link.",
    bundles: "A leftover subscription from an earlier version of this site. Not required to buy a computer.",
    buyBecause:
      "Only if someone already paid this leftover Stripe product and needs the existing link. The shop is hardware and books.",
    objectionHandle:
      "If they already have ChatGPT: sell the computer. Do not pitch this leftover monthly link as the product.",
  },
  {
    id: "hangar-pro",
    offer: "Hangar Pro (leftover)",
    priceDisplay: "$49.95/mo",
    replaces: "Nothing in the current shop — leftover Stripe product, not sold on the storefront.",
    bundles: "Leftover Stripe product. Do not present as a customer-facing offer.",
    buyBecause: "Do not sell this on the shop. Hardware and books are the offer.",
    objectionHandle: "Redirect to Homes / Business computers.",
  },
  {
    id: "enterprise",
    offer: "Enterprise Commander (leftover)",
    priceDisplay: "$199.99/mo",
    replaces: "Nothing in the current shop — leftover Stripe product, not sold on the storefront.",
    bundles: "Leftover Stripe product. Do not present as a customer-facing offer.",
    buyBecause: "Do not sell this on the shop. Hardware and books are the offer.",
    objectionHandle: "Redirect to Homes / Business computers.",
  },
] as const;

/** Short paste block for lead-gen / SDR tool memory. */
export const COMPETITIVE_POSITIONING_SDR_BRIEF = [
  COMPETITIVE_POSITIONING_THESIS,
  "",
  "Alternatives:",
  ...COMPETITIVE_ALTERNATIVES.map(
    (a) => `• vs ${a.label}: ${a.usjetAdvantage} Objection: ${a.objectionHandle}`,
  ),
  "",
  "USJET replaces:",
  ...USJET_REPLACES.map((r) => `• ${r}`),
  "",
  "Unique bundle:",
  ...USJET_UNIQUE_BUNDLE.map((b) => `• ${b.title}: ${b.body}`),
  "",
  "Buy reasons by offer:",
  ...OFFER_BUYING_REASONS.map(
    (o) => `• ${o.offer} (${o.priceDisplay}): ${o.buyBecause}`,
  ),
].join("\n");
