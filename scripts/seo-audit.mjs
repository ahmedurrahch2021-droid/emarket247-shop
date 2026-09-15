import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const files = [
  'public_html/index.html',
  'public_html/bn/index.html',
  'public_html/en/products/emarket247-bangles-17/index.html',
  'public_html/bn/products/emarket247-bangles-17/index.html',
  'public_html/en/categories/index.html',
  'public_html/en/shop/index.html',
  'public_html/en/about/index.html',
  'public_html/en/contact/index.html',
  'public_html/en/cart/index.html',
  'public_html/404.html',
];

const checks = [
  { name: 'Canonical',    re: /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i },
  { name: 'OG Title',      re: /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i },
  { name: 'OG Image',      re: /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i },
  { name: 'OG Desc',       re: /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i },
  { name: 'OG URL',        re: /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i },
  { name: 'Twitter Card', re: /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i },
  { name: 'JSON-LD',       re: /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i },
  { name: 'hreflang',      re: /<link[^>]+hreflang/i },
  { name: 'robots',        re: /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i },
  { name: 'viewport',      re: /<meta[^>]+name=["']viewport["']/i },
  { name: 'charset',       re: /<meta[^>]+charset=["']([^"']+)["']/i },
  { name: 'title',         re: /<title[^>]*>([^<]+)<\/title>/i },
];

let allOk = true;

for (const f of files) {
  const fullPath = path.join(root, f);
  if (!fs.existsSync(fullPath)) { console.log('FILE MISSING: ' + f); continue; }
  const html = fs.readFileSync(fullPath, 'utf8');
  const rel = path.relative(path.join(root, 'public_html'), fullPath);
  console.log('\n=== ' + rel);
  for (const check of checks) {
    const m = html.match(check.re);
    const val = m ? (m[1] || 'present').substring(0, 80) : 'MISSING';
    const ok = m ? 'OK' : 'WARN';
    if (!m) allOk = false;
    console.log('  [' + ok + '] ' + check.name + ': ' + val);
  }
}

console.log('\n' + (allOk ? '✅ All checks passed' : '⚠️  Some checks missing'));
