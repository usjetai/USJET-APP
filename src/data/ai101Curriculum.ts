import type { Ai101CurriculumRow, Ai101GlossaryCore } from "./ai101GlossaryTypes";
import { AI101_GLOSSARY_ENTRIES } from "./ai101Acronyms";
import { TELEMETRY_ACRONYM_ENTRIES } from "./telemetryAcronyms";

type SiteLesson = Pick<Ai101CurriculumRow, "websiteContext" | "lesson">;

const SITE_AND_LESSON: Record<string, SiteLesson> = {
  AI: {
    websiteContext:
      "Fleet cards on `/` label each bay as a named unit; Founder and Member copy describe the fleet as the visible AI roster instead of a generic chatbot list.",
    lesson:
      "Treat AI here as a bay assignment: you pick a jet, read its callsign, and carry its protocol. The runway is the curriculum—no anonymous model hopper.",
  },
  AURA: {
    websiteContext:
      "Aura enums live on each `FleetUnit` in `fleetManifest` and surface in Intel monitors and bay chrome as idle, listening, processing, or talking posture lines.",
    lesson:
      "Aura is theater with discipline: it tells the crew which senses are hot without pretending we are streaming biometric data. Watch the strip, match your tempo.",
  },
  BAY: {
    websiteContext:
      "Bays render as `FleetCard` tiles on the Fleet runway, Hangar workbench slots, and Intel monitor cells—each shows bay number, callsign, and partner host.",
    lesson:
      "A bay is your deed to one square of the hangar floor. Learn its index, respect its accent color, and remember it is a workstation—not wallpaper.",
  },
  CALLSIGN: {
    websiteContext:
      "Callsigns print under each unit name on Fleet cards, Hangar expansions, Member fleet boards, and Founder roster glass—always paired with the bay label.",
    lesson:
      "If you remember nothing else, remember the callsign. It is how logs, clipboard protocol, and hangar chatter refer to the same soul in slot space.",
  },
  CLEAR: {
    websiteContext:
      "`memberAccessLevel` maps Stripe tier strings to ranks 0–3; `TierRouteGate` and `AppNav` use `canMemberAccessRoute` to hide Hangar, Intel, Origin, or Member until cleared.",
    lesson:
      "Clearance is the airfield lights: dim until you pay, bright when Stripe says go. I do not issue the stamp—I only taxi where the lights say we are allowed.",
  },
  COCKPIT: {
    websiteContext:
      "Partners load in `/cockpit` with `CockpitReturnBar` so the iframe stays inside the sovereign shell per `integratedLaunchUrl` / fleet launch helpers.",
    lesson:
      "Cockpit means you never vanish out the side door. You launch, you work, you hit the ghost bar and you are home. That is integrated navigation, not a pop-up habit.",
  },
  CUST: {
    websiteContext:
      "Mission Projects in `/member` key local storage rows off your Stripe customer id so assignments and saved missions stay partitioned per verified account.",
    lesson:
      "That customer id is the tail number on your paperwork. Projects, forks, and timers stick to it—swap accounts on the same machine and you swap hangars.",
  },
  FORK: {
    websiteContext:
      "The Member Portal mission tracker increments session forks when parallel tabs stay open, with copy warning RAM loss next to each mission row.",
    lesson:
      "Forks are parallel ghosts of yourself. Each extra tab splits attention; the counter is blunt on purpose so you feel the weight of cloning the cockpit.",
  },
  MISSION: {
    websiteContext:
      "Projects are created inside the Member Portal tracker UI: name a mission, attach fleet units, save mission records, and set which unit receives time attribution.",
    lesson:
      "A mission is your flight plan object—not vaporware. Name it, assign bays, save the log. If you would not file it with dispatch, do not file it here.",
  },
  SESSION: {
    websiteContext:
      "Usage sessions stack in the Member tracker with timestamps and duration while the portal tab stays focused—copy states it measures USJET time, not vendor token bills.",
    lesson:
      "Sessions are honest clocks on presence. They will not guess your OpenRouter invoice; they only know you were here, staring at sovereign glass, doing work.",
  },
  SLOT: {
    websiteContext:
      "`fleetBayAccentStyle` and `getFleetBayAccent` read the zero-based slot to paint CSS variables on cards, Intel monitors, Hangar benches, and cockpit accents.",
    lesson:
      "Slot is where color genetics live. Same code path everywhere: if the slot changes, the accent travels with it. Memorize your number like a parking space.",
  },
  FLEET: {
    websiteContext:
      "The `/` runway renders `fleetManifest` through `FleetCard`, enforcing same-window launches and command styling for the Origin command bay.",
    lesson:
      "Fleet is the public face of the thirty-strong roster. You are not browsing logos—you are walking a flight line where every jet owns a domain and a story.",
  },
  GATE: {
    websiteContext:
      "`TierRouteGate` wraps Hangar, Member, Intel, Origin, and Special routes, showing upgrade copy from `tierRouteGateCopy` when clearance is too low.",
    lesson:
      "Gates are not insults; they are pressure seals. I stand behind them until your Stripe tier matches the deck behind the door—then the hatch spins open.",
  },
  GUEST: {
    websiteContext:
      "Guest routes include `/`, `/member/login`, `/cockpit`, `/sos`, and this `/ai-101` page; Hangar and Intel stay hidden until Flight Pass or higher.",
    lesson:
      "Guests get the window seat: runway, founder story, SOS, and school. I will wave from the hangar side of the glass until your clearance catches up.",
  },
  HANGAR: {
    websiteContext:
      "`/hangar` lists sorted `fleetManifest` units with expandable bays into cockpits, honoring `getHangarBayLimit` teasers versus paid bay caps in toast copy.",
    lesson:
      "Hangar is where wrenches meet glass: fewer teaser bays for guests, more simultaneous cockpits when you pay. Treat every expansion like rolling a jet onto the line.",
  },
  HOST: {
    websiteContext:
      "Each `FleetCard` prints the partner `domain` string under the callsign so operators know which host the cockpit iframe targets after wrap.",
    lesson:
      "Host is the address on the flight plan. Read it before launch so you know which partner airspace you enter—still inside USJET metal, but labeled honestly.",
  },
  INTEL: {
    websiteContext:
      "`/intel` shows the pulse dashboard, Top 10 lock panel, reserved bays, and fleet vitals—reserved boxes stay vacant partnership real estate without live brokerage feeds.",
    lesson:
      "Intel is a museum wall, not a trading desk ticker. We stage Titans’ future seats; we do not pipe live NYSE drama into the frame. Respect the hold line.",
  },
  LLM: {
    websiteContext:
      "Units carry `systemPrompt` text from `usjetProtocol` builders; Member and Hangar flows copy that protocol to clipboard instead of opening random model dashboards.",
    lesson:
      "LLM is the engine under the cowling. You still fly the airframe: prompts, protocol, and bay identity beat chasing anonymous endpoints across the internet.",
  },
  LVL: {
    websiteContext:
      "Member sessions store `accessLevel` strings parsed by `accessLevelRank` alongside `stripeTier` so UI badges can show Flight Pass, Hangar Pro, or Enterprise labels.",
    lesson:
      "LVL strings are paperwork dialects from Stripe and access files. Translate them to rank in your head: higher number, more flight surfaces, fewer locked hatches.",
  },
  MEMBER: {
    websiteContext:
      "`/member` hosts FoundersAccessGate, Founder Special checkout, Mission Projects, fleet boards, and portal usage timers after Stripe verification succeeds.",
    lesson:
      "Member is the ready room: verify, upgrade, track missions, watch time on station. If Fleet is the runway, Member is where you file the flight plan.",
  },
  NAV: {
    websiteContext:
      "`AppNav` filters `NAV_LINKS` with `canMemberAccessRoute`, rendering liquid-glass capsule buttons for Fleet, Hangar, Intel, Founder, Origin, and Member when allowed.",
    lesson:
      "Capsule nav is the compass rose. Hidden links are not broken—they are gated. When your tier lights a route, click it; everything stays inside one ship.",
  },
  ORIGIN: {
    websiteContext:
      "`/origin` shows tiered fleet knowledge panels and hardware-forward copy; SOS links describe Origin audio checks separate from guest-only teaser paths.",
    lesson:
      "Origin is the long runway story: silicon heritage, fleet knowledge, heir lanes. Enterprise clears it; guests read about it elsewhere. I guard that threshold.",
  },
  PROMPT: {
    websiteContext:
      "Clicking a bay copies `buildUnitSystemPrompt` output; Hangar expand and Fleet launch paths encourage carrying that prompt into cockpit sessions.",
    lesson:
      "Prompt is your briefing card. If you launch without reading it, you are doing barnstorming, not operations. Copy, read, then light the engines.",
  },
  PROTO: {
    websiteContext:
      "`copyUsjetProtocol` fires from `FleetCard` interactions so operators sync the sovereign instruction block tied to each manifest entry.",
    lesson:
      "Protocol is the law inside the jet. It is static text, versioned intent, and Founder voice—not a live negotiation with a mystery API on the other end.",
  },
  SOS: {
    websiteContext:
      "`/sos` collects browser, Origin audio, and Stripe member-id troubleshooting tabs and links forward to this AI 101 curriculum in the same window.",
    lesson:
      "SOS is the calm frequency when something glitches. Read it slow, fix line noise, then march here for vocabulary. Panic is expensive; procedure is cheap.",
  },
  STRIPE: {
    websiteContext:
      "Stripe payment links live in `stripePaymentLink.ts`; Member login and gates repeatedly state Stripe-only verification with no Google or Apple OAuth path.",
    lesson:
      "Stripe is the only toll booth on this highway. No side doors, no social logins—just paid clearance and Member ID. Memorize that security lock cold.",
  },
  TIER: {
    websiteContext:
      "Tier badges appear in Hangar hero copy, upgrade toasts, and Founder Special pricing strips referencing Flight Pass, Hangar Pro, and Enterprise Commander amounts.",
    lesson:
      "Tier is how many bays, intel boards, and origin doors you may touch. Buy the tier that matches your workload—then stop arguing with the gate software.",
  },
  USJET: {
    websiteContext:
      "Global chrome stacks `WarpBackground`, `GlobalVideoBackground`, `AppNav`, and page shells that keep `page-atmosphere` transparent so warp motion reads through.",
    lesson:
      "USJET is the airframe wrapping every route. We paint in glass, grit, and velocity on purpose—templates need not apply on this flight line.",
  },
  WRAP: {
    websiteContext:
      "`integratedLaunchUrl` and cockpit routing keep partner targets inside `/cockpit` iframes, matching the master log rule against `target=\"_blank\"` leaks.",
    lesson:
      "Wrap is the hull plating around foreign content. Partners ride inside our metal; the return bar is your tether back to fleet command—never break the seal.",
  },
};

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function mergeCoreRows(a: readonly Ai101GlossaryCore[], b: readonly Ai101GlossaryCore[]): Ai101GlossaryCore[] {
  const map = new Map<string, Ai101GlossaryCore>();
  for (const row of a) {
    map.set(normalizeCode(row.code), { ...row, code: normalizeCode(row.code) });
  }
  for (const row of b) {
    const key = normalizeCode(row.code);
    if (!map.has(key)) {
      map.set(key, { ...row, code: key });
    }
  }
  return Array.from(map.values()).sort((x, y) => x.code.localeCompare(y.code));
}

const mergedCore = mergeCoreRows(TELEMETRY_ACRONYM_ENTRIES, AI101_GLOSSARY_ENTRIES);

function buildCurriculum(): Ai101CurriculumRow[] {
  const rows: Ai101CurriculumRow[] = [];
  for (const core of mergedCore) {
    const extra = SITE_AND_LESSON[core.code];
    if (!extra) {
      throw new Error(`AI101 curriculum missing websiteContext/lesson for code ${core.code}`);
    }
    rows.push({ ...core, ...extra });
  }
  return rows;
}

/** Canonical merged glossary: telemetry first wins on duplicate codes, then AI101-only rows; sorted by `code`. */
export const AI101_CANONICAL_CURRICULUM: readonly Ai101CurriculumRow[] = buildCurriculum();

export const AI101_GLOSSARY_ROW_COUNT = AI101_CANONICAL_CURRICULUM.length;
