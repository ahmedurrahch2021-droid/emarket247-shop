// One-off: rebuild the occasions hub pages (EN + BN) as a lightweight
// discovery hub: slim hero, seven image tiles (existing category-tile
// system), merged AEO block, CTA. Ideas: 1 = occasion-whisper labels,
// 2 = hover reveal caption (CSS only), 3 = accent word in hero intro.
import { readFileSync, writeFileSync } from "node:fs";

const IMG = {
  wedding: ["/assets/images/editorial/emarket247-bridal-occasion-editorial.webp", 1280, 1600],
  eid: ["/assets/images/editorial/emarket247-hero-vermilion-atelier.webp", 1600, 900],
  puja: ["/assets/images/editorial/emarket247-gifting-puja-editorial.webp", 1600, 1067],
  birthday: ["/assets/images/editorial/emarket247-gifting-puja-editorial.webp", 1600, 1067],
  anniversary: ["/assets/images/editorial/emarket247-hero-vermilion-atelier.webp", 1600, 900],
  gifts: ["/assets/images/editorial/emarket247-gifting-puja-editorial.webp", 1600, 1067],
  bridal: ["/assets/images/editorial/Bridal.webp", 1600, 900],
};

const tile = (lang, slug, h3, cross, desc, alt) => {
  const [src, w, h] = IMG[slug];
  return `<a href="/${lang}/occasions/${slug}/" class="category-tile has-media"><figure><img src="${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>${h3}</h3><small>${cross} <b>↗</b></small></div><p class="category-desc">${desc}</p></div></a>`;
};

const BN = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> উপলক্ষ</p>
  <h1>উপলক্ষ অনুযায়ী জুয়েলারি</h1>
  <p>যে <em class="accent-word">মুহূর্তের</em> জন্য সাজছেন, সেই মুহূর্তের মতোই বেছে নিন। বিয়ে, ঈদ, পূজা, জন্মদিন, বিবাহবার্ষিকী কিংবা প্রিয়জনকে কিছু দেওয়ার বিশেষ দিন—আপনার অনুষ্ঠানের সঙ্গে মানানসই জুয়েলারি খুঁজতে উপলক্ষ অনুযায়ী দেখুন।</p>
  <p class="hero-lede"><strong>আপনার উপলক্ষ বেছে নিয়ে জুয়েলারি অনুপ্রেরণা দেখুন।</strong></p>
</div></section>
<section class="category-section wrap" aria-label="উপলক্ষ অনুযায়ী জুয়েলারি">
  <div class="category-grid category-product-grid">
    ${tile("bn","wedding","বিয়ের জুয়েলারি","Wedding","শাড়ি, লেহেঙ্গা বা ঐতিহ্যবাহী পোশাকের সঙ্গে মানানসই ব্রাইডাল জুয়েলারি ও সেটের ধারণা।","eMarket247 — বিয়ের জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","eid","ঈদের জুয়েলারি","Eid","হালকা ও সিম্পল থেকে নজরকাড়া ডিজাইন—পোশাক ও ব্যক্তিগত স্টাইল অনুযায়ী অনুপ্রেরণা।","eMarket247 — ঈদের জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","puja","পূজার জুয়েলারি","Puja","কানের দুল, চুড়ি, হার বা অন্যান্য গহনায় পোশাকের সঙ্গে মানানসই স্টাইল খুঁজে দেখুন।","eMarket247 — পূজার জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","birthday","জন্মদিনের জুয়েলারি","Birthday","নিজের জন্য হোক বা প্রিয় কারও জন্য—ব্যক্তিগত ও ব্যবহারযোগ্য উপহারের ধারণা।","eMarket247 — জন্মদিনের জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","anniversary","বিবাহবার্ষিকীর জুয়েলারি","Anniversary","ব্যক্তিগত পছন্দ, স্টাইল ও প্রতিদিন পরার উপযোগিতা মাথায় রেখে বাছাই।","eMarket247 — বিবাহবার্ষিকীর জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","gifts","উপহারের জুয়েলারি","Gifts","যার জন্য দেবেন তার স্টাইল ও ব্যবহারের সঙ্গে মানিয়ে যাওয়া অর্থবহ উপহার।","eMarket247 — উপহারের জুয়েলারি অনুপ্রেরণা")}
    ${tile("bn","bridal","ব্রাইডাল জুয়েলারি","Bridal","কনের পুরো লুকের সঙ্গে সামঞ্জস্যপূর্ণ ব্রাইডাল জুয়েলারির ধারণা।","eMarket247 — ব্রাইডাল জুয়েলারি অনুপ্রেরণা")}
  </div>
