export type OhlcCandle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export function generateCandles(seed: number, count: number, basePrice: number, volatility: number): OhlcCandle[] {
  const candles: OhlcCandle[] = [];
  let lastClose = basePrice + (seed % 7) * volatility * 0.12;

  for (let index = 0; index < count; index++) {
    const drift = Math.sin(seed * 0.41 + index * 0.93) * volatility * 0.35;
    const noise = Math.cos(seed * 0.17 + index * 1.37) * volatility * 0.22;
    const open = lastClose;
    const close = Math.max(basePrice * 0.88, open + drift + noise);
    const high = Math.max(open, close) + volatility * (0.15 + (index % 3) * 0.08);
    const low = Math.min(open, close) - volatility * (0.12 + (index % 4) * 0.06);
    candles.push({ open, high, low, close });
    lastClose = close;
  }

  return candles;
}

export function tickLastCandle(candles: OhlcCandle[], volatility: number): OhlcCandle[] {
  if (candles.length === 0) {
    return candles;
  }

  const next = [...candles];
  const last = { ...next[next.length - 1] };
  const delta = (Math.random() - 0.47) * volatility * 0.45;
  last.close = Math.max(0.01, last.close + delta);
  last.high = Math.max(last.high, last.close, last.open);
  last.low = Math.min(last.low, last.close, last.open);
  next[next.length - 1] = last;
  return next;
}
