import { getDb, schema, type MemberStatus } from '@club/db';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { app } from '../worker/index';

const db = getDb(env.DB);
const { privateKey, publicKey } = await generateKeyPair('RS256');
const adminEmail = 'admin@example.com';

beforeAll(async () => {
  const jwk = { ...(await exportJWK(publicKey)), alg: 'RS256', kid: 'test' };
  vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url === `${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`) {
      return Promise.resolve(Response.json({ keys: [jwk] }));
    }
    return Promise.reject(new Error(`unexpected fetch: ${url}`));
  });
});

/** Signs an Access-style login token; override fields to make it invalid. */
function accessToken(
  opts: { aud?: string; email?: null | string; exp?: string; iss?: string; key?: CryptoKey } = {},
): Promise<string> {
  return new SignJWT(opts.email === null ? {} : { email: opts.email ?? adminEmail })
    .setProtectedHeader({ alg: 'RS256', kid: 'test' })
    .setIssuer(opts.iss ?? env.ACCESS_TEAM_DOMAIN)
    .setAudience(opts.aud ?? env.ACCESS_AUD)
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? '5m')
    .sign(opts.key ?? privateKey);
}

/**
 * Calls the admin API as a signed-in admin from the admin page itself (same Origin, as a browser
 * sends), returning the status and parsed JSON body.
 */
async function call(path: string, method = 'GET') {
  const headers = { 'Cf-Access-Jwt-Assertion': await accessToken(), Origin: 'http://localhost' };
  const res = await app.request(`/api${path}`, { headers, method }, env);
  const text = await res.text();
  return { body: text ? JSON.parse(text) : null, status: res.status };
}

const statusFields: Record<MemberStatus, { approvedAt?: Date; disabledAt?: Date }> = {
  active: { approvedAt: new Date() },
  disabled: { approvedAt: new Date(), disabledAt: new Date() },
  pending: {},
};

/** Inserts a user in the given status, with one session, as if they had signed in. */
async function addMember(status: MemberStatus) {
  const id = crypto.randomUUID();
  const email = `${id}@example.com`;
  await db.insert(schema.user).values({ email, id, name: 'Test Member', ...statusFields[status] });
  await db.insert(schema.session).values({
    expiresAt: new Date(Date.now() + 60_000),
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    userId: id,
  });
  return { email, id };
}

/** Returns the member's current status from the list endpoint, or undefined once deleted. */
async function statusOf(id: string) {
  const members = (await call('/members')).body as { id: string; status: MemberStatus }[];
  return members.find((m) => m.id === id)?.status;
}

describe('Cloudflare Access check', () => {
  it.each([
    { name: 'no token', status: 401, token: () => Promise.resolve(null) },
    { name: 'wrong audience', status: 401, token: () => accessToken({ aud: 'other-app' }) },
    {
      name: 'wrong issuer',
      status: 401,
      token: () => accessToken({ iss: 'https://evil.example' }),
    },
    { name: 'expired', status: 401, token: () => accessToken({ exp: '1 minute ago' }) },
    {
      name: 'signed by another key',
      status: 401,
      token: async () => accessToken({ key: (await generateKeyPair('RS256')).privateKey }),
    },
    { name: 'no email', status: 401, token: () => accessToken({ email: null }) },
    { name: 'valid token', status: 200, token: () => accessToken() },
  ])('$name → $status', async ({ status, token }) => {
    const value = await token();
    const headers: HeadersInit = value ? { 'Cf-Access-Jwt-Assertion': value } : {};
    const res = await app.request('/api/members', { headers }, env);
    expect(res.status).toBe(status);
  });
});

describe('member actions', () => {
  it.each([
    { after: 'active', audit: 'approve', from: 'pending', method: 'POST', path: '/approve' },
    { after: 'disabled', audit: 'disable', from: 'pending', method: 'POST', path: '/disable' },
    { after: 'disabled', audit: 'disable', from: 'active', method: 'POST', path: '/disable' },
    { after: 'active', audit: 'enable', from: 'disabled', method: 'POST', path: '/enable' },
    { after: undefined, audit: 'delete', from: 'disabled', method: 'DELETE', path: '' },
  ] as const)(
    '$method $path on a $from user → $audit',
    async ({ after, audit, from, method, path }) => {
      const member = await addMember(from);
      expect((await call(`/members/${member.id}${path}`, method)).status).toBe(204);

      const [latest] = (await call('/audit')).body;
      const sessions = await db.query.session.findMany({
        where: eq(schema.session.userId, member.id),
      });
      expect({ latest, sessions: sessions.length, status: await statusOf(member.id) }).toEqual({
        status: after,
        // Only deleting removes sessions; disabled users stay signed in but are refused access.
        latest: expect.objectContaining({
          action: audit,
          actorEmail: adminEmail,
          targetEmail: member.email,
          targetUserId: member.id,
        }),
        sessions: after ? 1 : 0,
      });
    },
  );

  it.each([
    { from: 'active', method: 'POST', path: '/approve' },
    { from: 'active', method: 'POST', path: '/enable' },
    { from: 'pending', method: 'DELETE', path: '' },
    { from: 'active', method: 'DELETE', path: '' },
  ] as const)('refuses $method $path on a $from user', async ({ from, method, path }) => {
    const member = await addMember(from);
    const res = await call(`/members/${member.id}${path}`, method);
    const audits = await db.query.auditLog.findMany({
      where: eq(schema.auditLog.targetUserId, member.id),
    });
    expect({ after: await statusOf(member.id), audits, status: res.status }).toEqual({
      after: from,
      audits: [],
      status: 409,
    });
  });

  it('refuses requests from another site', async () => {
    const member = await addMember('pending');
    const res = await app.request(
      `/api/members/${member.id}/approve`,
      {
        headers: { 'Cf-Access-Jwt-Assertion': await accessToken(), Origin: 'https://evil.example' },
        method: 'POST',
      },
      env,
    );
    expect({ after: await statusOf(member.id), status: res.status }).toEqual({
      after: 'pending',
      status: 403,
    });
  });

  it.each([
    { method: 'DELETE', path: '/members/nope' },
    { method: 'POST', path: '/members/nope/approve' },
  ])('$method $path → 404', async ({ method, path }) => {
    expect(await call(path, method)).toEqual({ body: { error: 'Member not found' }, status: 404 });
  });
});
