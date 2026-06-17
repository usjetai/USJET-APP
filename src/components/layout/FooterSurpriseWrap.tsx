import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { useFooterSurprise } from "../../hooks/useFooterSurprise";

type FooterSurpriseWrapProps = {
  /** Stable id per chip — offsets timers so buttons do not pulse in unison. */
  chipId: string;
  children: ReactNode;
};

function mergeSurpriseClass(existing: string | undefined, surprise: string): string {
  return [existing, surprise].filter(Boolean).join(" ");
}

/**
 * Adds three staggered random visual bursts on top of each footer chip’s normal behavior.
 */
export default function FooterSurpriseWrap({ chipId, children }: FooterSurpriseWrapProps) {
  const surpriseClass = useFooterSurprise(chipId);

  if (isValidElement(children)) {
    const el = children as ReactElement<{ className?: string }>;
    return cloneElement(el, {
      className: mergeSurpriseClass(el.props.className, surpriseClass),
    });
  }

  return <span className={`footer-surprise-wrap ${surpriseClass}`}>{children}</span>;
}
