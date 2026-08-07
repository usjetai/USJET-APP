import type { FleetAircraftType } from "../types/fleet";
import { getFleetAircraftLogoPath } from "./fleetAircraftLogos";
import { getHiredDeveloperProductAvatarByAircraftSlug } from "./hiredHudDeveloperAvatars";
import { resolveJ36ProductPaymentLink, resolveSr71BlackbirdTeePaymentLink } from "./stripePaymentLink";

export type FleetProductMediaAsset = {
  src: string;
  alt: string;
  /** True when a dedicated product photo exists in `public/fleet/` (not an aircraft emblem fallback). */
  isDedicatedProductPhoto?: boolean;
};

/** Additional merchandise on an aircraft product page (beyond the primary hero product). */
export type FleetProductLineupItem = {
  id: string;
  title: string;
  kind: string;
  description: string;
  photo: FleetProductMediaAsset;
  price?: string;
  /** When set, lineup Buy button uses this Stripe Payment Link (Direct Landing Protocol). */
  resolveStripePaymentLink?: () => string;
};

/**
 * Optional product-logo overrides keyed by aircraft slug (`/product/:aircraftSlug`).
 * Defaults to the roster aircraft emblem in `/assets/fleet-logos/`.
 */
const PRODUCT_LOGO_BY_AIRCRAFT_SLUG: Record<string, string> = {
  "sr-71-blackbird": "/fleet/sr71-blackbird-logo.png?v=solid2",
};

/**
 * Optional merchandise / product photos keyed by aircraft slug.
 * Units without an entry fall back to the aircraft emblem until a photo is added.
 */
const PRODUCT_PHOTO_BY_AIRCRAFT_SLUG: Record<string, FleetProductMediaAsset> = {
  "sr-71-blackbird": {
    src: "/fleet/sr-71-blackbird-product.webp",
    alt: "Lockheed SR-71 Blackbird plastic model kit on display stand with full-color markings.",
    isDedicatedProductPhoto: true,
  },
  "f-35-lightning-ii": {
    src: "/fleet/f-35-lightning-ii-product.webp",
    alt: "F-35 Lightning II plastic model kit on display stand with full-color Navy markings.",
    isDedicatedProductPhoto: true,
  },
  "b-21-raider": {
    src: "/fleet/b-21-raider-product.webp",
    alt: "B-21 Raider 3D print model on display stand with B-21 Raider nameplate.",
    isDedicatedProductPhoto: true,
  },
  "j-36": {
    src: "/fleet/j-36-product.webp",
    alt: "J-36 sixth-generation concept fighter model in splinter camouflage on a display stand with 36011 markings.",
    isDedicatedProductPhoto: true,
  },
};

export function resolveFleetProductLogo(
  aircraftSlug: string,
  aircraftOfficialName: string,
  aircraftType: FleetAircraftType,
): FleetProductMediaAsset {
  const src = PRODUCT_LOGO_BY_AIRCRAFT_SLUG[aircraftSlug] ?? getFleetAircraftLogoPath(aircraftType);
  return {
    src,
    alt: `${aircraftOfficialName} logo`,
  };
}

export function resolveFleetProductPhoto(
  aircraftSlug: string,
  aircraftOfficialName: string,
  aircraftType: FleetAircraftType,
): FleetProductMediaAsset {
  const dedicated = PRODUCT_PHOTO_BY_AIRCRAFT_SLUG[aircraftSlug];
  if (dedicated) {
    return dedicated;
  }

  return {
    src: getFleetAircraftLogoPath(aircraftType),
    alt: `${aircraftOfficialName} product photo — merchandise runway coming soon`,
    isDedicatedProductPhoto: false,
  };
}

type FleetTeeCatalogEntry = {
  slug: string;
  /** Short aircraft label for tee title (e.g. "F-35 Lightning II"). */
  aircraftLabel: string;
  resolveStripePaymentLink?: () => string;
};

