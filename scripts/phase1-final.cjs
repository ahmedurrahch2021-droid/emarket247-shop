const fs = require('fs');

// ─── EN ───────────────────────────────────────────────────────────────
const enPath = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html/en/index.html';
let en = fs.readFileSync(enPath, 'utf8');

const enOps = [];

// Slide 3 - exact string from dump
const s3old = '<p class="eyebrow">Everyday wear</p><h1>Style for every day.</h1><p>Pieces designed for daily wear, gifting, and effortless grace.</p><a class="button button-dark" href="/en/shop/">Explore now <span>→</span></a>';
const s3new = '<p class="eyebrow">Everyday Elegance</p><h1>Beautiful Details for Everyday Style.</h1><p>Choose lighter, versatile pieces for work, outings and everyday wear, with product details that help you decide before buying.</p><a class="button button-dark" href="/en/shop/">Shop Everyday Jewellery <span>→</span></a>';
if (en.includes(s3old)) { en = en.replace(s3old, s3new); enOps.push('Slide3'); }
else enOps.push('Slide3 SKIP');

// Category - exact with \n
const catOld = ` <p class="eyebrow">All Categories · সকল ক্যাটাগরি</p>
      <h2>Explore Every Silhouette in Motion</h2>
      <p class="section-subhead">Discover our complete collection across each jewellery category—hover or tap any piece to pause.</p>`;
const catNew = `<p class="eyebrow">Shop by Jewellery Type</p>
      <h2>City Gold Jewellery: Earrings, Bangles, Necklaces, Rings &amp; More</h2>
      <p class="section-subhead">Looking for a particular type of jewellery? Browse the collection by category and find the design that fits your style, outfit and occasion.</p>`;
if (en.includes(catOld)) { en = en.replace(catOld, catNew); enOps.push('Category'); }
else enOps.push('Category SKIP: ' + catOld.substring(0,50));

// Occasion - exact with \n
const occOld = ` <p class="eyebrow">Meaningful Moments · বিশেষ ক্ষণ</p>
    <h2>Curated for every occasion</h2>
    <p class="section-subhead">From bridal vows to festive mornings—hover any piece to view it worn on model.</p>`;
const occNew = `<p class="eyebrow">Jewellery for Your Special Moments</p>
    <h2>Find Jewellery for Weddings, Eid, Puja &amp; Everyday Style</h2>
    <p class="section-subhead">Different occasions call for different styles. Explore jewellery selected around the moments, outfits and celebrations that matter to you.</p>`;
if (en.includes(occOld)) { en = en.replace(occOld, occNew); enOps.push('Occasion'); }
else enOps.push('Occasion SKIP');

// ─── BN ───────────────────────────────────────────────────────────────
const bnPath = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/index.html';
let bn = fs.readFileSync(bnPath, 'utf8');

const bnOps = [];

// BN meta description
const bnMetaOld = '<meta name="description" content="eMarket247-এর বিবেচনাপূর্ণ জুয়েলারি এডিট, বাংলা ও ইংরেজি ক্যাটাগরি পেজ, পণ্যের তথ্যমান এবং পূজার মৌসুমি আবিষ্কার।">';
const bnMetaNew = '<meta name="description" content="বাংলাদেশে City Gold জুয়েলারি কিনুন—কানের দুল, চুড়ি, হার ও সেট। দেখুন পণ্যের বিস্তারিত তথ্য এবং হোয়াটসঅ্যাপে সহজে অর্ডার করুন।">';
if (bn.includes(bnMetaOld)) { bn = bn.replace(bnMetaOld, bnMetaNew); bnOps.push('BN meta'); }
else bnOps.push('BN meta SKIP');

