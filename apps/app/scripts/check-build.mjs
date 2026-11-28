import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
if (!existsSync(dist)) throw new Error('Build output is missing.');

function* javascriptFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* javascriptFiles(path);
    else if (entry.isFile() && entry.name.endsWith('.js')) yield path;
  }
}

const devSignInMarker = /dev\/sign-in|test\.member@localhost|test-utils/;
for (const file of javascriptFiles(dist)) {
  if (devSignInMarker.test(readFileSync(file, 'utf8'))) {
    throw new Error(`The dev-only sign-in leaked into the production build: ${file}`);
  }
}
