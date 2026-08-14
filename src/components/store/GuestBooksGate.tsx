import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { STORE_ROUTE, USJET_STORE_BOOKS, storeBookPath } from "../../data/usjetStore";

const DISMISS_KEY = "usjet-guest-books-gate-dismissed";

const HIDDEN_PATHS = new Set([
  "/store",
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
  if (HIDDEN_PATHS.has(pathname)) {
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

        <p className="guest-books-gate__kicker">Engineering Series · Guest briefing</p>
        <h2 id={titleId} className="guest-books-gate__title">
          Six books. One operator path.
        </h2>
        <p className="guest-books-gate__lede">
          Before you fly the Hangar — if you want to <em>learn</em> this craft, start here. Website,
          AI-first company, Mac, the 30 tools, Cursor, deploy. Written by Founder Ameer Karim.
          Tap a cover to open the Store. Close this and you&apos;re on the Hangar.
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
          to={STORE_ROUTE}
          className="guest-books-gate__cta btn-glass-prominent glass-effect-interactive"
          onClick={dismiss}
        >
          Open the Store
        </Link>
      </GlassEffectContainer>
    </div>,
    document.body,
  );
}
