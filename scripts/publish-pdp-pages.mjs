#!/usr/bin/env node
/**
 * publish-pdp-pages.mjs
 * Reviewed static PDP publisher — reads emk_products from the live Hostinger
 * database and generates EN + BN static product pages in public_html/.
 *
 * DATA SOURCE
 *   Pass --db to connect to the live Hostinger MySQL DB (requires config from
 *   public_html/api/config.php or HOSTINGER_DB_* env vars).
 *   Pass --seed to read from database/seed_products.sql (canonical slugs, titles,
 *   categories, images; used for local preview and CI validation).
 *
 * APPROVED ARCHITECTURE (AGENTS.md)
 *   - DB is authoritative for live product facts (prices, stock, images).
 *   - Static PDPs are URL-preserving fallback/snapshot layers.
 *   - No fabricated commerce facts: prices come from DB or use honest category
 *     bands; materials, stock, reviews are never invented.
 *   - Editorial content (lead, benefit, care) is consistent per category, not
 *     product-specific — it reflects the product type, not individual items.
 *
 * PRICE POLICY
 *   When DB price is absent or NULL:
 *     → display the honest category price band (e.g. "৳ 800–3,500")
 *     → label it "(price band)" in the note
 *   When DB price exists and > 0:
 *     → display the single confirmed price
 *     → no price band shown (fact is known)
 *   Never show a fabricated specific price.
 *
 * USAGE
 *   node scripts/publish-pdp-pages.mjs --seed        # local / CI (default)
 *   node scripts/publish-pdp-pages.mjs --db           # live Hostinger DB
 *   node scripts/publish-pdp-pages.mjs --dry-run      # list what would change
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = join(__dirname, '..', 'public_html');
const SEED_SQL  = join(__dirname, '..', 'database', 'seed_products.sql');

// ── True content-hash version strings ────────────────────────────────────────
// Computed from the actual bytes of the served assets so regeneration can
// never pin a stale ?v= reference (the rule: always content-hash, never
// hardcode). Mirrors scripts/fix-cache-busting.mjs.
import { createHash } from 'crypto';
function hash8(rel) {
  return createHash('md5').update(readFileSync(join(ROOT, rel))).digest('hex').slice(0, 8);
}
const ASSET_V = {
  variables: hash8('assets/css/variables.css'),
  siteCss:   hash8('assets/css/site.css'),
  pdpCss:    hash8('assets/css/pdp.css'),
  siteJs:    hash8('assets/js/site.js'),
};

// ── Category map ─────────────────────────────────────────────────────────────

const CATEGORIES = {
  rings:           { en: 'Rings',          bn: 'আংটি' },
  earrings:        { en: 'Earrings',       bn: 'কানের দুল' },
  necklaces:       { en: 'Necklaces',     bn: 'হার' },
  bracelets:       { en: 'Bracelets',      bn: 'ব্রেসলেট' },
  bangles:         { en: 'Bangles',       bn: 'চুড়ি' },
  pendants:        { en: 'Pendants',       bn: 'লকেট' },
  'jewellery-sets':{ en: 'Jewellery Sets', bn: 'জুয়েলারি সেট' },
  'bridal-jewellery': { en: 'Bridal Jewellery', bn: 'ব্রাইডাল জুয়েলারি' },
  'gift-jewellery':   { en: 'Gift Jewellery',   bn: 'উপহারের জুয়েলারি' },
};

// ── Honest category price bands ───────────────────────────────────────────────

const PRICE_BANDS = {
  rings:           { band: '৳ 350–2,500',   low: '350',  high: '2500' },
  earrings:        { band: '৳ 350–2,500',   low: '350',  high: '2500' },
  necklaces:       { band: '৳ 900–6,000',   low: '900',  high: '6000' },
  bracelets:       { band: '৳ 500–2,500',   low: '500',  high: '2500' },
  bangles:         { band: '৳ 800–3,500',   low: '800',  high: '3500' },
  pendants:        { band: '৳ 400–3,000',   low: '400',  high: '3000' },
  'jewellery-sets':{ band: '৳ 500–3,000',   low: '500',  high: '3000' },
  'bridal-jewellery': { band: '৳ 800–5,000', low: '800', high: '5000' },
  'gift-jewellery':   { band: '৳ 300–2,500', low: '300', high: '2500' },
};

// ── Editorial content per category ───────────────────────────────────────────

const EDITORIAL = {
  rings: {
    en: {
      kicker: 'Distinctive Silhouette & Contour',
      lead: 'Sculpted with balanced proportion and tactile gold-tone artistry, designed for comfortable everyday or festive hand adornment.',
      benefit: 'Contoured band geometry designed for tactile balance, smooth finger articulation, and understated luxury.',
    },
    bn: {
      kicker: 'অনন্য নকশা ও ভারসাম্য',
      lead: 'সুষম অনুপাত ও স্পর্শকাতর সোনালি রঙের শৈল্পিক কারুকাজে তৈরি আংটি — প্রতিদিনের পরিধান বা উৎসবী সাজের জন্য আদর্শ।',
      benefit: 'অনুপাতিক ব্যান্ড জ্যামিতি যা আঙুলের নড়াচড়ায় স্বাচ্ছন্দ্য এবং বিচক্ষণ বিলাসিতা দেয়।',
    },
  },
  necklaces: {
    en: {
      kicker: 'Gracefully Articulated Collar',
      lead: 'Gracefully articulated collar and pendant necklace, designed to rest naturally against the neckline with refined warmth.',
      benefit: 'Calibrated link drop and center motif balance that frames the décolletage without visual heaviness.',
    },
    bn: {
      kicker: 'মসৃণভাবে সজ্জিত কলার',
      lead: 'গলায় পরিপাটিভাবে বসে থাকা পরিশীলিত নেকলেস ও পেন্ডেন্ট — ঘাড়ের রেখায় স্বাভাবিকভাবে বিশ্রাম নেওয়ার জন্য পরিশীলিত উষ্ণতা দিয়ে তৈরি।',
      benefit: 'সাবলীল লিংক ড্রপ ও কেন্দ্রীয় মোটিফ ব্যালেন্স যা কলারবোনকে চাক্ষুষ ভারীতা ছাড়াই ফ্রেম করে।',
    },
  },
  bangles: {
    en: {
      kicker: 'Classic Circular Bangle',
      lead: 'A classic rigid circular silhouette with warm gold-tone luster, honoring traditional South Asian wristwear with contemporary refinement.',
      benefit: 'Balanced circular symmetry and smooth interior edging for effortless wrist drape and enduring grace.',
    },
    bn: {
      kicker: 'ঐতিহ্যবাহী গোল চুড়ি',
      lead: 'উষ্ণ সোনালি দীপ্তিময় ক্লাসিক বৃত্তাকার গঠন — আধুনিক পরিশীলনের সাথে ঐতিহ্যবাহী দক্ষিণ এশীয় কব্জির অলংকারকে সম্মান জানায়।',
      benefit: 'সুষম বৃত্তাকার প্রতিসাম্য ও মসৃণ অভ্যন্তরীণ প্রান্ত যা কব্জিতে সহজ ঝুলনা ও স্থায়ী লালিত্য দেয়।',
    },
  },
  bracelets: {
    en: {
      kicker: 'Fluid-Link Wrist Architecture',
      lead: 'Supple, fluid-link wrist architecture designed for flexible movement, contemporary elegance, and effortless pairing.',
      benefit: 'Articulated links that drape smoothly along the natural wrist curve, offering tactile comfort and refined gleam.',
    },
    bn: {
      kicker: 'ফ্লুইড লিংক কব্জির কাঠামো',
      lead: 'নমনীয়, তরল-সংযুক্ত কব্জির কাঠামো — নমনীয় গতিশীলতা, সমসাময়িক বিলাসিতা ও সহজ জোড়ার জন্য পরিকল্পিত।',
      benefit: 'প্রাকৃতিক কব্জির বক্ররেখা বরাবর মসৃণভাবে ঝুলে থাকা সংযুক্ত লিংক — স্পর্শকাতর আরাম ও পরিশীলিত দীপ্তি দেয়।',
    },
  },
  earrings: {
    en: {
      kicker: 'Balanced Proportion & Lobe Comfort',
      lead: 'Balanced proportion, lightweight lobe comfort, and light-reflecting gold tones that gracefully accentuate the facial contours.',
      benefit: 'Contoured drop geometry and smooth post backs for secure, comfortable all-day or evening wear.',
    },
    bn: {
      kicker: 'সমতুল্য অনুপাত ও কানের লতির আরাম',
      lead: 'সমতুল্য অনুপাত, হালকা ওজন এবং আলো প্রতিফলিত সোনালি রঙ যা মুখমণ্ডলের রেখাকে আকর্ষণীয়ভাবে ফুটিয়ে তোলে।',
      benefit: 'নিরাপদ ও আরামদায়ক সারাদিন বা সন্ধ্যাকালীন পরিধানের জন্য কন্ট্যুর্ড ড্রপ জ্যামিতি ও মসৃণ পোস্ট ব্যাক।',
    },
  },
  pendants: {
    en: {
      kicker: 'Refined Pendant Silhouette',
      lead: 'A focused pendant silhouette that frames the neckline with targeted warmth and heritage-inspired gold-tone artistry.',
      benefit: 'Calibrated chain length and motif proportion designed to rest naturally against the décolletage.',
    },
    bn: {
      kicker: 'পরিশীলিত পেন্ডেন্ট সিলুয়েট',
      lead: 'লক্ষ্যবস্তু উষ্ণতা ও ঐতিহ্য-অনুপ্রাণিত সোনালি রঙের শৈল্পিকতা দিয়ে ঘাড়ের রেখাকে ফ্রেম করে এমন একটি মনোযোগী পেন্ডেন্ট সিলুয়েট।',
      benefit: 'ঘাড়ের রেখায় স্বাভাবিকভাবে বিশ্রাম নেওয়ার জন্য পরিমাপ করা চেইন দৈর্ঘ্য ও মোটিভ অনুপাত।',
    },
  },
};

const FALLBACK_EDITORIAL = {
  en: { kicker: 'Gold-Tone Jewellery', lead: 'Carefully curated gold-tone jewellery.', benefit: 'Designed for comfort and everyday elegance.' },
  bn: { kicker: 'সোনালি রঙের গহনা', lead: 'সতর্কভাবে বাছাই করা সোনালি রঙের গহনা।', benefit: 'আরাম ও প্রতিদিনের বিলাসিতার জন্য পরিকল্পিত।' },
};

// ── Static page sections ─────────────────────────────────────────────────────

const WA_SVG_SMALL = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/></svg>`;

const WA_SVG_BIG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

const WA_SVG_CARD = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

// ── HTML builders ─────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
}

function slugifyCategory(cat) {
  return cat.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
}

function detectCatFromSlug(slug) {
  for (const key of Object.keys(CATEGORIES)) {
    if (slug.includes(key)) return key;
  }
  return null;
}

function brandName(title) {
  // Strip common prefixes from seed titles like "City Gold Jewelry — ..."
  return title.replace(/^[\s\S]*?—[\s]*/, '').trim();
}

