import type { D1Migration } from 'cloudflare:test';

import type { Env as AppBindings } from '../worker/env';

declare global {
  namespace Cloudflare {
    interface Env extends AppBindings {
      TEST_CRONS: string[];
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
