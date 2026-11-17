import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // The members app persists to the same folder, so both share one local D1 database.
  plugins: [
    react(),
    tailwindcss(),
    cloudflare({ persistState: { path: "../../.wrangler/state" }, inspectorPort: 9231 }),
  ],
  server: { port: 5175, strictPort: true },
});
