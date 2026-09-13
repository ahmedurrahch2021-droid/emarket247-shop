// fix-category-pages.mjs — WS-C3
// Changes per category page (EN + BN):
//  EN: H1 keywording, hero description, price-band toolbar, mobile-nav restructure
//  BN: H1 keywording, hero description (BN), price-band toolbar (BN)
// Mobile nav: adds .mobile-nav-bar with icons + hamburger; adds .menu-hamburger wrapper

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'public_html');

// ─── Category data ────────────────────────────────────────────────────────────
const CATEGORIES = {
  bangles: {
    en: {
      h1: 'Gold-Tone Bangles in Bangladesh',
      hero: "From everyday stackable designs to statement pieces for Puja and Eid — eMarket247's bangles collection spans ₹800–3,500 (final price on WhatsApp). Family-owned, direct from Yakubpur, Thakurgaon.",
      band: '৳ 800–3,500',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'সোনালি চুড়ি — বাংলাদেশে সেরা পছন্দ',
      hero: 'পূজা, ঈদ, জন্মদিন বা প্রতিদিনের স্টাইল — ইমার্কেট২৪৭-এর চুড়ির কালেকশন ৳৮০০–৩,৫০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন)। ঠাকুরগাঁও থেকে সরাসরি পরিবারের ব্যবসা।',
      band: '৳ ৮০০–৩,৫০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  necklaces: {
    en: {
      h1: 'Necklaces & Chains in Bangladesh',
      hero: 'Layered chains, bridal sets, and everyday pendants — priced at ৳900–6,000 (final price on WhatsApp). Family-sourced, direct to your door across Bangladesh.',
      band: '৳ 900–6,000',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'হার ও চেইন — বাংলাদেশে সেরা জুয়েলারি',
      hero: 'লেয়ার্ড চেইন, ব্রাইডাল সেট বা প্রতিদিনের পেন্ডেন্ট — ৳৯০০–৬,০০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। সারা বাংলাদেশে ডেলিভারি, ঠাকুরগাঁও থেকে সরাসরি।',
      band: '৳ ৯০০–৬,০০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  earrings: {
    en: {
      h1: 'Earrings in Bangladesh — Studs, Drops & Jhumkas',
      hero: 'Studs, drop earrings, and traditional jhumkas — from ৳350 (final price on WhatsApp). Light enough for daily wear, striking enough for Puja and Eid.',
      band: '৳ 350–2,500',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'কানের দুল — পূজা, ঈদ ও প্রতিদিনের স্টাইল',
      hero: 'স্টাড, ড্রপ বা ঝুমকা — ৳৩৫০ থেকে শুরু (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। প্রতিদিনের জন্য হালকা, পূজা-ঈদের জন্য আকর্ষণীয়।',
      band: '৳ ৩৫০–২,৫০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  bracelets: {
    en: {
      h1: 'Bracelets & Kadas in Bangladesh',
      hero: 'Delicate chains and bold kadas — ৳500–2,500 (final price on WhatsApp). Choose for a birthday, anniversary, or just because you love them.',
      band: '৳ 500–2,500',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'ব্রেসলেট ও কড়া — বাংলাদেশে সেরা স্টাইল',
      hero: 'ডেলিকেট চেইন বা বড় কড়া — ৳৫০০–২,৫০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। জন্মদিন, বার্ষিকী বা শুধু নিজের জন্য পছন্দ করুন।',
      band: '৳ ৫০০–২,৫০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  rings: {
    en: {
      h1: 'Rings in Bangladesh — Fashion & Daily Wear',
      hero: 'Simple bands to statement cocktail rings — ৳300–2,500 (final price on WhatsApp). No middlemen, direct from our family collection in Thakurgaon.',
      band: '৳ 300–2,500',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'আংটি — বাংলাদেশে ফ্যাশন ও প্রতিদিনের স্টাইল',
      hero: 'সিম্পল ব্যান্ড থেকে স্টেটমেন্ট ককটেল রিং — ৳৩০০–২,৫০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। ঠাকুরগাঁও থেকে সরাসরি পরিবারের কালেকশন।',
      band: '৳ ৩০০–২,৫০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  pendants: {
    en: {
      h1: 'Pendants & Lockets in Bangladesh',
      hero: 'Everyday lockets and ceremonial pendants — ৳400–3,000 (final price on WhatsApp). Each piece chosen with care by founder Rozina Akter.',
      band: '৳ 400–3,000',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'লকেট ও পেন্ডেন্ট — বাংলাদেশে সেরা পছন্দ',
      hero: 'প্রতিদিনের লকেট ও অনুষ্ঠানিক পেন্ডেন্ট — ৳৪০০–৩,০০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। প্রতিটি পণ্য ভালোবাসার সাথে বেছে নিয়েছেন প্রতিষ্ঠাতা রোজিনা আক্তার।',
      band: '৳ ৪০০–৩,০০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  'jewellery-sets': {
    en: {
      h1: 'Jewellery Sets in Bangladesh — Coordinated Pieces',
      hero: 'Matching earrings, necklace, and bracelet sets — ৳1,200–8,000 (final price on WhatsApp). Perfect for gifting or treating yourself.',
      band: '৳ 1,200–8,000',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'জুয়েলারি সেট — বাংলাদেশে সম্পূর্ণ পোশাকের জুয়েলারি',
      hero: 'মিলিত দুল, হার ও ব্রেসলেট সেট — ৳১,২০০–৮,০০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। উপহার বা নিজের জন্য পছন্দ করুন।',
      band: '৳ ১,২০০–৮,০০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  'bridal-jewellery': {
    en: {
      h1: 'Bridal Jewellery in Bangladesh — Wedding Collections',
      hero: 'Complete bridal sets and ceremony pieces — ৳2,000–15,000 (final price on WhatsApp). Chosen by families who care about quality and meaning.',
      band: '৳ 2,000–15,000',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'ব্রাইডাল জুয়েলারি — বিয়ের সেলিব্রেশনের জন্য সেরা জুয়েলারি',
      hero: 'সম্পূর্ণ ব্রাইডাল সেট ও অনুষ্ঠানিক পণ্য — ৳২,০০০–১৫,০০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। মান ও অর্থের দিকে লক্ষ্য রেখে পরিবার বেছে নেয়।',
      band: '৳ ২,০০০–১৫,০০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
  'gift-jewellery': {
    en: {
      h1: 'Jewellery Gifts in Bangladesh — For Every Occasion',
      hero: 'Birthday, anniversary, Eid, and Puja gifts — ৳300–5,000 (final price on WhatsApp). Every order comes with a free gift. Direct from Thakurgaon.',
      band: '৳ 300–5,000',
      bandNote: 'Final price confirmed on WhatsApp',
    },
    bn: {
      h1: 'উপহারের জুয়েলারি — প্রতিটি অনুষ্ঠানের জন্য সেরা পছন্দ',
      hero: 'জন্মদিন, বার্ষিকী, ঈদ ও পূজার উপহার — ৳৩০০–৫,০০০ (হোয়াটসঅ্যাপে চূড়ান্ত দাম)। প্রতিটি অর্ডারে ফ্রি গিফট। ঠাকুরগাঁও থেকে সরাসরি।',
      band: '৳ ৩০০–৫,০০০',
      bandNote: 'হোয়াটসঅ্যাপে চূড়ান্ত দাম জানুন',
    },
  },
};

// ─── Process one language ──────────────────────────────────────────────────────
function processLang(lang, dirs) {
  let changed = 0;
  for (const cat of dirs) {
    if (!CATEGORIES[cat]) {
      console.warn(`  [${lang}] No data for category "${cat}" — skipping`);
      continue;
    }
    const filePath = join(ROOT, lang, 'categories', cat, 'index.html');
    let html = readFileSync(filePath, 'utf8');

    const data = CATEGORIES[cat][lang];
    let modified = false;

    // 1. H1 + hero paragraph
    if (lang === 'en') {
      const oldHero = html.match(/<section class="page-hero wrap">[\s\S]*?<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>[\s\S]*?<\/section>/);
      if (oldHero) {
        const newHero = `<section class="page-hero wrap"><div><p class="eyebrow">Jewellery category</p><h1>${data.h1}</h1><p>${data.hero}</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="eMarket247 jewellery editorial image"><figcaption>Browse our ${cat.replace(/-/g, ' ')} collection</figcaption></figure></section>`;
        html = html.replace(oldHero[0], newHero);
        modified = true;
      }
    } else {
      // BN
      const oldHero = html.match(/<section class="page-hero wrap">[\s\S]*?<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>[\s\S]*?<\/section>/);
      if (oldHero) {
        const catBn = cat === 'bridal-jewellery' ? 'ব্রাইডাল জুয়েলারি' :
          cat === 'jewellery-sets' ? 'জুয়েলারি সেট' :
          cat === 'gift-jewellery' ? 'উপহারের জুয়েলারি' : cat;
        const newHero = `<section class="page-hero wrap"><div><p class="eyebrow">জুয়েলারি ক্যাটাগরি</p><h1>${data.h1}</h1><p>${data.hero}</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="eMarket247 জুয়েলারি এডিটোরিয়াল ছবি"><figcaption>আমাদের ${catBn} কালেকশন দেখুন</figcaption></figure></section>`;
        html = html.replace(oldHero[0], newHero);
        modified = true;
      }
    }

    // 2. Catalog toolbar: price band callout
    if (lang === 'en') {
      const oldToolbar = `<div class="catalog-toolbar"><div><p class="eyebrow">Catalog status</p><h2>Product detail is being prepared responsibly.</h2></div><button type="button" class="filter-stub" data-toast="Filters will be connected to approved catalog records.">☷ Filters</button></div>`;
      const newToolbar = `<div class="catalog-toolbar"><div><p class="eyebrow">Price range for this category</p><p class="catalog-price-band">${data.band}</p><p class="catalog-price-note">${data.bandNote} · <a href="https://wa.me/8801740501062?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20${encodeURIComponent(cat.replace(/-/g, ' '))}%20on%20emarket247.shop." target="_blank" rel="noopener">Ask on WhatsApp ↗</a></p></div><button type="button" class="filter-stub" data-toast="Filters will be connected to approved catalog records.">☷ Filters</button></div>`;
      if (html.includes(oldToolbar)) {
        html = html.replace(oldToolbar, newToolbar);
        modified = true;
      }
    } else {
      // BN toolbar
      const oldToolbar = `<div class="catalog-toolbar"><div><p class="eyebrow">ক্যাটালগ স্ট্যাটাস</p><h2>সঠিক পণ্যের তথ্য প্রস্তুত হচ্ছে।</h2></div><button type="button" class="filter-stub" data-toast="ফিল্টার অনুমোদিত ক্যাটালগের সাথে যুক্ত হবে।">☷ ফিল্টার</button></div>`;
      const newToolbar = `<div class="catalog-toolbar"><div><p class="eyebrow">এই ক্যাটাগরির মূল্য সীমা</p><p class="catalog-price-band">${data.band}</p><p class="catalog-price-note">${data.bandNote} · <a href="https://wa.me/8801740501062?text=%E0%A6%B8%E0%A6%8C%E0%A6%82%E0%A6%B0%E0%A7%87%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20${encodeURIComponent(cat.replace(/-/g, ' '))}%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A6%81%E0%A6%9A%E0%A6%A8%E0%A7%8D%E0%A6%AF%E0%A6%82%20%E0%A6%9B%E0%A6%BE%E0%A6%81%E0%A6%8F%E0%A6%82%20%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A6%BE%E0%A6%AC%E0%A6%BF%20%E0%A6%A6%E0%A6%BE%E0%A6%AE%20%E0%A6%9A%E0%A7%87%E0%A6%81%E0%A5%A4" target="_blank" rel="noopener">হোয়াটসঅ্যাপে জানুন ↗</a></p></div><button type="button" class="filter-stub" data-toast="ফিল্টার অনুমোদিত ক্যাটালগের সাথে যুক্ত হবে।">☷ ফিল্টার</button></div>`;
      if (html.includes(oldToolbar)) {
        html = html.replace(oldToolbar, newToolbar);
        modified = true;
      }
    }

    // 3. EN only: restructure mobile nav (whitespace-agnostic regex)
    if (lang === 'en') {
      // EN: Replace entire <div class="nav-header"> block (hamburger + nav) to avoid duplicates.
      // Capture: nav-header open, hamburger, nav element, AND the closing </div> separately.
      const fullNavPattern = /(<div class="nav-header">)\s*(<button class="menu-toggle"[^>]*><span><\/span><span><\/span><span><\/span><b>Menu<\/b><\/button>)(\s*<nav id="main-menu"[\s\S]*?<\/nav>)\s*(<\/div>)/;
      if (fullNavPattern.test(html)) {
        html = html.replace(fullNavPattern, (_match, navOpen, _hamburger, navRest, navClose) => {
          return navOpen + `
    <div class="mobile-nav-bar">
      <div class="header-icons mobile-header-icons">
        <a href="/en/account/" class="icon-link" aria-label="Account" title="Account"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg></a>
        <button type="button" class="icon-link" aria-label="Wishlist" title="Wishlist" data-wishlist-toggle><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg><i class="icon-badge">0</i></button>
        <a href="/en/shop/" class="icon-link" aria-label="Cart" title="Cart"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8h11l-1 11a1.6 1.6 0 0 1-1.6 1.5H9.1A1.6 1.6 0 0 1 7.5 19L6.5 8Z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg><i class="icon-badge">0</i></a>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-hamburger"><span></span><span></span><span></span></span><b>Menu</b></button>
    </div>` + navRest + `
  ` + navClose;
        });
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(filePath, html, 'utf8');
      changed++;
      console.log(`  [${lang}] ✓ ${cat}`);
    } else {
      console.log(`  [${lang}] — ${cat} (no change needed)`);
    }
  }
  return changed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const enDirs = readdirSync(join(ROOT, 'en', 'categories')).filter(f => f !== 'index.html');
const bnDirs = readdirSync(join(ROOT, 'bn', 'categories')).filter(f => f !== 'index.html');

console.log('\nWS-C3: Category pages — EN + BN');
console.log('═'.repeat(50));

console.log('\nProcessing EN category pages...');
const enChanged = processLang('en', enDirs);

console.log('\nProcessing BN category pages...');
const bnChanged = processLang('bn', bnDirs);

console.log(`\nDone — EN: ${enChanged}/${enDirs.length} changed · BN: ${bnChanged}/${bnDirs.length} changed`);
