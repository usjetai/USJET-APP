import type { FleetAircraftType } from "../types/fleet";
import { getFleetAircraftLogoPath } from "./fleetAircraftLogos";

export type FleetProductMediaAsset = {
  src: string;
  alt: string;
  /** True when a dedicated product photo exists in `public/fleet/` (not an aircraft emblem fallback). */
  isDedicatedProductPhoto?: boolean;
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
    alt: "SR-71 Blackbird alloy pull-back model — white and black variants on a blue sky backdrop.",
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
