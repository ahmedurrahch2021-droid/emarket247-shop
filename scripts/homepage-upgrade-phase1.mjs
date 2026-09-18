import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const enPath = path.join(root, 'public_html', 'en', 'index.html');
const bnPath = path.join(root, 'public_html', 'bn', 'index.html');

let en = fs.readFileSync(enPath, 'utf8');
let bn = fs.readFileSync(bnPath, 'utf8');

console.log('--- Upgrading BN Homepage (public_html/bn/index.html) ---');

// 1. BN Head tags: Title, Description, OG tags, Schema
bn = bn.replace(
  '<title>eMarket247 | ফ্যাশন ও জুয়েলারি বাংলাদেশ</title>',
  '<title>eMarket247 | বাংলাদেশে City Gold জুয়েলারি শপ</title>'
);

bn = bn.replace(
  '<meta name="description" content="বাংলাদেশে City Gold জুয়েলারি কিনুন—কানের দুল, চুড়ি, হার ও সেট। দেখুন পণ্যের বিস্তারিত তথ্য এবং হোয়াটসঅ্যাপে সহজে অর্ডার করুন।">',
  '<meta name="description" content="বাংলাদেশে বিয়ে, ঈদ, পূজা ও প্রতিদিনের সাজের জন্য City Gold গহনা খুঁজুন। কানের দুল, চুড়ি, নেকলেস, আংটি ও ব্রাইডাল সেট কিনুন পরিষ্কার পণ্যের বিবরণসহ।">'
);

bn = bn.replace(
  '<meta property="og:title" content="eMarket247 | ফ্যাশন ও জুয়েলারি বাংলাদেশ">',
  '<meta property="og:title" content="eMarket247 | বাংলাদেশে City Gold জুয়েলারি শপ">'
);

bn = bn.replace(
  '<meta property="og:description" content="eMarket247-এর বিবেচনাপূর্ণ জুয়েলারি এডিট, বাংলা ও ইংরেজি ক্যাটাগরি পেজ, পণ্যের তথ্যমান এবং পূজার মৌসুমি আবিষ্কার।">',
  '<meta property="og:description" content="বাংলাদেশে বিয়ে, ঈদ, পূজা ও প্রতিদিনের সাজের জন্য City Gold গহনা খুঁজুন। কানের দুল, চুড়ি, নেকলেস, আংটি ও ব্রাইডাল সেট কিনুন পরিষ্কার পণ্যের বিবরণসহ।">'
);

bn = bn.replace(
  '"name":"eMarket247 | ফ্যাশন ও জুয়েলারি বাংলাদেশ"',
  '"name":"eMarket247 | বাংলাদেশে City Gold জুয়েলারি শপ"'
);

// 2. BN Hero Slides
const bnOldHeroSlides = `<article class="slide is-active" data-slide aria-hidden="false"><img src="/assets/images/editorial/emarket247-hero-vermilion-atelier.webp" width="2560" height="1440" alt="eMarket247 জুয়েলারি এডিটোরিয়াল ইমেজ" fetchpriority="high"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> ফ্যাশন ও জুয়েলারি</p><h1>আপনার পছন্দের অলংকার খুঁজুন।</h1><p>সবদিনের সাজ কিংবা বিশেষ উপহার—প্রতিটি মুহূর্তের জন্য আমাদের সুচিন্তিত জুয়েলারি কালেকশন।</p><a class="button button-dark" href="/bn/shop/">কালেকশন দেখুন <span>→</span></a></div></article><article class="slide " data-slide aria-hidden="true"><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="eMarket247 জুয়েলারি এডিটোরিয়াল ইমেজ" loading="lazy"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow">বিশেষ মুহূর্তের জন্য</p><h1>বিশেষ দিনের গয়না নির্বাচন।</h1><p>গয়না হোক আপনার বিশেষ মুহূর্তের সঙ্গী। বিয়ের সাজ বা যেকোনো উৎসব—নিখুঁত পছন্দের জন্য আমরা সাথে আছি।</p><a class="button button-dark" href="/bn/occasions/bridal/">অলংকার পছন্দ করুন <span>→</span></a></div></article><article class="slide " data-slide aria-hidden="true"><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" width="1664" height="2080" alt="eMarket247 জুয়েলারি এডিটোরিয়াল ইমেজ" loading="lazy"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow">সবদিনের জন্য</p><h1>আপনার প্রতিদিনের সঙ্গী।</h1><p>ছোট-বড় প্রতিটি মুহূর্তের জন্য অলংকার—যা সহজ, সুন্দর এবং সাবলীল।</p><a class="button button-dark" href="/bn/shop/">সব দেখুন <span>→</span></a></div></article>`;