function makeWaUrl(phone, title, ref, slug, lang) {
  const base = lang === 'bn'
    ? `হ্যালো eMarket247, আমি ${title} (রেফারেন্স: ${ref}, লিঙ্ক: https://emarket247.shop/${lang}/products/${slug}/) অর্ডার বা তথ্য জানতে আগ্রহী।`
    : `Hello eMarket247, I want to inquire about ${title} (Ref: ${ref}, Link: https://emarket247.shop/${lang}/products/${slug}/).`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(base)}`;
}

function makeCartWaUrl(phone, items, lang) {
  const base = lang === 'bn'
    ? `হ্যালো eMarket247, আমি ব্যাগের নিচের পণ্যগুলো অর্ডার ও মূল্য জানতে আগ্রহী:${items}\n\nঅনুগ্রহ করে প্রাপ্যতা ও ডেলিভারির সময় নিশ্চিত করবেন। ধন্যবাদ!`
    : `Hello eMarket247, I want to inquire about and order the following items in my bag:${items}\n\nPlease confirm availability and final pricing. Thank you!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(base)}`;
}

// ── Truthful Offer builder ───────────────────────────────────────────────────
// An Offer is emitted ONLY when the database carries an owner-confirmed price
// (> 0 and not flagged pending). It always states the REAL price — never a
// category band — and includes availability only when stock_status is a
// recorded fact. Unknown facts are omitted, not invented (AGENTS.md).

const AVAILABILITY_MAP = {
  in_stock:      'https://schema.org/InStock',
  low_stock:     'https://schema.org/LimitedAvailability',
  made_to_order: 'https://schema.org/MadeToOrder',
  out_of_stock:  'https://schema.org/OutOfStock',
};

function buildOffer(product) {
  const price = Number(product?.price);
  const pending = Number(product?.is_price_pending) === 1;
  if (!(price > 0) || pending) return null;
  const offer = {
    '@type': 'Offer',
    price: String(price),
    priceCurrency: 'BDT',
  };
  const availability = AVAILABILITY_MAP[String(product?.stock_status || '')];
  if (availability) offer.availability = availability;
  return offer;
}

// ── EN JSON-LD ───────────────────────────────────────────────────────────────

function enJsonLd(slug, title, ref, image, canonical, catLabel, catSlug, product) {
  const productNode = {
    '@type': 'Product',
    '@id': `${canonical}#product`,
    name: title,
    description: 'Catalog record in preparation. Specifications, price, and availability are pending approval.',
    image,
    category: catLabel,
    sku: ref,
    brand: { '@type': 'Brand', name: 'eMarket247' },
  };
  // Commerce-truth rule: an Offer may only state facts the database holds.
  // The price is the REAL owner-confirmed price (never a category band), and
  // availability is emitted only when stock_status is actually recorded.
  const offer = buildOffer(product);
  if (offer) productNode.offers = offer;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: `${title} | eMarket247`,
        isPartOf: { '@id': 'https://emarket247.shop/#website' },
        about: { '@id': 'https://emarket247.shop/#organization' },
        inLanguage: 'en',
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        primaryImageOfPage: image,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emarket247.shop/en/' },
          { '@type': 'ListItem', position: 2, name: catLabel, item: `https://emarket247.shop/en/categories/${catSlug}/` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical },
        ],
      },
      productNode,
    ],
  }, null, 0);
}

