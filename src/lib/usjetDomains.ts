/** Primary public dot-com surface — override via `VITE_USJET_COM_URL` (https only). */

const DEFAULT_COM = "https://www.usjet.com" as const;

export function resolveUsjetComUrl(): string {
  const raw = import.meta.env.VITE_USJET_COM_URL?.trim();
  if (!raw) {
    return DEFAULT_COM;
  }
  try {
    const u = new URL(raw);
    if (u.protocol === "https:" && u.hostname) {
      return u.toString().replace(/\/$/, "");
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_COM;
}

export const USJET_COM_LABEL = "USJet.com" as const;
