/**
 * task3-product-mapping.mjs
 * Task 3 — Move 24 products to correct category folders + rename jewellery-detail-07
 *
 * Moves:
 *   bangles-17  (Floral Drop Necklace)         → necklaces-17
 *   bangles-18  (Floral Station Necklace)       → necklaces-18
 *   bangles-19  (Geometric Signet Ring)        → rings-19
 *   bangles-23  (Pearl-Style Earrings)          → earrings-23
 *   bangles-24  (Triple-Bead Ring)              → rings-24
 *   bangles-25  (Chevron Crossed-Band Ring)     → rings-25
 *   bangles-26  (Floral Detail Ring)            → rings-26
 *   bangles-27  (Floral Gold-Tone Ring)         → rings-27
 *   bangles-28  (Floral Cluster Ring)           → rings-28
 *   jewellery-detail-01 (Interwoven Ring)       → rings-01
 *   jewellery-detail-06 (Stone-Detail Earrings) → earrings-06
 *   jewellery-detail-07 (Circle-Motif Earring) → earrings-07  [RENAMED from Jewellery Set]
 *   jewellery-detail-10 (Lattice Dome Ring)     → rings-10
 *   jewellery-detail-11 (Infinity Crossed Ring)→ rings-11
 *   jewellery-detail-12 (Heart Ring Pair)        → rings-12
 *   jewellery-detail-13 (Double-Heart Ring)     → rings-13
 *
 * Also renames jewellery-detail-31 (Teardrop Pendant) → pendants-31
 *
 * Updates internal links site-wide (category grids, shop pages, occasions, etc.)
 * and updates og:url / canonical URLs inside each moved PDP.
 */

import { readFileSync, writeFileSync, readdirSync, renameSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HTML_DIR = join(ROOT, 'public_html');
const LANGS = ['en', 'bn'];

// Map: old slug → { newSlug, category }
const MOVES = [
  { old: 'emarket247-bangles-17',      new: 'emarket247-necklaces-17',   cat: 'necklaces' },
  { old: 'emarket247-bangles-18',      new: 'emarket247-necklaces-18',    cat: 'necklaces' },
  { old: 'emarket247-bangles-19',      new: 'emarket247-rings-19',        cat: 'rings'     },
  { old: 'emarket247-bangles-23',      new: 'emarket247-earrings-23',     cat: 'earrings' },
  { old: 'emarket247-bangles-24',      new: 'emarket247-rings-24',         cat: 'rings'     },
  { old: 'emarket247-bangles-25',      new: 'emarket247-rings-25',         cat: 'rings'     },
  { old: 'emarket247-bangles-26',      new: 'emarket247-rings-26',         cat: 'rings'     },
  { old: 'emarket247-bangles-27',      new: 'emarket247-rings-27',         cat: 'rings'     },
  { old: 'emarket247-bangles-28',      new: 'emarket247-rings-28',         cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-01', new: 'emarket247-rings-01',   cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-06', new: 'emarket247-earrings-06', cat: 'earrings' },
  { old: 'emarket247-jewellery-detail-07', new: 'emarket247-earrings-07', cat: 'earrings' },
  { old: 'emarket247-jewellery-detail-10', new: 'emarket247-rings-10',     cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-11', new: 'emarket247-rings-11',    cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-12', new: 'emarket247-rings-12',     cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-13', new: 'emarket247-rings-13',    cat: 'rings'     },
  { old: 'emarket247-jewellery-detail-31', new: 'emarket247-pendants-31',  cat: 'pendants'  },
];

// Products that stay in bangles (8 products remain + 3 original correctly-named bangles)
const BANGLE_KEEP = [
  'emarket247-bangles-20',
  'emarket247-bangles-29',
  'emarket247-bangles-30',
];

// Build a flat lookup: old slug → new slug
const SLUG_MAP = {};
for (const m of MOVES) SLUG_MAP[m.old] = m.new;

// Build all URL replacements: need to replace /{old-slug}/ with /{new-slug}/ in links
const URL_REPLACEMENTS = [];
for (const m of MOVES) {
  URL_REPLACEMENTS.push({ from: `/${m.old}/`, to: `/${m.new}/` });
}

// ── Step 1: Move folders (EN + BN) ──────────────────────────────────────────
console.log('=== Moving product folders ===');
for (const m of MOVES) {
  for (const lang of LANGS) {
    const srcDir = join(HTML_DIR, lang, 'products', m.old);
    const dstDir = join(HTML_DIR, lang, 'products', m.new);

    if (!existsSync(srcDir)) {
      console.log(`  ⚠ SKIP (not found): ${lang}/${m.old}`);
      continue;
    }
    if (existsSync(dstDir)) {
      console.log(`  ⚠ EXISTS already: ${lang}/${m.new} — skipping`);
      continue;
    }

    mkdirSync(dstDir, { recursive: true });
    const files = readdirSync(srcDir);
    for (const file of files) {
      copyFileSync(join(srcDir, file), join(dstDir, file));
    }
    console.log(`  ✓ ${lang}: ${m.old} → ${m.new}`);
  }
}

// ── Step 2: Update internal links across all HTML files ─────────────────────
console.log('\n=== Updating internal links ===');

function updateLinksInFile(filePath) {
  let html = readFileSync(filePath, 'utf8');
  const original = html;

  for (const { from, to } of URL_REPLACEMENTS) {
    // Replace in href=, src=, hreflang=, data-* attributes, JSON text
    html = html.split(from).join(to);
  }

  if (html !== original) {
    writeFileSync(filePath, html, 'utf8');
    const rel = filePath.replace(ROOT + '\\public_html\\', '').replace(/\\/g, '/');
    console.log(`  ✓ ${rel}`);
    return true;
  }
  return false;
}

function scanAndUpdateLinks(dir) {
  let updated = 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      updated += scanAndUpdateLinks(full);
    } else if (entry.name === 'index.html') {
      if (updateLinksInFile(full)) updated++;
    }
  }
  return updated;
}

