import { useEffect, useState } from "react";
import { Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import StripeSecureCheckout, { type SpecialTierId } from "../components/checkout/StripeSecureCheckout";
import { HANGAR_PRO_STRIPE } from "../data/stripeProducts";

type ServiceTier = {
  id: SpecialTierId;
  name: string;
  kicker: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  paymentLink?: string;
};

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "founder",
    name: "Founder Special",
    kicker: "Limited launch rate",
    price: "$19.95",
    period: "/mo",
    description:
      "Early-adopter access to the USJET hangar: full fleet routing, Intel monitors, and founder-priority support.",
    features: [
      "All 30 AI cockpit bays",
      "Intel market dual-feed",
      "Founder priority lane",
      "Cancel anytime",
    ],
    highlighted: true,
    paymentLink: import.meta.env.VITE_STRIPE_FOUNDER_PAYMENT_LINK?.trim() || "https://buy.stripe.com/your_stripe_link_here",
  },
  {
    id: "hangar-pro",
    name: HANGAR_PRO_STRIPE.name,
    kicker: "Operator tier",
    price: HANGAR_PRO_STRIPE.priceDisplay,
    period: HANGAR_PRO_STRIPE.period,
    description: HANGAR_PRO_STRIPE.description,
    features: [
      "Real-time AI Fleet networking",
      "30-unit Hangar connectivity",
      "Live Intel Pulse (Crypto/NYSE)",
      "Direct flight links — no dead iframes",
    ],
    paymentLink: import.meta.env.VITE_STRIPE_PRO_PAYMENT_LINK?.trim(),
  },
  {
    id: "fleet-command",
    name: "Fleet Command",
    kicker: "Enterprise hangar",
    price: "$199",
    period: "/mo",
    description:
      "Command-level control for distributed crews: custom domains, SLA routing, and dedicated liaison.",
    features: [
      "Unlimited workbench bays",
      "Custom fleet manifest",
      "Dedicated success liaison",
      "SSO + audit exports",
    ],
    paymentLink: import.meta.env.VITE_STRIPE_ENTERPRISE_PAYMENT_LINK?.trim(),
  },
];

const Special = () => {
  const [selectedTierId, setSelectedTierId] = useState<SpecialTierId>("founder");

  const selectedTier = SERVICE_TIERS.find((tier) => tier.id === selectedTierId) ?? SERVICE_TIERS[0];

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Founder Special · USJet.ai";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="special-page page-atmosphere mx-auto max-w-6xl px-4 pb-28 pt-36 sm:px-6 lg:px-8">
      <header className="special-page__header mb-12 border-b border-white/10 pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-black uppercase tracking-[0.35em] text-cyan-300/90">
          <ShieldCheck size={20} className="shrink-0" aria-hidden />
          <span>Secure founder pricing</span>
        </div>
        <h1 className="font-aviation text-5xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl">
          Choose Your <span className="text-blue-500">Hangar Tier</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/65">
          Liquid-glass access to the USJET fleet. Select a tier, then complete secure checkout—powered by
          Stripe.
        </p>
      </header>

      <div className="special-page__tiers grid gap-5 lg:grid-cols-3">
        {SERVICE_TIERS.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          const isHighlighted = tier.highlighted === true;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTierId(tier.id)}
              aria-pressed={isSelected}
              className={[
                "special-tier-card text-left",
                isHighlighted ? "special-tier-card--featured" : "",
                isSelected ? "special-tier-card--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <GlassEffectContainer
                className={[
                  "special-tier-card__glass glass-effect glass-effect--rounded-rect liquid-glass-background h-full w-full flex-col items-stretch gap-0 p-0",
                  isHighlighted ? "glass-tint-blue" : "glass-tint-cyan",
                ].join(" ")}
              >
                {isHighlighted ? (
                  <span className="special-tier-card__badge">
                    <Sparkles size={12} aria-hidden />
                    Founder rate
                  </span>
                ) : null}

                <div className="special-tier-card__body">
                  <p className="special-tier-card__kicker">{tier.kicker}</p>
                  <h2 className="special-tier-card__name">{tier.name}</h2>
                  <p className="special-tier-card__price">
                    {tier.price}
                    <span className="special-tier-card__period">{tier.period}</span>
                  </p>
                  <p className="special-tier-card__description">{tier.description}</p>

                  <ul className="special-tier-card__features">
                    {tier.features.map((feature) => (
                      <li key={feature} className="special-tier-card__feature">
                        <Check size={14} aria-hidden className="special-tier-card__check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="special-tier-card__footer">
                  <span className="special-tier-card__cta">
                    {isSelected ? (
                      <>
                        <Zap size={14} aria-hidden />
                        Selected for checkout
                      </>
                    ) : (
                      "Select tier"
                    )}
                  </span>
                </div>
              </GlassEffectContainer>
            </button>
          );
        })}
      </div>

      <section className="special-checkout" aria-labelledby="special-checkout-heading">
        <GlassEffectContainer className="special-checkout__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan flex-col items-stretch gap-0 p-0">
          <div className="special-checkout__header">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-cyan-300" aria-hidden />
              <div>
                <p className="special-checkout__eyebrow">Stripe-secured</p>
                <h2 id="special-checkout-heading" className="special-checkout__title">
                  Secure Checkout
                </h2>
              </div>
            </div>
            <p className="special-checkout__summary">
              {selectedTier.name} · {selectedTier.price}
              {selectedTier.period}
            </p>
          </div>

          <StripeSecureCheckout
            tierId={selectedTier.id}
            tierLabel={selectedTier.name}
            amountLabel={`${selectedTier.price}${selectedTier.period}`}
            paymentLink={selectedTier.paymentLink}
          />
        </GlassEffectContainer>
      </section>
    </div>
  );
};

export default Special;
