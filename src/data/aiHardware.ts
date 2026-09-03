import { HARDWARE_STRIPE } from "../lib/stripePaymentLink.js";

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
export const HARDWARE_HOMES_ROUTE = "/store/ai-computers/homes" as const;
export const HARDWARE_BUSINESSES_ROUTE = "/store/ai-computers/businesses" as const;
export const HANGAR_HARDWARE_ROUTE = "/" as const;
export const FLEET_HARDWARE_ROUTE = "/fleet" as const;

export const HARDWARE_MAX_QUANTITY_PER_LINE = 10 as const;

export type HardwareMission = "home" | "business";
export type HardwareAudience = HardwareMission;
export type HardwareCategory = "apple-silicon" | "mini-pc" | "workstation";

export const HARDWARE_AUDIENCE_META: Record<
  HardwareAudience,
  { route: string; label: string; kicker: string; title: string; lede: string }
> = {
  home: {
    route: HARDWARE_HOMES_ROUTE,
    label: "Homes",
    kicker: "AI Computers for Homes",
    title: "AI Computers for Your Home",
    lede:
      "Single-user machines. We buy the box, put a personal Jarvis on it, and ship it. Private. No ChatGPT bill.",
  },
  business: {
    route: HARDWARE_BUSINESSES_ROUTE,
    label: "Businesses",
    kicker: "AI Computers for Businesses",
    title: "AI Computers for Your Business",
    lede:
      "Higher-memory machines for a shop or office. We put a Jarvis on it that stays on so the team talks to YOUR box, not a cloud tab.",
  },
};

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

/**
 * The deck below is the M4 generation. Apple has moved on and those exact
 * configurations are no longer orderable at retail, so nothing here can be
 * sold today and none of these prices apply to the machines we will actually
 * build next.
 *
 * While this is true: no price and no checkout is shown anywhere on the deck,
 * and every buy control routes to /waiting-list instead. Flip it back to false
 * only when a current-generation machine is genuinely in hand with a confirmed
 * price. The tiles stay so the specs and the comparison work survive.
 */
export const HARDWARE_RESERVATIONS_ONLY = true;

export const HARDWARE_RESERVATIONS_NOTICE = {
  title: "Between generations",
  body: "These builds are the last-generation Mac lineup and are no longer available to order. The next Operator's Rigs are built on the Mac mini Apple ships on 22 September 2026. Reserve a place in line and you will get the exact configuration and the exact price, in writing, before anyone asks you for money.",
  cta: "Reserve a rig",
  href: "/waiting-list",
} as const;

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
    {
      title: "Yes, you could build this yourself",
      body: "It is a weekend and three GitHub threads. We already did that weekend — you get the finished machine, not the homework.",
    },
  ],
} as const;

export const HOME_DECK = {
  kicker: "Homes · AI computers",
  title: "Which files would you never paste into AI?",
  lede: "Those are the ones this machine is for. We buy the computer, install the local AI stack, and ship it talking. Drop in your documents and ask — the model runs on your desk, so nothing you feed it is sent to a model provider.",
  primerTitle: "What we do to these computers",
  primer: [
    "We buy the exact unit.",
    "We put a personal Jarvis on it — local AI that lives in the box.",
    "We ship it ready to talk the day it hits your door.",
  ],
} as const;

