/** AI 101 — how the Operator's Rig shop works (plain English, first-run). */

export type Ai101LessonSection = {
  id: string;
  title: string;
  route?: string;
  kicker: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const AI101_LESSON_INTRO = {
  title: "AI 101 — the computer, then the cockpit",
  lede:
    "USJET sells one primary product: a computer with a local assistant already on it (the Operator's Rig). Homes is the house shop. Business — the header button, the /fleet page — is the shop-and-office shop. The $19.90/mo Flight Pass is a separate optional cockpit, not the same hero.",
} as const;

export const AI101_LESSON_SECTIONS: readonly Ai101LessonSection[] = [
  {
    id: "product",
    title: "The product: Operator's Rig",
    route: "/",
    kicker: "Primary offer",
    paragraphs: [
      "We buy the listed machine, install a local assistant (engine, screen, document vault, manuals), and ship it talking. You are not buying a mute Mac from a box store, and you are not renting ChatGPT by the month as the main purchase.",
      "One-time hardware. Stripe checkout on the tile. USJET LLC on the invoice. Founder: Ameer Karim.",
    ],
    bullets: [
      "Homes (/) — computers for the house.",
      "Business (/fleet) — computers and always-on boxes for a shop or office.",
      "Deck — the left-edge tab. That is the site menu.",
    ],
  },
  {
    id: "homes",
    title: "Homes — house computers",
    route: "/",
    kicker: "Also called Hangar",
    paragraphs: [
      "The home page is the house shop. Aviation chrome still says Hangar. For a first-time buyer it means: Mac Mini, MacBook, mini PC — a Jarvis on YOUR desk, files stay on the box.",
      "Scroll past the film to the lineup. Order yours is the hardware catalog, not a $19.90 gate.",
    ],
  },
  {
    id: "business",
    title: "Business — shop and office computers",
    route: "/fleet",
    kicker: "Also called Fleet",
    paragraphs: [
      "The header says Business. The URL is /fleet. Same shop: bigger memory, machines that stay on. A server here just means a computer that does not go home in a bag.",
      "Same install as Homes. Different size of box.",
    ],
  },
  {
    id: "stack",
    title: "What we put on it",
    kicker: "Local stack",
    paragraphs: [
      "Ollama is the engine — the model runs on THIS computer. Open WebUI is the screen that looks like ChatGPT. AnythingLLM is the vault for YOUR PDFs. The AI Book Series is the manual in the box.",
      "A one-click start sits on the desktop. Same day it arrives — not three weekends in a forum.",
    ],
  },
  {
    id: "cockpit",
    title: "Optional monthly cockpit",
    route: "/compare",
    kicker: "Secondary door",
    paragraphs: [
      "Flight Pass $19.90/mo, Hangar Pro $49.95/mo, and Enterprise Commander $199.99/mo still exist as Stripe subscriptions. They are not the Operator's Rig.",
      "If you already own a computer and want the monthly hangar, that door is on Compare. If you came here to buy a machine, stay on Homes or Business.",
    ],
    bullets: [
      "Hardware = one-time purchase on the tiles.",
      "Cockpit = optional monthly Stripe link.",
      "No Google or Apple login. Stripe only.",
    ],
  },
  {
    id: "trust",
    title: "Who sells this, and if a box lands wrong",
    route: "/about",
    kicker: "Trust",
    paragraphs: [
      "About states the facts we already publish: Ameer Karim, USJET LLC, established 2018, New York mail, ops@usjet.ai. No invented biography.",
      "Returns & warranty restates the Terms: manufacturer warranties apply; a numbered USJET return window is still a placeholder in the Terms, so we do not advertise a 30-day no-questions return. Damaged or dead-on-arrival — write Ops with the Stripe receipt.",
    ],
  },
  {
    id: "help",
    title: "Help (/sos)",
    route: "/sos",
    kicker: "Short answers",
    paragraphs: [
      "Help is the practical desk: orders, shipping, setup, and the optional cockpit prices. This AI 101 page is the lesson. Portrait works on a phone — you do not have to rotate to shop.",
    ],
  },
];
