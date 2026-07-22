/**
 * Zero-cost Origin Aura — onboard knowledge only.
 * No Gemini, OpenRouter, or paid cloud model calls.
 */

import { getFleetAbilityBySlot } from "../data/originFleetKnowledge";
import { fleetManifest } from "../data/fleetManifest";
import { getFleetCapabilities } from "../data/fleetCapabilities";
import {
  FLIGHT_PASS_STRIPE,
  HANGAR_PRO_STRIPE,
  FLEET_COMMANDER_STRIPE,
} from "../data/stripeProducts";
import {
  COMPETITIVE_POSITIONING_THESIS,
  OFFER_BUYING_REASONS,
} from "../data/competitivePositioning";
import { USJET_OPS_EMAIL } from "./usjetContact";

type BrainMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type BrainOptions = {
  entry?: "customer-service";
  memberContext?: string;
};

function lastUserText(messages: BrainMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.role === "user" && message.content.trim()) {
      return message.content.trim();
    }
  }
  return "";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s./$-]/g, " ").replace(/\s+/g, " ").trim();
}

function flightPlan(body: string): string {
  return `Welcome to U. S. Jet.\n\nFlight Plan\n${body}`;
}

function findFleetHits(query: string) {
  const q = normalize(query);
  return [...fleetManifest]
    .map((unit) => {
      const hay = normalize(
        [
          unit.name,
          unit.callsign,
          unit.domain,
          unit.aiName ?? "",
          getFleetAbilityBySlot(unit.slot),
        ].join(" "),
      );
      let score = 0;
      for (const token of q.split(" ")) {
        if (token.length < 3) continue;
        if (hay.includes(token)) score += token.length >= 5 ? 3 : 2;
      }
      if (q.includes(normalize(unit.domain))) score += 8;
      if (q.includes(normalize(unit.callsign))) score += 8;
      if (q.includes(normalize(unit.name))) score += 6;
      return { unit, score };
    })
    .filter((hit) => hit.score >= 4)
    .sort((a, b) => b.score - a.score);
}

function answerFleetUnit(unit: (typeof fleetManifest)[number]): string {
  const caps = getFleetCapabilities(unit.slot);
  const ability = getFleetAbilityBySlot(unit.slot);
  const bay = String(unit.slot + 1).padStart(2, "0");
  const input =
    caps.inputModes === "both" ? "voice and text" : caps.inputModes === "voice" ? "voice" : "text";

  return flightPlan(
    [
      `${unit.name} (${unit.callsign}) sits in Hangar bay ${bay}.`,
      `Capability: ${ability}.`,
      `Domain: ${unit.domain}. Input: ${input}. Platforms: ${caps.platforms.join(", ")}.`,
      `Open it from Hangar (/) or Fleet (/fleet) — same window, one ship, one cockpit.`,
    ].join(" "),
  );
}

function answerFromMemberContext(memberContext: string | undefined, query: string): string | null {
  if (!memberContext?.trim()) return null;
  const q = normalize(query);
  if (!/(who am i|my (account|tier|clearance|project|projects|member)|session fork|logged ?in)/.test(q)) {
    return null;
  }
  const lines = memberContext
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
  return flightPlan(
    [
      "Your clearance is on the ledger — reading only what Member Context shows:",
      ...lines.map((line) => `• ${line}`),
      "I do not invent counts or tiers beyond that block.",
    ].join("\n"),
  );
}

