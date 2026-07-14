import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OhlcCandle } from "../lib/intelCandles";
import type { CoinbaseSnapshot } from "../lib/intelMarketFeeds";

/**
 * Master Log · Partnership Intel Revenue May 2026 — Hold Line.
 * No live prices or NYSE API feeds until Titans pay for the lane.
 */
export const INTEL_LIVE_MARKET_HOLD_LINE = true;

type IntelLiveMarketContextValue = {
  quotes: Record<string, CoinbaseSnapshot | undefined>;
  candles: Record<string, OhlcCandle[] | undefined>;
  loading: boolean;
  error: boolean;
  holdLine: boolean;
  refreshQuotes: () => Promise<void>;
};

const IntelLiveMarketContext = createContext<IntelLiveMarketContextValue | null>(null);

export function IntelLiveMarketProvider({ children }: { children: ReactNode }) {
  const [quotes] = useState<Record<string, CoinbaseSnapshot | undefined>>({});
  const [candles] = useState<Record<string, OhlcCandle[] | undefined>>({});

  const refreshQuotes = useCallback(async () => {
    // Hold line: do not poll Coinbase or any exchange API in this build.
  }, []);

  const value = useMemo(
    () => ({
      quotes,
      candles,
      loading: false,
      error: false,
      holdLine: INTEL_LIVE_MARKET_HOLD_LINE,
      refreshQuotes,
    }),
    [candles, quotes, refreshQuotes],
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
