import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { parse, type ParseError, printParseErrorCode } from 'jsonc-parser';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

/** The cron schedules under triggers.crons in wrangler.jsonc. */
function wranglerCrons(): string[] {
  const errors: ParseError[] = [];
  const config = parse(readFileSync('./wrangler.jsonc', 'utf8'), errors, {
    allowTrailingComma: true,
  }) as {
    triggers?: { crons?: string[] };
  };
  const [error] = errors;
  if (error)
    throw new Error(
      `wrangler.jsonc: ${printParseErrorCode(error.error)} at offset ${String(error.offset)}`,
    );
  const crons = config.triggers?.crons;
  if (!crons) throw new Error('wrangler.jsonc has no triggers.crons');
  return crons;
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
