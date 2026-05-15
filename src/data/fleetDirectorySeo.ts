import { fleetManifest } from "./fleetManifest";

export type FleetDirectoryEntry = {
  slot: number;
  unitId: string;
  name: string;
  callsign: string;
  domain: string;
  href: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
};

const CATEGORY_BY_SLOT: Record<number, string> = {
  0: "AI for research & multimodal reasoning",
  1: "AI for operators & field teams",
  2: "AI for long-form analysis & compliance",
  3: "AI for logistics & cited web research",
  4: "AI for real-time intelligence",
  5: "AI for software & fleet maintenance (code)",
  6: "AI for creative production",
  7: "AI for video & media ops",
  8: "AI for cinematic video",
  9: "AI for motion graphics",
  10: "AI for game & asset pipelines",
  11: "AI for professional video editing",
  12: "AI for brand & design systems",
  13: "AI for small business marketing",
  14: "AI for photoreal imaging",
  15: "AI for audio & soundtrack",
  16: "AI for voice & dubbing",
  17: "AI for text-to-speech",
  18: "AI for training & presenter video",
  19: "AI for avatar video",
  20: "AI for rapid UI development",
  21: "AI for cloud development",
  22: "AI for enterprise code review",
  23: "AI for evidence & R&D",
  24: "AI for decks & investor updates",
  25: "AI for operations documentation",
  26: "AI for marketing copy",
  27: "AI for meeting notes & field voice",
  28: "AI for reasoning & chat",
  29: "AI command node — sovereign fleet orchestration",
};

function buildDescription(name: string, category: string, callsign: string, domain: string): string {
  return `${name} (${callsign}) — ${category}. Launch from the USJET sovereign cockpit at usjet.ai with integrated navigation to ${domain}. Built for blue-collar operators, maintainers, and founders who need one hangar for thirty elite AI workstations—not thirty forgotten bookmarks.`;
}

export const FLEET_DIRECTORY_ENTRIES: FleetDirectoryEntry[] = [...fleetManifest]
  .sort((a, b) => a.slot - b.slot)
  .map((unit) => {
    const category = CATEGORY_BY_SLOT[unit.slot] ?? "AI for professional work";
    return {
      slot: unit.slot,
      unitId: unit.id,
      name: unit.name,
      callsign: unit.callsign,
      domain: unit.domain,
      href: unit.href,
      category,
      seoTitle: `${unit.name} — ${category} | USJET Fleet Directory`,
      seoDescription: buildDescription(unit.name, category, unit.callsign, unit.domain),
      keywords: [
        category,
        unit.name,
        unit.callsign,
        "USJET fleet",
        "sovereign AI hangar",
        unit.domain,
      ],
    };
  });
