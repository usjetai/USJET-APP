import { useState, useEffect } from "react";

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(time.getUTCHours()).padStart(2, "0");
  const mm = String(time.getUTCMinutes()).padStart(2, "0");
  const ss = String(time.getUTCSeconds()).padStart(2, "0");
  const dateStr = time.toUTCString().slice(0, 16);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-7 flex items-center justify-between px-5 status-bar select-none pointer-events-none">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="status-dot" />
          <span className="text-[10px] font-mono text-green-400/90 tracking-widest font-medium">SYSTEM READY</span>
        </div>
        <div className="w-px h-3 bg-white/8" />
        <span className="text-[10px] font-mono text-white/25 tracking-wide">USJET.ai v4.0</span>
        <div className="w-px h-3 bg-white/8" />
        <span className="text-[10px] font-mono text-white/25">{dateStr}</span>
      </div>

      {/* Center clock */}
      <span className="text-[10px] font-mono text-white/30 tracking-widest absolute left-1/2 -translate-x-1/2 tabular-nums">
        {hh}:{mm}:{ss} UTC
      </span>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-white/25">30 TOOLS ACTIVE</span>
        <div className="w-px h-3 bg-white/8" />
        <span className="text-[10px] font-mono text-primary/50">◆ ONLINE</span>
        <div className="w-px h-3 bg-white/8" />
        <div className="flex items-end gap-[2px]">
          {[4, 6, 8, 10, 7].map((h, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-sm ${i < 4 ? "bg-primary/55" : "bg-white/15"}`}
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
