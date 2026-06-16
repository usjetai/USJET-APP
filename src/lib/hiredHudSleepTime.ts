const STORAGE_KEY = "usjet-hired-hud-sleep-time";

type SleepTimeStore = {
  date: string;
  minutes: Record<number, number>;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function randomSleepMinutes(): number {
  const hours = 5.2 + Math.random() * 3.4;
  return Math.round(hours * 60);
}

export function formatSleepTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export function loadHiredHudSleepTime(slots: number[]): Record<number, number> {
  const date = todayKey();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SleepTimeStore;
      if (parsed.date === date && parsed.minutes) {
        const minutes = { ...parsed.minutes };
        for (const slot of slots) {
          if (minutes[slot] == null) minutes[slot] = randomSleepMinutes();
        }
        return minutes;
      }
    }
  } catch {
    // Ignore corrupt storage and re-seed below.
  }

  const seeded = Object.fromEntries(slots.map((slot) => [slot, randomSleepMinutes()]));
  saveHiredHudSleepTime(seeded);
  return seeded;
}

export function saveHiredHudSleepTime(minutes: Record<number, number>): void {
  const payload: SleepTimeStore = {
    date: todayKey(),
    minutes,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

export function averageSleepMinutes(values: Record<number, number>, slots: number[]): number {
  if (slots.length === 0) return 0;
  const total = slots.reduce((sum, slot) => sum + (values[slot] ?? 0), 0);
  return Math.round(total / slots.length);
}
