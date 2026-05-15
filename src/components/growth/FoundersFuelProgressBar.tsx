import { useEffect, useState } from "react";
import { getFuelMetrics, subscribeFuelMetrics } from "../../lib/foundersFuelMetrics";

type FoundersFuelProgressBarProps = {
  compact?: boolean;
};

export default function FoundersFuelProgressBar({ compact = false }: FoundersFuelProgressBarProps) {
  const [metrics, setMetrics] = useState(() => getFuelMetrics());

  useEffect(() => subscribeFuelMetrics(() => setMetrics(getFuelMetrics())), []);

  return (
    <div className={compact ? "fuel-progress fuel-progress--compact" : "fuel-progress"}>
      <div className="fuel-progress__head">
        <span className="fuel-progress__label">Daily fuel goal</span>
        <span className="fuel-progress__count">
          {metrics.supporters} / {metrics.goal} supporters
        </span>
      </div>
      <div
        className="fuel-progress__track liquid-glass-background"
        role="progressbar"
        aria-valuenow={metrics.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="fuel-progress__fill" style={{ width: `${metrics.percent}%` }} />
      </div>
      {!compact ? (
        <p className="fuel-progress__sub">
          {metrics.remaining > 0
            ? `${metrics.remaining} more fuels the next 15-hour dev sprint.`
            : "Goal reached — sprint funded. Keep the momentum rolling."}
        </p>
      ) : null}
    </div>
  );
}
