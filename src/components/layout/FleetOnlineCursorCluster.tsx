import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import FleetCommand from "../fleet/FleetCommand";
import { PROTOCOL_PROOF_LINK_LABEL, PROTOCOL_SESSION_PROOF_ROUTE } from "../../data/protocolSessionProof";
import {
  PROTOCOL_LOCK_SYNCED_STORAGE_KEY,
  USJET_PROTOCOL_RESET_EVENT,
  USJET_PROTOCOL_SYNC_BROADCAST,
} from "../../lib/protocolCeremony";

/** Fleet Online protocol control in the nav — ceremony + shake; no live terminal ticker. */
export default function FleetOnlineCursorCluster() {
  const [fleetOnline, setFleetOnline] = useState(false);

  const readFleetOnlineFromStorage = useCallback(() => {
    try {
      return window.localStorage.getItem(PROTOCOL_LOCK_SYNCED_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    setFleetOnline(readFleetOnlineFromStorage());

    const onSync = () => setFleetOnline(readFleetOnlineFromStorage());
    const onReset = () => setFleetOnline(false);

    window.addEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onSync);
    window.addEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onSync);
      window.removeEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    };
  }, [readFleetOnlineFromStorage]);

  const handleFleetOnlineChange = useCallback((online: boolean) => {
    setFleetOnline(online);
  }, []);

  return (
    <div
      className={["fleet-online-cursor-cluster", fleetOnline ? "fleet-online-cursor-cluster--online" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <FleetCommand onFleetOnlineChange={handleFleetOnlineChange} />
      <Link
        to={PROTOCOL_SESSION_PROOF_ROUTE}
        className="fleet-protocol-proof-link btn-glass glass-effect-interactive"
        title={`${PROTOCOL_PROOF_LINK_LABEL} — green = session saved; red = cookies cleared, sign in again`}
        aria-label={`${PROTOCOL_PROOF_LINK_LABEL} — why Protocol is red or green`}
      >
        <HelpCircle size={11} strokeWidth={2.4} aria-hidden />
      </Link>
    </div>
  );
}