/** USJET.AI lineup tee on every fleet product page — one per aircraft slug. */
const FLEET_TEE_CATALOG: FleetTeeCatalogEntry[] = [
  { slug: "sr-71-blackbird", aircraftLabel: "SR-71", resolveStripePaymentLink: resolveSr71BlackbirdTeePaymentLink },
  { slug: "f-35-lightning-ii", aircraftLabel: "F-35 Lightning II" },
  { slug: "b-21-raider", aircraftLabel: "B-21 Raider" },
  { slug: "j-36", aircraftLabel: "J-36" },
  { slug: "ngad-platform", aircraftLabel: "NGAD Platform" },
  { slug: "yf-23-black-widow-ii", aircraftLabel: "YF-23 Black Widow II" },
  { slug: "x-47b", aircraftLabel: "X-47B" },
  { slug: "x-37b", aircraftLabel: "X-37B" },
  { slug: "x-51-waverider", aircraftLabel: "X-51 Waverider" },
  { slug: "pca", aircraftLabel: "PCA" },
  { slug: "b-2-spirit", aircraftLabel: "B-2 Spirit" },
  { slug: "b-1-lancer", aircraftLabel: "B-1 Lancer" },
  { slug: "a-12-avenger-ii", aircraftLabel: "A-12 Avenger II" },
  { slug: "f-22-raptor", aircraftLabel: "F-22 Raptor" },
  { slug: "fb-22", aircraftLabel: "FB-22C" },
  { slug: "f-15ex-eagle-ii", aircraftLabel: "F-15EX Eagle II" },
  { slug: "f-16v-viper", aircraftLabel: "F-16V Viper" },
  { slug: "f-a-18-block-iii", aircraftLabel: "F/A-18 Super Hornet" },
  { slug: "a-10-warthog", aircraftLabel: "A-10 Warthog" },
  { slug: "f-117-nighthawk", aircraftLabel: "F-117 Nighthawk" },
  { slug: "mq-25-stingray", aircraftLabel: "MQ-25 Stingray" },
  { slug: "mq-28-ghost-bat", aircraftLabel: "MQ-28 Ghost Bat" },
  { slug: "xq-58-valkyrie", aircraftLabel: "XQ-58 Valkyrie" },
  { slug: "rq-180", aircraftLabel: "RQ-180" },
  { slug: "rq-4-global-hawk", aircraftLabel: "RQ-4 Global Hawk" },
  { slug: "f-14-tomcat", aircraftLabel: "F-14 Tomcat" },
  { slug: "f-4-phantom-ii", aircraftLabel: "F-4 Phantom II" },
  { slug: "f-104-starfighter", aircraftLabel: "F-104 Starfighter" },
  { slug: "f-86-sabre", aircraftLabel: "F/A-XX" },
  { slug: "x-59-quesst", aircraftLabel: "X-59 QueSST" },
];

const FLEET_TEE_BY_SLUG = Object.fromEntries(FLEET_TEE_CATALOG.map((entry) => [entry.slug, entry]));

function buildFleetTeeLineupItem(entry: FleetTeeCatalogEntry): FleetProductLineupItem {
  const crew = getHiredDeveloperProductAvatarByAircraftSlug(entry.slug);
  const crewLine = crew
    ? `${crew.label} · ${entry.aircraftLabel}`
    : entry.aircraftLabel;
  const description = crew
    ? `White short-sleeve crew neck featuring ${crew.label}'s profile, jet designation (${entry.aircraftLabel}), AI domain, and aircraft emblem — sovereign hired-crew merch from the USJET hangar.`
    : `White short-sleeve crew neck with ${entry.aircraftLabel} jet designation, AI domain, and aircraft emblem. Sovereign fleet merch for the hangar and the runway.`;

  return {
    id: `${entry.slug}-tee`,
    title: crew ? `USJET.AI ${crewLine} Crew Tee` : `USJET.AI ${entry.aircraftLabel} Tee`,
    kind: "Apparel",
    description,
    photo: {
      src: `/fleet/${entry.slug}-tee-product.webp`,
      alt: crew
        ? `White USJET.AI crew tee with ${crew.label} portrait, ${entry.aircraftLabel} jet name, and AI domain branding.`
        : `White USJET.AI t-shirt with ${entry.aircraftLabel} graphic on chest.`,
      isDedicatedProductPhoto: true,
    },
    price: "$25",
    resolveStripePaymentLink: entry.resolveStripePaymentLink,
  };
}

type FleetCapCatalogEntry = {
  slug: string;
  /** Short aircraft label for cap title (e.g. "F-35 Lightning II"). */
  aircraftLabel: string;
  /** Optional copy override (e.g. SR-71 vintage lede). */
  description?: string;
  resolveStripePaymentLink?: () => string;
};

const SR71_CAP_DESCRIPTION =
  "This trucker cap brings a crisp, vintage-roadside energy to everyday wear. The foam front displays a bold, slightly distressed logo and silhouette in high-contrast tones, while the nylon mesh back keeps you cool on long drives, outdoor meetups, or weekend projects. Lightweight and structured, it shapes up clean and comfortable";

