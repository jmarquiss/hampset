import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations("../../packages/db/drizzle"),
          APP_URL: "http://localhost:5174",
          ACCESS_TEAM_DOMAIN: "https://test.cloudflareaccess.com",
          ACCESS_AUD: "test-aud",
          EMAIL_FROM: "Hampset CC <noreply@example.com>",
          RESEND_API_KEY: "test-resend-key",
        },
      },
    }),
  ],
  test: { setupFiles: ["./test/setup.ts"] },
}));