const bnNewHeroSlides = `<article class="slide is-active" data-slide aria-hidden="false"><img src="/assets/images/editorial/emarket247-hero-vermilion-atelier.webp" width="2560" height="1440" alt="eMarket247 City Gold জুয়েলারি কালেকশন" fetchpriority="high"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> City Gold জুয়েলারি</p><h1>বাংলাদেশে প্রতিটি বিশেষ মুহূর্তের জন্য City Gold জুয়েলারি</h1><p>বিয়ে, ঈদ, পূজা, দাওয়াত কিংবা প্রতিদিনের সাজ—কানের দুল, চুড়ি, হার, আংটি ও গহনার সেট থেকে আপনার পছন্দের ডিজাইনটি খুঁজে নিন। অর্ডারের আগে দেখুন পণ্যের বিস্তারিত তথ্য।</p><a class="button button-dark" href="/bn/shop/">গহনার কালেকশন দেখুন <span>→</span></a></div></article><article class="slide " data-slide aria-hidden="true"><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="উৎসব ও বিশেষ দিনের গহনা" loading="lazy"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow">উৎসব ও বিশেষ দিনের সাজ</p><h2>বিয়ে, ঈদ ও পূজার জন্য ঐতিহ্যবাহী গহনা</h2><p>ব্রাইডাল সেট থেকে শুরু করে মার্জিত কানের দুল ও নেকলেস—আপনার সবচেয়ে প্রিয় উৎসব ও বিশেষ মুহূর্তগুলোর জন্য বেছে নিন পছন্দের অলংকার।</p><a class="button button-dark" href="/bn/occasions/">অনুষ্ঠান অনুযায়ী গহনা দেখুন <span>→</span></a></div></article><article class="slide " data-slide aria-hidden="true"><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" width="1664" height="2080" alt="দৈনন্দিন ব্যবহারের হালকা ও সাবলীল গহনা" loading="lazy"><div class="slide-shade"></div><div class="slide-copy"><p class="eyebrow">প্রতিদিনের মার্জিত সাজ</p><h2>দৈনন্দিন ব্যবহারের জন্য হালকা ও সাবলীল গহনা</h2><p>অফিস, দাওয়াত কিংবা প্রতিদিনের ব্যবহারের জন্য বেছে নিন হালকা ও আরামদায়ক গহনা, কেনার আগে বিস্তারিত তথ্য দেখে নিশ্চিন্তে অর্ডার করুন।</p><a class="button button-dark" href="/bn/shop/">প্রতিদিনের গহনা দেখুন <span>→</span></a></div></article>`;

if (bn.includes(bnOldHeroSlides)) {
  bn = bn.replace(bnOldHeroSlides, bnNewHeroSlides);
  console.log('✓ BN Hero slides replaced');
} else {
  console.error('✗ BN Hero slides pattern not matched!');
}

// 3. BN Category Carousel Header
const bnOldCatHead = `      <p class="eyebrow">সকল ক্যাটাগরি · All Categories</p>
      <h2>প্রতিটি অলংকারের ধরন ও নকশা</h2>
      <p class="section-subhead">আমাদের সব ধরনের গয়না এক নজরে দেখে নিন—যেকোনো অলংকারে মাউস আনলে বা স্পর্শ করলে থেমে যাবে।</p>`;

const bnNewCatHead = `      <p class="eyebrow">ক্যাটাগরি অনুযায়ী দেখুন</p>
      <h2>আপনার পছন্দের ক্যাটাগরি থেকে গহনা বেছে নিন</h2>
      <p class="section-subhead">ঐতিহ্যবাহী সোনালি সেট থেকে শুরু করে প্রতিদিনের ব্যবহারের হালকা গহনা—আপনার পছন্দের ধরন অনুযায়ী কালেকশন দেখুন।</p>`;

