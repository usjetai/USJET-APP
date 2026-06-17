import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UsjetStarEmblem from "../components/brand/UsjetStarEmblem";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  submitBrandLicensingApplication,
  type BrandLicensingApplicationPayload,
} from "../lib/brandLicensingApplications";

const BUSINESS_TYPES = [
  "Construction",
  "Logistics",
  "Apparel",
  "Manufacturing",
  "Fleet / field services",
  "Retail & local services",
  "Other",
] as const;

type LicenseForm = {
  businessName: string;
  contactName: string;
  contactEmail: string;
  businessType: string;
  territory: string;
  proposedUse: string;
};

const emptyForm: LicenseForm = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  businessType: "",
  territory: "",
  proposedUse: "",
};

function makeVerificationCode(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `USJET-LIC-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  }
  return `USJET-LIC-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function BrandLicensing() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<LicenseForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LicenseForm, string>>>({});
  const [phase, setPhase] = useState<"form" | "processing" | "success">("form");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }
    const id = window.setTimeout(() => setPhase("success"), 1500);
    return () => window.clearTimeout(id);
  }, [phase]);

  const setField = <K extends keyof LicenseForm>(key: K, value: LicenseForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const next: typeof errors = {};
    if (!form.businessName.trim()) {
      next.businessName = "Business name is required.";
    }
    if (!form.contactName.trim()) {
      next.contactName = "Point of contact is required.";
    }
    if (!form.contactEmail.trim() || !isValidEmail(form.contactEmail)) {
      next.contactEmail = "Valid business email is required.";
    }
    if (!form.businessType) {
      next.businessType = "Select a business type.";
    }
    if (!form.territory.trim()) {
      next.territory = "Territory / location is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (form.proposedUse.trim().length < 24) {
      setErrors({ proposedUse: "Describe your proposed logo use (at least 24 characters)." });
      return false;
    }
    setErrors({});
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setStep(2);
  };

  const goBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleFinalSubmit = () => {
    if (!validateStep1() || !validateStep2()) {
      if (!validateStep1()) {
        setStep(1);
      }
      return;
    }
    const code = makeVerificationCode();
    setVerificationCode(code);

    const payload: BrandLicensingApplicationPayload = {
      business_name: form.businessName.trim(),
      contact_name: form.contactName.trim(),
      contact_email: form.contactEmail.trim().toLowerCase(),
      business_type: form.businessType,
      territory: form.territory.trim(),
      proposed_use: form.proposedUse.trim(),
      verification_code: code,
      submitted_at: new Date().toISOString(),
    };

    void submitBrandLicensingApplication(payload);
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
    <div className="license-page pdre-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
      <header className="pdre-page__hero mb-10 text-center sm:mb-14">
        <p className="license-page__eyebrow pdre-page__eyebrow">Brand Licensing & Identity · Authorized Partner Network</p>
        <h1 className="pdre-page__title">The USJET Star: More Than a Logo, It&apos;s a Standard.</h1>
        <p className="pdre-page__lede mx-auto max-w-3xl text-pretty">
          Since our launch, the USJET star emblem has become a symbol for the modern American worker—a mark of
          high-performance intelligence and rugged independence. Today we open the USJET Brand Licensing Program for
          entrepreneurs, fleet owners, and manufacturers who want authorized use of the USJET identity on equipment,
          apparel, and local service fleets.
        </p>
        <p className="pdre-page__targets" aria-label="Licensed partner positioning">
          Authorized providers · Fleet decals · Apparel · Equipment · Territory partners
        </p>
      </header>

      <section className="pdre-page__value mb-12" aria-labelledby="license-value-heading">
        <h2 id="license-value-heading" className="sr-only">
          Licensing value
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Badge of honor",
              body: "Wearing the Star signals membership in the premier AI-driven labor network—your shop, fleet, or line reads as future-ready, not generic merch.",
            },
            {
              title: "Licensed, not borrowed",
              body: "Authorized partners receive structured approval, territory notes, and OPS routing. We set the standard; you carry it with permission.",
            },
            {
              title: "Fleet at the bottom",
              body: "While PDRE courts institutional whales, Brand Licensing builds the long tail—construction, logistics, apparel, and manufacturers who scale with the emblem.",
            },
          ].map((col) => (
            <GlassEffectContainer
              key={col.title}
              className="pdre-value-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <div className="pdre-value-card__inner">
                <h3 className="pdre-value-card__title">{col.title}</h3>
                <p className="pdre-value-card__body">{col.body}</p>
              </div>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <GlassEffectContainer className="license-prospectus pdre-prospectus glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="license-prospectus__watermark" aria-hidden>
          <UsjetStarEmblem className="license-prospectus__star" decorative />
        </div>
        <div className="pdre-prospectus__inner license-prospectus__inner">
          <div className="pdre-prospectus__head">
            <p className="pdre-prospectus__kicker">Authorized partner application</p>
            <h2 className="pdre-prospectus__title">Apply for USJET Brand Licensing</h2>
            <p className="pdre-prospectus__sub">
              Tell us your business type, territory, and how you plan to use the USJET star. Our Brand Standards team
              reviews every application—fees and royalties are negotiated after clearance, not at submit time.
            </p>
            <ol className="pdre-steps" aria-label="Application progress">
              {[1, 2].map((n) => (
                <li
                  key={n}
                  className={[
                    "pdre-steps__item",
                    n === step ? "pdre-steps__item--active" : "",
                    n < step ? "pdre-steps__item--done" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="pdre-steps__num">{n}</span>
                  <span className="pdre-steps__label">{n === 1 ? "Partner" : "Brand use"}</span>
                </li>
              ))}
            </ol>
          </div>

          {phase === "form" ? (
            <div className="pdre-form">
              {step === 1 ? (
                <div className="pdre-form__grid">
                  <label className="pdre-field pdre-field--full">
                    <span className="pdre-field__label">Business / brand name</span>
                    <input
                      className="pdre-field__input"
                      value={form.businessName}
                      onChange={(e) => setField("businessName", e.target.value)}
                      placeholder="Legal entity or trade name"
                      autoComplete="organization"
                    />
                    {errors.businessName ? <span className="pdre-field__error">{errors.businessName}</span> : null}
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
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                    {errors.contactEmail ? <span className="pdre-field__error">{errors.contactEmail}</span> : null}
                  </label>
                  <label className="pdre-field">
                    <span className="pdre-field__label">Business type</span>
                    <select
                      className="pdre-field__input pdre-field__select"
                      value={form.businessType}
                      onChange={(e) => setField("businessType", e.target.value)}
                    >
                      <option value="">Select category</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.businessType ? <span className="pdre-field__error">{errors.businessType}</span> : null}
                  </label>
                  <label className="pdre-field">
                    <span className="pdre-field__label">Territory</span>
                    <input
                      className="pdre-field__input"
                      value={form.territory}
                      onChange={(e) => setField("territory", e.target.value)}
                      placeholder="City · State · Country"
                      autoComplete="address-level1"
                    />
                    {errors.territory ? <span className="pdre-field__error">{errors.territory}</span> : null}
                  </label>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="pdre-form__commit">
                  <label className="pdre-field pdre-field--full">
                    <span className="pdre-field__label">Proposed use of the USJET logo</span>
                    <textarea
                      className="pdre-field__input license-field__textarea"
                      rows={5}
                      value={form.proposedUse}
                      onChange={(e) => setField("proposedUse", e.target.value)}
                      placeholder="Describe products, fleet decals, uniforms, packaging, or retail placement…"
                    />
                    {errors.proposedUse ? <span className="pdre-field__error">{errors.proposedUse}</span> : null}
                  </label>
                  <p className="pdre-form__hint">
                    We don&apos;t just build the tech—we set the standard. Unauthorized use of the Star is not permitted;
                    approved partners receive brand guidelines after diligence.
                  </p>
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
                {step < 2 ? (
                  <button type="button" className="pdre-btn pdre-btn--primary glass-effect-interactive" onClick={goNext}>
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    className="pdre-btn pdre-btn--submit glass-effect-interactive"
                    onClick={handleFinalSubmit}
                  >
                    Submit application
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </GlassEffectContainer>

      <p className="pdre-page__return mt-10 text-center">
        <Link to="/pdre" className="pdre-page__return-link glass-effect-interactive">
          Institutional PDRE gateway
        </Link>
        {" · "}
        <Link to="/support-fleet" className="pdre-page__return-link glass-effect-interactive">
          Support the Fleet
        </Link>
        {" · "}
        <Link to="/" className="pdre-page__return-link glass-effect-interactive">
          Fleet home
        </Link>
      </p>

      {phase === "processing" ? (
        <div className="pdre-overlay" role="alertdialog" aria-live="assertive" aria-busy="true" aria-label="Processing application">
          <div className="pdre-overlay__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
            <p className="pdre-overlay__title">Processing brand application</p>
            <div className="pdre-overlay__bar" aria-hidden>
              <div className="pdre-overlay__bar-fill" />
            </div>
            <p className="pdre-overlay__sub">Brand standards · territory review · OPS notified</p>
          </div>
        </div>
      ) : null}

      {phase === "success" ? (
        <div className="pdre-overlay" role="dialog" aria-modal="true" aria-labelledby="license-success-title">
          <div className="pdre-overlay__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan pdre-overlay__panel--success">
            <UsjetStarEmblem className="license-overlay__star" decorative />
            <h2 id="license-success-title" className="pdre-overlay__success-title">
              Application Received
            </h2>
            <p className="pdre-overlay__success-body">
              Our Brand Standards team will contact you within 24 hours with licensing terms and authorized-use guidelines.
            </p>
            <p className="pdre-overlay__code">
              Verification Code: <strong>{verificationCode}</strong>
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
