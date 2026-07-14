import { useEffect, useState } from "react";

type NyseTickerProps = {
  symbol?: string;
};

function formatNyExchangeClock(date: Date): { time: string; date: string } {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  }).format(date);

  return { time, date: day };
}

/** NY clock ambiance only — not a live NYSE price feed (Master Log hold line). */
export default function NyseTicker({ symbol = "NYA" }: NyseTickerProps) {
  const [nyClock, setNyClock] = useState(() => formatNyExchangeClock(new Date()));

  useEffect(() => {
    const tick = () => {
      setNyClock(formatNyExchangeClock(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="nyse-ticker nyse-ticker--hold">
      <span className="nyse-ticker__label">NY lane</span>
      <span className="nyse-ticker__symbol">{symbol} · reserved</span>
      <span className="nyse-ticker__clock" aria-hidden>
        {nyClock.time}
      </span>
      <span className="nyse-ticker__date" aria-hidden>
        {nyClock.date} ET
      </span>
    </div>
  );
}
