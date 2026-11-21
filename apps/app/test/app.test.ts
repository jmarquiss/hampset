import { getDb, schema } from '@club/db';
import { betterAuth } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { authOptions, MAX_NAME_LENGTH } from '../worker/auth';
import { DEV_EMAIL } from '../worker/dev';
import { app } from '../worker/index';

const db = getDb(env.DB);
const day = 24 * 60 * 60 * 1000;

/** Creates a user with a live session, returning their id, email and request headers. */
async function signedInUser(fields: { approvedAt?: Date; disabledAt?: Date } = {}) {
  // Without the sign-up gate, which needs a real OAuth request, so the helper can create users.
  const options = authOptions(env);
  const user = { ...options.user, validateUserInfo: undefined };
  const ctx = await betterAuth({ ...options, plugins: [testUtils()], user }).$context;
  const saved = await ctx.test.saveUser(
    ctx.test.createUser({ email: `${crypto.randomUUID()}@example.com`, name: 'Test Member' }),
  );
  await db
    .update(schema.user)
    .set({ approvedAt: null, disabledAt: null, ...fields })
    .where(eq(schema.user.id, saved.id));
  return { ...saved, headers: await ctx.test.getAuthHeaders({ userId: saved.id }) };
}

describe('sign-up gate', () => {
  const validate = authOptions(env).user.validateUserInfo;
  const source = { method: 'oauth', oauth: { providerId: 'google' } } as const;

  it.each([
    { action: 'create-user', emailVerified: false, expected: { error: 'email_not_verified' } },
    { action: 'create-user', emailVerified: true, expected: undefined },
    { action: 'sign-in', emailVerified: false, expected: undefined },
  ] as const)(
    '$action, verified: $emailVerified → $expected',
    ({ action, emailVerified, expected }) => {
      const user = { email: 'new@example.com', emailVerified, name: 'New Member' };
      expect(validate({ source: { ...source, action }, user })).toEqual(expected);
    },
  );
});

describe('member access', () => {
  it('returns 401 without a session', async () => {
    const res = await app.request('/api/me', {}, env);
    expect(res.status).toBe(401);
  });

  // /api/nope stands in for any members-only route: active members reach the 404 handler.
  it.each([
    { fields: {}, name: 'pending', routeStatus: 403 },
    { fields: { approvedAt: new Date() }, name: 'active', routeStatus: 404 },
    {
      fields: { approvedAt: new Date(), disabledAt: new Date() },
      name: 'disabled',
      routeStatus: 403,
    },
  ])(
    '$name user sees their status and gets $routeStatus elsewhere',
    async ({ fields, name, routeStatus }) => {
      const user = await signedInUser(fields);
      const me = await app.request('/api/me', { headers: user.headers }, env);
      const other = await app.request('/api/nope', { headers: user.headers }, env);
      expect({ me: await me.json(), other: other.status }).toEqual({
        me: { email: user.email, id: user.id, name: 'Test Member', status: name },
        other: routeStatus,
      });
    },
  );

  /**
   * Sends Better Auth's update-user request as a signed-in user, returning the response and their
   * row.
   */
  async function updateUser(body: Record<string, unknown>) {
    const user = await signedInUser();
    const headers = new Headers(user.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Origin', env.APP_URL);
    const res = await app.request(
      '/api/auth/update-user',
      { body: JSON.stringify(body), headers, method: 'POST' },
      env,
    );
    const row = await db.query.user.findFirst({ where: eq(schema.user.id, user.id) });
    return { res, row };
  }

  it("doesn't let a user approve themselves", async () => {
    const { res, row } = await updateUser({ approvedAt: Date.now(), name: 'Sneaky' });
    expect({ approvedAt: row?.approvedAt, body: await res.json(), status: res.status }).toEqual({
      approvedAt: null,
      body: expect.objectContaining({ code: 'FIELD_NOT_ALLOWED' }),
      status: 400,
    });
  });

  it.each([
    {
      body: { image: 'https://evil.example/a.png', name: `  ${'x'.repeat(MAX_NAME_LENGTH + 50)}` },
      expected: { image: null, name: 'x'.repeat(MAX_NAME_LENGTH), status: 200 },
      name: 'trims an over-long name and drops the image',
    },
    {
      body: { name: { first: 'Sneaky' } },
      expected: { image: null, name: 'Test Member', status: 400 },
      name: "rejects a name that isn't text",
    },
  ])('$name', async ({ body, expected }) => {
    const { res, row } = await updateUser(body);
    expect({ image: row?.image, name: row?.name, status: res.status }).toEqual(expected);
  });

  it('extends a session that is more than a day old', async () => {
    const user = await signedInUser({ approvedAt: new Date() });
    // A 30-day session with one day left was created 29 days ago.
    await db
      .update(schema.session)
      .set({ expiresAt: new Date(Date.now() + day) })
      .where(eq(schema.session.userId, user.id));

    const res = await app.request('/api/me', { headers: user.headers }, env);
    expect(res.headers.getSetCookie().some((c) => c.includes('session_token'))).toBe(true);
  });
});

describe('dev sign-in', () => {
  const signIn = (bindings = env) =>
    app.request(
      '/api/dev/sign-in',
      { headers: { Origin: 'http://localhost' }, method: 'POST' },
      bindings,
    );

  /** Signs in through the dev route and returns the signed-in user from /api/me. */
  async function devSignIn() {
    const res = await signIn();
    expect(res.status).toBe(204);
    const setCookie = res.headers.getSetCookie()[0] ?? '';
    expect(setCookie).toMatch(/HttpOnly/);
    expect(setCookie).toMatch(/SameSite=Lax/);
    expect(setCookie).toMatch(/Path=\//);
    const cookie = setCookie.split(';')[0] ?? '';
    return (await app.request('/api/me', { headers: { Cookie: cookie } }, env)).json();
  }

  it('creates the test account as a pending sign-up once, then signs in as it', async () => {
    const first = await devSignIn();
    expect([first, await devSignIn()]).toEqual([
      { email: DEV_EMAIL, id: expect.any(String), name: 'Test Member', status: 'pending' },
      first,
    ]);
  });

  it("refuses when APP_URL isn't localhost", async () => {
    const res = await signIn({ ...env, APP_URL: 'https://app.example.com' });
    expect(res.status).toBe(404);
  });
});
