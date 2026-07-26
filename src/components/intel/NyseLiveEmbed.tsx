import { useMemo } from "react";
import { marketWorkbenchNyseEmbed } from "./market/marketWorkbench.config";

type NyseLiveEmbedProps = {
  tradingViewSymbol: string;
  title?: string;
  className?: string;
};

/**
 * Live NYSE / NASDAQ board via TradingView mini overview.
 * Distribution embed — USJET does not purchase NYSE market-data API licenses.
 */
export default function NyseLiveEmbed({
  tradingViewSymbol,
  title = "NYSE live board",
  className = "",
}: NyseLiveEmbedProps) {
  const src = useMemo(() => marketWorkbenchNyseEmbed(tradingViewSymbol), [tradingViewSymbol]);

  return (
    <div className={["nyse-live-embed", className].filter(Boolean).join(" ")}>
      <iframe
        className="nyse-live-embed__frame"
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="fullscreen"
      />
    </div>
  );
}