</section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">সঠিক বাছাই</p>
  <h2>উপলক্ষ অনুযায়ী জুয়েলারি কীভাবে বেছে নেবেন?</h2>
  <p>প্রথমে ভাবুন <strong>কোথায় পরবেন এবং কী পোশাকের সঙ্গে পরবেন</strong>। বিয়ে বা বড় অনুষ্ঠানের জন্য তুলনামূলকভাবে বেশি আকর্ষণীয় ডিজাইন, ঈদ-পূজা বা সামাজিক অনুষ্ঠানে পোশাক ও ব্যক্তিগত স্টাইলের সঙ্গে সামঞ্জস্যপূর্ণ গহনা, আর প্রতিদিনের ব্যবহারের জন্য আরামদায়ক ও সহজ ডিজাইন বেছে নেওয়া ভালো। পণ্য দেখার সময় দেওয়া <strong>উপাদান, ফিনিশ, মাপ, মূল্য এবং অন্যান্য প্রাসঙ্গিক তথ্য</strong> দেখে সিদ্ধান্ত নিন।</p>
  <p>একই উপলক্ষেও সবার পছন্দ এক নয়—কেউ মিনিমাল, কেউ ঐতিহ্যবাহী, কেউ স্টেটমেন্ট লুক। তাই ট্রেন্ডের পাশাপাশি <strong>আপনার পোশাক, ব্যক্তিগত স্টাইল এবং যে মুহূর্তের জন্য সাজছেন—এই তিনটি বিষয়কে গুরুত্ব দিন।</strong></p>
  <p><a class="button button-dark" href="/bn/shop/">সব জুয়েলারি দেখুন <span>→</span></a></p>
</div></section>`;

const EN = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> Occasions</p>
  <h1>Jewellery by Occasion</h1>
  <p>Choose it the way you'd live the <em class="accent-word">moment</em>. A wedding, Eid, Puja, a birthday, an anniversary or a special day for someone you love — browse by occasion to find jewellery that matches your celebration.</p>
  <p class="hero-lede"><strong>Pick your occasion and explore jewellery inspiration.</strong></p>
</div></section>
<section class="category-section wrap" aria-label="Jewellery by occasion">
  <div class="category-grid category-product-grid">
    ${tile("en","wedding","Wedding Jewellery","বিয়ে","Bridal jewellery and set ideas that work with your sari, lehenga or traditional wear.","eMarket247 — wedding jewellery inspiration")}
    ${tile("en","eid","Eid Jewellery","ঈদ","From light and simple to eye-catching designs — inspiration matched to your outfit and style.","eMarket247 — Eid jewellery inspiration")}
    ${tile("en","puja","Puja Jewellery","পূজা","Earrings, bangles, necklaces and other pieces that harmonise with your festive attire.","eMarket247 — Puja jewellery inspiration")}
    ${tile("en","birthday","Birthday Jewellery","জন্মদিন","For yourself or someone dear — a personal, wearable gift idea.","eMarket247 — birthday jewellery inspiration")}
    ${tile("en","anniversary","Anniversary Jewellery","বিবাহবার্ষিকী","Chosen with personal taste, style and everyday wearability in mind.","eMarket247 — anniversary jewellery inspiration")}
    ${tile("en","gifts","Gift Jewellery","উপহার","A meaningful gift that fits the wearer's style and everyday use.","eMarket247 — gift jewellery inspiration")}
    ${tile("en","bridal","Bridal Jewellery","ব্রাইডাল","Bridal jewellery ideas that hold together the whole wedding-day look.","eMarket247 — bridal jewellery inspiration")}
  </div>
</section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">Choosing well</p>
  <h2>How to Choose Jewellery by Occasion</h2>
  <p>Start with <strong>where you'll wear it and with which outfit</strong>. Weddings and big events can carry bolder designs; for Eid, Puja and social occasions, aim for harmony with your attire and personal style; for everyday use, favour comfortable, easy pieces. When viewing a product, decide from the <strong>materials, finish, measurements, price and other details provided</strong>.</p>
  <p>Even at the same occasion, tastes differ — some prefer minimal, some traditional, some a statement look. Alongside trends, give weight to <strong>your outfit, your personal style, and the moment you're dressing for.</strong></p>
  <p><a class="button button-dark" href="/en/shop/">Shop All Jewellery <span>→</span></a></p>
</div></section>`;

