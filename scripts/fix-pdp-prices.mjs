#!/usr/bin/env node
/**
 * fix-pdp-prices.mjs
 * Replaces fabricated ৳ 8,500 (Est.) prices across all 54 static PDPs
 * with honest category price bands + WhatsApp CTA.
 *
 * Also fixes:
 *   - JSON-LD AggregateOffer (EN + BN)
 *   - BN PDP: broken <b>মেনু</b> hamburger issue
 *   - FAQ accordion placeholder content
 *
 * Usage: node scripts/fix-pdp-prices.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');

// Category → price band (as displayed on page)
const BANDS = {
  bangles:         '৳ 800–3,500',
  necklaces:       '৳ 900–6,000',
  earrings:        '৳ 350–2,500',
  bracelets:       '৳ 500–2,500',
  'jewellery-detail': '৳ 500–3,000',
};

// Category → JSON-LD schema values
const SCHEMA = {
  bangles:           { low: '800',    high: '3500' },
  necklaces:         { low: '900',    high: '6000' },
  earrings:          { low: '350',    high: '2500' },
  bracelets:         { low: '500',    high: '2500'  },
  'jewellery-detail': { low: '500',   high: '3000'  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function detectCategory(filePath) {
  // e.g. .../public_html/en/products/emarket247-bangles-22/index.html
  const parts = filePath.replace(/\\/g, '/').split('/');
  const productsIdx = parts.findIndex(p => p === 'products');
  if (productsIdx === -1) return null;
  const slug = parts[productsIdx + 1]; // e.g. "emarket247-bangles-22"
  for (const cat of Object.keys(BANDS)) {
    if (slug.includes(cat)) return cat;
  }
  return 'jewellery-detail'; // fallback
}

function isBN(filePath) {
  return filePath.replace(/\\/g, '/').includes('/bn/');
}

function enReplacements(band, schema) {
  return [
    // 1. Remove fabricated price + note from display
    [
      `<span class="pdp-price-val" id="pdp-price-display">৳ 8,500 <small class="pdp-price-note">(Est. / Quote on Inquiry)</small></span>`,
      `<span class="pdp-price-val" id="pdp-price-display">${band} <small class="pdp-price-note">(price band)</small></span>`,
    ],
    // 2. Update hint text
    [
      '<p class="pdp-price-hint">Contact customer care for confirmed pricing and availability.</p>',
      `<p class="pdp-price-hint">Final price confirmed on WhatsApp. Prices may vary by size and finish.</p>`,
    ],
    // 3. Remove "Add to bag" (no cart yet) — replace label
    [
      '<span class="pdp-bag-text pdp-add-bag-label">Add to bag</span>',
      '<span class="pdp-bag-text pdp-add-bag-label">Ask for details</span>',
    ],
    // 4. FAQ placeholder → real questions
    [
      `<div class="pdp-accordion-content">
          <p>Our customer care team is here to assist you.</p>
        </div>`,
      `<div class="pdp-accordion-content">
          <dl class="faq-list">
            <div class="faq-item">
              <dt>Is this real gold?</dt>
              <dd>No — this is gold-tone (imitation) jewellery. It is not solid gold. We always state the material honestly.</dd>
            </div>
            <div class="faq-item">
              <dt>Will the colour fade?</dt>
              <dd>With proper care — removing before water, perfume, and sweat — the colour typically lasts 6–12 months or longer.</dd>
            </div>
            <div class="faq-item">
              <dt>How do I know the exact price?</dt>
              <dd>Send us a WhatsApp message with the product reference. We will confirm the exact price and availability within hours.</dd>
            </div>
            <div class="faq-item">
              <dt>Can I return it?</dt>
              <dd>Yes — within 15 days of delivery, if the piece is unused and in original condition. Contact us on WhatsApp to start a return.</dd>
            </div>
          </dl>
        </div>`,
    ],
  ];
}

function bnReplacements(band) {
  return [
    // 1. Remove fabricated price
    [
      `<span class="pdp-price-val" id="pdp-price-display">৳ 8,500 <small class="pdp-price-note">(আনুমানিক / কোটেশন সাপেক্ষে)</small></span>`,
      `<span class="pdp-price-val" id="pdp-price-display">${band} <small class="pdp-price-note">(মূল্য সীমা)</small></span>`,
    ],
    // 2. Update hint text
    [
      '<p class="pdp-price-hint">নিশ্চিত মূল্য ও সরবরাহ জানতে কাস্টমার কেয়ারে যোগাযোগ করুন</p>',
      `<p class="pdp-price-hint">চূড়ান্ত মূল্য WhatsApp-এ নিশ্চিত করা হবে। সাইজ ও ফিনিশ অনুযায়ী মূল্য ভিন্ন হতে পারে।</p>`,
    ],
    // 3. Remove "Add to bag" → "বিস্তারিত জানুন"
    [
      '<span class="pdp-bag-text pdp-add-bag-label">ব্যাগে যোগ করুন</span>',
      '<span class="pdp-bag-text pdp-add-bag-label">বিস্তারিত জানুন</span>',
    ],
    // 4. Fix hamburger: <b>মেনু</b> → <span></span>
    [
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-hamburger"><span></span><span></span><span></span></span><b>মেনু</b></button>',
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><span></span></button>',
    ],
    // 5. FAQ placeholder → real Bengali questions
    [
      `<div class="pdp-accordion-content">
          <p>আমাদের কাস্টমার কেয়ার টিম আপনাকে সাহায্য করতে প্রস্তুত।</p>
        </div>`,
      `<div class="pdp-accordion-content">
          <dl class="faq-list">
            <div class="faq-item">
              <dt>এটা কি আসল সোনা?</dt>
              <dd>না — এটি সোনালি রঙের (ইমিটেশন) গহনা। এটি বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</dd>
            </div>
            <div class="faq-item">
              <dt>রঙ কি উঠে যাবে?</dt>
              <dd>সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</dd>
            </div>
            <div class="faq-item">
              <dt>সঠিক মূল্য কীভাবে জানব?</dt>
              <dd>পণ্যের রেফারেন্স দিয়ে WhatsApp-এ মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে সঠিক মূল্য ও প্রাপ্যতা নিশ্চিত করব।</dd>
            </div>
            <div class="faq-item">
              <dt>ফেরত দিতে পারব?</dt>
              <dd>হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</dd>
            </div>
          </dl>
        </div>`,
    ],
  ];
}

// ── JSON-LD AggregateOffer injector for EN PDPs ──────────────────────────────
// EN PDPs have a Product @graph entry (no Offer). We inject an AggregateOffer.
function injectAggregateOfferEN(html, category) {
  const s = SCHEMA[category];
  if (!s) return html;

  // The existing Product entry ends before the closing ]}
  // We inject offers: { @type: AggregateOffer, ... } inside the Product object
  // Strategy: find the existing Product @graph entry and add offers after "brand" field
  const offerBlock = `,"offers":{"@type":"AggregateOffer","lowPrice":"${s.low}","highPrice":"${s.high}","priceCurrency":"BDT","availability":"https://schema.org/InStock"}`;

  // Inject after "brand" field in the Product object (in the @graph JSON-LD block)
  // Pattern: brand":{"@type":"Brand","name":"eMarket247"}}
  return html.replace(
    /("brand":\{"@type":"Brand","name":"eMarket247"\})(\}\])/,
    `$1${offerBlock}$2`
  );
}

// ── JSON-LD fix for BN PDPs ──────────────────────────────────────────────────
// BN PDPs have: offers:{"@type":"Offer","priceCurrency":"BDT","price":"0.00","availability":"https://schema.org/PreOrder"}
// Replace with AggregateOffer
function injectAggregateOfferBN(html, category) {
  const s = SCHEMA[category];
  if (!s) return html;

  const offerBlock = `{"@type":"AggregateOffer","lowPrice":"${s.low}","highPrice":"${s.high}","priceCurrency":"BDT","availability":"https://schema.org/InStock"}`;

  return html.replace(
    /"offers":\{"@type":"Offer","url":"[^"]*","priceCurrency":"BDT","price":"[^"]*","availability":"[^"]*"\}/,
    `"offers":${offerBlock}`
  );
}

// ── walk public_html/{en,bn}/products/ ──────────────────────────────────────

let total = 0;
let changed = 0;
let errors = [];

const LANG_DIRS = ['en', 'bn'];

for (const lang of LANG_DIRS) {
  const productsDir = join(ROOT, lang, 'products');
  try {
    const entries = readdirSync(productsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const htmlPath = join(productsDir, entry.name, 'index.html');
      try {
        let html = readFileSync(htmlPath, 'utf8');

        // Only process files with the fabricated price
        if (!html.includes('৳ 8,500')) {
          total++;
          continue;
        }

        const cat = detectCategory(htmlPath);
        const band = BANDS[cat] || '৳ 500–3,000';
        const isBengali = isBN(htmlPath);

        if (isBengali) {
          const reps = bnReplacements(band);
          for (const [old, fresh] of reps) {
            if (html.includes(old)) {
              html = html.replace(old, fresh);
            } else {
              // Log missing pattern (non-fatal)
              // eslint-disable-next-line no-console
              console.warn(`  [BN] Pattern not found in ${entry.name}: ${old.slice(0, 60)}…`);
            }
          }
          html = injectAggregateOfferBN(html, cat);
        } else {
          const reps = enReplacements(band, SCHEMA[cat]);
          for (const [old, fresh] of reps) {
            if (html.includes(old)) {
              html = html.replace(old, fresh);
            } else {
              // eslint-disable-next-line no-console
              console.warn(`  [EN] Pattern not found in ${entry.name}: ${old.slice(0, 60)}…`);
            }
          }
          html = injectAggregateOfferEN(html, cat);
        }

        writeFileSync(htmlPath, html, 'utf8');
        changed++;
        // eslint-disable-next-line no-console
        console.log(`  ✓ ${lang}/products/${entry.name}/ — band: ${band}`);
      } catch (err) {
        errors.push({ path: htmlPath, err: err.message });
      }
      total++;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to read products dir for ${lang}:`, err.message);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. ${changed}/${total} files updated.`);
if (errors.length) {
  // eslint-disable-next-line no-console
  console.error(`${errors.length} errors:`, errors);
  process.exit(1);
}
