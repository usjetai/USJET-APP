import { HARDWARE_STRIPE } from "../lib/stripePaymentLink";

/**
 * USJET Operator's Rig — computers that already have AI in them.
 *
 * Hangar = home. Fleet = business / servers.
 * Fulfillment: USJET buys the exact SKU (Amazon) and ships it. Stripe collects
 * payment + address. No dropship API.
 *
 * The product is not "a Mac." The product is a curated local-AI stack so the
 * buyer never lives in terminal-hell (Docker, model weights, API proxies).
 */

export const HARDWARE_ROUTE = "/store/ai-computers" as const;
export const HANGAR_HARDWARE_ROUTE = "/" as const;
export const FLEET_HARDWARE_ROUTE = "/fleet" as const;

export const HARDWARE_MAX_QUANTITY_PER_LINE = 10 as const;

export type HardwareMission = "home" | "business";
export type HardwareCategory = "apple-silicon" | "mini-pc";

export type HardwareProduct = {
  id: string;
  missions: readonly HardwareMission[];
  category: HardwareCategory;
  name: string;
  configLabel: string;
  brand: string;
  priceUsd: number;
  stripeEnvKey: string;
  /** Live Stripe Price ID — env `stripeEnvKey` can override. */
  stripePriceId?: string;
  /** Live buy.stripe.com Payment Link (Direct Landing). */
  stripePaymentLink?: string;
  specs: string[];
  goodFor: string;
  blurb: string;
  amazonSearchTerm: string;
  imageSrc: string;
  badge?: string;
  /** No Stripe Price yet — show contact instead of checkout. */
  contactToOrder?: boolean;
};

export const OPERATOR_STACK = [
  {
    id: "engine",
    layer: "Engine",
    name: "Ollama",
    plain: "The motor. Runs the AI on THIS computer — not in a cloud tab.",
  },
  {
    id: "face",
    layer: "Jarvis screen",
    name: "Open WebUI",
    plain: "Looks like ChatGPT. Lives in a browser on your machine. Not a terminal.",
  },
  {
    id: "vault",
    layer: "Memory vault",
    name: "AnythingLLM",
    plain: "Drop PDFs, notes, invoices. It answers from YOUR files. Nothing has to leave the box.",
  },
  {
    id: "manual",
    layer: "Manual",
    name: "AI Book Series",
    plain: "The Founder's books in the box — how to run the rig, not a generic Apple PDF.",
  },
] as const;

export const OPERATOR_SETUP_PROMISE = {
  title: "Plug it in. Talk to it.",
  body: "A one-click start sits on the desktop. It wakes the Jarvis, opens the screen, and points the vault at your documents. Same day it arrives — not three weekends in a forum.",
} as const;

/** What USJET does to the hardware before it leaves — left-to-right spec rows. */
export const WHAT_WE_DO_TO_THE_COMPUTER = [
  {
    label: "We buy it",
    body: "Exact SKU on the tile. Amazon-sourced. No bait-and-switch, no leftover box from a different year.",
  },
  {
    label: "We give it a Jarvis",
    body: "People spend weekends building a personal assistant onto a laptop. We do that work. The brain lives on YOUR desk.",
  },
  {
    label: "We ship it talking",
    body: "One-click start. Private files stay on the machine. AI Book Series in the box. You paid for the result, not the homework.",
  },
] as const;

export const WHY_USJET_HARDWARE = {
  kicker: "Not a Best Buy Mac",
  title: "Everybody can sell a computer. We give it a Jarvis and send it home.",
  points: [
    {
      title: "The assistant, not the homework",
      body: "That viral build — a personal Jarvis on a real computer — is the product. We install it. You talk to it.",
    },
    {
      title: "Memory is the number",
      body: "16GB runs small models. 24GB is the home sweet spot. 64GB+ is a shop or office brain that stays loaded all day.",
    },
    {
      title: "Your files stay yours",
      body: "Cloud chat trains on the internet. This Jarvis talks on your desk. Family photos and work docs do not get pasted into someone else's server.",
    },
  ],
} as const;

