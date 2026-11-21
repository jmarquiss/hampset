import { createHash } from 'node:crypto';
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = path.dirname(fileURLToPath(import.meta.url)).replace(/\\scripts$/, '');
const outputDir = path.join(siteDir, 'build', 'client');
const headersPath = path.join(outputDir, '_headers');
const hashPlaceholder = '__SCRIPT_HASHES__';

await copyFile(
  path.join(outputDir, '404', 'index.html'),
  path.join(outputDir, '404.html'),
);

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(entryPath);
      return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

const hashes = new Set();
for (const htmlPath of await findHtmlFiles(outputDir)) {
  const html = await readFile(htmlPath, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/i.test(match[1])) continue;
    const hash = createHash('sha256').update(match[2], 'utf8').digest('base64');
    hashes.add(`'sha256-${hash}'`);
  }
}

if (hashes.size === 0) {
  throw new Error('No inline scripts found in the prerendered public site HTML.');
}

const headers = await readFile(headersPath, 'utf8');
if (!headers.includes(hashPlaceholder)) {
  throw new Error(`Expected ${hashPlaceholder} in ${headersPath}.`);
}

await writeFile(headersPath, headers.replace(hashPlaceholder, [...hashes].sort().join(' ')));
console.log(`Generated ${hashes.size} inline script hash(es) in ${headersPath}.`);
