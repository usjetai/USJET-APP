export type DeveloperFuelReading = {
  dollars: number;
  percent: number;
};

/** Low cash fuel reserve for a hired developer bay (money meter, not tank volume). */
export function randomLowFuelReading(slot: number): DeveloperFuelReading {
  const jitter = ((slot * 37) % 11) * 0.17;
  const dollars = Math.round((6.4 + Math.random() * 28.6 + jitter) * 100) / 100;
  const percent = fuelPercentFromDollars(dollars);
  return { dollars, percent };
}

export function fuelPercentFromDollars(dollars: number): number {
  const maxReserve = 42;
  return Math.max(4, Math.min(24, Math.round((dollars / maxReserve) * 100)));
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
  const drain = Math.random() < 0.35 ? Math.round(Math.random() * 90) / 100 : 0;
  const bump = drain === 0 && Math.random() < 0.12 ? Math.round(Math.random() * 45) / 100 : 0;
  const dollars = Math.max(3.2, Math.min(39.5, Math.round((current.dollars - drain + bump) * 100) / 100));
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
