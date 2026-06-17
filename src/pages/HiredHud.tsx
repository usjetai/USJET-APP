import { useEffect, useMemo, useState } from "react";
import { Activity, Footprints, Fuel, Heart, HeartPulse, Moon, Radar } from "lucide-react";
import { motion } from "framer-motion";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import HiredHudDeveloperAvatar from "../components/hiredHud/HiredHudDeveloperAvatar";
import HiredHudDeveloperLogo from "../components/hiredHud/HiredHudDeveloperLogo";
import HiredHudJetRadar from "../components/hiredHud/HiredHudJetRadar";
import DirectFuelCashButton from "../components/fuel/DirectFuelCashButton";
import EkgPulseLine from "../components/intel/EkgPulseLine";
import { fleetManifest } from "../data/fleetManifest";
import { getFleetDisplayAircraftType } from "../data/fleetRoster";
import { HIRED_HUD_TILE_BG } from "../data/hiredHudAssets";
import { getHiredDeveloperUnits } from "../data/fleetRoster";
import { developerRedBlinkHeartClass } from "../lib/developerRedBlink";
import {
  driftDailySteps,
  formatDailySteps,
  loadHiredHudDailySteps,
  saveHiredHudDailySteps,
} from "../lib/hiredHudDailySteps";
import {
  averageSleepMinutes,
  formatSleepTime,
  loadHiredHudSleepTime,
} from "../lib/hiredHudSleepTime";
import {
  averageFuelPercent,
  driftLowFuelReading,
  formatFuelDollars,
  randomLowFuelReading,
  totalFuelDollars,
  type DeveloperFuelReading,
} from "../lib/hiredHudFuelMeter";

