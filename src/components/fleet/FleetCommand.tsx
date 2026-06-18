import { Radio } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { USJET_PROTOCOL_LOCK } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";
import {
  dispatchProtocolCeremony,
  PROTOCOL_LOCK_SYNCED_STORAGE_KEY,
  USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT,
  USJET_PROTOCOL_SYNC_BROADCAST,
} from "../../lib/protocolCeremony";
import { isAtmosphereLive } from "../../lib/usjetAtmosphere";
import {
  PROTOCOL_ARMED_HOVER,
  PROTOCOL_STANDBY_HOVER,
} from "../../data/protocolSessionProof";
import { triggerSiteEarthquake } from "../../lib/usjetSiteShake";
import { triggerSiteLift } from "../../lib/usjetSiteLift";

type CopyState = "idle" | "synced" | "error";

/** Brown “Fleet online” hold — then cyan Protocol returns for another full ceremony. */
const PROTOCOL_FLEET_ONLINE_HOLD_MS = 20_000;

type FleetCommandProps = {
  /**
   * `ceremony` — AI 101 finale: vault-armed look from first paint (still copies on tap).
   * `default` — nav strip: standby red until tap, then boot, then calm blue when live.
   */
  variant?: "default" | "ceremony";
  onFleetOnlineChange?: (online: boolean) => void;
  onTerminalToggle?: () => void;
  onFleetOnlineActivated?: () => void;
};

