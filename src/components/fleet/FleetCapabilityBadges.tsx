import { Apple, Globe, Keyboard, Mic, Monitor, Smartphone } from "lucide-react";
import { PLATFORM_LABELS } from "../../data/fleetCapabilities";
import type { FleetCapabilities, FleetPlatform } from "../../types/fleet";

type FleetCapabilityBadgesProps = {
  capabilities: FleetCapabilities;
};

function PlatformIcon({ platform }: { platform: FleetPlatform }) {
  const className = "fleet-cap-badge__icon";
  switch (platform) {
    case "web":
      return <Globe size={10} className={className} aria-hidden />;
    case "mac":
      return <Apple size={10} className={className} aria-hidden />;
    case "windows":
      return <Monitor size={10} className={className} aria-hidden />;
    case "ios":
    case "android":
      return <Smartphone size={10} className={className} aria-hidden />;
    default:
      return <Globe size={10} className={className} aria-hidden />;
  }
}

export default function FleetCapabilityBadges({ capabilities }: FleetCapabilityBadgesProps) {
  const { inputModes, platforms } = capabilities;
  const showText = inputModes === "text" || inputModes === "both";
  const showVoice = inputModes === "voice" || inputModes === "both";

  return (
    <div className="fleet-cap-badges" aria-label="Partner capabilities">
      {showText ? (
        <span className="fleet-cap-badge">
          <Keyboard size={10} className="fleet-cap-badge__icon" aria-hidden />
          <span>Type</span>
        </span>
      ) : null}
      {showVoice ? (
        <span className="fleet-cap-badge">
          <Mic size={10} className="fleet-cap-badge__icon" aria-hidden />
          <span>Voice</span>
        </span>
      ) : null}
      {platforms.map((platform) => (
        <span key={platform} className="fleet-cap-badge fleet-cap-badge--platform">
          <PlatformIcon platform={platform} />
          <span>{PLATFORM_LABELS[platform]}</span>
        </span>
      ))}
    </div>
  );
}
