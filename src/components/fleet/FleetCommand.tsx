import { Radio } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { USJET_PROTOCOL_LOCK } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";

type CopyState = "idle" | "copied" | "error";

export default function FleetCommand() {
  const [state, setState] = useState<CopyState>("idle");
  const resetRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetRef.current !== null) {
        window.clearTimeout(resetRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await copyUsjetProtocol(USJET_PROTOCOL_LOCK);
    setState(ok ? "copied" : "error");
    if (resetRef.current !== null) {
      window.clearTimeout(resetRef.current);
    }
    resetRef.current = window.setTimeout(() => setState("idle"), 2400);
  }, []);

  const label =
    state === "copied" ? "Lock copied" : state === "error" ? "Copy failed" : "USJET Protocol";

  return (
    <button
      type="button"
      className="fleet-command btn-glass glass-effect-interactive shrink-0"
      onClick={() => void handleCopy()}
      title="Copy the USJET Master Lock — paste once into any partner AI to sync the fleet"
      aria-live="polite"
    >
      <Radio size={14} className="fleet-command__icon" aria-hidden />
      <span className="fleet-command__label">{label}</span>
    </button>
  );
}
