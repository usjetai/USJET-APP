import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { USJET_STORE_BOOKS, storeBookPath } from "../../data/usjetStore";

const DISMISS_KEY = "usjet-guest-books-gate-dismissed";

const HIDDEN_PATHS = new Set([
  "/",
  "/fleet",
  "/store",
  "/store/ai-computers",
  "/ai-computers",
  "/shop",
  "/books",
  "/merch",
  "/login",
  "/member",
  "/member/login",
  "/cockpit",
]);

function wasDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* private mode */
  }
}

function pathHidesGate(pathname: string): boolean {
  if (HIDDEN_PATHS.has(pathname) || pathname.startsWith("/store/")) {
    return true;
  }
  return pathname.startsWith("/member/");
}

export default function GuestBooksGate() {
  const { session, loading } = useMemberAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const titleId = useId();
  const [open, setOpen] = useState(false);

  const hideForMember = Boolean(session?.active);
  const hideForRoute = pathHidesGate(location.pathname);

  useEffect(() => {
    if (loading || hideForMember || hideForRoute || wasDismissed()) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [hideForMember, hideForRoute, loading]);

  const dismiss = useCallback(() => {
    markDismissed();
    setOpen(false);
  }, []);

  const closeToHangar = useCallback(() => {
    dismiss();
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [dismiss, location.pathname, navigate]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeToHangar();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeToHangar, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="guest-books-gate pdre-overlay" role="presentation">
      <button
        type="button"
        className="guest-books-gate__backdrop"
        aria-label="Close and go to Hangar"
        onClick={closeToHangar}
      />
      <GlassEffectContainer
        className="guest-books-gate__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="guest-books-gate__close glass-effect-interactive"
          aria-label="Close and go to Hangar"
          onClick={closeToHangar}
        >
          <X size={16} aria-hidden />
        </button>

        <p className="guest-books-gate__kicker">Operator&apos;s Rig · Guest briefing</p>
        <h2 id={titleId} className="guest-books-gate__title">
          A computer that already has AI in it.
        </h2>
        <p className="guest-books-gate__lede">
          Hangar is home machines. Fleet is business machines and servers. We buy the exact unit, load the local AI
          stack, and ship it. The books below are the operator manuals — same Founder, same hangar.
        </p>

        <div className="guest-books-gate__grid">
          {USJET_STORE_BOOKS.map((book) => (
            <Link
              key={book.id}
              to={storeBookPath(book.id)}
              className="guest-books-gate__cover glass-effect-interactive"
              aria-label={`${book.title} — open Store`}
              onClick={dismiss}
            >
              <img src={book.coverSrc} alt="" className="guest-books-gate__cover-img" />
              <span className="guest-books-gate__cover-title">{book.title}</span>
            </Link>
          ))}
        </div>

        <p className="guest-books-gate__price">$9.99 Kindle · $14.99 Paperback</p>
        <Link
          to="/"
          className="guest-books-gate__cta btn-glass-prominent glass-effect-interactive"
          onClick={dismiss}
        >
          Shop home computers
        </Link>
      </GlassEffectContainer>
    </div>,
    document.body,
  );
}