if (bn.includes(bnOldCatHead)) {
  bn = bn.replace(bnOldCatHead, bnNewCatHead);
  console.log('✓ BN Category header replaced');
} else {
  console.error('✗ BN Category header pattern not matched!');
}

// 4. BN Occasion Cards
// Card 1
bn = bn.replace(
  `<h3>বিয়ে</h3>`,
  `<h3>বিয়ে ও গায়ে হলুদ</h3>`
);
bn = bn.replace(
  `aria-label="মডেলের ছবি দেখুন: বিয়ে"`,
  `aria-label="মডেলের ছবি দেখুন: বিয়ে ও গায়ে হলুদ"`
);
bn = bn.replace(
  `<p class="occasion-card-desc">ঝুলন্ত স্বর্ণালী পুঁতি ও সূক্ষ্ম নকশাদার কাজের ব্রাইডাল নেকলেস—বিয়ের স্মরণীয় মুহূর্তের জন্য এক অনুপম সৃষ্টি।</p>`,
  `<p class="occasion-card-desc">বিয়ের বিশেষ সাজের জন্য জমকালো সেট ও ঐতিহ্যবাহী ডিজাইনের গহনা।</p>`
);

// Card 2
bn = bn.replace(
  `<p class="occasion-card-desc">ঈদের ভোরের নামাজ ও আত্মীয়-স্বজনের সাথে মিলনমেলায় পরিধানের উপযোগী স্নিগ্ধ সোনালী ফুলের লকেট।</p>`,
  `<p class="occasion-card-desc">উৎসবের পোশাকের সঙ্গে মানানসই মার্জিত ও সুন্দর গহনা।</p>`
);

// Card 3
bn = bn.replace(
  `<h3>পূজা</h3>`,
  `<h3>দুর্গাপূজা</h3>`
);
bn = bn.replace(
  `aria-label="মডেলের ছবি দেখুন: পূজা"`,
  `aria-label="মডেলের ছবি দেখুন: দুর্গাপূজা"`
);
bn = bn.replace(
  `<p class="occasion-card-desc">শরতের পুজোয় লাল পেড়ে সাদা শাড়ির সাথে মানানসই সূক্ষ্ম ফ্লোরাল খোদাই করা ক্লাসিক সোনালী বালা ও চুড়ি।</p>`,
  `<p class="occasion-card-desc">শাড়ি ও উৎসবের সাজের সঙ্গে মানানসই সোনালি আভাযুক্ত গহনা।</p>`
);

// Card 4
bn = bn.replace(
  `<article class="occasion-card" data-href="/bn/occasions/birthday/">`,
  `<article class="occasion-card" data-href="/bn/occasions/">`
);
bn = bn.replace(
  `aria-label="মডেলের ছবি দেখুন: জন্মদিন"`,
  `aria-label="মডেলের ছবি দেখুন: পার্টি ও দাওয়াত"`
);
bn = bn.replace(
  `<h3>জন্মদিন</h3>`,
  `<h3>পার্টি ও দাওয়াত</h3>`
);
bn = bn.replace(
  `<small>Birthday <b>↗</b></small>`,
  `<small>Party &amp; Dawat <b>↗</b></small>`
);
bn = bn.replace(
  `<p class="occasion-card-desc">জীবনের প্রতিটি মাইলফলক উদযাপনের জন্য পাপড়ির বিন্যাস ও টেক্সচার্ড ব্যান্ডে গড়া উজ্জ্বল স্বর্ণালী আংটি।</p>`,
  `<p class="occasion-card-desc">দাওয়াত, ডিনার বা বিশেষ সন্ধ্যার জন্য মানানসই নেকলেস, কানের দুল ও জুয়েলারি সেট।</p>`
);
bn = bn.replace(
  `<a href="/bn/occasions/birthday/" class="occasion-card-cta">কালেকশন দেখুন <span>→</span></a>`,
  `<a href="/bn/occasions/" class="occasion-card-cta">কালেকশন দেখুন <span>→</span></a>`
);

