import { useEffect, useState, type FormEvent } from "react";
import { B2B_INDUSTRIES, B2B_PAIN_POINTS } from "../../data/b2bEnterprise";
import { submitB2bEnterpriseInquiry, type B2bEnterpriseInquiryPayload } from "../../lib/b2bEnterpriseApplications";

type InquiryForm = {
  professionalNameTitle: string;
  companyName: string;
  industry: string;
  fleetStaffSize: string;
  primaryPainPoint: string;
  contactEmail: string;
  contactPhone: string;
  briefingNotes: string;
};

const emptyForm: InquiryForm = {
  professionalNameTitle: "",
  companyName: "",
  industry: "",
  fleetStaffSize: "",
  primaryPainPoint: "",
  contactEmail: "",
  contactPhone: "",
  briefingNotes: "",
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

export default function B2bInquiryForm() {
  const [form, setForm] = useState<InquiryForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryForm, string>>>({});
  const [phase, setPhase] = useState<"form" | "processing" | "success">("form");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }
    const id = window.setTimeout(() => setPhase("success"), 1400);
    return () => window.clearTimeout(id);
  }, [phase]);

  const setField = <K extends keyof InquiryForm>(key: K, value: InquiryForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof InquiryForm, string>> = {};
    if (!form.professionalNameTitle.trim()) {
      next.professionalNameTitle = "Professional name and title are required.";
    }
    if (!form.companyName.trim()) {
      next.companyName = "Company name is required.";
    }
    if (!form.industry) {
      next.industry = "Select your industry.";
    }
    if (!form.fleetStaffSize.trim()) {
      next.fleetStaffSize = "Estimated fleet or staff size is required.";
    }
    if (!form.primaryPainPoint) {
      next.primaryPainPoint = "Select your primary pain point.";
    }
    if (!form.contactEmail.trim() || !isValidEmail(form.contactEmail)) {
      next.contactEmail = "Valid business email is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
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
      briefing_notes: form.briefingNotes.trim() || undefined,
      verification_code: code,
      submitted_at: new Date().toISOString(),
    };

    void submitB2bEnterpriseInquiry(payload);
    setPhase("processing");
  };

  const reset = () => {
    setPhase("form");
    setForm(emptyForm);
    setVerificationCode("");
    setErrors({});
  };

  if (phase === "processing") {
    return (
      <div className="b2b-inquiry__status" role="status" aria-live="polite">
        <p className="b2b-inquiry__status-title">Securing transmission…</p>
        <p className="b2b-inquiry__status-copy">Routing your briefing request to USJET founder operations.</p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="b2b-inquiry__status b2b-inquiry__status--success" role="status" aria-live="polite">
        <p className="b2b-inquiry__status-title">Briefing request received</p>
        <p className="b2b-inquiry__status-copy">
          Reference <strong>{verificationCode}</strong> for diligence. Qualified enterprises receive a private
          consultation — no automated checkout on this lane.
        </p>
        <button type="button" className="b2b-inquiry__reset btn-glass glass-effect-interactive" onClick={reset}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="b2b-inquiry" onSubmit={handleSubmit} noValidate>
      <div className="b2b-inquiry__grid">
        <label className="b2b-field b2b-field--full">
          <span className="b2b-field__label">Professional name &amp; title</span>
          <input
            className="b2b-field__input"
            value={form.professionalNameTitle}
            onChange={(event) => setField("professionalNameTitle", event.target.value)}
            placeholder="e.g. Jordan Lee — VP Operations"
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
            placeholder="Operating company"
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
            <option value="">Select industry…</option>
            {B2B_INDUSTRIES.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          {errors.industry ? <span className="b2b-field__error">{errors.industry}</span> : null}
        </label>

        <label className="b2b-field">
          <span className="b2b-field__label">Estimated fleet / staff size</span>
          <input
            className="b2b-field__input"
            value={form.fleetStaffSize}
            onChange={(event) => setField("fleetStaffSize", event.target.value)}
            placeholder="e.g. 85 crews · 12 shops"
            autoComplete="off"
          />
          {errors.fleetStaffSize ? <span className="b2b-field__error">{errors.fleetStaffSize}</span> : null}
        </label>

        <label className="b2b-field">
          <span className="b2b-field__label">Primary pain point</span>
          <select
            className="b2b-field__input b2b-field__select"
            value={form.primaryPainPoint}
            onChange={(event) => setField("primaryPainPoint", event.target.value)}
          >
            <option value="">Select pain point…</option>
            {B2B_PAIN_POINTS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          {errors.primaryPainPoint ? <span className="b2b-field__error">{errors.primaryPainPoint}</span> : null}
        </label>

        <label className="b2b-field">
          <span className="b2b-field__label">Business email</span>
          <input
            className="b2b-field__input"
            type="email"
            value={form.contactEmail}
            onChange={(event) => setField("contactEmail", event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
          />
          {errors.contactEmail ? <span className="b2b-field__error">{errors.contactEmail}</span> : null}
        </label>

        <label className="b2b-field">
          <span className="b2b-field__label">Direct line (optional)</span>
          <input
            className="b2b-field__input"
            type="tel"
            value={form.contactPhone}
            onChange={(event) => setField("contactPhone", event.target.value)}
            placeholder="+1 …"
            autoComplete="tel"
          />
        </label>

        <label className="b2b-field b2b-field--full">
          <span className="b2b-field__label">Briefing context (optional)</span>
          <textarea
            className="b2b-field__input b2b-field__textarea"
            value={form.briefingNotes}
            onChange={(event) => setField("briefingNotes", event.target.value)}
            placeholder="Fleet deployment, white-label, API integration, licensing scope…"
            rows={3}
          />
        </label>
      </div>

      <button type="submit" className="b2b-inquiry__submit btn-glass glass-effect-interactive">
        Request Industrial Briefing
      </button>
    </form>
  );
}
