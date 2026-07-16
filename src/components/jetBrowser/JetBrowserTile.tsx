import { Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";
import { isJetBrowserIframeBlocked } from "../../lib/hangarEmbedPolicy";
import { jetBrowserTileLabel } from "../../lib/jetBrowserUrl";

export type JetBrowserBay = {
  id: string;
  url: string;
};

type JetBrowserTileProps = {
  bay: JetBrowserBay;
  accentSlot: number;
  focused?: boolean;
  onToggleFocus?: () => void;
  onClose: () => void;
};

/** Live Jet Browser bay — Hangar enlarge/shrink rhythm, captain-loaded URL. */
export default function JetBrowserTile({
  bay,
  accentSlot,
  focused = false,
  onToggleFocus,
  onClose,
}: JetBrowserTileProps) {
  const label = jetBrowserTileLabel(bay.url);
  const blocked = isJetBrowserIframeBlocked(bay.url);
  const canFocus = Boolean(onToggleFocus);
  const handoffHref = wrapExternalInCockpit(bay.url, {
    returnTo: "/jet-browser",
    label,
    directHandoff: true,
  });

  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    if (!focused || !canFocus) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onToggleFocus?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canFocus, focused, onToggleFocus]);

  return (
    <div
      className={[
        "hangar-bay-focus-slot jet-browser-bay",
        focused && canFocus ? "hangar-bay-focus-slot--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {focused && canFocus ? (
        <button
          type="button"
          className="hangar-bay-focus-backdrop"
          aria-label={`Shrink ${label} bay`}
          onClick={onToggleFocus}
        />
      ) : null}

      <article
        className={[
          "hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
          "jet-browser-tile",
          blocked ? "hangar-tool-workbench--handoff-only" : "",
          focused && canFocus ? "hangar-tool-workbench--focused" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={fleetBayAccentStyle(accentSlot) as CSSProperties}
      >
        <div className="hangar-tile-controls">
          {canFocus ? (
            <button
              type="button"
              className="hangar-tile-focus"
              onClick={onToggleFocus}
              aria-label={focused ? `Shrink ${label} bay` : `Enlarge ${label} bay`}
              aria-pressed={focused}
              title={focused ? "Shrink tile" : "Enlarge tile"}
            >
              {focused ? <Minimize2 size={14} strokeWidth={2.5} /> : <Maximize2 size={14} strokeWidth={2.5} />}
            </button>
          ) : null}
          <button type="button" className="hangar-tile-close" onClick={onClose} aria-label={`Close ${label} bay`}>
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <p className="jet-browser-tile__label" title={bay.url}>
          {label}
        </p>

        {blocked ? (
          <div className="hangar-tile-handoff">
            <p className="jet-browser-tile__note">This site blocks in-tile embed.</p>
            <a
              href={handoffHref}
              className="hangar-tile-handoff__btn"
              aria-label={`Open ${label} in cockpit`}
            >
              Open {label}
            </a>
          </div>
        ) : (
          <iframe
            key={`jet-browser-iframe-${bay.id}`}
            className={[
              "hangar-tool-workbench__frame",
              frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
            ].join(" ")}
            title={`${label} · USJET Jet Browser`}
            src={bay.url}
            onLoad={() => setFrameReady(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation"
            referrerPolicy="no-referrer-when-downgrade"
            allow="microphone; camera; clipboard-write; fullscreen"
          />
        )}
      </article>
    </div>
  );
}

type JetBrowserEmptyBayProps = {
  index: number;
  onFocusLaunch: () => void;
};

/** Blank ready bay — waiting for the next domain. */
export function JetBrowserEmptyBay({ index, onFocusLaunch }: JetBrowserEmptyBayProps) {
  return (
    <button
      type="button"
      className="jet-browser-empty-bay glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan glass-effect-interactive"
      onClick={onFocusLaunch}
      aria-label={`Blank bay ${index + 1}. Enter a domain above to open this tile.`}
    >
      <span className="jet-browser-empty-bay__kicker">Bay {String(index + 1).padStart(2, "0")}</span>
      <span className="jet-browser-empty-bay__title">Blank tile</span>
      <span className="jet-browser-empty-bay__copy">Enter a domain or link above</span>
    </button>
  );
}
