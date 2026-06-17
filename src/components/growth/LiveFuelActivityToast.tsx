import { useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";
import {
  FOUNDERS_FUEL_ACTIVITY_CITIES,
  FOUNDERS_FUEL_ACTIVITY_LABELS,
} from "../../data/foundersFuel";

type ToastItem = {
  id: string;
  city: string;
  label: string;
};

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function buildToast(): ToastItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    city: pickRandom(FOUNDERS_FUEL_ACTIVITY_CITIES),
    label: pickRandom(FOUNDERS_FUEL_ACTIVITY_LABELS),
  };
}

type LiveFuelActivityToastProps = {
  enabled?: boolean;
};

export default function LiveFuelActivityToast({ enabled = true }: LiveFuelActivityToastProps) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const showNext = () => {
      setToast(buildToast());
      setVisible(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => setVisible(false), 4200);
    };

    const firstDelay = window.setTimeout(showNext, 2400);
    intervalRef.current = window.setInterval(showNext, 9000);

    const onFuelUpdate = () => {
      setToast({
        id: `live-${Date.now()}`,
        city: pickRandom(FOUNDERS_FUEL_ACTIVITY_CITIES),
        label: "just fueled the mission",
      });
      setVisible(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => setVisible(false), 5200);
    };
    window.addEventListener("usjet-fuel-metrics-updated", onFuelUpdate);

    return () => {
      window.clearTimeout(firstDelay);
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener("usjet-fuel-metrics-updated", onFuelUpdate);
    };
  }, [enabled]);

  if (!enabled || !toast) {
    return null;
  }

  return (
    <div
      className={["fuel-activity-toast", visible ? "fuel-activity-toast--visible" : ""].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
    >
      <Flame size={14} aria-hidden className="fuel-activity-toast__icon" />
      <span className="fuel-activity-toast__copy">
        New Fleet Supporter from <strong>{toast.city}</strong> {toast.label}
      </span>
    </div>
  );
}