/** USJET.AI lineup trucker cap on every fleet product page — one per aircraft slug. */
const FLEET_CAP_CATALOG: FleetCapCatalogEntry[] = [
  { slug: "sr-71-blackbird", aircraftLabel: "SR-71", description: SR71_CAP_DESCRIPTION },
  { slug: "f-35-lightning-ii", aircraftLabel: "F-35 Lightning II" },
  { slug: "b-21-raider", aircraftLabel: "B-21 Raider" },
  { slug: "j-36", aircraftLabel: "J-36" },
  { slug: "ngad-platform", aircraftLabel: "NGAD Platform" },
  { slug: "yf-23-black-widow-ii", aircraftLabel: "YF-23 Black Widow II" },
  { slug: "x-47b", aircraftLabel: "X-47B" },
  { slug: "x-37b", aircraftLabel: "X-37B" },
  { slug: "x-51-waverider", aircraftLabel: "X-51 Waverider" },
  { slug: "pca", aircraftLabel: "PCA" },
  { slug: "b-2-spirit", aircraftLabel: "B-2 Spirit" },
  { slug: "b-1-lancer", aircraftLabel: "B-1 Lancer" },
  { slug: "a-12-avenger-ii", aircraftLabel: "A-12 Avenger II" },
  { slug: "f-22-raptor", aircraftLabel: "F-22 Raptor" },
  { slug: "fb-22", aircraftLabel: "FB-22C" },
  { slug: "f-15ex-eagle-ii", aircraftLabel: "F-15EX Eagle II" },
  { slug: "f-16v-viper", aircraftLabel: "F-16V Viper" },
  { slug: "f-a-18-block-iii", aircraftLabel: "F/A-18 Super Hornet" },
  { slug: "a-10-warthog", aircraftLabel: "A-10 Warthog" },
  { slug: "f-117-nighthawk", aircraftLabel: "F-117 Nighthawk" },
  { slug: "mq-25-stingray", aircraftLabel: "MQ-25 Stingray" },
  { slug: "mq-28-ghost-bat", aircraftLabel: "MQ-28 Ghost Bat" },
  { slug: "xq-58-valkyrie", aircraftLabel: "XQ-58 Valkyrie" },
  { slug: "rq-180", aircraftLabel: "RQ-180" },
  { slug: "rq-4-global-hawk", aircraftLabel: "RQ-4 Global Hawk" },
  { slug: "f-14-tomcat", aircraftLabel: "F-14 Tomcat" },
  { slug: "f-4-phantom-ii", aircraftLabel: "F-4 Phantom II" },
  { slug: "f-104-starfighter", aircraftLabel: "F-104 Starfighter" },
  { slug: "f-86-sabre", aircraftLabel: "F/A-XX" },
  { slug: "x-59-quesst", aircraftLabel: "X-59 QueSST" },
];

const FLEET_CAP_BY_SLUG = Object.fromEntries(FLEET_CAP_CATALOG.map((entry) => [entry.slug, entry]));

function buildFleetCapLineupItem(entry: FleetCapCatalogEntry): FleetProductLineupItem {
  return {
    id: `${entry.slug}-cap`,
    title: `USJET.AI ${entry.aircraftLabel} Trucker Cap`,
    kind: "Headwear",
    description:
      entry.description ??
      `Structured foam front panel with USJET.AI crown branding, ${entry.aircraftLabel} jet emblem, and aircraft name. Black mesh back — lightweight trucker cap for the hangar and the runway.`,
    photo: {
      src: `/fleet/${entry.slug}-cap-product.webp`,
      alt: `USJET.AI trucker cap with ${entry.aircraftLabel} jet emblem and name on the front panel.`,
      isDedicatedProductPhoto: true,
    },
    price: "$25",
    resolveStripePaymentLink: entry.resolveStripePaymentLink,
  };
}

/** Extra lineup items beyond the standard fleet tee and cap. */
const ADDITIONAL_PRODUCTS_BY_AIRCRAFT_SLUG: Record<string, FleetProductLineupItem[]> = {
  "j-36": [
    {
      id: "j-36-underside",
      title: "J-36 Underside View",
      kind: "Model gallery",
      description:
        "Same J-36 concept fighter model shown from below with weapons-bay detail, 36011 markings, and display stand — companion angle for collectors.",
      photo: {
        src: "/fleet/j-36-product-underside.webp",
        alt: "J-36 concept fighter model underside view with open weapons bays and display stand.",
        isDedicatedProductPhoto: true,
      },
      resolveStripePaymentLink: resolveJ36ProductPaymentLink,
    },
  ],
};

export function resolveFleetProductLineup(aircraftSlug: string): FleetProductLineupItem[] {
  const capEntry = FLEET_CAP_BY_SLUG[aircraftSlug];
  const cap = capEntry ? [buildFleetCapLineupItem(capEntry)] : [];
  const extras = ADDITIONAL_PRODUCTS_BY_AIRCRAFT_SLUG[aircraftSlug] ?? [];
  return [...cap, ...extras];
}

/** Aircraft slugs with live merchandise on the product runway (model kits, apparel, etc.). */
export function hasFleetMerchandise(aircraftSlug: string): boolean {
  return aircraftSlug in PRODUCT_PHOTO_BY_AIRCRAFT_SLUG;
}

export function resolveFleetProductMedia(
  aircraftSlug: string,
  aircraftOfficialName: string,
  aircraftType: FleetAircraftType,
): { logo: FleetProductMediaAsset; productPhoto: FleetProductMediaAsset } {
  return {
    logo: resolveFleetProductLogo(aircraftSlug, aircraftOfficialName, aircraftType),
    productPhoto: resolveFleetProductPhoto(aircraftSlug, aircraftOfficialName, aircraftType),
  };
}
