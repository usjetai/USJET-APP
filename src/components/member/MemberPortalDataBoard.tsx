import { useEffect, useMemo, useState } from "react";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  MEMBER_YOUR_AI_DATA_EMPTY,
  MEMBER_YOUR_AI_DATA_IDLE_NOTE,
  MEMBER_YOUR_AI_DATA_KICKER,
  MEMBER_YOUR_AI_DATA_LEDE,
  MEMBER_YOUR_AI_DATA_TITLE,
} from "../../data/memberYourAiData";
import {
  computeFreeTierUsage,
  getMemberAiTelemetryRows,
  getMemberTelemetryTotals,
} from "../../lib/memberPortalTelemetry";
import { formatPortalUsageDuration } from "../../lib/memberProjectTracker";
import { formatLastUsed, getFleetUsageRanked, subscribeFleetUsage } from "../../lib/fleetUsageHistory";
import { subscribeMemberProjects } from "../../lib/memberProjectTracker";
import type { MemberSession } from "../../types/member";
import { memberClearanceDisplayLabel } from "../../lib/memberAccessLevel";

type MemberPortalDataBoardProps = {
  customerId: string;
  session: MemberSession | null;
};

function sortByActivity<T extends { browserLaunches: number; browserTimeMs: number; callsign: string }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) =>
      b.browserLaunches - a.browserLaunches ||
      b.browserTimeMs - a.browserTimeMs ||
      a.callsign.localeCompare(b.callsign),
  );
}

export default function MemberPortalDataBoard({ customerId, session }: MemberPortalDataBoardProps) {
  const [tick, setTick] = useState(0);
  const [showAllUnits, setShowAllUnits] = useState(false);

  useEffect(() => subscribeMemberProjects(() => setTick((value) => value + 1)), []);
  useEffect(() => subscribeFleetUsage(() => setTick((value) => value + 1)), []);

  const rows = useMemo(
    () => getMemberAiTelemetryRows(customerId, session),
    [customerId, session, tick],
  );
  const totals = useMemo(() => getMemberTelemetryTotals(rows), [rows]);
  const clearance = memberClearanceDisplayLabel(session);
  const flightPass = useMemo(
    () => computeFreeTierUsage(session, totals.browserLaunches, totals.browserTimeMs),
    [session, totals.browserLaunches, totals.browserTimeMs],
  );

  const lastUsedByCallsign = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of getFleetUsageRanked()) {
      map.set(entry.callsign.toUpperCase(), entry.lastUsedAt);
    }
    return map;
  }, [tick]);

  const activeRows = useMemo(
    () => sortByActivity(rows.filter((row) => row.browserLaunches > 0 || row.browserTimeMs > 0)),
    [rows],
  );
  const idleCount = rows.length - totals.activeUnits;
  const displayRows = showAllUnits ? sortByActivity(rows) : activeRows;
  const maxLaunches = displayRows[0]?.browserLaunches ?? 1;

  return (
    <GlassEffectContainer className="member-data-board glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <header className="member-data-board__header">
        <p className="member-data-board__kicker">{MEMBER_YOUR_AI_DATA_KICKER}</p>
        <h2 className="member-data-board__title">{MEMBER_YOUR_AI_DATA_TITLE}</h2>
        <p className="member-data-board__copy">{MEMBER_YOUR_AI_DATA_LEDE}</p>
        <p className="member-data-board__clearance">
          Clearance · <strong>{clearance}</strong>
        </p>
      </header>

      <div className="member-data-board__summary" aria-label="Your AI data totals">
        <div className="member-data-board__summary-cell">
          <span className="member-data-board__summary-label">Launches</span>
          <span className="member-data-board__summary-value">{totals.browserLaunches}</span>
        </div>
        <div className="member-data-board__summary-cell">
          <span className="member-data-board__summary-label">Time on deck</span>
          <span className="member-data-board__summary-value">
            {formatPortalUsageDuration(totals.browserTimeMs)}
          </span>
        </div>
        <div className="member-data-board__summary-cell">
          <span className="member-data-board__summary-label">Units active</span>
          <span className="member-data-board__summary-value">
            {totals.activeUnits}
            <span className="member-data-board__summary-muted"> / {rows.length}</span>
          </span>
        </div>
      </div>

      <div className="member-data-board__flight-pass" aria-label="Flight Pass window">
        <div className="member-data-board__flight-pass-head">
          <span className="member-data-board__flight-pass-label">Flight Pass</span>
          <span className="member-data-board__flight-pass-status">{flightPass.label}</span>
        </div>
        <span className="member-data-board__tier-bar" aria-hidden>
          <span
            className="member-data-board__tier-bar-fill"
            style={{ width: `${Math.min(100, flightPass.percentUsed)}%` }}
          />
        </span>
      </div>

      <section className="member-data-board__usage" aria-labelledby="member-your-ai-data-usage">
        <div className="member-data-board__usage-head">
          <h3 id="member-your-ai-data-usage" className="member-data-board__usage-title">
            {showAllUnits ? "Full fleet roster" : "Active this window"}
          </h3>
          {idleCount > 0 ? (
            <button
              type="button"
              className="member-data-board__toggle btn-glass glass-effect-interactive"
              onClick={() => setShowAllUnits((value) => !value)}
            >
              {showAllUnits ? "Show active only" : `Show all ${rows.length} units`}
            </button>
          ) : null}
        </div>

        {displayRows.length > 0 ? (
          <ul className="member-data-board__grid" aria-label="Fleet unit telemetry">
            {displayRows.map((row, index) => {
              const shareWidth = Math.max(
                6,
                Math.round((row.browserLaunches / maxLaunches) * 100),
              );
              const lastAt = lastUsedByCallsign.get(row.callsign.toUpperCase());
              const isActive = row.browserLaunches > 0 || row.browserTimeMs > 0;

              return (
                <li
                  key={row.unitId}
                  className={[
                    "member-data-board__cell",
                    isActive ? "member-data-board__cell--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="member-data-board__cell-head">
                    <span className="member-data-board__rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="member-data-board__unit-callsign">{row.callsign}</span>
                  </div>
                  <p className="member-data-board__unit-name">
                    <DeveloperRedBlinkName name={row.name} />
                  </p>
                  <dl className="member-data-board__cell-metrics">
                    <div>
                      <dt>Launches</dt>
                      <dd>{row.browserLaunches}</dd>
                    </div>
                    <div>
                      <dt>Time</dt>
                      <dd>{formatPortalUsageDuration(row.browserTimeMs)}</dd>
                    </div>
                    <div>
                      <dt>Last</dt>
                      <dd>{lastAt ? formatLastUsed(lastAt) : "—"}</dd>
                    </div>
                    <div>
                      <dt>Share</dt>
                      <dd>
                        <span className="member-data-board__share-track" aria-hidden>
                          <span
                            className="member-data-board__share-fill"
                            style={{ width: `${shareWidth}%` }}
                          />
                        </span>
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="member-data-board__empty">{MEMBER_YOUR_AI_DATA_EMPTY}</p>
        )}

        {!showAllUnits && idleCount > 0 ? (
          <p className="member-data-board__idle-note">{MEMBER_YOUR_AI_DATA_IDLE_NOTE(idleCount)}</p>
        ) : null}
      </section>
    </GlassEffectContainer>
  );
}
