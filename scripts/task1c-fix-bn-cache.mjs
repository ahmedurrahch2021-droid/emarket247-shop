/**
 * task1c-fix-bn-cache.mjs
 * Task 1 Batch 1c — Fix cache string on 24 BN product pages
 * site.css?v=9a44f9e6 → site.css?v=ca128acc
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BN_DIR = join(ROOT, 'public_html/bn/products');

const files = readdirSync(BN_DIR).sort();
let fixed = 0;

for (const slug of files) {
  const filePath = join(BN_DIR, slug, 'index.html');
  let html = readFileSync(filePath, 'utf8');
  const original = html;
  html = html.replace(/site\.css\?v=9a44f9e6/g, 'site.css?v=ca128acc');
  if (html !== original) {
    writeFileSync(filePath, html, 'utf8');
    fixed++;
    console.log(`✓ ${slug}`);
  }
}

console.log(`\nBatch 1c: ${fixed} files updated.`);
