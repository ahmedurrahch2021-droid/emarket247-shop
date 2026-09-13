/** Apply only the requirement-verified, non-commercial static storefront additions from the 2026-08-22 audit. */
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(project, "static-site");
const siteUrl = "https://emarket247.shop";
const categories = [
  ["rings", "Rings", "আংটি"],
  ["earrings", "Earrings", "কানের দুল"],
  ["necklaces", "Necklaces", "হার"],
  ["bracelets", "Bracelets", "ব্রেসলেট"],
  ["bangles", "Bangles", "চুড়ি"],
  ["pendants", "Pendants", "লকেট"],
  ["jewellery-sets", "Jewellery Sets", "জুয়েলারি সেট"],
  ["bridal-jewellery", "Bridal Jewellery", "ব্রাইডাল জুয়েলারি"],
  ["gift-jewellery", "Gift Jewellery", "উপহারের জুয়েলারি"],
];
const occasions = [
  ["puja", "Puja", "পূজা"],
  ["eid", "Eid", "ঈদ"],
  ["wedding", "Wedding", "বিয়ে"],
  ["anniversary", "Anniversary", "বার্ষিকী"],
  ["birthday", "Birthday", "জন্মদিন"],
  ["gifts", "Gifts", "উপহার"],
];

const attr = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const href = (lang, route = "") => `/${lang}/${route}`.replace(/\/$/, "/");

