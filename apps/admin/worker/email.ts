import type { Env } from "./env";

export interface Email {
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends a plain-text email through Resend. On the dev server without a Resend key the email is
 * printed instead, so invite links can be copied from the terminal.
 */
export async function sendEmail(env: Env, email: Email): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    if (!import.meta.env.DEV) throw new Error("RESEND_API_KEY and EMAIL_FROM must be set");
    console.log(`\n[email not sent] To: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, ...email }),
  });
  if (!res.ok) throw new Error(`resend: ${res.status} ${await res.text()}`);
}
