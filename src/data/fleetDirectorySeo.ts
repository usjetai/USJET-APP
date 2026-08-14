import { fleetManifest } from "./fleetManifest";
import {
  getFleetDisplayAircraftName,
  getFleetDisplayAircraftType,
  getFleetRosterMeta,
  isFleetBayAvailable,
  isFleetBayHired,
  type FleetRosterStatus,
} from "./fleetRoster";
import type { FleetAircraftType } from "../types/fleet";
import { resolveFleetProductMedia, type FleetProductMediaAsset } from "../lib/fleetProductMedia";
import { CATEGORY_BY_SLOT } from "./fleetCategories";

export type FleetDirectoryEntry = {
  slot: number;
  unitId: string;
  /** Partner / AI workstation name from manifest. */
  name: string;
  /** Jet Fighter call name from manifest callsign. */
  callsign: string;
  slug: string;
  /** Slug derived from the aircraft official name (e.g. "sr-71-blackbird"). Used for product page URLs. */
  aircraftSlug: string;
  /** Canonical Jet Fighter profile URL. */
  pagePath: string;
  jetFighterPagePath: string;
  /** Canonical product page URL keyed off the aircraft official name. */
  productPagePath: string;
  domain: string;
  href: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
  rosterStatus: FleetRosterStatus;
  aircraftOfficialName: string;
  aircraftType: FleetAircraftType;
  /** Partner / aircraft logo for the product page hero. */
  productLogo: FleetProductMediaAsset;
  /** Merchandise or product photo for the product page hero. */
  productPhoto: FleetProductMediaAsset;
};

function buildDescription(
  name: string,
  category: string,
  callsign: string,
  domain: string,
  aircraftOfficialName: string,
  rosterStatus: FleetRosterStatus,
): string {
  if (rosterStatus === "available") {
    return `Bay open for recruiting — ${aircraftOfficialName}. ${category}. Join the USJET sovereign fleet runway at usjet.ai when this position clears.`;
  }
  return `${callsign} (${name}) — ${aircraftOfficialName}. ${category}. Launch from the USJET sovereign cockpit at usjet.ai with integrated navigation to ${domain}. Hired developer bay with a US fighter jet vector on the runway.`;
}

export function slugifyFleetCallsign(callsign: string): string {
  return callsign
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slug derived from the aircraft official name (e.g. "SR-71 Blackbird" → "sr-71-blackbird").
 * Parenthetical qualifiers and the command suffix are stripped so the URL stays clean.
 */
export function slugifyAircraftOfficialName(aircraftOfficialName: string): string {
  return aircraftOfficialName
    .replace(/\([^)]*\)/g, " ") // drop parenthetical qualifiers like "(US JET Concept)"
    .replace(/·.*$/, " ") // drop "· Command" style suffix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every manifest call sign gets a Jet Fighter page at `/fleet-directory/:slug`. */
export function getFleetJetFighterPagePath(callsign: string): string {
  return `/fleet-directory/${slugifyFleetCallsign(callsign)}`;
}

/** Every manifest call sign also gets a dedicated product page keyed off the aircraft name at `/product/:aircraftSlug`. */
export function getFleetProductPagePath(callsign: string): string {
  const entry = FLEET_DIRECTORY_ENTRIES.find((e) => e.callsign === callsign);
  if (entry) return `/product/${entry.aircraftSlug}`;
  // Fallback (entry not yet built or unknown callsign): use the callsign slug.
  return `/product/${slugifyFleetCallsign(callsign)}`;
}

export const FLEET_JETFIGHTER_PAGE_COUNT = fleetManifest.length;

export const FLEET_DIRECTORY_ENTRIES: FleetDirectoryEntry[] = [...fleetManifest]
  .sort((a, b) => a.slot - b.slot)
  .map((unit) => {
    const category = CATEGORY_BY_SLOT[unit.slot] ?? "AI for professional work";
    const roster = getFleetRosterMeta(unit.slot);
    const available = isFleetBayAvailable(unit.slot);
    const displayAircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
    const displayAircraftName = getFleetDisplayAircraftName(unit.slot, unit.aircraftType);
    const slug = slugifyFleetCallsign(unit.callsign);
    const aircraftSlug = available
      ? slug
      : slugifyAircraftOfficialName(displayAircraftName) || slug;
    const pagePath = getFleetJetFighterPagePath(unit.callsign);
    const productPagePath = `/product/${aircraftSlug}`;
    const productMedia = resolveFleetProductMedia(aircraftSlug, displayAircraftName, displayAircraftType);
    return {
      slot: unit.slot,
      unitId: unit.id,
      name: unit.name,
      callsign: unit.callsign,
      slug,
      aircraftSlug,
      pagePath,
      jetFighterPagePath: pagePath,
      productPagePath,
      domain: unit.domain,
      href: unit.href,
      category,
      rosterStatus: roster.rosterStatus,
      aircraftOfficialName: displayAircraftName,
      aircraftType: displayAircraftType,
      productLogo: productMedia.logo,
      productPhoto: productMedia.productPhoto,
      seoTitle: available
        ? `${unit.callsign} · Available Position | USJET Jet Fighter`
        : `${unit.callsign} · ${displayAircraftName} | USJET Jet Fighter`,
      seoDescription: buildDescription(
        unit.name,
        category,
        unit.callsign,
        unit.domain,
        displayAircraftName,
        roster.rosterStatus,
      ),
      keywords: available
        ? [unit.callsign, unit.name, category, displayAircraftName, "USJET jet fighter", "available position", "sovereign AI hangar"]
        : [
            unit.callsign,
            unit.name,
            category,
            displayAircraftName,
            "USJET jet fighter",
            "hired developer",
            "sovereign AI hangar",
            unit.domain,
          ],
    };
  });

/** Hired developers — indexed call-sign pages and runway launches. */
export const FLEET_DIRECTORY_HIRED_ENTRIES = FLEET_DIRECTORY_ENTRIES.filter((entry) =>
  isFleetBayHired(entry.slot),
);

/** Open recruiting bays only. */
export const FLEET_DIRECTORY_AVAILABLE_ENTRIES = FLEET_DIRECTORY_ENTRIES.filter((entry) =>
  isFleetBayAvailable(entry.slot),
);

export function getFleetDirectoryEntryBySlug(slug: string): FleetDirectoryEntry | undefined {
  const raw = slug.trim().toLowerCase();
  const normalizedSlug = slugifyFleetCallsign(slug);
  return FLEET_DIRECTORY_ENTRIES.find(
    (entry) =>
      entry.slug === raw ||
      entry.slug === normalizedSlug ||
      entry.aircraftSlug === raw ||
      entry.aircraftSlug === normalizedSlug,
  );
}

export function getFleetDirectoryEntryByCallsign(callsign: string): FleetDirectoryEntry | undefined {
  const normalizedSlug = slugifyFleetCallsign(callsign);
  return FLEET_DIRECTORY_ENTRIES.find((entry) => entry.slug === normalizedSlug);
}