function renderHeader(lang) {
  const bn = lang === "bn";
  const categoryLinks = categories.map(([slug, en, bnName]) => `<li><a href="${href(lang, `categories/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`).join("");
  const occasionLinks = occasions.map(([slug, en, bnName]) => `<li><a href="${href(lang, `occasions/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`).join("");
  return `<header class="site-header">
  <div class="utility"><p>${bn ? "জুয়েলারি আবিষ্কার করুন, আপনার বিশেষ প্রতিটি মুহূর্তের জন্য।" : "Thoughtful jewellery discovery, built for every meaningful moment."}</p><a href="${href(lang, "contact/")}">${bn ? "সাহায্য লাগবে?" : "Need help choosing?"}</a></div>
  <div class="nav-wrap">
    <a class="brand" href="${href(lang)}" aria-label="eMarket247 Fashion & Jewellery"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="190" height="99" alt="eMarket247 Fashion & Jewellery"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><span></span><b>${bn ? "মেনু" : "Menu"}</b></button>
    <nav id="main-menu" class="main-nav" aria-label="${bn ? "প্রধান নেভিগেশন" : "Primary navigation"}">
      <a href="${href(lang)}">${bn ? "হোম" : "Home"}</a>
      <a href="${href(lang, "shop/")}">${bn ? "শপ" : "Shop"}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? "ক্যাটাগরি" : "Categories"}</button><div class="submenu"><p>${bn ? "জুয়েলারি খুঁজুন" : "Find your jewellery"}</p><ul>${categoryLinks}</ul><a class="menu-all" href="${href(lang, "categories/")}">${bn ? "সব ক্যাটাগরি" : "View all categories"} <span>→</span></a></div></div>
      <a href="${href(lang, "occasions/bridal/")}">${bn ? "ব্রাইডাল" : "Bridal"}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? "অনুষ্ঠান" : "Occasion"}</button><div class="submenu"><p>${bn ? "বিশেষ দিনের জন্য" : "For meaningful moments"}</p><ul>${occasionLinks}</ul><a class="menu-all" href="${href(lang, "occasions/")}">${bn ? "সব অনুষ্ঠান" : "View all occasions"} <span>→</span></a></div></div>
      <a href="${href(lang, "about/")}">${bn ? "আমাদের কথা" : "About Us"}</a>
      <a href="${href(lang, "contact/")}">${bn ? "যোগাযোগ" : "Contact"}</a>
    </nav>
    <div class="nav-actions"><a href="${lang === "en" ? "/bn/" : "/en/"}" class="lang-link" lang="${lang === "en" ? "bn" : "en"}">${lang === "en" ? "বাংলা" : "EN"}</a><button class="search-button" type="button" aria-label="${bn ? "সার্চ" : "Search"}" data-search-open>⌕</button><a class="bag-link" href="${href(lang, "shop/")}" aria-label="${bn ? "ব্যাগ" : "Bag"}">▢ <span>${bn ? "ব্যাগ" : "Bag"}</span><i>0</i></a></div>
  </div>
</header>
<div class="search-panel" aria-hidden="true"><button type="button" data-search-close aria-label="${bn ? "বন্ধ করুন" : "Close"}">×</button><form role="search"><label for="site-search">${bn ? "আপনি কী খুঁজছেন?" : "What are you looking for?"}</label><input id="site-search" type="search" placeholder="${bn ? "কানের দুল, চুড়ি, পূজা..." : "Earrings, bangles, Puja..."}" autocomplete="off"><p>${bn ? "সার্চ ফিচারটি অনুমোদিত কালেকশনের তথ্যের সাথে যুক্ত হবে।" : "Search will be connected to approved collection records."}</p></form></div>`;
}

function breadcrumb(lang, relativePath) {
  const parts = relativePath.split(path.sep).filter(Boolean).slice(0, -1);
  if (parts.length <= 1) return "";
  const bn = lang === "bn";
  const labels = {
    categories: bn ? "ক্যাটাগরি" : "Categories",
    occasions: bn ? "অনুষ্ঠান" : "Occasion",
    rings: bn ? "আংটি" : "Rings", earrings: bn ? "কানের দুল" : "Earrings", necklaces: bn ? "হার" : "Necklaces", bracelets: bn ? "ব্রেসলেট" : "Bracelets", bangles: bn ? "চুড়ি" : "Bangles", pendants: bn ? "লকেট" : "Pendants", "jewellery-sets": bn ? "জুয়েলারি সেট" : "Jewellery Sets", "bridal-jewellery": bn ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery", "gift-jewellery": bn ? "উপহারের জুয়েলারি" : "Gift Jewellery",
    puja: bn ? "পূজা" : "Puja", eid: bn ? "ঈদ" : "Eid", bridal: bn ? "ব্রাইডাল" : "Bridal", wedding: bn ? "বিয়ে" : "Wedding", anniversary: bn ? "বার্ষিকী" : "Anniversary", birthday: bn ? "জন্মদিন" : "Birthday", gifts: bn ? "উপহার" : "Gifts",
    shop: bn ? "শপ" : "Shop", guides: bn ? "গাইড" : "Guides", care: bn ? "যত্ন ও সহায়তা" : "Care & Support", about: bn ? "আমাদের কথা" : "About Us", contact: bn ? "যোগাযোগ" : "Contact", privacy: bn ? "গোপনীয়তা" : "Privacy", terms: bn ? "শর্তাবলি" : "Terms",
  };
  const crumbs = [`<li><a href="${href(lang)}">${bn ? "হোম" : "Home"}</a></li>`];
  const routes = parts.slice(1);
  routes.forEach((part, index) => {
    const current = index === routes.length - 1;
    const route = routes.slice(0, index + 1).join("/");
    const label = labels[part] || part;
    crumbs.push(current ? `<li><span aria-current="page">${label}</span></li>` : `<li><a href="${href(lang, `${route}/`)}">${label}</a></li>`);
  });
  return `<nav class="breadcrumb wrap" aria-label="${bn ? "পথনির্দেশ" : "Breadcrumb"}"><ol>${crumbs.join("")}</ol></nav>`;
}

function updateHead(html, lang, route, title, description) {
  const canonical = `${siteUrl}/${lang}/${route}`.replace(/\/$/, "/");
  const alternateEn = `${siteUrl}/en/${route}`.replace(/\/$/, "/");
  const alternateBn = `${siteUrl}/bn/${route}`.replace(/\/$/, "/");
  return html
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${alternateEn}">`)
    .replace(/<link rel="alternate" hreflang="bn" href="[^"]*">/, `<link rel="alternate" hreflang="bn" href="${alternateBn}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${attr(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${attr(description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`);
}

function occasionBody(lang, type) {
  const bn = lang === "bn";
  const copy = {
    hub: bn ? ["বিশেষ মুহূর্তের জন্য জুয়েলারি আবিষ্কার করুন।", "পূজা, ঈদ, বিয়ে, বার্ষিকী, জন্মদিন ও উপহারের জন্য আলাদা আবিষ্কারের পথ তৈরি করা হয়েছে। পণ্যের মিল, মূল্য ও প্রাপ্যতা কেবল যাচাইকৃত তথ্য পাওয়ার পর প্রকাশ করা হবে।"] : ["Jewellery discovery for meaningful moments.", "Explore distinct discovery paths for Puja, Eid, weddings, anniversaries, birthdays, and gifting. Product matches, pricing, and availability will only be published after verification."],
    eid: bn ? ["ঈদের জন্য নিজের মতো করে বেছে নিন।", "ঈদের জন্য পণ্যের মিল, মূল্য ও প্রাপ্যতা যাচাই শেষে প্রকাশ করা হবে। এখন ক্যাটাগরি ও উপহারের ভাবনা ধরে আপনার পছন্দের ধরনগুলো দেখুন।"] : ["Choose with ease for Eid.", "Eid product matches, pricing, and availability will be published after verification. For now, explore category and gifting ideas at your own pace."],
    wedding: bn ? ["বিয়ের দিনের ভাবনা, ধীরে দেখুন।", "বিয়ের জন্য নির্দিষ্ট পণ্যের তথ্য, মূল্য ও প্রাপ্যতা যাচাই শেষে প্রকাশ করা হবে। এখন ক্যাটাগরি ধরে আপনার পছন্দের ধরনগুলো দেখুন।"] : ["Explore wedding ideas with time to choose.", "Specific product detail, pricing, and availability for weddings will be published after verification. For now, explore the jewellery forms that suit your moment."],
    anniversary: bn ? ["বার্ষিকীর জন্য অর্থবহ একটি নির্বাচন।", "বার্ষিকীর জন্য পণ্যের মিল, মূল্য ও প্রাপ্যতা যাচাই শেষে প্রকাশ করা হবে। এখন উপহার ও ক্যাটাগরি ধরে পছন্দের ভাবনা আবিষ্কার করুন।"] : ["A considered choice for an anniversary.", "Anniversary product matches, pricing, and availability will be published after verification. For now, explore gifting and category ideas."],
    birthday: bn ? ["জন্মদিনের উপহারের ভাবনা, সহজভাবে।", "জন্মদিনের জন্য পণ্যের মিল, মূল্য ও প্রাপ্যতা যাচাই শেষে প্রকাশ করা হবে। এখন উপহার ও ক্যাটাগরি ধরে পছন্দের ভাবনা আবিষ্কার করুন।"] : ["A thoughtful starting point for birthday gifting.", "Birthday product matches, pricing, and availability will be published after verification. For now, explore gifting and category ideas."],
  }[type];
  if (type === "hub") {
    const links = occasions.map(([slug, en, bnName]) => `<a href="${href(lang, `occasions/${slug}/`)}"><span>${bn ? bnName : en}</span><b>→</b></a>`).join("");
    return `<section class="page-hero wrap"><div><p class="eyebrow">${bn ? "ইমার্কেট২৪৭ অনুষ্ঠান" : "eMarket247 occasions"}</p><h1>${copy[0]}</h1><p>${copy[1]}</p></div><figure><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" alt="${bn ? "ইমার্কেট২৪৭ জুয়েলারি এডিটোরিয়াল ছবি" : "eMarket247 jewellery editorial image"}"><figcaption>${bn ? "অনুষ্ঠান আবিষ্কার" : "Occasion discovery"}</figcaption></figure></section><section class="occasion-detail wrap"><div><p class="eyebrow">${bn ? "বিশেষ দিন" : "Meaningful moments"}</p><h2>${bn ? "উপলক্ষ ধরে আবিষ্কার করুন।" : "Discover by occasion."}</h2></div><div class="occasion-links">${links}</div></section>`;
  }
  const categoryLinks = categories.filter(([slug]) => ["earrings", "necklaces", "bangles", "jewellery-sets", "bridal-jewellery", "gift-jewellery"].includes(slug)).map(([slug, en, bnName]) => `<a href="${href(lang, `categories/${slug}/`)}"><span>${bn ? bnName : en}</span><b>→</b></a>`).join("");
  return `<section class="occasion-hero"><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" alt="${bn ? "ইমার্কেট২৪৭ জুয়েলারি এডিটোরিয়াল ছবি" : "eMarket247 jewellery editorial image"}"><div class="wrap"><p class="eyebrow">${bn ? "বিশেষ মুহূর্ত" : "For the moment"}</p><h1>${copy[0]}</h1><p>${copy[1]}</p><a class="button button-dark" href="${href(lang, "shop/")}">${bn ? "কালেকশন দেখুন" : "Explore collection"} →</a></div></section><section class="occasion-detail wrap"><div><p class="eyebrow">${bn ? "ক্যাটাগরি থেকে শুরু" : "Start by category"}</p><h2>${bn ? "ছবি, তথ্য ও পছন্দের জন্য আলাদা জায়গা।" : "Space for images, detail, and the right choice."}</h2></div><div class="occasion-links">${categoryLinks}</div></section>`;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

async function writeOccasionPage(lang, type, title, description) {
  const base = await readFile(path.join(source, lang, "occasions", "gifts", "index.html"), "utf8");
  const route = type === "hub" ? "occasions/" : `occasions/${type}/`;
  const breadcrumbPath = type === "hub" ? path.join(lang, "occasions", "index.html") : path.join(lang, "occasions", type, "index.html");
  const updated = updateHead(base, lang, route, title, description)
    .replace(/<nav class="breadcrumb wrap"[\s\S]*?<\/nav>/, breadcrumb(lang, breadcrumbPath))
    .replace(/<main id="main">[\s\S]*?<\/main>/, `<main id="main">${occasionBody(lang, type)}</main>`);
  const target = path.join(source, lang, ...(type === "hub" ? ["occasions", "index.html"] : ["occasions", type, "index.html"]));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, updated, "utf8");
}

async function writeBridalCategory(lang) {
  const bn = lang === "bn";
  const base = await readFile(path.join(source, lang, "categories", "rings", "index.html"), "utf8");
  const title = bn ? "ব্রাইডাল জুয়েলারি | eMarket247" : "Bridal Jewellery | eMarket247";
  const description = bn ? "ইমার্কেট২৪৭-এ ব্রাইডাল জুয়েলারি ক্যাটাগরি। যাচাইকৃত পণ্যের তথ্য প্রস্তুত হচ্ছে।" : "Bridal Jewellery category at eMarket247. Verified product information is being prepared.";
  const name = bn ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery";
  const body = `<main id="main"><section class="page-hero wrap"><div><p class="eyebrow">${bn ? "জুয়েলারি ক্যাটাগরি" : "Jewellery category"}</p><h1>${name}</h1><p>${bn ? "ব্রাইডাল জুয়েলারির নির্দিষ্ট পণ্যের নাম, বাংলা ও ইংরেজি বর্ণনা, মূল্য এবং প্রাপ্যতা যাচাই শেষে প্রকাশ করা হবে।" : "Specific bridal jewellery names, Bengali and English descriptions, pricing, and availability will be published after verification."}</p></div><figure><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" alt="${bn ? "ব্রাইডাল জুয়েলারির এডিটোরিয়াল ছবি" : "Bridal jewellery editorial image"}"><figcaption>${bn ? "ক্যাটাগরি প্রস্তুত হচ্ছে" : "Category record in preparation"}</figcaption></figure></section><section class="catalog-area wrap"><div class="catalog-toolbar"><div><p class="eyebrow">${bn ? "ক্যাটালগ স্ট্যাটাস" : "Catalog status"}</p><h2>${bn ? "সঠিক পণ্যের তথ্য প্রস্তুত হচ্ছে।" : "Product detail is being prepared responsibly."}</h2></div><button type="button" class="filter-stub" data-toast="${bn ? "ফিল্টার অনুমোদিত ক্যাটালগের সাথে যুক্ত হবে।" : "Filters will be connected to approved catalog records."}">☷ ${bn ? "ফিল্টার" : "Filters"}</button></div><div class="product-grid" data-catalog data-category="bridal-jewellery" data-empty="${bn ? "এই ক্যাটাগরির অনুমোদিত পণ্য প্রস্তুত হচ্ছে।" : "Approved products for this category are being prepared."}"></div></section></main>`;
  const updated = updateHead(base, lang, "categories/bridal-jewellery/", title, description)
    .replace(/<nav class="breadcrumb wrap"[\s\S]*?<\/nav>/, breadcrumb(lang, path.join(lang, "categories", "bridal-jewellery", "index.html")))
    .replace(/<main id="main">[\s\S]*?<\/main>/, body);
  const target = path.join(source, lang, "categories", "bridal-jewellery", "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, updated, "utf8");
}

const files = await walk(source);
for (const file of files) {
  const relative = path.relative(source, file);
  const firstPart = relative.split(path.sep)[0];
  if (!["en", "bn"].includes(firstPart)) continue;
  const lang = firstPart;
  let html = await readFile(file, "utf8");
  html = html.replace(/<header class="site-header">[\s\S]*?<\/header>\s*<div class="search-panel"[\s\S]*?<\/div>/, renderHeader(lang));
  const isLanguageHomepage = relative === `${lang}${path.sep}index.html`;
  if (isLanguageHomepage) html = html.replace(/<nav class="breadcrumb wrap"[\s\S]*?<\/nav>/, "");
  else if (!html.includes('class="breadcrumb')) html = html.replace('<main id="main">', `${breadcrumb(lang, relative)}<main id="main">`);
  await writeFile(file, html, "utf8");
}

for (const lang of ["en", "bn"]) {
  const bn = lang === "bn";
  await writeOccasionPage(lang, "hub", bn ? "অনুষ্ঠান | eMarket247" : "Occasions | eMarket247", bn ? "পূজা, বিয়ে, বার্ষিকী, জন্মদিন ও উপহারের জন্য ইমার্কেট২৪৭ জুয়েলারি আবিষ্কার।" : "Discover eMarket247 jewellery ideas for Puja, weddings, anniversaries, birthdays, and gifting.");
  await writeOccasionPage(lang, "eid", bn ? "ঈদের জুয়েলারি | eMarket247" : "Eid Jewellery | eMarket247", bn ? "ইমার্কেট২৪৭-এ ঈদের জুয়েলারি আবিষ্কারের পথ।" : "A considered eMarket247 discovery path for Eid jewellery.");
  await writeOccasionPage(lang, "wedding", bn ? "বিয়ের জুয়েলারি | eMarket247" : "Wedding Jewellery | eMarket247", bn ? "ইমার্কেট২৪৭-এ বিয়ের জুয়েলারি আবিষ্কারের পথ।" : "A considered eMarket247 discovery path for wedding jewellery.");
  await writeOccasionPage(lang, "anniversary", bn ? "বার্ষিকীর জুয়েলারি | eMarket247" : "Anniversary Jewellery | eMarket247", bn ? "ইমার্কেট২৪৭-এ বার্ষিকীর জুয়েলারি আবিষ্কারের পথ।" : "A considered eMarket247 discovery path for anniversary jewellery.");
  await writeOccasionPage(lang, "birthday", bn ? "জন্মদিনের উপহারের জুয়েলারি | eMarket247" : "Birthday Gift Jewellery | eMarket247", bn ? "ইমার্কেট২৪৭-এ জন্মদিনের উপহারের জুয়েলারি আবিষ্কারের পথ।" : "A considered eMarket247 discovery path for birthday gift jewellery.");
  await writeBridalCategory(lang);
}

for (const lang of ["en", "bn"]) {
  const categoryIndex = path.join(source, lang, "categories", "index.html");
  let html = await readFile(categoryIndex, "utf8");
  const bn = lang === "bn";
  const tile = `<a href="/${lang}/categories/bridal-jewellery/"><span>${bn ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery"}</span><small>${bn ? "Bridal Jewellery" : "ব্রাইডাল জুয়েলারি"} →</small></a>`;
  const categoryGrid = html.match(/<div class="category-grid">([\s\S]*?)<\/div><\/section><\/main>/);
  if (categoryGrid && !categoryGrid[1].includes('categories/bridal-jewellery/')) {
    html = html.replace(categoryGrid[0], categoryGrid[0].replace('</div></section></main>', `${tile}</div></section></main>`));
  }
  await writeFile(categoryIndex, html, "utf8");
}

let css = await readFile(path.join(source, "assets", "css", "site.css"), "utf8");
if (!css.includes("AUDITED_STATIC_FIXES")) {
  css += `\n/* AUDITED_STATIC_FIXES: navigation, breadcrumbs, and zero-claim discovery routes. */\n.main-nav{gap:clamp(12px,1.35vw,24px)}.breadcrumb{padding-top:14px;padding-bottom:0}.breadcrumb ol{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none;color:var(--muted);font-size:10px;letter-spacing:.04em;text-transform:uppercase}.breadcrumb li+li:before{content:"/";margin-right:8px;color:var(--line)}.breadcrumb a{border-bottom:1px solid transparent}.breadcrumb a:hover,.breadcrumb a:focus{border-color:var(--red)}@media(max-width:900px){.breadcrumb{padding-top:12px}.breadcrumb ol{font-size:9px}}\n`;
  await writeFile(path.join(source, "assets", "css", "site.css"), css, "utf8");
}

let js = await readFile(path.join(source, "assets", "js", "site.js"), "utf8");
js = js.replace('"jewellery-sets": language === "bn" ? "জুয়েলারি সেট" : "Jewellery Sets", "gift-jewellery"', '"jewellery-sets": language === "bn" ? "জুয়েলারি সেট" : "Jewellery Sets", "bridal-jewellery": language === "bn" ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery", "gift-jewellery"');
await writeFile(path.join(source, "assets", "js", "site.js"), js, "utf8");

let sitemap = await readFile(path.join(source, "sitemap.xml"), "utf8");
const routes = [
  ...["en", "bn"].flatMap((lang) => [
    `/${lang}/occasions/`, `/${lang}/occasions/eid/`, `/${lang}/occasions/wedding/`, `/${lang}/occasions/anniversary/`, `/${lang}/occasions/birthday/`, `/${lang}/categories/bridal-jewellery/`,
  ]),
];
for (const route of routes) {
  if (!sitemap.includes(`<loc>${siteUrl}${route}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${siteUrl}${route}</loc></url>\n</urlset>`);
}
await writeFile(path.join(source, "sitemap.xml"), sitemap, "utf8");

await cp(path.join(source, "en", "index.html"), path.join(source, "index.html"));
console.log("Applied audited static-site fixes: Occasion routes, Bridal Jewellery category, shared navigation, breadcrumbs, and sitemap.");
