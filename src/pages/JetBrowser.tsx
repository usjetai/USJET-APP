import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import JetBrowserTile, {
  JetBrowserEmptyBay,
  type JetBrowserBay,
} from "../components/jetBrowser/JetBrowserTile";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import {
  useJetBrowserColumnLayout,
  type JetBrowserColumnLayout,
} from "../hooks/useJetBrowserColumnLayout";
import { jetBrowserTileLabel, normalizeJetBrowserUrl } from "../lib/jetBrowserUrl";

const JET_BROWSER_META =
  "USJET Jet Browser — load any domain into Hangar-style tiles. One ship, one cockpit. Enlarge, work, shrink.";

const MAX_OPEN_TILES = 8;
const EMPTY_READY_BAYS = 3;
const FULL_TOAST_MS = 3200;
const LAYOUT_OPTIONS = [2, 3, 4] as const satisfies readonly JetBrowserColumnLayout[];

function createBayId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `jet-bay-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function JetBrowser() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { columns, setColumnLayout } = useJetBrowserColumnLayout();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tiles, setTiles] = useState<JetBrowserBay[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [fullToast, setFullToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const gridClass = useMemo(
    () =>
      [
        "hangar-bay-grid fleet-runway-grid jet-browser-grid grid gap-4",
        columns === 2 ? "jet-browser-grid--cols-2" : "",
        columns === 3 ? "jet-browser-grid--cols-3" : "",
        columns === 4 ? "jet-browser-grid--cols-4" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [columns],
  );

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;

    document.title = "USJet.ai · Jet Browser";
    meta?.setAttribute("content", JET_BROWSER_META);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) {
        meta.setAttribute("content", prevDescription);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (focusedId !== null && !tiles.some((tile) => tile.id === focusedId)) {
      setFocusedId(null);
    }
  }, [focusedId, tiles]);

  const flashFullToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setFullToast(true);
    toastTimerRef.current = window.setTimeout(() => {
      setFullToast(false);
      toastTimerRef.current = null;
    }, FULL_TOAST_MS);
  }, []);

  const focusLaunch = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleLaunch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const url = normalizeJetBrowserUrl(draft);
      if (!url) {
        setError("Enter a domain or full link — example: wikipedia.org");
        return;
      }

      if (tiles.length >= MAX_OPEN_TILES) {
        setError(null);
        flashFullToast();
        return;
      }

      const next: JetBrowserBay = { id: createBayId(), url };
      setTiles((prev) => [...prev, next]);
      setDraft("");
      setError(null);
      inputRef.current?.focus();
    },
    [draft, flashFullToast, tiles.length],
  );

  const handleClose = useCallback((id: string) => {
    setFocusedId((current) => (current === id ? null : current));
    setTiles((prev) => prev.filter((tile) => tile.id !== id));
  }, []);

  const handleToggleFocus = useCallback((id: string) => {
    setFocusedId((current) => (current === id ? null : id));
  }, []);

  const emptyCount = useMemo(() => {
    if (tiles.length >= MAX_OPEN_TILES) return 0;
    return Math.min(EMPTY_READY_BAYS, MAX_OPEN_TILES - tiles.length);
  }, [tiles.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={[
        "jet-browser-page hangar-page hangar-page--workbench relative",
        tiles.length > 0 ? "hangar-page--bay-open" : "",
        focusedId !== null ? "hangar-page--bay-focused" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {fullToast ? (
        <div className="intel-hangar-toast" role="status" aria-live="polite" aria-atomic="true">
          <p className="intel-hangar-toast__title">Jet Browser full</p>
          <p className="intel-hangar-toast__body">
            Max {MAX_OPEN_TILES} tiles open. Close a bay, then launch the next domain.
          </p>
        </div>
      ) : null}

      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
        <header className="jet-browser-hero mb-10 border-b border-cyan-400/20 pb-10 md:mb-12 md:pb-12">
          <div className="flex flex-col items-center text-center">
            <UsjetWordmark size="hero" />
            <p className="mt-6 font-black uppercase tracking-[0.35em] text-cyan-300/90">
              Jet Browser · Captain-loaded bays
            </p>
            <h1 className="mt-4 font-aviation text-4xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl">
              Jet <span className="text-cyan-400">Browser</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed tracking-tight text-white/70 sm:text-lg">
              Enter a domain or any page link. It opens in a tile. Enter another — another tile.
              Enlarge to work, shrink to formation. One ship, one cockpit.
            </p>
          </div>

          <form
            className="jet-browser-launch glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mt-8 mx-auto max-w-3xl"
            onSubmit={handleLaunch}
          >
            <label htmlFor={inputId} className="jet-browser-launch__label">
              Domain or link
            </label>
            <div className="jet-browser-launch__row">
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="example.com or https://…"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (error) setError(null);
                }}
                className="jet-browser-launch__input"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
              />
              <button type="submit" className="jet-browser-launch__submit btn-glass-prominent glass-effect-interactive">
                Open tile
              </button>
            </div>
            {error ? (
              <p id={`${inputId}-error`} className="jet-browser-launch__error" role="alert">
                {error}
              </p>
            ) : (
              <p className="jet-browser-launch__hint">
                {tiles.length}/{MAX_OPEN_TILES} tiles open
                {tiles.length > 0
                  ? ` · latest ${jetBrowserTileLabel(tiles[tiles.length - 1]!.url)}`
                  : " · blank bays waiting below"}
              </p>
            )}
          </form>

          <div
            className="jet-browser-layout-toggle hangar-layout-toggle mt-6 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Jet Browser tile rows"
          >
            <span className="mr-1 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/50">
              Layout
            </span>
            {LAYOUT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                className={[
                  "hangar-layout-toggle__btn btn-glass glass-effect-interactive glass-tint-cyan",
                  columns === count ? "hangar-layout-toggle__btn--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={columns === count}
                onClick={() => setColumnLayout(count)}
              >
                {count} Rows
              </button>
            ))}
          </div>
        </header>

        <div className="hangar-bay-grid-wrap">
          <div className={gridClass} role="region" aria-label="Jet Browser tile formation">
            {tiles.map((bay, index) => (
              <JetBrowserTile
                key={bay.id}
                bay={bay}
                accentSlot={index % 30}
                focused={focusedId === bay.id}
                onToggleFocus={() => handleToggleFocus(bay.id)}
                onClose={() => handleClose(bay.id)}
              />
            ))}
            {Array.from({ length: emptyCount }, (_, index) => (
              <JetBrowserEmptyBay
                key={`jet-browser-empty-${tiles.length + index}`}
                index={tiles.length + index}
                onFocusLaunch={focusLaunch}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