// Card 5
bn = bn.replace(
  `<article class="occasion-card" data-href="/bn/occasions/anniversary/">`,
  `<article class="occasion-card" data-href="/bn/shop/">`
);
bn = bn.replace(
  `aria-label="মডেলের ছবি দেখুন: বার্ষিকী"`,
  `aria-label="মডেলের ছবি দেখুন: প্রতিদিনের ব্যবহার"`
);
bn = bn.replace(
  `<h3>বার্ষিকী</h3>`,
  `<h3>প্রতিদিনের ব্যবহার</h3>`
);
bn = bn.replace(
  `<small>Anniversary <b>↗</b></small>`,
  `<small>Everyday <b>↗</b></small>`
);
bn = bn.replace(
  `<p class="occasion-card-desc">একসাথে চলার প্রতিটি বছরকে স্মরণীয় করে রাখতে অক্ষয় ভালোবাসার প্রতীক হিসেবে ইন্টারটুইনড ইনফিনিটি ব্যান্ড।</p>`,
  `<p class="occasion-card-desc">দৈনন্দিন ব্যবহারের জন্য হালকা কানের দুল, চেইন ও আংটি।</p>`
);
bn = bn.replace(
  `<a href="/bn/occasions/anniversary/" class="occasion-card-cta">কালেকশন দেখুন <span>→</span></a>`,
  `<a href="/bn/shop/" class="occasion-card-cta">কালেকশন দেখুন <span>→</span></a>`
);

// Card 6
bn = bn.replace(
  `<p class="occasion-card-desc">প্রিয়জনকে উপহার দেওয়ার জন্য বিশেষভাবে প্যাকেজ করা ম্যাচিং মেডেলিয়ন লকেট ও সূক্ষ্ম ফিলিগ্রি কানের দুল।</p>`,
  `<p class="occasion-card-desc">জন্মদিন, বিবাহবার্ষিকী বা প্রিয়জনকে উপহার দেওয়ার মতো সুন্দর গহনা।</p>`
);

// 5. BN Truth-Line
const bnOldTruthLine = `<aside class="truth-line"><span>পরিষ্কার তথ্য। পণ্যের বাস্তব বিবরণ। অনলাইনে গহনা কেনার সহজ অভিজ্ঞতা।</span></aside>`;
const bnNewTruthLine = `<aside class="truth-line"><div class="truth-line-inner wrap"><p class="truth-line-heading">পরিষ্কার তথ্য। পণ্যের বাস্তব বিবরণ। অনলাইনে গহনা কেনার সহজ অভিজ্ঞতা।</p><p class="truth-line-copy">আমরা বিশ্বাস করি গহনা পছন্দ করার অভিজ্ঞতা হওয়া উচিত আনন্দের—অনিশ্চয়তার নয়। তাই অর্ডারের আগে পণ্যের সঠিক তথ্য, স্পষ্ট বিবরণ ও সরাসরি পরামর্শকে আমরা সবচেয়ে বেশি গুরুত্ব দিই।</p></div></aside>`;
if (bn.includes(bnOldTruthLine)) {
  bn = bn.replace(bnOldTruthLine, bnNewTruthLine);
  console.log('✓ BN Truth line upgraded');
} else {
  console.error('✗ BN Truth line pattern not matched!');
}

// 6. BN Trust Grid intro
const bnOldTrustHead = `<section class="trust-grid wrap"><div><p class="eyebrow">কেন eMarket247 থেকে কিনবেন</p><h2>পরিষ্কার তথ্য। পছন্দের স্বাধীনতা। কেনার আগে সরাসরি সহায়তা।</h2></div>`;
const bnNewTrustHead = `<section class="trust-grid wrap"><div><p class="eyebrow">কেন eMarket247 থেকে কিনবেন</p><h2>পরিষ্কার তথ্য। পছন্দের স্বাধীনতা। কেনার আগে সরাসরি সহায়তা।</h2><p class="trust-intro">অনলাইনে গহনা কেনা আরও সহজ হয় যখন আপনি জানেন কী কিনছেন। তাই অর্ডারের আগে গুরুত্বপূর্ণ তথ্যগুলো সহজে খুঁজে পাওয়ার সুযোগ দিই।</p></div>`;
if (bn.includes(bnOldTrustHead)) {
  bn = bn.replace(bnOldTrustHead, bnNewTrustHead);
  console.log('✓ BN Trust Grid intro added');
} else {
  console.error('✗ BN Trust Grid head pattern not matched!');
}

