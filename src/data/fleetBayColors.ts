/** Curated accent colors per fleet slot (0–29). Immutable palette — one color per bay forever. */
export type FleetBayColor = {
  accent: string;
  accentBright: string;
  accentRgb: string;
};

export const FLEET_BAY_COLORS: readonly FleetBayColor[] = [
  { accent: "hsl(187 72% 46%)", accentBright: "hsl(187 85% 62%)", accentRgb: "34, 211, 238" },
  { accent: "hsl(199 89% 48%)", accentBright: "hsl(199 92% 64%)", accentRgb: "56, 189, 248" },
  { accent: "hsl(258 90% 66%)", accentBright: "hsl(258 95% 78%)", accentRgb: "167, 139, 250" },
  { accent: "hsl(160 84% 39%)", accentBright: "hsl(160 72% 55%)", accentRgb: "52, 211, 153" },
  { accent: "hsl(351 95% 71%)", accentBright: "hsl(351 100% 82%)", accentRgb: "251, 113, 133" },
  { accent: "hsl(239 84% 67%)", accentBright: "hsl(239 90% 78%)", accentRgb: "129, 140, 248" },
  { accent: "hsl(292 91% 73%)", accentBright: "hsl(292 95% 82%)", accentRgb: "232, 121, 249" },
  { accent: "hsl(172 66% 50%)", accentBright: "hsl(172 72% 62%)", accentRgb: "45, 212, 191" },
  { accent: "hsl(213 94% 68%)", accentBright: "hsl(213 96% 78%)", accentRgb: "96, 165, 250" },
  { accent: "hsl(27 96% 61%)", accentBright: "hsl(27 100% 72%)", accentRgb: "251, 146, 60" },
  { accent: "hsl(270 95% 75%)", accentBright: "hsl(270 100% 84%)", accentRgb: "192, 132, 252" },
  { accent: "hsl(0 91% 71%)", accentBright: "hsl(0 95% 80%)", accentRgb: "248, 113, 113" },
  { accent: "hsl(43 96% 56%)", accentBright: "hsl(43 100% 68%)", accentRgb: "251, 191, 36" },
  { accent: "hsl(330 81% 60%)", accentBright: "hsl(330 90% 72%)", accentRgb: "244, 114, 182" },
  { accent: "hsl(215 20% 65%)", accentBright: "hsl(215 25% 78%)", accentRgb: "148, 163, 184" },
  { accent: "hsl(48 96% 53%)", accentBright: "hsl(48 100% 65%)", accentRgb: "250, 204, 21" },
  { accent: "hsl(186 94% 69%)", accentBright: "hsl(186 96% 78%)", accentRgb: "103, 232, 249" },
  { accent: "hsl(84 81% 44%)", accentBright: "hsl(84 78% 58%)", accentRgb: "163, 230, 53" },
  { accent: "hsl(229 96% 78%)", accentBright: "hsl(229 100% 86%)", accentRgb: "165, 180, 252" },
  { accent: "hsl(142 71% 45%)", accentBright: "hsl(142 76% 58%)", accentRgb: "74, 222, 128" },
  { accent: "hsl(213 93% 78%)", accentBright: "hsl(213 96% 86%)", accentRgb: "147, 197, 253" },
  { accent: "hsl(21 90% 48%)", accentBright: "hsl(21 95% 58%)", accentRgb: "234, 88, 12" },
  { accent: "hsl(221 83% 53%)", accentBright: "hsl(221 90% 65%)", accentRgb: "37, 99, 235" },
  { accent: "hsl(217 91% 60%)", accentBright: "hsl(217 96% 72%)", accentRgb: "59, 130, 246" },
  { accent: "hsl(271 91% 65%)", accentBright: "hsl(271 95% 76%)", accentRgb: "168, 85, 247" },
  { accent: "hsl(214 32% 78%)", accentBright: "hsl(214 35% 88%)", accentRgb: "203, 213, 225" },
  { accent: "hsl(32 95% 44%)", accentBright: "hsl(32 100% 55%)", accentRgb: "217, 119, 6" },
  { accent: "hsl(188 94% 37%)", accentBright: "hsl(188 85% 50%)", accentRgb: "8, 145, 178" },
  { accent: "hsl(0 84% 60%)", accentBright: "hsl(0 90% 70%)", accentRgb: "239, 68, 68" },
  { accent: "hsl(43 96% 64%)", accentBright: "hsl(43 100% 74%)", accentRgb: "252, 211, 77" },
] as const;

export function getFleetBayColor(slot: number): FleetBayColor {
  return FLEET_BAY_COLORS[slot] ?? FLEET_BAY_COLORS[0];
}
