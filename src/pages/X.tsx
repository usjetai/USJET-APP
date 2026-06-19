import { useEffect } from "react";
import XTelemetryPage from "../components/social/XTelemetryPage";
import { X_PROFILE_MANIFEST } from "../data/xFlightFeed";

export default function X() {
  useEffect(() => {
    const prev = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";

    document.title = `X Signal Deck · ${X_PROFILE_MANIFEST.handle} | USJET`;
    meta?.setAttribute(
      "content",
      `Live X telemetry for ${X_PROFILE_MANIFEST.handle} — sovereign social proof on USJET.AI.`,
    );

    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return <XTelemetryPage />;
}
