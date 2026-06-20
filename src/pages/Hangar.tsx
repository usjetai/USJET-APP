import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import HangarBayGrid from "../components/hangar/HangarBayGrid";
import HangarBayTile from "../components/hangar/HangarBayTile";
import HangarIsolatedBayPortal from "../components/hangar/HangarIsolatedBayPortal";
import SilentBackgroundYouTube from "../components/media/SilentBackgroundYouTube";
import HangarPageHeader, { HANGAR_META_DESCRIPTION } from "../components/hangar/HangarPageHeader";
import { useMemberAuth } from "../context/MemberAuthContext";
import { fleetManifest } from "../data/fleetManifest";
import { useHangarGridExpansions } from "../hooks/useHangarGridExpansions";
import { useHangarColumnLayout } from "../hooks/useHangarColumnLayout";
import {
  getHangarBayLimit,
  hangarBayHeroBadge,
  hangarBayLimitToast,
} from "../lib/memberAccessLevel";
import { type FleetUnit } from "../types/fleet";

const hangarUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);
const unitBySlot = new Map<number, FleetUnit>(hangarUnits.map((unit) => [unit.slot, unit]));

export default function Hangar() {
  const location = useLocation();
  const { session } = useMemberAuth();
  const bayLimit = getHangarBayLimit(session);
  const bayToast = hangarBayLimitToast(session);
  const bayBadge = hangarBayHeroBadge(session);
  const { columns, setColumnLayout } = useHangarColumnLayout();
  const { tryExpand, closeExpansion, expansions, workbenchFullToast } = useHangarGridExpansions(
    unitBySlot,
    bayLimit,
  );
  const autoExpandedSlotRef = useRef<number | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;

    document.title = "Hangar · USJet.ai";
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

  const bayCells = useMemo(
    () =>
      hangarUnits.map((unit) => (
        <HangarBayTile key={`hangar-bay-${unit.slot}`} unit={unit} onOpenBay={() => tryExpand(unit)} />
      )),
    [tryExpand],
  );

  const expandedSlots = useMemo(() => new Set(expansions.map((entry) => entry.slot)), [expansions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={[
        "hangar-page hangar-page--workbench relative",
        expandedSlots.size > 0 ? "hangar-page--bay-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Background audio-only YouTube — hidden element that autoplays muted and will unmute when Silent Hangar is armed */}
      <SilentBackgroundYouTube videoId="BT_83vSP1es" />
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
                <Link to="/special" className="intel-hangar-toast__link">
                  Upgrade clearance
                </Link>
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

        <HangarBayGrid columns={columns}>{bayCells}</HangarBayGrid>
      </div>

      <HangarIsolatedBayPortal expansions={expansions} onClose={closeExpansion} />
    </motion.div>
  );
}
