import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Radio, ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  PROTOCOL_SESSION_GREEN,
  PROTOCOL_SESSION_PROOF_INTRO,
  PROTOCOL_SESSION_PROOF_TAGLINE,
  PROTOCOL_SESSION_PROOF_TITLE,
  PROTOCOL_SESSION_RED,
  PROTOCOL_SESSION_NOTE,
  PROTOCOL_SESSION_WHY,
} from "../data/protocolSessionProof";

export default function ProtocolSessionProof() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Protocol proof · red vs green · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET Protocol button: green means your session is saved on this device; red means cookies or cache were cleared and you need to arm Protocol again.",
    );
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="protocol-proof-page page-atmosphere page-nav-offset mx-auto max-w-2xl px-4 pb-36 pt-4 sm:px-6">
      <header className="protocol-proof-page__hero text-center">
        <p className="protocol-proof-page__eyebrow">
          <ShieldCheck size={14} aria-hidden />
          {PROTOCOL_SESSION_PROOF_TAGLINE}
        </p>
        <div className="protocol-proof-page__swatches" aria-hidden>
          <span className="protocol-proof-page__swatch protocol-proof-page__swatch--red">
            <Radio size={12} />
          </span>
          <span className="protocol-proof-page__swatch protocol-proof-page__swatch--green">
            <Radio size={12} />
          </span>
        </div>
        <h1 className="protocol-proof-page__title">{PROTOCOL_SESSION_PROOF_TITLE}</h1>
        <p className="protocol-proof-page__intro">{PROTOCOL_SESSION_PROOF_INTRO}</p>
      </header>

      <GlassEffectContainer className="protocol-proof-page__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="protocol-proof-page__inner">
          <article className="protocol-proof-page__card protocol-proof-page__card--green">
            <h2>{PROTOCOL_SESSION_GREEN.heading}</h2>
            <p>{PROTOCOL_SESSION_GREEN.body}</p>
          </article>

          <article className="protocol-proof-page__card protocol-proof-page__card--red">
            <h2>{PROTOCOL_SESSION_RED.heading}</h2>
            <p>{PROTOCOL_SESSION_RED.body}</p>
          </article>

          {PROTOCOL_SESSION_WHY.map((block) => (
            <section key={block.heading} className="protocol-proof-page__section">
              <h3 className="protocol-proof-page__section-title">{block.heading}</h3>
              <p>{block.body}</p>
            </section>
          ))}

          <p className="protocol-proof-page__note">{PROTOCOL_SESSION_NOTE}</p>
        </div>
      </GlassEffectContainer>

      <p className="protocol-proof-page__back">
        <Link to="/" className="protocol-proof-page__link">
          ← Back to Homes
        </Link>
      </p>
    </div>
  );
}
