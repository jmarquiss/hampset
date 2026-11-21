import { index, route, type RouteConfig } from '@react-router/dev/routes';

// To add a page: create a file in routes/, add it here, and add its path to `prerender` in
// react-router.config.ts (and to `nav` in root.tsx if it belongs in the header).
export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('privacy', 'routes/privacy.tsx'),
  route('terms', 'routes/terms.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
