// One-off: (1) create /occasions/pahela-baishakh/ (EN+BN) from the eid page
// as a shell, (2) swap wedding/bridal hero images, (3) add the Baishakh tile
// to the occasions hub and extend its ItemList to 8.
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const LANGS = {
  bn: {
    title: "পহেলা বৈশাখের জুয়েলারি | বাঙালি ঐতিহ্যের গহনা | eMarket247",
    meta: "পহেলা বৈশাখের সাজে বাঙালি ঐতিহ্যের গহনার অনুপ্রেরণা—শঙ্খ-পোলা-নোলকের ধারা থেকে লাল-সাদার উৎসবী লুক, এবং আপনার পছন্দের জুয়েলারি খুঁজে নেওয়ার সহজ পথ।",
    ogTitle: "পহেলা বৈশাখের জুয়েলারি | eMarket247",
    h1: "পহেলা বৈশাখের জুয়েলারি",
    item: "পহেলা বৈশাখের জুয়েলারি",
  },
  en: {
    title: "Pahela Baishakh Jewellery | Bengali Heritage | eMarket247",
    meta: "Pahela Baishakh jewellery inspiration — the shankha-pola-nolok tradition, the red-and-white festive look, and how to find pieces that carry the celebration.",
    ogTitle: "Pahela Baishakh Jewellery | eMarket247",
    h1: "Pahela Baishakh Jewellery",
    item: "Pahela Baishakh Jewellery",
  },
};

const IMG = "/assets/images/editorial/emarket247-gifting-puja-editorial.webp";
const IMGDIMS = [1600, 1067];

