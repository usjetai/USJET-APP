import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { AI101_GLOSSARY_ENTRIES } from "../data/ai101Acronyms";
import { TELEMETRY_ACRONYM_BY_CODE, telemetryAbbrTitle } from "../data/telemetryAcronyms";

const Ai101 = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:px-8"
  >
    <header className="mb-12 text-center">
      <div className="mb-4 inline-flex items-center gap-2 font-black uppercase tracking-[0.28em] text-cyan-300/90">
        <GraduationCap size={18} className="shrink-0" aria-hidden />
        <span>Operating manual</span>
      </div>
      <h1 className="font-aviation text-4xl font-black uppercase italic leading-tight tracking-tighter text-white sm:text-5xl">
        AI <span className="text-cyan-400">101</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
        Not a help desk — the institutional primer for sovereign operators
      </p>
      <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/70">
        Read this like a preflight: clarity beats cleverness, one AI thread beats ten silent forks, and every acronym
        on your strip should decode to a real object in the ship. Public dispatches continue on the{" "}
        <Link to="/blog" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
          Blog
        </Link>
        .
      </p>
    </header>

    <section className="mb-10" aria-labelledby="ai101-basics-heading">
      <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan p-6 sm:p-8">
        <h2 id="ai101-basics-heading" className="font-aviation text-xl font-black uppercase italic text-white">
          Cockpit habits
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-white/75 marker:text-cyan-400/80">
          <li>Give the model one job per message—scope creep in the prompt becomes scope creep in the log.</li>
          <li>Keep human-owned names for projects and threads; the AI should inherit your vocabulary, not invent a new one each session.</li>
          <li>
            When you are cleared into Member Portal, Mission Projects and{" "}
            <abbr
              className="cursor-help underline decoration-dotted decoration-white/25 underline-offset-2"
              title={telemetryAbbrTitle(TELEMETRY_ACRONYM_BY_CODE["SFK"])}
            >
              SFK
            </abbr>{" "}
            are the instruments—read them before you add another parallel session.
          </li>
        </ul>
      </GlassEffectContainer>
    </section>

    <section aria-labelledby="ai101-acronyms-heading">
      <h2 id="ai101-acronyms-heading" className="mb-4 font-aviation text-lg font-black uppercase italic tracking-wide text-white/90">
        Naming data with acronyms
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-white/70">
        Instrument codes are written as continuous uppercase letters — no periods between characters (use{" "}
        <span className="font-mono text-cyan-200/95">TSOB</span>, not T.S.O.B.). One code maps to one definition on
        the strip; if a metric does not exist yet, it stays reserved instead of overloading the same letters.
      </p>
      <p className="mb-6 text-sm leading-relaxed text-white/70">
        Below are shorthands used in USJET copy and member intelligence surfaces; use them as discipline examples when
        you label folders, chat titles, and checklist columns.
      </p>

      <dl className="space-y-4">
        {AI101_GLOSSARY_ENTRIES.map((row) => (
          <GlassEffectContainer
            key={row.code}
            className="glass-effect glass-effect--rounded-rect liquid-glass-background p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="font-mono text-base font-black tracking-[0.12em] text-cyan-200">
                <abbr title={telemetryAbbrTitle(row)} className="no-underline">
                  {row.code}
                </abbr>
                {row.reserved ? (
                  <span className="ml-2 align-middle text-[0.65rem] font-bold uppercase tracking-wider text-amber-200/80">
                    Reserved
                  </span>
                ) : null}
              </dt>
              <dd className="text-sm font-semibold text-white/90">{row.fullName}</dd>
            </div>
            {row.unit ? (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/40">Unit: {row.unit}</p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-white/65">{row.shortDescription}</p>
          </GlassEffectContainer>
        ))}
      </dl>
    </section>
  </motion.div>
);

export default Ai101;
