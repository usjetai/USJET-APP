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
    layer: "The engine",
    name: "Ollama",
    plain:
      "This is the motor. It runs the AI models on YOUR computer — not in a cloud tab. Other apps plug into it. You do not have to understand it. We leave it running.",
  },
  {
    id: "face",
    layer: "The face",
    name: "Open WebUI",
    plain:
      "This is the screen that feels like ChatGPT — except it lives in a browser on your machine. Looks like a product. Not a terminal window.",
  },
  {
    id: "vault",
    layer: "The vault",
    name: "AnythingLLM",
    plain:
      "Drop your PDFs, notes, invoices, and job folders in. The computer becomes an expert on YOUR stuff. That is called RAG. Translation: it reads your files and answers from them. Nothing leaves the box.",
  },
  {
    id: "manual",
    layer: "The manual",
    name: "AI Book Series",
    plain:
      "Every rig ships with the USJET AI Book Series — the Founder's engineering books, not a generic PDF from Apple. Same series as the Store. That is the manual for the machine.",
  },
] as const;

export const OPERATOR_SETUP_PROMISE = {
  title: "Out of the box — not out of a forum",
  body: "A one-click installer sits on the desktop. It starts the local AI engine, opens the dashboard, and points the vault at your documents folder. You should be talking to your computer the same day it arrives — not three weekends later.",
} as const;

export const WHY_USJET_HARDWARE = {
  kicker: "Why this is not Best Buy",
  title: "Everybody can sell a Mac. We sell the Operator's Rig.",
  points: [
    {
      title: "The result, not the homework",
      body: "Most people want local AI — private, no monthly token bill — and they do not want Docker, model weights, or API proxies. We sell the result: a machine that already knows how to think at home or at work.",
    },
    {
      title: "Memory is the number that matters",
      body: "Chip names sell. Unified memory decides what the AI can hold. 16GB runs small models. 24GB is the home sweet spot. 64GB+ is how a shop or office keeps a serious model (or several) in RAM all day.",
    },
    {
      title: "Hardened means your files stay yours",
      body: "Cloud chat trains on the internet. A USJET rig talks on your desk. We configure it so work docs, family files, and job photos do not get pasted into someone else's server. That privacy is the premium.",
    },
  ],
} as const;

export const HOME_DECK = {
  kicker: "Hangar · Home AI computers",
  title: "AI for the house",
  lede: "These are computers with AI already in them — for the kitchen counter, the office nook, the quiet closet that stays on. Private. No ChatGPT bill. We buy the exact unit, set it up as an Operator's Rig, and ship it to your door.",
  primerTitle: "What you are actually buying",
  primer: [
    "Local AI means the brain lives in the box. Your questions and files do not have to go to the internet.",
    "Start with a Mac Mini if it can sit on a desk. Pick a MacBook Air if you need to carry it. 24GB memory is the home recommendation — enough room for a real model plus the rest of the computer.",
    "You are not learning Linux. You are getting a machine that opens like a product and a book that tells you which button to press.",
  ],
} as const;

export const BUSINESS_DECK = {
  kicker: "Fleet · Business AI computers",
  title: "AI for the shop, the office, the server closet",
  lede: "These are the bigger boxes — always-on brains for a team, a job site office, or a company that cannot leak its files into a chatbot. More memory. More cooling. Servers that stay on so people walk up and ask the machine, not the cloud.",
  primerTitle: "Business in plain language",
  primer: [
    "A server, here, is just a computer that stays on. The team talks to it. It does not go to sleep in a backpack.",
    "Memory is how many people and how big a model you can run at once. 64GB and 96GB and 128GB are how you keep the company brain loaded instead of swapping it out.",
    "Mac Studio is the quiet Apple workhorse. The mini-PCs (Minisforum, Beelink) pack huge unified memory for less money — good when you want the biggest local models without a full rack.",
  ],
} as const;

export const HARDWARE_HERO_KICKER = "Operator's Rig · Local AI computers" as const;
export const HARDWARE_HERO_TITLE = "Computers that already have AI in them" as const;
export const HARDWARE_HERO_LEDE =
  "Hangar is home. Fleet is business. Every unit ships as a USJET Operator's Rig — engine, dashboard, private document vault, and the AI Book Series. We buy the exact machine and send it to you." as const;

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
    imageSrc: "/store/hardware/macbook-air-m4.png",
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
    imageSrc: "/store/hardware/macbook-air-m4.png",
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
    imageSrc: "/store/hardware/mac-studio-m4.png",
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
    imageSrc: "/store/hardware/minisforum-ms-a2.png",
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
    imageSrc: "/store/hardware/beelink-gtr9-pro.png",
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
    imageSrc: "/store/hardware/mac-studio-m4.png",
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
