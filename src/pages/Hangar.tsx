import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HangarBayGrid from "../components/hangar/HangarBayGrid";
import HangarBayTile from "../components/hangar/HangarBayTile";
import HangarStartMissionBox from "../components/hangar/HangarStartMissionBox";
import HangarToolWorkbench from "../components/hangar/HangarToolWorkbench";
import HangarPageHeader, { HANGAR_META_DESCRIPTION } from "../components/hangar/HangarPageHeader";
import { useMemberAuth } from "../context/MemberAuthContext";
import { getHangarUnits } from "../data/hangarManifest";
import type { HangarStartMissionOption } from "../data/hangarStartMissions";
import { useHangarGridExpansions } from "../hooks/useHangarGridExpansions";
import { useHangarColumnLayout } from "../hooks/useHangarColumnLayout";
import {
  getHangarBayLimit,
  hangarBayHeroBadge,
  hangarBayLimitToast,
} from "../lib/memberAccessLevel";
import { resolveFounderPaymentLink } from "../lib/stripePaymentLink";
import { type FleetUnit } from "../types/fleet";

const hangarUnits = getHangarUnits();
const unitBySlot = new Map<number, FleetUnit>(hangarUnits.map((unit) => [unit.slot, unit]));

export default function Hangar() {
  const location = useLocation();
  const { session } = useMemberAuth();
  const bayLimit = getHangarBayLimit(session);
  const bayToast = hangarBayLimitToast(session);
  const bayBadge = hangarBayHeroBadge(session);
  const flightPassUrl = resolveFounderPaymentLink();
  const { columns, setColumnLayout } = useHangarColumnLayout();
  const { tryExpand, openExpansion, closeExpansion, expansions, workbenchFullToast } =
    useHangarGridExpansions(unitBySlot, bayLimit);
  const [focusedSlot, setFocusedSlot] = useState<number | null>(null);
  const autoExpandedSlotRef = useRef<number | null>(null);

  const handleCloseExpansion = useCallback(
    (slot: number) => {
      setFocusedSlot((current) => (current === slot ? null : current));
      closeExpansion(slot);
    },
    [closeExpansion],
  );

  const handleToggleFocus = useCallback((slot: number) => {
    setFocusedSlot((current) => (current === slot ? null : slot));
  }, []);

  const handleStartMission = useCallback(
    (option: HangarStartMissionOption) => {
      const unit = unitBySlot.get(option.hangarSlot);
      if (!unit) return;

      openExpansion(unit);
      setFocusedSlot(option.hangarSlot);

      window.requestAnimationFrame(() => {
        const bay = document.querySelector(
          `[data-hangar-slot="${option.hangarSlot}"]`,
        ) as HTMLElement | null;
        bay?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },
    [openExpansion],
  );

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;

    document.title = "USJet.ai · Hangar";
    meta?.setAttribute("content", HANGAR_META_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) {
        meta.setAttribute("content", prevDescription);
      }
    };
  }, []);

  useEffect(() => {
    const state = location.state as { expandSlot?: number } | null;
    const slot = state?.expandSlot;
    if (typeof slot !== "number") return;
    if (autoExpandedSlotRef.current === slot) return;

    const targetUnit = unitBySlot.get(slot);
    if (!targetUnit) return;

    autoExpandedSlotRef.current = slot;
    tryExpand(targetUnit);
  }, [location.state, tryExpand]);

  const expandedSlots = useMemo(() => new Set(expansions.map((entry) => entry.slot)), [expansions]);

  useEffect(() => {
    if (focusedSlot !== null && !expandedSlots.has(focusedSlot)) {
      setFocusedSlot(null);
    }
  }, [expandedSlots, focusedSlot]);

  const bayCells = useMemo(
    () =>
      hangarUnits.map((unit) =>
        expandedSlots.has(unit.slot) ? (
          <div key={`hangar-workbench-${unit.slot}`} data-hangar-slot={unit.slot}>
            <HangarToolWorkbench
              unit={unit}
              focused={focusedSlot === unit.slot}
              onToggleFocus={() => handleToggleFocus(unit.slot)}
              onClose={() => handleCloseExpansion(unit.slot)}
            />
          </div>
        ) : (
          <div key={`hangar-bay-${unit.slot}`} data-hangar-slot={unit.slot}>
            <HangarBayTile unit={unit} onOpenBay={() => tryExpand(unit)} />
          </div>
        ),
      ),
    [tryExpand, handleCloseExpansion, handleToggleFocus, expandedSlots, focusedSlot],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={[
        "hangar-page hangar-page--workbench relative",
        expandedSlots.size > 0 ? "hangar-page--bay-open" : "",
        focusedSlot !== null ? "hangar-page--bay-focused" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {workbenchFullToast ? (
        <div
          className={[
            "intel-hangar-toast",
            bayToast.showUpgradeLink ? "intel-hangar-toast--actionable" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="intel-hangar-toast__title">{bayToast.title}</p>
          <p className="intel-hangar-toast__body">
            {bayToast.body}
            {bayToast.showUpgradeLink ? (
              <>
                {" "}
                <a
                  href={flightPassUrl}
                  className="intel-hangar-toast__link"
                  data-usjet-external-leak="true"
                >
                  Unlock with Flight Pass · $19.90/mo
                </a>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
        <HangarPageHeader
          session={session}
          bayBadge={bayBadge}
          bayLimit={bayLimit}
          columns={columns}
          onColumnLayoutChange={setColumnLayout}
        />

        <HangarStartMissionBox onLaunchMission={handleStartMission} />

        <HangarBayGrid columns={columns}>{bayCells}</HangarBayGrid>
      </div>
    </motion.div>
  );
}
