export type IntelSlotMarket = {
  coinbaseProductId: string;
  coinbaseLabel: string;
  nyseSymbol: string;
  nyseTradingViewSymbol: string;
};

/** Coinbase spot pairs — AI / infra narrative coins cycled across Intel tiles. */
const COINBASE_AI_PRODUCTS: readonly { id: string; label: string }[] = [
  { id: "BTC-USD", label: "BTC" },
  { id: "ETH-USD", label: "ETH" },
  { id: "SOL-USD", label: "SOL" },
  { id: "LINK-USD", label: "LINK" },
  { id: "AVAX-USD", label: "AVAX" },
  { id: "DOT-USD", label: "DOT" },
  { id: "ATOM-USD", label: "ATOM" },
  { id: "UNI-USD", label: "UNI" },
  { id: "ADA-USD", label: "ADA" },
  { id: "NEAR-USD", label: "NEAR" },
  { id: "FIL-USD", label: "FIL" },
  { id: "APT-USD", label: "APT" },
  { id: "ARB-USD", label: "ARB" },
  { id: "OP-USD", label: "OP" },
  { id: "LTC-USD", label: "LTC" },
] as const;

/** NYSE / NASDAQ symbols paired with tiles for exchange code readout. */
const NYSE_SLOT_SYMBOLS: readonly { symbol: string; tradingView: string }[] = [
  { symbol: "NYA", tradingView: "NYSE:NYA" },
  { symbol: "NVDA", tradingView: "NASDAQ:NVDA" },
  { symbol: "AMD", tradingView: "NASDAQ:AMD" },
  { symbol: "MSFT", tradingView: "NASDAQ:MSFT" },
  { symbol: "GOOGL", tradingView: "NASDAQ:GOOGL" },
  { symbol: "META", tradingView: "NASDAQ:META" },
  { symbol: "TSLA", tradingView: "NASDAQ:TSLA" },
  { symbol: "PLTR", tradingView: "NASDAQ:PLTR" },
  { symbol: "SMCI", tradingView: "NASDAQ:SMCI" },
  { symbol: "ARM", tradingView: "NASDAQ:ARM" },
  { symbol: "AVGO", tradingView: "NASDAQ:AVGO" },
  { symbol: "ORCL", tradingView: "NYSE:ORCL" },
  { symbol: "CRM", tradingView: "NYSE:CRM" },
  { symbol: "IBM", tradingView: "NYSE:IBM" },
  { symbol: "INTC", tradingView: "NASDAQ:INTC" },
] as const;

export function getIntelSlotMarket(slot: number): IntelSlotMarket {
  const coin = COINBASE_AI_PRODUCTS[slot % COINBASE_AI_PRODUCTS.length];
  const nyse = NYSE_SLOT_SYMBOLS[slot % NYSE_SLOT_SYMBOLS.length];

  return {
    coinbaseProductId: coin.id,
    coinbaseLabel: coin.label,
    nyseSymbol: nyse.symbol,
    nyseTradingViewSymbol: nyse.tradingView,
  };
}

export function uniqueCoinbaseProductIds(): string[] {
  return [...new Set(COINBASE_AI_PRODUCTS.map((row) => row.id))];
}
