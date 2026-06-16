import { useEffect, useMemo, useState } from "react";
import { Activity, HeartPulse, Radar } from "lucide-react";
import { motion } from "framer-motion";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import EkgPulseLine from "../components/intel/EkgPulseLine";
import { fleetManifest } from "../data/fleetManifest";
import { getHiredDeveloperUnits } from "../data/fleetRoster";
import { developerRedBlinkHeartClass } from "../lib/developerRedBlink";

function formatHudPercent(value: number): string {
  return `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;
}

function formatTickerClock(date: Date): string {
  return date.toLocaleTimeString([], { hour12: false });
}

export default function HiredHud() {
  const hiredUnits = useMemo(() => getHiredDeveloperUnits(fleetManifest), []);
  const [scanPhase, setScanPhase] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(1.18);
  const [uptime, setUptime] = useState(99.62);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const tickerId = window.setInterval(() => {
      setClock(new Date());
      setScanPhase((phase) => (phase + 1) % 100);
    }, 1000);

    const metricsId = window.setInterval(() => {
      setPulseIndex((value) => {
        const drift = (Math.random() - 0.47) * 0.24;
        return Math.max(-3.75, Math.min(5.9, value + drift));
      });
      setUptime((value) => {
        const drift = (Math.random() - 0.5) * 0.08;
        return Math.max(97.8, Math.min(100, value + drift));
      });
    }, 2200);

    return () => {
      window.clearInterval(tickerId);
      window.clearInterval(metricsId);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hired-hud-page relative">
      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto w-full max-w-[94rem] px-4 pb-24 sm:px-6 lg:px-8">
        <section className="hired-hud glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <header className="hired-hud__header">
            <div>
              <p className="hired-hud__eyebrow">
                <Radar size={13} aria-hidden />
                Developer Monitor
              </p>
              <h1 className="hired-hud__title">Hired Developer Live Reading</h1>
              <p className="hired-hud__subtitle">
                Real-time monitor showing only hired developers and active heartbeat states.
              </p>
            </div>
            <div className="hired-hud__meta">
              <span className="hired-hud__badge">
                <Activity size={12} aria-hidden />
                Live
              </span>
              <span className="hired-hud__clock">{formatTickerClock(clock)}</span>
            </div>
          </header>

          <div className="hired-hud__scanline-wrap" aria-hidden>
            <span className="hired-hud__scanline" style={{ transform: `translateY(${scanPhase}%)` }} />
          </div>

          <div className="hired-hud__metrics">
            <article className="hired-hud__metric">
              <span className="hired-hud__metric-label">Roster Pulse Index</span>
              <strong
                className={[
                  "hired-hud__metric-value",
                  pulseIndex >= 0 ? "hired-hud__metric-value--up" : "hired-hud__metric-value--down",
                ].join(" ")}
              >
                {formatHudPercent(pulseIndex)}
              </strong>
            </article>
            <article className="hired-hud__metric">
              <span className="hired-hud__metric-label">Telemetry Uptime</span>
              <strong className="hired-hud__metric-value">{uptime.toFixed(2)}%</strong>
            </article>
            <article className="hired-hud__metric">
              <span className="hired-hud__metric-label">Hired Names</span>
              <strong className="hired-hud__metric-value">{hiredUnits.length}</strong>
            </article>
          </div>

          <div className="hired-hud__ekg" aria-hidden>
            <EkgPulseLine variant="hero" traces={3} seed={17} />
          </div>

          <ul className="hired-hud__list" aria-label="Hired developers live monitor list">
            {hiredUnits.map((unit) => (
              <li key={unit.id} className="hired-hud__row">
                <span className="hired-hud__row-bay">Bay {String(unit.slot + 1).padStart(2, "0")}</span>
                <span className="hired-hud__row-name">
                  <HeartPulse
                    size={13}
                    aria-hidden
                    className={developerRedBlinkHeartClass(unit.name) || "developer-red-blink-heart"}
                  />
                  <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                </span>
                <span className="hired-hud__row-status">Heartbeat stable</span>
              </li>
            ))}
          </ul>

          <footer className="hired-hud__ticker" aria-live="polite">
            <span>LIVE FEED</span>
            <span>·</span>
            <span>{hiredUnits.length} hired developers tracked</span>
            <span>·</span>
            <span>Pulse index {formatHudPercent(pulseIndex)}</span>
            <span>·</span>
            <span>Telemetry uptime {uptime.toFixed(2)}%</span>
          </footer>
        </section>
      </div>
    </motion.div>
  );
}
