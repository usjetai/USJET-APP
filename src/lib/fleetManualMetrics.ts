import { FLEET_MANUAL_LICENSE_CAP } from "../data/fleetManual2500";

const STORAGE_KEY = "usjet-fleet-manual-licenses";
const UPDATED_EVENT = "usjet-fleet-manual-metrics-updated";

export type FleetManualMetrics = {
  licensesClaimed: number;
  licensesRemaining: number;
  cap: number;
};

function readCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return Math.min(FLEET_MANUAL_LICENSE_CAP, parsed);
}

function writeCount(count: number) {
  if (typeof window === "undefined") {
    return;
  }
  const clamped = Math.min(FLEET_MANUAL_LICENSE_CAP, Math.max(0, count));
  window.localStorage.setItem(STORAGE_KEY, String(clamped));
  window.dispatchEvent(new CustomEvent(UPDATED_EVENT));
}

export function getFleetManualMetrics(): FleetManualMetrics {
  const licensesClaimed = readCount();
  return {
    licensesClaimed,
    licensesRemaining: Math.max(0, FLEET_MANUAL_LICENSE_CAP - licensesClaimed),
    cap: FLEET_MANUAL_LICENSE_CAP,
  };
}

/** Bump license counter when operator taps checkout — illustrates scarcity momentum. */
export function recordFleetManualCheckoutIntent(): FleetManualMetrics {
  const next = Math.min(FLEET_MANUAL_LICENSE_CAP, readCount() + 1);
  writeCount(next);
  return getFleetManualMetrics();
}

export function subscribeFleetManualMetrics(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const handler = () => listener();
  window.addEventListener(UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
