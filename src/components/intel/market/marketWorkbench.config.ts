/** Shared market workbench — Intel expanded view; Coinbase spot + NYSE TradingView embed. */

export const MARKET_WORKBENCH_BTC_POLL_MS = 15_000;

export function marketWorkbenchNyseEmbed(tradingViewSymbol: string): string {
  const params = new URLSearchParams({
    locale: "en",
    symbol: tradingViewSymbol,
    colorTheme: "dark",
    isTransparent: "true",
  });
  return `https://s.tradingview.com/embed-widget/mini-symbol-overview/?${params.toString()}`;
}
