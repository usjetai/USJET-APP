export type BtcSnapshot = {
  priceUsd: number;
  changePct24h: number | null;
};

export async function fetchBtcSnapshot(): Promise<BtcSnapshot> {
  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", "bitcoin");
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("include_24hr_change", "true");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("btc spot");
  }

  const data = (await response.json()) as {
    bitcoin?: { usd?: number; usd_24h_change?: number };
  };
  const row = data.bitcoin;

  if (typeof row?.usd !== "number") {
    throw new Error("btc spot shape");
  }

  return {
    priceUsd: row.usd,
    changePct24h: typeof row.usd_24h_change === "number" ? row.usd_24h_change : null,
  };
}

/** Last ~24h USD closes, downsampled for a compact spark path. */
export async function fetchBtcSparkline(): Promise<number[]> {
  const url =
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("btc chart");
  }

  const data = (await response.json()) as { prices?: [number, number][] };
  const prices = data.prices ?? [];
  const values = prices.map(([, price]) => price);

  const maxPoints = 56;
  if (values.length <= maxPoints) {
    return values;
  }

  const step = Math.ceil(values.length / maxPoints);
  return values.filter((_, index) => index % step === 0);
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