// BN occasion eyebrow + H2 + subhead - exact with \n
const bnOccOld = ` <p class="eyebrow">Meaningful Moments · বিশেষ ক্ষণ</p>
    <h2>প্রতিটি অনুষ্ঠানের জন্য সেরা নির্বাচন</h2>
    <p class="section-subhead">বিয়ের শুভ সূচনা থেকে উৎসবের আনন্দ—মডেলের সাজ দেখতে যেকোনো অলংকারে মাউস আনলে বা স্পর্শ করলে থেমে যাবে।</p>`;
const bnOccNew = `<p class="eyebrow">আপনার বিশেষ মুহূর্তের জন্য গহনা</p>
    <h2>বিয়ে, ঈদ, পূজা ও প্রতিদিনের সাজের জন্য গহনা খুঁজুন</h2>
    <p class="section-subhead">প্রতিটি অনুষ্ঠানের সাজ আলাদা। আপনার পোশাক, অনুষ্ঠান ও ব্যক্তিগত স্টাইলের সঙ্গে মানানসই গহনা বেছে নিতে কালেকশন দেখুন।</p>`;
if (bn.includes(bnOccOld)) { bn = bn.replace(bnOccOld, bnOccNew); bnOps.push('BN occasion'); }
else bnOps.push('BN occasion SKIP: ' + bnOccOld.substring(0,50));

// BN two-panel
const bn2pOld = '<p class="eyebrow">বিশেষ দিন</p><h2>বিশেষ দিনের জন্য বিশেষ অলংকার।</h2><p>আপনার জীবনের বিশেষ মুহূর্তের জন্য অলংকার বেছে নিন। নিখুঁত গয়না খুঁজে পেতে আমাদের গাইডেন্স দেখুন।</p><a class="text-link" href="/bn/occasions/bridal/">আমাদের কালেকশন দেখুন →</a>';
const bn2pNew = '<p class="eyebrow">আপনার জীবনের বিশেষ দিনের জন্য</p><h2>বিয়ের সাজ সম্পূর্ণ করতে বেছে নিন ব্রাইডাল জুয়েলারি</h2><p>শাড়ি, লেহেঙ্গা কিংবা ঐতিহ্যবাহী বিয়ের সাজ—নেকলেস সেট, কানের দুল ও স্টেটমেন্ট গহনা দিয়ে আপনার বিশেষ দিনের লুকটি সম্পূর্ণ করুন।</p><a class="text-link" href="/bn/occasions/bridal/">ব্রাইডাল গহনা দেখুন →</a>';
if (bn.includes(bn2pOld)) { bn = bn.replace(bn2pOld, bn2pNew); bnOps.push('BN two-panel'); }
else bnOps.push('BN two-panel SKIP');

// BN Puja eyebrow + H2 + strong + subhead + CTA
const bnPujaOld = '<p class="eyebrow">পূজা ২০২৬</p><h2>পূজার প্রস্তুতি, তাড়াহুড়ো নয়।</h2><div><strong>সেপ্টেম্বর: প্রাক-পূজা আবিষ্কার</strong><p>অক্টোবরে দুর্গাপূজা আসার আগে পছন্দের জুয়েলারি ক্যাটাগরি, স্টাইল এবং উপহারের ভাবনা আবিষ্কার করুন।</p>';
const bnPujaNew = '<p class="eyebrow">দুর্গাপূজার গহনা</p><h2>উৎসবের সাজে যোগ করুন সোনালি আভা</h2><div><strong>পূজার জন্য সোনালি আভাযুক্ত গহনা</strong><p>শাড়ি ও ঐতিহ্যবাহী পোশাকের সঙ্গে মানানসই গহনা দিয়ে পূজার প্রতিটি দিনের সাজ আরও সুন্দর করে তুলুন।</p>';
if (bn.includes(bnPujaOld)) { bn = bn.replace(bnPujaOld, bnPujaNew); bnOps.push('BN puja'); }
else bnOps.push('BN puja SKIP: ' + bnPujaOld.substring(0,40));

