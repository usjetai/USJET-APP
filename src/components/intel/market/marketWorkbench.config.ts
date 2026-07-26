/** Shared market workbench — Intel expanded view; Coinbase spot + NYSE TradingView embed. */

export { INTEL_COINBASE_POLL_MS as MARKET_WORKBENCH_BTC_POLL_MS } from "../../../lib/intelMarketFeeds";

/** TradingView mini overview — live NYSE/NASDAQ board without a paid market-data API license. */
export function marketWorkbenchNyseEmbed(tradingViewSymbol: string): string {
  const config = {
    symbol: tradingViewSymbol,
    width: "100%",
    height: "100%",
    dateRange: "1D",
    colorTheme: "dark",
    isTransparent: true,
    autosize: true,
    largeChartUrl: "",
  };
  return `https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
}