// 7. BN Customer Reviews (Section 10) & WhatsApp Conversion CTA (Section 9) replacing Newsletter
const bnReviewsSection = `<section class="reviews-section wrap" aria-label="গ্রাহকদের অভিজ্ঞতা"><div class="section-head"><div><p class="eyebrow">গ্রাহকদের অভিজ্ঞতা</p><h2>eMarket247 থেকে কেনাকাটা করে গ্রাহকরা কী বলছেন</h2><p class="section-subhead">গহনা, কেনাকাটা ও সেবা নিয়ে আমাদের গ্রাহকদের বাস্তব অভিজ্ঞতা দেখুন।</p></div></div><div class="reviews-trust-note"><div class="reviews-trust-card"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><strong>শুধুমাত্র বাস্তব অভিজ্ঞতা</strong><p>আমরা শুধুমাত্র বাস্তব ক্রেতাদের যাচাইকৃত মতামত প্রকাশ করি। আপনার কেনাকাটার অভিজ্ঞতা আমাদের সাথে হোয়াটসঅ্যাপে শেয়ার করুন।</p></div><a class="button button-outline" href="https://wa.me/8801740501062?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20eMarket247%20%E0%A6%A8%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A7%87%20%E0%A6%AE%E0%A6%A4%E0%A6%BE%E0%A6%AE%E0%A6%A4%20%E0%A6%A6%E0%A6%BF%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87" target="_blank" rel="noopener noreferrer">মতামত জানান <span>→</span></a></div></div></section>`;

const bnWhatsAppSection = `<section class="whatsapp-cta-section" aria-label="হোয়াটসঅ্যাপ অর্ডার ও সহায়তা"><div class="wrap whatsapp-cta-inner"><div class="whatsapp-cta-copy"><p class="eyebrow">প্রশ্ন আছে? হোয়াটসঅ্যাপে কথা বলুন।</p><h2>হোয়াটসঅ্যাপে সরাসরি গহনা অর্ডার করুন</h2><p class="whatsapp-cta-desc">কোনো পণ্য সম্পর্কে জানতে চান? পণ্যের নাম বা আপনার প্রশ্নটি হোয়াটসঅ্যাপে পাঠান। অর্ডারের সিদ্ধান্ত নেওয়ার আগে আমরা প্রয়োজনীয় তথ্য জানাতে সাহায্য করব।</p></div><div class="whatsapp-cta-action"><a class="whatsapp-direct-btn" href="https://wa.me/8801740501062?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%2F%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20eMarket247%20%E0%A6%97%E0%A6%B9%E0%A6%A8%E0%A6%BE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/></svg><span>হোয়াটসঅ্যাপে কথা বলুন <span>→</span></span></a><p class="whatsapp-cta-num">সরাসরি হোয়াটসঅ্যাপ: <strong>+৮৮০ ১৭৪০ ৫০১০৬২</strong></p></div></div></section>`;

// Insert reviews before </main>, and replace newsletter inside footer with whatsapp cta placed right before footer
const bnOldEndMain = `</ol></section></main><footer class="site-footer"><section class="newsletter"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p><h2>নতুন কালেকশন, উপহারের ভাবনা এবং বিবেচনাপূর্ণ জুয়েলারি নোট।</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="আপনার ইমেইল" required><button type="submit" aria-label="Submit">↗</button><p>সংবাদ আপডেট পেতে সম্মতি দেওয়ার আগে একটি আনুষ্ঠানিক গোপনীয়তা ব্যবস্থা যুক্ত হবে।</p></form></section><div class="footer-main">`;

const bnNewEndMain = `</ol></section>${bnReviewsSection}${bnWhatsAppSection}</main><footer class="site-footer"><div class="footer-main">`;

if (bn.includes(bnOldEndMain)) {
  bn = bn.replace(bnOldEndMain, bnNewEndMain);
  console.log('✓ BN Reviews & WhatsApp CTA inserted, Newsletter removed');
} else {
  console.error('✗ BN End main / newsletter pattern not matched!');
}

fs.writeFileSync(bnPath, bn, 'utf8');
console.log('Saved public_html/bn/index.html');


console.log('\n--- Upgrading EN Homepage (public_html/en/index.html) ---');

// 1. EN Schema name
en = en.replace(
  '"name":"eMarket247 | Fashion & Jewellery in Bangladesh"',
  '"name":"eMarket247 | City Gold Jewellery Shop in Bangladesh"'
);

