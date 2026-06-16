import { type HTMLAttributes, type ReactNode } from "react";
import {
  buildDeveloperRedBlinkPattern,
  developerRedBlinkClass,
  isDeveloperRedBlinkName,
} from "../lib/developerRedBlink";
import { isFleetBayHired } from "../data/fleetRoster";

type DeveloperRedBlinkNameProps = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  slot?: number;
  nonHiredLabel?: string;
};

export const NON_HIRED_DEVELOPER_LABEL = "Available position";

export function getVisibleDeveloperName(
  name: string,
  slot?: number,
  nonHiredLabel = NON_HIRED_DEVELOPER_LABEL,
): string {
  const canShowRealName = typeof slot === "number" ? isFleetBayHired(slot) : isDeveloperRedBlinkName(name);
  return canShowRealName ? name : nonHiredLabel;
}

/** Renders a fleet developer name with `.developer-red-blink` when on the sovereign list. */
export default function DeveloperRedBlinkName({
  name,
  slot,
  className,
  nonHiredLabel = NON_HIRED_DEVELOPER_LABEL,
  ...rest
}: DeveloperRedBlinkNameProps) {
  const visibleName = getVisibleDeveloperName(name, slot, nonHiredLabel);
  const merged = [className, developerRedBlinkClass(visibleName)].filter(Boolean).join(" ") || undefined;

  return (
    <span className={merged} {...rest}>
      {visibleName}
    </span>
  );
}

const DEVELOPER_NAME_PATTERN = buildDeveloperRedBlinkPattern();

/** Wraps developer names inside plain text with red-blink spans. */
export function highlightDeveloperNamesInText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(DEVELOPER_NAME_PATTERN.source, DEVELOPER_NAME_PATTERN.flags);

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<DeveloperRedBlinkName key={`${match.index}-${match[0]}`} name={match[0]} />);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? text : <>{parts}</>;
}

/** Highlights a fleet unit name inside a co-pilot label such as "Stick Co-Pilot". */
export function highlightDeveloperCoPilotName(copilotName: string): ReactNode {
  const trimmed = copilotName.trim();
  const suffix = " Co-Pilot";
  if (!trimmed.endsWith(suffix)) {
    return isDeveloperRedBlinkName(trimmed) ? highlightDeveloperNamesInText(trimmed) : NON_HIRED_DEVELOPER_LABEL;
  }

  const fleetName = trimmed.slice(0, -suffix.length);
  if (!isDeveloperRedBlinkName(fleetName)) {
    return `${NON_HIRED_DEVELOPER_LABEL}${suffix}`;
  }

  return (
    <>
      <DeveloperRedBlinkName name={fleetName} />
      {suffix}
    </>
  );
}
