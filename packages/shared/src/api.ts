/** An API error carrying the HTTP status and the server's message. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Calls a same-origin `/api` endpoint, throwing ApiError with the server's message on non-2xx. */
export async function api<T>(
  path: string,
  init: { body?: unknown; method?: string } = {},
): Promise<T> {
  const hasBody = init.body !== undefined;
  const res = await fetch(`/api${path}`, {
    body: hasBody ? JSON.stringify(init.body) : undefined,
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    method: init.method ?? (hasBody ? 'POST' : 'GET'),
  }).catch(() => {
    // Network failures, and expired Cloudflare Access sessions redirecting to its login page.
    throw new ApiError("Couldn't reach the server. Check your connection and reload the page.", 0);
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? `Request failed (${res.status})`, res.status);
  return data as T;
}
