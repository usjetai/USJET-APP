import type { FleetAircraftType } from "../types/fleet";
import { getFleetAircraftLogoPath } from "./fleetAircraftLogos";

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
};

/**
 * Optional product-logo overrides keyed by aircraft slug (`/product/:aircraftSlug`).
 * Defaults to the roster aircraft emblem in `/assets/fleet-logos/`.
 */
const PRODUCT_LOGO_BY_AIRCRAFT_SLUG: Record<string, string> = {
  "sr-71-blackbird": "/fleet/sr71-blackbird-logo.png",
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

const ADDITIONAL_PRODUCTS_BY_AIRCRAFT_SLUG: Record<string, FleetProductLineupItem[]> = {
  "sr-71-blackbird": [
    {
      id: "sr-71-tee",
      title: "USJET.AI SR-71 Tee",
      kind: "Apparel",
      description:
        "White short-sleeve crew neck with SR-71 Blackbird silhouette and USJET.AI chest branding. Sovereign fleet merch for the hangar and the runway.",
      photo: {
        src: "/fleet/sr-71-blackbird-tee-product.webp",
        alt: "White USJET.AI t-shirt with SR-71 Blackbird silhouette on chest.",
        isDedicatedProductPhoto: true,
      },
    },
  ],
};

export function resolveFleetProductLineup(aircraftSlug: string): FleetProductLineupItem[] {
  return ADDITIONAL_PRODUCTS_BY_AIRCRAFT_SLUG[aircraftSlug] ?? [];
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
