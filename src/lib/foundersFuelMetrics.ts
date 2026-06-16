import {
  FOUNDERS_FUEL_BASE_SUPPORTERS,
  FOUNDERS_FUEL_GOAL,
  FOUNDERS_FUEL_STORAGE_KEY,
} from "../data/foundersFuel";

export type FuelMetrics = {
  supporters: number;
  goal: number;
  percent: number;
  remaining: number;
};

function readStoredBoost(): number {
  try {
    const raw = localStorage.getItem(FOUNDERS_FUEL_STORAGE_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function getFuelMetrics(): FuelMetrics {
  const supporters = Math.min(FOUNDERS_FUEL_GOAL, FOUNDERS_FUEL_BASE_SUPPORTERS + readStoredBoost());
  const percent = Math.min(100, Math.round((supporters / FOUNDERS_FUEL_GOAL) * 100));
  return {
    supporters,
    goal: FOUNDERS_FUEL_GOAL,
    percent,
    remaining: Math.max(0, FOUNDERS_FUEL_GOAL - supporters),
  };
}

/** Call when a visitor taps Stripe checkout — bumps progress + activity feed. */
export function recordFuelCheckoutIntent(): FuelMetrics {
  try {
    const next = readStoredBoost() + 1;
    localStorage.setItem(FOUNDERS_FUEL_STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent("usjet-fuel-metrics-updated"));
  } catch {
    /* private mode */
  }
  return getFuelMetrics();
}

export function subscribeFuelMetrics(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener("usjet-fuel-metrics-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("usjet-fuel-metrics-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
