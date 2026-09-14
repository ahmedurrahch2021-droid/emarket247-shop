/**
 * fix-cart-icon-links.mjs
 * WS-D — Fixes ALL header cart icon hrefs: /shop/ → /cart/
 * Recursively finds all .html files under public_html/ and replaces
 * the cart icon link in both desktop header-icons and mobile-nav-icons blocks.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HTML_DIR = join(ROOT, 'public_html');

// The old and new cart icon hrefs for EN and BN
const FIXES = [
  // Desktop header icon (no title="Cart")
  { from: '<a href="/en/shop/" class="icon-link" aria-label="Cart"', to: '<a href="/en/cart/" class="icon-link" aria-label="Cart"' },
  // Mobile nav icon (with title="Cart")
  { from: '<a href="/en/shop/" class="icon-link" aria-label="Cart" title="Cart">', to: '<a href="/en/cart/" class="icon-link" aria-label="Cart" title="Cart">' },
  { from: '<a href="/bn/shop/" class="icon-link" aria-label="Cart"', to: '<a href="/bn/cart/" class="icon-link" aria-label="Cart"' },
  { from: '<a href="/bn/shop/" class="icon-link" aria-label="Cart" title="Cart">', to: '<a href="/bn/cart/" class="icon-link" aria-label="Cart" title="Cart">' },
];

function walkFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      const stat = { isDirectory: () => false };
      // readdirSync succeeds on directories, throws on files
      const children = readdirSync(full);
      walkFiles(full, files);
    } catch {
      if (entry.endsWith('.html')) files.push(full);
    }
  }
  return files;
}

const files = walkFiles(HTML_DIR);
let fixedFiles = 0;
let totalReplacements = 0;

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  let newContent = content;
  let replacements = 0;

  for (const { from, to } of FIXES) {
    if (content.includes(from)) {
      const count = (content.split(from).length - 1);
      replacements += count;
      newContent = newContent.split(from).join(to);
    }
  }

  if (replacements > 0) {
    writeFileSync(file, newContent, 'utf8');
    const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
    console.log(`  ✓ ${rel} — ${replacements} fix(es)`);
    fixedFiles++;
    totalReplacements += replacements;
  }
}

console.log(`\nDone. ${fixedFiles} files updated, ${totalReplacements} total replacements.`);
