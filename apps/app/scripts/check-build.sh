#!/bin/sh
# Fails the build if the dev-only sign-in (worker/dev.ts) made it into the production bundle.
set -eu
test -d dist
if grep -rlE --include='*.js' 'dev/sign-in|test\.member@localhost|test-utils' dist; then
  echo "The dev-only sign-in leaked into the production build (see worker/dev.ts)." >&2
  exit 1
fi
