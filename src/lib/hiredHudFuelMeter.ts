export type DeveloperFuelReading = {
  dollars: number;
  percent: number;
};

const FLEET_FUEL_PER_DEV_MIN = 0.2;
const FLEET_FUEL_PER_DEV_SPAN = 0.34;
const FLEET_FUEL_PER_DEV_MAX = 0.6;
const FLEET_FUEL_PERCENT_CAP = 0.65;

/** Low cash fuel reserve for a hired developer bay (money meter, not tank volume). */
export function randomLowFuelReading(slot: number): DeveloperFuelReading {
  const jitter = ((slot * 37) % 11) * 0.012;
  const dollars =
    Math.round((FLEET_FUEL_PER_DEV_MIN + Math.random() * FLEET_FUEL_PER_DEV_SPAN + jitter) * 100) / 100;
  const percent = fuelPercentFromDollars(dollars);
  return { dollars, percent };
}

export function fuelPercentFromDollars(dollars: number): number {
  return Math.max(4, Math.min(24, Math.round((dollars / FLEET_FUEL_PERCENT_CAP) * 100)));
}

export function formatFuelDollars(dollars: number): string {
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function driftLowFuelReading(current: DeveloperFuelReading): DeveloperFuelReading {
  const drain = Math.random() < 0.35 ? Math.round(Math.random() * 4) / 100 : 0;
  const bump = drain === 0 && Math.random() < 0.12 ? Math.round(Math.random() * 3) / 100 : 0;
  const dollars = Math.max(
    FLEET_FUEL_PER_DEV_MIN,
    Math.min(FLEET_FUEL_PER_DEV_MAX, Math.round((current.dollars - drain + bump) * 100) / 100),
  );
  return { dollars, percent: fuelPercentFromDollars(dollars) };
}

export function averageFuelPercent(readings: Record<number, DeveloperFuelReading>, slots: number[]): number {
  if (slots.length === 0) return 0;
  const total = slots.reduce((sum, slot) => sum + (readings[slot]?.percent ?? 0), 0);
  return Math.round((total / slots.length) * 10) / 10;
}

export function totalFuelDollars(readings: Record<number, DeveloperFuelReading>, slots: number[]): number {
  return Math.round(slots.reduce((sum, slot) => sum + (readings[slot]?.dollars ?? 0), 0) * 100) / 100;
}
