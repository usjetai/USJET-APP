/**
 * Stripe Payment Links open inside `/cockpit` (Integrated Navigation — no raw target=_blank).
 */
import { wrapExternalInCockpit } from "./fleetLaunchUrl";
import { resolvePaymentLinkForTier, type StripeTierPaymentId } from "./stripePaymentLink";

export function stripeCheckoutCockpitPath(returnTo: string, tierId: StripeTierPaymentId): string {
  const safeReturn = returnTo?.trim() || "/";
  const src = resolvePaymentLinkForTier(tierId);
  const label =
    tierId === "founder"
      ? "Flight Pass — Stripe"
      : tierId === "hangar-pro"
        ? "Hangar Pro — Stripe"
        : "Enterprise Commander — Stripe";
  return wrapExternalInCockpit(src, { returnTo: safeReturn, label });
}
