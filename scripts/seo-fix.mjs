import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

const OG_IMAGE = 'https://emarket247.shop/assets/images/editorial/emarket247-hero-vermilion-atelier.webp';

const PAGE_META = {
  'account': {
    en: { title: 'My Account | eMarket247', desc: 'Manage your eMarket247 account, saved wishlist items, and order preferences.', ogTitle: 'My Account | eMarket247' },
    bn: { title: 'আমার অ্যাকাউন্ট | eMarket247', desc: 'আপনার eMarket247 অ্যাকাউন্ট পরিচালনা করুন, উইশলিস্ট সংরক্ষণ করুন এবং অর্ডার সম্পর্কে জানুন।', ogTitle: 'আমার অ্যাকাউন্ট | eMarket247' },
  },
  'cart': {
    en: { title: 'Your Bag | eMarket247', desc: 'Review your selected eMarket247 jewellery pieces and place your order via WhatsApp. Pan-Bangladesh delivery with 15-day refund promise.', ogTitle: 'Your Bag | eMarket247' },
    bn: { title: 'আপনার ব্যাগ | eMarket247', desc: 'আপনার বাছাই করা eMarket247 অলংকার পর্যালোচনা করুন এবং WhatsApp-এ অর্ডার করুন। সারা বাংলাদেশে ডেলিভারি ও ১৫ দিনের রিফান্ড গ্যারান্টি।', ogTitle: 'আপনার ব্যাগ | eMarket247' },
  },
  'delivery': {
    en: { title: 'Delivery | eMarket247', desc: 'Pan-Bangladesh delivery. eMarket247 ships jewellery across all 64 districts with tracking and careful packaging.', ogTitle: 'Delivery | eMarket247' },
    bn: { title: 'ডেলিভারি | eMarket247', desc: 'সারা বাংলাদেশে ডেলিভারি। eMarket247 ৬৪ জেলায় গহনা পাঠায় ট্র্যাকিং ও সতর্ক প্যাকেজিংয়ের সাথে।', ogTitle: 'ডেলিভারি | eMarket247' },
  },
  'refund': {
    en: { title: 'Refund | eMarket247', desc: '15-day refund promise on all eMarket247 jewellery. Terms, conditions, and the return process explained clearly.', ogTitle: 'Refund | eMarket247' },
    bn: { title: 'রিফান্ড | eMarket247', desc: 'সব eMarket247 অলংকারে ১৫ দিনের রিফান্ড প্রতিশ্রুতি। শর্তাবলী ও রিটার্ন প্রক্রিয়া সহজ ভাষায় ব্যাখ্যা করা হয়েছে।', ogTitle: 'রিফান্ড | eMarket247' },
  },
};

const MISSING_PAGES = [
  { lang: 'en', page: 'account',  rel: 'en/account/index.html' },
  { lang: 'en', page: 'cart',     rel: 'en/cart/index.html' },
  { lang: 'en', page: 'delivery', rel: 'en/delivery/index.html' },
  { lang: 'en', page: 'refund',   rel: 'en/refund/index.html' },
  { lang: 'bn', page: 'account',  rel: 'bn/account/index.html' },
  { lang: 'bn', page: 'cart',     rel: 'bn/cart/index.html' },
  { lang: 'bn', page: 'delivery', rel: 'bn/delivery/index.html' },
  { lang: 'bn', page: 'refund',   rel: 'bn/refund/index.html' },
];

function getCanonical(lang, page) {
  return `https://emarket247.shop/${lang}/${page}/`;
}

function getOtherLangCanonical(lang, page) {
  return `https://emarket247.shop/${lang === 'en' ? 'bn' : 'en'}/${page}/`;
}

function buildSeoBlock(lang, pageName) {
  const meta = PAGE_META[pageName][lang];
  const lang2 = lang === 'en' ? 'bn' : 'en';
  const myCanonical = getCanonical(lang, pageName);
  const otherCanonical = getOtherLangCanonical(lang, pageName);
  const ogType = 'website';

  return `  <meta name="robots" content="index,follow">
  <link rel="alternate" hreflang="${lang}" href="${myCanonical}">
  <link rel="alternate" hreflang="${lang2}" href="${otherCanonical}">
  <link rel="alternate" hreflang="x-default" href="https://emarket247.shop/">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${meta.ogTitle}">
  <meta property="og:description" content="${meta.desc}">
  <meta property="og:url" content="${myCanonical}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.ogTitle}">
  <meta name="twitter:description" content="${meta.desc}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <script type="application/ld+json" data-emk="ld">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "${myCanonical}#webpage",
  "url": "${myCanonical}",
  "name": "${meta.ogTitle}",
  "description": "${meta.desc}",
  "isPartOf": { "@id": "https://emarket247.shop/#website" },
  "inLanguage": "${lang}",
  "potentialAction": {
    "@type": "ReadAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "${myCanonical}" }
  }
}
  </script>`;
}

function processPage(filePath, lang, pageName) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Check if already has og:title
  if (/<meta[^>]+property=["']og:title["']/i.test(html)) {
    return { status: 'already-ok' };
  }

  const seoBlock = buildSeoBlock(lang, pageName);

  // Insert after the existing canonical link
  const canonicalRe = /(<link rel="canonical"[^>]+>)\n?/;
  if (canonicalRe.test(html)) {
    html = html.replace(canonicalRe, `$1\n${seoBlock}\n`);
  } else {
    // Insert after description meta tag
    const descRe = /(<meta name="description"[^>]+>)\n?/;
    if (descRe.test(html)) {
      html = html.replace(descRe, `$1\n${seoBlock}\n`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return { status: 'fixed' };
}

const results = [];
for (const { lang, page, rel } of MISSING_PAGES) {
  const filePath = path.join(pub, rel);
  if (!fs.existsSync(filePath)) {
    results.push({ rel, status: 'file-missing' });
    continue;
  }
  const result = processPage(filePath, lang, page);
  results.push({ rel, ...result });
}

const fixed = results.filter(r => r.status === 'fixed');
const alreadyOk = results.filter(r => r.status === 'already-ok');
const missing = results.filter(r => r.status === 'file-missing');

console.log(`Fixed: ${fixed.length}`);
fixed.forEach(r => console.log('  FIXED:', r.rel));
console.log(`Already OK: ${alreadyOk.length}`);
console.log(`File missing: ${missing.length}`);
missing.forEach(r => console.log('  MISSING:', r.rel));
if (fixed.length > 0) console.log('\n✅ SEO meta added to', fixed.length, 'pages');