// BN Puja CTA
const bnPujaCtaOld = '<a class="button button-outline" href="/bn/occasions/puja/">পূজা কালেকশন দেখুন →</a>';
const bnPujaCtaNew = '<a class="button button-outline" href="/bn/occasions/puja/">পূজার গহনা দেখুন →</a>';
if (bn.includes(bnPujaCtaOld)) { bn = bn.replace(bnPujaCtaOld, bnPujaCtaNew); bnOps.push('BN puja CTA'); }
else bnOps.push('BN puja CTA SKIP');

// BN Trust eyebrow + H2
const bnTrustOld = '<p class="eyebrow">কেন eMarket247</p><h2>তথ্য দিয়ে শুরু করি, প্রতিশ্রুতি দিয়ে নয়।</h2>';
const bnTrustNew = '<p class="eyebrow">কেন eMarket247 থেকে কিনবেন</p><h2>পরিষ্কার তথ্য। পছন্দের স্বাধীনতা। কেনার আগে সরাসরি সহায়তা।</h2>';
if (bn.includes(bnTrustOld)) { bn = bn.replace(bnTrustOld, bnTrustNew); bnOps.push('BN trust'); }
else bnOps.push('BN trust SKIP');

// BN Trust point 1
const bnT1Old = '<strong>ফটোগ্রাফি ও স্বচ্ছতা</strong><p>স্টুডিও থেকে সরাসরি ছবি, যাতে কেনার আগে অলংকারটি সম্পর্কে স্পষ্ট ধারণা পান।</p>';
const bnT1New = '<strong>পণ্যের পরিষ্কার বিবরণ</strong><p>অর্ডারের আগে পণ্যের উপাদান, ডিজাইন, বিবরণ ও যত্নের তথ্য দেখে নিন।</p>';
if (bn.includes(bnT1Old)) { bn = bn.replace(bnT1Old, bnT1New); bnOps.push('BN trust p1'); }
else bnOps.push('BN trust p1 SKIP');

// BN Trust point 2 - with \n
const bnT2Old = `<</li><li><b>02</b><div><strong>সঠিক তথ্যের নিশ্চয়তা</strong><p>আমরা প্রতিটি পণ্যের সঠিক তথ্য ও আকার প্রদান করি, যাতে আপনি নিশ্চিন্তে বেছে নিতে পারেন।</p>`;
const bnT2New = `<</li><li><b>02</b><div><strong>অনুষ্ঠানের সঙ্গে মানানসই গহনা</strong><p>গহনার ধরন বা অনুষ্ঠান অনুযায়ী দেখুন এবং আপনার পোশাক ও স্টাইলের সঙ্গে মানানসই পছন্দটি করুন।</p>`;
if (bn.includes(bnT2Old)) { bn = bn.replace(bnT2Old, bnT2New); bnOps.push('BN trust p2'); }
else bnOps.push('BN trust p2 SKIP: ' + bnT2Old.substring(0,40));

// BN Trust point 3
const bnT3Old = '<strong>উভয় ভাষায় সেবার ব্যবস্থা</strong><p>আমাদের কালেকশন ও গ্রাহক সেবা—উভয়ই আপনি বাংলা বা ইংরেজি—যেকোনো ভাষায় গ্রহণ করতে পারবেন।</p>';
const bnT3New = '<strong>হোয়াটসঅ্যাপ সাপোর্ট</strong><p>পণ্য নিয়ে কোনো প্রশ্ন আছে? অর্ডারের আগে বাংলায় বা ইংরেজিতে হোয়াটসঅ্যাপে আমাদের জিজ্ঞেস করুন।</p>';
if (bn.includes(bnT3Old)) { bn = bn.replace(bnT3Old, bnT3New); bnOps.push('BN trust p3'); }
else bnOps.push('BN trust p3 SKIP');

// Write
fs.writeFileSync(enPath, en, 'utf8');
fs.writeFileSync(bnPath, bn, 'utf8');

console.log('EN ops:', enOps);
console.log('BN ops:', bnOps);
