import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ZelleFuelPanel from "./ZelleFuelPanel";

type ZelleFuelModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ZelleFuelModal({ open, onClose }: ZelleFuelModalProps) {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, handleKey]);

  if (!open) return null;

  return createPortal(
    <div className="zelle-fuel-modal" role="dialog" aria-modal="true" aria-label="Zelle direct fuel — scan to pay">
      <button type="button" className="zelle-fuel-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="zelle-fuel-modal__dialog">
        <button type="button" className="zelle-fuel-modal__close btn-glass glass-effect-interactive" onClick={onClose}>
          <X size={16} aria-hidden />
          <span className="zelle-fuel-modal__close-label">Close</span>
        </button>
        <ZelleFuelPanel />
      </div>
    </div>,
    document.body,
  );
}