// ── BN JSON-LD ───────────────────────────────────────────────────────────────

function bnJsonLd(slug, title, ref, image, canonical, catLabel, catSlug, product) {
  const productNode = {
    '@type': 'Product',
    name: title,
    description: 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।',
    image,
    category: catLabel,
    sku: ref,
    brand: { '@type': 'Brand', name: 'eMarket247' },
  };
  const offer = buildOffer(product);
  if (offer) productNode.offers = offer;
  return JSON.stringify({ '@context': 'https://schema.org', ...productNode }, null, 0);
}

// ── Product card HTML (for related products) ─────────────────────────────────

function productCard(p, lang) {
  const title    = lang === 'bn' ? p.title_bn : p.title_en;
  const catLabel = CATEGORIES[p.catKey]?.[lang] ?? p.category;
  const slug     = p.slug;
  const ref      = p.sku;
  const img      = p.image_url;
  const waUrl    = makeWaUrl('8801740501062', title, ref, slug, lang);
  const addLabel = lang === 'bn' ? 'ব্যাগে যোগ করুন' : 'Add to Bag';
  const ctaLabel = lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View detail';
  const waLabel  = lang === 'bn' ? 'WhatsApp-এ অনুসন্ধান' : 'Inquire on WhatsApp';

  return `<article class="product-card" data-product-id="${esc(ref)}">
      <a class="product-card-media" href="/${lang}/products/${slug}/" aria-label="${esc(title)}">
        <img src="${esc(img)}" srcset="${esc(img)}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 25vw" width="1200" height="1200" loading="lazy" alt="${esc(title)} — eMarket247 product photograph.">
        <span class="product-card-badge">${esc(ref)}</span>
      </a>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-cat">${esc(catLabel)}</span>
          <span class="product-card-status">● ${lang === 'bn' ? 'প্রস্তুত' : 'Ready'}</span>
        </div>
        <h3 class="product-card-title"><a href="/${lang}/products/${slug}/">${esc(title)}</a></h3>
        <small class="product-card-desc">${lang === 'bn' ? 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।' : 'Catalog record in preparation. Specifications, price, and availability are pending approval.'}</small>
        <p class="product-card-price">${lang === 'bn' ? 'মূল্য জানতে যোগাযোগ করুন' : 'Price on request'}</p>
      </div>
      <div class="product-card-actions">
        <button type="button" class="product-card-add-btn" data-add-bag="${esc(ref)}" data-product-title="${esc(title)}" data-product-slug="${esc(slug)}" data-product-image="${esc(img)}" data-product-cat="${esc(catLabel)}" aria-label="${esc(addLabel)}: ${esc(title)}">
          <span class="btn-icon">+</span> <span class="btn-label">${addLabel}</span>
        </button>
        <a class="product-card-wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer" aria-label="${waLabel}" title="${waLabel}">
          ${WA_SVG_CARD}
        </a>
        <a class="product-card-cta" href="/${lang}/products/${slug}/">${ctaLabel}</a>
      </div>
    </article>`;
}

// ── Main HTML builder (shared for EN and BN, lang-switching via params) ──────