export default function FleetCommand({
  variant = "default",
  onFleetOnlineChange,
  onTerminalToggle,
  onFleetOnlineActivated,
}: FleetCommandProps) {
  const [state, setState] = useState<CopyState>("idle");
  const [igniting, setIgniting] = useState(false);
  const errorResetRef = useRef<number | null>(null);
  const fleetOnlineHoldRef = useRef<number | null>(null);
  const pendingSyncRef = useRef(false);
  const ceremony = variant === "ceremony";

  const notifyFleetOnline = useCallback(
    (online: boolean) => {
      onFleetOnlineChange?.(online);
    },
    [onFleetOnlineChange],
  );

  const clearFleetOnlineHold = useCallback(() => {
    if (fleetOnlineHoldRef.current !== null) {
      window.clearTimeout(fleetOnlineHoldRef.current);
      fleetOnlineHoldRef.current = null;
    }
  }, []);

  const releaseProtocolForAnotherRun = useCallback(() => {
    clearFleetOnlineHold();
    pendingSyncRef.current = false;
    try {
      window.localStorage.removeItem(PROTOCOL_LOCK_SYNCED_STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setState("idle");
    setIgniting(false);
    notifyFleetOnline(false);
    window.dispatchEvent(new Event(USJET_PROTOCOL_SYNC_BROADCAST));
  }, [clearFleetOnlineHold, notifyFleetOnline]);

  const scheduleFleetOnlineHold = useCallback(() => {
    clearFleetOnlineHold();
    fleetOnlineHoldRef.current = window.setTimeout(() => {
      fleetOnlineHoldRef.current = null;
      releaseProtocolForAnotherRun();
    }, PROTOCOL_FLEET_ONLINE_HOLD_MS);
  }, [clearFleetOnlineHold, releaseProtocolForAnotherRun]);

  const finalizeProtocolSync = useCallback(() => {
    if (!pendingSyncRef.current) {
      return;
    }
    pendingSyncRef.current = false;
    setState("synced");
    setIgniting(false);
    notifyFleetOnline(true);
    onFleetOnlineActivated?.();
    window.dispatchEvent(new Event(USJET_PROTOCOL_SYNC_BROADCAST));
    scheduleFleetOnlineHold();
  }, [notifyFleetOnline, onFleetOnlineActivated, scheduleFleetOnlineHold]);

  useEffect(() => {
    const applyStorage = () => {
      try {
        const synced = window.localStorage.getItem(PROTOCOL_LOCK_SYNCED_STORAGE_KEY) === "1";
        // Atmosphere requires a fresh Protocol run each load — button stays standby until then.
        if (!isAtmosphereLive()) {
          setState("idle");
          notifyFleetOnline(false);
          setIgniting(false);
          pendingSyncRef.current = false;
          clearFleetOnlineHold();
          return;
        }
        setState(synced ? "synced" : "idle");
        notifyFleetOnline(synced);
        if (!synced) {
          setIgniting(false);
          pendingSyncRef.current = false;
          clearFleetOnlineHold();
        }
      } catch {
        setState("idle");
        setIgniting(false);
        pendingSyncRef.current = false;
        notifyFleetOnline(false);
        clearFleetOnlineHold();
      }
    };

    applyStorage();

    const onRemoteSync = () => {
      applyStorage();
    };
    window.addEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onRemoteSync);

    return () => {
      window.removeEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onRemoteSync);
      clearFleetOnlineHold();
      if (errorResetRef.current !== null) {
        window.clearTimeout(errorResetRef.current);
      }
    };
  }, [clearFleetOnlineHold, notifyFleetOnline]);

  useEffect(() => {
    const onCeremonyComplete = () => {
      finalizeProtocolSync();
    };
    window.addEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, onCeremonyComplete);
    return () => window.removeEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, onCeremonyComplete);
  }, [finalizeProtocolSync]);

  const handleClick = useCallback(async () => {
    if (igniting) {
      return;
    }

    if (state === "synced") {
      onTerminalToggle?.();
      return;
    }

    setIgniting(true);
    pendingSyncRef.current = false;

    await triggerSiteEarthquake();
    void triggerSiteLift();
    dispatchProtocolCeremony();

    const ok = await copyUsjetProtocol(USJET_PROTOCOL_LOCK);
    if (ok) {
      try {
        window.localStorage.setItem(PROTOCOL_LOCK_SYNCED_STORAGE_KEY, "1");
      } catch {
        /* still show synced UI for this session */
      }
      pendingSyncRef.current = true;
      if (errorResetRef.current !== null) {
        window.clearTimeout(errorResetRef.current);
        errorResetRef.current = null;
      }
      return;
    }

    setState("error");
    setIgniting(false);
    pendingSyncRef.current = false;
    if (errorResetRef.current !== null) {
      window.clearTimeout(errorResetRef.current);
    }
    errorResetRef.current = window.setTimeout(() => setState("idle"), 2800);
  }, [igniting, onTerminalToggle, state]);

  const visuallySynced = state === "synced" || (ceremony && state !== "error");
  const armedGreen = !ceremony && !igniting && state === "synced";
  const standby = !ceremony && state === "idle" && !igniting && !armedGreen;

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

  const title =
    state === "synced"
      ? ceremony
        ? "Fleet online — session synced"
        : "Fleet online — secure session synced"
      : armedGreen
        ? PROTOCOL_ARMED_HOVER
        : standby
          ? PROTOCOL_STANDBY_HOVER
          : igniting
            ? "USJET Protocol — secure boot in progress"
            : ceremony
              ? undefined
              : "Copy the USJET Master Lock — paste once into any partner AI to sync the fleet";

  return (
    <button
      type="button"
      className={[
        "fleet-command btn-glass glass-effect-interactive shrink-0",
        visuallySynced && ceremony ? "fleet-command--synced" : "",
        armedGreen && !igniting ? "fleet-command--armed" : "",
        state === "error" ? "fleet-command--error" : "",
        ceremony ? "fleet-command--ceremony" : "",
        igniting ? "fleet-command--landing" : "",
        standby ? "fleet-command--standby" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => void handleClick()}
      title={title}
      aria-live="polite"
      aria-pressed={state === "synced"}
      aria-label={
        ceremony
          ? "USJET Protocol — tap to copy the Master Lock text"
          : state === "synced"
            ? "Fleet online — secure session synced"
            : "USJET Protocol — tap to start secure boot sequence"
      }
    >
      <Radio size={14} className="fleet-command__icon" aria-hidden />
      <span className="fleet-command__label hidden min-[420px]:inline">{label}</span>
      <span className="fleet-command__label min-[420px]:hidden">{shortLabel}</span>
    </button>
  );
}
