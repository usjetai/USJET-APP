/** AI 101 one-on-one curriculum — how to use the USJET ship (no fleet bay cards). */

export type Ai101LessonSection = {
  id: string;
  title: string;
  route?: string;
  kicker: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const AI101_LESSON_INTRO = {
  title: "AI 101 — One-on-one with the ship",
  lede:
    "This lesson teaches you how U.S. Jet actually works: Hangar, Fleet, Jet Browser, Intel, Origin, Member, and the rest of the deck. Read each section. At the bottom, answer ten questions. Pass to earn the AI 101 badge on your Member Portal.",
} as const;

export const AI101_LESSON_SECTIONS: readonly Ai101LessonSection[] = [
  {
    id: "ship",
    title: "The ship: One cockpit",
    kicker: "Core rule",
    paragraphs: [
      "U.S. Jet is not a pile of bookmark links. It is one ship. You stay in the same browser window. Partner tools open through the Hangar workbench or the /cockpit handoff — never as a leaky new tab from our chrome.",
      "Guests can explore Hangar (first three free tabs), Fleet (ten free bays), Founder, Help, AI 101, and Jet Browser. Paid tiers unlock more Hangar tabs, Intel, Origin, and Member tools. Payments are Stripe only — no Google or Apple login.",
    ],
    bullets: [
      "Integrated navigation: same window, Cockpit return when you leave a partner.",
      "Wrenches, not slides: the product is a workbench for labor and builders.",
      "Help (/sos) is short troubleshooting. This page is the full lesson.",
    ],
  },
  {
    id: "hangar",
    title: "Hangar — home workbench",
    route: "/",
    kicker: "Primary surface",
    paragraphs: [
      "Hangar is the home page. It is a floor of AI workbench tiles. Click a tile to open that bay in place — the partner loads inside the tile so you can work without leaving the ship.",
      "On an open tile you can enlarge for a tall focus surface, then shrink back to formation. Close the bay when you are done. Guests get the first three simultaneous tabs free; Flight Pass unlocks the full floor.",
      "Use the layout control (columns) to change how dense the grid feels. Some partners block iframes — those bays show an Open handoff that still keeps you in-window through cockpit rules.",
    ],
    bullets: [
      "Open → work → enlarge/shrink → close.",
      "First 3 tabs free for guests; Flight Pass for the rest.",
      "Blank frame? Use the in-tile Open control — do not hunt for a new browser tab.",
    ],
  },
  {
    id: "fleet",
    title: "Fleet — the runway",
    route: "/fleet",
    kicker: "Partner roster",
    paragraphs: [
      "Fleet is the runway of partner AIs — thirty units with call signs, domains, and capabilities. Guests can launch ten free bays; Flight Pass clears the full runway.",
      "Fleet is for choosing and launching. Hangar is for working several bays open at once. Same partners, different job: browse and launch on Fleet; stay and work on Hangar.",
      "When you launch, the ship owns the handoff. Trusted return visits skip broken waits. You always get a path back to U.S. Jet.",
    ],
    bullets: [
      "Fleet = choose & launch. Hangar = multi-bay workbench.",
      "10 free guest bays; Flight Pass for all 30.",
      "Call signs and domains help you pick the right tool for the job.",
    ],
  },
  {
    id: "jet-browser",
    title: "Jet Browser — your own tiles",
    route: "/jet-browser",
    kicker: "Captain-loaded bays",
    paragraphs: [
      "Jet Browser lets you type any domain or page link and open it in a Hangar-style tile. Enter another link — another tile. Layout offers 2, 3, or 4 rows across.",
      "Enlarge and shrink work the same way as Hangar. Sites that refuse embedding get an in-ship Open path. This is your custom workbench when the fixed fleet roster is not enough.",
    ],
    bullets: [
      "Paste example.com or a full https URL → Open tile.",
      "Up to eight tiles; close one to free a slot.",
      "Zero new-tab leaks from the ship chrome.",
    ],
  },
  {
    id: "intel",
    title: "Intel — partnership board",
    route: "/intel",
    kicker: "Hangar Pro+",
    paragraphs: [
      "Intel is the institutional pulse board. Side partnership bays (for example reserved Titan slots) are revenue real estate — held open until the right partners pay. U.S. Jet does not pay Wall Street for feeds; markets that want this audience sponsor the hangar.",
      "Hangar Pro (or higher) clears Intel. Guests and Flight Pass members see the gate until they upgrade.",
    ],
    bullets: [
      "Requires Hangar Pro or Enterprise.",
      "Reserved bays are intentional — not empty bugs.",
      "No live NYSE dependency in this build.",
    ],
  },
  {
    id: "origin",
    title: "Origin — command help",
    route: "/origin",
    kicker: "Bay 30",
    paragraphs: [
      "Origin is the text command node. Ask about Hangar, Fleet, tiers, login, and which bay to open. It runs on onboard ship knowledge at zero cloud cost — not a metered general chatbot.",
      "Customer Service links can land you on Origin in CS mode. Enterprise clearance unlocks the full Origin route. For human follow-up, email ops@usjet.ai.",
    ],
    bullets: [
      "Ask plain questions: login, prices, which tool for writing or video.",
      "Enterprise for full Origin; CS entry for support framing.",
      "Ops email for billing disputes and lockouts.",
    ],
  },
  {
    id: "founder",
    title: "Founder & 1995",
    route: "/founder",
    kicker: "Story & grit",
    paragraphs: [
      "Founder tells Ameer Karim’s story and the grit behind the brand. Founder Products and the 1995 Grit Vault deepen lineage and vault content — 1995 is Enterprise-tier.",
      "Read Founder when you want to understand why the ship exists. Use Hangar and Fleet when you want to work.",
    ],
  },
  {
    id: "member",
    title: "Member Login & Portal",
    route: "/member",
    kicker: "Stripe clearance",
    paragraphs: [
      "Member Login: pay on Stripe first, then verify with billing email plus your founder-issued access sentence or Stripe Member ID (cus_…). No OAuth. Email alone never unlocks the portal.",
      "Member Portal holds Mission Projects, AI data telemetry, shipping, and Hangar/Fleet launch boards. After you pass this AI 101 quiz, your AI 101 badge appears here as proof.",
    ],
    bullets: [
      "Flight Pass $19.90/mo · Hangar Pro $49.95/mo · Enterprise $199.99/mo.",
      "Session lasts about 24 hours in the browser; Sign out clears it.",
      "Manage billing in Stripe; email Ops for human routing.",
    ],
  },
  {
    id: "special",
    title: "Founder Special — tiers",
    route: "/special",
    kicker: "Checkout",
    paragraphs: [
      "Founder Special is the tier checkout surface — Flight Pass, Hangar Pro, Enterprise Commander — wired to Stripe Payment Links. High-pressure funnels land direct on those ports.",
      "Pick the clearance that matches what you need: Hangar depth, Intel, or Origin + vault.",
    ],
  },
  {
    id: "help",
    title: "Help (/sos)",
    route: "/sos",
    kicker: "Short answers",
    paragraphs: [
      "Help is the practical desk: login steps, Hangar enlarge/shrink, plan prices, Origin chat, and Ops email. It is not the full curriculum — that is this AI 101 lesson.",
      "If something is broken after an update, hard-reload the page. If checkout fails, confirm you returned to Member Login with the same billing email.",
    ],
  },
  {
    id: "more",
    title: "Other decks worth knowing",
    kicker: "Map",
    paragraphs: [
      "Hired HUD / USJET House watches live roster energy. Fleet Directory lists jet-fighter call signs. Gaming and Jet Hoops are entertainment surfaces inside the same ship rules.",
      "Revenue and partner pages (Founder’s Fuel, Code Kit, B2B, Licensing, Sovereignty, and related) support growth and institutional story — explore them when you are ready to deepen the business side.",
      "Privacy and protocol pages document policy. Landscape guide helps mobile operators. Always prefer same-window navigation from the header, footer Help link, or side latch menu.",
    ],
    bullets: [
      "Header: Hangar · Fleet · Jet Browser · Intel · Founder · Origin · Member",
      "Footer Help → /sos · AI 101 → /ai-101",
      "Latch menu lists the full deck when you need a rare route.",
    ],
  },
  {
    id: "howto",
    title: "How to practice after this lesson",
    kicker: "Flight plan",
    paragraphs: [
      "1) Open Hangar. Launch one free bay. Enlarge it. Shrink it. Close it.",
      "2) Open Fleet. Read three call signs. Launch one free runway bay.",
      "3) Open Jet Browser. Load a domain you use for work. Try 2-row vs 3-row layout.",
      "4) Skim Founder. Open Help if anything felt stuck.",
      "5) When ready to clear more of the ship, pay on Stripe and verify at Member Login.",
      "Then take the ten-question check below. Pass to stamp the AI 101 badge on your Member Portal.",
    ],
  },
];
