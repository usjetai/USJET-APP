import { useEffect } from "react";
import { Link } from "react-router-dom";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import OriginJarvisTile from "../components/origin/OriginJarvisTile";

/**
 * Origin command page — clean shell.
 *
 * Only the self-contained USJet Origin Jarvis tile (mini-chat + prompt) is
 * rendered. A single US JET logo home button returns to the Hangar. No header
 * chrome, no footer, no avatar stage, no page background — the global
 * aviation pulse reads through the transparent shell.
 */
export default function Origin() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Origin · Talk to USJET.AI";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="origin-command-page relative flex min-h-[100vh] w-full items-center justify-center">
      <Link
        to="/"
        className="origin-command-page__home absolute top-6 left-6 z-20 nav-brand-usjet shrink-0"
        aria-label="USJet.ai — back to Hangar"
      >
        <UsjetWordmark size="nav" />
      </Link>

      <div className="origin-command-page__frame w-full max-w-md px-4">
        <OriginJarvisTile />
      </div>
    </div>
  );
}
