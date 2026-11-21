import type { D1Migration } from 'cloudflare:test';

import type { Env as AdminBindings } from '../worker/env';

declare global {
  namespace Cloudflare {
    interface Env extends AdminBindings {
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
