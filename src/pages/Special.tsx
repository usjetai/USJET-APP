import { useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import StripeSecureCheckout, { type SpecialTierId } from "../components/checkout/StripeSecureCheckout";
import { WRENCHES_PHILOSOPHY } from "../data/founderManifesto";
import {
  FLIGHT_PASS_STRIPE,
  FLEET_COMMANDER_STRIPE,
  HANGAR_PRO_STRIPE,
  type StripeTierProduct,
} from "../data/stripeProducts";
import {
  resolveEnterprisePaymentLink,
  resolveFounderPaymentLink,
  resolveHangarProPaymentLink,
} from "../lib/stripePaymentLink";

type ServiceTier = StripeTierProduct & {
  paymentLink?: string;
};

const SERVICE_TIERS: ServiceTier[] = [
  {
    ...FLIGHT_PASS_STRIPE,
    paymentLink: resolveFounderPaymentLink(),
  },
  {
    ...HANGAR_PRO_STRIPE,
    paymentLink: resolveHangarProPaymentLink(),
  },
  {
    ...FLEET_COMMANDER_STRIPE,
    paymentLink: resolveEnterprisePaymentLink(),
  },
];

const VALUE_LADDER = [
  { label: "Hangar", detail: "30 AI cockpit bays — one sovereign switchboard" },
  { label: "Intel", detail: "Crypto & NYSE pulse — institutional-grade board" },
  { label: "Fleet Protocol", detail: "Integrated navigation — no dead iframes, one cockpit" },
  { label: "Member ID", detail: "Stripe-issued clearance — gate unlock on every route" },
] as const;

const Special = () => {
  const [selectedTierId, setSelectedTierId] = useState<SpecialTierId>("founder");

  const selectedTier = useMemo(
    () => SERVICE_TIERS.find((tier) => tier.id === selectedTierId) ?? SERVICE_TIERS[0],
    [selectedTierId],
  );

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sovereign Access · USJet.ai";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="special-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:px-8">
      <header className="special-page__header mb-12 border-b border-white/10 pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-black uppercase tracking-[0.35em] text-cyan-300/90">
          <ShieldCheck size={20} className="shrink-0" aria-hidden />
          <span>Sovereign cockpit access · bank-ready</span>
        </div>
        <h1 className="font-aviation text-5xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl">
          Put Your Money <span className="text-blue-500">On The Screen</span>
        </h1>
        <p className="special-page__lead mt-5 max-w-3xl text-base font-medium leading-relaxed text-white/70 sm:text-lg">
          This is not an investor pitch deck. It is the USJET sovereign cockpit—a 30-unit AI hangar built
          from shop-floor grit for operators who turn wrenches, not slides. Pick your clearance. Stripe
          issues your Member ID. You fly same-window—always in the cockpit.
        </p>

        <div className="special-page__mandate mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
          <Wrench size={14} className="text-cyan-300/90" aria-hidden />
          <span className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-white/75">
            {WRENCHES_PHILOSOPHY}
          </span>
          <span className="text-white/25" aria-hidden>
            ·
          </span>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/55">
            Launch rates live in test — institutional grade
          </span>
        </div>

        <ul className="special-page__ladder mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_LADDER.map((item) => (
            <li key={item.label} className="special-page__ladder-item">
              <span className="special-page__ladder-label">{item.label}</span>
              <span className="special-page__ladder-detail">{item.detail}</span>
            </li>
          ))}
        </ul>
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
                {tier.badge ? (
                  <span className="special-tier-card__badge">
                    <Sparkles size={12} aria-hidden />
                    {tier.badge}
                  </span>
                ) : null}

                <div className="special-tier-card__body">
                  <p className="special-tier-card__kicker">{tier.hook}</p>
                  <h2 className="special-tier-card__name">{tier.name}</h2>
                  <p className="special-tier-card__price">
                    {tier.priceDisplay}
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

                  <p className="special-tier-card__descriptor">
                    Card statement: <code>{tier.statementDescriptor}</code>
                  </p>
                </div>

                <div className="special-tier-card__footer">
                  <span className="special-tier-card__cta">
                    {isSelected ? (
                      <>
                        <Zap size={14} aria-hidden />
                        Cleared for checkout
                      </>
                    ) : (
                      `Select ${tier.name}`
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
                <p className="special-checkout__eyebrow">Stripe-secured · PCI compliant</p>
                <h2 id="special-checkout-heading" className="special-checkout__title">
                  Authorize Clearance
                </h2>
              </div>
            </div>
            <p className="special-checkout__summary">
              {selectedTier.name} · {selectedTier.priceDisplay}
              {selectedTier.period}
            </p>
          </div>

          <p className="special-checkout__trust">
            Your payment unlocks Hangar, Intel, Fleet Protocol, and a Stripe Member ID for cockpit gate
            access. Cancel anytime. One ship, one cockpit—no external tabs.
          </p>

          <StripeSecureCheckout
            tierId={selectedTier.id}
            tierLabel={selectedTier.name}
            amountLabel={`${selectedTier.priceDisplay}${selectedTier.period}`}
            statementDescriptor={selectedTier.statementDescriptor}
            paymentLink={selectedTier.paymentLink}
          />
        </GlassEffectContainer>
      </section>

    </div>
  );
};

export default Special;
