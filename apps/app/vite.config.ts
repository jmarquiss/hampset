import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  envDir: '../..',
  // The admin app persists to the same folder, so both share one local D1 database.
  plugins: [
    react(),
    tailwindcss(),
    cloudflare({ inspectorPort: 9230, persistState: { path: '../../.wrangler/state' } }),
  ],
  server: { port: 5174, strictPort: true },
});
