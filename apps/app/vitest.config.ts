import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      miniflare: {
        bindings: {
          APP_URL: 'http://localhost:5174',
          BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-32-characters-long',
          GOOGLE_CLIENT_ID: 'test-client-id',
          GOOGLE_CLIENT_SECRET: 'test-client-secret',
          TEST_MIGRATIONS: await readD1Migrations('../../packages/db/drizzle'),
        },
      },
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
  test: { setupFiles: ['./test/setup.ts'] },
}));
