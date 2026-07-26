import type { OhlcCandle } from "./intelCandles";

/** Public Coinbase spot poll interval for Intel live board. */
export const INTEL_COINBASE_POLL_MS = 15_000;

export type CoinbaseSnapshot = {
  priceUsd: number;
  changePct24h: number | null;
};

export type BtcSnapshot = CoinbaseSnapshot;

const COINBASE_EXCHANGE = "https://api.exchange.coinbase.com";

export async function fetchCoinbaseSnapshot(productId: string): Promise<CoinbaseSnapshot> {
  const encoded = encodeURIComponent(productId);
  const [tickerRes, statsRes] = await Promise.all([
    fetch(`${COINBASE_EXCHANGE}/products/${encoded}/ticker`),
    fetch(`${COINBASE_EXCHANGE}/products/${encoded}/stats`),
  ]);

  if (!tickerRes.ok || !statsRes.ok) {
    throw new Error(`coinbase spot ${productId}`);
  }

  const ticker = (await tickerRes.json()) as { price?: string };
  const stats = (await statsRes.json()) as { open?: string; last?: string };

  const priceUsd = Number.parseFloat(ticker.price ?? stats.last ?? "");
  const open = Number.parseFloat(stats.open ?? "");

  if (!Number.isFinite(priceUsd)) {
    throw new Error(`coinbase spot shape ${productId}`);
  }

  let changePct24h: number | null = null;
  if (Number.isFinite(open) && open > 0) {
    changePct24h = ((priceUsd - open) / open) * 100;
  }

  return { priceUsd, changePct24h };
}

/** Coinbase 1h candles — newest last for chart rendering. */
export async function fetchCoinbaseCandles(productId: string, count = 12): Promise<OhlcCandle[]> {
  const encoded = encodeURIComponent(productId);
  const response = await fetch(
    `${COINBASE_EXCHANGE}/products/${encoded}/candles?granularity=3600`,
  );

  if (!response.ok) {
    throw new Error(`coinbase candles ${productId}`);
  }

  const rows = (await response.json()) as [number, number, number, number, number, number][];

  return rows
    .slice(0, count)
    .reverse()
    .map(([, low, high, open, close]) => ({
      open,
      high,
      low,
      close,
    }));
}

export async function fetchBtcSnapshot(): Promise<BtcSnapshot> {
  return fetchCoinbaseSnapshot("BTC-USD");
}

/** Last ~24h USD closes from Coinbase hourly candles. */
export async function fetchBtcSparkline(): Promise<number[]> {
  const candles = await fetchCoinbaseCandles("BTC-USD", 24);
  return candles.map((candle) => candle.close);
}

export function sparklinePointsToPath(values: number[]): string {
  if (values.length < 2) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const padY = 6;
  const h = 40 - padY * 2;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const normalized = (value - min) / span;
      const y = padY + h * (1 - normalized);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}
