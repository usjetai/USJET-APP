import { Link } from "react-router-dom";
import { ShieldCheck, Terminal, BookOpen } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import "./RigHero.css";

/**
 * RigHero — instrument-panel hero for the Operator's Rig homepage.
 * Replaces <HomesHero /> on "/". HomesHero.tsx is left in place, unused,
 * so this can be reverted by swapping the import back in Hangar.tsx.
 */

function handleReserveClick(placement: string) {
  trackEvent("reserve_click", { placement });
}

const TRUST_POINTS = [
  "Runs entirely on the machine on your desk — no cloud model in the loop.",
  "Client files, case notes, patient records — nothing you feed it is sent to a model provider.",
  "Ships tested and configured. Plug in, run one command, done.",
];

export default function RigHero() {
  return (
    <section className="rig-hero">
      {/* HERO */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-14 px-6 py-16 md:grid-cols-2 md:gap-10 md:px-16 md:py-24">
        {/* Left column */}
        <div className="flex flex-col justify-center gap-7">
          <div className="eyebrow text-[12.5px] text-[#6FB2E4]">
            USJET · OPERATOR&rsquo;S RIG · NEW YORK
          </div>
          <h1 className="display text-[52px] leading-[1.03] text-[#F2F5F7] md:text-[68px]">
            The AI runs
            <br />
            on your desk.
          </h1>
          <div className="h-[3px] w-16 bg-[#E9A13B]" />
          <p className="max-w-[520px] text-[18px] leading-[1.65] text-[#9FB3C6]">
            A Mac mini that arrives with a local model already installed,
            configured and talking — for the files you&rsquo;d never paste
            into a chatbot. Nothing you feed it leaves the room.
          </p>
          <div className="mt-2 flex flex-col items-start gap-3">
            <Link
              to="/waiting-list"
              onClick={() => handleReserveClick("hero")}
              className="cta rounded-sm px-7 py-4 text-[17px]"
            >
              JOIN THE WAITING LIST
            </Link>
            <span className="eyebrow text-[11.5px] text-[#5C7691]">
              usjet.ai/waiting-list
            </span>
          </div>
        </div>

        {/* Right column — "watch it answer" demo panel */}
        <div className="flex items-center">
          <div className="w-full rounded-sm border border-[#1E4670] bg-[#0C2540] p-7 md:p-8">
            <div className="eyebrow mb-4 text-[11.5px] text-[#6FB2E4]">
              WATCH IT ANSWER
            </div>

            <div className="rounded-sm border border-[#16385C] bg-[#08182B] p-5">
              <div className="font-mono text-[14px] leading-relaxed text-[#C3CAD1]">
                Summarize this client&rsquo;s intake form
                <span className="chat-cursor" />
              </div>

              <div className="think-row mt-5">
                <span className="think-dot" />
                <span className="think-dot" />
                <span className="think-dot" />
                <span className="eyebrow ml-1 text-[10.5px] text-[#5C7691]">
                  WORKING ON YOUR MAC
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <div className="answer-ln" />
                <div className="answer-ln" />
                <div className="answer-ln" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-sm border border-[#E9A13B] bg-[rgba(233,161,59,0.06)] px-4 py-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E9A13B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                <line x1="3" y1="3" x2="21" y2="21" />
              </svg>
              <span className="text-[13.5px] text-[#F2E4C8]">
                Never sent to the internet — not once.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 border-t border-[#14283F] px-6 py-14 md:grid-cols-3 md:px-16">
        {TRUST_POINTS.map((point, i) => {
          const Icon = [ShieldCheck, Terminal, BookOpen][i];
          return (
            <div key={point} className="flex items-start gap-3">
              <Icon size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#E9A13B]" />
              <p className="text-[14.5px] leading-[1.6] text-[#9FB3C6]">{point}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
