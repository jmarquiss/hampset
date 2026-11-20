---
name: Hampset CC website
overview: 'An all-Cloudflare website for Hampset Cricket Club: a static React public site, a members app with Google sign-in and admin approval, and an admin app behind Cloudflare Access, with the two apps sharing one D1 database. The bootstrap is deliberately minimal; bookings, fixtures and the shop are planned as later stages.'
todos:
  - id: b1-structure
    content: 'Bootstrap: pnpm monorepo with apps/site, apps/app, apps/admin, packages/db, packages/shared'
    status: completed
  - id: b2-site
    content: 'Bootstrap: prerendered React Router site with Home, About and Contact for Hampset CC'
    status: completed
  - id: b3-app
    content: 'Bootstrap: members app with Better Auth (Google only), admin-approved sign-up, landing page'
    status: completed
  - id: b4-admin
    content: 'Bootstrap: admin app behind Cloudflare Access with approve, reject (disable), enable, delete and an audit log'
    status: completed
  - id: b5-ci
    content: 'Bootstrap: CI (format, lint, typecheck, test, build) and deploy of all three Workers'
    status: completed
  - id: b6-go-live
    content: 'Go live: domain, D1, Google OAuth, Zero Trust Access app, GitHub secrets (README checklist)'
    status: pending
  - id: s2-coaching
    content: 'Stage 2: coach availability and member bookings in the members app'
    status: pending
  - id: s3-fixtures
    content: 'Stage 3: fixtures and results from the Play-Cricket API'
    status: pending
isProject: false
---

# Hampset CC Website Plan

## Hosting and stack decisions

Everything is hosted on Cloudflare. DDoS protection, TLS and CDN come free, and on the free plan going over a limit makes requests fail rather than adding to the bill. The only fixed cost is the domain at about £10 a year.

- **Three deployments, one domain:**
  - `domain.com`: the public site, served as static files by a Worker with no code (static asset requests are free and unlimited).
  - `app.domain.com`: the members app. A Worker serves the React build and a Hono API.
  - `admin.domain.com`: the admin app. Same shape as the members app, behind Cloudflare Access.
- **Public site:** React with [React Router](https://reactrouter.com) framework mode, pre-rendering every page to static HTML at build time. Pages show up properly in search results and in WhatsApp and Facebook link previews. Content lives in the route components; there is no CMS.
- **Members and admin apps:** React, Vite and TypeScript, with TanStack Query for data fetching. The [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) runs each React app and its Worker on one dev server, and the build produces a single deployable Worker per app.
- **APIs:** [Hono](https://hono.dev) on Cloudflare Workers.
- **Database:** Cloudflare D1 (SQLite) through Drizzle ORM. The schema and migrations live in `packages/db`, and both Workers bind the same database.
- **Member auth:** [Better Auth](https://better-auth.com) in the members Worker, with sessions in D1. Google is the only sign-in method, so the app never sends login emails. Anyone can create an account, but it stays pending until an admin approves it.
- **Admin auth:** [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) (Zero Trust, free for up to 50 users). Admins are managed in the Cloudflare dashboard, not in the database, and the Worker verifies the Access login token on every request.
- **Email:** none yet. When features need it (booking confirmations, reminders), Resend's free tier (3,000 a month, 100 a day) is the plan.
- **Theme:** dark blue and light silver, defined once as Tailwind tokens in `packages/shared/src/theme.css`.

```mermaid
flowchart LR
  visitor[Visitor] --> site["domain.com: static site"]
  member[Member] --> app["app.domain.com: React + Hono Worker"]
  clubAdmin[Club admin] --> access["Cloudflare Access"]
  access --> admin["admin.domain.com: React + Hono Worker"]
  app --> d1[("D1 database")]
  admin --> d1
  app --> google[Google OAuth]
```

### Repo layout

```
apps/site/        React Router, prerendered; static-assets Worker
apps/app/         src/ (React) + worker/ (Hono, Better Auth)
apps/admin/       src/ (React) + worker/ (Hono, Access check)
packages/db/      Drizzle schema, migrations, member status helper
packages/shared/  theme.css, club.ts, UI components, API fetch helper
```

## Data model

- **Better Auth tables:** `user`, `session`, `account`, `verification`.
- **`user` additions:** `approved_at` (null while pending) and `disabled_at` (null while they have access). A member's status is derived from these: pending, active or disabled.
- **`audit_log`:** columns `id`, `actor_email` (the admin's Access email), `action` (approve, disable, enable, delete), `target_user_id`, `target_email`, `created_at`. The target's email is copied so entries outlive deleted users.

Rejecting a sign-up disables it, so the person can't sign up again. Disabling keeps the user and their data. Deleting (only for disabled users) removes their `user` row, and the foreign keys cascade to their sessions and accounts; with no row left, they can sign up again.

## Sign-up flow

```mermaid
sequenceDiagram
  participant P as Person
  participant W as AppWorker
  participant A as AdminWorker
  P->>W: Continue with Google
  W->>W: create user, approved_at null
  P->>W: GET /api/me
  W-->>P: status pending, shown "Waiting for approval"
  A->>A: admin approves, sets approved_at and writes audit_log
  P->>W: GET /api/me
  W-->>P: status active, members area
```

Pending and disabled users can only call `GET /api/me`; every other members route requires an active member.

## Bootstrap (done)

1. Monorepo structure with shared `db` and `shared` packages.
2. Public site with Home, About and Contact, using Hampset's details, plus a pre-rendered 404 page.
3. Members app: Google sign-in, login page, a "waiting for approval" / "access removed" notice, and a placeholder landing page.
4. Admin app: waiting, active and disabled member lists with approve, reject, disable, enable and delete, plus recent activity from the audit log.
5. Tests with `@cloudflare/vitest-plugin` against a real local D1:
   - `/api/me` and the members-only gate for pending, active and disabled users;
   - members can't approve themselves;
   - the Access token check;
   - each member action, its allowed starting status and its audit entry;
   - CSRF rejection.
6. CI that checks everything, refuses to deploy placeholder config, applies migrations and deploys all three Workers.

## Go live

Follow the "First-time Cloudflare setup" checklist in the README: domain, D1, Google OAuth, secrets, the Zero Trust Access application, GitHub secrets and WAF settings.

## Future features (considered, not planned in detail)

- **Coaching and bookings:** coach profiles, availability slots and member bookings in the members app, with confirmation emails. This needs roles inside the members app (for example a `user_role` table for coaches), managed from the admin app. Adding Resend for these emails means watching its daily limit.
- **Fixtures and results:** pull from the Play-Cricket API on a Cron Trigger, and render on the static site at build time or in the members app.
- **Team selection and availability:** a `fixture_availability` table, reusing the booking pattern.
- **News:** a `news` route on the static site with posts as Markdown files, or a table edited from the admin app if non-technical editors need it.
- **Club shop and membership fees:** Stripe Checkout (hosted, no card data on our systems) and Stripe Subscriptions, with a webhook Worker writing `order` and `membership` rows.
- **Privacy notice and data retention:** a privacy page in the members app, and a scheduled clean-up of expired sessions.

## Costs summary

- Domain: about £10 a year.
- Cloudflare Workers free tier (100k requests a day; static site requests are free and unlimited), D1 free tier (5GB), Zero Trust free plan (up to 50 admins), WAF managed rules: £0.
- If you outgrow the free tier: Workers paid plan at $5 a month.
