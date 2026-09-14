/**
 * populate-catalog-grids.mjs
 * WS-D — Populates category and shop page product grids with static HTML cards.
 *
 * How it works:
 *   1. Scans all PDPs in public_html/{lang}/products/{slug}/
 *   2. Extracts: slug, id (from data-pdp-add-bag or data-add-bag),
 *      title (from og:title or <title>), image, category
 *   3. Generates product-card HTML matching the enhanced card CSS
 *   4. Writes cards into the category page grids
 *      (public_html/{lang}/categories/{cat}/index.html)
 *   5. Writes ALL cards into the shop page grid
 *      (public_html/{lang}/shop/index.html)
 *
 * The "Add to Bag" button wires to the existing site.js cart engine
 * via data-add-bag / data-product-* attributes.
 *
 * No real prices: "Price on request" shown (CSS .is-pending class hides price).
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Category slug → display-name mapping ──────────────────────────────────────
const CAT_MAP = {
  'bangles':        { en: 'Bangles',         bn: 'চুড়ি',           slug: 'bangles' },
  'necklaces':      { en: 'Necklaces',        bn: 'হার',             slug: 'necklaces' },
  'bracelets':      { en: 'Bracelets',       bn: 'ব্রেসলেট',        slug: 'bracelets' },
  'earrings':       { en: 'Earrings',         bn: 'কানের দুল',       slug: 'earrings' },
  'rings':          { en: 'Rings',            bn: 'আংটি',            slug: 'rings' },
  'pendants':       { en: 'Pendants',         bn: 'লকেট',            slug: 'pendants' },
  'jewellery-sets': { en: 'Jewellery Sets',   bn: 'জুয়েলারি সেট',   slug: 'jewellery-sets' },
  'bridal-jewellery': { en: 'Bridal Jewellery', bn: 'ব্রাইডাল জুয়েলারি', slug: 'bridal-jewellery' },
  'gift-jewellery': { en: 'Gift Jewellery',   bn: 'উপহারের জুয়েলারি', slug: 'gift-jewellery' },
};

// Detect which category a slug belongs to by checking if the slug
// contains the category key (e.g. "emarket247-bangles-17" → "bangles")
function slugToCategory(slug) {
  for (const key of Object.keys(CAT_MAP)) {
    if (slug.includes(key)) return key;
  }
  // jewellery-detail-* → null (uncategorised — shop page only)
  return null;
}

// ── Read all PDPs for one language ────────────────────────────────────────────
function readPdps(lang) {
  const pdpDir = join(ROOT, 'public_html', lang, 'products');
  let entries;
  try {
    entries = readdirSync(pdpDir).filter(n => n !== 'index.html');
  } catch {
    return [];
  }
  const products = [];
  for (const slug of entries) {
    const filePath = join(pdpDir, slug, 'index.html');
    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    // Extract product ID from Add to Bag button
    const idMatch = content.match(/data-(?:pdp-add-bag|add-bag)="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slug;

    // Extract title: og:title meta tag
    const titleMatch = content.match(/<meta property="og:title" content="([^"]+)"/);
    const title = titleMatch ? titleMatch[1].replace(/ \| eMarket247$/, '') : slug;

    // Extract image: og:image meta tag
    const imgMatch = content.match(/<meta property="og:image" content="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : '';

    // Determine category from slug
    const catKey = slugToCategory(slug);
    const cat = catKey ? (lang === 'bn' ? CAT_MAP[catKey].bn : CAT_MAP[catKey].en) : (lang === 'bn' ? 'অলংকার' : 'Jewellery');

    products.push({ slug, id, title, image, category: cat, catKey });
  }
  return products;
}

// ── Escape HTML ────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Build one product card HTML ───────────────────────────────────────────────
function cardHtml(product, lang) {
  const { slug, id, title, image, category } = product;
  const isBn = lang === 'bn';
  const pdpUrl = `/${lang}/products/${slug}/`;
  const waMsg = isBn
    ? `হ্যালো eMarket247, আমি ${title} (রেফারেন্স: ${id}) অর্ডার বা তথ্য জানতে আগ্রহী।`
    : `Hello eMarket247, I want to inquire about ${title} (Ref: ${id}).`;
  const waUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waMsg)}`;
  const addLabel = isBn ? 'ব্যাগে যোগ' : 'Add to Bag';
  const viewLabel = isBn ? 'বিস্তারিত দেখুন →' : 'View detail →';
  const statusLabel = isBn ? '● প্রস্তুত' : '● Ready';
  const priceLabel = isBn ? 'মূল্য জানতে যোগাযোগ করুন' : 'Price on request';

  return `<article class="product-card" data-product-id="${esc(id)}">
  <a class="product-card-media" href="${pdpUrl}" aria-label="${esc(title)}">
    <img src="${esc(image)}" alt="${esc(title)} — eMarket247 product photograph." loading="lazy">
    <span class="product-card-badge">${esc(id)}</span>
  </a>
  <div class="product-card-body">
    <div class="product-card-meta">
      <span class="product-card-cat">${esc(category)}</span>
      <span class="product-card-status">${statusLabel}</span>
    </div>
    <h3 class="product-card-title"><a href="${pdpUrl}">${esc(title)}</a></h3>
    <small class="product-card-desc">${isBn ? 'ক্যাটালগ রেকর্ড। স্পেসিফিকেশন ও মূল্য প্রস্তুতি পর্যায়ে।' : 'Unpriced catalog record. Specifications and price are in preparation.'}</small>
    <p class="product-card-price is-pending">${priceLabel}</p>
  </div>
  <div class="product-card-actions">
    <button type="button" class="product-card-add-btn" data-add-bag="${esc(id)}" data-product-title="${esc(title)}" data-product-slug="${esc(slug)}" data-product-image="${esc(image)}" data-product-cat="${esc(category)}" aria-label="${isBn ? 'ব্যাগে যোগ করুন: ' + esc(title) : 'Add to bag: ' + esc(title)}">
      <span class="btn-icon">+</span> <span class="btn-label">${addLabel}</span>
    </button>
    <a class="product-card-wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer" aria-label="${isBn ? 'WhatsApp-এ অনুসন্ধান' : 'Inquire on WhatsApp'}" title="${isBn ? 'WhatsApp-এ অনুসন্ধান' : 'Inquire on WhatsApp'}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>
    <a class="product-card-cta" href="${pdpUrl}">${viewLabel}</a>
  </div>
</article>`;
}

// ── Inject cards into a page's empty product-grid div ───────────────────────
function injectGrid(content, cardsHtml, lang) {
  const isBn = lang === 'bn';
  const emptyMsg = isBn
    ? 'এই বিভাগে অনুমোদিত পণ্য প্রস্তুতি পর্যায়ে আছে।'
    : 'Approved products for this category are in preparation.';

  const newGrid = `<div class="product-grid" data-catalog data-category="${cardsHtml ? 'catalog' : ''}" data-empty="${esc(emptyMsg)}">${cardsHtml}</div>`;

  // Replace the empty grid placeholder
  return content.replace(
    /<div class="product-grid"[^>]*><\/div>/,
    newGrid
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const LANGS = ['en', 'bn'];

console.log('Scanning PDPs...');
const productsByLang = {};
for (const lang of LANGS) {
  productsByLang[lang] = readPdps(lang);
  console.log(`  [${lang}] ${productsByLang[lang].length} PDPs found`);
}

// Populate category pages
console.log('\nPopulating category pages...');
for (const lang of LANGS) {
  const products = productsByLang[lang];

  for (const [catKey, catInfo] of Object.entries(CAT_MAP)) {
    const catProducts = products.filter(p => p.catKey === catKey);
    if (catProducts.length === 0) continue;

    const catPagePath = join(ROOT, 'public_html', lang, 'categories', catKey, 'index.html');
    let content;
    try {
      content = readFileSync(catPagePath, 'utf8');
    } catch {
      console.warn(`  [!] ${lang}/categories/${catKey}/index.html not found`);
      continue;
    }

    const cardsHtml = catProducts.map(p => cardHtml(p, lang)).join('');
    const newContent = injectGrid(content, cardsHtml, lang);

    if (newContent === content) {
      console.warn(`  [!] No change for ${lang}/categories/${catKey}/`);
      continue;
    }

    writeFileSync(catPagePath, newContent, 'utf8');
    console.log(`  ✓ ${lang}/categories/${catKey}/ — ${catProducts.length} cards`);
  }
}

// Populate shop pages
console.log('\nPopulating shop pages...');
for (const lang of LANGS) {
  const products = productsByLang[lang];
  if (products.length === 0) continue;

  const shopPath = join(ROOT, 'public_html', lang, 'shop', 'index.html');
  let content;
  try {
    content = readFileSync(shopPath, 'utf8');
  } catch {
    console.warn(`  [!] ${lang}/shop/index.html not found`);
    continue;
  }

  const cardsHtml = products.map(p => cardHtml(p, lang)).join('');
  const newContent = injectGrid(content, cardsHtml, lang);

  if (newContent === content) {
    console.warn(`  [!] No change for ${lang}/shop/`);
  } else {
    writeFileSync(shopPath, newContent, 'utf8');
    console.log(`  ✓ ${lang}/shop/ — ${products.length} cards`);
  }
}

console.log('\nDone.');
