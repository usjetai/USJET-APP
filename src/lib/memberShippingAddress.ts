export const MEMBER_SHIPPING_STORAGE_KEY = "usjet-member-shipping-address";
export const MEMBER_SHIPPING_UPDATED_EVENT = "usjet-member-shipping-updated" as const;

export type MemberShippingAddress = {
  recipientName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  updatedAt: string;
};

export type MemberShippingAddressInput = Omit<MemberShippingAddress, "updatedAt">;

type ShippingStore = Record<string, MemberShippingAddress>;

export const EMPTY_MEMBER_SHIPPING_ADDRESS: MemberShippingAddressInput = {
  recipientName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

function readStore(): ShippingStore {
  try {
    const raw = localStorage.getItem(MEMBER_SHIPPING_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as ShippingStore;
  } catch {
    return {};
  }
}

function writeStore(store: ShippingStore): void {
  try {
    localStorage.setItem(MEMBER_SHIPPING_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(MEMBER_SHIPPING_UPDATED_EVENT));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

function normalizeAddress(raw: Partial<MemberShippingAddress>): MemberShippingAddress {
  return {
    recipientName: String(raw.recipientName ?? "").trim(),
    line1: String(raw.line1 ?? "").trim(),
    line2: String(raw.line2 ?? "").trim(),
    city: String(raw.city ?? "").trim(),
    state: String(raw.state ?? "").trim(),
    postalCode: String(raw.postalCode ?? "").trim(),
    country: String(raw.country ?? "United States").trim() || "United States",
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  };
}

export function readMemberShippingAddress(customerId: string): MemberShippingAddress | null {
  const entry = readStore()[customerId];
  if (!entry) {
    return null;
  }
  return normalizeAddress(entry);
}

export function saveMemberShippingAddress(
  customerId: string,
  input: MemberShippingAddressInput,
): MemberShippingAddress {
  const address = normalizeAddress({
    ...input,
    updatedAt: new Date().toISOString(),
  });
  const store = readStore();
  store[customerId] = address;
  writeStore(store);
  return address;
}

export function subscribeMemberShippingAddress(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener(MEMBER_SHIPPING_UPDATED_EVENT, handler);
  return () => window.removeEventListener(MEMBER_SHIPPING_UPDATED_EVENT, handler);
}

export function validateMemberShippingAddress(input: MemberShippingAddressInput): string | null {
  if (!input.recipientName.trim()) {
    return "Enter the recipient name.";
  }
  if (!input.line1.trim()) {
    return "Enter a street address.";
  }
  if (!input.city.trim()) {
    return "Enter a city.";
  }
  if (!input.state.trim()) {
    return "Enter a state or province.";
  }
  if (!input.postalCode.trim()) {
    return "Enter a ZIP or postal code.";
  }
  if (!input.country.trim()) {
    return "Enter a country.";
  }
  return null;
}
