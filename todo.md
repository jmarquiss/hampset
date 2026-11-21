# To do

## Before the first deploy

- [ ] Check the Worker secrets are set (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) before deploying the members app.
- [ ] Check `_headers` and the CSP once on a real deploy, or with `wrangler dev` on the production build.
- [ ] Redirect `www.` to the apex domain.

## Security and infrastructure

- [ ] Clean up expired sessions on a schedule (Cron Trigger on the members Worker).
- [x] Publish a privacy policy and terms of service, including instructions to email for personal-information removal requests.
