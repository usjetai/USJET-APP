import { useEffect, useMemo, useState } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  formatLastUsed,
  formatTodayUsageNarrative,
  getFleetUsageRanked,
  getFleetUsageTodayRows,
  subscribeFleetUsage,
} from "../../lib/fleetUsageHistory";

export default function MemberFleetUsageChart() {
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeFleetUsage(() => setTick((value) => value + 1)), []);

  const ranked = useMemo(() => getFleetUsageRanked(), [tick]);
  const todayRows = useMemo(() => getFleetUsageTodayRows(), [tick]);
  const narrative = useMemo(() => formatTodayUsageNarrative(todayRows), [todayRows]);
  const maxCount = ranked[0]?.count ?? 1;
  const hasUsage = ranked.length > 0;

  return (
    <GlassEffectContainer className="member-usage glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-usage__header">
        <p className="member-usage__kicker">AI usage history</p>
        <h2 className="member-usage__title">Fleet launch log</h2>
      </div>
      <p className="member-usage__narrative">{narrative}</p>

      {hasUsage ? (
        <ol className="member-usage__list" aria-label="AI usage history ranked by total launches">
          {ranked.map((entry, index) => {
            const width = Math.max(8, Math.round((entry.count / maxCount) * 100));
            return (
              <li key={entry.callsign} className="member-usage__row">
                <div className="member-usage__row-head">
                  <span className="member-usage__rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="member-usage__name">{entry.name}</span>
                  <span className="member-usage__count">{entry.count}</span>
                </div>
                <div className="member-usage__bar-track" aria-hidden>
                  <span className="member-usage__bar-fill" style={{ width: `${width}%` }} />
                </div>
                <p className="member-usage__last">Last used {formatLastUsed(entry.lastUsedAt)}</p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="member-usage__empty">
          Launch any fleet bay from Hangar or Intel while signed in — usage logs here in your browser.
        </p>
      )}
    </GlassEffectContainer>
  );
}
