import { getDb, hashToken, schema } from "@club/db";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { app } from "../worker/index";

const db = getDb(env.DB);
const { privateKey, publicKey } = await generateKeyPair("RS256");
const sentEmails: { to: string; subject: string; text: string }[] = [];

beforeAll(async () => {
  const jwk = { ...(await exportJWK(publicKey)), kid: "test", alg: "RS256" };
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url === `${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`) {
      return Response.json({ keys: [jwk] });
    }
    if (url === "https://api.resend.com/emails") {
      const email = JSON.parse(String(init?.body));
      if (email.to.startsWith("bounce")) return new Response("rejected", { status: 422 });
      sentEmails.push(email);
      return Response.json({ id: "email-id" });
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
});

afterEach(() => {
  sentEmails.length = 0;
});

/** Signs an Access-style login token; override fields to make it invalid. */
function accessToken(
  opts: { aud?: string; iss?: string; exp?: string; key?: CryptoKey } = {},
): Promise<string> {
  return new SignJWT({ email: "admin@example.com" })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(opts.iss ?? env.ACCESS_TEAM_DOMAIN)
    .setAudience(opts.aud ?? env.ACCESS_AUD)
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? "5m")
    .sign(opts.key ?? privateKey);
}

/**
 * Calls the admin API as a signed-in admin from the admin page itself (same Origin, as a browser
 * sends), returning the status and parsed JSON body.
 */
async function call(path: string, init: { method?: string; body?: unknown } = {}) {
  const headers = new Headers({
    "Cf-Access-Jwt-Assertion": await accessToken(),
    Origin: "http://localhost",
  });
  if (init.body !== undefined) headers.set("Content-Type", "application/json");
  const res = await app.request(
    `/api${path}`,
    {
      method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    },
    env,
  );
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

/** Inserts a member with one session, as if they had signed in to the members app. */
async function addMember() {
  const id = crypto.randomUUID();
  const email = `${id}@example.com`;
  await db.insert(schema.user).values({ id, name: "Test Member", email, emailVerified: true });
  await db.insert(schema.session).values({
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    userId: id,
    expiresAt: new Date(Date.now() + 60_000),
  });
  return { id, email };
}

describe("Cloudflare Access check", () => {
  it.each([
    { name: "no token", token: async () => null, status: 401 },
    { name: "wrong audience", token: () => accessToken({ aud: "other-app" }), status: 401 },
    {
      name: "wrong issuer",
      token: () => accessToken({ iss: "https://evil.example" }),
      status: 401,
    },
    { name: "expired", token: () => accessToken({ exp: "1 minute ago" }), status: 401 },
    {
      name: "signed by another key",
      token: async () => accessToken({ key: (await generateKeyPair("RS256")).privateKey }),
      status: 401,
    },
    { name: "valid token", token: () => accessToken(), status: 200 },
  ])("$name → $status", async ({ token, status }) => {
    const value = await token();
    const headers: HeadersInit = value ? { "Cf-Access-Jwt-Assertion": value } : {};
    const res = await app.request("/api/members", { headers }, env);
    expect(res.status).toBe(status);
  });
});

describe("invites", () => {
  it("stores only a hash of the token and emails the link", async () => {
    const email = `${crypto.randomUUID()}@example.com`;
    expect(await call("/invites", { body: { email: ` ${email.toUpperCase()} ` } })).toEqual({
      status: 201,
      body: { email },
    });

    const [sent] = sentEmails;
    const token = sent?.text.match(/\/invite\/([0-9a-f]+)/)?.[1] ?? "";
    const row = await db.query.invite.findFirst({ where: eq(schema.invite.email, email) });
    expect({ to: sent?.to, tokenHash: row?.tokenHash }).toEqual({
      to: email,
      tokenHash: await hashToken(token),
    });
  });

  it.each([
    { name: "invalid email", body: { email: "not-an-email" }, status: 400 },
    { name: "missing email", body: {}, status: 400 },
  ])("rejects $name", async ({ body, status }) => {
    expect((await call("/invites", { body })).status).toBe(status);
    expect(sentEmails).toEqual([]);
  });

  it("drops the invite when the email can't be sent", async () => {
    const email = `bounce-${crypto.randomUUID()}@example.com`;
    expect((await call("/invites", { body: { email } })).status).toBe(502);
    expect(await db.query.invite.findFirst({ where: eq(schema.invite.email, email) })).toBe(
      undefined,
    );
  });

  it("rejects inviting an existing member", async () => {
    const { email } = await addMember();
    expect(await call("/invites", { body: { email } })).toEqual({
      status: 409,
      body: { error: `${email} is already a member.` },
    });
  });

  it("lists and revokes pending invites", async () => {
    const email = `${crypto.randomUUID()}@example.com`;
    await call("/invites", { body: { email } });
    const listed = (await call("/invites")).body as { id: string; email: string }[];
    const invite = listed.find((i) => i.email === email);
    expect(invite).toBeDefined();

    expect((await call(`/invites/${invite?.id}`, { method: "DELETE" })).status).toBe(204);
    expect(await db.query.invite.findFirst({ where: eq(schema.invite.email, email) })).toBe(
      undefined,
    );
  });
});

describe("members", () => {
  it("lists members and removes one along with their sessions", async () => {
    const member = await addMember();
    const listed = (await call("/members")).body as { id: string }[];
    expect(listed.map((m) => m.id)).toContain(member.id);

    expect((await call(`/members/${member.id}`, { method: "DELETE" })).status).toBe(204);
    const sessions = await db.query.session.findMany({
      where: eq(schema.session.userId, member.id),
    });
    expect(sessions).toEqual([]);
  });

  it("refuses removal requests from another site", async () => {
    const member = await addMember();
    const res = await app.request(
      `/api/members/${member.id}`,
      {
        method: "DELETE",
        headers: { "Cf-Access-Jwt-Assertion": await accessToken(), Origin: "https://evil.example" },
      },
      env,
    );
    expect(res.status).toBe(403);
    expect(await db.query.user.findFirst({ where: eq(schema.user.id, member.id) })).toBeDefined();
  });
});

describe("deleting unknown ids", () => {
  it.each([
    { path: "/members/nope", error: "Member not found" },
    { path: "/invites/nope", error: "Invite not found" },
  ])("$path → 404", async ({ path, error }) => {
    expect(await call(path, { method: "DELETE" })).toEqual({ status: 404, body: { error } });
  });
});
