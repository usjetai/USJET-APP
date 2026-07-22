/**
 * Competitive positioning — SDR / outbound / objection memory.
 * USJET vs fragmented stacks, generic AI platforms, and custom builds.
 * Keep in sync with founderManifesto COMPETITIVE_POSITIONING_JUL_2026 + AGENTS.md.
 */

/** One-line frame for every outbound email and discovery call. */
export const COMPETITIVE_POSITIONING_THESIS =
  "USJET is the alternative to fragmented aviation/ops software stacks, generic AI chat tools, and custom internal builds. It combines command and control, training, intelligence assets, and managed support in one aerospace-specific sovereign platform — cutting integration burden and operational complexity." as const;

/** What prospects already use — and why those fail at fleet scale. */
export const COMPETITIVE_ALTERNATIVES = [
  {
    id: "fragmented-stack",
    label: "Fragmented fleet / aviation software stacks",
    prospectUses:
      "Separate tabs for chatbots, docs, dispatch notes, training LMS, and market/intel dashboards — each with its own login, UI, and support queue.",
    usjetAdvantage:
      "One Ship, One Cockpit: Hangar workbench + 30-unit Fleet runway + Member mission tracking open in-window. No tab sprawl, no brand leak.",
    objectionHandle:
      "You are not buying another SaaS tile. You are collapsing five browser habits into one sovereign flight deck.",
  },
  {
    id: "generic-ai",
    label: "Generic AI platforms (ChatGPT, Claude, Midjourney alone)",
    prospectUses:
      "One general model for every job — copy-paste prompts, lost context, no fleet specialization, no institutional hangar.",
    usjetAdvantage:
      "Thirty specialized partner AIs under one roof, plus Origin (Aura) as command node on Enterprise. Mission routing beats clone-everything chat.",
    objectionHandle:
      "Generic AI is a wrench drawer with one wrench. USJET is the hangar: right bay, right tool, same cockpit.",
  },
  {
    id: "custom-build",
    label: "Custom internal AI / ops builds",
    prospectUses:
      "Internal engineering or agency projects to stitch agents, auth, and dashboards — months of burn, brittle integrations, founder time as glue.",
    usjetAdvantage:
      "Ship-ready cockpit now: Stripe clearance, Liquid Glass hangar, Integrated Navigation, tiered Intel/Origin — revenue architecture without a custom runway project.",
    objectionHandle:
      "Custom builds spend runway inventing the hangar. USJET already cleared it — you buy clearance, not a six-month build ticket.",
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
