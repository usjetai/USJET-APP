import { useEffect, useState, type FormEvent } from "react";
import { B2B_INDUSTRIES, B2B_PAIN_POINTS, B2B_WIZARD_STEPS } from "../../data/b2bEnterprise";
import { submitB2bEnterpriseInquiry, type B2bEnterpriseInquiryPayload } from "../../lib/b2bEnterpriseApplications";

type WizardForm = {
  professionalNameTitle: string;
  contactEmail: string;
  companyName: string;
  industry: string;
  fleetStaffSize: string;
  primaryPainPoint: string;
  painNotes: string;
  contactPhone: string;
};

const emptyForm: WizardForm = {
  professionalNameTitle: "",
  contactEmail: "",
  companyName: "",
  industry: "",
  fleetStaffSize: "",
  primaryPainPoint: "",
  painNotes: "",
  contactPhone: "",
};

function makeVerificationCode(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `B2B-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  }
  return `B2B-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function B2bBriefingWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof WizardForm | "step", string>>>({});
  const [phase, setPhase] = useState<"wizard" | "processing" | "success">("wizard");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }
    const id = window.setTimeout(() => setPhase("success"), 1400);
    return () => window.clearTimeout(id);
  }, [phase]);

  const setField = <K extends keyof WizardForm>(key: K, value: WizardForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, step: undefined }));
  };

  const validateStep1 = (): boolean => {
    const next: Partial<Record<keyof WizardForm, string>> = {};
    if (!form.professionalNameTitle.trim()) {
      next.professionalNameTitle = "Name and title required.";
    }
    if (!form.contactEmail.trim() || !isValidEmail(form.contactEmail)) {
      next.contactEmail = "Valid business email required.";
    }
    if (!form.companyName.trim()) {
      next.companyName = "Company name required.";
    }
    if (!form.industry) {
      next.industry = "Select industry.";
    }
    if (!form.fleetStaffSize.trim()) {
      next.fleetStaffSize = "Fleet or staff size required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (!form.primaryPainPoint) {
      setErrors({ primaryPainPoint: "Select primary pain point." });
      return false;
    }
    setErrors({});
    return true;
  };

  const submitBriefing = () => {
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    const code = makeVerificationCode();
    setVerificationCode(code);

    const payload: B2bEnterpriseInquiryPayload = {
      professional_name_title: form.professionalNameTitle.trim(),
      company_name: form.companyName.trim(),
      industry: form.industry,
      fleet_staff_size: form.fleetStaffSize.trim(),
      primary_pain_point: form.primaryPainPoint,
      contact_email: form.contactEmail.trim().toLowerCase(),
      contact_phone: form.contactPhone.trim() || undefined,
      briefing_notes: form.painNotes.trim() || undefined,
      verification_code: code,
      submitted_at: new Date().toISOString(),
    };

    void submitB2bEnterpriseInquiry(payload);
    setPhase("processing");
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setStep((current) => Math.min(3, current + 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1));
    setErrors({});
  };

  const handleFinalSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitBriefing();
  };

  const reset = () => {
    setPhase("wizard");
    setStep(1);
    setForm(emptyForm);
    setVerificationCode("");
    setErrors({});
  };

  if (phase === "processing") {
    return (
      <div className="b2b-wizard__status" role="status" aria-live="polite">
        <p className="b2b-wizard__status-title">Securing executive transmission…</p>
        <p className="b2b-wizard__status-copy">Routing qualified briefing request to founder operations.</p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="b2b-wizard__status b2b-wizard__status--success" role="status" aria-live="polite">
        <p className="b2b-wizard__status-title">Executive briefing queued</p>
        <p className="b2b-wizard__status-copy">
          Reference <strong>{verificationCode}</strong>. USJET will contact qualified enterprises directly — no
          automated checkout.
        </p>
        <button type="button" className="b2b-wizard__reset btn-glass glass-effect-interactive" onClick={reset}>
          Submit another profile
        </button>
      </div>
    );
  }

  return (
    <div className="b2b-wizard">
      <ol className="b2b-wizard__steps" aria-label="Briefing progress">
        {B2B_WIZARD_STEPS.map((label, index) => {
          const n = index + 1;
          return (
            <li
              key={label}
              className={[
                "b2b-wizard__step",
                n === step ? "b2b-wizard__step--active" : "",
                n < step ? "b2b-wizard__step--done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="b2b-wizard__step-num">{n}</span>
              <span className="b2b-wizard__step-label">{label}</span>
            </li>
          );
        })}
      </ol>

      <form className="b2b-wizard__form" onSubmit={step === 3 ? handleFinalSubmit : (event) => event.preventDefault()} noValidate>
        {step === 1 ? (
          <div className="b2b-inquiry__grid">
            <label className="b2b-field b2b-field--full">
              <span className="b2b-field__label">Professional name &amp; title</span>
              <input
                className="b2b-field__input"
                value={form.professionalNameTitle}
                onChange={(event) => setField("professionalNameTitle", event.target.value)}
                placeholder="CEO · GM · Fleet Director"
                autoComplete="name"
              />
              {errors.professionalNameTitle ? (
                <span className="b2b-field__error">{errors.professionalNameTitle}</span>
              ) : null}
            </label>
            <label className="b2b-field">
              <span className="b2b-field__label">Company name</span>
              <input
                className="b2b-field__input"
                value={form.companyName}
                onChange={(event) => setField("companyName", event.target.value)}
                autoComplete="organization"
              />
              {errors.companyName ? <span className="b2b-field__error">{errors.companyName}</span> : null}
            </label>
            <label className="b2b-field">
              <span className="b2b-field__label">Industry</span>
              <select
                className="b2b-field__input b2b-field__select"
                value={form.industry}
                onChange={(event) => setField("industry", event.target.value)}
              >
                <option value="">Select…</option>
                {B2B_INDUSTRIES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
              {errors.industry ? <span className="b2b-field__error">{errors.industry}</span> : null}
            </label>
            <label className="b2b-field">
              <span className="b2b-field__label">Fleet / staff size</span>
              <input
                className="b2b-field__input"
                value={form.fleetStaffSize}
                onChange={(event) => setField("fleetStaffSize", event.target.value)}
                placeholder="e.g. 200 field units"
              />
              {errors.fleetStaffSize ? <span className="b2b-field__error">{errors.fleetStaffSize}</span> : null}
            </label>
            <label className="b2b-field">
              <span className="b2b-field__label">Business email</span>
              <input
                className="b2b-field__input"
                type="email"
                value={form.contactEmail}
                onChange={(event) => setField("contactEmail", event.target.value)}
                autoComplete="email"
              />
              {errors.contactEmail ? <span className="b2b-field__error">{errors.contactEmail}</span> : null}
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="b2b-wizard__pain">
            <p className="b2b-wizard__pain-lede">Where is industrial friction highest right now?</p>
            <fieldset className="b2b-wizard__pain-options">
              <legend className="sr-only">Primary pain point</legend>
              {B2B_PAIN_POINTS.map((entry) => (
                <label key={entry.value} className="b2b-wizard__pain-option">
                  <input
                    type="radio"
                    name="primaryPainPoint"
                    value={entry.value}
                    checked={form.primaryPainPoint === entry.value}
                    onChange={() => setField("primaryPainPoint", entry.value)}
                  />
                  <span>{entry.label}</span>
                </label>
              ))}
            </fieldset>
            {errors.primaryPainPoint ? <span className="b2b-field__error">{errors.primaryPainPoint}</span> : null}
            <label className="b2b-field b2b-field--full">
              <span className="b2b-field__label">Context (optional)</span>
              <textarea
                className="b2b-field__input b2b-field__textarea"
                value={form.painNotes}
                onChange={(event) => setField("painNotes", event.target.value)}
                rows={3}
                placeholder="Logistics bottlenecks, documentation debt, staffing gaps…"
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="b2b-wizard__review">
            <p className="b2b-wizard__review-kicker">Secure submission</p>
            <dl className="b2b-wizard__review-list">
              <div>
                <dt>Contact</dt>
                <dd>{form.professionalNameTitle}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>
                  {form.companyName} · {B2B_INDUSTRIES.find((i) => i.value === form.industry)?.label ?? form.industry}
                </dd>
              </div>
              <div>
                <dt>Fleet / staff</dt>
                <dd>{form.fleetStaffSize}</dd>
              </div>
              <div>
                <dt>Pain point</dt>
                <dd>{B2B_PAIN_POINTS.find((p) => p.value === form.primaryPainPoint)?.label ?? form.primaryPainPoint}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{form.contactEmail}</dd>
              </div>
            </dl>
            <label className="b2b-field b2b-field--full">
              <span className="b2b-field__label">Direct line (optional)</span>
              <input
                className="b2b-field__input"
                type="tel"
                value={form.contactPhone}
                onChange={(event) => setField("contactPhone", event.target.value)}
              />
            </label>
          </div>
        ) : null}

        <div className="b2b-wizard__nav">
          {step > 1 ? (
            <button type="button" className="b2b-wizard__back btn-glass glass-effect-interactive" onClick={handleBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" className="b2b-wizard__next btn-glass glass-effect-interactive" onClick={handleNext}>
              Continue
            </button>
          ) : (
            <button type="submit" className="b2b-inquiry__submit btn-glass glass-effect-interactive">
              Secure Executive Briefing
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
