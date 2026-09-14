import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

function check(filePath) {
  if (!fs.existsSync(filePath)) return console.log(`MISSING: ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');
  const varCss = html.includes('variables.css?v=9fcdc491');
  const siteCss = html.includes('site.css?v=ca128acc');
  const hasOldCss = /variables\.css\?v=(?!9fcdc491)/.test(html) || /site\.css\?v=(?!ca128acc)/.test(html);
  const hasNewsletter = html.includes('class="newsletter"');
  const fabricatedPrice = /৳\s*350\s*[-–]\s*6[\s,]*000/.test(html);
  const ogDesc = (html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/) || ['',''])[1].substring(0, 80);
  console.log(`\n${path.relative(pub, filePath)}`);
  console.log(`  variables.css:  ${varCss ? '✅ canonical' : '❌ WRONG'}`);
  console.log(`  site.css:       ${siteCss ? '✅ canonical' : '❌ WRONG'}`);
  console.log(`  newsletter ft: ${hasNewsletter ? '✅ yes' : '❌ no'}`);
  console.log(`  fabricated p:  ${fabricatedPrice ? '❌ STILL THERE' : '✅ none'}`);
  console.log(`  og:desc:       "${ogDesc}"`);
}

const files = [
  'en/guides/glossary/index.html',
  'bn/guides/glossary/index.html',
  'en/occasions/puja/index.html',
  'bn/occasions/puja/index.html',
];

files.forEach(f => check(path.join(pub, f)));