const SEO = {
  "public_html/en/occasions/index.html": {
    title: "Jewellery by Occasion | Wedding, Eid, Puja & Gifts | eMarket247",
    meta: "Explore eMarket247 jewellery by occasion — wedding, Eid, Puja, birthday, anniversary and gift jewellery inspiration for every celebration.",
    ogTitle: "Jewellery by Occasion | Wedding, Eid, Puja & Gifts | eMarket247",
    h1: "Jewellery by Occasion",
    items: [["Wedding Jewellery","wedding"],["Eid Jewellery","eid"],["Puja Jewellery","puja"],["Birthday Jewellery","birthday"],["Anniversary Jewellery","anniversary"],["Gift Jewellery","gifts"],["Bridal Jewellery","bridal"]],
  },
  "public_html/bn/occasions/index.html": {
    title: "উপলক্ষ অনুযায়ী জুয়েলারি | বিয়ে, ঈদ, পূজা ও উপহার | eMarket247",
    meta: "বিয়ে, ঈদ, পূজা, জন্মদিন, বিবাহবার্ষিকী ও উপহারের জন্য উপলক্ষ অনুযায়ী জুয়েলারির অনুপ্রেরণা দেখুন এবং আপনার মুহূর্তের সঙ্গে মানানসই গহনা খুঁজে নিন।",
    ogTitle: "উপলক্ষ অনুযায়ী জুয়েলারি | বিয়ে, ঈদ, পূজা ও উপহার | eMarket247",
    h1: "উপলক্ষ অনুযায়ী জুয়েলারি",
    items: [["বিয়ের জুয়েলারি","wedding"],["ঈদের জুয়েলারি","eid"],["পূজার জুয়েলারি","puja"],["জন্মদিনের জুয়েলারি","birthday"],["বিবাহবার্ষিকীর জুয়েলারি","anniversary"],["উপহারের জুয়েলারি","gifts"],["ব্রাইডাল জুয়েলারি","bridal"]],
  },
};

for (const [file, html] of [["public_html/en/occasions/index.html", EN], ["public_html/bn/occasions/index.html", BN]]) {
  let s = readFileSync(file, "utf8");
  const lang = file.includes("/bn/") ? "bn" : "en";
  const seo = SEO[file];
  const mainStart = s.indexOf('<main id="main">');
  const mainEnd = s.indexOf('</main>', mainStart);
  if (mainStart === -1 || mainEnd === -1) throw new Error(`main not found in ${file}`);
  s = s.slice(0, mainStart + '<main id="main">'.length) + html + s.slice(mainEnd);

  s = s.replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`);
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${seo.ogTitle}$2`);
  // Replace og:description with meta text (JSON-safe: no quotes inside)
  s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  // Update CollectionPage name inside the existing JSON-LD
  s = s.replace(/("(?:CollectionPage|WebPage)"[^}]*?"name":")[^"]*(")/, `$1${seo.ogTitle}$2`);
  // Append ItemList into the @graph (before the closing of the script tag data)
  const items = seo.items.map(([name, slug], i) =>
    `{"@type":"ListItem","position":${i+1},"name":"${name}","url":"https://emarket247.shop/${lang}/occasions/${slug}/"}`).join(",");
  const itemList = `{"@type":"ItemList","@id":"https://emarket247.shop/${lang}/occasions/#itemlist","name":"${seo.h1}","numberOfItems":${seo.items.length},"itemListElement":[${items}]}`;
  s = s.replace(/(<script type="application\/ld\+json" data-emk="ld">)([\s\S]*?)(<\/script>)/, (m, a, json, c) => {
    const data = JSON.parse(json);
    if (Array.isArray(data["@graph"])) data["@graph"].push(JSON.parse(itemList));
    else if (data["@graph"] === undefined) data["@graph"] = [data, JSON.parse(itemList)].slice(1);
    return a + JSON.stringify(data) + c;
  });
  writeFileSync(file, s, "utf8");
  console.log(`${file}: rebuilt; ItemList present: ${/ItemList/.test(s)}`);
}
