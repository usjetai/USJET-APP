import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { uniqueCoinbaseProductIds } from "../data/intelCoinbaseAssets";
import type { OhlcCandle } from "../lib/intelCandles";
import {
  fetchCoinbaseCandles,
  fetchCoinbaseSnapshot,
  type CoinbaseSnapshot,
} from "../lib/intelMarketFeeds";

const QUOTE_POLL_MS = 15_000;
const CANDLE_POLL_MS = 60_000;

type IntelLiveMarketContextValue = {
  quotes: Record<string, CoinbaseSnapshot | undefined>;
  candles: Record<string, OhlcCandle[] | undefined>;
  loading: boolean;
  error: boolean;
  refreshQuotes: () => Promise<void>;
};

const IntelLiveMarketContext = createContext<IntelLiveMarketContextValue | null>(null);

export function IntelLiveMarketProvider({ children }: { children: ReactNode }) {
  const productIds = useMemo(() => uniqueCoinbaseProductIds(), []);
  const [quotes, setQuotes] = useState<Record<string, CoinbaseSnapshot | undefined>>({});
  const [candles, setCandles] = useState<Record<string, OhlcCandle[] | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refreshQuotes = useCallback(async () => {
    const results = await Promise.allSettled(
      productIds.map(async (productId) => {
        const snapshot = await fetchCoinbaseSnapshot(productId);
        return { productId, snapshot };
      }),
    );

    const nextQuotes: Record<string, CoinbaseSnapshot> = {};
    let anyOk = false;

    for (const result of results) {
      if (result.status === "fulfilled") {
        nextQuotes[result.value.productId] = result.value.snapshot;
        anyOk = true;
      }
    }

    if (anyOk) {
      setQuotes((current) => ({ ...current, ...nextQuotes }));
      setError(false);
    } else {
      setError(true);
    }

    setLoading(false);
  }, [productIds]);

  const refreshCandles = useCallback(async () => {
    const results = await Promise.allSettled(
      productIds.map(async (productId) => {
        const rows = await fetchCoinbaseCandles(productId, 12);
        return { productId, rows };
      }),
    );

    const nextCandles: Record<string, OhlcCandle[]> = {};

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.rows.length > 0) {
        nextCandles[result.value.productId] = result.value.rows;
      }
    }

    if (Object.keys(nextCandles).length > 0) {
      setCandles((current) => ({ ...current, ...nextCandles }));
    }
  }, [productIds]);

  useEffect(() => {
    void refreshQuotes();
    void refreshCandles();

    const quoteTimer = window.setInterval(() => {
      void refreshQuotes();
    }, QUOTE_POLL_MS);

    const candleTimer = window.setInterval(() => {
      void refreshCandles();
    }, CANDLE_POLL_MS);

    return () => {
      window.clearInterval(quoteTimer);
      window.clearInterval(candleTimer);
    };
  }, [refreshCandles, refreshQuotes]);

  const value = useMemo(
    () => ({
      quotes,
      candles,
      loading,
      error,
      refreshQuotes,
    }),
    [candles, error, loading, quotes, refreshQuotes],
  );

  return <IntelLiveMarketContext.Provider value={value}>{children}</IntelLiveMarketContext.Provider>;
}

export function useIntelLiveMarket(): IntelLiveMarketContextValue {
  const context = useContext(IntelLiveMarketContext);
  if (!context) {
    throw new Error("useIntelLiveMarket must be used within IntelLiveMarketProvider");
  }
  return context;
}

export function useIntelLiveMarketOptional(): IntelLiveMarketContextValue | null {
  return useContext(IntelLiveMarketContext);
}
