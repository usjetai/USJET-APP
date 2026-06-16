import { Fragment, useMemo, type ReactNode } from "react";
import { isDeveloperRedBlinkName } from "../lib/developerRedBlink";

/** Highlights sovereign developer names inside plain-text streams (e.g. live terminal uplink). */
export default function DeveloperRedBlinkText({ text }: { text: string }) {
  const nodes = useMemo(() => highlightDeveloperNames(text), [text]);

  return <>{nodes}</>;
}

function highlightDeveloperNames(text: string): ReactNode[] {
  const segments = text.split(/( · )/);

  return segments.map((segment, index) => {
    if (segment === " · ") {
      return segment;
    }

    if (isDeveloperRedBlinkName(segment)) {
      return (
        <span key={index} className="developer-red-blink">
          {segment}
        </span>
      );
    }

    return <Fragment key={index}>{segment}</Fragment>;
  });
}