const CONTENT = {
  bn: `
<section class="editorial-hero full-width-hero occasion-hero"><img class="hero-bg" src="${IMG}" width="${IMGDIMS[0]}" height="${IMGDIMS[1]}" alt="পহেলা বৈশাখের জুয়েলারি | eMarket247" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> বৈশাখ</p><h1>পহেলা বৈশাখের জুয়েলারি</h1><p>লাল-সাদার উৎসব, হালকা সকাল, মেলার রং—বাঙালি ঐতিহ্যে গহনা যেভাবে উৎসবের অঙ্গ। বৈশাখের সাজে ঐতিহ্যবাহী অনুপ্রেরণা এবং আপনার পছন্দের জুয়েলারি খুঁজে নেওয়ার পথ এখানে।</p><div class="hero-actions"><a class="button hero-btn-primary" href="/bn/shop/">জুয়েলারি দেখুন →</a><a class="button hero-btn-secondary" href="/bn/occasions/">সব উপলক্ষ দেখুন</a></div></div></div></section>
<section class="occasion-detail wrap"><div><p class="eyebrow">ঐতিহ্যের ধারা</p><h2>শঙ্খ, পোলা ও নোলক—বাঙালি গহনার পুরোনো ত্রয়ী</h2><p>বাঙালি ঐতিহ্যে গহনার সবচেয়ে পরিচিত ধারাটি শুরু হয় <strong>শঙ্খ (খোল খোসার খোদাই করা চুড়ি), পোলা (লাল চুড়ি) এবং নোলক (সোনালি চুড়ি)</strong> দিয়ে। পহেলা বৈশাখের লাল-সাদা সাজের সঙ্গে এই ত্রয়ীর সমন্বয় আজও বাঙালি উৎসবের অন্যতম পরিচয়।</p><p>এর বাইরেও বাংলার নিজস্ব কারুকাজের ধারা সমৃদ্ধ—<strong>টেরাকোটা (মৃণ্ময়ী) গহনা, কাঠ ও বাঁশের হাতে গড়া গহনা, পাটের বোনা গহনা, ঢোকরার পিতলকাজ</strong> এবং প্রাকৃতিক বীজের মালা—প্রতিটি বৈশাখী মেলায় যেগুলোর দেখা মেলে। এগুলো সস্তা নয়, বরং নিজস্ব সৌন্দর্য ও ঐতিহ্যবাহী মূল্যের আলাদা একটি জগৎ।</p><p><strong>একটি স্বচ্ছ কথা:</strong> eMarket247-এর বর্তমান কালেকশন City Gold জুয়েলারিকেন্দ্রিক। ঐতিহ্যবাহী উপকরণের (কাঠ, বাঁশ, টেরাকোটা) গহনা এখন আমাদের অনুপ্রেরণা ও পরিকল্পনার অংশ—বাস্তবসম্মত হলে ভবিষ্যতে কালেকশনে যুক্ত হতে পারে। আপাতত বৈশাখী সাজের সঙ্গে মানানসই আমাদের বর্তমান গহনাগুলোই দেখুন।</p></div><div class="occasion-links"><a href="/bn/categories/earrings/"><span>কানের দুল <small style="color:var(--muted);font-size:11px;display:block;">বৈশাখী সাজের সঙ্গে মানানসই</small></span><b>→</b></a><a href="/bn/categories/bangles/"><span>চুড়ি <small style="color:var(--muted);font-size:11px;display:block;">লাল-সাদার সঙ্গে মেলানো</small></span><b>→</b></a><a href="/bn/categories/necklaces/"><span>হার ও নেকলেস <small style="color:var(--muted);font-size:11px;display:block;">সাদা শাড়ির সঙ্গী</small></span><b>→</b></a><a href="/bn/categories/pendants/"><span>পেনডেন্ট <small style="color:var(--muted);font-size:11px;display:block;">হালকা বৈশাখী লুক</small></span><b>→</b></a></div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">বৈশাখী সাজ</p>
  <h2>পহেলা বৈশাখে জুয়েলারি কীভাবে বেছে নেবেন?</h2>
  <p>বৈশাখী সাজের মূল সুর <strong>সাদা শাড়ি বা সালোয়ার, লাল পাড় আর ননী</strong>। এই সহজ পটভূমিতে গহনা বেশি ভারী হলে সাজটা চাপা পড়ে—তাই <strong>হালকা ও স্পষ্ট ডিজাইন</strong>ই বেশি মানানসই। এক জোড়া দুল, একটি সরু হার বা ম্যাট ফিনিশের চুড়ি—বেশি নয়, সঠিকটুকু।</p>
  <p>পণ্য দেখার সময় দেওয়া <strong>উপাদান, ফিনিশ, মাপ ও অন্যান্য তথ্য</strong> দেখে নিন, এবং প্রয়োজনে হোয়াটসঅ্যাপে জিজ্ঞেস করুন—সাজের কোন রঙের সঙ্গে কোনটি মানাবে।</p>
  <p><a class="button button-dark" href="/bn/shop/">সব জুয়েলারি দেখুন <span>→</span></a></p>
</div></section>`,
  en: `
<section class="editorial-hero full-width-hero occasion-hero"><img class="hero-bg" src="${IMG}" width="${IMGDIMS[0]}" height="${IMGDIMS[1]}" alt="Pahela Baishakh jewellery | eMarket247" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> Boishakh</p><h1>Pahela Baishakh Jewellery</h1><p>The red-and-white festival, a light morning, the colours of the fair — in Bengali tradition, jewellery is part of the celebration. Here is the heritage inspiration for a Boishakh look, and a simple path to pieces you'll love.</p><div class="hero-actions"><a class="button hero-btn-primary" href="/en/shop/">Shop Jewellery →</a><a class="button hero-btn-secondary" href="/en/occasions/">All Occasions</a></div></div></div></section>
<section class="occasion-detail wrap"><div><p class="eyebrow">The tradition</p><h2>Shankha, pola and nolok — Bengal's classic trio</h2><p>The most familiar lineage of Bengali jewellery begins with <strong>shankha (carved conch-shell bangles), pola (red bangles) and nolok (the gold bangle)</strong>. Paired with Pahela Baishakh's red-and-white dress, this trio remains one of the clearest signatures of a Bengali festival look.</p><p>Beyond it, Bengal's own craft traditions run deep — <strong>terracotta jewellery, hand-carved wood and bamboo pieces, woven jute, Dhokra brass casting</strong> and natural-seed malas — the crafts you meet at every Boishakh fair. These are not lesser alternatives; they are a world of their own beauty and heritage value.</p><p><strong>One honest note:</strong> eMarket247's current collection is centred on City Gold jewellery. Pieces in traditional materials (wood, bamboo, terracotta) are part of our inspiration and planning — to be added to the collection in future if we can source them authentically. For now, explore our current pieces styled for a Boishakh look.</p></div><div class="occasion-links"><a href="/en/categories/earrings/"><span>Earrings <small style="color:var(--muted);font-size:11px;display:block;">Made for a Boishakh look</small></span><b>→</b></a><a href="/en/categories/bangles/"><span>Bangles <small style="color:var(--muted);font-size:11px;display:block;">Paired with red and white</small></span><b>→</b></a><a href="/en/categories/necklaces/"><span>Necklaces <small style="color:var(--muted);font-size:11px;display:block;">Companions to the white sari</small></span><b>→</b></a><a href="/en/categories/pendants/"><span>Pendants <small style="color:var(--muted);font-size:11px;display:block;">A light Boishakh touch</small></span><b>→</b></a></div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">The Boishakh look</p>
  <h2>How to Choose Jewellery for Pahela Baishakh</h2>
  <p>The core of a Boishakh outfit is simple — <strong>the white sari or salwar with a red border and bindi</strong>. On that clean canvas, heavy jewellery flattens the whole look; <strong>light, defined designs</strong> work best. One pair of earrings, a slim necklace or matte-finish bangles — not more, just right.</p>
  <p>When viewing a product, decide from the <strong>materials, finish, measurements and other details provided</strong> — and if you're unsure which piece suits your colours, ask us on WhatsApp.</p>
  <p><a class="button button-dark" href="/en/shop/">Shop All Jewellery <span>→</span></a></p>
</div></section>`,
};

