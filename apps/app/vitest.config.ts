import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';
import { unstable_readConfig } from 'wrangler';

/** The cron schedules in wrangler.jsonc. Wrangler's Config type doesn't resolve outside it. */
function wranglerCrons() {
  const config = unstable_readConfig({ config: './wrangler.jsonc' }) as {
    triggers: { crons: string[] };
  };
  return config.triggers.crons;
}

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      miniflare: {
        bindings: {
          APP_URL: 'http://localhost:5174',
          BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-32-characters-long',
          GOOGLE_CLIENT_ID: 'test-client-id',
          GOOGLE_CLIENT_SECRET: 'test-client-secret',
          TEST_CRONS: wranglerCrons(),
          TEST_MIGRATIONS: await readD1Migrations('../../packages/db/drizzle'),
        },
      },
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
  test: { setupFiles: ['./test/setup.ts'] },
}));
