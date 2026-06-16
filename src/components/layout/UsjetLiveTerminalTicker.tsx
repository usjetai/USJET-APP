import { useEffect, useMemo, useState } from "react";
import DeveloperRedBlinkText from "../DeveloperRedBlinkText";
import { LIVE_TERMINAL_SEGMENTS } from "../../data/liveTerminalFeed";
import {
  isLiveTerminalArmed,
  USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT,
  USJET_PROTOCOL_RESET_EVENT,
} from "../../lib/protocolCeremony";
import {
  LIVE_TERMINAL_TILE_ENTER,
  LIVE_TERMINAL_TILE_LEAVE,
  type LiveTerminalTileDetail,
} from "../../lib/liveTerminalBridge";

const IDLE_SCROLL_SECONDS = 42;

function buildIdleStream(): string {
  return LIVE_TERMINAL_SEGMENTS.map((segment) =>
    segment.kind === "text" ? segment.value : `${segment.code} `,
  ).join("");
}

function scrollDurationForText(text: string, hovered: boolean): number {
  const chars = Math.max(text.length, 24);
  const secondsPerChar = hovered ? 0.11 : 0.065;
  return Math.min(hovered ? 48 : 56, Math.max(hovered ? 10 : IDLE_SCROLL_SECONDS, chars * secondsPerChar));
}

type UsjetLiveTerminalTickerProps = {
  variant?: "header" | "floating";
  /** When true, run the terminal without requiring prior localStorage arm on first paint. */
  active?: boolean;
};

export default function UsjetLiveTerminalTicker({
  variant = "header",
  active = false,
}: UsjetLiveTerminalTickerProps) {
  const idleStream = useMemo(() => buildIdleStream(), []);
  const [armed, setArmed] = useState(false);
  const [streamText, setStreamText] = useState(idleStream);
  const [hovered, setHovered] = useState(false);
  const [streamKey, setStreamKey] = useState(0);

  const scrollSeconds = scrollDurationForText(streamText, hovered);

  useEffect(() => {
    setArmed(active || isLiveTerminalArmed());
    const onComplete = () => setArmed(true);
    const onReset = () => {
      setArmed(false);
      setHovered(false);
      setStreamText(idleStream);
      setStreamKey((value) => value + 1);
    };
    window.addEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, onComplete);
    window.addEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, onComplete);
      window.removeEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    };
  }, [active, idleStream]);

  useEffect(() => {
    if (!armed && !active) {
      return;
    }

    const onTileEnter = (event: Event) => {
      const detail = (event as CustomEvent<LiveTerminalTileDetail>).detail;
      if (!detail?.feed?.trim()) {
        return;
      }
      setHovered(true);
      setStreamText(detail.feed);
      setStreamKey((value) => value + 1);
    };

    const onTileLeave = () => {
      setHovered(false);
      setStreamText(idleStream);
      setStreamKey((value) => value + 1);
    };

    window.addEventListener(LIVE_TERMINAL_TILE_ENTER, onTileEnter);
    window.addEventListener(LIVE_TERMINAL_TILE_LEAVE, onTileLeave);
    return () => {
      window.removeEventListener(LIVE_TERMINAL_TILE_ENTER, onTileEnter);
      window.removeEventListener(LIVE_TERMINAL_TILE_LEAVE, onTileLeave);
    };
  }, [active, armed, idleStream]);

  if (!armed && !active) {
    return null;
  }

  return (
    <div
      className={[
        "usjet-live-terminal",
        variant === "header" ? "usjet-live-terminal--header" : "usjet-live-terminal--floating",
        hovered ? "usjet-live-terminal--hovered" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label={hovered ? `Fleet uplink: ${streamText}` : "USJET live terminal uplink"}
    >
      <div className="usjet-live-terminal__row">
        <span className="usjet-live-terminal__prefix" aria-hidden>
          <span className="usjet-live-terminal__dots">
            <span className="usjet-live-terminal__dot usjet-live-terminal__dot--1">.</span>
            <span className="usjet-live-terminal__dot usjet-live-terminal__dot--2">.</span>
            <span className="usjet-live-terminal__dot usjet-live-terminal__dot--3">.</span>
          </span>
          <span className="usjet-live-terminal__cursor">_</span>
        </span>
        <div className="usjet-live-terminal__viewport">
          <span
            key={streamKey}
            className="usjet-live-terminal__stream"
            style={{ ["--terminal-scroll-duration" as string]: `${scrollSeconds}s` }}
          >
            <DeveloperRedBlinkText text={streamText} />
            <span className="usjet-live-terminal__stream-gap" aria-hidden>
              {" "}
              ·{" "}
            </span>
            <DeveloperRedBlinkText text={streamText} />
          </span>
        </div>
      </div>
    </div>
  );
}
