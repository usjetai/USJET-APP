import { clearAtmosphereLive } from "./usjetAtmosphere";

export const USJET_PROTOCOL_CEREMONY_EVENT = "usjet-protocol-ceremony" as const;
export const USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT = "usjet-protocol-ceremony-complete" as const;
export const USJET_PROTOCOL_CEREMONY_START_EVENT = "usjet-protocol-ceremony-start" as const;
export const USJET_PROTOCOL_RESET_EVENT = "usjet-protocol-reset" as const;
export const LIVE_TERMINAL_ARMED_STORAGE_KEY = "usjet-live-terminal-armed" as const;
export const PROTOCOL_LOCK_SYNCED_STORAGE_KEY = "usjet-fleet-protocol-lock-synced" as const;
export const USJET_PROTOCOL_SYNC_BROADCAST = "usjet-protocol-sync-broadcast" as const;

/** After earthquake + liftoff — show military terminal boot overlay. */
export function dispatchProtocolCeremony(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(USJET_PROTOCOL_CEREMONY_START_EVENT));
  window.dispatchEvent(new CustomEvent(USJET_PROTOCOL_CEREMONY_EVENT));
}

export function isLiveTerminalArmed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(LIVE_TERMINAL_ARMED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Arm the persistent footer live terminal strip (survives refresh). */
export function armLiveTerminal(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(LIVE_TERMINAL_ARMED_STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT));
}

export function dispatchProtocolCeremonyComplete(): void {
  armLiveTerminal();
}

/** Sign-out / session end — restore Protocol button + hide live terminal until re-armed. */
export function resetProtocolSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(LIVE_TERMINAL_ARMED_STORAGE_KEY);
    window.localStorage.removeItem(PROTOCOL_LOCK_SYNCED_STORAGE_KEY);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(USJET_PROTOCOL_SYNC_BROADCAST));
  window.dispatchEvent(new Event(USJET_PROTOCOL_RESET_EVENT));
  clearAtmosphereLive();
}
