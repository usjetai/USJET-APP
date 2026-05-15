import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import FleetCommand from "../fleet/FleetCommand";
import UsjetLiveTerminalTicker from "./UsjetLiveTerminalTicker";
import { PROTOCOL_PROOF_LINK_LABEL, PROTOCOL_SESSION_PROOF_ROUTE } from "../../data/protocolSessionProof";
import {
  PROTOCOL_LOCK_SYNCED_STORAGE_KEY,
  USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT,
  USJET_PROTOCOL_RESET_EVENT,
  USJET_PROTOCOL_SYNC_BROADCAST,
} from "../../lib/protocolCeremony";

/**
 * Fleet Online + live terminal cursor — grouped in the nav.
 * Terminal hidden on load; slides open after Fleet Online is activated.
 */
export default function FleetOnlineCursorCluster() {
  const [fleetOnline, setFleetOnline] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

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
    const onReset = () => {
      setFleetOnline(false);
      setTerminalOpen(false);
    };

    window.addEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onSync);
    window.addEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener(USJET_PROTOCOL_SYNC_BROADCAST, onSync);
      window.removeEventListener(USJET_PROTOCOL_RESET_EVENT, onReset);
    };
  }, [readFleetOnlineFromStorage]);

  const handleFleetOnlineChange = useCallback((online: boolean) => {
    setFleetOnline(online);
    if (!online) {
      setTerminalOpen(false);
    }
  }, []);

  const handleCeremonyComplete = useCallback(() => {
    if (readFleetOnlineFromStorage()) {
      setTerminalOpen(true);
    }
  }, [readFleetOnlineFromStorage]);

  useEffect(() => {
    window.addEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, handleCeremonyComplete);
    return () => window.removeEventListener(USJET_PROTOCOL_CEREMONY_COMPLETE_EVENT, handleCeremonyComplete);
  }, [handleCeremonyComplete]);

  const handleTerminalToggle = useCallback(() => {
    if (!fleetOnline) {
      return;
    }
    setTerminalOpen((open) => !open);
  }, [fleetOnline]);

  const handleFleetOnlineActivated = useCallback(() => {
    setTerminalOpen(true);
  }, []);

  return (
    <div
      className={[
        "fleet-online-cursor-cluster",
        fleetOnline ? "fleet-online-cursor-cluster--online" : "",
        terminalOpen ? "fleet-online-cursor-cluster--terminal-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FleetCommand
        onFleetOnlineChange={handleFleetOnlineChange}
        onTerminalToggle={handleTerminalToggle}
        onFleetOnlineActivated={handleFleetOnlineActivated}
      />
      <Link
        to={PROTOCOL_SESSION_PROOF_ROUTE}
        className="fleet-protocol-proof-link btn-glass glass-effect-interactive"
        title={`${PROTOCOL_PROOF_LINK_LABEL} — green = session saved; red = cookies cleared, sign in again`}
        aria-label={`${PROTOCOL_PROOF_LINK_LABEL} — why Protocol is red or green`}
      >
        <HelpCircle size={11} strokeWidth={2.4} aria-hidden />
      </Link>
      <div
        className="fleet-online-cursor-cluster__terminal"
        aria-hidden={!terminalOpen || !fleetOnline}
      >
        {fleetOnline && terminalOpen ? <UsjetLiveTerminalTicker variant="header" active /> : null}
      </div>
    </div>
  );
}
