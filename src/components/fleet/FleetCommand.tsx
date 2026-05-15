import { Radio } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { USJET_PROTOCOL_LOCK } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";

const PROTOCOL_SYNC_STORAGE_KEY = "usjet-fleet-protocol-lock-synced";
const USJET_PROTOCOL_SYNC_BROADCAST = "usjet-protocol-sync-broadcast";

type CopyState = "idle" | "synced" | "error";

type FleetCommandProps = {
  /**
   * `ceremony` — AI 101 finale: vault-armed look from first paint (still copies on tap).
   * `default` — nav strip: cyan pulse until the lock is copied for real.
   */
  variant?: "default" | "ceremony";
};

export default function FleetCommand({ variant = "default" }: FleetCommandProps) {
  const [state, setState] = useState<CopyState>("idle");
  const resetRef = useRef<number | null>(null);
  const ceremony = variant === "ceremony";

  useEffect(() => {
    const applyStorage = () => {
      try {
        if (window.localStorage.getItem(PROTOCOL_SYNC_STORAGE_KEY) === "1") {
          setState("synced");
        }
      } catch {
        /* private / blocked storage */
      }
    };

    applyStorage();

    const onRemoteSync = () => {
      applyStorage();
    };
    window.addEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onRemoteSync);

    return () => {
      window.removeEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onRemoteSync);
      if (resetRef.current !== null) {
        window.clearTimeout(resetRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await copyUsjetProtocol(USJET_PROTOCOL_LOCK);
    if (ok) {
      try {
        window.localStorage.setItem(PROTOCOL_SYNC_STORAGE_KEY, "1");
      } catch {
        /* still show synced UI for this session */
      }
      setState("synced");
      window.dispatchEvent(new Event(USJET_PROTOCOL_SYNC_BROADCAST));
      if (resetRef.current !== null) {
        window.clearTimeout(resetRef.current);
        resetRef.current = null;
      }
      return;
    }

    setState("error");
    if (resetRef.current !== null) {
      window.clearTimeout(resetRef.current);
    }
    resetRef.current = window.setTimeout(() => setState("idle"), 2800);
  }, []);

  const visuallySynced = state === "synced" || (ceremony && state !== "error");

  const labelDefault =
    state === "synced" ? "Fleet online" : state === "error" ? "Copy failed" : "USJET Protocol";
  const shortDefault = state === "synced" ? "Online" : state === "error" ? "Retry" : "Protocol";

  const label =
    ceremony && state !== "synced"
      ? "USJET"
      : ceremony && state === "synced"
        ? "Fleet online"
        : labelDefault;
  const shortLabel =
    ceremony && state !== "synced"
      ? "USJ"
      : ceremony && state === "synced"
        ? "Online"
        : shortDefault;

  return (
    <button
      type="button"
      className={[
        "fleet-command btn-glass glass-effect-interactive shrink-0",
        visuallySynced ? "fleet-command--synced" : "",
        state === "error" ? "fleet-command--error" : "",
        ceremony ? "fleet-command--ceremony" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => void handleCopy()}
      title={ceremony ? undefined : "Copy the USJET Master Lock — paste once into any partner AI to sync the fleet"}
      aria-live="polite"
      aria-pressed={state === "synced"}
      aria-label={
        ceremony
          ? "USJET Protocol — tap to copy the Master Lock text"
          : "Copy the USJET Master Lock for partner AIs"
      }
    >
      <Radio size={14} className="fleet-command__icon" aria-hidden />
      <span className="fleet-command__label hidden min-[420px]:inline">{label}</span>
      <span className="fleet-command__label min-[420px]:hidden">{shortLabel}</span>
    </button>
  );
}