/** Onboard Origin reply — never calls a paid model. */
export function answerOriginFromKnowledge(
  messages: BrainMessage[],
  options?: BrainOptions,
): string {
  const raw = lastUserText(messages);
  const q = normalize(raw);
  const cs = options?.entry === "customer-service";

  if (!q) {
    return flightPlan(
      cs
        ? "Customer Service channel open. What's your project, and how can I help?"
        : "I'm Origin — onboard command for U. S. Jet. Ask about the fleet, Hangar, tiers, login, or which bay to open.",
    );
  }

  const memberAnswer = answerFromMemberContext(options?.memberContext, raw);
  if (memberAnswer) return memberAnswer;

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening)|what's up|whats up)\b/.test(q)) {
    return flightPlan(
      cs
        ? "Customer Service here. I can help with Hangar, Fleet, login, tiers, and which AI bay to open. What's your project?"
        : "I'm Origin, your guide to the twenty-nine partner tools and this ship. Ask what a bay does, how tiers work, or where to open Hangar.",
    );
  }

  if (/(jet ?browser|browser tile|open (a )?(domain|link|url))/.test(q)) {
    return flightPlan(
      "Jet Browser (/jet-browser) lets you enter any domain into Hangar-style tiles — enlarge, work, shrink. Layout: 2, 3, or 4 rows. One ship, one cockpit.",
    );
  }

  if (/(hangar|workbench|home ?bay|free tab)/.test(q)) {
    return flightPlan(
      `Hangar (/) is home. First 3 workbench tabs are free. ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period} Flight Pass unlocks the rest. Open a bay, enlarge to work, shrink back to formation.`,
    );
  }

  if (/(fleet|runway|30 (ai|unit)|partner ai|which (ai|tool|bay))/.test(q) && !findFleetHits(raw).length) {
    return flightPlan(
      "Fleet (/fleet) is the runway of partner AIs. Guests get 10 free bays; Flight Pass clears the rest. Name a tool (ChatGPT, Claude, Midjourney…) and I'll route you to the bay.",
    );
  }

  if (
    /(why (usjet|us jet)|better than|vs\.? |versus |competitor|alternative|chatgpt only|custom build|fragmented|why (not|buy)|objection|positioning)/.test(
      q,
    )
  ) {
    return flightPlan(
      [
        COMPETITIVE_POSITIONING_THESIS,
        "",
        "Buy reasons:",
        ...OFFER_BUYING_REASONS.map((o) => `• ${o.offer} (${o.priceDisplay}): ${o.buyBecause}`),
      ].join("\n"),
    );
  }

  if (/(price|pricing|tier|cost|subscription|flight pass|hangar pro|enterprise|how much|\$19|\$49|\$199)/.test(q)) {
    return flightPlan(
      [
        `Stripe only — no Google/Apple login, no other processors.`,
        `• Flight Pass ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period} — full Hangar tabs + Member Portal`,
        `• Hangar Pro ${HANGAR_PRO_STRIPE.priceDisplay}${HANGAR_PRO_STRIPE.period} — adds Intel`,
        `• Enterprise Commander ${FLEET_COMMANDER_STRIPE.priceDisplay}${FLEET_COMMANDER_STRIPE.period} — adds Origin`,
        `Pay on Stripe, then verify at /member/login.`,
      ].join("\n"),
    );
  }

  if (/(login|log in|sign in|member (id|portal|login)|oauth|stripe verify|cus_)/.test(q)) {
    return flightPlan(
      "Login is Stripe-only: billing email + Member ID (cus_…) at /member/login. No Google, Apple, or social sign-in. Member Portal holds Mission Projects after clearance.",
    );
  }

  if (/(founder|ameer|grit|story)/.test(q)) {
    return flightPlan(
      "Ameer Karim forged this fleet in grit. Wrenches, not slides — this ship is a revenue engine for America's labor force.",
    );
  }

  if (/(intel|nyse|robinhood|coinbase|bitcoin bay)/.test(q)) {
    return flightPlan(
      "Intel (/intel) is Hangar Pro+. Partnership bays stay reserved revenue real estate until Titans pay — we do not rent NYSE feeds. Hold the line.",
    );
  }

  if (/(origin|who are you|what are you|aura)/.test(q)) {
    return flightPlan(
      "I'm Origin (Aura) — bay 30 command node. I teach the twenty-nine partner AIs, Hangar, tiers, login, and ops. Ask anything about the ship.",
    );
  }

  if (/(email|ops@|contact|support|help desk|customer service)/.test(q)) {
    return flightPlan(
      cs
        ? `Customer Service stays here in chat for fleet and account questions. For billing disputes or lockouts, email Ops at ${USJET_OPS_EMAIL} — async, 1–3 business days.`
        : `For human follow-up, email Ops at ${USJET_OPS_EMAIL} (1–3 business days). Instant ship help stays with me on Origin.`,
    );
  }

  if (/(cockpit|new tab|external|leak)/.test(q)) {
    return flightPlan(
      "One Ship, One Cockpit. Partner tools open in-window through /cockpit — no target=_blank leaks. Hangar enlarge keeps you on the floor.",
    );
  }

  const hits = findFleetHits(raw);
  if (hits[0]) {
    if (hits.length === 1 || hits[0].score >= hits[1]!.score + 3) {
      return answerFleetUnit(hits[0].unit);
    }
    const top = hits.slice(0, 3);
    return flightPlan(
      [
        "Several bays match — pick one:",
        ...top.map(({ unit }) => {
          const bay = String(unit.slot + 1).padStart(2, "0");
          return `• Bay ${bay}: ${unit.name} (${unit.callsign}) — ${getFleetAbilityBySlot(unit.slot)}`;
        }),
        "Say the bay number or name and I'll lock the flight plan.",
      ].join("\n"),
    );
  }

  if (/(thank|thanks|appreciate)/.test(q)) {
    return flightPlan("Cleared. Ask whenever you need another bay or a tier briefing.");
  }

  return flightPlan(
    [
      "I'm Origin — your command guide for U. S. Jet.",
      "I can brief Hangar, Fleet bays, Jet Browser, tiers, Stripe login, Founder, Intel, and ops email.",
      "Name a partner AI (for example Claude or Midjourney), or ask how Flight Pass works.",
      cs ? "What's your project?" : "What do you need cleared?",
    ].join(" "),
  );
}