const totalUpdated = scanAndUpdateLinks(HTML_DIR);
console.log(`  → ${totalUpdated} files updated`);

// ── Step 3: Update og:url and canonical inside moved PDPs ────────────────────
console.log('\n=== Updating PDP og:url / canonical ===');
for (const m of MOVES) {
  for (const lang of LANGS) {
    const dstDir = join(HTML_DIR, lang, 'products', m.new);
    const pdpFile = join(dstDir, 'index.html');
    if (!existsSync(pdpFile)) continue;

    let html = readFileSync(pdpFile, 'utf8');
    const original = html;

    // Fix og:url
    html = html.replace(
      /<meta property="og:url" content="https:\/\/emarket247\.shop\/\w+\/products\/[^"]+"/,
      `<meta property="og:url" content="https://emarket247.shop/${lang}/products/${m.new}/">`
    );
    // Fix canonical
    html = html.replace(
      /<link rel="canonical" href="https:\/\/emarket247\.shop\/\w+\/products\/[^"]+"/,
      `<link rel="canonical" href="https://emarket247.shop/${lang}/products/${m.new}/">`
    );
    // Fix alternate hreflang
    const otherLang = lang === 'en' ? 'bn' : 'en';
    html = html.replace(
      /<link rel="alternate" hreflang="\w+" href="https:\/\/emarket247\.shop\/\w+\/products\/[^"]+"/g,
      `<link rel="alternate" hreflang="\${otherLang}" href="https://emarket247.shop/\${otherLang}/products/${m.new}/">`
    );

    if (html !== original) {
      writeFileSync(pdpFile, html, 'utf8');
      console.log(`  ✓ ${lang}/${m.new} — og:url + canonical updated`);
    }
  }
}

// ── Step 4: Update og:title (jewellery-detail-07 rename) ──────────────────
console.log('\n=== Renaming jewellery-detail-07 → Circle-Motif Earring ===');
for (const lang of LANGS) {
  const file = join(HTML_DIR, lang, 'products', 'emarket247-earrings-07', 'index.html');
  if (!existsSync(file)) continue;
  let html = readFileSync(file, 'utf8');
  const original = html;

  // Replace "Circle-Motif Gold-Tone Jewellery Set" → "Circle-Motif Gold-Tone Earring"
  html = html.replace(/Circle-Motif Gold-Tone Jewellery Set/g, 'Circle-Motif Gold-Tone Earring');

  if (html !== original) {
    writeFileSync(file, html, 'utf8');
    console.log(`  ✓ ${lang}/earrings-07 — title updated`);
  }
}

console.log('\nDone.');
