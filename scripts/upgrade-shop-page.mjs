// One-off: upgrade /shop/ (EN+BN) from placeholder copy to keyword-led content,
// following the approved category-page pattern. Honesty rules kept: the
// "records under review" toolbar line and per-card status stay untouched.
import { readFileSync, writeFileSync } from "node:fs";

const V = {
  en: {
    title: "Shop Jewellery in Bangladesh — Rings to Sets | eMarket247",
    meta: "Browse all jewellery in one place — gold-tone rings, earrings, bangles, necklaces, pendants and sets. See every design's details and confirm price on WhatsApp.",
    h1: "Shop All Jewellery in Bangladesh",
    heroP: "Every design in the eMarket247 collection — rings, earrings, bangles, necklaces, pendants and sets — with clear details on each product page and easy WhatsApp ordering in Bangla or English.",
    heroEyebrow: "eMarket247 Full Collection",
  },
  bn: {
    title: "সব গহনা — বাংলাদেশে অনলাইন কালেকশন | eMarket247",
    meta: "এক জায়গায় সব গহনা — সোনালি আংটি, কানের দুল, চুড়ি, হার, লকেট ও সেট। প্রতিটি ডিজাইনের বিবরণ দেখুন ও হোয়াটসঅ্যাপে দাম নিশ্চিত করুন।",
    h1: "বাংলাদেশে সব গহনা এক জায়গায়",
    heroP: "eMarket247 কালেকশনের প্রতিটি ডিজাইন — আংটি, কানের দুল, চুড়ি, হার, লকেট ও সেট — প্রতিটি পণ্য পেজে পরিষ্কার বিবরণসহ, বাংলা বা ইংরেজিতে সহজ হোয়াটসঅ্যাপ অর্ডারে।",
    heroEyebrow: "eMarket247 সম্পূর্ণ কালেকশন",
  },
};

