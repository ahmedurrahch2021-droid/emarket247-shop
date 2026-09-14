/**
 * fix-bn-earrings07.mjs
 * Fixes the 5 issues in BN earrings-07:
 * 1. Broken ${otherLang} template literal (appears 2x)
 * 2. Duplicate hreflang entries
 * 3. Broken og:url with stray >
 * 4. Wrong og:title (Jewellery Set)
 * 5. Wrong <title> (Jewellery Set)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const file = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/products/emarket247-earrings-07/index.html';

let html = readFileSync(file, 'utf8');
const original = html;

// Normalize line endings to \n for processing
html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// 1. Fix broken ${otherLang} hreflang entries — replace entire block
html = html.replace(
  /<link rel="alternate" hreflang="\$\{otherLang\}" href="https:\/\/emarket247\.shop\/\$\{otherLang\}\/products\/emarket247-earrings-07\/">\n/g,
  ''
);
// Remove any remaining broken template literal lines
html = html.replace(
  /<link rel="alternate" hreflang="\$\{otherLang\}" href="https:\/\/emarket247\.shop\/\$\{otherLang\}\/products\/emarket247-earrings-07\/">\n/g,
  ''
);
// Also handle the broken canonical/og:url with stray >
html = html.replace(
  /<link rel="canonical" href="https:\/\/emarket247\.shop\/bn\/products\/emarket247-earrings-07\/">\n/g,
  '<link rel="canonical" href="https://emarket247.shop/bn/products/emarket247-earrings-07/">\n'
);
html = html.replace(
  /<meta property="og:url" content="https:\/\/emarket247\.shop\/bn\/products\/emarket247-earrings-07\/">\n/g,
  '<meta property="og:url" content="https://emarket247.shop/bn/products/emarket247-earrings-07/">\n'
);

// 2. Add the missing en alternate hreflang (if not present)
if (!html.includes('hreflang="en" href="https://emarket247.shop/en/products/emarket247-earrings-07/"')) {
  html = html.replace(
    '<link rel="alternate" hreflang="x-default"',
    '<link rel="alternate" hreflang="en" href="https://emarket247.shop/en/products/emarket247-earrings-07/">\n  <link rel="alternate" hreflang="x-default"'
  );
}

// 3. Fix og:title — BN name for Circle-Motif Earring
html = html.replace(
  'বৃত্ত-নকশার সোনালি জুয়েলারি সেট | সিটি গোল্ড গহনা — eMarket247',
  'বৃত্ত-নকশার সোনালি কানের দুল | সিটি গোল্ড গহনা — eMarket247'
);

// 4. Fix <title>
html = html.replace(
  '<title>বৃত্ত-নকশার সোনালি জুয়েলারি সেট | সিটি গোল্ড গহনা — eMarket247</title>',
  '<title>বৃত্ত-নকশার সোনালি কানের দুল | সিটি গোল্ড গহনা — eMarket247</title>'
);

// 5. Fix schema.org Product name
html = html.replace(
  '"name":"বৃত্ত-নকশার সোনালি জুয়েলারি সেট"',
  '"name":"বৃত্ত-নকশার সোনালি কানের দুল"'
);

// Restore CRLF
html = html.replace(/\n/g, '\r\n');

writeFileSync(file, html, 'utf8');
console.log('BN earrings-07 fixed.');

// Also delete old empty folders
import { rmSync, readdirSync } from 'fs';
import { join as pjoin } from 'path';

const ROOT = 'F:/EMARKET247/Project 011/emarket247-shop-main';
const OLD_SLUGS = [
  'emarket247-bangles-17', 'emarket247-bangles-18', 'emarket247-bangles-19',
  'emarket247-bangles-23', 'emarket247-bangles-24', 'emarket247-bangles-25',
  'emarket247-bangles-26', 'emarket247-bangles-27', 'emarket247-bangles-28',
  'emarket247-jewellery-detail-01', 'emarket247-jewellery-detail-06',
  'emarket247-jewellery-detail-07', 'emarket247-jewellery-detail-10',
  'emarket247-jewellery-detail-11', 'emarket247-jewellery-detail-12',
  'emarket247-jewellery-detail-13', 'emarket247-jewellery-detail-31',
];
const LANGS = ['en', 'bn'];
for (const lang of LANGS) {
  for (const slug of OLD_SLUGS) {
    const dir = pjoin(ROOT, 'public_html', lang, 'products', slug);
    try {
      const files = readdirSync(dir);
      if (files.length === 0) {
        rmSync(dir, { recursive: true });
        console.log(`Removed empty: ${lang}/products/${slug}`);
      } else {
        console.log(`NOT removed (not empty): ${lang}/products/${slug} — ${files.length} files`);
      }
    } catch {
      // already gone — fine
    }
  }
}
