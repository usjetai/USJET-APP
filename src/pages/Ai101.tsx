import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Ai101AntiCloneProtocol from "../components/ai101/Ai101AntiCloneProtocol";
import Ai101CockpitCalibration from "../components/ai101/Ai101CockpitCalibration";
import Ai101EngineRoom, { Ai101CodeAccessButton } from "../components/ai101/Ai101EngineRoom";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import FleetCommand from "../components/fleet/FleetCommand";
import { AI101_CANONICAL_CURRICULUM } from "../data/ai101Curriculum";
import { fleetBayAccentStyle, getFleetBayAccent } from "../data/fleetBayAccents";
import { fleetManifest } from "../data/fleetManifest";
import type { FleetUnit } from "../types/fleet";
import type { Ai101CurriculumRow } from "../data/ai101GlossaryTypes";
import type { CSSProperties } from "react";

const FLEET_SORTED: readonly FleetUnit[] = [...fleetManifest].sort((a, b) => a.slot - b.slot);

function hostUnitForIndex(index: number): FleetUnit {
  return FLEET_SORTED[index % FLEET_SORTED.length]!;
}

function anchorId(code: string): string {
  return `ai101-${code.replace(/[^A-Za-z0-9_-]/g, "")}`;
}

function Ai101LessonCard({ row, index }: { row: Ai101CurriculumRow; index: number }) {
  const unit = hostUnitForIndex(index);
  const accent = getFleetBayAccent(unit.slot);
  const cardStyle = {
    ...fleetBayAccentStyle(unit.slot),
  } as CSSProperties;

  return (
    <article
      className="ai101-fleet-host-card fleet-card fleet-card--surface-runway fleet-card--bay-accent group block min-h-[12rem] w-full"
      style={cardStyle}
      aria-labelledby={`${anchorId(row.code)}-heading`}
    >
      <div className="fleet-card__glass flex h-full min-h-0 flex-col p-5 text-left">
        <header className="mb-3 border-b border-white/10 pb-3">
          <p className="fleet-card__bay-label text-[9px] font-black uppercase tracking-[0.35em] text-white/40">
            Bay {String(unit.slot + 1).padStart(2, "0")}
            <span className="fleet-card__personality text-white/50"> · {accent.personality}</span>
          </p>
          <h3
            id={`${anchorId(row.code)}-heading`}
            className="mt-2 text-base font-black uppercase italic leading-tight tracking-tight text-white sm:text-lg"
          >
            <span className="fleet-card__callsign text-[11px] font-bold tracking-[0.2em] text-cyan-200/90">
              {unit.callsign}
            </span>
            <span className="mt-1 block text-white">{unit.name}</span>
          </h3>
        </header>
        <p className="text-sm font-medium leading-relaxed text-white/75">{row.lesson}</p>
      </div>
    </article>
  );
}

export default function Ai101() {
  const location = useLocation();
  const fromSos = useMemo(() => new URLSearchParams(location.search).get("from") === "sos", [location.search]);

  const rows = AI101_CANONICAL_CURRICULUM;

  return (
    <div className="fleet-page fleet-page--runway relative">
      <div className="ai101-page page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
        <header className="ai101-page__hero mb-12 border-b border-cyan-400/15 pb-10 text-center md:mb-14">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.3em] text-cyan-300/90">
            <BookOpen size={18} className="shrink-0" aria-hidden />
            <span>Flight school</span>
            <span className="rounded-full border border-cyan-400/35 bg-cyan-500/[0.08] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-cyan-100/90 sm:text-[9px]">
              Guest curriculum
            </span>
          </div>
          <h1 className="font-aviation text-4xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            AI <span className="text-cyan-400">101</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-relaxed text-white/70">
            Canonical glossary merged from mission telemetry vocabulary and sovereign cockpit terms. Each row lists the code,
            plain-language meaning, where it appears on USJET, and a static lesson voiced by a rotating fleet host—no live
            model fan-out, just the thirty roster identities you already see on the runway.
          </p>
          {fromSos ? (
            <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-relaxed text-white/45">
              You reached this from SOS—same window, same ship: use this deck to decode the capsule before you dive back
              into line checks.
            </p>
          ) : null}
          <div className="ai101-page__code-nav mt-8 flex flex-wrap items-center justify-center gap-3">
            <Ai101CodeAccessButton />
          </div>
        </header>

        <GlassEffectContainer className="ai101-page__toc glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mb-10 px-5 py-5 sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/70">Jump links</p>
          <nav className="mt-3 flex flex-wrap gap-2" aria-label="AI 101 glossary sections">
            <Ai101CodeAccessButton className="ai101-code-access-btn--compact" />
            <Link
              to={{ pathname: "/ai-101", hash: "#ai101-partner-protocol" }}
              className="btn-glass glass-effect-interactive rounded-full border border-amber-400/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-100/85 hover:text-amber-50"
            >
              Partner
            </Link>
            {rows.map((row) => (
              <Link
                key={row.code}
                to={{ pathname: "/ai-101", hash: `#${anchorId(row.code)}` }}
                className="btn-glass glass-effect-interactive rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
              >
                {row.code}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-[11px] text-white/45">
            Prefer deep links: share <code className="text-cyan-200/80">/ai-101#ai101-COCKPIT</code> style anchors; codes
            match glossary tokens.
          </p>
        </GlassEffectContainer>

        <div className="ai101-page__grid grid grid-cols-1 gap-8 xl:grid-cols-2">
          {rows.map((row, index) => (
            <section
              key={row.code}
              id={anchorId(row.code)}
              className="ai101-page__section scroll-mt-28 sm:scroll-mt-32"
            >
              <div className="ai101-page__section-head mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-200/55">Glossary</p>
                <h2 className="mt-1 font-aviation text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
                  <span className="text-cyan-300">{row.code}</span>
                  <span className="text-white/35"> — </span>
                  <span>{row.phrase}</span>
                </h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/55">{row.meaning}</p>
              </div>
              <p className="mb-5 text-sm font-medium leading-relaxed text-white/80">{row.websiteContext}</p>
              <Ai101LessonCard row={row} index={index} />
            </section>
          ))}
        </div>

        <Ai101AntiCloneProtocol />

        <Ai101EngineRoom />

        <Ai101CockpitCalibration />

        <footer
          id="ai101-footer"
          className="ai101-page__footer mt-16 scroll-mt-28 border-t border-white/10 pt-10 text-center sm:scroll-mt-32"
        >
          <p className="mx-auto mb-6 max-w-lg text-balance text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            End of curriculum — one control, no briefing on purpose. Tap it anyway.
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <FleetCommand variant="ceremony" />
          </div>
          <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-white/35">
            <Link to="/sos" className="text-cyan-200/80 underline-offset-4 hover:underline">
              /sos
            </Link>{" "}
            for line checks ·{" "}
            <Link to="/" className="text-cyan-200/80 underline-offset-4 hover:underline">
              Fleet runway
            </Link>{" "}
            for live bays
          </p>
        </footer>
      </div>
    </div>
  );
}
