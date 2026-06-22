import { useEffect, useState } from "react";

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

export default function NyseTicker() {
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
    <div className="nyse-ticker">
      <span className="nyse-ticker__label">NYSE</span>
      <span className="nyse-ticker__clock">{nyClock.time}</span>
      <span className="nyse-ticker__date">{nyClock.date} ET</span>
    </div>
  );
}