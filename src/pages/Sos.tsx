import { useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { SECURITY_STRIPE_ONLY_MAY_2026 } from "../data/founderManifesto";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

type SosTabId = "browser" | "audio" | "stripe";

const TABS: { id: SosTabId; label: string }[] = [
  { id: "browser", label: "Browser & line" },
  { id: "audio", label: "Audio (Origin)" },
  { id: "stripe", label: "Stripe & member ID" },
];

export default function Sos() {
  const [tab, setTab] = useState<SosTabId>("browser");

  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <LifeBuoy size={14} aria-hidden />
          <p className="sos-page__kicker">Site operating support</p>
        </div>
        <h1 className="sos-page__title">
          <span className="sos-page__title-route">/sos</span> calm line checks
        </h1>
        <p className="sos-page__subtitle">
          Practical fixes for cache, connection, Origin voice, and member sign-in. If something still does not match
          your clearance, contact OPS at{" "}
          <a href={mailtoUsjetOps("USJET SOS")} className="sos-page__inline-link">
            {USJET_OPS_EMAIL}
          </a>
          .
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__shell-inner" role="tablist" aria-label="SOS topics">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={["sos-page__tab", tab === item.id ? "sos-page__tab--active" : ""].filter(Boolean).join(" ")}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="sos-page__panel" role="tabpanel">
          {tab === "browser" ? <BrowserLinePanel /> : null}
          {tab === "audio" ? <AudioOriginPanel /> : null}
          {tab === "stripe" ? <StripeMemberPanel /> : null}
        </div>
      </GlassEffectContainer>

      <section
        id="sos-footer"
        className="sos-page__footer mt-12 scroll-mt-28 text-center sm:scroll-mt-32"
        aria-labelledby="sos-footer-heading"
      >
        <p id="sos-footer-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          You read the operating lanes—next: the flight school.
        </p>
        <Link
          to="/ai-101?from=sos"
          className="sos-page__ai101-cta btn-glass-prominent glass-effect-interactive glass-tint-cyan inline-flex min-w-[11rem] justify-center px-7 py-2.5 text-xs font-black uppercase tracking-[0.18em] focus-visible:ring-2 focus-visible:ring-cyan-300/90 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
          aria-label="Continue to the USJET AI 101 curriculum in the same window"
        >
          AI 101
        </Link>
      </section>
    </div>
  );
}

function BrowserLinePanel() {
  return (
    <div className="sos-page__section">
      <h2 className="sos-page__section-title">Browser & line</h2>
      <ul className="sos-page__list">
        <li>
          <strong>Stale layout or odd state after an update.</strong> Use your browser&apos;s hard reload (often{" "}
          <kbd className="sos-page__kbd">Ctrl</kbd>+<kbd className="sos-page__kbd">Shift</kbd>+<kbd className="sos-page__kbd">R</kbd>{" "}
          or <kbd className="sos-page__kbd">Cmd</kbd>+<kbd className="sos-page__kbd">Shift</kbd>+<kbd className="sos-page__kbd">R</kbd>
          ) so the shell picks up fresh assets.
        </li>
        <li>
          <strong>Site data and sign-in loops.</strong> Open browser settings → privacy or site settings → find this
          site&apos;s entry → clear cached data or cookies for the USJET hostname you are actually using. You will need
          to sign in to the Member Portal again afterward.
        </li>
        <li>
          <strong>Integrated partner view (<Link to="/cockpit">/cockpit</Link>).</strong> Partners load in an embedded
          frame. If the frame stays blank or the partner refuses embedding, the cockpit may offer to open the live
          module in <em>this same window</em> so you can continue; use the return control to come back to USJET.
        </li>
        <li>
          <strong>Stripe checkout.</strong> Tier links on{" "}
          <Link to="/member/login" className="sos-page__inline-link">
            Member Login
          </Link>{" "}
          navigate in the same tab to Stripe&apos;s hosted checkout (not an in-page embed here). If the page will not
          advance after payment, try a hard reload on USJET once you are back on this origin.
        </li>
        <li>
          <strong>Pop-up blockers.</strong> USJET does not rely on a separate pop-up window for member checkout. If a
          partner flow inside <code className="sos-page__code">/cockpit</code> needs an auxiliary window and your
          browser blocks it, allow pop-ups for this site and retry.
        </li>
      </ul>

      <h3 className="sos-page__subhead">Connection &amp; domain</h3>
      <ul className="sos-page__list">
        <li>
          <strong>HTTPS.</strong> Voice paths on Origin expect a secure context; avoid mixed-content or downgraded HTTP
          when testing locally.
        </li>
        <li>
          <strong>VPN, firewall, and corporate filters.</strong> They can block media capture, third-party frames, or
          HTTPS calls your browser makes after you interact. If only one network fails, try another path or ask the
          network operator for an allow rule.
        </li>
        <li>
          <strong>Captive portals (hotel, café, inflight).</strong> Complete the Wi‑Fi login page first; otherwise assets
          and verification calls may appear to hang.
        </li>
        <li>
          <strong>Hostname sanity.</strong> Confirm the address bar shows the USJET host you trust before entering a
          billing email or member identifier.
        </li>
      </ul>
    </div>
  );
}

