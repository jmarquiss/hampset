import { claimInvite, createInvite, getDb, hashToken, schema } from "@club/db";
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { authOptions } from "../worker/auth";
import { app } from "../worker/index";

const db = getDb(env.DB);

describe("claimInvite", () => {
  it.each([
    { name: "valid token", setup: (token: string) => token, claimed: true },
    { name: "unknown token", setup: () => "not-a-real-token", claimed: false },
    {
      name: "expired token",
      setup: async (token: string) => {
        await db
          .update(schema.invite)
          .set({ expiresAt: new Date(Date.now() - 1000) })
          .where(eq(schema.invite.tokenHash, await hashToken(token)));
        return token;
      },
      claimed: false,
    },
  ])("$name", async ({ setup, claimed }) => {
    const token = await createInvite(db, `${crypto.randomUUID()}@example.com`);
    expect(await claimInvite(db, await setup(token))).toBe(claimed);
  });

  it("works only once", async () => {
    const token = await createInvite(db, `${crypto.randomUUID()}@example.com`);
    expect([await claimInvite(db, token), await claimInvite(db, token)]).toEqual([true, false]);
  });

  it("re-inviting an email replaces the old link", async () => {
    const email = `${crypto.randomUUID()}@example.com`;
    const oldToken = await createInvite(db, email);
    const newToken = await createInvite(db, email);
    expect([await claimInvite(db, oldToken), await claimInvite(db, newToken)]).toEqual([
      false,
      true,
    ]);
  });
});

describe("sign-up gate", () => {
  const validate = authOptions(env).user.validateUserInfo;
  const user = { email: "new@example.com", name: "New Member" };

  // Called outside an OAuth callback, so there is never an invite token here.
  it.each([
    { action: "create-user", expected: { error: "invite_required" } },
    { action: "sign-in", expected: undefined },
  ] as const)("$action → $expected", async ({ action, expected }) => {
    expect(await validate({ user, source: { action, method: "oauth" } })).toEqual(expected);
  });
});

describe("GET /api/me", () => {
  it("returns 401 without a session", async () => {
    const res = await app.request("/api/me", {}, env);
    expect(res.status).toBe(401);
  });

  /** Creates a member with a live session, returning their id, email and request headers. */
  async function signedInMember() {
    // Without the invite gate, so the test helper can create a member directly.
    const options = { ...authOptions(env), user: {}, plugins: [testUtils()] };
    const ctx = await betterAuth(options).$context;
    const saved = await ctx.test.saveUser(
      ctx.test.createUser({ email: `${crypto.randomUUID()}@example.com`, name: "Test Member" }),
    );
    return { ...saved, headers: await ctx.test.getAuthHeaders({ userId: saved.id }) };
  }

  it("returns the signed-in member", async () => {
    const member = await signedInMember();
    const res = await app.request("/api/me", { headers: member.headers }, env);
    expect({ status: res.status, body: await res.json() }).toEqual({
      status: 200,
      body: { id: member.id, name: "Test Member", email: member.email },
    });
  });

  it("extends a session that is more than a day old", async () => {
    const member = await signedInMember();
    // A 30-day session with one day left was created 29 days ago.
    await db
      .update(schema.session)
      .set({ expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
      .where(eq(schema.session.userId, member.id));

    const res = await app.request("/api/me", { headers: member.headers }, env);
    expect(res.headers.getSetCookie().some((c) => c.includes("session_token"))).toBe(true);
  });
});
