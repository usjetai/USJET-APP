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
  title: "AI 101 — the computer and the books",
  lede:
    "USJET sells computers that already have a local assistant on them (the Operator's Rig) and books by Ameer Karim. One Rig can run up to 30 local AI models on the machine. Homes is the house shop. Business is the shop-and-office shop. That is the product.",
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
      "Business (/business) — computers and always-on boxes for a shop or office.",
      "Manuals (/store) — Engineering Series, Enemy Skies, and Jet Fighter coloring books.",
      "Deck — the left-edge tab. That is the site menu.",
    ],
  },
  {
    id: "homes",
    title: "Homes — house computers",
    route: "/",
    kicker: "House shop",
    paragraphs: [
      "The home page is the house shop: Mac Mini, MacBook, mini PC — a Jarvis on YOUR desk, files stay on the box.",
      "Scroll past the film to the lineup. Order yours is the hardware catalog.",
    ],
  },
  {
    id: "business",
    title: "Business — shop and office computers",
    route: "/business",
    kicker: "Shop & office",
    paragraphs: [
      "The header says Business. The URL is /business. Same shop: bigger memory, machines that stay on. A server here just means a computer that does not go home in a bag.",
      "Same install as Homes. Different size of box.",
    ],
  },
  {
    id: "stack",
    title: "What we put on it",
    kicker: "Local stack",
    paragraphs: [
      "Ollama is the engine — the model runs on THIS computer. Open WebUI is the screen that looks like ChatGPT. AnythingLLM is the vault for YOUR PDFs. The books are in the box.",
      "One Operator's Rig can run up to 30 local AI models on the machine. That is hardware capacity, not a monthly cockpit of 30 web AIs.",
      "A one-click start sits on the desktop. Same day it arrives — not three weekends in a forum.",
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
      "Help is the practical desk: orders, shipping, and setup. This AI 101 page is the lesson. Portrait works on a phone — you do not have to rotate to shop.",
    ],
  },
  {
    id: "leftover",
    title: "A leftover monthly Stripe link",
    route: "/compare",
    kicker: "Not the shop",
    paragraphs: [
      "Flight Pass $19.90/mo still exists as a leftover Stripe subscription from an earlier version of this site. It is not the Operator's Rig. You do not need it to buy a computer or a book.",
      "If you already paid that leftover link, email ops@usjet.ai. If you came here to buy a machine, stay on Homes or Business.",
    ],
  },
];