function formatHudPercent(value: number): string {
  return `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;
}

function formatTickerClock(date: Date): string {
  return date.toLocaleTimeString([], { hour12: false });
}

function randomDeveloperBpm(): number {
  return Math.floor(68 + Math.random() * 12);
}

function randomDeveloperSpo2(): number {
  return Math.round((96 + Math.random() * 2.5) * 10) / 10;
}

function randomDeveloperPressure(): number {
  return Math.floor(64 + Math.random() * 14);
}

export default function HiredHud() {
  const hiredUnits = useMemo(() => getHiredDeveloperUnits(fleetManifest), []);
  const [scanPhase, setScanPhase] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(1.18);
  const [uptime, setUptime] = useState(99.62);
  const [clock, setClock] = useState(() => new Date());
  const [developerBpm, setDeveloperBpm] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      getHiredDeveloperUnits(fleetManifest).map((unit) => [unit.slot, randomDeveloperBpm()]),
    ),
  );
  const [developerSpo2, setDeveloperSpo2] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      getHiredDeveloperUnits(fleetManifest).map((unit) => [unit.slot, randomDeveloperSpo2()]),
    ),
  );
  const [developerPressure, setDeveloperPressure] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      getHiredDeveloperUnits(fleetManifest).map((unit) => [unit.slot, randomDeveloperPressure()]),
    ),
  );
  const [developerSteps, setDeveloperSteps] = useState<Record<number, number>>(() =>
    loadHiredHudDailySteps(getHiredDeveloperUnits(fleetManifest).map((unit) => unit.slot)),
  );
  const [developerSleep] = useState<Record<number, number>>(() =>
    loadHiredHudSleepTime(getHiredDeveloperUnits(fleetManifest).map((unit) => unit.slot)),
  );
  const [developerFuel, setDeveloperFuel] = useState<Record<number, DeveloperFuelReading>>(() =>
    Object.fromEntries(
      getHiredDeveloperUnits(fleetManifest).map((unit) => [unit.slot, randomLowFuelReading(unit.slot)]),
    ),
  );
  const [activeLove, setActiveLove] = useState(false);

  const fleetDailySteps = useMemo(
    () => hiredUnits.reduce((total, unit) => total + (developerSteps[unit.slot] ?? 0), 0),
    [developerSteps, hiredUnits],
  );
  const fleetAvgSleep = useMemo(
    () => formatSleepTime(averageSleepMinutes(developerSleep, hiredUnits.map((unit) => unit.slot))),
    [developerSleep, hiredUnits],
  );
  const fleetFuelReserve = useMemo(
    () => totalFuelDollars(developerFuel, hiredUnits.map((unit) => unit.slot)),
    [developerFuel, hiredUnits],
  );
  const fleetFuelPercent = useMemo(
    () => averageFuelPercent(developerFuel, hiredUnits.map((unit) => unit.slot)),
    [developerFuel, hiredUnits],
  );

  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;

      setClock(new Date());
      setScanPhase((phase) => (phase + 1) % 100);
    };

    const metricsTick = () => {
      if (document.hidden) return;

      setPulseIndex((value) => {
        const drift = (Math.random() - 0.47) * 0.24;
        return Math.max(-3.75, Math.min(5.9, value + drift));
      });
      setUptime((value) => {
        const drift = (Math.random() - 0.5) * 0.08;
        return Math.max(97.8, Math.min(100, value + drift));
      });
    };

    const bpmTick = () => {
      if (document.hidden) return;

      setDeveloperBpm((prev) => {
        const next = { ...prev };
        for (const unit of hiredUnits) {
          const current = next[unit.slot] ?? randomDeveloperBpm();
          const drift = Math.round((Math.random() - 0.5) * 2);
          next[unit.slot] = Math.max(62, Math.min(88, current + drift));
        }
        return next;
      });
      setDeveloperSpo2((prev) => {
        const next = { ...prev };
        for (const unit of hiredUnits) {
          const current = next[unit.slot] ?? randomDeveloperSpo2();
          const drift = (Math.random() - 0.5) * 0.3;
          next[unit.slot] = Math.round(Math.max(95, Math.min(99, current + drift)) * 10) / 10;
        }
        return next;
      });
      setDeveloperPressure((prev) => {
        const next = { ...prev };
        for (const unit of hiredUnits) {
          const current = next[unit.slot] ?? randomDeveloperPressure();
          const drift = Math.round((Math.random() - 0.5) * 3);
          next[unit.slot] = Math.max(62, Math.min(82, current + drift));
        }
        return next;
      });
      setDeveloperSteps((prev) => {
        const next = { ...prev };
        for (const unit of hiredUnits) {
          const current = next[unit.slot] ?? 0;
          next[unit.slot] = driftDailySteps(current);
        }
        saveHiredHudDailySteps(next);
        return next;
      });
      setDeveloperFuel((prev) => {
        const next = { ...prev };
        for (const unit of hiredUnits) {
          const current = next[unit.slot] ?? randomLowFuelReading(unit.slot);
          next[unit.slot] = driftLowFuelReading(current);
        }
        return next;
      });
    };

    const tickerId = window.setInterval(tick, 1000);
    const metricsId = window.setInterval(metricsTick, 2200);
    const bpmId = window.setInterval(bpmTick, 1600);

    return () => {
      window.clearInterval(tickerId);
      window.clearInterval(metricsId);
      window.clearInterval(bpmId);
    };
  }, [hiredUnits]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hired-hud-page relative">
      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto w-full max-w-[94rem] px-4 pb-24 sm:px-6 lg:px-8">
        <section
          className={[
            "hired-hud glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan",
            activeLove ? "hired-hud--active-love" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
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
              <div className="hired-hud__fuel">
                <DirectFuelCashButton variant="compact" />
              </div>
              <button
                type="button"
                className={[
                  "hired-hud__love-toggle btn-glass glass-effect-interactive",
                  activeLove ? "hired-hud__love-toggle--on" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={activeLove}
                aria-label={activeLove ? "Turn active love off" : "Turn active love on"}
                onClick={() => setActiveLove((on) => !on)}
              >
                <Heart size={14} aria-hidden fill={activeLove ? "currentColor" : "none"} />
                <span>{activeLove ? "Active love ON" : "Active love OFF"}</span>
              </button>
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
            <article className="hired-hud__metric hired-hud__metric--steps">
              <span className="hired-hud__metric-label">
                <Footprints size={11} aria-hidden />
                Daily Step Counter
              </span>
              <strong className="hired-hud__metric-value hired-hud__metric-value--steps">
                {formatDailySteps(fleetDailySteps)}
              </strong>
            </article>
            <article className="hired-hud__metric hired-hud__metric--sleep">
              <span className="hired-hud__metric-label">
                <Moon size={11} aria-hidden />
                Sleep Time
              </span>
              <strong className="hired-hud__metric-value hired-hud__metric-value--sleep">{fleetAvgSleep}</strong>
            </article>
            <article className="hired-hud__metric hired-hud__metric--fuel">
              <span className="hired-hud__metric-label">
                <Fuel size={11} aria-hidden />
                Fleet Fuel Reserve
              </span>
              <strong className="hired-hud__metric-value hired-hud__metric-value--fuel">
                {formatFuelDollars(fleetFuelReserve)}
              </strong>
              <span className="hired-hud__metric-subvalue">{fleetFuelPercent.toFixed(1)}% avg</span>
            </article>
          </div>

          <div className="hired-hud__hub" aria-label="Hired developer hub">
            <div className="hired-hud__ekg-monitor" aria-label="Fleet heart monitor">
              <div className="hired-hud__ekg-monitor-head">
                <span className="hired-hud__ekg-monitor-title">
                  <HeartPulse size={13} aria-hidden />
                  Heart Monitor
                </span>
                <span className="hired-hud__ekg-monitor-tag">Trace live</span>
              </div>
              <div className="hired-hud__ekg" aria-hidden>
                <EkgPulseLine variant="hero" traces={3} seed={17} />
              </div>
            </div>

            <div className="hired-hud__crew" aria-label="Hired developer profile crew">
              <div className="hired-hud__crew-head">
                <span className="hired-hud__crew-title">Hired crew profiles</span>
                <span className="hired-hud__crew-count">{hiredUnits.length} sovereign hired crew profiles</span>
              </div>
              <ul className="hired-hud__crew-list">
                {hiredUnits.map((unit) => (
                  <li key={`crew-${unit.id}`} className="hired-hud__crew-item">
                    <HiredHudDeveloperAvatar slot={unit.slot} name={unit.name} variant="crew" />
                    <span className="hired-hud__crew-name">
                      <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                    </span>
                    <span className="hired-hud__crew-bay">Bay {String(unit.slot + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="hired-hud__list" aria-label="Hired developers live monitor list">
            {hiredUnits.map((unit, rosterIndex) => {
              const bpm = developerBpm[unit.slot] ?? 72;
              const spo2 = developerSpo2[unit.slot]?.toFixed(1) ?? "97.0";
              const pressure = developerPressure[unit.slot] ?? 72;
              const steps = developerSteps[unit.slot] ?? 0;
              const sleepMinutes = developerSleep[unit.slot] ?? 0;
              const sleepLabel = formatSleepTime(sleepMinutes);
              const fuel = developerFuel[unit.slot] ?? randomLowFuelReading(unit.slot);
              const fuelLabel = formatFuelDollars(fuel.dollars);
              const aircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
              const tileScan = (scanPhase + unit.slot * 13) % 100;

              return (
              <li
                key={unit.id}
                className={["hired-hud__tile", activeLove ? "hired-hud__tile--active-love" : ""]
                  .filter(Boolean)
                  .join(" ")}
                style={{ ["--hired-hud-logo-phase" as string]: `${rosterIndex * 0.35}s` }}
              >
                <div className="hired-hud__tile-hud" aria-hidden>
                  <div
                    className="hired-hud__tile-hud-bg"
                    style={{ backgroundImage: `url("${HIRED_HUD_TILE_BG}")` }}
                  />
                  <span
                    className="hired-hud__tile-scanline"
                    style={{ transform: `translateY(${tileScan}%)` }}
                  />
                  <div className="hired-hud__tile-hud-readings">
                    <span className="hired-hud__tile-hud-label">Cardio unit</span>
                    <span className="hired-hud__tile-hud-bpm">{bpm} BPM</span>
                    <span className="hired-hud__tile-hud-spo2">SpO2 {spo2}%</span>
                    <span className="hired-hud__tile-hud-pressure">Pressure {pressure}%</span>
                    <span className="hired-hud__tile-hud-steps">{formatDailySteps(steps)} steps</span>
                    <span className="hired-hud__tile-hud-sleep">Sleep {sleepLabel}</span>
                    <span className="hired-hud__tile-hud-fuel">Fuel {fuelLabel}</span>
                    <div className="hired-hud__tile-hud-fuel-meter" aria-hidden>
                      <span
                        className="hired-hud__tile-hud-fuel-meter-fill"
                        style={{ width: `${fuel.percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="hired-hud__tile-logo-wrap">
                    <HiredHudDeveloperLogo slot={unit.slot} aircraftType={aircraftType} variant="hud" />
                  </div>
                </div>

                <div className="hired-hud__tile-radar-wrap" aria-hidden>
                  <HiredHudJetRadar slot={unit.slot} aircraftType={aircraftType} variant="hub-tile" />
                </div>

                <div className="hired-hud__tile-content">
                  <div className="hired-hud__tile-profile">
                    <HiredHudDeveloperAvatar slot={unit.slot} name={unit.name} variant="tile" />
                  </div>
                  <span className="hired-hud__row-bay">
                    <HiredHudDeveloperLogo slot={unit.slot} aircraftType={aircraftType} variant="badge" />
                    Bay {String(unit.slot + 1).padStart(2, "0")}
                  </span>
                  <span className="hired-hud__row-name">
                    <HeartPulse
                      size={13}
                      aria-hidden
                      className={[
                        developerRedBlinkHeartClass(unit.name) || "developer-red-blink-heart",
                        activeLove ? "hired-hud__row-heart--love" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                    <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                  </span>
                  <div className="hired-hud__row-vitals">
                    <span className="hired-hud__row-bpm" aria-label={`${bpm} beats per minute`}>
                      {bpm} BPM
                    </span>
                    <span className="hired-hud__row-spo2" aria-label={`Blood oxygen ${spo2} percent`}>
                      SpO2 {spo2}%
                    </span>
                    <span className="hired-hud__row-steps" aria-label={`${steps} daily steps`}>
                      <Footprints size={11} aria-hidden />
                      {formatDailySteps(steps)}
                    </span>
                    <span className="hired-hud__row-sleep" aria-label={`Sleep time ${sleepLabel}`}>
                      <Moon size={11} aria-hidden />
                      {sleepLabel}
                    </span>
                    <div
                      className="hired-hud__row-fuel"
                      aria-label={`Fuel reserve ${fuelLabel}, ${fuel.percent} percent`}
                    >
                      <Fuel size={11} aria-hidden />
                      <span className="hired-hud__row-fuel-copy">
                        <span className="hired-hud__row-fuel-amount">{fuelLabel}</span>
                        <span className="hired-hud__row-fuel-percent">{fuel.percent}%</span>
                      </span>
                      <span className="hired-hud__row-fuel-track" aria-hidden>
                        <span
                          className="hired-hud__row-fuel-fill"
                          style={{ width: `${fuel.percent}%` }}
                        />
                      </span>
                    </div>
                    <div className="hired-hud__row-monitor" aria-label={`EKG monitor for ${unit.name}`}>
                      <span className="hired-hud__row-monitor-label" aria-hidden>
                        EKG
                      </span>
                      <EkgPulseLine
                        variant="monitor"
                        traces={2}
                        seed={unit.slot * 11 + 3}
                        className="hired-hud__row-ekg"
                      />
                    </div>
                  </div>
                  <span className="hired-hud__row-status">
                    {activeLove ? (
                      <>
                        <Heart size={11} aria-hidden className="hired-hud__row-love-icon" fill="currentColor" />
                        Active love
                      </>
                    ) : (
                      "Heartbeat stable"
                    )}
                  </span>
                </div>
              </li>
            );
            })}
          </ul>
          </div>

          <footer className="hired-hud__ticker" aria-live="polite">
            <span>LIVE FEED</span>
            <span>·</span>
            <span>{hiredUnits.length} hired developers tracked</span>
            <span>·</span>
            <span>Pulse index {formatHudPercent(pulseIndex)}</span>
            <span>·</span>
            <span>Telemetry uptime {uptime.toFixed(2)}%</span>
            <span>·</span>
            <span>Daily steps {formatDailySteps(fleetDailySteps)}</span>
            <span>·</span>
            <span>Avg sleep {fleetAvgSleep}</span>
            <span>·</span>
            <span>Fleet fuel {formatFuelDollars(fleetFuelReserve)}</span>
            {activeLove ? (
              <>
                <span>·</span>
                <span className="hired-hud__ticker-love">Active love signal engaged</span>
              </>
            ) : null}
          </footer>
        </section>
      </div>
    </motion.div>
  );
}
