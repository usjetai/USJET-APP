import { FLEET_UNIT_COUNT } from "../types/fleet";

export type BlogBodyBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string };

export type BlogBriefPost = {
  variant: "brief";
  slug: string;
  kicker: string;
  title: string;
  dateLabel: string;
  excerpt: string;
  /** Extra copy revealed when the reader opens the briefing (no external URLs). */
  expandedNote: string;
};

export type BlogFeaturePost = {
  variant: "feature";
  slug: string;
  kicker: string;
  title: string;
  dateLabel: string;
  excerpt: string;
  blocks: readonly BlogBodyBlock[];
};

export type BlogDispatchPost = BlogFeaturePost | BlogBriefPost;

export const BLOG_FEATURE_POST: BlogFeaturePost = {
  variant: "feature",
  slug: "how-thirty-ais-came-together",
  kicker: "Featured dispatch · Fleet meta",
  title: "How 30 AIs came together",
  dateLabel: "May 2026",
  excerpt:
    "The industry sells isolated assistants; USJET ships a sovereign roster. This dispatch explains how thirty partner cockpits became one countable fleet, one hangar grid, and one navigation doctrine—without pretending the web is magically single-vendor.",
  blocks: [
    {
      kind: "p",
      text: `If you have been watching AI headlines in 2026, you have seen the same pattern on repeat: a flagship model ships, a benchmark bar moves, and operators respond by opening another tab. The story is always local optimization. The harder problem is operational: how do you keep parallel tools legible when your work is project-shaped, not prompt-shaped? USJET answers that question structurally—by treating ${FLEET_UNIT_COUNT} partner destinations as bays in one manifest, not as a folder of bookmarks.`,
    },
    {
      kind: "h2",
      text: "Thirty is a floor plan, not a dare",
    },
    {
      kind: "p",
      text: `The fleet count is not an arbitrary marketing integer. It matches a hangar grid the product can render, expand, and reason about: ${FLEET_UNIT_COUNT} slots with stable callsigns, domains, and launch paths defined in code as fleetManifest. That roster is the single source of truth for the runway on the home deck, for Intel’s bay map, for Hangar workbenches, and for Member surfaces that display the same units in operational order. When a surface disagrees with the manifest, the surface is wrong—because the product’s job is to keep one aviation-grade strip.`,
    },
    {
      kind: "h3",
      text: "Partner cockpits plus command",
    },
    {
      kind: "p",
      text:
        "Most bays point at external partner tools the operator already uses. Origin is the command node on the strip: the place where USJET-owned workflow, customer service posture, and sovereign doctrine are supposed to read as institutionally native. The architecture does not collapse thirty companies into one model; it collapses thirty entry points into one clearance story—same window, same return discipline, same cockpit framing.",
    },
    {
      kind: "h2",
      text: "Integrated navigation is the hangar door",
    },
    {
      kind: "p",
      text:
        "USJET’s flight plan treats external launches as certified handoffs, not leaks. Practically, that means partner destinations are expected to open inside the ship’s cockpit wrapper with a return ghost bar, rather than spawning silent new windows that break state and brand. The point is behavioral continuity: the operator should feel like they walked onto a partner deck and can still find the bulkhead back to USJET without hunting the browser chrome.",
    },
    {
      kind: "h3",
      text: "Why that matters for labor-grade AI",
    },
    {
      kind: "p",
      text:
        "Blue-collar and field operators do not need another abstract assistant that forgets the job site. They need receipts: what was decided, what was launched, what cleared, what returned. A rostered fleet turns those receipts into layout—slots, names, and handoff surfaces—instead of turning them into a pile of anonymous browser sessions.",
    },
    {
      kind: "h2",
      text: "Unity is a protocol, not a press release",
    },
    {
      kind: "p",
      text:
        "The Sovereign Master Log describes fleet unity as a living mandate: the units are gathered under one roof so they can be found, compared, and eventually coordinated as a network rather than as isolated tabs. That is not a claim that thirty independent vendors suddenly share one neural weight; it is a claim about product posture—one architected hangar where the units recognize a shared strip, shared clearance tiers, and shared institutional voice.",
    },
    {
      kind: "p",
      text:
        "The same doctrine that forbids OAuth side doors also shapes how literacy surfaces behave: public pages like this dispatch exist to translate strip discipline into language a new operator can adopt before they pay for clearance. The revenue engine intent is explicit in the flight plan—partnership bays are reserved real estate, tiers extract through Stripe, and the UX is meant to read like a bank cockpit rather than a slide deck.",
    },
    {
      kind: "h2",
      text: "What you should do with this story",
    },
    {
      kind: "p",
      text:
        "If you are new to USJET, treat the fleet page as the map, the Founder page as the lineage, AI 101 as the habit layer, and Member clearance as the instrumented deck. If you are already cleared, treat session forks as telemetry rather than trophies—parallel brains are expensive, and the strip is only as trustworthy as the thread you declare authoritative.",
    },
    {
      kind: "p",
      text:
        "Next dispatches on this channel will stay close to the same spine: how sovereign operators adopt AI without losing the job, how cockpit discipline shows up in Member telemetry, and how the roster evolves while the hangar grid stays honest.",
    },
  ],
};

