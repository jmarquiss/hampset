import type { Config } from '@react-router/dev/config';

// Every page is rendered to static HTML at build time; there is no server. "/404" renders the
// catch-all route, which the build script copies to 404.html for Cloudflare to serve.
export default {
  prerender: ['/', '/about', '/contact', '/privacy', '/terms', '/404'],
  ssr: false,
} satisfies Config;
