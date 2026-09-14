import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DIR = join(ROOT, 'public_html/en/products');

const slugs = readdirSync(DIR).sort();

slugs.forEach(slug => {
  const html = readFileSync(join(DIR, slug, 'index.html'), 'utf8');
  const m = html.match(/<meta property="og:title" content="([^"]+)"/);
  const title = m ? m[1].split('|')[0].trim() : '???';
  console.log(`${slug} => ${title}`);
});
