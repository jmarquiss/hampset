# To do

## Before the first deploy

- [ ] Reset the local database, because the initial migration was regenerated: `rm -rf .wrangler/state/v3/d1 && pnpm db:migrate:local`.
- [ ] Check the Worker secrets are set (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) before deploying the members app.
- [ ] Check `_headers` and the CSP once on a real deploy, or with `wrangler dev` on the production build.
- [ ] Redirect `www.` to the apex domain.

## Security and infrastructure

- [ ] Public site CSP: replace `script-src 'unsafe-inline'` with hashes of the inline scripts, generated at build time.
- [ ] Pin the GitHub Actions in `.github/workflows/ci.yml` to commit SHAs.
- [ ] Clean up expired sessions on a schedule (Cron Trigger on the members Worker).
- [ ] Privacy page and GDPR data-removal information in the members area (deferred).

## UI and shared components

- [ ] Admin dashboard has no `<h1>`; add a `PageTitle`. The "Members" card title repeats the "Members" tab name.
- [ ] Members sign-in page (`AuthCard`) still has its own centred-card layout; move it into `packages/shared` if another signed-out page appears.
- [ ] `Tabs`: on narrow screens, scroll a clicked tab fully into view.
- [ ] `Navbar` phone menu: also close it on a click outside the menu.
- [ ] `Input` and `buttonClass` in `packages/shared/src/ui` have no callers; use them or remove them.
- [ ] Component tests: the repo only has Worker tests. Add Vitest with Testing Library for the keyboard and ARIA behaviour of `Tabs`, `ListDetail`, `Navbar` and `DataTable`.

## Linting

- [ ] `eslint-plugin-jsx-a11y` doesn't declare ESLint 10 support yet. It works, but pnpm warns about the unmet peer. Upgrade when it adds support, or switch to `eslint-plugin-jsx-a11y-x`.
- [ ] `react/jsx-curly-brace-presence` has no equivalent that runs on ESLint 10 (`eslint-plugin-react` stops at ESLint 9), so it's not enforced.
- [ ] Lint takes about 25 seconds because of the type-aware rules. Add `--cache` to the lint scripts if that gets slow.
- [ ] Decide if wanted:
  - a pre-commit hook (husky and lint-staged);
  - an 80-column print width (this repo uses 100);
  - running oxlint instead of ESLint.
