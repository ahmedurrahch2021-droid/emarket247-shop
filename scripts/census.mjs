/**
 * census.mjs
 * Task 1 verification — Chrome/CSS drift census
 * Translates the HANDOFF §10 bash census to Node.js (Windows-safe)
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HTML_DIR = join(ROOT, 'public_html');

function findHtmlFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(full));
    } else if (entry.name === 'index.html') {
      results.push(full);
    }
  }
  return results;
}

const files = findHtmlFiles(HTML_DIR).sort();

let bare = 0, noJs = 0, absV1 = 0, noVar = 0, wrongVer = 0, ok = 0;
const issues = [];

for (const file of files) {
  const rel = file.replace(ROOT + '\\public_html\\', '').replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');

  const hasLang = /data-language=/.test(html);
  const hasJs = /assets\/js\/site\.js/.test(html);
  const hasAbsV1 = /site\.css\?v=1\.0|emarket247\.shop\/assets\/css/.test(html);
  const hasVar = /assets\/css\/variables\.css/.test(html);
  const verMatch = html.match(/site\.css\?v=([a-z0-9]+)/);
  const ver = verMatch ? verMatch[1] : '';

  if (!hasLang || !hasJs || hasAbsV1 || !hasVar || ver !== 'ca128acc') {
    const flags = [
      !hasLang ? 'BARE' : '',
      !hasJs ? 'NO-JS' : '',
      hasAbsV1 ? 'ABS-v1' : '',
      !hasVar ? 'NO-VAR' : '',
      ver && ver !== 'ca128acc' ? `ver=${ver}` : '',
    ].filter(Boolean).join(' ');
    issues.push({ rel, flags });
  } else {
    ok++;
  }
}

issues.sort((a, b) => a.rel.localeCompare(b.rel));

console.log(`\n=== Chrome/CSS Census ===`);
console.log(`Total storefront pages scanned: ${files.length}`);
console.log(`Fully canonical: ${ok}`);
console.log(`With issues: ${issues.length}\n`);

if (issues.length === 0) {
  console.log('✓ ALL PAGES CANONICAL — no action needed');
} else {
  for (const { rel, flags } of issues) {
    console.log(`  ${rel.padEnd(55)} ${flags}`);
  }
}