const notes = {
  en: `<section class="category-notes wrap"><div><p class="eyebrow">The collection</p><h2>Every Category, One Place</h2><p>Gold-tone <a class="text-link" href="/en/categories/rings/">rings</a> for daily wear and celebrations, <a class="text-link" href="/en/categories/earrings/">earrings</a> from studs to jhumkas, <a class="text-link" href="/en/categories/bangles/">bangles</a> and <a class="text-link" href="/en/categories/necklaces/">necklaces</a> for every occasion, plus <a class="text-link" href="/en/categories/pendants/">pendants</a> and coordinated <a class="text-link" href="/en/categories/jewellery-sets/">jewellery sets</a>. Each product page lists the design's details so you can compare before deciding.</p><p><a class="text-link" href="/en/categories/">View all categories <span>→</span></a></p></div><div><p class="eyebrow">By occasion</p><h2>Find the Piece for the Moment</h2><p>Shopping for a specific day? The occasion edits gather the catalogue by moment: <a class="text-link" href="/en/occasions/wedding/">wedding</a>, <a class="text-link" href="/en/occasions/eid/">Eid</a>, <a class="text-link" href="/en/occasions/puja/">Puja</a>, anniversaries and birthdays — or browse <a class="text-link" href="/en/occasions/gifts/">gift jewellery</a> chosen for giving.</p><p><a class="text-link" href="/en/occasions/">View all occasions <span>→</span></a></p></div><div><p class="eyebrow">Before you order</p><h2>Clear Details, Confirmed on WhatsApp</h2><p>Prices are shown as a range; the final price of a specific design is confirmed personally on WhatsApp. No account or online payment is needed to start — send the design name, and we will reply with availability and the current details of the piece.</p><p><a class="text-link" href="/en/how-to-order/">How ordering works <span>→</span></a></p></div></section>`,
  bn: `<section class="category-notes wrap"><div><p class="eyebrow">কালেকশন</p><h2>সব ক্যাটাগরি, এক জায়গায়</h2><p>প্রতিদিন ও উৎসবের জন্য সোনালি <a class="text-link" href="/bn/categories/rings/">আংটি</a>, স্টাড থেকে ঝুমকা <a class="text-link" href="/bn/categories/earrings/">কানের দুল</a>, সব অনুষ্ঠানের <a class="text-link" href="/bn/categories/bangles/">চুড়ি</a> ও <a class="text-link" href="/bn/categories/necklaces/">হার</a>, এর সাথে <a class="text-link" href="/bn/categories/pendants/">লকেট</a> ও সমন্বিত <a class="text-link" href="/bn/categories/jewellery-sets/">জুয়েলারি সেট</a>। প্রতিটি পণ্য পেজে ডিজাইনের বিবরণ আছে, যাতে সিদ্ধান্তের আগে তুলনা করতে পারেন।</p><p><a class="text-link" href="/bn/categories/">সব ক্যাটাগরি দেখুন <span>→</span></a></p></div><div><p class="eyebrow">অনুষ্ঠান অনুযায়ী</p><h2>মুহূর্তের জন্য পিস খুঁজুন</h2><p>নির্দিষ্ট দিনের জন্য কিনছেন? অনুষ্ঠানভিত্তিক এডিটগুলো মুহূর্ত ধরে ক্যাটালগ সাজায়: <a class="text-link" href="/bn/occasions/wedding/">বিয়ে</a>, <a class="text-link" href="/bn/occasions/eid/">ঈদ</a>, <a class="text-link" href="/bn/occasions/puja/">পূজা</a>, বার্ষিকী ও জন্মদিন — অথবা উপহারের জন্য বেছে নেওয়া <a class="text-link" href="/bn/occasions/gifts/">উপহারের গহনা</a> দেখুন।</p><p><a class="text-link" href="/bn/occasions/">সব অনুষ্ঠান দেখুন <span>→</span></a></p></div><div><p class="eyebrow">অর্ডারের আগে</p><h2>পরিষ্কার বিবরণ, হোয়াটসঅ্যাপে নিশ্চিত</h2><p>দাম দেখানো হয় রেঞ্জ হিসেবে; নির্দিষ্ট ডিজাইনের চূড়ান্ত দাম হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করা হয়। শুরু করতে অ্যাকাউন্ট বা অনলাইন পেমেন্ট লাগে না — ডিজাইনের নাম পাঠান, আমরা প্রাপ্যতা ও বর্তমান বিবরণ জানিয়ে উত্তর দেব।</p><p><a class="text-link" href="/bn/how-to-order/">অর্ডারের নিয়ম <span>→</span></a></p></div></section>`,
};

for (const lang of ["en", "bn"]) {
  const v = V[lang];
  const f = `public_html/${lang}/shop/index.html`;
  let s = readFileSync(f, "utf8");
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${v.title}</title>`);
  s = s.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${v.meta}"`);
  s = s.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${v.title}"`);
  s = s.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${v.meta}"`);
  s = s.replace(/"name":"Shop \| eMarket247"/g, `"name":"${v.title}"`);
  // Hero copy
  s = s.replace(/<p class="eyebrow"><strong class="brand-name">eMarket247<\/strong>[^<]*<\/p>/, `<p class="eyebrow"><strong class="brand-name">eMarket247</strong> ${lang === "en" ? "Full Collection" : "সম্পূর্ণ কালেকশন"}</p>`);
  s = s.replace(/<h1>[^<]*<\/h1>/, `<h1>${v.h1}</h1>`);
  s = s.replace(/(<h1>[^<]*<\/h1>)<p>[^<]*<\/p>/, `$1<p>${v.heroP}</p>`);
  // Notes section after the grid
  const anchor = "</section></main>";
  if (!s.includes(anchor)) { console.error("anchor missing:", lang); continue; }
  if (s.includes("category-notes")) { console.log("skip (already upgraded):", lang); continue; }
  s = s.replace(anchor, "</section>" + notes[lang] + "</main>");
  writeFileSync(f, s);
  console.log("upgraded:", f);
}