// 2. EN Hero slide 2 & 3 h1 to h2
en = en.replace(
  '<h1>Jewellery for Weddings, Eid, Puja &amp; Every Celebration.</h1>',
  '<h2>Jewellery for Weddings, Eid, Puja &amp; Every Celebration.</h2>'
);
en = en.replace(
  '<h1>Beautiful Details for Everyday Style.</h1>',
  '<h2>Beautiful Details for Everyday Style.</h2>'
);

// 3. EN Occasion Cards
// Card 1
en = en.replace(
  `<h3>Weddings</h3>`,
  `<h3>Wedding &amp; Gaye Holud</h3>`
);
en = en.replace(
  `aria-label="Toggle on-model view for Weddings"`,
  `aria-label="Toggle on-model view for Wedding &amp; Gaye Holud"`
);
en = en.replace(
  `<p class="occasion-card-desc">Cascading golden beads and intricate repoussé filigree collar crafted to crown significant bridal vows.</p>`,
  `<p class="occasion-card-desc">Statement sets and traditional-inspired pieces for your big celebrations.</p>`
);

// Card 2
en = en.replace(
  `<p class="occasion-card-desc">Luminous floral silhouette suspended from a fine link chain for celebratory dawn prayers and family visits.</p>`,
  `<p class="occasion-card-desc">Elegant jewellery to complete your festive outfit without overwhelming your look.</p>`
);

// Card 3
en = en.replace(
  `<h3>Puja</h3>`,
  `<h3>Durga Puja</h3>`
);
en = en.replace(
  `aria-label="Toggle on-model view for Puja"`,
  `aria-label="Toggle on-model view for Durga Puja"`
);
en = en.replace(
  `<p class="occasion-card-desc">Authentic floral repoussé carvings attuned to Lal Paad Shada saree traditions and Sharodiya festivities.</p>`,
  `<p class="occasion-card-desc">Gold-inspired jewellery that pairs beautifully with sarees and festive traditional wear.</p>`
);

// Card 4
en = en.replace(
  `<article class="occasion-card" data-href="/en/occasions/birthday/">`,
  `<article class="occasion-card" data-href="/en/occasions/">`
);
en = en.replace(
  `aria-label="Toggle on-model view for Birthday"`,
  `aria-label="Toggle on-model view for Party &amp; Dawat"`
);
en = en.replace(
  `<h3>Birthday</h3>`,
  `<h3>Party &amp; Dawat</h3>`
);
en = en.replace(
  `<small lang="bn">জন্মদিন <b>↗</b></small>`,
  `<small lang="bn">দাওয়াত <b>↗</b></small>`
);
en = en.replace(
  `<p class="occasion-card-desc">Expressive sculpted petals and textured shank crafted to mark personal milestones with luminous joy.</p>`,
  `<p class="occasion-card-desc">Polished necklaces, earrings and sets for dinners, invitations and special evenings.</p>`
);
en = en.replace(
  `<a href="/en/occasions/birthday/" class="occasion-card-cta">Explore Birthday <span>→</span></a>`,
  `<a href="/en/occasions/" class="occasion-card-cta">Explore Occasions <span>→</span></a>`
);

// Card 5
en = en.replace(
  `<article class="occasion-card" data-href="/en/occasions/anniversary/">`,
  `<article class="occasion-card" data-href="/en/shop/">`
);
en = en.replace(
  `aria-label="Toggle on-model view for Anniversary"`,
  `aria-label="Toggle on-model view for Everyday &amp; Office Wear"`
);
en = en.replace(
  `<h3>Anniversary</h3>`,
  `<h3>Everyday &amp; Office Wear</h3>`
);
en = en.replace(
  `<small lang="bn">বার্ষিকী <b>↗</b></small>`,
  `<small lang="bn">দৈনন্দিন <b>↗</b></small>`
);
en = en.replace(
  `<p class="occasion-card-desc">Sculptural intertwined bands symbolizing unbroken devotion, rendered in polished heirloom gold tone.</p>`,
  `<p class="occasion-card-desc">Lightweight earrings, simple chains and subtle rings designed for everyday comfort.</p>`
);
en = en.replace(
  `<a href="/en/occasions/anniversary/" class="occasion-card-cta">Explore Anniversary <span>→</span></a>`,
  `<a href="/en/shop/" class="occasion-card-cta">Explore Everyday <span>→</span></a>`
);

