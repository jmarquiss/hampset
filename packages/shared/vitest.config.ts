import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: { VITE_SITE_URL: 'https://club.test' },
    environment: 'jsdom',
    include: ['src/ui/**/*.test.tsx'],
    restoreMocks: true,
  },
});
