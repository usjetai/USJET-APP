import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Copy, ShieldCheck, TriangleAlert } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { useMemberAuth } from "../context/MemberAuthContext";
import { resolveCheckoutSession } from "../lib/checkoutSession";
import { copyUsjetProtocol } from "../lib/copyUsjetProtocol";

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; customerId: string; email: string; name?: string; loggedIn: boolean };

export default function WelcomeAboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useMemberAuth();
  const [view, setView] = useState<ViewState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get("session_id")?.trim() ?? "";

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (!sessionId) {
        setView({
          status: "error",
          message: "No checkout session found. If you just paid, check your email receipt for a link back here.",
        });
        return;
      }

      try {
        const resolved = await resolveCheckoutSession(sessionId);
        if (cancelled) return;

        // Auto-login runs the same real Stripe verification as the manual login form —
        // this is a convenience, not a shortcut. If it fails, we still show the Member
        // ID below so the customer can log in manually.
        const loggedIn = await login(resolved.customerId, resolved.email);
        if (cancelled) return;

        setView({
          status: "ready",
          customerId: resolved.customerId,
          email: resolved.email,
          name: resolved.name,
          loggedIn,
        });
      } catch (error) {
        if (cancelled) return;
        setView({
          status: "error",
          message: error instanceof Error ? error.message : "Could not confirm your checkout.",
        });
      }
    }

    void resolve();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleCopy = async () => {
    if (view.status !== "ready") return;
    const ok = await copyUsjetProtocol(view.customerId);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="welcome-aboard-page page-atmosphere page-nav-offset mx-auto max-w-2xl px-6 pb-28 sm:px-8">
      <header className="welcome-aboard-page__header">
        <div className="welcome-aboard-page__kicker-row">
          <ShieldCheck size={14} aria-hidden />
          <p className="welcome-aboard-page__kicker">Payment confirmed</p>
        </div>
        <h1 className="welcome-aboard-page__title">
          Welcome <span className="welcome-aboard-page__title-accent">Aboard</span>
        </h1>
        <p className="welcome-aboard-page__subtitle">
          Stripe confirmed your payment. Here's your Member ID — save it, you'll need it (with your billing email)
          every time you log in.
        </p>
      </header>

      <GlassEffectContainer className="welcome-aboard-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="welcome-aboard-panel__card">
          {view.status === "loading" ? (
            <p className="welcome-aboard-panel__status">Confirming your checkout with Stripe…</p>
          ) : null}

          {view.status === "error" ? (
            <div className="welcome-aboard-panel__error">
              <div className="welcome-aboard-panel__error-row">
                <TriangleAlert size={16} aria-hidden />
                <p>{view.message}</p>
              </div>
              <Link to="/member/login" className="welcome-aboard-panel__link-btn">
                Go to Member Login
              </Link>
            </div>
          ) : null}

          {view.status === "ready" ? (
            <>
              <p className="welcome-aboard-panel__section-kicker">Your Member ID</p>
              <div className="welcome-aboard-panel__id-row">
                <code className="welcome-aboard-panel__id">{view.customerId}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="welcome-aboard-panel__copy-btn"
                  aria-label="Copy Member ID"
                >
                  {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="welcome-aboard-panel__email">
                Billing email on file: <strong>{view.email}</strong>
              </p>

              {view.loggedIn ? (
                <>
                  <p className="welcome-aboard-panel__note">You're already logged in on this device.</p>
                  <button
                    type="button"
                    onClick={() => navigate("/member")}
                    className="welcome-aboard-panel__cta btn-glass-prominent glass-effect-interactive"
                  >
                    Enter Member Portal
                  </button>
                </>
              ) : (
                <>
                  <p className="welcome-aboard-panel__note">
                    We couldn't log you in automatically here, but your Member ID and email above will work on the
                    login page.
                  </p>
                  <Link
                    to="/member/login"
                    className="welcome-aboard-panel__cta btn-glass-prominent glass-effect-interactive"
                  >
                    Go to Member Login
                  </Link>
                </>
              )}

              <p className="welcome-aboard-panel__footnote">
                This ID also shows up on your Stripe receipt email. Losing it isn't fatal — support can look it up
                from your billing email — but keeping it handy makes logins instant.
              </p>
            </>
          ) : null}
        </div>
      </GlassEffectContainer>
    </div>
  );
}
