import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

function walk(d, skip) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory() && !skip.includes(e.name)) r.push(...walk(f, skip));
    else if (e.name === 'index.html') r.push(f);
  }
  return r;
}

const pages = walk(pub, ['api', 'admin', 'assets', 'scripts', 'node_modules']);
let ogMissing = 0, twitterMissing = 0;
const missingList = [];

for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8');
  const rel = path.relative(pub, f);
  const hasOG = /<meta[^>]+property=["']og:title["']/i.test(h);
  const hasTwitter = /<meta[^>]+name=["']twitter:card["']/i.test(h);
  if (!hasOG) { ogMissing++; missingList.push({ rel, type: 'OG' }); }
  if (!hasTwitter) twitterMissing++;
}

console.log('Total pages:', pages.length);
console.log('Missing OG tags:', ogMissing);
console.log('Missing Twitter Card:', twitterMissing);
console.log('\nPages missing OG:');
for (const m of missingList) console.log(' ', m.rel);
