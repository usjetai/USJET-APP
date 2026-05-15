import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { partnerApiPlaceholders } from "../lib/partnerApiPlaceholders";
import { submitPartnershipApplication, type PartnershipApplicationPayload } from "../lib/partnershipApplications";

const BUDGET_TIERS = [
  { value: "1m_plus", label: "$1M+ annual platform commitment" },
  { value: "2m_5m", label: "$2M – $5M" },
  { value: "5m_10m", label: "$5M – $10M" },
  { value: "10m_plus", label: "$10M+" },
] as const;

type PdreForm = {
  institutionName: string;
  department: string;
  corporateHq: string;
  contactName: string;
  contactEmail: string;
  scopeTicker: boolean;
  scopeApiGateway: boolean;
  scopeSponsorship: boolean;
  budgetTier: string;
};

const emptyForm: PdreForm = {
  institutionName: "",
  department: "",
  corporateHq: "",
  contactName: "",
  contactEmail: "",
  scopeTicker: false,
  scopeApiGateway: false,
  scopeSponsorship: false,
  budgetTier: "",
};

function makeVerificationCode(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `PDRE-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  }
  return `PDRE-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function PdrePartnership() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PdreForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PdreForm | "scopes", string>>>({});
  const [phase, setPhase] = useState<"form" | "processing" | "success">("form");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }
    const id = window.setTimeout(() => setPhase("success"), 1500);
    return () => window.clearTimeout(id);
  }, [phase]);

  const setField = <K extends keyof PdreForm>(key: K, value: PdreForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const next: typeof errors = {};
    if (!form.institutionName.trim()) {
      next.institutionName = "Institution name is required.";
    }
    if (!form.department.trim()) {
      next.department = "Department is required.";
    }
    if (!form.corporateHq.trim()) {
      next.corporateHq = "Corporate HQ is required.";
    }
    if (!form.contactName.trim()) {
      next.contactName = "Point of contact is required.";
    }
    if (!form.contactEmail.trim() || !isValidEmail(form.contactEmail)) {
      next.contactEmail = "Valid business email is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (!form.scopeTicker && !form.scopeApiGateway && !form.scopeSponsorship) {
      setErrors({ scopes: "Select at least one integration lane." });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!form.budgetTier) {
      setErrors({ budgetTier: "Select a budget tier." });
      return false;
    }
    setErrors({});
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
  };

  const handleFinalSubmit = () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }
    const code = makeVerificationCode();
    setVerificationCode(code);

    const payload: PartnershipApplicationPayload = {
      institution_name: form.institutionName.trim(),
      department: form.department.trim(),
      corporate_hq: form.corporateHq.trim(),
      contact_name: form.contactName.trim(),
      contact_email: form.contactEmail.trim().toLowerCase(),
      scope_ticker_placement: form.scopeTicker,
      scope_api_gateway: form.scopeApiGateway,
      scope_direct_sponsorship: form.scopeSponsorship,
      budget_tier: form.budgetTier,
      verification_code: code,
      submitted_at: new Date().toISOString(),
    };

    partnerApiPlaceholders.prewarm();
    void partnerApiPlaceholders.coinbaseIntegrationStub();
    void partnerApiPlaceholders.robinhoodIntegrationStub();

    void submitPartnershipApplication(payload);
    setPhase("processing");
  };

  const closeSuccess = () => {
    setPhase("form");
    setStep(1);
    setForm(emptyForm);
    setVerificationCode("");
    setErrors({});
  };

  return (
    <div className="pdre-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
      <header className="pdre-page__hero mb-10 text-center sm:mb-14">
        <p className="pdre-page__eyebrow">Prime Digital Real Estate · Institutional lane</p>
        <h1 className="pdre-page__title">Strategic Partnership Gateway</h1>
        <p className="pdre-page__lede mx-auto max-w-3xl text-pretty">
          USJET.AI concentrates the attention of America&apos;s labor force inside one sovereign cockpit. PDRE is how
          global institutions lease structured placement—not affiliate crumbs—inside that daily workflow.
        </p>
      </header>

      <section className="pdre-page__value mb-12" aria-labelledby="pdre-value-heading">
        <h2 id="pdre-value-heading" className="sr-only">
          Value proposition
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Reach",
              body: "Blue-collar operators, maintainers, and builders check fleet vitals and institutional lanes repeatedly—your brand sits in the same glass as their shift, not a banner farm.",
            },
            {
              title: "Sovereign cockpit",
              body: "Liquid Glass command surfaces read as terminal-grade: reserved bays, prospectus flow, and OPS-routed diligence signal that this is publisher-owned territory, not a plugin network.",
            },
            {
              title: "Structured economics",
              body: "Retainer, placement tier, and integration scope are negotiated as platform economics. Mock telemetry holds the line until contracts close—then engineering follows paper.",
            },
          ].map((col) => (
            <GlassEffectContainer key={col.title} className="pdre-value-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
              <div className="pdre-value-card__inner">
                <h3 className="pdre-value-card__title">{col.title}</h3>
                <p className="pdre-value-card__body">{col.body}</p>
              </div>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <GlassEffectContainer className="pdre-prospectus glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="pdre-prospectus__inner">
          <div className="pdre-prospectus__head">
            <p className="pdre-prospectus__kicker">Institutional prospectus</p>
            <h2 className="pdre-prospectus__title">Partner with the Fleet</h2>
            <p className="pdre-prospectus__sub">
              Multi-step intake modeled for corporate treasury desks. USJET member authentication remains Stripe-only;
              this lane is for institutional integration and sponsorship inquiry only.
            </p>
            <ol className="pdre-steps" aria-label="Application progress">
              {[1, 2, 3].map((n) => (
                <li
                  key={n}
                  className={["pdre-steps__item", n === step ? "pdre-steps__item--active" : "", n < step ? "pdre-steps__item--done" : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="pdre-steps__num">{n}</span>
                  <span className="pdre-steps__label">
                    {n === 1 ? "Entity" : n === 2 ? "Integration" : "Commitment"}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {phase === "form" ? (
            <div className="pdre-form">
              {step === 1 ? (
                <div className="pdre-form__grid">
                  <label className="pdre-field">
                    <span className="pdre-field__label">Institution name</span>
                    <input
                      className="pdre-field__input"
                      value={form.institutionName}
                      onChange={(e) => setField("institutionName", e.target.value)}
                      placeholder="e.g., Coinbase, Robinhood"
                      autoComplete="organization"
                    />
                    {errors.institutionName ? <span className="pdre-field__error">{errors.institutionName}</span> : null}
                  </label>
                  <label className="pdre-field">
                    <span className="pdre-field__label">Department</span>
                    <input
                      className="pdre-field__input"
                      value={form.department}
                      onChange={(e) => setField("department", e.target.value)}
                      placeholder="Partnerships, BD, Treasury…"
                      autoComplete="off"
                    />
                    {errors.department ? <span className="pdre-field__error">{errors.department}</span> : null}
                  </label>
                  <label className="pdre-field pdre-field--full">
                    <span className="pdre-field__label">Corporate HQ</span>
                    <input
                      className="pdre-field__input"
                      value={form.corporateHq}
                      onChange={(e) => setField("corporateHq", e.target.value)}
                      placeholder="City · Country"
                      autoComplete="address-level1"
                    />
                    {errors.corporateHq ? <span className="pdre-field__error">{errors.corporateHq}</span> : null}
                  </label>
                  <label className="pdre-field">
                    <span className="pdre-field__label">Point of contact</span>
                    <input
                      className="pdre-field__input"
                      value={form.contactName}
                      onChange={(e) => setField("contactName", e.target.value)}
                      placeholder="Full name"
                      autoComplete="name"
                    />
                    {errors.contactName ? <span className="pdre-field__error">{errors.contactName}</span> : null}
                  </label>
                  <label className="pdre-field">
                    <span className="pdre-field__label">Business email</span>
                    <input
                      className="pdre-field__input"
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setField("contactEmail", e.target.value)}
                      placeholder="name@institution.com"
                      autoComplete="email"
                    />
                    {errors.contactEmail ? <span className="pdre-field__error">{errors.contactEmail}</span> : null}
                  </label>
                </div>
              ) : null}

              {step === 2 ? (
                <fieldset className="pdre-form__scopes">
                  <legend className="pdre-field__label pdre-field__label--legend">Integration scope (interest)</legend>
                  <p className="pdre-form__hint">
                    Final architecture is diligence-led. API gateway interest does not imply live OAuth inside member
                    login—USJET enforces Stripe-only member gates per security lock.
                  </p>
                  <label className="pdre-check">
                    <input
                      type="checkbox"
                      checked={form.scopeTicker}
                      onChange={(e) => setField("scopeTicker", e.target.checked)}
                      className="pdre-check__input"
                    />
                    <span>Ticker placement (reserved Intel lane)</span>
                  </label>
                  <label className="pdre-check">
                    <input
                      type="checkbox"
                      checked={form.scopeApiGateway}
                      onChange={(e) => setField("scopeApiGateway", e.target.checked)}
                      className="pdre-check__input"
                    />
                    <span>API gateway integration (institutional handoff, post-contract)</span>
                  </label>
                  <label className="pdre-check">
                    <input
                      type="checkbox"
                      checked={form.scopeSponsorship}
                      onChange={(e) => setField("scopeSponsorship", e.target.checked)}
                      className="pdre-check__input"
                    />
                    <span>Direct media sponsorship</span>
                  </label>
                  {errors.scopes ? <span className="pdre-field__error">{errors.scopes}</span> : null}
                </fieldset>
              ) : null}

              {step === 3 ? (
                <div className="pdre-form__commit">
                  <label className="pdre-field pdre-field--full">
                    <span className="pdre-field__label">Budget tier</span>
                    <select
                      className="pdre-field__input pdre-field__select"
                      value={form.budgetTier}
                      onChange={(e) => setField("budgetTier", e.target.value)}
                    >
                      <option value="">Select commitment band</option>
                      {BUDGET_TIERS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    {errors.budgetTier ? <span className="pdre-field__error">{errors.budgetTier}</span> : null}
                  </label>
                </div>
              ) : null}

              <div className="pdre-form__nav">
                {step > 1 ? (
                  <button type="button" className="pdre-btn pdre-btn--ghost glass-effect-interactive" onClick={goBack}>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button type="button" className="pdre-btn pdre-btn--primary glass-effect-interactive" onClick={goNext}>
                    Continue
                  </button>
                ) : (
                  <button type="button" className="pdre-btn pdre-btn--submit glass-effect-interactive" onClick={handleFinalSubmit}>
                    Submit application
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </GlassEffectContainer>

      <p className="pdre-page__return mt-10 text-center">
        <Link to="/intel" className="pdre-page__return-link glass-effect-interactive">
          Return to Intel
        </Link>
        {" · "}
        <Link to="/" className="pdre-page__return-link glass-effect-interactive">
          Fleet
        </Link>
      </p>

      {phase === "processing" ? (
        <div className="pdre-overlay" role="alertdialog" aria-live="assertive" aria-busy="true" aria-label="Processing application">
          <div className="pdre-overlay__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
            <p className="pdre-overlay__title">Processing institutional dossier</p>
            <div className="pdre-overlay__bar" aria-hidden>
              <div className="pdre-overlay__bar-fill" />
            </div>
            <p className="pdre-overlay__sub">Vetting routing · secure channel · OPS notified</p>
          </div>
        </div>
      ) : null}

      {phase === "success" ? (
        <div className="pdre-overlay" role="dialog" aria-modal="true" aria-labelledby="pdre-success-title">
          <div className="pdre-overlay__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan pdre-overlay__panel--success">
            <h2 id="pdre-success-title" className="pdre-overlay__success-title">
              Application received
            </h2>
            <p className="pdre-overlay__success-body">
              Our institutional relations desk will contact you within 24 hours.
            </p>
            <p className="pdre-overlay__code">
              Verification code: <strong>{verificationCode}</strong>
            </p>
            <button type="button" className="pdre-btn pdre-btn--primary glass-effect-interactive" onClick={closeSuccess}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