export const BUSINESS_DECK = {
  kicker: "Business · AI computers",
  title: "A Jarvis for the shop that never goes to sleep",
  lede: "Same gift as Homes — we put an assistant on the computer — built for a team. More memory. More cooling. A box that stays on so the office talks to the machine, not a chatbot tab that leaks the job.",
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
  "We buy the machine, install the local AI stack, and ship it talking. Every unit leaves as a USJET Operator's Rig — a personal assistant on YOUR hardware, not a cloud tab." as const;

export const HARDWARE_CATEGORY_LABELS: Record<HardwareCategory, string> = {
  "apple-silicon": "Apple Silicon",
  "mini-pc": "Local-AI Mini PCs",
  workstation: "AI Workstations",
};

export const HARDWARE_PRODUCTS: readonly HardwareProduct[] = [
  {
    id: "mac-mini-m4-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 999,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_16_256",
    specs: ["Apple M4 chip", "16GB unified memory", "256GB SSD", "Silent home box"],
    goodFor: "First home AI computer — small models (think 7B–8B), homework, recipes, family questions. Quiet enough for a living room.",
    blurb: "The cheapest real door onto Apple Silicon. Sit it next to the router. Leave it on.",
    amazonSearchTerm: "Apple Mac Mini M4 16GB 256GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "mac-mini-m4-16-512",
    missions: ["home"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 16GB / 512GB",
    brand: "Apple",
    priceUsd: 1149,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_16_512",
    stripePriceId: HARDWARE_STRIPE["mac-mini-m4-16-512"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-mini-m4-16-512"].paymentLink,
    specs: ["Apple M4 chip", "16GB unified memory", "512GB SSD", "Room for more models on disk"],
    goodFor: "Same home brain as the base Mini, with double the storage so you can keep more than one local model downloaded.",
    blurb: "Buy this when you know you will collect models like tools in a drawer.",
    amazonSearchTerm: "Apple Mac Mini M4 16GB 512GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
    badge: "Starter pick",
  },
  {
    id: "mac-mini-m4-24-512",
    missions: ["home"],
    category: "apple-silicon",
    name: "Mac Mini",
    configLabel: "M4 · 24GB / 512GB",
    brand: "Apple",
    priceUsd: 1399,
    stripeEnvKey: "STRIPE_PRICE_MAC_MINI_M4_24_512",
    stripePriceId: HARDWARE_STRIPE["mac-mini-m4-24-512"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["mac-mini-m4-24-512"].paymentLink,
    specs: ["Apple M4 chip", "24GB unified memory", "512GB SSD", "Home sweet spot · small office"],
    goodFor: "The default Hangar pick. 24GB runs mid-size models with room for the operating system. Also a one-person office brain.",
    blurb: "If you only want one number to remember: 24GB is where home AI stops feeling like a toy.",
    amazonSearchTerm: "Apple Mac Mini M4 24GB 512GB",
    imageSrc: "/store/hardware/mac-mini-m4.jpg",
    badge: "Daily pick",
  },
  {
    id: "macbook-air-m4-13-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "MacBook Air 13\"",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 1149,
    stripeEnvKey: "STRIPE_PRICE_MACBOOK_AIR_M4_13_16_256",
    specs: ["Apple M4 chip", "16GB unified memory", "13.6\" display", "Fanless · up to 18 hrs"],
    goodFor: "AI you can take to the kitchen table or a job walkthrough. Small models on the go. Silent.",
    blurb: "For the operator who will not leave the brain on a desk.",
    amazonSearchTerm: "Apple MacBook Air M4 13-inch 16GB 256GB",
    imageSrc: "/store/hardware/macbook-air-m4-13.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "macbook-air-m4-15-16-256",
    missions: ["home"],
    category: "apple-silicon",
    name: "MacBook Air 15\"",
    configLabel: "M4 · 16GB / 256GB",
    brand: "Apple",
    priceUsd: 1349,
    stripeEnvKey: "STRIPE_PRICE_MACBOOK_AIR_M4_15_16_256",
    specs: ["Apple M4 chip", "16GB unified memory", "15.3\" display", "Fanless · up to 18 hrs"],
    goodFor: "Same portable local AI as the 13\" — bigger screen so the chat and your work sit side by side.",
    blurb: "More glass. Same quiet. Still a home machine you can close and walk away with.",
    amazonSearchTerm: "Apple MacBook Air M4 15-inch 16GB 256GB",
    imageSrc: "/store/hardware/macbook-air-m4-15.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "macbook-pro-14-m4-16-512",
    missions: ["home"],
    category: "apple-silicon",
    name: "MacBook Pro 14\"",
    configLabel: "M4 · 16GB / 512GB",
    brand: "Apple",
    priceUsd: 3399,
    stripeEnvKey: "STRIPE_PRICE_MACBOOK_PRO_14_M4_16_512",
    specs: ["Apple M4 chip", "16GB unified memory", "512GB SSD", "Active cooling"],
    goodFor: "Sustained local inference in a laptop — cooling holds longer than the fanless Air.",
    blurb: "For the home operator who runs the Jarvis for hours, not just a quick question.",
    amazonSearchTerm: "Apple MacBook Pro 14-inch M4 16GB 512GB",
    imageSrc: "/store/hardware/macbook-air-m4-13.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "beelink-ser9-pro",
    missions: ["home"],
    category: "mini-pc",
    name: "Beelink SER9 Pro",
    configLabel: "Ryzen 7 H255 · 32GB / 1TB",
    brand: "Beelink",
    priceUsd: 2099,
    stripeEnvKey: "STRIPE_PRICE_BEELINK_SER9_PRO",
    specs: ["AMD Ryzen 7 H255", "32GB LPDDR5X", "1TB NVMe", "Compact mini-PC"],
    goodFor: "Budget home door onto local AI — 7B–8B models via Ollama.",
    blurb: "A starter Jarvis box for the house. Not a lab. Not Apple money.",
    amazonSearchTerm: "Beelink SER9 Pro Ryzen 7 H255 32GB",
    imageSrc: "/store/hardware/beelink-gtr9-pro.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "minisforum-um890-pro",
    missions: ["home"],
    category: "mini-pc",
    name: "Minisforum UM890 Pro",
    configLabel: "Ryzen 9 8945HS · 32GB / 1TB",
    brand: "Minisforum",
    priceUsd: 2299,
    stripeEnvKey: "STRIPE_PRICE_MINISFORUM_UM890_PRO",
    specs: ["AMD Ryzen 9 8945HS", "32GB DDR5", "1TB PCIe 4.0", "Windows or Linux"],
    goodFor: "A step up from entry mini PCs — 7B–8B models plus room to use the machine as a daily driver.",
    blurb: "Home daily driver with more CPU muscle than the SER9 Pro.",
    amazonSearchTerm: "Minisforum UM890 Pro Ryzen 9 8945HS 32GB",
    imageSrc: "/store/hardware/minisforum-ms-a2.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "gmktec-evo-x2",
    missions: ["business"],
    category: "mini-pc",
    name: "GMKtec EVO-X2",
    configLabel: "Ryzen AI Max+ 395 · 64GB",
    brand: "GMKtec",
    priceUsd: 2199,
    stripeEnvKey: "STRIPE_PRICE_GMKTEC_EVO_X2",
    stripePriceId: HARDWARE_STRIPE["gmktec-evo-x2"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["gmktec-evo-x2"].paymentLink,
    specs: ["AMD Ryzen AI Max+ 395", "64GB unified memory", "Compact mini-PC", "Windows or Linux"],
    goodFor: "A lot of memory in a small box — serious local models without Apple money. Home lab or small shop.",
    blurb: "When you want 64GB of brain-room without buying a Studio.",
    amazonSearchTerm: "GMKtec EVO-X2 Ryzen AI Max+ 395 64GB",
    imageSrc: "/store/hardware/gmktec-evo-x2.jpg",
    badge: "Serious pick",
  },
  {
    id: "minisforum-ai-x1-pro-470",
    missions: ["business"],
    category: "mini-pc",
    name: "Minisforum AI X1 Pro",
    configLabel: "Ryzen AI 9 HX 470 · 32GB",
    brand: "Minisforum",
    priceUsd: 2999,
    stripeEnvKey: "STRIPE_PRICE_MINISFORUM_AI_X1_PRO_470",
    specs: ["AMD Ryzen AI 9 HX 470", "32GB unified memory", "1TB NVMe", "Dedicated NPU"],
    goodFor: "13B–20B models with a dedicated NPU — a compact second box for a small office.",
    blurb: "Affordable team unit without stepping up to the 96GB-class machines.",
    amazonSearchTerm: "Minisforum AI X1 Pro-470 Ryzen AI 9 HX 470",
    imageSrc: "/store/hardware/minisforum-ms-a2.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "mac-studio-m4-max",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Studio",
    configLabel: "M4 Max · 36GB / 512GB",
    brand: "Apple",
    priceUsd: 2249,
    stripeEnvKey: "STRIPE_PRICE_MAC_STUDIO_M4_MAX",
    specs: ["Apple M4 Max", "36GB unified memory", "Studio cooling", "All-day inference"],
    goodFor: "Daily-driver office brain. Bigger models, sustained loads, quiet enough to live under a desk.",
    blurb: "This is the Apple box you leave on. Not an experiment. A workstation.",
    amazonSearchTerm: "Apple Mac Studio M4 Max 36GB 512GB",
    imageSrc: "/store/hardware/mac-studio-m4.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "mac-studio-m3-ultra",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Studio",
    configLabel: "M3 Ultra · 96GB / 1TB",
    brand: "Apple",
    priceUsd: 6999,
    stripeEnvKey: "STRIPE_PRICE_MAC_STUDIO_M3_ULTRA",
    specs: ["Apple M3 Ultra", "96GB unified memory", "1TB SSD", "Studio cooling"],
    goodFor: "70B-class models on Apple Silicon — flagship Apple box for a business that stays in that ecosystem.",
    blurb: "When the M4 Max is not enough memory and you still want a quiet Apple workstation.",
    amazonSearchTerm: "Apple Mac Studio M3 Ultra 96GB 1TB",
    imageSrc: "/store/hardware/mac-studio-m4.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "rtx5090-ai-workstation",
    missions: ["business"],
    category: "workstation",
    name: "RTX 5090 AI Workstation",
    configLabel: "RTX 5090 32GB VRAM · 64GB DDR5",
    brand: "Custom Build",
    priceUsd: 7799,
    stripeEnvKey: "STRIPE_PRICE_RTX5090_AI_WORKSTATION",
    specs: ["NVIDIA RTX 5090 32GB", "64GB DDR5", "NVMe SSD", "CUDA / vLLM"],
    goodFor: "Teams standardized on NVIDIA tooling (vLLM, TensorRT) instead of Ollama on AMD.",
    blurb: "Full-tower workstation. Talk to ops — we spec the exact build, then buy and ship.",
    amazonSearchTerm: "RTX 5090 AI workstation prebuilt 64GB",
    imageSrc: "/store/hardware/beelink-gtr9-pro.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "ai-max-395-workstation-server",
    missions: ["business"],
    category: "workstation",
    name: "AI Workstation Server",
    configLabel: "Ryzen AI Max+ 395 · 128GB / 1TB",
    brand: "AI Server",
    priceUsd: 14999,
    stripeEnvKey: "STRIPE_PRICE_AI_MAX_395_WORKSTATION_SERVER",
    specs: ["Ryzen AI Max+ 395", "128GB unified memory", "1TB NVMe", "Dual 10GbE · office server"],
    goodFor: "One machine serving 70B-class models to the whole office over the network.",
    blurb: "Built as a server, not a desktop. Talk to ops to lock the chassis and ship it talking.",
    amazonSearchTerm: "AI Server Workstation Ryzen AI Max+ 395 128GB",
    imageSrc: "/store/hardware/beelink-gtr9-pro.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "minisforum-ms-a2",
    missions: ["business"],
    category: "mini-pc",
    name: "Minisforum MS-A2",
    configLabel: "Ryzen 9 9955HX · 96GB / 1TB",
    brand: "Minisforum",
    priceUsd: 1599,
    stripeEnvKey: "STRIPE_PRICE_MINISFORUM_MS_A2",
    specs: ["AMD Ryzen 9 9955HX", "96GB DDR5", "1TB NVMe", "Dual 10GbE networking"],
    goodFor: "AM5 workstation box for a shop that wants raw CPU cores and fast networking — a different animal than the AI-SoC minis.",
    blurb: "Real spec: a 16-core desktop workstation chip, not the AI Max+ 395 the old listing implied — still a capable Fleet box.",
    amazonSearchTerm: "Minisforum MS-A2 Ryzen 9 9955HX 96GB",
    imageSrc: "/store/hardware/minisforum-ms-a2.jpg",
    badge: "Talk to order",
    contactToOrder: true,
  },
  {
    id: "beelink-gtr9-pro",
    missions: ["business"],
    category: "mini-pc",
    name: "Beelink GTR9 Pro",
    configLabel: "Ryzen AI Max+ 395 · 128GB",
    brand: "Beelink",
    priceUsd: 3899,
    stripeEnvKey: "STRIPE_PRICE_BEELINK_GTR9_PRO",
    stripePriceId: HARDWARE_STRIPE["beelink-gtr9-pro"].priceId,
    stripePaymentLink: HARDWARE_STRIPE["beelink-gtr9-pro"].paymentLink,
    specs: ["AMD Ryzen AI Max+ 395", "128GB unified memory", "Dual 10GbE networking", "Server-class memory"],
    goodFor: "Top of the compact lineup — 70B-class models at a sane quant, plus fast networking so the office can talk to the box.",
    blurb: "When the computer is the company brain and several people need it at once.",
    amazonSearchTerm: "Beelink GTR9 Pro Ryzen AI Max+ 395 128GB",
    imageSrc: "/store/hardware/beelink-gtr9-pro.jpg",
    badge: "Max pick",
  },
  {
    id: "mac-mini-m4-pro-64",
    missions: ["business"],
    category: "apple-silicon",
    name: "Mac Mini Office Server",
    configLabel: "M4 Pro · 64GB",
    brand: "Apple",
    priceUsd: 2999,
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
    priceUsd: 4499,
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

export function hardwareProductsByAudience(audience: HardwareAudience): HardwareProduct[] {
  return hardwareProductsByMission(audience);
}

export function hardwareCategoriesForAudience(audience: HardwareAudience): HardwareCategory[] {
  const seen = new Set<HardwareCategory>();
  const ordered: HardwareCategory[] = [];
  for (const product of HARDWARE_PRODUCTS) {
    if (product.missions.includes(audience) && !seen.has(product.category)) {
      seen.add(product.category);
      ordered.push(product.category);
    }
  }
  return ordered;
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatUsdParts(amount: number): { dollars: string; cents: string } {
  const [dollars, cents] = amount.toFixed(2).split(".");
  return { dollars: Number(dollars).toLocaleString("en-US"), cents };
}
