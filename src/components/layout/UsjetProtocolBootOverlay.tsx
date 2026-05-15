import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { revealAtmosphere } from "../../lib/usjetAtmosphere";
import { triggerSiteEarthquake } from "../../lib/usjetSiteShake";
import {
  dispatchProtocolCeremonyComplete,
  USJET_PROTOCOL_CEREMONY_EVENT,
} from "../../lib/protocolCeremony";

const BOOT_LINES = [
  "> USJET SOVEREIGN TERMINAL v5.0 — CLASSIFIED",
  "> INITIALIZING SECURE CHANNEL...",
  "> CONNECTING TO U.S. JET NETWORK",
  "> HANDSHAKE: FLEET UPLINK PENDING...",
  "> VERIFYING MASTER LOCK...",
  "> PROTOCOL BUFFER SYNCED",
  "> UPLINK ESTABLISHED — RETURNING TO COCKPIT",
] as const;

const CONNECTING_LINE_INDEX = 2;
const DOT_FRAMES = ["", ".", "..", "..."] as const;
const DOT_CYCLE_COUNT = 3;
const LINE_DELAY_MS = 380;
const DOT_FRAME_MS = 165;
const HOLD_AFTER_COMPLETE_MS = 5000;
const FADE_OUT_MS = 420;

type Phase = "hidden" | "boot" | "fade";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function UsjetProtocolBootOverlay() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [loadingDots, setLoadingDots] = useState("");
  const [showConnectingDots, setShowConnectingDots] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [rumble, setRumble] = useState(false);
  const runIdRef = useRef(0);

  const dismiss = useCallback(() => {
    setPhase("fade");
    window.setTimeout(() => {
      setPhase("hidden");
      setVisibleLines([]);
      setLoadingDots("");
      setShowConnectingDots(false);
      setShowCursor(false);
      setRumble(false);
      dispatchProtocolCeremonyComplete();
    }, FADE_OUT_MS);
  }, []);

  const runDotCycles = useCallback(async () => {
    setShowConnectingDots(true);
    const totalSteps = DOT_CYCLE_COUNT * DOT_FRAMES.length;
    for (let step = 0; step < totalSteps; step += 1) {
      setLoadingDots(DOT_FRAMES[step % DOT_FRAMES.length]);
      await delay(DOT_FRAME_MS);
    }
    setLoadingDots("...");
    await delay(DOT_FRAME_MS);
    setShowConnectingDots(false);
    setLoadingDots("");
  }, []);

  const startBoot = useCallback(async () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    setPhase("boot");
    setVisibleLines([]);
    setLoadingDots("");
    setShowConnectingDots(false);
    setShowCursor(false);
    setRumble(false);

    window.setTimeout(() => {
      revealAtmosphere();
    }, 420);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      revealAtmosphere();
      setVisibleLines(["> CONNECTING TO U.S. JET NETWORK...", "> UPLINK ESTABLISHED"]);
      setShowCursor(true);
      await delay(5000);
      if (runIdRef.current === runId) {
        dismiss();
      }
      return;
    }

    for (let index = 0; index < BOOT_LINES.length; index += 1) {
      if (runIdRef.current !== runId) {
        return;
      }

      const line = BOOT_LINES[index];
      setVisibleLines((prev) => [...prev, line]);

      if (index === 0) {
        setRumble(true);
        window.setTimeout(() => setRumble(false), 520);
        void triggerSiteEarthquake();
      }

      if (index === CONNECTING_LINE_INDEX) {
        await runDotCycles();
      } else {
        await delay(LINE_DELAY_MS);
      }
    }

    if (runIdRef.current !== runId) {
      return;
    }

    setShowCursor(true);
    await delay(HOLD_AFTER_COMPLETE_MS);

    if (runIdRef.current === runId) {
      dismiss();
    }
  }, [dismiss, runDotCycles]);

  useEffect(() => {
    const onCeremony = () => {
      void startBoot();
    };
    window.addEventListener(USJET_PROTOCOL_CEREMONY_EVENT, onCeremony);
    return () => {
      runIdRef.current += 1;
      window.removeEventListener(USJET_PROTOCOL_CEREMONY_EVENT, onCeremony);
    };
  }, [startBoot]);

  useEffect(() => {
    if (phase === "hidden") {
      document.documentElement.classList.remove("usjet-protocol-boot-active");
      return;
    }
    document.documentElement.classList.add("usjet-protocol-boot-active");
    return () => {
      document.documentElement.classList.remove("usjet-protocol-boot-active");
    };
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }

  return createPortal(
    <div
      className={[
        "usjet-protocol-boot",
        phase === "fade" ? "usjet-protocol-boot--fade" : "",
        rumble ? "usjet-protocol-boot--rumble" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="USJET secure terminal handshake"
      aria-live="polite"
    >
      <div className="usjet-protocol-boot__scanlines" aria-hidden />
      <div className="usjet-protocol-boot__glow" aria-hidden />
      <pre className="usjet-protocol-boot__screen">
        <code>
          {visibleLines.map((line, index) => (
            <span key={`${index}-${line}`} className="usjet-protocol-boot__line">
              {line}
              {index === CONNECTING_LINE_INDEX && showConnectingDots ? (
                <span className="usjet-protocol-boot__dots" aria-hidden>
                  {loadingDots}
                </span>
              ) : null}
              {"\n"}
            </span>
          ))}
          {showCursor ? (
            <span className="usjet-protocol-boot__cursor-line">
              {"> STANDING BY — LANDING COMPLETE"}
              <span className="usjet-protocol-boot__cursor" aria-hidden>
                _
              </span>
            </span>
          ) : null}
        </code>
      </pre>
    </div>,
    document.body,
  );
}
