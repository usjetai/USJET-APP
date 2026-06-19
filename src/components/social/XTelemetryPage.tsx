import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Radio, SatelliteDish, ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { INITIAL_FLIGHT_POSTS, X_PROFILE_MANIFEST } from "../../data/xFlightFeed";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

const X_WIDGET_SCRIPT_ID = "x-platform-widgets";

const X_PROFILE_COCKPIT = wrapExternalInCockpit(X_PROFILE_MANIFEST.endpoint, {
  label: X_PROFILE_MANIFEST.handle,
  returnTo: "/",
  directHandoff: true,
});

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function XTelemetryPage() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById(X_WIDGET_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      window.twttr?.widgets?.load(widgetRef.current);
      return;
    }

    const script = document.createElement("script");
    script.id = X_WIDGET_SCRIPT_ID;
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => window.twttr?.widgets?.load(widgetRef.current);
    document.body.appendChild(script);
  }, []);

  return (
    <div className="x-telemetry-page page-atmosphere page-nav-offset min-h-screen px-4 pb-28 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-5xl gap-6">
        <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan overflow-hidden p-0">
          <div className="border-b border-cyan-300/10 p-5 text-center sm:p-8">
            <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-center text-[0.65rem] font-black uppercase tracking-[0.22em] text-cyan-100">
                  <span
                    className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
                    aria-hidden
                  />
                  X telemetry live
                </p>
                <h1 className="font-aviation text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-6xl">
                  X Signal Deck
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-slate-300 sm:text-base">
                  Live profile timeline plus local command cards for fast, resilient social proof on USJET.AI.
                  The official widget stays current; the matrix below keeps the page useful if the perimeter is slow.
                </p>
              </div>

              <Link
                to={X_PROFILE_COCKPIT}
                className="btn-glass glass-effect-interactive inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
                aria-label={`Open ${X_PROFILE_MANIFEST.handle} on X`}
              >
                <XMarkIcon className="h-4 w-4" />
                Open X
                <ExternalLink size={14} aria-hidden />
              </Link>
            </div>

            <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
              {[
                ["Vector 01", "Native widget", "Free live timeline"],
                ["Vector 02", "Local matrix", "No backend dependency"],
                ["Vector 03", "API runway", "Paid backend ready"],
              ].map(([kicker, title, body]) => (
                <div
                  key={title}
                  className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/35 p-4 text-center"
                >
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-cyan-200/70">{kicker}</p>
                  <h2 className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-white">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-3">
            {INITIAL_FLIGHT_POSTS.map((post, index) => (
              <article
                key={post.id}
                className="flex min-h-56 flex-col border-t border-cyan-300/10 p-5 text-center md:border-r md:last:border-r-0"
              >
                <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-500">
                  <span>Card {String(index + 1).padStart(2, "0")}</span>
                  <span className="inline-flex items-center gap-1 text-cyan-200/80">
                    <Radio size={12} aria-hidden />
                    {post.timestamp}
                  </span>
                </div>
                <p className="m-auto max-w-sm text-sm leading-7 text-slate-200">{post.text}</p>
              </article>
            ))}
          </div>
        </GlassEffectContainer>

        <aside className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.48fr)]">
          <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan overflow-hidden p-4">
            <div
              ref={widgetRef}
              className="x-telemetry-page__timeline mx-auto flex min-h-[560px] w-full max-w-[620px] items-start justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/55 p-3"
            >
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-width="560"
                data-height="540"
                data-tweet-limit="4"
                data-chrome="noheader nofooter noborders transparent"
                data-dnt="true"
                href={`${X_PROFILE_MANIFEST.endpoint}?ref_src=twsrc%5Etfw`}
              >
                Posts by {X_PROFILE_MANIFEST.handle}
              </a>
            </div>
          </GlassEffectContainer>

          <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan p-5 text-center">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-cyan-200/70">
              Deployment posture
            </p>
            <div className="mx-auto mt-4 max-w-sm space-y-3 text-sm leading-6 text-slate-300">
              <p className="flex justify-center gap-3 text-left">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden />
                Official X widget for live updates without paid API credentials.
              </p>
              <p className="flex justify-center gap-3 text-left">
                <SatelliteDish className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden />
                Local cards remain visible even when third-party embeds are delayed or blocked.
              </p>
            </div>
          </GlassEffectContainer>
        </aside>
      </section>
    </div>
  );
}
