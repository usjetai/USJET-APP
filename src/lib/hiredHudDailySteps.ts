const STORAGE_KEY = "usjet-hired-hud-daily-steps";

type DailyStepsStore = {
  date: string;
  steps: Record<number, number>;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function hourScaledSteps(): number {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const dayProgress = (hour * 60 + minute) / (24 * 60);
  const base = 900 + dayProgress * 7800;
  return Math.floor(base + Math.random() * 1400);
}

export function formatDailySteps(value: number): string {
  return value.toLocaleString("en-US");
}

export function loadHiredHudDailySteps(slots: number[]): Record<number, number> {
  const date = todayKey();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyStepsStore;
      if (parsed.date === date && parsed.steps) {
        const steps = { ...parsed.steps };
        for (const slot of slots) {
          if (steps[slot] == null) steps[slot] = hourScaledSteps();
        }
        return steps;
      }
    }
  } catch {
    // Ignore corrupt storage and re-seed below.
  }

  return Object.fromEntries(slots.map((slot) => [slot, hourScaledSteps()]));
}

export function saveHiredHudDailySteps(steps: Record<number, number>): void {
  const payload: DailyStepsStore = {
    date: todayKey(),
    steps,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

export function driftDailySteps(current: number): number {
  const burst = Math.random() < 0.22 ? Math.floor(8 + Math.random() * 28) : Math.floor(Math.random() * 6);
  return Math.min(14_500, current + burst);
}