function freshLd(lang, seo) {
  const base = `https://emarket247.shop/${lang}/occasions/pahela-baishakh/`;
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${base}#webpage`, url: base, name: seo.ogTitle,
      isPartOf: { "@id": "https://emarket247.shop/#website" }, about: { "@id": "https://emarket247.shop/#organization" },
      inLanguage: lang, breadcrumb: { "@id": `${base}#breadcrumb` },
      primaryImageOfPage: `https://emarket247.shop${IMG}` },
    { "@type": "BreadcrumbList", "@id": `${base}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://emarket247.shop/${lang}/` },
      { "@type": "ListItem", position: 2, name: "Occasions", item: `https://emarket247.shop/${lang}/occasions/` },
      { "@type": "ListItem", position: 3, name: seo.h1, item: base } ] } ] };
  return `<script type="application/ld+json" data-emk="ld">${JSON.stringify(data)}</script>`;
}

// 1) Create the new pages from eid's shell
for (const lang of ["bn", "en"]) {
  const seo = LANGS[lang];
  const dest = `public_html/${lang}/occasions/pahela-baishakh/index.html`;
  let s = readFileSync(`public_html/${lang}/occasions/eid/index.html`, "utf8");
  // Replace main content
  const mainStart = s.indexOf('<main id="main">');
  const mainEnd = s.indexOf('</main>', mainStart);
  s = s.slice(0, mainStart + '<main id="main">'.length) + CONTENT[lang] + s.slice(mainEnd);
  // Head metadata
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`);
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${seo.ogTitle}$2`);
  s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  s = s.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1https://emarket247.shop/${lang}/occasions/pahela-baishakh/$2`);
  s = s.replace(/(<link rel="alternate" hreflang="${lang}" href=")[^"]*(")/, `$1https://emarket247.shop/${lang}/occasions/pahela-baishakh/$2`);
  // Replace the JSON-LD block entirely
  s = s.replace(/<script type="application\/ld\+json" data-emk="ld">[\s\S]*?<\/script>/, freshLd(lang, seo));
  writeFileSync(dest, s, "utf8");
  console.log(dest, "created");
}

// 2) Swap wedding/bridal hero images (wedding gets Bridal.webp 1600x900)
for (const lang of ["bn", "en"]) {
  let w = readFileSync(`public_html/${lang}/occasions/wedding/index.html`, "utf8");
  const old = /(<img class="hero-bg" src=")\/assets\/images\/editorial\/emarket247-bridal-occasion-editorial\.webp(" width=")\d+(" height=")\d+/;
  if (!old.test(w)) throw new Error("wedding hero pattern missed " + lang);
  w = w.replace(old, `$1/assets/images/editorial/Bridal.webp$2 1600$3 900`);
  writeFileSync(`public_html/${lang}/occasions/wedding/index.html`, w, "utf8");
  let b = readFileSync(`public_html/${lang}/occasions/bridal/index.html`, "utf8");
  const oldB = /(<img class="hero-bg" src=")\/assets\/images\/editorial\/Bridal\.webp(" width=")\d+(" height=")\d+/;
  if (!oldB.test(b)) throw new Error("bridal hero pattern missed " + lang);
  b = b.replace(oldB, `$1/assets/images/editorial/emarket247-bridal-occasion-editorial.webp$2 1280$3 1600`);
  writeFileSync(`public_html/${lang}/occasions/bridal/index.html`, b, "utf8");
  console.log(lang, "wedding/bridal heroes swapped");
}

// 3) Hub: add 8th tile + extend ItemList
for (const lang of ["bn", "en"]) {
  const f = `public_html/${lang}/occasions/index.html`;
  let s = readFileSync(f, "utf8");
  const cross = lang === "bn" ? "Pahela Baishakh" : "পহেলা বৈশাখ";
  const name = lang === "bn" ? "পহেলা বৈশাখের জুয়েলারি" : "Pahela Baishakh Jewellery";
  const desc = lang === "bn" ? "লাল-সাদার উৎসবে বাঙালি ঐতিহ্যের গহনার অনুপ্রেরণা।" : "Heritage Bengali inspiration for the red-and-white festival.";
  const tile = `<a href="/${lang}/occasions/pahela-baishakh/" class="category-tile has-media"><figure><img src="${IMG}" alt="eMarket247 — ${name}" width="${IMGDIMS[0]}" height="${IMGDIMS[1]}" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>${name}</h3><small>${cross} <b>↗</b></small></div><p class="category-desc">${desc}</p></div></a>`;
  const anchor = `<a href="/${lang}/occasions/bridal/"`;
  const idx = s.indexOf(anchor);
  if (idx === -1) throw new Error("hub bridal tile anchor missed " + lang);
  s = s.slice(0, idx) + tile + s.slice(idx);
  // Extend ItemList
  s = s.replace(/"numberOfItems":7,/, '"numberOfItems":8,');
  const item8 = `{"@type":"ListItem","position":8,"name":"${name}","url":"https://emarket247.shop/${lang}/occasions/pahela-baishakh/"}`;
  s = s.replace(/(\{"@type":"ItemList"[\s\S]*?"itemListElement":\[)([\s\S]*?)(\]\}\])/, (m, a, list, c) => a + list + "," + item8 + c);
  writeFileSync(f, s, "utf8");
  console.log(f, "tile added, items:", (s.match(/"position":8/) || []).length);
}