function buildPdp(product, lang, relatedProducts) {
  const isBn    = lang === 'bn';
  const phone   = '8801740501062';
  const siteUrl = 'https://emarket247.shop';

  const title       = isBn ? product.title_bn : product.title_en;
  const displayTitle = brandName(title);
  const ref         = product.sku;
  const slug        = product.slug;
  const image       = product.image_url;
  const imageAbs   = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const catKey      = detectCatFromSlug(slug) || 'rings';
  const catLabel    = CATEGORIES[catKey]?.[lang] ?? product.category;
  const canonical   = `${siteUrl}/${lang}/products/${slug}/`;
  const altLang     = isBn ? 'en' : 'bn';
  const altPage     = `${siteUrl}/${altLang}/products/${slug}/`;

  const ed = EDITORIAL[catKey]?.[lang] ?? FALLBACK_EDITORIAL[lang];
  const pb = PRICE_BANDS[catKey] ?? { band: '৳ 500–3,000', low: '500', high: '3000' };

  // PRICE POLICY (header comment): a confirmed DB price (> 0, not pending)
  // displays as the single real figure; the honest category band appears only
  // while no price has been confirmed.
  const confirmedPrice = Number(product.price) > 0 && Number(product.is_price_pending) !== 1
    ? Number(product.price)
    : null;
  const priceLabel = confirmedPrice !== null
    ? `৳ ${confirmedPrice.toLocaleString('en-US')}`
    : pb.band;

  const waUrl   = makeWaUrl(phone, displayTitle, ref, slug, lang);
  const waCartItems = `\n\nRef: ${ref}\nPrice: ${priceLabel}`;

  const priceDisplay = confirmedPrice !== null
    ? priceLabel
    : (isBn
      ? `${priceLabel} <small class="pdp-price-note">(মূল্য সীমা)</small>`
      : `${priceLabel} <small class="pdp-price-note">(price band)</small>`);

  const priceHint = isBn
    ? 'চূড়ান্ত মূল্য WhatsApp-এ নিশ্চিত করা হবে। সাইজ ও ফিনিশ অনুযায়ী মূল্য ভিন্ন হতে পারে।'
    : 'Final price confirmed on WhatsApp. Prices may vary by size and finish.';

  const addBagLabel = isBn ? 'বিস্তারিত জানুন' : 'Ask for details';
  const addBag      = isBn ? 'ব্যাগে যোগ করুন' : 'Add to bag';
  const qtyLabel    = isBn ? 'পরিমাণ' : 'Qty';
  const qtyDown     = isBn ? 'পরিমাণ কমান' : 'Decrease quantity';
  const qtyUp       = isBn ? 'পরিমাণ বাড়ান' : 'Increase quantity';
  const waCtaLabel  = isBn ? 'WhatsApp-এ অর্ডার' : 'Order on WhatsApp';
  const sizeLink    = isBn ? 'সাইজ ও পরিমাপ' : 'Size and measurements';
  const customLink  = isBn ? 'কাস্টমাইজের অনুরোধ' : 'Ask about customising';
  const shareLabel  = isBn ? 'লিঙ্ক শেয়ার' : 'Share this piece';
  const deliveryDt  = isBn ? 'ডেলিভারি' : 'Delivery';
  const deliveryDd  = isBn ? 'সারাদেশে কুরিয়ারে পৌঁছে দেওয়া হয়' : 'Nationwide courier across Bangladesh';
  const inspectDt  = isBn ? 'যাচাই' : 'Inspection';
  const inspectDd  = isBn ? 'গ্রহণের আগে পার্সেল খুলে দেখে নিন' : 'Open the parcel before you accept it';
  const careDt     = isBn ? 'সহায়তা' : 'Care line';
  const careDd     = '+880 1740-501062';
  const careLink   = isBn ? 'কাস্টমাইজের অনুরোধ' : 'Ask about customising';

  const sectionBTitle = isBn ? 'কেন এই ডিজাইনটি আপনার ভালো লাগবে' : "Why you'll love this piece";
  const benefit1h = isBn ? 'অনন্য নকশা ও ভারসাম্য' : 'Distinctive Silhouette & Contour';
  const benefit2h = isBn ? 'উজ্জ্বল সোনালি দীপ্তি' : 'Warm South Asian Gold Luster';
  const benefit3h = isBn ? 'দায়িত্বশীল সংরক্ষণ মানদণ্ড' : 'Transparent Curation Standard';
  const benefit2p = isBn
    ? 'উৎসবের শাড়ি, রেশমি পোশাক কিংবা যেকোনো আধুনিক সান্ধ্যকালীন সাজের সাথে নিখুঁতভাবে মানিয়ে যাওয়ার মতো গভীর সোনালি আভা।'
    : 'A rich, warm gold-tone luster inspired by heritage South Asian jewellery traditions, flattering ethnic silks and modern styling alike.';
  const benefit3p = isBn
    ? 'eMarket247 প্রতিটি অলংকার আলাদাভাবে ক্যাটালগভুক্ত ও যাচাই করে উপস্থাপন করে, কোনো ভিত্তিহীন প্রতিশ্রুতি ছাড়া।'
    : 'Each piece in the eMarket247 edit is individually archived and photographed, upholding verified quality and transparent care.';

  const relatedTitle = isBn ? 'এই কালেকশনের অন্যান্য পণ্য' : 'Related pieces from this collection';

  const accordion1  = isBn ? 'পণ্যের বিবরণ' : 'Product Details';
  const accordion2  = isBn ? 'যত্ন ও স্টাইলিং গাইড' : 'Care & Styling Guidance';
  const accordion3  = isBn ? 'শিপিং ও ডেলিভারি' : 'Shipping & Delivery';
  const accordion4  = isBn ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions';

  const faqContent = isBn
    ? `<p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা। এটি বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>
<p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>
<p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে সঠিক মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>
<p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>`
    : `<p><strong>Is this real gold?</strong> No — this is gold-tone (imitation) jewellery, not solid gold. We always state the material honestly.</p>
<p><strong>Will the colour fade?</strong> With proper care — removing before water, perfume, and sweat — the colour typically lasts 6–12 months or longer.</p>
<p><strong>How do I get the exact price?</strong> Message us on WhatsApp with the product reference. We confirm price and availability within hours.</p>
<p><strong>Can I return it?</strong> Yes — within 15 days of delivery, unused and in original condition. Contact us on WhatsApp to start a return.</p>`;

  const careContent = isBn
    ? '<p>নরম শুকনো কাপড় দিয়ে মুছুন; আর্দ্রতা ও সুগন্ধি থেকে দূরে শুকনো জায়গায় রাখুন</p>'
    : '<p>Soft dry cloth wipe; store dry away from moisture & perfumes</p>';

  const shippingContent = isBn
    ? '<p>সারাদেশে কুরিয়ার ডেলিভারি</p>'
    : '<p>Nationwide courier delivery across Bangladesh</p>';

  const relatedHtml = relatedProducts.map(p => productCard(p, lang)).join('');

  const finalCtaH2 = isBn
    ? 'এই পণ্য সম্পর্কে অর্ডার বা প্রশ্ন করতে প্রস্তুত?'
    : 'Ready to order or have questions about this piece?';
  const finalCtaP = isBn
    ? 'আমাদের গ্রাহক সেবা দল প্রাপ্যতা, স্টাইলিং গাইড এবং সহজ অর্ডার প্রক্রিয়ায় সাহায্য করতে এখানে।'
    : 'Our customer care team is here to assist you with availability, styling guidance, and effortless order processing.';
  const finalCtaWa   = isBn ? 'WhatsApp-এ জানুন ↗' : 'Inquire on WhatsApp ↗';
  const finalCtaCall = isBn ? 'কল করুন +880 1740-501062' : 'Call +880 1740-501062';
  const browseAll    = isBn ? 'সব পণ্য দেখুন' : 'Browse all pieces';

  // ── Per-language JSON-LD ─────────────────────────────────────────────────
  const jsonLd = isBn
    ? bnJsonLd(slug, title, ref, imageAbs, canonical, catLabel, catKey, product)
    : enJsonLd(slug, displayTitle, ref, imageAbs, canonical, catLabel, catKey, product);

  // ── Open Graph title ─────────────────────────────────────────────────────
  const ogTitle = isBn
    ? `${title} | eMarket247`
    : `${displayTitle} | eMarket247`;

  const ogDesc = isBn
    ? 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।'
    : 'Catalog record in preparation. Specifications, price, and availability are pending approval.';

  // ── SEO / nav text per language ───────────────────────────────────────────
  const skipLink     = isBn ? 'মূল কনটেন্টে যান' : 'Skip to main content';
  const altLangLabel = isBn ? 'Switch language to English' : 'বাংলায় পরিবর্তন করুন';
  const utilityText  = isBn
    ? 'সারা বাংলাদেশে ডেলিভারি · ১৫ দিনের রিফান্ড গ্যারান্টি · প্রতিটি অর্ডারে ফ্রি গিফট'
    : 'Pan-Bangladesh Delivery · 15-Day Refund Promise · Free Gift with Every Order';
  const waUtilityAria = isBn ? 'WhatsApp-এ চ্যাট করুন' : 'Chat with us on WhatsApp';
  const searchPlaceholder = isBn ? 'জুয়েলারি খুঁজুন' : 'Search jewellery';
  const brandAria    = 'eMarket247 Fashion & Jewellery';
  const accountAria  = isBn ? 'অ্যাকাউন্ট' : 'Account';
  const wishlistAria = isBn ? 'উইশলিস্ট' : 'Wishlist';
  const cartAria     = isBn ? 'কার্ট' : 'Cart';
  const menuAria     = isBn ? 'মেনু' : 'Menu';
  const navHome      = isBn ? 'হোম' : 'Home';
  const navShop      = isBn ? 'শপ' : 'Shop';
  const navCatLabel  = isBn ? 'ক্যাটাগরি' : 'Categories';
  const navCatFind   = isBn ? 'জুয়েলারি খুঁজুন' : 'Find your jewellery';
  const navCatView   = isBn ? 'সব ক্যাটাগরি' : 'View all categories';
  const navOccLabel  = isBn ? 'অনুষ্ঠান' : 'Occasion';
  const navOccFind   = isBn ? 'বিশেষ দিনের জন্য' : 'For meaningful moments';
  const navOccView   = isBn ? 'সব অনুষ্ঠান' : 'View all occasions';
  const navAbout     = isBn ? 'আমাদের কথা' : 'About Us';
  const navContact   = isBn ? 'যোগাযোগ' : 'Contact';
  const breadHome    = isBn ? 'হোম' : 'Home';
  const breadCat     = catLabel;
  const metaDesc     = isBn
    ? 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।'
    : 'Catalog record in preparation. Specifications, price, and availability are pending approval.';

  // ── Category nav links ────────────────────────────────────────────────────
  const catLinks = Object.entries(CATEGORIES).map(([key, labels]) =>
    `<li><a href="/${lang}/categories/${key}/">${labels[lang]}<small>${labels[isBn ? 'en' : 'bn']}</small></a></li>`
  ).join('');

  const occLinks = [
    ['puja', 'Puja', 'পূজা'],
    ['eid', 'Eid', 'ঈদ'],
    ['pahela-baishakh', 'Pahela Baishakh', 'পহেলা বৈশাখ'],
    ['wedding', 'Wedding', 'বিয়ে'],
    ['anniversary', 'Anniversary', 'বার্ষিকী'],
    ['birthday', 'Birthday', 'জন্মদিন'],
    ['gifts', 'Gifts', 'উপহার'],
  ].map(([key, en, bn]) =>
    `<li><a href="/${lang}/occasions/${key}/">${isBn ? bn : en}<small>${isBn ? en : bn}</small></a></li>`
  ).join('');

  const waUtilityUrl = makeCartWaUrl(phone, `\n\nProduct: ${displayTitle}\nRef: ${ref}`, lang);
  const waUtilityText = isBn
    ? 'হ্যালো, আমি eMarket247 জুয়েলারি সম্পর্কে জানতে চাই'
    : 'Hello, I would like to enquire about eMarket247 jewellery.';

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerBrand = isBn
    ? 'বাংলাদেশে ফ্যাশন ও আধুনিক জুয়েলারির একটি বিশ্বস্ত গন্তব্য। সঠিক তথ্য, দায়িত্বশীল সেবা ও সহজ আবিষ্কার।'
    : 'A trusted jewellery and fashion destination in Bangladesh. Grounded in accurate detail, thoughtful craft, and easy discovery.';
  const footerSupport = isBn ? 'ঢাকা, বাংলাদেশ · গ্রাহক সেবা: +880 1740-501062' : 'Dhaka, Bangladesh · Support: +880 1740-501062';
  const footerRights  = isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.';
  const footerCatHdr = isBn ? 'ক্যাটাগরি' : 'Categories';
  const footerOccHdr = isBn ? 'অনুষ্ঠান ও ভাবনা' : 'Occasions & Edits';
  const footerSuppHdr = isBn ? 'সহায়তা ও নীতি' : 'Customer Support';
  const footerCatAll = isBn ? 'সব ক্যাটাগরি' : 'View all categories';
  const footerOccAll = isBn ? 'সব অনুষ্ঠান' : 'View all occasions';

  const footerNewsletter = isBn
    ? { eyebrow: 'নোটস ফ্রম <strong class="brand-name">eMarket247</strong>', h2: 'নতুন কালেকশন, উপহারের আইডিয়া এবং বিবেচিত গহনার নোট।', p: 'আমাদের টিম থেকে নতুন কালেকশন, গাইড এবং আপডেট পেতে সাবস্ক্রাইব করুন।' }
    : { eyebrow: 'Notes from <strong class="brand-name">eMarket247</strong>', h2: 'New collections, gifting ideas, and considered jewellery notes.', p: 'Subscribe for new arrivals, style guides and updates from our team.' };

  const footerNewsInputPlaceholder = isBn ? 'আপনার ইমেইল ঠিকানা' : 'Your email address';
  const footerNewsConsent = isBn
    ? 'একটি আনুষ্ঠানিক সম্মতি ও গোপনীয়তা কর্মপ্রবাহ লাইভ হওয়ার আগে সংযুক্ত করা হবে।'
    : 'A formal consent and privacy workflow will be connected before newsletter collection goes live.';
  const footerDisclaimer = isBn
    ? 'একটি আধুনিক গহনার গন্তব্য যা মুহূর্তকে বহন করে।'
    : 'A modern destination for jewellery that carries the moment.';

  const socialFacebookUrl = 'https://web.facebook.com/Emarket247bd';
  const socialFacebookAria = 'eMarket247 on Facebook';
  const socialInstagramAria = isBn ? 'Instagram — শীঘ্রই আসছে' : 'Instagram — coming soon';
  const socialTiktokAria   = isBn ? 'TikTok — শীঘ্রই আসছে' : 'TikTok — coming soon';

  // ── Assemble ─────────────────────────────────────────────────────────────
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${altPage}">
  <link rel="alternate" hreflang="bn" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${altPage}">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(ogDesc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${esc(imageAbs)}">
  <link rel="icon" href="/assets/images/brand/emarket247-favicon-master.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/variables.css?v=${ASSET_V.variables}">
  <link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_V.siteCss}">
  <link rel="stylesheet" href="/assets/css/pdp.css?v=${ASSET_V.pdpCss}">
  <script type="application/ld+json">${jsonLd}</script>
  <title>${esc(ogTitle)}</title>
