import { useMemo } from "react";
import type { OhlcCandle } from "../../lib/intelCandles";

type IntelCandleChartProps = {
  candles: OhlcCandle[];
  className?: string;
  live?: boolean;
};

export function formatCandlePrice(n: number): string {
  if (!Number.isFinite(n)) {
    return "—";
  }
  if (n >= 1000) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (n >= 1) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

function candleGeometry(candles: OhlcCandle[], width: number, height: number) {
  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = max - min || 1;
  const padY = 4;
  const plotH = height - padY * 2;
  const slotW = width / candles.length;
  const bodyW = Math.max(1.8, slotW * 0.52);

  const bars = candles.map((candle, index) => {
    const xCenter = slotW * index + slotW / 2;
    const y = (value: number) => padY + plotH * (1 - (value - min) / span);
    const bullish = candle.close >= candle.open;
    const bodyTop = y(Math.max(candle.open, candle.close));
    const bodyBottom = y(Math.min(candle.open, candle.close));
    const bodyHeight = Math.max(0.8, bodyBottom - bodyTop);

    return {
      bullish,
      wickX: xCenter,
      wickY1: y(candle.high),
      wickY2: y(candle.low),
      bodyX: xCenter - bodyW / 2,
      bodyY: bodyTop,
      bodyW,
      bodyH: bodyHeight,
    };
  });

  return { bars, min, max, span };
}

/** Shared Intel OHLC sparkline with readable price scale + last print. */
export default function IntelCandleChart({ candles, className = "", live = false }: IntelCandleChartProps) {
  const { bars, min, max } = useMemo(() => candleGeometry(candles, 100, 44), [candles]);
  const last = candles[candles.length - 1];
  const mid = (min + max) / 2;
  const lastBullish = last ? last.close >= last.open : true;

  return (
    <div
      className={["intel-candles-frame", live ? "intel-candles-frame--live" : "", className]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={
        last
          ? `Candles high ${formatCandlePrice(max)}, low ${formatCandlePrice(min)}, last ${formatCandlePrice(last.close)}`
          : "Candles"
      }
    >
      <div className="intel-candles-frame__scale" aria-hidden>
        <span className="intel-candles-frame__tick">{formatCandlePrice(max)}</span>
        <span className="intel-candles-frame__tick">{formatCandlePrice(mid)}</span>
        <span className="intel-candles-frame__tick">{formatCandlePrice(min)}</span>
      </div>

      <div className="intel-candles-frame__plot">
        <svg
          className={["intel-candles", live ? "intel-candles--live" : ""].filter(Boolean).join(" ")}
          viewBox="0 0 100 44"
          preserveAspectRatio="none"
          aria-hidden
        >
          {bars.map((bar, index) => (
            <g key={index} className={bar.bullish ? "intel-candles__bar--bull" : "intel-candles__bar--bear"}>
              <line className="intel-candles__wick" x1={bar.wickX} x2={bar.wickX} y1={bar.wickY1} y2={bar.wickY2} />
              <rect
                className="intel-candles__body"
                x={bar.bodyX}
                y={bar.bodyY}
                width={bar.bodyW}
                height={bar.bodyH}
                rx={0.35}
              />
            </g>
          ))}
        </svg>
      </div>

      {last ? (
        <div
          className={[
            "intel-candles-frame__last",
            lastBullish ? "intel-candles-frame__last--up" : "intel-candles-frame__last--down",
          ].join(" ")}
        >
          <span className="intel-candles-frame__last-label">Last</span>
          <span className="intel-candles-frame__last-value">{formatCandlePrice(last.close)}</span>
        </div>
      ) : null}
    </div>
  );
}
