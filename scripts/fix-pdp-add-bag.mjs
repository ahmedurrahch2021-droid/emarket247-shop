/**
 * fix-pdp-add-bag.mjs
 * WS-D — Fixes the main PDP "Add to Bag" button.
 *
 * The main PDP button (id="pdp-add-bag") uses:
 *   data-pdp-add-bag="ID" data-title="..." data-slug="..." data-img="..." data-cat="..."
 *
 * The site.js event listener looks for [data-add-bag] and reads
 * dataset.productTitle / productSlug / productImage / productCat.
 * This script surgically replaces only the button tag with id="pdp-add-bag",
 * leaving related product cards (already correctly wired) untouched.
 *
 * Also updates button label from "Ask for details" → "Add to Bag".
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const LANGS = ['en', 'bn'];

let fixed = 0;
let skipped = 0;

for (const lang of LANGS) {
  const PDP_DIR = join(ROOT, 'public_html', lang, 'products');
  let pdpDirs;
  try {
    pdpDirs = readdirSync(PDP_DIR).filter(n => n !== 'index.html');
  } catch {
    continue;
  }

  for (const slug of pdpDirs) {
    const filePath = join(PDP_DIR, slug, 'index.html');
    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      skipped++;
      continue;
    }

    // Check if the main PDP button already uses the correct attribute name
    if (content.includes('data-add-bag="')) {
      // Find if it's on the pdp-add-bag button specifically
      const mainBtnMatch = content.match(/<button[^>]*?id="pdp-add-bag"[^>]*?>/);
      if (mainBtnMatch && mainBtnMatch[0].includes('data-add-bag="')) {
        skipped++;
        continue;
      }
    }

    // Extract existing values from the old button attributes
    const oldBtnMatch = content.match(
      /<button[^>]*?id="pdp-add-bag"[^>]*?>/,
    );
    if (!oldBtnMatch) {
      skipped++;
      continue;
    }

    const oldBtn = oldBtnMatch[0];

    // Pull the product ID from data-pdp-add-bag or data-add-bag
    const idMatch = oldBtn.match(/\bdata-(?:pdp-add-bag|add-bag)="([^"]+)"/);
    const titleMatch = oldBtn.match(/\bdata-title="([^"]+)"/);
    const slugMatch = oldBtn.match(/\bdata-slug="([^"]+)"/);
    const imgMatch = oldBtn.match(/\bdata-img="([^"]+)"/);
    const catMatch = oldBtn.match(/\bdata-cat="([^"]+)"/);

    if (!idMatch) {
      skipped++;
      continue;
    }

    const id = idMatch[1];
    const title = titleMatch ? titleMatch[1] : '';
    const slugVal = slugMatch ? slugMatch[1] : slug;
    const img = imgMatch ? imgMatch[1] : '';
    const cat = catMatch ? catMatch[1] : '';

    // Build the correctly-wired button
    const label = lang === 'bn' ? 'ব্যাগে যোগ করুন' : 'Add to Bag';
    const newBtn = `<button class="pdp-btn-add-bag-primary" id="pdp-add-bag" type="button" data-add-bag="${id}" data-product-title="${title}" data-product-slug="${slugVal}" data-product-image="${img}" data-product-cat="${cat}">`;

    // Replace only the first occurrence (the main PDP button)
    const newContent = content.replace(oldBtn, newBtn);

    // Update label if old label exists
    const labelRe = lang === 'bn'
      ? /<span class="pdp-bag-text pdp-add-bag-label">[^<]*<\/span>/
      : /<span class="pdp-bag-text pdp-add-bag-label">[^<]*<\/span>/;
    const newLabel = `<span class="pdp-bag-text pdp-add-bag-label">${label}</span>`;
    const finalContent = newContent.replace(labelRe, newLabel);

    if (finalContent === content) {
      skipped++;
      continue;
    }

    writeFileSync(filePath, finalContent, 'utf8');
    console.log(`  ✓ ${lang}/products/${slug}/`);
    fixed++;
  }
}

console.log(`\nResult: ${fixed} PDPs fixed, ${skipped} skipped.`);