</head>
<body data-language="${lang}" data-cookie-mode="essential-only">
  <a class="skip-link" href="#main">${skipLink}</a>

  <header class="site-header">
    <div class="utility-row">
      <a href="/${altLang}/" class="lang-link" lang="${altLang}" aria-label="${esc(altLangLabel)}">
        ${WA_SVG_SMALL}
        <span class="lang-switch-wrap">
          <span class="lang-item ${!isBn ? 'is-active' : ''}">EN</span><span class="lang-sep">/</span><span class="lang-item ${isBn ? 'is-active' : ''}">বাংলা</span>
        </span>
      </a>
      <p class="utility-tagline">${utilityText}</p>
      <a class="utility-whatsapp" href="${waUtilityUrl}" target="_blank" rel="noopener" aria-label="${esc(waUtilityAria)}">
        ${WA_SVG_SMALL}
        <span>WhatsApp</span> <b>+880 1740-501062</b>
      </a>
    </div>
    <div class="main-header">
      <a class="brand" href="/${lang}/" aria-label="${esc(brandAria)}">
        <img src="/assets/images/brand/emarket247-logo-transparent.png" width="190" height="99" alt="${esc(brandAria)}">
      </a>
      <div class="search-bar-wrap">
        <label for="main-search" class="sr-only">${esc(searchPlaceholder)}</label>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="7"/><path d="m15.5 15.5 5 5"/></svg>
        <input type="search" id="main-search" class="main-search-input" placeholder="${esc(searchPlaceholder)}" autocomplete="off">
      </div>
      <div class="header-icons">
        <a href="/${lang}/account/" class="icon-link" aria-label="${esc(accountAria)}" title="${esc(accountAria)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg></a>
        <button type="button" class="icon-link" aria-label="${esc(wishlistAria)}" title="${esc(wishlistAria)}" data-wishlist-toggle><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg><i class="icon-badge">0</i></button>
        <a href="/${lang}/shop/" class="icon-link" aria-label="${esc(cartAria)}" title="${esc(cartAria)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8h11l-1 11a1.6 1.6 0 0 1-1.6 1.5H9.1A1.6 1.6 0 0 1 7.5 19L6.5 8Z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg><i class="icon-badge">0</i></a>
        <button class="menu-toggle icon-link" type="button" aria-expanded="false" aria-controls="main-menu" aria-label="${esc(menuAria)}" title="${esc(menuAria)}">
          <svg class="menu-icon-open" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          <svg class="menu-icon-close" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div class="nav-header">
      <nav id="main-menu" class="main-nav" aria-label="${isBn ? 'প্রধান নেভিগেশন' : 'Primary navigation'}">
        <a href="/${lang}/">${navHome}</a>
        <a href="/${lang}/shop/">${navShop}</a>
        <div class="has-submenu"><button type="button" aria-expanded="false">${navCatLabel}</button><div class="submenu"><p>${navCatFind}</p><ul>${catLinks}</ul><a class="menu-all" href="/${lang}/categories/">${navCatView} <span>→</span></a></div></div>
        <div class="has-submenu"><button type="button" aria-expanded="false">${navOccLabel}</button><div class="submenu"><p>${navOccFind}</p><ul>${occLinks}</ul><a class="menu-all" href="/${lang}/occasions/">${navOccView} <span>→</span></a></div></div>
        <a href="/${lang}/about/">${navAbout}</a>
        <a href="/${lang}/contact/">${navContact}</a>
      </nav>
    </div>
  </header>

  <nav class="breadcrumb wrap" aria-label="${isBn ? 'পথনির্দেশ' : 'Breadcrumb'}">
    <ol>
      <li><a href="/${lang}/">${breadHome}</a></li>
      <li><a href="/${lang}/categories/${catKey}/">${breadCat}</a></li>
      <li><span aria-current="page">${esc(displayTitle)}</span></li>
    </ol>
  </nav>

  <main id="main">
    <section class="pdp-hero wrap">
      <div class="pdp-gallery">
        <figure class="pdp-figure">
          <img src="${esc(image)}" srcset="${esc(image)}" sizes="(max-width: 900px) 100vw, 50vw" width="1200" height="1200" fetchpriority="high" alt="${esc(displayTitle)} — eMarket247 product photograph.">
        </figure>
      </div>
      <div class="pdp-info">
        <p class="pdp-kicker">${esc(catLabel)}</p>
        <h1 class="pdp-title">${esc(displayTitle)}</h1>
        <p class="pdp-ref">${isBn ? 'রেফারেন্স' : 'Reference'} <span>${esc(ref)}</span></p>
        <p class="pdp-short-desc">${esc(ed.lead)}</p>
        <div class="pdp-price-section" data-product-price-container>
          <div class="pdp-price-row">
            <span class="pdp-price-val" id="pdp-price-display">${priceDisplay}</span>
          </div>
          <p class="pdp-price-hint">${priceHint}</p>
        </div>
        <div class="pdp-actions">
          <div class="pdp-actions-row">
            <div class="pdp-qty-stepper-wrap">
              <span class="pdp-qty-title">${qtyLabel}</span>
              <div class="pdp-qty-stepper">
                <button type="button" data-pdp-qty-change="-1" aria-label="${esc(qtyDown)}">−</button>
                <span id="pdp-qty-display">1</span>
                <button type="button" data-pdp-qty-change="1" aria-label="${esc(qtyUp)}">+</button>
              </div>
            </div>
            <button class="pdp-btn-add-bag-primary" id="pdp-add-bag" type="button" data-pdp-add-bag="${esc(ref)}" data-title="${esc(displayTitle)}" data-slug="${esc(slug)}" data-img="${esc(image)}" data-cat="${esc(catLabel)}">
              <span class="pdp-bag-text pdp-add-bag-label">${addBagLabel}</span>
            </button>
          </div>
          <a class="pdp-btn-whatsapp-action" id="pdp-whatsapp-cta" href="${waUrl}" target="_blank" rel="noopener noreferrer">
            ${WA_SVG_BIG}
            <span>${waCtaLabel}</span>
          </a>
          <div class="pdp-action-links">
            <a href="#pdp-specs">${sizeLink}</a>
            <a href="tel:+8801740501062">${careLink}</a>
            <button type="button" class="pdp-share-link" data-share-url="${canonical}" data-share-title="${esc(ogTitle)}">${shareLabel}</button>
          </div>
        </div>
        <dl class="pdp-assurance">
          <div>
            <dt>${deliveryDt}</dt>
            <dd>${deliveryDd}</dd>
          </div>
          <div>
            <dt>${inspectDt}</dt>
            <dd>${inspectDd}</dd>
          </div>
          <div>
            <dt>${careDt}</dt>
            <dd><a href="tel:+8801740501062">${careDd}</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="pdp-why-love wrap">
      <div class="pdp-section-head">
        <h2>${sectionBTitle}</h2>
      </div>
      <div class="pdp-benefit-grid">
        <article class="pdp-benefit-card">
          <h3>${esc(benefit1h)}</h3>
          <p>${esc(ed.benefit)}</p>
        </article>
        <article class="pdp-benefit-card">
          <h3>${benefit2h}</h3>
          <p>${benefit2p}</p>
        </article>
        <article class="pdp-benefit-card">
          <h3>${benefit3h}</h3>
          <p>${benefit3p}</p>
        </article>
      </div>
    </section>

    <section class="pdp-accordion-section wrap">
      <details class="pdp-accordion" id="pdp-details">
        <summary>${accordion1}</summary>
        <div class="pdp-accordion-content">${faqContent}</div>
      </details>
      <details class="pdp-accordion" id="pdp-care">
        <summary>${accordion2}</summary>
        <div class="pdp-accordion-content">${careContent}</div>
      </details>
      <details class="pdp-accordion" id="pdp-shipping">
        <summary>${accordion3}</summary>
        <div class="pdp-accordion-content">${shippingContent}</div>
      </details>
      <details class="pdp-accordion" id="pdp-faq">
        <summary>${accordion4}</summary>
        <div class="pdp-accordion-content">${faqContent}</div>
      </details>
    </section>

    <section class="pdp-related wrap">
      <div class="pdp-section-head">
        <h2>${relatedTitle}</h2>
      </div>
      <div class="product-grid">
        ${relatedHtml}
      </div>
    </section>

    <section class="pdp-final-cta wrap">
      <div class="pdp-final-card">
        <div class="pdp-final-copy">
          <h2>${finalCtaH2}</h2>
          <p>${finalCtaP}</p>
        </div>
        <div class="pdp-final-actions">
          <a class="button button-dark" href="${waUrl}" target="_blank" rel="noopener noreferrer">
            ${finalCtaWa}
          </a>
          <a class="button button-outline" href="tel:+8801740501062">
            ${finalCtaCall}
          </a>
          <a class="text-link" href="/${lang}/shop/">
            ${browseAll}
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <section class="newsletter">
      <div>
        <p class="eyebrow">${footerNewsletter.eyebrow}</p>
        <h2>${footerNewsletter.h2}</h2>
      </div>
      <form data-newsletter>
        <label class="sr-only" for="email">Email</label>
        <input id="email" type="email" placeholder="${footerNewsInputPlaceholder}" required>
        <button type="submit" aria-label="Submit">↗</button>
        <p>${footerNewsConsent}</p>
      </form>
    </section>
    <div class="footer-main">
      <div class="footer-brand">
        <img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery">
        <p>${footerDisclaimer}</p>
        <div class="footer-social">
          <a href="${socialFacebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="${socialFacebookAria}" class="social-link social-facebook">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" aria-hidden="true" focusable="false"><path d="M24 12a12 12 0 1 0-13.86 11.87V15.47h-2.72v-3.35h2.72v-2.55c0-2.7 1.6-4.2 4.06-4.2 1.18 0 2.42.21 2.42.21v2.66h-1.36c-1.34 0-1.76.83-1.76 1.69v2.03h3l-.5 3.35h-2.53V24A12 12 0 0 0 24 12Z"/></svg>
          </a>
          <span class="social-placeholder" title="${socialInstagramAria}" aria-label="${socialInstagramAria}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#665f5a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="0.8" fill="#665f5a" stroke="none"/></svg>
          </span>
          <span class="social-placeholder" title="${socialTiktokAria}" aria-label="${socialTiktokAria}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#665f5a" aria-hidden="true" focusable="false"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.53V7.08a4.86 4.86 0 0 1-1-.39Z"/></svg>
          </span>
          <span class="social-placeholder" title="${isBn ? 'WhatsApp — শীঘ্রই আসছে' : 'WhatsApp — coming soon'}" aria-label="${isBn ? 'WhatsApp — শীঘ্রই আসছে' : 'WhatsApp — coming soon'}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#665f5a" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z"/></svg>
          </span>
        </div>
      </div>
      <div>
        <h3>${footerCatHdr}</h3>
        ${Object.entries(CATEGORIES).map(([key, labels]) =>
          `<a href="/${lang}/categories/${key}/">${labels[lang]}</a>`
        ).join('\n        ')}
        <a href="/${lang}/categories/">${footerCatAll}</a>
      </div>
      <div>
        <h3>${footerOccHdr}</h3>
        <a href="/${lang}/occasions/puja/">${isBn ? 'পূজা কালেকশন' : 'Puja Edit'}</a>
        <a href="/${lang}/occasions/wedding/">${isBn ? 'বিয়ের জুয়েলারি' : 'Wedding Jewellery'}</a>
        <a href="/${lang}/occasions/gifts/">${isBn ? 'উপহার জুয়েলারি' : 'Jewellery Gifting'}</a>
        <a href="/${lang}/guides/">${isBn ? 'স্টাইল গাইড' : 'Style Guides'}</a>
      </div>
      <div>
        <h3>${footerSuppHdr}</h3>
        <a href="/${lang}/care/">${isBn ? 'যত্ন ও সহায়তা' : 'Care & Support'}</a>
        <a href="/${lang}/contact/">${isBn ? 'যোগাযোগ' : 'Contact Us'}</a>
        <a href="/${lang}/about/">${isBn ? 'আমাদের গল্প' : 'About eMarket247'}</a>
        <a href="/${lang}/privacy/">${isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</a>
        <a href="/${lang}/terms/">${isBn ? 'শর্তাবলি' : 'Terms of Service'}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 eMarket247. ${footerRights}</span>
      <span>${footerSupport}</span>
    </div>
  </footer>

  <div class="toast" role="status" aria-live="polite"></div>
  <script src="/assets/js/site.js?v=${ASSET_V.siteJs}" defer></script>
</body>
</html>
`;
}

// ── Seed SQL parser ──────────────────────────────────────────────────────────

function parseSeed(sql) {
  const products = [];

  // Find all VALUES blocks (the SQL may have multiple INSERT statements)
  const valBlocks = [...sql.matchAll(/VALUES\s*([\s\S]*?);/g)].map(m => m[1]);
  if (!valBlocks.length) return products;

  // Strip the leading ( from the first block and trailing ) from each
  const rows = [];
  for (const block of valBlocks) {
    let cleaned = block.trim();
    // Remove leading '(' from first row and trailing ')' from last row
    const parts = cleaned.split(/\)\s*,\s*\(/);
    for (let i = 0; i < parts.length; i++) {
      let p = parts[i];
      if (i === 0)            p = p.replace(/^\s*\(/, '');
      if (i === parts.length-1) p = p.replace(/\)\s*$/, '');
      rows.push(p);
    }
  }

  // Parse each row using a proper character-by-character tokenizer
  for (const raw of rows) {
    if (!raw.trim()) continue;

    const vals = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      // Handle escaped quotes inside strings
      if (ch === "'" && raw[i-1] !== '\\') {
        inQuote = !inQuote;
        current += ch;
      } else if (ch === ',' && !inQuote) {
        vals.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    vals.push(current.trim()); // last value

    if (vals.length < 13) continue;

    const unquote = v => {
      if (!v || v === 'NULL') return null;
      return v.replace(/^'|'$/g, '').replace(/\\'/g, "'");
    };

    const slug = unquote(vals[1]);
    if (!slug) continue;

    const catKey   = detectCatFromSlug(slug);
    const priceRaw = unquote(vals[5]);

    products.push({
      sku:       unquote(vals[0])  || '',
      slug,
      title_en:  unquote(vals[2])  || '',
      title_bn:  unquote(vals[3])  || '',
      category:  unquote(vals[4])  || 'Rings',
      catKey:    catKey || 'rings',
      price:     priceRaw !== null && priceRaw !== '' ? parseFloat(priceRaw) : null,
      image_url:  unquote(vals[12]) || '/assets/images/brand/emarket247-logo-transparent.png',
    });
  }

  return products;
}

// ── Related products ─────────────────────────────────────────────────────────

function getRelated(products, currentSlug, catKey, limit = 4) {
  return products
    .filter(p => p.slug !== currentSlug && p.catKey === catKey)
    .slice(0, limit);
}

// ── Write one language variant ────────────────────────────────────────────────

function writePdp(product, lang, allProducts, dryRun = false) {
  const related = getRelated(allProducts, product.slug, product.catKey);
  const html = buildPdp(product, lang, related);
  const dir = join(ROOT, lang, 'products', product.slug);
  const file = join(dir, 'index.html');

  if (dryRun) {
    console.log(`  [DRY] would write ${lang}/products/${product.slug}/index.html`);
    return;
  }

  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(file, html, 'utf8');
    console.log(`  ✓ ${lang}/products/${product.slug}/`);
  } catch (err) {
    console.error(`  ✗ ${lang}/products/${product.slug}/ — ${err.message}`);
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const mode = args[0] || '--seed';
const dryRun = args.includes('--dry-run');

console.log('\npublish-pdp-pages.mjs — reviewed static PDP publisher');
console.log('Mode:', mode, dryRun ? '(DRY RUN)' : '');
console.log('');

if (mode === '--db') {
  console.error('Live DB mode not yet implemented.');
  console.error('Set HOSTINGER_DB_HOST, HOSTINGER_DB_USER, HOSTINGER_DB_PASS, HOSTINGER_DB_NAME');
  console.error('and implement the connection in this script, or use --seed for local preview.');
  process.exit(1);
}

if (!existsSync(SEED_SQL)) {
  console.error(`Seed file not found: ${SEED_SQL}`);
  process.exit(1);
}

const sql = readFileSync(SEED_SQL, 'utf8');
const products = parseSeed(sql);

console.log(`Parsed ${products.length} products from seed.`);

if (products.length === 0) {
  console.error('No products parsed from seed. Check the SQL format.');
  process.exit(1);
}

let written = 0;
for (const p of products) {
  writePdp(p, 'en', products, dryRun);
  writePdp(p, 'bn', products, dryRun);
  written += 2;
}

const writtenLabel = written > 0 ? 'written' : '— no changes';
console.log(dryRun ? 'Dry run complete.' : `Done. ${written} PDP files ${writtenLabel}.`);
if (!dryRun && written === 0) process.exit(1);