function AudioOriginPanel() {
  return (
    <div className="sos-page__section">
      <h2 className="sos-page__section-title">Audio (Origin)</h2>
      <p className="sos-page__lead">
        Origin on <Link to="/origin">/origin</Link> uses the browser microphone for conversational listening and the
        device speech synthesizer for spoken briefings. The in-app &quot;Browser connect&quot; guide and voice
        troubleshoot panel repeat the same steps: settings → microphone → allow this site.
      </p>
      <ul className="sos-page__list">
        <li>
          <strong>Mic mode.</strong> When you tap the Aura control to listen, Origin requests microphone access through{" "}
          <code className="sos-page__code">navigator.mediaDevices.getUserMedia</code>. If permission is denied, the page
          shows a &quot;Microphone permission denied&quot; status (or an iPhone-specific prompt to tap for access).
        </li>
        <li>
          <strong>Speak mode.</strong> The separate Speak control uses <code className="sos-page__code">speechSynthesis</code>{" "}
          only — no microphone is required for that path.
        </li>
        <li>
          <strong>While Aura is speaking.</strong> Tapping Aura during output mutes website audio (the status strip reads
          &quot;Speakers off — USJET website audio muted&quot; when muted while idle).
        </li>
        <li>
          <strong>Autoplay guardrails.</strong> If the welcome voice cannot start automatically, Origin surfaces a
          banner such as &quot;Tap Enable Origin voice&quot; — especially on iOS-like devices where a deliberate tap is
          required before audio or mic access opens.
        </li>
        <li>
          <strong>Speech recognition unsupported.</strong> If the browser lacks Web Speech recognition, Origin opens a
          troubleshoot state; use the on-page &quot;Voice troubleshoot&quot; actions (&quot;Retry mic&quot; / &quot;Test
          speak&quot;) there.
        </li>
      </ul>
      <p className="sos-page__note">
        macOS system microphone privacy (System Settings → Privacy &amp; Security → Microphone) must allow your browser.
        Chrome site permissions (lock icon → Site settings → Microphone) should be set to Allow for this origin.
      </p>
    </div>
  );
}

function StripeMemberPanel() {
  return (
    <div className="sos-page__section">
      <h2 className="sos-page__section-title">Stripe &amp; member ID</h2>
      <p className="sos-page__lead">
        Clearance matches the live product copy on{" "}
        <Link to="/member/login" className="sos-page__inline-link">
          Member Login
        </Link>
        : pay through Stripe first, then verify with <strong>billing email</strong> plus either your{" "}
        <strong>founder-issued access sentence</strong> or your Stripe <strong>Member ID</strong> in the form{" "}
        <code className="sos-page__code">cus_…</code>. <strong>Email alone does not unlock the Member Portal.</strong>
      </p>
      <ul className="sos-page__list">
        <li>
          <strong>No OAuth.</strong> {SECURITY_STRIPE_ONLY_MAY_2026.noOAuthEver.join(" ")} The login panel states:
          &quot;Stripe-only gate — no Google or Apple OAuth.&quot;
        </li>
        <li>
          <strong>Not a Stripe password.</strong> USJET does not use your Stripe account password as the member password.
          Verification is the billing email plus the access sentence or <code className="sos-page__code">cus_…</code>{" "}
          Member ID, checked against the configured verify endpoint.
        </li>
        <li>
          <strong>After checkout.</strong> Return to Member Login and use the same billing email you paid with, plus the
          sentence or Member ID shown on Stripe confirmation / receipt when applicable.
        </li>
        <li>
          <strong>Signed-in session storage.</strong> A verified session is stored in this browser&apos;s{" "}
          <code className="sos-page__code">localStorage</code> and expires after twenty-four hours of age; signing out
          clears it immediately.
        </li>
        <li>
          <strong>Project tooling note.</strong> Member Project copy references the Stripe dashboard for charges and
          quotas; the Member Portal UI here does not embed a subscription cancel button—manage billing through
          Stripe&apos;s own account tools or email OPS if you need a human routing.
        </li>
      </ul>
      <p className="sos-page__note">
        Tier pricing on the login panel: Flight Pass <strong>$19.90/mo</strong>, Hangar Pro <strong>$49.95/mo</strong>,
        Enterprise Commander <strong>$199.99/mo</strong> — all routed through Stripe Payment Links.
      </p>
    </div>
  );
}
