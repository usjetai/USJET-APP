/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly OPENROUTER_API_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_PAYMENT_INTENT_CLIENT_SECRET?: string;
  readonly VITE_STRIPE_FOUNDER_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_PRO_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_ENTERPRISE_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_FLEET_MANUAL_PAYMENT_LINK?: string;
  readonly VITE_STRIPE_CODE_KIT_PAYMENT_LINK?: string;
  /** Digital Sovereignty book ($49) — Stripe Payment Link */
  readonly VITE_STRIPE_DIGITAL_SOVEREIGNTY_BOOK_PAYMENT_LINK?: string;
  /** Canonical USJet .com landing — https origin */
  readonly VITE_USJET_COM_URL?: string;
  readonly VITE_WEFUNDER_RESERVATION_URL?: string;
  readonly VITE_MEMBER_VERIFY_URL?: string;
  readonly VITE_MEMBER_DEMO_ID?: string;
  readonly VITE_PARTNERSHIP_ANALYTICS_URL?: string;
  readonly VITE_PARTNERSHIP_APPLICATIONS_URL?: string;
  /** Optional pinned IG post/reel URL for Hangar iframe replay — see gamingInstagram.resolveInstagramHangarEmbedSrc */
  readonly VITE_GAMING_INSTAGRAM_EMBED_PERMALINK?: string;
  /** Optional literal iframe src override for the Instagram Hangar bay */
  readonly VITE_GAMING_INSTAGRAM_EMBED_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Web Speech API — not in all TS DOM libs. */
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
