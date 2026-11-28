import type { Context } from 'hono';

import type { AppEnv } from '../env';

import { devSignIn } from '../dev';

/** Loaded only in development so production builds omit the test sign-in implementation. */
export function devSignInController(c: Context<AppEnv>) {
  return devSignIn(c);
}
