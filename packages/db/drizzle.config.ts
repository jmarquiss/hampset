import { defineConfig } from 'drizzle-kit';

// Only used to generate SQL migrations; wrangler applies them (see the db:migrate scripts in
// apps/app).
export default defineConfig({
  dialect: 'sqlite',
  out: './drizzle',
  schema: './src/schema.ts',
});
