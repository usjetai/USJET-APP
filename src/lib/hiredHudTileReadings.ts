export type HiredHudTileReading = {
  bpm: number;
  spo2: number;
  pressure: number;
  steps: number;
  sleepMinutes: number;
};

export function randomHiredHudTileReading(): HiredHudTileReading {
  return {
    bpm: Math.floor(58 + Math.random() * 42),
    spo2: Math.round((92 + Math.random() * 7) * 10) / 10,
    pressure: Math.floor(48 + Math.random() * 48),
    steps: Math.floor(1800 + Math.random() * 11_000),
    sleepMinutes: Math.floor((4.8 + Math.random() * 4.2) * 60),
  };
}

export function createHiredHudTileReadings(slots: number[]): Record<number, HiredHudTileReading> {
  return Object.fromEntries(slots.map((slot) => [slot, randomHiredHudTileReading()]));
}
