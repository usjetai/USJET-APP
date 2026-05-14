/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly OPENROUTER_API_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_PAYMENT_INTENT_CLIENT_SECRET?: string;
  readonly VITE_STRIPE_FOUNDER_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_PRO_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_ENTERPRISE_PAYMENT_LINK?: string;
  readonly VITE_MEMBER_VERIFY_URL?: string;
  readonly VITE_MEMBER_DEMO_ID?: string;
  readonly VITE_PARTNERSHIP_ANALYTICS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
