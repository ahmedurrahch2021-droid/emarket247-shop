/**
 * task1a-fix-delivery-refund.mjs
 * Task 1 Batch 1a — Fix delivery + refund pages (EN + BN = 4 files)
 *
 * Canonical targets:
 *   <body>          → data-language + data-cookie-mode
 *   fonts link     → canonical (includes DM Mono + Bengali fonts)
 *   site.css?v=1.0 → root-relative + canonical version
 *   variables.css  → added before site.css
 *   </body> area   → toast div + site.js added
 *   footer year    → © 2025 → © 2026
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CANONICAL_FONTS_EN = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">`;

const CANONICAL_FONTS_BN = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">`;

const CANONICAL_CSS = `<link rel="stylesheet" href="/assets/css/variables.css?v=9fcdc491">
<link rel="stylesheet" href="/assets/css/site.css?v=ca128acc">`;

const CANONICAL_FOOTER_ENDS = `<div class="toast" role="status" aria-live="polite"></div>
<script src="/assets/js/site.js?v=446b10df" defer></script>
</body>`;

const FILES = [
  { lang: 'en', path: join(ROOT, 'public_html/en/delivery/index.html') },
  { lang: 'bn', path: join(ROOT, 'public_html/bn/delivery/index.html') },
  { lang: 'en', path: join(ROOT, 'public_html/en/refund/index.html') },
  { lang: 'bn', path: join(ROOT, 'public_html/bn/refund/index.html') },
];

const FONTS = { en: CANONICAL_FONTS_EN, bn: CANONICAL_FONTS_BN };

let changed = 0;

for (const { lang, path } of FILES) {
  let html = readFileSync(path, 'utf8');
  const original = html;

  // 1. Fix <body>
  html = html.replace(/<body>/, `<body data-language="${lang}" data-cookie-mode="essential-only">`);

  // 2. Replace fonts block
  // Remove old preconnect + fonts link (might be 1 or 2 <link> tags)
  html = html.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*\n?\s*<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]+?" rel="stylesheet">/,
    FONTS[lang]
  );

  // 3. Fix site.css: absolute URL → root-relative + add variables.css
  html = html.replace(
    /<link rel="stylesheet" href="https:\/\/emarket247\.shop\/assets\/css\/site\.css\?v=1\.0">/,
    CANONICAL_CSS
  );

  // 4. Add toast + site.js before </body>
  html = html.replace('</body>', CANONICAL_FOOTER_ENDS);

  // 5. Fix footer year
  if (lang === 'en') {
    html = html.replace('© 2025 eMarket247', '© 2026 eMarket247');
  } else {
    html = html.replace('© ২০২৫ ইমার্কেট২৪৭', '© ২০২৬ ইমার্কেট২৪৭');
  }

  if (html !== original) {
    writeFileSync(path, html, 'utf8');
    changed++;
    console.log(`✓ Fixed: ${path.split('public_html/')[1]}`);
  } else {
    console.log(`⚠ No change: ${path.split('public_html/')[1]}`);
  }
}

console.log(`\nResult: ${changed}/4 files updated.`);
