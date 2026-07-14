/**
 * Hangar floor = Fleet runway.
 * Same 30 AI websites / callsigns — Hangar opens them in workbench tabs
 * (direct iframe when allowed; same-origin cockpit embed + handoff when blocked).
 */
import {
  fleetManifest,
  getFleetUnitByCallName,
  getFleetUnitById,
  verifyFleetCallName,
} from "./fleetManifest";
import type { FleetUnit } from "../types/fleet";

export const hangarManifest: FleetUnit[] = fleetManifest;

export const HANGAR_MANIFEST = hangarManifest;

export function getHangarUnits(): FleetUnit[] {
  return [...hangarManifest].sort((a, b) => a.slot - b.slot);
}

export function getHangarUnitById(id: string): FleetUnit | undefined {
  return getFleetUnitById(id);
}

/** Unified identity lookup: developer login/verification resolves by Call Name. */
export function getHangarUnitByCallName(callName: string): FleetUnit | undefined {
  return getFleetUnitByCallName(callName);
}

export function verifyHangarCallName(callName: string): boolean {
  return verifyFleetCallName(callName);
}
