import { PLATFORM_LABELS } from "../data/fleetCapabilities";
import type { FleetCapabilities } from "../types/fleet";

export const LIVE_TERMINAL_TILE_ENTER = "usjet-live-terminal-tile-enter";
export const LIVE_TERMINAL_TILE_LEAVE = "usjet-live-terminal-tile-leave";

export type LiveTerminalTileDetail = {
  feed: string;
};

export function buildFleetTileTerminalFeed(opts: {
  name: string;
  callsign: string;
  domain: string;
  slot?: number;
  personality?: string;
  capabilities?: FleetCapabilities;
  isCommandBay?: boolean;
  expandInteractive?: boolean;
}): string {
  const parts: string[] = [];

  if (opts.isCommandBay) {
    parts.push("COMMAND NODE");
  } else if (opts.expandInteractive) {
    parts.push("USJET FLEET · CONSENSUS BAY");
  }

  if (typeof opts.slot === "number") {
    parts.push(`BAY ${String(opts.slot + 1).padStart(2, "0")}`);
  }

  if (opts.personality) {
    parts.push(opts.personality.toUpperCase());
  }

  parts.push(opts.name.toUpperCase());
  parts.push(opts.callsign);
  parts.push(opts.domain.toUpperCase());

  if (opts.capabilities) {
    const { inputModes, platforms } = opts.capabilities;
    if (inputModes === "text" || inputModes === "both") {
      parts.push("TYPE");
    }
    if (inputModes === "voice" || inputModes === "both") {
      parts.push("VOICE");
    }
    for (const platform of platforms) {
      parts.push((PLATFORM_LABELS[platform] ?? platform).toUpperCase());
    }
  }

  parts.push("HANDOFF READY");
  return parts.join(" · ");
}

export function publishLiveTerminalTile(feed: string): void {
  window.dispatchEvent(
    new CustomEvent<LiveTerminalTileDetail>(LIVE_TERMINAL_TILE_ENTER, {
      detail: { feed },
    }),
  );
}

export function clearLiveTerminalTile(): void {
  window.dispatchEvent(new CustomEvent(LIVE_TERMINAL_TILE_LEAVE));
}
