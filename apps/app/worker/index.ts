import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { createAuth } from "./auth";
import type { AppEnv } from "./env";

/**
 * Loads the signed-in member into c.var.user, or responds 401. Passes on the refreshed session
 * cookie Better Auth issues once a day, so active members stay signed in.
 */
const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const { headers, response: session } = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
    returnHeaders: true,
  });
  if (!session) return c.json({ error: "Not signed in" }, 401);
  for (const cookie of headers.getSetCookie()) c.header("Set-Cookie", cookie, { append: true });
  const { id, name, email } = session.user;
  c.set("user", { id, name, email });
  return next();
});

export const app = new Hono<AppEnv>().basePath("/api");

app.use(secureHeaders(), csrf());
app.on(["GET", "POST"], "/auth/*", (c) => createAuth(c.env).handler(c.req.raw));

// Everything below requires a session, so new routes are protected by default.
app.use(requireSession);
app.get("/me", (c) => c.json(c.var.user));

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || "Request refused" }, err.status);
  }
  console.error(err);
  return c.json({ error: "Something went wrong" }, 500);
});

export default app;