export const HOME_DECK = {
  kicker: "Hangar · Home AI computers",
  title: "We give the computer a personal Jarvis",
  lede: "You are not buying a mute Mac. We buy the machine, put a personal assistant on it, and ship it. You talk to YOUR computer — kitchen counter, office nook, quiet closet. Private. No ChatGPT bill.",
  primerTitle: "What we do to these computers",
  primer: [
    "We buy the exact unit.",
    "We put a personal Jarvis on it — local AI that lives in the box.",
    "We ship it ready to talk the day it hits your door.",
  ],
} as const;

export const BUSINESS_DECK = {
  kicker: "Fleet · Business AI computers",
  title: "A Jarvis for the shop that never goes to sleep",
  lede: "Same gift as Hangar — we put an assistant on the computer — built for a team. More memory. More cooling. A box that stays on so the office talks to the machine, not a chatbot tab that leaks the job.",
  primerTitle: "What we do to these computers",
  primer: [
    "We buy the bigger box — Studio, 64GB–128GB mini-PCs, always-on closets.",
    "We give it a company Jarvis that stays loaded for the shop.",
    "We ship it. A server here just means a computer that does not go home in a bag.",
  ],
} as const;

export const HARDWARE_HERO_KICKER = "Operator's Rig · Personal Jarvis on real hardware" as const;
export const HARDWARE_HERO_TITLE = "We buy the computer. We give it a Jarvis. We ship it." as const;
export const HARDWARE_HERO_LEDE =
  "Hangar is home. Fleet is business. Every unit leaves as a USJET Operator's Rig — a personal assistant on YOUR hardware, not a cloud tab." as const;

export const HARDWARE_CATEGORY_LABELS: Record<HardwareCategory, string> = {
  "apple-silicon": "Apple Silicon",
  "mini-pc": "Local-AI Mini PCs",
};

