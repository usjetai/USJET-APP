import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Lock, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import type { SpecialTierId } from "../components/checkout/StripeSecureCheckout";
import { WRENCHES_PHILOSOPHY } from "../data/founderManifesto";
import {
  FLEET_COMMANDER_STRIPE,
  FLIGHT_PASS_STRIPE,
  HANGAR_PRO_STRIPE,
  type StripeTierProduct,
} from "../data/stripeProducts";
import { trackBeginCheckout } from "../lib/analytics";
import {
  isUsableStripePaymentLink,
  resolveEnterprisePaymentLink,
  resolveFounderPaymentLink,
  resolveHangarProPaymentLink,
  resolvePaymentLinkForTier,
} from "../lib/stripePaymentLink";

type ServiceTier = StripeTierProduct & {
  paymentLink: string;
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

const TIER_VALUE: Record<SpecialTierId, number> = {
  founder: 19.9,
  "hangar-pro": 49.95,
  "fleet-command": 199.99,
};

const VALUE_LADDER = [
  { label: "Hangar", detail: "Full workbench — all tabs under one clearance" },
  { label: "Fleet", detail: "30 specialized AIs — same-window cockpit launches" },
  { label: "Intel", detail: "Live Crypto + NYSE board — Hangar Pro and up" },
  { label: "Origin", detail: "Aura command node — Enterprise Commander only" },
] as const;

function launchStripeCheckout(tier: ServiceTier) {
  const url = isUsableStripePaymentLink(tier.paymentLink)
    ? tier.paymentLink
    : resolvePaymentLinkForTier(tier.id);
  if (!isUsableStripePaymentLink(url)) {
    return false;
  }
  trackBeginCheckout({ tier: tier.id, value: TIER_VALUE[tier.id], url });
  window.location.href = url;
  return true;
}

const Special = () => {
  const [searchParams] = useSearchParams();
  const [routingTierId, setRoutingTierId] = useState<SpecialTierId | null>(null);
  const [errorTierId, setErrorTierId] = useState<SpecialTierId | null>(null);

  const highlightTierId = (() => {
    const tier = searchParams.get("tier");
    if (tier === "fleet-command" || tier === "hangar-pro" || tier === "founder") {
      return tier;
    }
    return null;
  })();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Pricing · Flight Pass · Hangar Pro · Enterprise | USJet.ai";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    if (!highlightTierId) return;
    const el = document.getElementById(`pricing-tier-${highlightTierId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightTierId]);

  const handleBuy = (tier: ServiceTier) => {
    setErrorTierId(null);
    setRoutingTierId(tier.id);
    const ok = launchStripeCheckout(tier);
    if (!ok) {
      setRoutingTierId(null);
      setErrorTierId(tier.id);
    }
  };

  return (
    <div className="special-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:px-8">
      <header className="special-page__header mb-12 border-b border-white/10 pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-black uppercase tracking-[0.35em] text-cyan-300/90">
          <ShieldCheck size={20} className="shrink-0" aria-hidden />
          <span>Three clearances · three prices</span>
        </div>
        <h1 className="font-aviation text-5xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl">
          Pick Your <span className="text-blue-500">Clearance</span>
        </h1>
        <p className="special-page__lead mt-5 max-w-3xl text-base font-medium leading-relaxed text-white/70 sm:text-lg">
          Flight Pass, Hangar Pro, or Enterprise Commander. Each card has its own Stripe checkout — pick a
          tier and enter. Member ID issues on confirmation.
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
            3 tiers · Stripe Direct Landing
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

      <div className="special-page__tiers grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICE_TIERS.map((tier) => {
          const isHighlighted = tier.highlighted === true || highlightTierId === tier.id;
          const isRouting = routingTierId === tier.id;
          const checkoutReady = isUsableStripePaymentLink(tier.paymentLink);

          return (
            <article
              key={tier.id}
              id={`pricing-tier-${tier.id}`}
              className={[
                "special-tier-card",
                isHighlighted ? "special-tier-card--featured special-tier-card--selected" : "",
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
                </div>

                <div className="special-tier-card__footer">
                  <button
                    type="button"
                    className="special-tier-card__buy btn-glass-prominent glass-effect-interactive w-full justify-center"
                    disabled={isRouting || !checkoutReady}
                    onClick={() => handleBuy(tier)}
                  >
                    <Lock size={16} aria-hidden />
                    <span>
                      {isRouting
                        ? "Routing to Stripe…"
                        : `Enter — ${tier.priceDisplay}${tier.period}`}
                    </span>
                  </button>

                  {!checkoutReady || errorTierId === tier.id ? (
                    <p className="special-tier-card__buy-error" role="alert">
                      Checkout link unavailable. Try again or email ops@usjet.ai.
                    </p>
                  ) : (
                    <p className="special-tier-card__buy-note">Stripe secure checkout · Member ID on confirm</p>
                  )}
                </div>
              </GlassEffectContainer>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Special;
