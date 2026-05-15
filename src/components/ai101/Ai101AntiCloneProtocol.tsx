import { AlertTriangle, Sparkles, UserRound } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  AI101_PARTNER_ALERT_LABEL,
  AI101_PARTNER_EYEBROW,
  AI101_PARTNER_FOUNDER_LABEL,
  AI101_PARTNER_FOUNDER_NOTE,
  AI101_PARTNER_LEDE,
  AI101_PARTNER_TEACHINGS,
  AI101_PARTNER_TITLE,
} from "../../data/ai101AntiCloneProtocol";

function PartnershipStarsGraphic() {
  return (
    <div className="ai101-partner__stars" aria-hidden>
      <svg viewBox="0 0 280 120" className="ai101-partner__stars-svg" role="presentation">
        <defs>
          <linearGradient id="ai101-human-star" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.95)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.7)" />
          </linearGradient>
          <linearGradient id="ai101-ai-star" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.95)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.75)" />
          </linearGradient>
        </defs>
        <path
          d="M 70 28 L 78 52 L 104 52 L 83 66 L 91 92 L 70 78 L 49 92 L 57 66 L 36 52 L 62 52 Z"
          fill="url(#ai101-human-star)"
          className="ai101-partner__star ai101-partner__star--human"
        />
        <path
          d="M 210 28 L 218 52 L 244 52 L 223 66 L 231 92 L 210 78 L 189 92 L 197 66 L 176 52 L 202 52 Z"
          fill="url(#ai101-ai-star)"
          className="ai101-partner__star ai101-partner__star--ai"
        />
        <path
          d="M 108 60 Q 140 42 172 60"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle cx="140" cy="48" r="3" fill="rgba(255,255,255,0.35)" />
      </svg>
      <div className="ai101-partner__stars-labels">
        <span className="ai101-partner__stars-label ai101-partner__stars-label--human">
          <UserRound size={12} aria-hidden />
          Human · vision
        </span>
        <span className="ai101-partner__stars-label ai101-partner__stars-label--ai">
          <Sparkles size={12} aria-hidden />
          AI · logic
        </span>
      </div>
    </div>
  );
}

export default function Ai101AntiCloneProtocol() {
  return (
    <section
      id="ai101-partner-protocol"
      className="ai101-partner scroll-mt-28 sm:scroll-mt-32"
      aria-labelledby="ai101-partner-heading"
    >
      <GlassEffectContainer className="ai101-partner__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan ai101-partner__shell--alert">
        <div className="ai101-partner__inner">
          <div className="ai101-partner__alert-strip" role="note">
            <AlertTriangle size={14} aria-hidden />
            <span>{AI101_PARTNER_ALERT_LABEL}</span>
          </div>

          <header className="ai101-partner__header">
            <p className="ai101-partner__eyebrow">{AI101_PARTNER_EYEBROW}</p>
            <h2 id="ai101-partner-heading" className="ai101-partner__title">
              {AI101_PARTNER_TITLE}
            </h2>
            <p className="ai101-partner__lede">{AI101_PARTNER_LEDE}</p>
          </header>

          <div className="ai101-partner__layout">
            <PartnershipStarsGraphic />

            <ul className="ai101-partner__teachings">
              {AI101_PARTNER_TEACHINGS.map((item) => (
                <li key={item.id} className="ai101-partner__teaching">
                  <h3 className="ai101-partner__teaching-title">{item.title}</h3>
                  <p className="ai101-partner__teaching-body">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="ai101-partner__founder" aria-label={AI101_PARTNER_FOUNDER_LABEL}>
            <p className="ai101-partner__founder-label">{AI101_PARTNER_FOUNDER_LABEL}</p>
            <blockquote className="ai101-partner__founder-quote">{AI101_PARTNER_FOUNDER_NOTE}</blockquote>
          </aside>
        </div>
      </GlassEffectContainer>
    </section>
  );
}
