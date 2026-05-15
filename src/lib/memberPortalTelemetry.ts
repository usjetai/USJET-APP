import { fleetManifest } from "../data/fleetManifest";
import { readFleetUsage } from "./fleetUsageHistory";
import { formatPortalUsageDuration, readMemberProjects } from "./memberProjectTracker";
import type { MemberSession } from "../types/member";
import { memberClearanceRank } from "./memberAccessLevel";
import { isSitePreviewPromoActive } from "./sitePreviewPromo";

/** Flight Pass free-window budgets (client-side display model — not provider token meters). */
export const FLIGHT_PASS_FREE_TIER = {
  monthlyLaunchBudget: 48,
  monthlyTimeBudgetMs: 8 * 60 * 60 * 1000,
  windowLabel: "30-day Flight Pass window",
} as const;

export type AiTelemetryRow = {
  unitId: string;
  callsign: string;
  name: string;
  browserLaunches: number;
  browserTimeMs: number;
  freeTierPercentUsed: number;
  freeTierTimeRemainingMs: number;
  freeTierLabel: string;
};

function callsignKey(callsign: string): string {
  return callsign.trim().toUpperCase();
}

function aggregateProjectTimeByCallsign(customerId: string): Map<string, { sessionForks: number; activeTimeMs: number }> {
  const map = new Map<string, { sessionForks: number; activeTimeMs: number }>();

  for (const project of readMemberProjects(customerId)) {
    for (const assignment of project.assignments) {
      const key = callsignKey(assignment.callsign);
      const existing = map.get(key) ?? { sessionForks: 0, activeTimeMs: 0 };
      map.set(key, {
        sessionForks: existing.sessionForks + assignment.sessionForks,
        activeTimeMs: existing.activeTimeMs + assignment.activeTimeMs,
      });
    }
  }

  return map;
}

export function computeFreeTierUsage(
  session: MemberSession | null,
  browserLaunches: number,
  browserTimeMs: number,
): { percentUsed: number; timeRemainingMs: number; label: string } {
  const rank = memberClearanceRank(session);
  if (isSitePreviewPromoActive() && !session?.active) {
    return {
      percentUsed: 0,
      timeRemainingMs: FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs,
      label: "Full site preview — sign in to save your telemetry",
    };
  }
  if (rank >= 2) {
    return {
      percentUsed: 0,
      timeRemainingMs: FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs,
      label: "Pro clearance — no Flight Pass cap",
    };
  }

  if (rank >= 1) {
    const launchRatio = browserLaunches / FLIGHT_PASS_FREE_TIER.monthlyLaunchBudget;
    const timeRatio = browserTimeMs / FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs;
    const percentUsed = Math.min(100, Math.round(Math.max(launchRatio, timeRatio) * 100));
    const timeRemainingMs = Math.max(0, FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs - browserTimeMs);

    if (percentUsed >= 100) {
      return { percentUsed, timeRemainingMs: 0, label: "Free window exhausted — upgrade" };
    }
    if (percentUsed >= 85) {
      return {
        percentUsed,
        timeRemainingMs,
        label: `${formatPortalUsageDuration(timeRemainingMs)} left in free window`,
      };
    }
    return {
      percentUsed,
      timeRemainingMs,
      label: `${formatPortalUsageDuration(timeRemainingMs)} left in free window`,
    };
  }

  const launchRatio = browserLaunches / Math.max(1, Math.floor(FLIGHT_PASS_FREE_TIER.monthlyLaunchBudget / 3));
  const timeRatio = browserTimeMs / Math.max(1, Math.floor(FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs / 4));
  const percentUsed = Math.min(100, Math.round(Math.max(launchRatio, timeRatio) * 100));
  const timeRemainingMs = Math.max(0, Math.floor(FLIGHT_PASS_FREE_TIER.monthlyTimeBudgetMs / 4) - browserTimeMs);

  return {
    percentUsed,
    timeRemainingMs,
    label: percentUsed >= 100 ? "Preview cap reached" : `${formatPortalUsageDuration(timeRemainingMs)} preview left`,
  };
}

export function getMemberAiTelemetryRows(
  customerId: string,
  session: MemberSession | null,
): AiTelemetryRow[] {
  const usageStore = readFleetUsage();
  const projectAgg = aggregateProjectTimeByCallsign(customerId);

  return [...fleetManifest]
    .sort((a, b) => a.slot - b.slot)
    .map((unit) => {
      const key = callsignKey(unit.callsign);
      const usageEntry = Object.values(usageStore).find((entry) => callsignKey(entry.callsign) === key);
      const projectStats = projectAgg.get(key) ?? { sessionForks: 0, activeTimeMs: 0 };

      const browserLaunches = Math.max(usageEntry?.count ?? 0, projectStats.sessionForks);
      const browserTimeMs = projectStats.activeTimeMs;
      const free = computeFreeTierUsage(session, browserLaunches, browserTimeMs);

      return {
        unitId: unit.id,
        callsign: unit.callsign,
        name: unit.name,
        browserLaunches,
        browserTimeMs,
        freeTierPercentUsed: free.percentUsed,
        freeTierTimeRemainingMs: free.timeRemainingMs,
        freeTierLabel: free.label,
      };
    });
}

export function getMemberTelemetryTotals(rows: AiTelemetryRow[]): {
  browserLaunches: number;
  browserTimeMs: number;
  activeUnits: number;
} {
  return rows.reduce(
    (acc, row) => ({
      browserLaunches: acc.browserLaunches + row.browserLaunches,
      browserTimeMs: acc.browserTimeMs + row.browserTimeMs,
      activeUnits: acc.activeUnits + (row.browserLaunches > 0 || row.browserTimeMs > 0 ? 1 : 0),
    }),
    { browserLaunches: 0, browserTimeMs: 0, activeUnits: 0 },
  );
}
