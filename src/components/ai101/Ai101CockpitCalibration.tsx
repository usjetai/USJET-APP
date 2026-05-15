import { useCallback, useState } from "react";
import { Gauge, RefreshCw, Settings, Shield, Zap } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  AI101_CALIBRATION_EYEBROW,
  AI101_CALIBRATION_LEDE,
  AI101_CALIBRATION_STEPS,
  AI101_CALIBRATION_TITLE,
  AI101_DIAGNOSTICS_BUTTON,
  AI101_DIAGNOSTICS_RUNNING,
} from "../../data/ai101CockpitCalibration";

type DiagnosticStatus = "idle" | "running" | "green" | "action";

type DiagnosticReport = {
  online: boolean;
  browserLabel: string;
  connectionHint: string;
  checks: { label: string; ok: boolean }[];
};

function iconForStep(icon: (typeof AI101_CALIBRATION_STEPS)[number]["icon"]) {
  switch (icon) {
    case "refresh":
      return RefreshCw;
    case "shield":
      return Shield;
    case "zap":
      return Zap;
    case "gear":
    default:
      return Settings;
  }
}

function parseBrowserLabel(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) {
    return "Microsoft Edge";
  }
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    return "Google Chrome";
  }
  if (ua.includes("Firefox/")) {
    return "Mozilla Firefox";
  }
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    return "Apple Safari";
  }
  return "Browser";
}

function runCockpitDiagnostics(): DiagnosticReport {
  const online = typeof navigator.onLine === "boolean" ? navigator.onLine : true;
  const browserLabel = parseBrowserLabel();

  const connection = navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  const effectiveType = connection.connection?.effectiveType ?? "unknown";
  const connectionHint =
    effectiveType === "4g" || effectiveType === "3g"
      ? `Connection: ${effectiveType} — stable for streaming`
      : effectiveType === "slow-2g" || effectiveType === "2g"
        ? "Connection: slow — move to stronger Wi‑Fi or ethernet"
        : `Connection: ${effectiveType} — verify bandwidth for AI streaming`;

  const memoryOk =
    typeof connection.deviceMemory !== "number" || connection.deviceMemory >= 4;
  const coresOk =
    typeof connection.hardwareConcurrency !== "number" || connection.hardwareConcurrency >= 4;

  const checks = [
    { label: "Network online", ok: online },
    { label: browserLabel, ok: true },
    { label: connectionHint, ok: online && effectiveType !== "slow-2g" && effectiveType !== "2g" },
    { label: "Device memory ≥ 4 GB (when reported)", ok: memoryOk },
    { label: "CPU cores ≥ 4 (when reported)", ok: coresOk },
  ];

  return { online, browserLabel, connectionHint, checks };
}

export default function Ai101CockpitCalibration() {
  const [openId, setOpenId] = useState<string | null>(AI101_CALIBRATION_STEPS[0]?.id ?? null);
  const [diagStatus, setDiagStatus] = useState<DiagnosticStatus>("idle");
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  const runDiagnostics = useCallback(() => {
    setDiagStatus("running");
    setReport(null);

    window.setTimeout(() => {
      const result = runCockpitDiagnostics();
      setReport(result);
      const allOk = result.checks.every((check) => check.ok);
      setDiagStatus(allOk && result.online ? "green" : "action");
    }, 650);
  }, []);

  return (
    <section
      id="ai101-calibration"
      className="ai101-calibration scroll-mt-28 sm:scroll-mt-32"
      aria-labelledby="ai101-calibration-heading"
    >
      <GlassEffectContainer className="ai101-calibration__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="ai101-calibration__inner">
          <header className="ai101-calibration__header">
            <p className="ai101-calibration__eyebrow">{AI101_CALIBRATION_EYEBROW}</p>
            <h2 id="ai101-calibration-heading" className="ai101-calibration__title">
              {AI101_CALIBRATION_TITLE}
            </h2>
            <p className="ai101-calibration__lede">{AI101_CALIBRATION_LEDE}</p>
          </header>

          <div className="ai101-calibration__accordion" role="region" aria-label="Troubleshooting steps">
            {AI101_CALIBRATION_STEPS.map((step) => {
              const Icon = iconForStep(step.icon);
              const expanded = openId === step.id;
              return (
                <div
                  key={step.id}
                  className={["ai101-calibration__panel", expanded ? "ai101-calibration__panel--open" : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <button
                    type="button"
                    className="ai101-calibration__trigger glass-effect-interactive"
                    aria-expanded={expanded}
                    onClick={() => setOpenId(expanded ? null : step.id)}
                  >
                    <span className="ai101-calibration__trigger-icon" aria-hidden>
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <span className="ai101-calibration__trigger-text">
                      <span className="ai101-calibration__trigger-title">{step.title}</span>
                      <span className="ai101-calibration__trigger-sub">{step.subtitle}</span>
                    </span>
                  </button>
                  {expanded ? (
                    <div className="ai101-calibration__body">
                      <p className="ai101-calibration__issue">
                        <strong>Issue:</strong> {step.issue}
                      </p>
                      <p className="ai101-calibration__fix-label">The fix</p>
                      <ul className="ai101-calibration__fixes">
                        {step.fixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="ai101-calibration__diagnostics">
            <button
              type="button"
              className="ai101-calibration__diag-btn btn-glass-prominent glass-effect-interactive"
              onClick={runDiagnostics}
              disabled={diagStatus === "running"}
            >
              <Gauge size={18} aria-hidden />
              {diagStatus === "running" ? AI101_DIAGNOSTICS_RUNNING : AI101_DIAGNOSTICS_BUTTON}
            </button>

            {diagStatus !== "idle" && report ? (
              <div
                className={[
                  "ai101-calibration__diag-result",
                  diagStatus === "green" ? "ai101-calibration__diag-result--green" : "",
                  diagStatus === "action" ? "ai101-calibration__diag-result--action" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="status"
                aria-live="polite"
              >
                <p className="ai101-calibration__diag-status">
                  {diagStatus === "green" ? "System green" : "Action required"}
                </p>
                <ul className="ai101-calibration__diag-list">
                  {report.checks.map((check) => (
                    <li key={check.label} className={check.ok ? "ai101-calibration__diag-ok" : "ai101-calibration__diag-warn"}>
                      {check.ok ? "✓" : "!"} {check.label}
                    </li>
                  ))}
                </ul>
                {diagStatus === "action" ? (
                  <p className="ai101-calibration__diag-hint">
                    Apply the calibrations above — hard refresh, whitelist USJET.AI, enable GPU acceleration, then
                    re-run diagnostics.
                  </p>
                ) : (
                  <p className="ai101-calibration__diag-hint">Cockpit environment reads stable. Proceed to fleet ops.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </GlassEffectContainer>
    </section>
  );
}
