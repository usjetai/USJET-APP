/** Hired developers whose name renders with the sovereign red-blink treatment. */
const DEVELOPER_RED_BLINK_NAMES = new Set([
  "blue ivy",
  "mary stealth",
  "chop",
  "stick",
  "little mama",
  "rumi",
  "kitkat",
  "glass",
  "lear",
  "light speed",
  "lightspeed",
]);

/** Display variants for inline text highlighting — longest first to avoid partial matches. */
export const DEVELOPER_RED_BLINK_TEXT_ALIASES = [
  "Light Speed",
  "LightSpeed",
  "Little Mama",
  "little Mama",
  "Blue Ivy",
  "Mary Stealth",
  "Kitkat",
  "KitKat",
  "Stick",
  "Chop",
  "Rumi",
  "Glass",
  "Lear",
] as const;

function normalizeDeveloperName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

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
