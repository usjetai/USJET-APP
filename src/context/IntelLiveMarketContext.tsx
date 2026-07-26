import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { uniqueCoinbaseProductIds } from "../data/intelCoinbaseAssets";
import type { OhlcCandle } from "../lib/intelCandles";
import {
  fetchCoinbaseCandles,
  fetchCoinbaseSnapshot,
  INTEL_COINBASE_POLL_MS,
  type CoinbaseSnapshot,
} from "../lib/intelMarketFeeds";
import { createIntelMockMarketState, tickIntelMockMarket } from "../lib/intelMockMarket";

/**
 * Founder command · Jul 26, 2026 — hold line removed.
 * Live Coinbase public spot + live NYSE board via TradingView embed.
 * Still no paid NYSE market-data API license; Titan partner logins remain reserved.
 */
export const INTEL_LIVE_MARKET_HOLD_LINE = false;

type IntelLiveMarketContextValue = {
  quotes: Record<string, CoinbaseSnapshot | undefined>;
  candles: Record<string, OhlcCandle[] | undefined>;
  loading: boolean;
  error: boolean;
  holdLine: boolean;
  /** True when quotes/candles are mock immersion, not exchange APIs. */
  simulated: boolean;
  refreshQuotes: () => Promise<void>;
};

const IntelLiveMarketContext = createContext<IntelLiveMarketContextValue | null>(null);

async function fetchLiveMarketBundle(): Promise<{
  quotes: Record<string, CoinbaseSnapshot>;
  candles: Record<string, OhlcCandle[]>;
}> {
  const productIds = uniqueCoinbaseProductIds();
  const quotes: Record<string, CoinbaseSnapshot> = {};
  const candles: Record<string, OhlcCandle[]> = {};

  await Promise.all(
    productIds.map(async (productId) => {
      try {
        const [quote, series] = await Promise.all([
          fetchCoinbaseSnapshot(productId),
          fetchCoinbaseCandles(productId, 12),
        ]);
        quotes[productId] = quote;
        candles[productId] = series;
      } catch {
        // Per-product failure — leave gap; caller may keep prior/mock values.
      }
    }),
  );

  return { quotes, candles };
}

export function IntelLiveMarketProvider({ children }: { children: ReactNode }) {
  const mockFallback = useRef(createIntelMockMarketState(12));
  const [quotes, setQuotes] = useState<Record<string, CoinbaseSnapshot | undefined>>(
    () => mockFallback.current.quotes,
  );
  const [candles, setCandles] = useState<Record<string, OhlcCandle[] | undefined>>(
    () => mockFallback.current.candles,
  );
  const [loading, setLoading] = useState(!INTEL_LIVE_MARKET_HOLD_LINE);
  const [error, setError] = useState(false);
  const [simulated, setSimulated] = useState(INTEL_LIVE_MARKET_HOLD_LINE);

  const refreshQuotes = useCallback(async () => {
    if (INTEL_LIVE_MARKET_HOLD_LINE) {
      mockFallback.current = tickIntelMockMarket(mockFallback.current);
      setQuotes(mockFallback.current.quotes);
      setCandles(mockFallback.current.candles);
      setSimulated(true);
      setError(false);
      return;
    }

    setLoading(true);
    try {
      const live = await fetchLiveMarketBundle();
      const quoteCount = Object.keys(live.quotes).length;
      if (quoteCount === 0) {
        mockFallback.current = tickIntelMockMarket(mockFallback.current);
        setQuotes(mockFallback.current.quotes);
        setCandles(mockFallback.current.candles);
        setSimulated(true);
        setError(true);
        return;
      }

      setQuotes((prev) => ({ ...prev, ...live.quotes }));
      setCandles((prev) => ({ ...prev, ...live.candles }));
      setSimulated(false);
      setError(false);
    } catch {
      mockFallback.current = tickIntelMockMarket(mockFallback.current);
      setQuotes(mockFallback.current.quotes);
      setCandles(mockFallback.current.candles);
      setSimulated(true);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshQuotes();

    if (INTEL_LIVE_MARKET_HOLD_LINE) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const id = window.setInterval(() => {
        void refreshQuotes();
      }, reducedMotion ? 2200 : 1100);
      return () => window.clearInterval(id);
    }

    const id = window.setInterval(() => {
      void refreshQuotes();
    }, INTEL_COINBASE_POLL_MS);
    return () => window.clearInterval(id);
  }, [refreshQuotes]);

  const value = useMemo(
    () => ({
      quotes,
      candles,
      loading,
      error,
      holdLine: INTEL_LIVE_MARKET_HOLD_LINE,
      simulated,
      refreshQuotes,
    }),
    [candles, error, loading, quotes, refreshQuotes, simulated],
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