export const HARDWARE_PRODUCTS: readonly HardwareProduct[] = [
  {
    id: "mac-mini-m4-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 899,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_16_256",
    stripePriceId: HARDWARE_STRIPE["mac-mini-m4-16-256"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-mini-m4-16-256"].paymentLink,
    specs: ["Apple M4 chip", "16GB unified memory", "256GB SSD", "Silent home box"],
    goodFor: "First home AI computer — small models (think 7B–8B), homework, recipes, family questions. Quiet enough for a living room.",
    blurb: "The cheapest real door onto Apple Silicon. Sit it next to the router. Leave it on.",
    amazonSearchTerm: "Apple Mac Mini M4 16GB 256GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
  },
  {
    id: "mac-mini-m4-16-512",
    missions: ["home"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 16GB / 512GB",
    brand: "Apple",
    priceUsd: 1099,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_16_512",
    stripePriceId: HARDWARE_STRIPE["mac-mini-m4-16-512"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-mini-m4-16-512"].paymentLink,
    specs: ["Apple M4 chip", "16GB unified memory", "512GB SSD", "Room for more models on disk"],
    goodFor: "Same home brain as the base Mini, with double the storage so you can keep more than one local model downloaded.",
    blurb: "Buy this when you know you will collect models like tools in a drawer.",
    amazonSearchTerm: "Apple Mac Mini M4 16GB 512GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
  },
  {
    id: "mac-mini-m4-24-512",
    missions: ["home", "business"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 24GB / 512GB",
    brand: "Apple",
    priceUsd: 1349,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_24_512",
    stripePriceId: HARDWARE_STRIPE["mac-mini-m4-24-512"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-mini-m4-24-512"].paymentLink,
    specs: ["Apple M4 chip", "24GB unified memory", "512GB SSD", "Home sweet spot · small office"],
    goodFor: "The default Hangar pick. 24GB runs mid-size models with room for the operating system. Also a one-person office brain.",
    blurb: "If you only want one number to remember: 24GB is where home AI stops feeling like a toy.",
    amazonSearchTerm: "Apple Mac Mini M4 24GB 512GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
    badge: "Home pick",
  },
  {
    id: "macbook-air-m4-13-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "MacBook Air 13\"",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 1349,
    stripeEnvKey: "STRIPE_PRICE_MACBOOK_AIR_M4_13_16_256",
    stripePriceId: HARDWARE_STRIPE["macbook-air-m4-13-16-256"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["macbook-air-m4-13-16-256"].paymentLink,
    specs: ["Apple M4 chip", "16GB unified memory", "13.6\" display", "Fanless · up to 18 hrs"],
    goodFor: "AI you can take to the kitchen table or a job walkthrough. Small models on the go. Silent.",
    blurb: "For the operator who will not leave the brain on a desk.",
    amazonSearchTerm: "Apple MacBook Air M4 13-inch 16GB 256GB",
    imageSrc: "/store/hardware/macbook-air-m4-13.jpg",
  },
  {
    id: "macbook-air-m4-15-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "MacBook Air 15\"",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 1499,
    stripeEnvKey: "STRIPE_PRICE_MACBOOK_AIR_M4_15_16_256",
    stripePriceId: HARDWARE_STRIPE["macbook-air-m4-15-16-256"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["macbook-air-m4-15-16-256"].paymentLink,
    specs: ["Apple M4 chip", "16GB unified memory", "15.3\" display", "Fanless · up to 18 hrs"],
    goodFor: "Same portable local AI as the 13\" — bigger screen so the chat and your work sit side by side.",
    blurb: "More glass. Same quiet. Still a home machine you can close and walk away with.",
    amazonSearchTerm: "Apple MacBook Air M4 15-inch 16GB 256GB",
    imageSrc: "/store/hardware/macbook-air-m4-15.jpg",
  },
  {
    id: "gmktec-evo-x2",
    missions: ["home", "business"],
    category: "mini-pc",
    name: "GMKtec EVO-X2",
    configLabel: "Ryzen AI Max 385 · 64GB",
    brand: "GMKtec",
    priceUsd: 1799,
    stripeEnvKey: "STRIPE_PRICE_GMKTEC_EVO_X2",
    stripePriceId: HARDWARE_STRIPE["gmktec-evo-x2"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["gmktec-evo-x2"].paymentLink,
    specs: ["AMD Ryzen AI Max 385", "64GB unified memory", "Compact mini-PC", "Windows or Linux"],
    goodFor: "A lot of memory in a small box — serious local models without Apple money. Home lab or small shop.",
    blurb: "When you want 64GB of brain-room without buying a Studio.",
    amazonSearchTerm: "GMKtec EVO-X2 Ryzen AI Max 385 64GB",
    imageSrc: "/store/hardware/gmktec-evo-x2.jpg",
  },
  {
    id: "mac-studio-m4-max",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Studio",
    configLabel: "M4 Max · 36GB / 512GB",
    brand: "Apple",
    priceUsd: 3799,
    stripeEnvKey: "STRIPE_PRICE_MAC_STUDIO_M4_MAX",
    stripePriceId: HARDWARE_STRIPE["mac-studio-m4-max"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-studio-m4-max"].paymentLink,
    specs: ["Apple M4 Max", "36GB unified memory", "Studio cooling", "All-day inference"],
    goodFor: "Daily-driver office brain. Bigger models, sustained loads, quiet enough to live under a desk.",
    blurb: "This is the Apple box you leave on. Not an experiment. A workstation.",
    amazonSearchTerm: "Apple Mac Studio M4 Max 36GB 512GB",
    imageSrc: "/store/hardware/mac-studio-m4.jpg",
  },
  {
    id: "minisforum-ms-a2",
    missions: ["business"],
    category: "mini-pc",
    name: "Minisforum MS-A2",
    configLabel: "Ryzen AI Max+ 395 · 96GB / 1TB",
    brand: "Minisforum",
    priceUsd: 2399,
    stripeEnvKey: "STRIPE_PRICE_MINISFORUM_MS_A2",
    stripePriceId: HARDWARE_STRIPE["minisforum-ms-a2"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["minisforum-ms-a2"].paymentLink,
    specs: ["AMD Ryzen AI Max+ 395", "96GB unified memory", "1TB NVMe", "Windows or Linux"],
    goodFor: "Fleet value pick — 96GB is how a shop runs 30B–40B class models locally with memory to spare.",
    blurb: "Best price-to-brain ratio we will put on a business desk.",
    amazonSearchTerm: "Minisforum MS-A2 Ryzen AI Max+ 395 96GB",
    imageSrc: "/store/hardware/minisforum-ms-a2.jpg",
    badge: "Shop pick",
  },
  {
    id: "beelink-gtr9-pro",
    missions: ["business"],
    category: "mini-pc",
    name: "Beelink GTR9 Pro",
    configLabel: "Ryzen AI Max+ 395 · 128GB",
    brand: "Beelink",
    priceUsd: 2899,
    stripeEnvKey: "STRIPE_PRICE_BEELINK_GTR9_PRO",
    stripePriceId: HARDWARE_STRIPE["beelink-gtr9-pro"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["beelink-gtr9-pro"].paymentLink,
    specs: ["AMD Ryzen AI Max+ 395", "128GB unified memory", "Dual 10GbE networking", "Server-class memory"],
    goodFor: "Top of the compact lineup — 70B-class models at a sane quant, plus fast networking so the office can talk to the box.",
    blurb: "When the computer is the company brain and several people need it at once.",
    amazonSearchTerm: "Beelink GTR9 Pro Ryzen AI Max+ 395 128GB",
    imageSrc: "/store/hardware/beelink-gtr9-pro.jpg",
    badge: "Most memory",
  },
  {
    id: "mac-mini-m4-pro-64",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Mini Office Server",
    configLabel: "M4 Pro · 64GB",
    brand: "Apple",
    priceUsd: 1999,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_PRO_64",
    specs: ["Apple M4 Pro", "64GB unified memory", "Always-on · ~30W", "Silent closet server"],
    goodFor: "The classic small-business AI server: leave it on, sip power, serve the shop. 64GB is the line where 70B-class models start to fit.",
    blurb: "A server, in this hangar, means a computer that does not go home in a bag. Talk to ops to lock the exact config.",
    amazonSearchTerm: "Apple Mac Mini M4 Pro 64GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
    badge: "Always-on",
    contactToOrder: true,
  },
  {
    id: "mac-studio-m4-max-64",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Studio Team Server",
    configLabel: "M4 Max · 64GB+",
    brand: "Apple",
    priceUsd: 3499,
    stripeEnvKey: "STRIPE_PRICE_MAC_STUDIO_M4_MAX_64",
    specs: ["Apple M4 Max", "64GB+ unified memory", "Studio cooling for 24/7", "Multi-person office brain"],
    goodFor: "When local AI is the daily driver for a team — bigger models, more context, no laptop thermal ceiling.",
    blurb: "Configured to order. Tell us how many people will talk to it. We spec the memory. Then we buy and ship.",
    amazonSearchTerm: "Apple Mac Studio M4 Max 64GB",
    imageSrc: "/store/hardware/mac-studio-m4.jpg",
    badge: "Team server",
    contactToOrder: true,
  },
] as const;

export function hardwareProductById(id: string): HardwareProduct | undefined {
  return HARDWARE_PRODUCTS.find((product) => product.id === id);
}

export function hardwareProductsByCategory(category: HardwareCategory): HardwareProduct[] {
  return HARDWARE_PRODUCTS.filter((product) => product.category === category);
}

export function hardwareProductsByMission(mission: HardwareMission): HardwareProduct[] {
  return HARDWARE_PRODUCTS.filter((product) => product.missions.includes(mission));
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatUsdParts(amount: number): { dollars: string; cents: string } {
  const [dollars, cents] = amount.toFixed(2).split(".");
  return { dollars: Number(dollars).toLocaleString("en-US"), cents };
}
