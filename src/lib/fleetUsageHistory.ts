import { readMemberSession } from "./memberSession";

export const FLEET_USAGE_STORAGE_KEY = "usjet-fleet-usage";

export type FleetUsageEntry = {
  callsign: string;
  name: string;
  count: number;
  todayCount: number;
  todayKey: string;
  lastUsedAt: string;
};

export type FleetUsageStore = Record<string, FleetUsageEntry>;

const USAGE_UPDATED_EVENT = "usjet-fleet-usage-updated";

function usageKey(callsign: string): string {
  return callsign.trim().toUpperCase();
}

function currentDayKey(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function readFleetUsage(): FleetUsageStore {
  try {
    const raw = localStorage.getItem(FLEET_USAGE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as FleetUsageStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeFleetUsage(store: FleetUsageStore): void {
  localStorage.setItem(FLEET_USAGE_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(USAGE_UPDATED_EVENT));
}

/** Log sovereign handoff execution when an active member session is present. */
export function logFleetLaunchHandoff(partnerLabel: string | null, bayId: string | null): void {
  const callsign = bayId ? `BAY-${bayId}` : "HANDOFF";
  const name = partnerLabel?.trim() || (bayId ? `Bay ${bayId}` : "Fleet partner");
  logFleetUsageIfMember(callsign, name);
}

/** Log a fleet bay open when an active member session is present. */
export function logFleetUsageIfMember(callsign: string, name: string): void {
  const session = readMemberSession();
  if (!session?.active) {
    return;
  }

  const key = usageKey(callsign);
  const store = readFleetUsage();
  const existing = store[key];
  const dayKey = currentDayKey();
  const now = new Date().toISOString();
  const sameDay = existing?.todayKey === dayKey;

  store[key] = {
    callsign,
    name,
    count: (existing?.count ?? 0) + 1,
    todayCount: sameDay ? (existing?.todayCount ?? 0) + 1 : 1,
    todayKey: dayKey,
    lastUsedAt: now,
  };

  writeFleetUsage(store);
}

export function getFleetUsageTodayRows(): FleetUsageEntry[] {
  const dayKey = currentDayKey();
  return Object.values(readFleetUsage())
    .filter((entry) => entry.todayKey === dayKey && entry.todayCount > 0)
    .sort((a, b) => b.todayCount - a.todayCount);
}

export function getFleetUsageRanked(): FleetUsageEntry[] {
  return Object.values(readFleetUsage()).sort((a, b) => b.count - a.count);
}

export function formatTodayUsageNarrative(rows: FleetUsageEntry[]): string {
  if (rows.length === 0) {
    return "No fleet launches logged today — open a bay from Hangar or Intel.";
  }

  const parts = rows.map((row) => `${row.name} ${row.todayCount} time${row.todayCount === 1 ? "" : "s"}`);
  if (parts.length === 1) {
    return `Today you used ${parts[0]}.`;
  }
  if (parts.length === 2) {
    return `Today you used ${parts[0]} and ${parts[1]}.`;
  }
  const tail = parts.pop();
  return `Today you used ${parts.join(", ")}, and ${tail}.`;
}

export function formatLastUsed(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function subscribeFleetUsage(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(USAGE_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(USAGE_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
