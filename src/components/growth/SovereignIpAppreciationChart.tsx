import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  SOVEREIGN_IP_APPRECIATION_CURVE,
  SOVEREIGN_LIQUIDITY_COPY,
} from "../../data/sovereignBlueprint100k";

const CHART_W = 320;
const CHART_H = 140;
const PAD = { top: 16, right: 12, bottom: 28, left: 44 };

function buildPath() {
  const max = Math.max(...SOVEREIGN_IP_APPRECIATION_CURVE.map((p) => p.value));
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const points = SOVEREIGN_IP_APPRECIATION_CURVE.map((point, index) => {
    const x = PAD.left + (index / (SOVEREIGN_IP_APPRECIATION_CURVE.length - 1)) * innerW;
    const y = PAD.top + innerH - (point.value / max) * innerH;
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;
  return { line, area, points };
}

export default function SovereignIpAppreciationChart() {
  const { line, area, points } = buildPath();

  return (
    <GlassEffectContainer className="sovereign-ip-chart glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
      <div className="sovereign-ip-chart__inner">
        <h2 className="sovereign-ip-chart__title">Strategic Value &amp; Liquidity</h2>
        <p className="sovereign-ip-chart__lede">{SOVEREIGN_LIQUIDITY_COPY}</p>

        <figure className="sovereign-ip-chart__figure">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="sovereign-ip-chart__svg"
            role="img"
            aria-label="Protocol price rises from one hundred thousand to five hundred thousand on USA 250 July fourth twenty twenty six"
          >
            <defs>
              <linearGradient id="sovereign-ip-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251, 191, 36, 0.45)" />
                <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((t) => {
              const y = PAD.top + (CHART_H - PAD.top - PAD.bottom) * t;
              return (
                <line
                  key={t}
                  x1={PAD.left}
                  x2={CHART_W - PAD.right}
                  y1={y}
                  y2={y}
                  className="sovereign-ip-chart__grid"
                />
              );
            })}
            <path d={area} fill="url(#sovereign-ip-fill)" />
            <path d={line} className="sovereign-ip-chart__line" fill="none" />
            {points.map((p, i) => (
              <circle key={SOVEREIGN_IP_APPRECIATION_CURVE[i].label} cx={p.x} cy={p.y} r={4} className="sovereign-ip-chart__dot" />
            ))}
            {SOVEREIGN_IP_APPRECIATION_CURVE.map((point, index) => {
              const x = PAD.left + (index / (SOVEREIGN_IP_APPRECIATION_CURVE.length - 1)) * (CHART_W - PAD.left - PAD.right);
              return (
                <text key={point.label} x={x} y={CHART_H - 6} textAnchor="middle" className="sovereign-ip-chart__label">
                  {point.label}
                </text>
              );
            })}
          </svg>
          <figcaption className="sovereign-ip-chart__caption">
            Illustrative IP appreciation curve · not financial advice · private secondary market subject to transfer
            policy
          </figcaption>
        </figure>

        <ul className="sovereign-ip-chart__values">
          {SOVEREIGN_IP_APPRECIATION_CURVE.map((point) => (
            <li key={point.label}>
              <span className="sovereign-ip-chart__value-label">{point.label}</span>
              <span className="sovereign-ip-chart__value-amount">{point.display}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassEffectContainer>
  );
}
