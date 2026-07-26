/**
 * Simulated Intel market pulse — cockpit immersion only.
 * Master Log hold line: no Coinbase / NYSE API calls until Titans pay.
 */

import { uniqueCoinbaseProductIds } from "../data/intelCoinbaseAssets";
import { generateCandles, tickLastCandle, type OhlcCandle } from "./intelCandles";
import type { CoinbaseSnapshot } from "./intelMarketFeeds";

/** Deterministic seed bases for immersion quotes (not live exchange prices). */
const MOCK_BASE_BY_PRODUCT: Record<string, number> = {
  "BTC-USD": 68420,
  "ETH-USD": 3420,
  "SOL-USD": 148.5,
  "LINK-USD": 14.8,
  "AVAX-USD": 36.2,
  "DOT-USD": 7.4,
  "ATOM-USD": 9.1,
  "UNI-USD": 11.6,
  "ADA-USD": 0.72,
  "NEAR-USD": 5.4,
  "FIL-USD": 5.9,
  "APT-USD": 9.8,
  "ARB-USD": 0.92,
  "OP-USD": 1.85,
  "LTC-USD": 86.4,
};

function mockBasePrice(productId: string): number {
  return MOCK_BASE_BY_PRODUCT[productId] ?? 100;
}

function mockStep(productId: string, base: number): number {
  if (productId.startsWith("BTC")) return 95;
  if (base >= 1000) return Math.max(base * 0.0018, 1.2);
  if (base >= 10) return Math.max(base * 0.004, 0.08);
  return Math.max(base * 0.006, 0.004);
}

export type IntelMockMarketState = {
  quotes: Record<string, CoinbaseSnapshot>;
  candles: Record<string, OhlcCandle[]>;
  openAnchors: Record<string, number>;
};

export function createIntelMockMarketState(candleCount = 12): IntelMockMarketState {
  const quotes: Record<string, CoinbaseSnapshot> = {};
  const candles: Record<string, OhlcCandle[]> = {};
  const openAnchors: Record<string, number> = {};

  uniqueCoinbaseProductIds().forEach((productId, index) => {
    const base = mockBasePrice(productId);
    const step = mockStep(productId, base);
    const priceUsd = base + (index % 5) * step * 0.12;
    openAnchors[productId] = base;
    quotes[productId] = {
      priceUsd,
      changePct24h: ((priceUsd - base) / base) * 100,
    };
    candles[productId] = generateCandles(index + 3, candleCount, priceUsd, step * 2.4);
  });

  return { quotes, candles, openAnchors };
}

export function tickIntelMockMarket(state: IntelMockMarketState): IntelMockMarketState {
  const quotes: Record<string, CoinbaseSnapshot> = {};
  const candles: Record<string, OhlcCandle[]> = {};

  for (const productId of Object.keys(state.quotes)) {
    const prev = state.quotes[productId];
    const base = state.openAnchors[productId] ?? mockBasePrice(productId);
    const step = mockStep(productId, base);
    const drift = (Math.random() - 0.48) * step;
    const priceUsd = Math.max(base * 0.82, (prev?.priceUsd ?? base) + drift);
    quotes[productId] = {
      priceUsd,
      changePct24h: ((priceUsd - base) / base) * 100,
    };
    const prevCandles = state.candles[productId] ?? generateCandles(1, 12, priceUsd, step * 2.4);
    candles[productId] = tickLastCandle(prevCandles, step * 2.4);
  }

  return {
    quotes,
    candles,
    openAnchors: state.openAnchors,
  };
}
