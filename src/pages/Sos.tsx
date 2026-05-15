import { motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, LifeBuoy } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { stripeCheckoutCockpitPath } from "../lib/stripeCockpitHandoff";

const SOS_META_DESCRIPTION =
  "USJET SOS — site operating support: deck-by-deck orientation, Stripe Member clearance, cockpit handoffs, and sovereign fleet navigation.";

const TABS = [
  { id: "members", label: "Members" },
  { id: "fleet", label: "Fleet" },
  { id: "hangar", label: "Hangar" },
  { id: "intel", label: "Intel" },
  { id: "founder", label: "Founder" },
  { id: "origin", label: "Origin" },
  { id: "cockpit", label: "Cockpit" },
  { id: "learn", label: "Learn" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function tabPanelCopy(id: TabId): { title: string; body: JSX.Element } {
  switch (id) {
    case "members":
      return {
        title: "Members — identity and clearance",
        body: (
          <>
            <p>
              USJET does not use social or OAuth sign-in. You verify with your{" "}
              <strong className="font-semibold text-white">Member ID</strong> and{" "}
              <strong className="font-semibold text-white">Stripe-issued subscription status</strong> only. Start
              or refresh verification on{" "}
              <Link to="/member/login" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Member Login
              </Link>
              .
            </p>
            <p>
              The{" "}
              <Link to="/member" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Member Portal
              </Link>{" "}
              requires <strong className="font-semibold text-white">Flight Pass</strong> clearance or higher. If
              you are not cleared, the gate explains the tier and offers Stripe checkout inside the ship (cockpit
              handoff), not a new browser tab.
            </p>
            <p>
              Inside the portal, <strong className="font-semibold text-white">Mission Projects</strong> let you group
              work: you can name projects, attach fleet copilots, and keep a running record of how attention is spent.
              Session forks and focused time are{" "}
              <strong className="font-semibold text-white">telemetry</strong>—continuity signals for your own
              operations, not a scoreboard.
            </p>
            <p className="text-sm text-white/55">
              Upgrade paths (same-window):{" "}
              <Link
                to={stripeCheckoutCockpitPath("/member", "founder")}
                className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
              >
                Flight Pass checkout
              </Link>
              ,{" "}
              <Link
                to={stripeCheckoutCockpitPath("/member", "hangar-pro")}
                className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
              >
                Hangar Pro
              </Link>
              ,{" "}
              <Link
                to={stripeCheckoutCockpitPath("/member", "fleet-command")}
                className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
              >
                Enterprise Commander
              </Link>
              .
            </p>
          </>
        ),
      };
    case "fleet":
      return {
        title: "Fleet — home deck",
        body: (
          <>
            <p>
              <Link to="/" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Fleet
              </Link>{" "}
              is the public command deck: the networked tools, launch points, and orientation copy. Guests can use this
              surface without paid clearance.
            </p>
            <p>
              When a destination is an external partner or checkout, USJET keeps navigation inside{" "}
              <Link to="/cockpit" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Cockpit
              </Link>{" "}
              so you always return to the same ship—no raw off-site tab leaks for integrated launches.
            </p>
          </>
        ),
      };
    case "hangar":
      return {
        title: "Hangar — sovereign workbench",
        body: (
          <>
            <p>
              <Link to="/hangar" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Hangar
              </Link>{" "}
              is the multi-bay workbench for running tools side by side. It requires{" "}
              <strong className="font-semibold text-white">Flight Pass</strong> or higher.
            </p>
            <p>
              Guests without clearance still see a preview with a small number of bays; paid members unlock the full
              bay budget for their tier. If you hit a limit, close a bay or upgrade clearance—the UI will point you to
              Stripe inside the cockpit when appropriate.
            </p>
          </>
        ),
      };
    case "intel":
      return {
        title: "Intel — institutional board",
        body: (
          <>
            <p>
              <Link to="/intel" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Intel
              </Link>{" "}
              is reserved for <strong className="font-semibold text-white">Hangar Pro</strong> and{" "}
              <strong className="font-semibold text-white">Enterprise Commander</strong> clearances. Flight Pass
              members use Fleet, Hangar, and the Member Portal first; the gate explains the upgrade when Intel is locked.
            </p>
            <p className="text-sm text-white/55">
              Partnership bays stay curated museum space until sponsor deals land—expect placeholders, not live broker
              logins or paid market data feeds in this build.
            </p>
          </>
        ),
      };
    case "founder":
      return {
        title: "Founder — story and doctrine",
        body: (
          <>
            <p>
              <Link to="/founder" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Founder
              </Link>{" "}
              is a public narrative surface: origin story, visuals, and the human voice behind the hangar. No clearance
              required.
            </p>
            <p>
              For the 1995 grit vault experience (distinct visual lane), see{" "}
              <Link
                to="/founder-special-1995"
                className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
              >
                1995 Grit Vault
              </Link>{" "}
              — that route is <strong className="font-semibold text-white">Enterprise Commander</strong> only.
            </p>
          </>
        ),
      };
    case "origin":
      return {
        title: "Origin — hardware arc",
        body: (
          <>
            <p>
              <Link to="/origin" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Origin
              </Link>{" "}
              is cleared for <strong className="font-semibold text-white">Enterprise Commander</strong> subscribers.
              It covers the sovereign hardware and long-run positioning for the fleet.
            </p>
            <p>
              Customer Service may open a limited Origin entry for support flows; that path is separate from full
              command clearance.
            </p>
          </>
        ),
      };
    case "cockpit":
      return {
        title: "Cockpit — same-window handoff",
        body: (
          <>
            <p>
              <Link to="/cockpit" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Cockpit
              </Link>{" "}
              wraps external Stripe checkouts and selected fleet launches. You get a return path (ghost bar) instead of
              losing context in a detached tab.
            </p>
            <p>
              This is intentional product policy: <strong className="font-semibold text-white">one ship, one
              cockpit</strong>. Use it whenever the main deck hands you off to payment or a partner surface.
            </p>
          </>
        ),
      };
    case "learn":
      return {
        title: "Learn — Blog and AI 101",
        body: (
          <>
            <p>
              Public literacy and field notes live on{" "}
              <Link to="/blog" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                Blog
              </Link>{" "}
              and the structured primer{" "}
              <Link to="/ai-101" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
                AI 101
              </Link>
              . SOS is the broader site manual; AI 101 goes deeper on vocabulary and operating discipline.
            </p>
            <p>
              You are reading SOS now—bookmark it if you want a calm, text-first reference while flying the deck. On
              USJET, Help reads as SOS.
            </p>
          </>
        ),
      };
    default:
      return { title: "", body: <></> };
  }
}

export default function Sos() {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("members");

  const { title, body } = tabPanelCopy(active);

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;

    document.title = "SOS · USJet.ai";
    meta?.setAttribute("content", SOS_META_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) {
        meta.setAttribute("content", prevDescription);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:px-8"
    >
      <header className="mb-10 text-center sm:mb-12">
        <div className="mb-4 inline-flex items-center gap-2 font-black uppercase tracking-[0.28em] text-cyan-300/90">
          <LifeBuoy size={18} className="shrink-0" aria-hidden />
          <span>USJET bridge</span>
        </div>
        <h1 className="font-aviation text-4xl font-black uppercase italic leading-tight tracking-tighter text-white sm:text-5xl">
          <span className="text-cyan-400">SOS</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
          Site operating support.
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/70">
          Plain-language orientation for each primary deck. Tier locks reflect Stripe-verified clearance; integrated
          launches use Cockpit—never a raw off-site tab for those handoffs.
        </p>
      </header>

      <div
        className="mb-6 flex gap-1 overflow-x-auto border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="SOS manual sections"
      >
        {TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}-panel`}
              id={`${baseId}-${tab.id}-tab`}
              className={[
                "shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-[11px] font-black uppercase italic tracking-widest transition-colors sm:text-xs",
                selected
                  ? "-mb-px border-cyan-400 text-white"
                  : "border-transparent text-white/45 hover:text-white/90",
              ].join(" ")}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan p-6 sm:p-8">
        <section
          role="tabpanel"
          id={`${baseId}-${active}-panel`}
          aria-labelledby={`${baseId}-${active}-tab`}
        >
          <div className="mb-2 flex items-center gap-2 text-cyan-200/90">
            <BookOpen size={18} aria-hidden className="opacity-90" />
            <h2 className="font-aviation text-lg font-black uppercase italic tracking-tight text-white sm:text-xl">{title}</h2>
          </div>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">{body}</div>
        </section>
      </GlassEffectContainer>
    </motion.div>
  );
}
