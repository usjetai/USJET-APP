import { ZELLE_BOX_HOVER, ZELLE_FUEL_RECIPIENT, ZELLE_QR_IMAGE_SRC, ZELLE_SCAN_ALT } from "../../data/directFuelZelle";

type ZelleFuelPanelProps = {
  className?: string;
};

/** White scan card — full flyer image for phone capture. */
export default function ZelleFuelPanel({ className = "" }: ZelleFuelPanelProps) {
  return (
    <div className={["zelle-fuel-panel", className].filter(Boolean).join(" ")}>
      <div className="zelle-fuel-panel__box" title={ZELLE_BOX_HOVER}>
        <img
          src={ZELLE_QR_IMAGE_SRC}
          alt={ZELLE_SCAN_ALT}
          className="zelle-fuel-panel__qr"
          width={320}
          height={480}
          decoding="async"
        />
      </div>
      <p className="zelle-fuel-panel__caption">
        Pay <strong>{ZELLE_FUEL_RECIPIENT}</strong> · scan inside your bank&apos;s Zelle screen
      </p>
      <p className="zelle-fuel-panel__hint" role="note">
        {ZELLE_BOX_HOVER}
      </p>
    </div>
  );
}
