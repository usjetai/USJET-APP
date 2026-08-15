/**
 * Competitive positioning — SDR / outbound / objection memory.
 * USJET vs fragmented stacks, generic AI platforms, and custom builds.
 * Keep in sync with founderManifesto COMPETITIVE_POSITIONING_JUL_2026 + AGENTS.md.
 */

/** One-line frame for every outbound email and discovery call. */
export const COMPETITIVE_POSITIONING_THESIS =
  "USJET sells computers that already have AI in them. Hangar is home. Fleet is business and servers. The product is the Operator's Rig — hardware plus a local stack (engine, dashboard, private document vault, operator manual) — not a Mac from a box store and not another ChatGPT tab." as const;

/** What prospects already use — and why those fail at fleet scale. */
export const COMPETITIVE_ALTERNATIVES = [
  {
    id: "fragmented-stack",
    label: "Fragmented fleet / aviation software stacks",
    prospectUses:
      "Amazon Mac Mini + three weekends of Docker, Ollama flags, model weights, and forum threads — or five cloud logins that do not talk to each other.",
    usjetAdvantage:
      "One Operator's Rig: engine, ChatGPT-like face, private vault, AI Book Series, one-click desktop start. Hangar for the house. Fleet for the shop.",
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
      "We buy the exact SKU, load the stack, ship the manual. You paid for the setup hours. You did not invent a hangar.",
    objectionHandle:
      "Custom builds spend runway inventing the installer. USJET already cleared it — you buy the Rig, not a six-month ticket.",
  },
] as const;

/** Concrete replacements — use in “what does this replace?” replies. */
export const USJET_REPLACES = [
  "Tab-hopping across ChatGPT / Claude / Midjourney / docs / LMS / ad-hoc dashboards",
  "Bookmark collections and ‘AI tool directories’ with no command layer",
  "Homegrown agent glue (auth sprawl, iframe graves, target=_blank partner leaks)",
  "Generic SaaS onboarding that ignores labor / fleet / hangar workflow",
] as const;

/** Unique bundle — what only USJET packages together. */
export const USJET_UNIQUE_BUNDLE = [
  {
    id: "command-control",
    title: "Command & control",
    body: "Sovereign Hangar + Fleet runway + Cockpit handoff — one brand, same-window launches, Member Portal mission projects.",
  },
  {
    id: "training",
    title: "Training",
    body: "AI-101 flight school, Origin command coaching (Enterprise), and Wrenches-Not-Slides operator culture — not slide decks.",
  },
  {
    id: "intelligence",
    title: "Intelligence assets",
    body: "Intel board as institutional real estate (Hangar Pro+); reserved partnership bays for Titans — distribution power, not rented ticker tape.",
  },
  {
    id: "managed-support",
    title: "Managed support",
    body: "Origin Customer Service for instant ship help; ops@usjet.ai for human follow-up; Stripe-only Member ID clearance — no OAuth side doors.",
  },
] as const;

/** Buying reason per Stripe offer — outbound specificity + objection handling. */
export const OFFER_BUYING_REASONS = [
  {
    id: "flight-pass",
    offer: "USJet Flight Pass",
    priceDisplay: "$19.90/mo",
    replaces: "Paying separately for a dozen AI tabs while still losing the workbench.",
    bundles: "Full Hangar tabs, all 30 Fleet bays, Member Portal, Special — entry into the sovereign hangar.",
    buyBecause:
      "Cheapest path off fragmented free tools: one clearance, full runway, institutional Member ID — built for operators who fix things, not pitch decks.",
    objectionHandle:
      "If they already ‘have ChatGPT’: Flight Pass is the hangar those chats never become — formation, not another browser bookmark.",
  },
  {
    id: "hangar-pro",
    offer: "Hangar Pro",
    priceDisplay: "$49.95/mo",
    replaces: "Bolting a separate markets/intel dashboard onto generic AI and hoping the team remembers the URL.",
    bundles: "Everything in Flight Pass + Intel Pulse board — high-velocity operator sync.",
    buyBecause:
      "Operators who need fleet networking and live institutional intel in the same cockpit — not a second product login.",
    objectionHandle:
      "If they say ‘we just need the AIs’: Hangar Pro is for crews who run the board and the bay together.",
  },
  {
    id: "enterprise",
    offer: "Enterprise Fleet Commander",
    priceDisplay: "$199.99/mo",
    replaces: "Hiring an agency or internal team to build a multi-agent command layer and training program from scratch.",
    bundles: "Everything in Hangar Pro + Origin (Aura) command node — teach, route, and orchestrate partner AIs from one seat.",
    buyBecause:
      "Full sovereign command: one node that owns the fleet and the training voice — before custom-build burn or USA 250 price climb.",
    objectionHandle:
      "If they threaten a custom build: Enterprise is the command layer they would otherwise invent — already flying, Stripe-cleared, Origin-seated.",
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
