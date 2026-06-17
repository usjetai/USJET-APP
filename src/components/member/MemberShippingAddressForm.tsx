import { MapPin, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  EMPTY_MEMBER_SHIPPING_ADDRESS,
  readMemberShippingAddress,
  saveMemberShippingAddress,
  subscribeMemberShippingAddress,
  validateMemberShippingAddress,
  type MemberShippingAddressInput,
} from "../../lib/memberShippingAddress";

type MemberShippingAddressFormProps = {
  customerId: string;
};

const SAVE_FLASH_MS = 2400;

function formatSavedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function MemberShippingAddressForm({ customerId }: MemberShippingAddressFormProps) {
  const [form, setForm] = useState<MemberShippingAddressInput>(EMPTY_MEMBER_SHIPPING_ADDRESS);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      const existing = readMemberShippingAddress(customerId);
      if (existing) {
        setForm({
          recipientName: existing.recipientName,
          line1: existing.line1,
          line2: existing.line2,
          city: existing.city,
          state: existing.state,
          postalCode: existing.postalCode,
          country: existing.country,
        });
        setSavedAt(existing.updatedAt);
      } else {
        setForm(EMPTY_MEMBER_SHIPPING_ADDRESS);
        setSavedAt(null);
      }
    };

    hydrate();
    return subscribeMemberShippingAddress(hydrate);
  }, [customerId]);

  const setField = <K extends keyof MemberShippingAddressInput>(key: K, value: MemberShippingAddressInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateMemberShippingAddress(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const saved = saveMemberShippingAddress(customerId, form);
    setSavedAt(saved.updatedAt);
    setError(null);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), SAVE_FLASH_MS);
  };

  return (
    <GlassEffectContainer className="member-shipping glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <header className="member-shipping__header">
        <p className="member-shipping__kicker">Merch &amp; fleet gear</p>
        <h2 className="member-shipping__title">Shipping address</h2>
        <p className="member-shipping__copy">
          Save where USJET should ship fleet merchandise and member gear. Stored on this device for your Member ID.
        </p>
        {savedAt ? (
          <p className="member-shipping__saved-at" aria-live="polite">
            Last saved {formatSavedAt(savedAt)}
            {savedFlash ? " · Updated just now" : ""}
          </p>
        ) : null}
      </header>

      <form className="member-shipping__form" onSubmit={handleSubmit} noValidate>
        <label className="member-shipping__field member-shipping__field--full">
          <span className="member-shipping__label">Recipient name</span>
          <input
            className="member-shipping__input"
            type="text"
            value={form.recipientName}
            onChange={(event) => setField("recipientName", event.target.value)}
            autoComplete="name"
            placeholder="Full name on the label"
            maxLength={120}
          />
        </label>

        <label className="member-shipping__field member-shipping__field--full">
          <span className="member-shipping__label">Street address</span>
          <input
            className="member-shipping__input"
            type="text"
            value={form.line1}
            onChange={(event) => setField("line1", event.target.value)}
            autoComplete="address-line1"
            placeholder="123 Hangar Row"
            maxLength={160}
          />
        </label>

        <label className="member-shipping__field member-shipping__field--full">
          <span className="member-shipping__label">Apt, suite, unit (optional)</span>
          <input
            className="member-shipping__input"
            type="text"
            value={form.line2}
            onChange={(event) => setField("line2", event.target.value)}
            autoComplete="address-line2"
            placeholder="Bay 04"
            maxLength={80}
          />
        </label>

        <div className="member-shipping__grid">
          <label className="member-shipping__field">
            <span className="member-shipping__label">City</span>
            <input
              className="member-shipping__input"
              type="text"
              value={form.city}
              onChange={(event) => setField("city", event.target.value)}
              autoComplete="address-level2"
              placeholder="City"
              maxLength={80}
            />
          </label>

          <label className="member-shipping__field">
            <span className="member-shipping__label">State / Province</span>
            <input
              className="member-shipping__input"
              type="text"
              value={form.state}
              onChange={(event) => setField("state", event.target.value)}
              autoComplete="address-level1"
              placeholder="NY"
              maxLength={40}
            />
          </label>

          <label className="member-shipping__field">
            <span className="member-shipping__label">ZIP / Postal code</span>
            <input
              className="member-shipping__input"
              type="text"
              value={form.postalCode}
              onChange={(event) => setField("postalCode", event.target.value)}
              autoComplete="postal-code"
              placeholder="10001"
              maxLength={20}
            />
          </label>

          <label className="member-shipping__field">
            <span className="member-shipping__label">Country</span>
            <input
              className="member-shipping__input"
              type="text"
              value={form.country}
              onChange={(event) => setField("country", event.target.value)}
              autoComplete="country-name"
              placeholder="United States"
              maxLength={80}
            />
          </label>
        </div>

        {error ? <p className="member-shipping__error">{error}</p> : null}

        <button type="submit" className="member-shipping__submit btn-glass-prominent glass-effect-interactive">
          <Save size={14} aria-hidden />
          Save shipping address
        </button>
      </form>

      <p className="member-shipping__note">
        <MapPin size={12} aria-hidden />
        Free shipping applies to fleet merchandise — confirm your address before checkout.
      </p>
    </GlassEffectContainer>
  );
}
