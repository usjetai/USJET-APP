import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite build (not Next.js): there is no `next.config.js`.
 *
 * Production tolerance (parity with common Next flags):
 * - `npm run build` runs `vite build` only — no ESLint step and no `tsc --noEmit` gate.
 * - TypeScript unused-symbol rules are relaxed in `tsconfig.json` so CI/Vercel are not
 *   stricter than the Vite/esbuild pipeline on unused locals/parameters.
 */
export default defineConfig({
  plugins: [react()],
});
