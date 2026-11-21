import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      miniflare: {
        bindings: {
          ACCESS_AUD: 'test-aud',
          ACCESS_TEAM_DOMAIN: 'https://test.cloudflareaccess.com',
          TEST_MIGRATIONS: await readD1Migrations('../../packages/db/drizzle'),
        },
      },
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
  test: { include: ['test/**/*.test.ts'], setupFiles: ['./test/setup.ts'] },
}));
