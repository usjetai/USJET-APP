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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }
          if (id.includes("framer-motion")) {
            return "vendor-framer-motion";
          }
          if (id.includes("@stripe") || id.includes("stripe")) {
            return "vendor-stripe";
          }
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("react-router")) {
            return "vendor-react-router";
          }
          if (id.includes("react-dom")) {
            return "vendor-react-dom";
          }
          if (id.includes("node_modules/react/")) {
            return "vendor-react";
          }
        },
      },
    },
  },
});