// Card 6
en = en.replace(
  `<p class="occasion-card-desc">Matching medallion pendant and filigree drop earrings packaged in Vermilion presentation box.</p>`,
  `<p class="occasion-card-desc">Thoughtful jewellery pieces for birthdays, anniversaries and special surprises.</p>`
);

// 4. EN Truth-Line
const enOldTruthLine = `<aside class="truth-line"><span>Clear information. Real product details. A simpler way to buy jewellery online.</span></aside>`;
const enNewTruthLine = `<aside class="truth-line"><div class="truth-line-inner wrap"><p class="truth-line-heading">Clear information. Real product details. A simpler way to buy jewellery online.</p><p class="truth-line-copy">We believe choosing jewellery should feel exciting—not uncertain. That's why we focus on clear product information, honest descriptions and straightforward customer support before you order.</p></div></aside>`;
if (en.includes(enOldTruthLine)) {
  en = en.replace(enOldTruthLine, enNewTruthLine);
  console.log('✓ EN Truth line upgraded');
} else {
  console.error('✗ EN Truth line pattern not matched!');
}

// 5. EN Trust Grid intro
const enOldTrustHead = `<section class="trust-grid wrap"><div><p class="eyebrow">Why Shop With Us</p><h2>Clear Details. Real Choices. Helpful Support Before You Buy.</h2></div>`;
const enNewTrustHead = `<section class="trust-grid wrap"><div><p class="eyebrow">Why Shop With Us</p><h2>Clear Details. Real Choices. Helpful Support Before You Buy.</h2><p class="trust-intro">Online jewellery shopping is easier when you know what you're choosing. We make the important information easier to find before you place an order.</p></div>`;
if (en.includes(enOldTrustHead)) {
  en = en.replace(enOldTrustHead, enNewTrustHead);
  console.log('✓ EN Trust Grid intro added');
} else {
  console.error('✗ EN Trust Grid head pattern not matched!');
}

// 6. EN Customer Reviews & WhatsApp Conversion CTA replacing Newsletter
const enReviewsSection = `<section class="reviews-section wrap" aria-label="Customer Reviews"><div class="section-head"><div><p class="eyebrow">What Customers Say</p><h2>Real Experiences From eMarket247 Customers</h2><p class="section-subhead">See what customers have shared about their shopping experience, product quality and service.</p></div></div><div class="reviews-trust-note"><div class="reviews-trust-card"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><strong>Verified Experiences Only</strong><p>We publish genuine feedback from confirmed buyers. Have an experience with your purchase? Share your thoughts with us on WhatsApp.</p></div><a class="button button-outline" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20share%20my%20feedback%20about%20eMarket247." target="_blank" rel="noopener noreferrer">Share Feedback <span>→</span></a></div></div></section>`;

const enWhatsAppSection = `<section class="whatsapp-cta-section" aria-label="WhatsApp Order &amp; Support"><div class="wrap whatsapp-cta-inner"><div class="whatsapp-cta-copy"><p class="eyebrow">Have a Question? Talk to Us on WhatsApp.</p><h2>Order Jewellery Directly on WhatsApp</h2><p class="whatsapp-cta-desc">Want to check a product before ordering? Send us the product name or ask your question on WhatsApp. We'll help you with the available information before you decide.</p></div><div class="whatsapp-cta-action"><a class="whatsapp-direct-btn" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20eMarket247%20jewellery." target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/></svg><span>Start a WhatsApp Conversation <span>→</span></span></a><p class="whatsapp-cta-num">Direct WhatsApp: <strong>+880 1740-501062</strong></p></div></div></section>`;

const enOldEndMain = `</ol></section></main><footer class="site-footer"><section class="newsletter"><div><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Submit">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p></form></section><div class="footer-main">`;

const enNewEndMain = `</ol></section>${enReviewsSection}${enWhatsAppSection}</main><footer class="site-footer"><div class="footer-main">`;

if (en.includes(enOldEndMain)) {
  en = en.replace(enOldEndMain, enNewEndMain);
  console.log('✓ EN Reviews & WhatsApp CTA inserted, Newsletter removed');
} else {
  console.error('✗ EN End main / newsletter pattern not matched!');
}

fs.writeFileSync(enPath, en, 'utf8');
console.log('Saved public_html/en/index.html');
