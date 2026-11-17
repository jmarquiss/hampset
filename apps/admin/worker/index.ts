import { createInvite, getDb, INVITE_TTL_MS, schema } from "@club/db";
import { club } from "@club/shared/club";
import { asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { validator } from "hono/validator";
import { requireAccess } from "./access";
import { sendEmail } from "./email";
import type { AdminEnv } from "./env";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_DAYS = INVITE_TTL_MS / (24 * 60 * 60 * 1000);

export const app = new Hono<AdminEnv>().basePath("/api");

app.use(secureHeaders(), requireAccess, csrf());

app.get("/members", async (c) => {
  const members = await getDb(c.env.DB).query.user.findMany({
    columns: { id: true, name: true, email: true, createdAt: true },
    orderBy: asc(schema.user.name),
  });
  return c.json(members);
});

// Deleting the user cascades to their sessions and linked Google account, signing them out.
app.delete("/members/:id", async (c) => {
  const deleted = await getDb(c.env.DB)
    .delete(schema.user)
    .where(eq(schema.user.id, c.req.param("id")))
    .returning({ id: schema.user.id });
  if (deleted.length === 0) return c.json({ error: "Member not found" }, 404);
  return c.body(null, 204);
});

app.get("/invites", async (c) => {
  const invites = await getDb(c.env.DB).query.invite.findMany({
    columns: { id: true, email: true, expiresAt: true, createdAt: true },
    orderBy: desc(schema.invite.createdAt),
  });
  return c.json(invites);
});

app.post(
  "/invites",
  validator("json", (value: { email?: unknown }, c) => {
    const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return c.json({ error: "Enter a valid email address." }, 400);
    }
    return { email };
  }),
  async (c) => {
    const { email } = c.req.valid("json");
    const db = getDb(c.env.DB);
    if (await db.query.user.findFirst({ where: eq(schema.user.email, email) })) {
      return c.json({ error: `${email} is already a member.` }, 409);
    }

    const token = await createInvite(db, email);
    const link = new URL(`/invite/${token}`, c.env.APP_URL).toString();
    try {
      await sendEmail(c.env, {
        to: email,
        subject: `You're invited to the ${club.shortName} members area`,
        text: [
          `You've been invited to join the ${club.name} members area.`,
          `Open this link and continue with Google to accept. It works once and expires in ${INVITE_DAYS} days:`,
          link,
          `If you weren't expecting this, you can ignore this email.`,
        ].join("\n\n"),
      });
    } catch (err) {
      console.error("invite email failed", err);
      // Nobody received the link, so don't leave it listed as pending.
      await db.delete(schema.invite).where(eq(schema.invite.email, email));
      return c.json({ error: "The invite email couldn't be sent. Please try again." }, 502);
    }
    return c.json({ email }, 201);
  },
);

app.delete("/invites/:id", async (c) => {
  const deleted = await getDb(c.env.DB)
    .delete(schema.invite)
    .where(eq(schema.invite.id, c.req.param("id")))
    .returning({ id: schema.invite.id });
  if (deleted.length === 0) return c.json({ error: "Invite not found" }, 404);
  return c.body(null, 204);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || "Request refused" }, err.status);
  }
  console.error(err);
  return c.json({ error: "Something went wrong" }, 500);
});

export default app;
