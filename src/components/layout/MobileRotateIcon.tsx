type MobileRotateIconProps = {
  className?: string;
  large?: boolean;
};

/** Pink rotate-to-landscape glyph (phones + arrow) for nav box and /landscape hero. */
export default function MobileRotateIcon({ className = "", large = false }: MobileRotateIconProps) {
  return (
    <img
      src="/mobile-rotate-phones.svg"
      alt=""
      className={["mobile-rotate-cue__icon", large ? "mobile-rotate-cue__icon--large" : "", className]
        .filter(Boolean)
        .join(" ")}
      width={large ? 72 : 18}
      height={large ? 50 : 13}
      decoding="async"
      draggable={false}
    />
  );
}
