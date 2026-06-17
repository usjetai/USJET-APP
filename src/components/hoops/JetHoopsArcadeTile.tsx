import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  JET_HOOPS_ARCADE_LABEL,
  JET_HOOPS_ARCADE_URL,
  JET_HOOPS_ROUTE,
} from "../../data/jetHoops";
import { hangarWorkbenchIframeSrc } from "../../lib/intelGridExpansion";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

/** Always-open hangar tile — launches CrazyGames basketball on first paint (same window). */
export default function JetHoopsArcadeTile() {
  const navigate = useNavigate();
  const launchedRef = useRef(false);
  const [arming, setArming] = useState(true);

  const launchUrl = useMemo(
    () =>
      wrapExternalInCockpit(JET_HOOPS_ARCADE_URL, {
        returnTo: JET_HOOPS_ROUTE,
        label: JET_HOOPS_ARCADE_LABEL,
        directHandoff: true,
      }),
    [],
  );

  const tilePreviewSrc = useMemo(
    () =>
      hangarWorkbenchIframeSrc(JET_HOOPS_ARCADE_URL, {
        label: JET_HOOPS_ARCADE_LABEL,
        returnTo: JET_HOOPS_ROUTE,
      }),
    [],
  );

  useEffect(() => {
    if (launchedRef.current) {
      return;
    }
    launchedRef.current = true;
    navigate(launchUrl, { replace: true });
  }, [launchUrl, navigate]);

  return (
    <article
      className="hangar-tool-workbench hangar-tool-workbench--tile-only jet-hoops-arcade-tile"
      aria-label={`${JET_HOOPS_ARCADE_LABEL} arcade bay`}
    >
      <div className="jet-hoops-arcade-tile__chrome" aria-live="polite">
        <p className="jet-hoops-arcade-tile__kicker">Arcade bay · open</p>
        <h2 className="jet-hoops-arcade-tile__title">{JET_HOOPS_ARCADE_LABEL}</h2>
        <p className="jet-hoops-arcade-tile__copy">
          Opening the basketball arcade in the sovereign cockpit — same window, no external tab leak.
        </p>
      </div>
      <iframe
        className={[
          "hangar-tool-workbench__frame",
          arming ? "hangar-iframe--arming" : "hangar-iframe--ready",
        ].join(" ")}
        title={`${JET_HOOPS_ARCADE_LABEL} · USJET arcade tile`}
        src={tilePreviewSrc}
        onLoad={() => setArming(false)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </article>
  );
}