export const BLOG_BRIEF_POSTS: readonly BlogBriefPost[] = [
  {
    variant: "brief",
    slug: "two-keyboards-cursor-terminal-ollama",
    kicker: "Operator dispatch",
    title: "Two keyboards, one hangar: Cursor, Terminal, and Ollama",
    dateLabel: "May 2026",
    excerpt:
      "Sovereign operators split the job by surface: pair in the cloud for speed and structure, then ground long drafts on the Mac with Ollama—same discipline as a cockpit handoff, different strip for a different phase of flight.",
    expandedNote: `Multitasking with tools is not chaos if you declare where each job lives. One lane is for fast iteration and structural drafting in Cursor chat—tight feedback, accurate rewrites, and a UI that keeps the thread readable while the design takes shape.

When the work needs a local “home base” model, the handoff is deliberate: copy from chat, paste into Terminal, and run the stack you already trust on the machine. Terminal does not offer spellcheck or editorial chrome; it is a blunt instrument by design. That is acceptable when the compute you want is local inference, not a polished composition surface.

Ollama is the local runtime on that lane. A typical clearance check is \`ollama list\` to confirm what is installed and pulled, then a run line against the model you mean to fly—here, \`ollama run llama3:latest\`—so the session is explicitly tagged to the weight you intend, not whatever default happened to load last week.

Cloud pair-programming earns its seat for architecture, interface decisions, and cross-file refactors where latency to a capable remote model is a fair trade. The Mac plus Ollama earns its seat for long drafts, sensitive drafts you do not want to shuttle through shared chat logs, and runs where you want the machine to grind without another tab competing for attention.

The discipline is simple: pick the strip before you pick the throttle. If the task is “shape and correct quickly,” stay in chat. If the task is “run local inference on a declared model,” move to Terminal and accept the austerity in exchange for sovereignty and repeatability.

Strip checklist (operator habit layer):
- Draft and iterate in Cursor chat when speed and structure matter most.
- Copy the prompt or scaffold into Terminal when the job belongs on Ollama.
- Confirm inventory with \`ollama list\`, then run \`ollama run llama3:latest\` for the home-base pass.

SOS on this site stays human-edited by design; this blog channel is where “how we work” dispatches can land without pretending every line is an emergency signal.`,
  },
  {
    variant: "brief",
    slug: "industry-pulse-model-velocity",
    kicker: "Industry pulse",
    title: "Model velocity vs. strip discipline",
    dateLabel: "Briefing",
    excerpt:
      "Benchmark cycles are loud; hangar cycles are quiet. Institutions win when they publish a strip: what is cleared, what is trusted, what is authoritative, and what is merely open in another tab.",
    expandedNote:
      "USJET does not chase every release note as a reason to reorganize the deck. The manifest changes when the Founder’s flight plan changes—otherwise the operator keeps muscle memory on a stable grid.",
  },
  {
    variant: "brief",
    slug: "industry-pulse-embedded-labor",
    kicker: "Industry pulse",
    title: "Embedded copilots on the job site",
    dateLabel: "Briefing",
    excerpt:
      "The practical AI story for trades is not chat novelty; it is continuity across shifts—names, measurements, permits, and punch lists that survive handoff between humans and tools.",
    expandedNote:
      "When copilots multiply without a declared thread of record, crews pay in rework. The fleet layout is a deliberate counter-pressure: see the bays, pick the bay, return to the strip.",
  },
];
