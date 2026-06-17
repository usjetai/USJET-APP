import { fleetManifest } from "../data/fleetManifest";
import { isFleetBayCleared } from "../data/fleetRoster";

/** Manual display variants for inline highlighting where copy may differ from manifest names. */
const DEVELOPER_RED_BLINK_ALIAS_MAP: Record<string, readonly string[]> = {
  kitkat: ["KitKat"],
  "light speed": ["LightSpeed"],
};

/** Display variants for inline text highlighting — longest first to avoid partial matches. */
const HIRED_DEVELOPER_NAMES = fleetManifest
  .filter((unit) => isFleetBayCleared(unit.slot))
  .map((unit) => unit.name);

function normalizeDeveloperName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildRedBlinkNameSet(): Set<string> {
  const names = new Set<string>();

  for (const name of HIRED_DEVELOPER_NAMES) {
    const normalized = normalizeDeveloperName(name);
    names.add(normalized);
    names.add(normalized.replace(/\s/g, ""));
  }

  for (const [canonical, aliases] of Object.entries(DEVELOPER_RED_BLINK_ALIAS_MAP)) {
    names.add(canonical);
    names.add(canonical.replace(/\s/g, ""));
    for (const alias of aliases) {
      const normalizedAlias = normalizeDeveloperName(alias);
      names.add(normalizedAlias);
      names.add(normalizedAlias.replace(/\s/g, ""));
    }
  }

  return names;
}

function buildRedBlinkTextAliases(): readonly string[] {
  const aliases = new Set<string>();

  for (const name of HIRED_DEVELOPER_NAMES) {
    aliases.add(name);
  }

  for (const [canonical, manualAliases] of Object.entries(DEVELOPER_RED_BLINK_ALIAS_MAP)) {
    aliases.add(canonical);
    for (const alias of manualAliases) aliases.add(alias);
  }

  return [...aliases].sort((a, b) => b.length - a.length);
}

/** Hired roster names and approved variants for red-blink matching. */
const DEVELOPER_RED_BLINK_NAMES = buildRedBlinkNameSet();

/** Display variants for inline text highlighting — longest first to avoid partial matches. */
export const DEVELOPER_RED_BLINK_TEXT_ALIASES = buildRedBlinkTextAliases();

export function isDeveloperRedBlinkName(name: string): boolean {
  const normalized = normalizeDeveloperName(name);
  if (DEVELOPER_RED_BLINK_NAMES.has(normalized)) {
    return true;
  }

  const collapsed = normalized.replace(/\s/g, "");
  return DEVELOPER_RED_BLINK_NAMES.has(collapsed);
}

export function developerRedBlinkClass(name: string): string {
  return isDeveloperRedBlinkName(name) ? "developer-red-blink" : "";
}

export function developerRedBlinkHeartClass(name: string): string {
  return isDeveloperRedBlinkName(name) ? "developer-red-blink-heart" : "";
}

export function buildDeveloperRedBlinkPattern(): RegExp {
  const escaped = [...DEVELOPER_RED_BLINK_TEXT_ALIASES]
    .sort((a, b) => b.length - a.length)
    .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}
