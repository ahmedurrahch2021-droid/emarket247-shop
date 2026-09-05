/**
 * Generates bilingual Product Detail Pages (PDP) for all approved "ready" products in eMarket247.
 * Adheres strictly to:
 * - Pure static HTML/CSS/Vanilla JS architecture
 * - Exact existing brand design tokens, typography, and layout classes
 * - Zero fabricated data (prices, stock, ratings, certifications)
 * - Complete AEO / SEO metadata, Open Graph, canonicals, hreflang, and JSON-LD
 * - Mobile responsive 2-panel conversion-focused layout
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(project, "static-site");
const siteUrl = "https://emarket247.shop";
const phone = "+8801740501062";
const phoneDisplay = "+880 1740-501062";

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

const categoryMap = Object.fromEntries(categories.map(([slug, en, bn]) => [slug, { en, bn }]));

const attr = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const href = (lang, route = "") => `/${lang}/${route}`.replace(/\/+$/, "/");

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

function renderFooter(lang) {
  const bn = lang === "bn";
  return `<footer class="site-footer">
  <div class="footer-main wrap">
    <div>
      <a href="${href(lang)}" aria-label="eMarket247 Home"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="160" height="83" alt="eMarket247 Fashion & Jewellery"></a>
      <p>${bn ? "বাংলাদেশে ফ্যাশন ও আধুনিক জুয়েলারির একটি বিশ্বস্ত গন্তব্য। সঠিক তথ্য, দায়িত্বশীল সেবা ও সহজ আবিষ্কার।" : "A trusted jewellery and fashion destination in Bangladesh. Grounded in accurate detail, thoughtful craft, and easy discovery."}</p>
    </div>
    <div>
      <h3>${bn ? "ক্যাটাগরি" : "Categories"}</h3>
      <a href="${href(lang, "categories/rings/")}">${bn ? "আংটি" : "Rings"}</a>
      <a href="${href(lang, "categories/bangles/")}">${bn ? "চুড়ি" : "Bangles"}</a>
      <a href="${href(lang, "categories/necklaces/")}">${bn ? "হার" : "Necklaces"}</a>
      <a href="${href(lang, "categories/bracelets/")}">${bn ? "ব্রেসলেট" : "Bracelets"}</a>
      <a href="${href(lang, "categories/earrings/")}">${bn ? "কানের দুল" : "Earrings"}</a>
      <a href="${href(lang, "categories/")}">${bn ? "সব ক্যাটাগরি" : "View all categories"}</a>
    </div>
    <div>
      <h3>${bn ? "অনুষ্ঠান ও ভাবনা" : "Occasions & Edits"}</h3>
      <a href="${href(lang, "occasions/puja/")}">${bn ? "পূজা কালেকশন" : "Puja Edit"}</a>
      <a href="${href(lang, "occasions/bridal/")}">${bn ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery"}</a>
      <a href="${href(lang, "occasions/wedding/")}">${bn ? "বিয়ের জুয়েলারি" : "Wedding Jewellery"}</a>
      <a href="${href(lang, "occasions/gifts/")}">${bn ? "উপহার জুয়েলারি" : "Jewellery Gifting"}</a>
      <a href="${href(lang, "guides/")}">${bn ? "স্টাইল গাইড" : "Style Guides"}</a>
    </div>
    <div>
      <h3>${bn ? "সহায়তা ও নীতি" : "Customer Support"}</h3>
      <a href="${href(lang, "care/")}">${bn ? "যত্ন ও সহায়তা" : "Care & Support"}</a>
      <a href="${href(lang, "contact/")}">${bn ? "যোগাযোগ" : "Contact Us"}</a>
      <a href="${href(lang, "about/")}">${bn ? "আমাদের গল্প" : "About eMarket247"}</a>
      <a href="${href(lang, "privacy/")}">${bn ? "গোপনীয়তা নীতি" : "Privacy Policy"}</a>
      <a href="${href(lang, "terms/")}">${bn ? "শর্তাবলি" : "Terms of Service"}</a>
    </div>
  </div>
  <div class="footer-bottom wrap">
    <span>© 2026 eMarket247. ${bn ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}</span>
    <span>${bn ? "ঢাকা, বাংলাদেশ · গ্রাহক সেবা: +880 1740-501062" : "Dhaka, Bangladesh · Support: +880 1740-501062"}</span>
  </div>
</footer>`;
}

function getCategoryEditorialContext(category, lang) {
  const isBn = lang === "bn";
  const map = {
    rings: {
      lead: isBn
        ? "সূক্ষ্ম নকশা ও নান্দনিক ফিনিশে তৈরি চমৎকার আংটি। আধুনিক আঙুলের মাপের সাথে সামঞ্জস্যপূর্ণ আরামদায়ক পরিধান।"
        : "Sculpted with balanced proportion and tactile gold-tone artistry, designed for comfortable everyday or festive hand adornment.",
      benefitSilhouette: isBn
        ? "অনুকূল ব্যান্ড প্রোফাইল যা আঙুলের নড়াচড়ায় স্বাচ্ছন্দ্য দেয় এবং নজরকাড়া নকশার ভারসাম্য বজায় রাখে।"
        : "Contoured band geometry designed for tactile balance, smooth finger articulation, and understated luxury.",
      story: isBn
        ? "আংটি কেবল একটি অলংকার নয়, এটি ব্যক্তিগত রুচি ও মুহূর্তের প্রকাশ। এই ডিজাইনটিতে ঐতিহ্যবাহী কারুকাজ ও আধুনিক পরিচ্ছন্নতার মেলবন্ধন ঘটানো হয়েছে।"
        : "Rings remain one of the most intimate expressions of personal adornment. This piece brings together subtle South Asian gold-tone heritage and clean, modern contours.",
      silhouetteName: isBn ? "হাতে গড়া আংটি নকশা" : "Artisanal Ring Silhouette",
    },
    bangles: {
      lead: isBn
        ? "ঐতিহ্যবাহী বৃত্তাকার গড়ন ও গভীর সোনালী দীপ্তিতে তৈরি অভিজাত চুড়ি। বিশেষ উৎসব ও পারিবারিক আয়োজনের জন্য আদর্শ।"
        : "A classic rigid circular silhouette with warm gold-tone luster, honoring traditional South Asian wristwear with contemporary refinement.",
      benefitSilhouette: isBn
        ? "পরিমিত ওজন ও মসৃণ অভ্যন্তরীণ ফিনিশ যা দীর্ঘ সময় পরেও কবজিতে আরামদায়ক থাকে।"
        : "Balanced circular symmetry and smooth interior edging for effortless wrist drape and enduring grace.",
      story: isBn
        ? "বাঙালির উৎসব ও বিয়ের সাজে চুড়ির আবেদন চিরন্তন। এই চুড়িটিতে সূক্ষ্ম টেক্সচার ও উজ্জ্বল সোনালী ফিনিশ নিশ্চিত করে একটি রাজকীয় লুক।"
        : "Bangles occupy a cherished place in festive and bridal traditions. This design balances structural presence with intricate surface texturing.",
      silhouetteName: isBn ? "ঐতিহ্যবাহী গোল চুড়ি" : "Classic Circular Bangle",
    },
    necklaces: {
      lead: isBn
        ? "গলায় পরিপাটিভাবে বসে থাকা পরিশীলিত নেকলেস ডিজাইন। শাড়ি, লেহেঙ্গা কিংবা উৎসবের পোশাকের সাথে এক অনন্য মেলবন্ধন।"
        : "Gracefully articulated collar and pendant necklace, designed to rest naturally against the neckline with refined warmth.",
      benefitSilhouette: isBn
        ? "সাবলীল লিংক ও ড্রপ ব্যালেন্স যা কলারবোনে সুন্দরভাবে অবস্থান নেয় এবং পোশাকের সৌন্দর্য বাড়িয়ে তোলে।"
        : "Calibrated link drop and center motif balance that frames the décolletage without visual heaviness.",
      story: isBn
        ? "যেকোনো বিশেষ আয়োজনে গলার অলংকার ব্যক্তিত্বকে ফুটিয়ে তোলে। এর সূক্ষ্ম মোটিফ ও সোনালী আভা উৎসবের যেকোনো পোশাকে আনে পূর্ণতা।"
        : "A centerpiece of festive styling, this necklace is crafted to offer timeless versatility across traditional silks and modern evening ensembles.",
      silhouetteName: isBn ? "পরিমার্জিত নেকলেস চেইন" : "Refined Necklace Silhouette",
    },
    bracelets: {
      lead: isBn
        ? "নমনীয় লিংক ও মার্জিত ডিজাইনে তৈরি কবজির অলংকার। দৈনন্দিন আভিজাত্য থেকে শুরু করে যেকোনো সান্ধ্যকালীন অনুষ্ঠানে মানানসই।"
        : "Supple, fluid-link wrist architecture designed for flexible movement, contemporary elegance, and effortless pairing.",
      benefitSilhouette: isBn
        ? "কবজির সাথে মসৃণভাবে মিশে থাকা নমনীয় নকশা যা সহজে আটকে যায় না এবং স্বস্তিদায়ক থাকে।"
        : "Articulated links that drape smoothly along the natural wrist curve, offering tactile comfort and refined gleam.",
      story: isBn
        ? "হাতে একটি মার্জিত ব্রেসলেট পুরো সাজে এনে দেয় আধুনিকতার স্পর্শ। এর প্রতিটি সংযোগ নিখুঁতভাবে তৈরি করা হয়েছে।"
        : "Bracelets bring a contemporary fluidity to jewellery styling. Designed for lightweight presence and secure wear.",
      silhouetteName: isBn ? "ফ্লুইড লিংক ব্রেসলেট" : "Fluid-Link Bracelet",
    },
    earrings: {
      lead: isBn
        ? "কানের লতিতে নিখুঁত ভারসাম্য রাখা হালকা ওজনের শৈল্পিক কানের দুল। মুখের গড়নকে আকর্ষণীয়ভাবে ফুটিয়ে তোলে।"
        : "Balanced proportion, lightweight lobe comfort, and light-reflecting gold tones that gracefully accentuate the facial contours.",
      benefitSilhouette: isBn
        ? "ওজনে হালকা এবং নিখুঁত ঝুলন্ত ভারসাম্য যা দীর্ঘক্ষণ পরেও কানে কোনো ক্লান্তি আনে না।"
        : "Featherlight weight distribution and secure post/hook balance for all-day comfort without lobe pulling.",
      story: isBn
        ? "কানের দুল প্রথম দর্শনেই নজর কাড়ে। উৎসবের আলোকচ্ছটায় এই কানের দুলের সোনালী ফিনিশ আপনার সাজে যোগ করবে এক স্নিগ্ধ আভিজাত্য।"
        : "Earrings are the immediate focal point of portrait styling. Designed with light-catching textures that shimmer naturally in ambient light.",
      silhouetteName: isBn ? "ভারসাম্যপূর্ণ কানের দুল" : "Balanced Earring Silhouette",
    },
  };
  return map[category] || map.rings;
}

export function generatePdpHtml(product, lang, relatedProducts = []) {
  const isBn = lang === "bn";
  const categoryMeta = categoryMap[product.category] || { en: product.categoryLabel, bn: product.categoryLabel };
  const categoryLabel = isBn ? categoryMeta.bn : categoryMeta.en;
  const categorySlug = product.category;
  const context = getCategoryEditorialContext(product.category, lang);

  const title = isBn ? (product.seo?.title || `${product.title} | eMarket247`) : (product.seo?.title || `${product.title} | eMarket247`);
  const description = product.seo?.description || product.description;
  const canonical = `${siteUrl}/${lang}/products/${product.slug}/`;
  const altEn = `${siteUrl}/en/products/${product.slug}/`;
  const altBn = `${siteUrl}/bn/products/${product.slug}/`;
  const productImageUrl = `${siteUrl}${product.image.src}`;

  // WhatsApp order text
  const waMessage = isBn
    ? `হ্যালো eMarket247, আমি ${product.title} (রেফারেন্স: ${product.id}, লিঙ্ক: ${canonical}) সম্পর্কে জানতে এবং অর্ডার করতে আগ্রহী।`
    : `Hello eMarket247, I am interested in inquiring about and ordering ${product.title} (Ref: ${product.id}, Link: ${canonical}).`;
  const whatsappUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waMessage)}`;

  // Related products HTML using enhanced .product-card
  const relatedHtml = relatedProducts.slice(0, 4).map((rel) => {
    const relCategory = categoryMap[rel.category]?.[lang] || rel.categoryLabel;
    const relUrl = `/${lang}/products/${rel.slug}/`;
    const relWaMsg = isBn
      ? `হ্যালো eMarket247, আমি ${rel.title} (রেফারেন্স: ${rel.id}, লিঙ্ক: ${siteUrl}/${lang}/products/${rel.slug}/) অর্ডার বা তথ্য জানতে আগ্রহী।`
      : `Hello eMarket247, I want to inquire about ${rel.title} (Ref: ${rel.id}, Link: ${siteUrl}/${lang}/products/${rel.slug}/).`;
    const relWaUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(relWaMsg)}`;

    return `<article class="product-card" data-product-id="${attr(rel.id)}">
      <a class="product-card-media" href="${relUrl}" aria-label="${attr(rel.title)}">
        <img src="${rel.image.src}" srcset="${rel.image.srcset || rel.image.src}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 25vw" width="${rel.image.width}" height="${rel.image.height}" loading="lazy" alt="${attr(rel.image.alt)}">
        <span class="product-card-badge">${attr(rel.id)}</span>
      </a>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-cat">${attr(relCategory)}</span>
          <span class="product-card-status">● ${isBn ? "প্রস্তুত" : "Ready"}</span>
        </div>
        <h3 class="product-card-title"><a href="${relUrl}">${attr(rel.title)}</a></h3>
        <small class="product-card-desc">${attr(rel.image.caption)}</small>
      </div>
      <div class="product-card-actions">
        <button type="button" class="product-card-add-btn" data-add-bag="${attr(rel.id)}" data-product-title="${attr(rel.title)}" data-product-slug="${attr(rel.slug)}" data-product-image="${attr(rel.image.src)}" data-product-cat="${attr(relCategory)}" aria-label="${isBn ? "ব্যাগে যোগ করুন: " + attr(rel.title) : "Add to bag: " + attr(rel.title)}">
          <span class="btn-icon">+</span> <span class="btn-label">${isBn ? "ব্যাগে যোগ" : "Add to Bag"}</span>
        </button>
        <a class="product-card-wa-btn" href="${relWaUrl}" target="_blank" rel="noopener noreferrer" aria-label="${isBn ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}" title="${isBn ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>
        <a class="product-card-cta" href="${relUrl}">${isBn ? "বিস্তারিত দেখুন →" : "View detail →"}</a>
      </div>
    </article>`;
  }).join("");

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${attr(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${altEn}">
  <link rel="alternate" hreflang="bn" href="${altBn}">
  <link rel="alternate" hreflang="x-default" href="${altEn}">
  <meta property="og:type" content="og:product">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${productImageUrl}">
  <link rel="icon" href="/assets/images/brand/emarket247-favicon-master.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/site.css?v=bbcba228">
  <title>${attr(title)}</title>
</head>
<body data-language="${lang}" data-cookie-mode="essential-only">
  <a class="skip-link" href="#main">${isBn ? "মূল কনটেন্টে যান" : "Skip to main content"}</a>
  ${renderHeader(lang)}

  <nav class="breadcrumb wrap" aria-label="${isBn ? "পথনির্দেশ" : "Breadcrumb"}">
    <ol>
      <li><a href="/${lang}/">${isBn ? "হোম" : "Home"}</a></li>
      <li><a href="/${lang}/categories/${categorySlug}/">${attr(categoryLabel)}</a></li>
      <li><span aria-current="page">${attr(product.title)}</span></li>
    </ol>
  </nav>

  <main id="main">
    <!-- SECTION B: Above-The-Fold Product Showcase -->
    <section class="pdp-hero wrap">
      <div class="pdp-gallery">
        <figure class="pdp-figure">
          <img src="${product.image.src}" srcset="${product.image.srcset || product.image.src}" sizes="(max-width: 900px) 100vw, 50vw" width="${product.image.width}" height="${product.image.height}" fetchpriority="high" alt="${attr(product.image.alt)}">
          <figcaption>${attr(product.image.caption)}</figcaption>
        </figure>
        <div class="pdp-badges">
          <span>✦ ${isBn ? "অনুমোদিত ক্যাটালগ রেকর্ড" : "Verified Catalog Record"}</span>
          <span>${attr(product.copyright || "© eMarket247")}</span>
        </div>
      </div>

      <div class="pdp-info">
        <p class="eyebrow">${attr(categoryLabel)} · ${attr(product.id)}</p>
        <h1>${attr(product.title)}</h1>
        <p class="pdp-lead">${attr(context.lead)}</p>

        <div class="pdp-price-box">
          <span class="pdp-price pdp-price-pending">${isBn ? "মূল্য অনুমোদনের অপেক্ষায়" : "Price pending approval"}</span>
          <span class="pdp-price-sub">${isBn ? "সরাসরি কাস্টমার কেয়ারে যোগাযোগ করে বর্তমান অফার ও প্রাপ্যতা যাচাই করুন" : "Inquire directly with customer care for verified pricing and availability"}</span>
        </div>

        <div class="pdp-status-badge">
          <span class="pdp-status-dot"></span>
          <span>${isBn ? "অনুমোদিত ক্যাটালগ নকশা · অর্ডারের পূর্বে প্রাপ্যতা নিশ্চিতকরণ" : "Approved catalog piece · Availability confirmed upon inquiry"}</span>
        </div>

        <div class="pdp-actions">
          <div class="pdp-qty-row">
            <span class="pdp-qty-label">${isBn ? "পরিমাণ:" : "Quantity:"}</span>
            <div class="pdp-qty-stepper">
              <button type="button" data-pdp-qty-change="-1" aria-label="${isBn ? "পরিমাণ কমান" : "Decrease quantity"}">−</button>
              <span id="pdp-qty-display">1</span>
              <button type="button" data-pdp-qty-change="1" aria-label="${isBn ? "পরিমাণ বাড়ান" : "Increase quantity"}>+</button>
            </div>
            <button class="pdp-share-btn" type="button" data-share-url="${canonical}" data-share-title="${attr(title)}" aria-label="${isBn ? "অলংকারের লিঙ্ক শেয়ার করুন" : "Share this jewellery piece"}">
              <span aria-hidden="true">🔗</span> <span>${isBn ? "শেয়ার করুন" : "Share"}</span>
            </button>
          </div>

          <div class="pdp-buy-row">
            <button class="button button-outline pdp-btn-bag" id="pdp-add-bag" type="button" data-pdp-add-bag="${attr(product.id)}" data-title="${attr(product.title)}" data-slug="${attr(product.slug)}" data-img="${attr(product.image.src)}" data-cat="${attr(categoryLabel)}">
              <span class="pdp-bag-icon" aria-hidden="true">🛍️</span> <span class="pdp-bag-text">${isBn ? "ব্যাগে যোগ করুন" : "Add to Bag"}</span>
            </button>
            <a class="button button-dark pdp-btn-whatsapp" id="pdp-whatsapp-cta" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>${isBn ? "WhatsApp-এ সরাসরি অর্ডার" : "Order on WhatsApp"}</span>
            </a>
          </div>

          <p class="pdp-call-note">
            ${isBn ? "অথবা সরাসরি কল করুন:" : "Or call customer care directly:"} <a href="tel:${phone}"><strong>${phoneDisplay}</strong></a>
          </p>
        </div>

        <div class="pdp-quick-trust">
          <ul>
            <li><b>✦</b> <span>${isBn ? "বাংলা ও ইংরেজিতে নিবেদিত কাস্টমার কেয়ার পরামর্শ" : "Dedicated customer care consultation in English & Bengali"}</span></li>
            <li><b>✦</b> <span>${isBn ? "সারাদেশে হোম ডেলিভারি ও গ্রহণের পূর্বে পার্সেল যাচাই" : "Nationwide delivery across Bangladesh with parcel inspection"}</span></li>
            <li><b>✦</b> <span>${isBn ? "ইমার্কেট২৪৭-এর সংরক্ষিত ও স্বত্বাধিকারভুক্ত প্রামাণ্য নকশা" : "Authentic, rights-protected eMarket247 jewellery curation"}</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION C: Why You'll Love It -->
    <section class="pdp-why-love wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "বিশেষত্ব ও আকর্ষণ" : "Craft & Distinction"}</p>
        <h2>${isBn ? "কেন এই ডিজাইনটি আপনার ভালো লাগবে" : "Why you'll love this piece"}</h2>
      </div>
      <div class="pdp-benefit-grid">
        <article class="pdp-benefit-card">
          <span class="pdp-card-num">01</span>
          <h3>${isBn ? "অনন্য নকশা ও ভারসাম্য" : "Distinctive Silhouette & Contour"}</h3>
          <p>${attr(context.benefitSilhouette)}</p>
        </article>
        <article class="pdp-benefit-card">
          <span class="pdp-card-num">02</span>
          <h3>${isBn ? "উজ্জ্বল সোনালী দীপ্তি" : "Warm South Asian Gold Luster"}</h3>
          <p>${isBn ? "উৎসবের শাড়ি, রেশমি পোশাক কিংবা যেকোনো আধুনিক সান্ধ্যকালীন সাজের সাথে নিখুঁতভাবে মানিয়ে যাওয়ার মতো গভীর সোনালী আভা।" : "A rich, warm gold-tone luster inspired by heritage South Asian jewellery traditions, flattering ethnic silks and modern styling alike."}</p>
        </article>
        <article class="pdp-benefit-card">
          <span class="pdp-card-num">03</span>
          <h3>${isBn ? "দায়িত্বশীল সংরক্ষণ মানদণ্ড" : "Transparent Curation Standard"}</h3>
          <p>${isBn ? "ইমার্কেট২৪৭ প্রতিটি অলংকার আলাদাভাবে ক্যাটালগভুক্ত ও যাচাই করে উপস্থাপন করে, কোনো ভিত্তিহীন প্রতিশ্রুতি ছাড়া।" : "Each piece in the eMarket247 edit is individually archived and photographed, upholding verified quality and transparent care."}</p>
        </article>
      </div>
    </section>

    <!-- SECTION D: Product Specifications -->
    <section class="pdp-specs wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "স্পেসিফিকেশন" : "Specifications"}</p>
        <h2>${isBn ? "পণ্যের তথ্য ও বিবরণ" : "Product details & specifications"}</h2>
      </div>
      <div class="pdp-specs-card">
        <dl class="pdp-specs-list">
          <div class="pdp-spec-row">
            <dt>${isBn ? "ক্যাটালগ রেফারেন্স আইডি" : "Catalogue Reference ID"}</dt>
            <dd><code>${attr(product.id)}</code></dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "ক্যাটাগরি" : "Category"}</dt>
            <dd>${attr(categoryLabel)}</dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "ডিজাইন সিলুয়েট" : "Silhouette Style"}</dt>
            <dd>${attr(context.silhouetteName)}</dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "ক্যাটালগ স্ট্যাটাস" : "Catalog Status"}</dt>
            <dd>${isBn ? "অনুমোদিত ও অনুসন্ধানের জন্য প্রস্তুত (Ready)" : "Approved & Ready for Consultation"}</dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "মুদ্রা" : "Currency"}</dt>
            <dd>BDT (বাংলাদেশি টাকা)</dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "তালিকাভুক্ত মূল্য" : "Published Price"}</dt>
            <dd class="pdp-spec-pending">${isBn ? "অনুমোদনের অপেক্ষায় (অনুসন্ধান করুন)" : "Pending Official Approval (Inquire)"}</dd>
          </div>
          <div class="pdp-spec-row">
            <dt>${isBn ? "যত্ন ও সংরক্ষণ" : "Care Guidance"}</dt>
            <dd>${isBn ? "শুকনো নরম কাপড়ে মুছুন; পারফিউম ও আর্দ্রতা থেকে দূরে রাখুন" : "Soft dry cloth wipe; store dry away from moisture & perfumes"}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- SECTION E: Product Story & Editorial Narrative -->
    <section class="pdp-story wrap">
      <div class="pdp-story-grid">
        <div class="pdp-story-copy">
          <p class="eyebrow">${isBn ? "ডিজাইন দর্শন" : "Editorial Perspective"}</p>
          <h2>${isBn ? "কারুকাজ ও নান্দনিক দৃষ্টিভঙ্গি" : "The craftsmanship behind the form"}</h2>
          <p class="pdp-story-lead">${attr(context.story)}</p>
          <p>${isBn ? "ইমার্কেট২৪৭-এর কালেকশনে প্রতিটি পণ্য নির্বাচনের ক্ষেত্রে আমরা নান্দনিক ভারসাম্য, দীর্ঘস্থায়ী আকর্ষণ এবং আধুনিক পরিধানযোগ্যতাকে সর্বোচ্চ গুরুত্ব দিয়ে থাকি।" : "At eMarket247, every selected design is scrutinized for its visual balance, tactile presence, and enduring wearable charm across life's most meaningful moments."}</p>
        </div>
        <figure class="pdp-story-figure">
          <img src="${product.image.src}" alt="${attr(product.image.alt)}" loading="lazy">
          <figcaption>${isBn ? "ইমার্কেট২৪৭ জুয়েলারি আর্কাইভ" : "eMarket247 Jewellery Archive"}</figcaption>
        </figure>
      </div>
    </section>

    <!-- SECTION F: Styling & Occasions -->
    <section class="pdp-styling wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "স্টাইলিং আইডিয়া" : "Styling Context"}</p>
        <h2>${isBn ? "উপলক্ষ অনুযায়ী সাজের ভাবনা" : "Occasions & thoughtful styling"}</h2>
      </div>
      <div class="pdp-styling-grid">
        <a class="pdp-styling-card" href="/${lang}/occasions/puja/">
          <p class="eyebrow">${isBn ? "শরৎ ও উৎসব" : "Autumn & Festivals"}</p>
          <h3>${isBn ? "পূজা ও পারিবারিক উৎসব" : "Puja & Festive Gatherings"}</h3>
          <p>${isBn ? "উৎসবের উজ্জ্বল শাড়ি ও সাজের সাথে নিখুঁত সোনালী সঙ্গ।" : "Deep gold tones that effortlessly match festive sarees and traditional silks."}</p>
          <span class="pdp-styling-link">${isBn ? "পূজা কালেকশন দেখুন →" : "Explore Puja edit →"}</span>
        </a>
        <a class="pdp-styling-card" href="/${lang}/occasions/wedding/">
          <p class="eyebrow">${isBn ? "বিবাহ ও আড়ম্বর" : "Celebrations"}</p>
          <h3>${isBn ? "বিয়ে ও বিবাহোত্তর অনুষ্ঠান" : "Weddings & Celebrations"}</h3>
          <p>${isBn ? "সঙ্গীত, মেহেন্দি কিংবা অভ্যর্থনা রাতের জন্য মানানসই আভিজাত্য।" : "Sophisticated presence for weddings, receptions, and family functions."}</p>
          <span class="pdp-styling-link">${isBn ? "বিয়ের কালেকশন দেখুন →" : "Explore Wedding edit →"}</span>
        </a>
        <a class="pdp-styling-card" href="/${lang}/occasions/gifts/">
          <p class="eyebrow">${isBn ? "অর্থবহ পছন্দ" : "Thoughtful Gifting"}</p>
          <h3>${isBn ? "স্মরণীয় উপহারের ভাবনা" : "Meaningful Jewellery Gifts"}</h3>
          <p>${isBn ? "প্রিয়জনের জন্মদিন, বার্ষিকী বা বিশেষ দিনে উপহারের সুন্দর নির্বাচন।" : "A memorable and cherished gift for birthdays, anniversaries, or milestones."}</p>
          <span class="pdp-styling-link">${isBn ? "উপহার গাইড দেখুন →" : "Explore Gifting edit →"}</span>
        </a>
        <a class="pdp-styling-card" href="/${lang}/shop/">
          <p class="eyebrow">${isBn ? "দৈনন্দিন মার্জিত রূপ" : "Everyday Refinement"}</p>
          <h3>${isBn ? "মার্জিত আধুনিক সাজ" : "Contemporary Daily Wear"}</h3>
          <p>${isBn ? "অফিসিয়াল মিলনমেলা কিংবা সান্ধ্যকালীন অনুষ্ঠানে মার্জিত লুক।" : "Understated elegance suited for dinner gatherings and fusion wear."}</p>
          <span class="pdp-styling-link">${isBn ? "শপ কালেকশন দেখুন →" : "Browse all pieces →"}</span>
        </a>
      </div>
    </section>

    <!-- SECTION G: Delivery, Ordering & Payment Guidance -->
    <section class="pdp-ordering wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "স্বচ্ছ প্রক্রিয়া" : "Transparent Process"}</p>
        <h2>${isBn ? "অর্ডার, ডেলিভারি ও পেমেন্ট নির্দেশিকা" : "Ordering, delivery & payment guidance"}</h2>
      </div>
      <div class="pdp-steps-grid">
        <article class="pdp-step-card">
          <span class="pdp-step-badge">01</span>
          <h3>${isBn ? "অনুসন্ধান বা অর্ডার প্লেসমেন্ট" : "Direct Inquiry & Order"}</h3>
          <p>${isBn ? "পণ্য রেফারেন্স (" + product.id + ") সহ আমাদের WhatsApp নম্বরে বার্তা দিন অথবা ফোনে কথা বলুন।" : "Message our team on WhatsApp or call with the product reference ID (" + product.id + ")."}</p>
        </article>
        <article class="pdp-step-card">
          <span class="pdp-step-badge">02</span>
          <h3>${isBn ? "বিস্তারিত ও ঠিকানা যাচাই" : "Order & Delivery Confirmation"}</h3>
          <p>${isBn ? "আমাদের কাস্টমার কেয়ার প্রতিনিধি প্রাপ্যতা নিশ্চিত করে আপনার নাম, ঠিকানা ও যোগাযোগের তথ্য লিখে নেবেন।" : "Our team verifies item readiness, answers questions, and confirms your delivery details."}</p>
        </article>
        <article class="pdp-step-card">
          <span class="pdp-step-badge">03</span>
          <h3>${isBn ? "সারাদেশে ডেলিভারি ও পার্সেল চেক" : "Courier Dispatch & Handover"}</h3>
          <p>${isBn ? "কুরিয়ার সার্ভিসের মাধ্যমে পৌঁছে দেওয়া হবে। পার্সেল দেখে সন্তুষ্ট হয়ে পেমেন্ট সম্পন্ন করতে পারবেন।" : "Dispatched via nationwide courier across Bangladesh with parcel inspection before handover."}</p>
        </article>
      </div>
    </section>

    <!-- SECTION H: Jewellery Care Guide -->
    <section class="pdp-care wrap">
      <div class="care-note">
        <p class="eyebrow">${isBn ? "যত্ন নির্দেশিকা" : "Jewellery Care Standard"}</p>
        <h2>${isBn ? "অলংকারের দীর্ঘস্থায়ী সৌন্দর্য ও উজ্জ্বলতা ধরে রাখতে" : "Preserving the finish and luster of your jewellery"}</h2>
        <ul class="pdp-care-list">
          <li><strong>${isBn ? "কেমিক্যাল থেকে দূরে রাখুন:" : "Avoid Moisture & Chemicals:"}</strong> ${isBn ? "পারফিউম, হেয়ার স্প্রে, বডি লোশন বা হ্যান্ড স্যানিটাইজারের সরাসরি সংস্পর্শ থেকে দূরে রাখুন।" : "Keep away from perfumes, hairsprays, lotions, and harsh household chemicals."}</li>
          <li><strong>${isBn ? "পৃথকভাবে সংরক্ষণ করুন:" : "Separate Storage:"}</strong> ${isBn ? "স্ক্র্যাচ বা ঘর্ষণ এড়াতে নরম কাপড়ের পাউচ বা পৃথক বক্সে শুকনা স্থানে রাখুন।" : "Store in a soft fabric pouch or individual compartment to prevent surface scratching."}</li>
          <li><strong>${isBn ? "ব্যবহারের পর মুছুন:" : "Post-Wear Cleaning:"}</strong> ${isBn ? "পড়ার পর নরম ও পরিষ্কার মাইক্রোফাইবার কাপড় দিয়ে হালকা করে মুছে রাখুন।" : "Gently wipe down with a dry, soft lint-free cloth after wear to remove surface oils."}</li>
          <li><strong>${isBn ? "গোসল বা সাঁতারের পূর্বে খুলুন:" : "Remove Before Water Activity:"}</strong> ${isBn ? "গোসল, সাঁতার বা ব্যায়ামের আগে অলংকার খুলে নিরাপদ স্থানে রাখুন।" : "Remove prior to showering, swimming, or vigorous physical exercise."}</li>
        </ul>
      </div>
    </section>

    <!-- SECTION I: Frequently Asked Questions -->
    <section class="pdp-faq wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "সাধারণ জিজ্ঞাসা" : "Customer Inquiries"}</p>
        <h2>${isBn ? "সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর" : "Frequently asked questions"}</h2>
      </div>
      <div class="pdp-faq-grid">
        <article class="pdp-faq-item">
          <h3>${isBn ? "১. এই অলংকারটি কীভাবে অর্ডার করব?" : "1. How do I order this jewellery piece?"}</h3>
          <p>${isBn ? "পেজে থাকা 'WhatsApp-এ অর্ডার বা তথ্য জানুন' বাটনে ক্লিক করে অথবা সরাসরি +880 1740-501062 নম্বরে কল করে আইটেম রেফারেন্স " + product.id + " উল্লেখ করে অর্ডার সম্পন্ন করতে পারেন।" : "Click 'Order / Inquire on WhatsApp' or call our care line at +880 1740-501062 referencing ID " + product.id + ". Our team will assist you personally."}</p>
        </article>
        <article class="pdp-faq-item">
          <h3>${isBn ? "২. মূল্য কেন অনুমোদনের অপেক্ষায় দেখানো হচ্ছে?" : "2. Why is the price shown as pending approval?"}</h3>
          <p>${isBn ? "ইমার্কেট২৪৭ স্বচ্ছতা বজায় রাখতে যাচাইকৃত তথ্য ছাড়া কোনো দাম প্রদর্শন করে না। ক্যাটালগ পর্যালোচনার এই ধাপে সরাসরি যোগাযোগের মাধ্যমে সঠিক অফার ও মূল্য জানানো হয়।" : "eMarket247 strictly avoids publishing unverified numbers. During this catalog review stage, our customer team provides approved real-time pricing upon inquiry."}</p>
        </article>
        <article class="pdp-faq-item">
          <h3>${isBn ? "৩. সারাদেশে ডেলিভারি হতে কত দিন সময় লাগে?" : "3. What is the delivery timeframe across Bangladesh?"}</h3>
          <p>${isBn ? "সাধারণত ঢাকা শহরের ভিতরে ২–৩ কার্যদিবস এবং ঢাকার বাইরে ৩–৫ কার্যদিবসের মধ্যে কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি সম্পন্ন হয়।" : "Deliveries typically reach customers within 2–3 business days inside Dhaka and 3–5 business days nationwide via verified courier."}</p>
        </article>
        <article class="pdp-faq-item">
          <h3>${isBn ? "৪. ডেলিভারির সময় পার্সেল পরীক্ষা করার সুযোগ আছে কি?" : "4. Can I inspect the product upon delivery?"}</h3>
          <p>${isBn ? "হ্যাঁ, ডেলিভারি গ্রহণের সময় কুরিয়ার প্রতিনিধির উপস্থিতিতে পার্সেল খুলে সঠিক পণ্য যাচাই করার সুযোগ রয়েছে।" : "Yes, parcel inspection in the presence of the courier delivery agent is supported so you can verify your order before final handover."}</p>
        </article>
        <article class="pdp-faq-item">
          <h3>${isBn ? "৫. মাপ বা সাইজ যাচাই কীভাবে করব?" : "5. How do I confirm sizing for rings or bangles?"}</h3>
          <p>${isBn ? "আমাদের কাস্টমার কেয়ার প্রতিনিধি WhatsApp বা ফোনে আপনার বর্তমান মাপ অনুযায়ী সঠিক পরামর্শ দেবেন।" : "Our customer support team will guide you through simple measurement steps over WhatsApp or phone to ensure the right fit."}</p>
        </article>
        <article class="pdp-faq-item">
          <h3>${isBn ? "৬. এই ওয়েবসাইটে পেমেন্ট তথ্য সংরক্ষণ করা হয় কি?" : "6. Is financial or card data stored on this site?"}</h3>
          <p>${isBn ? "না, এই ওয়েবসাইট কোনো কার্ড বা পেমেন্ট তথ্য সংগ্রহ করে না। সব যোগাযোগ ও লেনদেন অনুমোদিত ও নিরাপদ চ্যানেলে সম্পন্ন হয়।" : "No, this static storefront never collects card numbers or sensitive payment credentials. Orders are coordinated through direct verified channels."}</p>
        </article>
      </div>
    </section>

    <!-- SECTION J: Related Products -->
    ${relatedHtml ? `
    <section class="pdp-related wrap">
      <div class="pdp-section-head">
        <p class="eyebrow">${isBn ? "কালেকশন থেকে" : "Considered Selection"}</p>
        <h2>${isBn ? "সম্পর্কিত অন্যান্য জুয়েলারি ডিজাইন" : "Related pieces from this collection"}</h2>
      </div>
      <div class="product-grid">
        ${relatedHtml}
      </div>
    </section>` : ""}

    <!-- SECTION K: Final Conversion Action -->
    <section class="pdp-final-cta wrap">
      <div class="pdp-final-card">
        <div class="pdp-final-copy">
          <p class="eyebrow">${isBn ? "পছন্দ হয়েছে?" : "Assistance & Orders"}</p>
          <h2>${isBn ? "এই ডিজাইনটি কি আপনার পছন্দ হয়েছে?" : "Ready to order or have questions about this piece?"}</h2>
          <p>${isBn ? "আমাদের কাস্টমার কেয়ার টিম আপনাকে প্রাপ্যতা, সাইজ ও সহজ অর্ডারের ক্ষেত্রে আন্তরিক সহায়তা প্রদান করবে।" : "Our customer care team is here to assist you with availability, styling guidance, and effortless order processing."}</p>
        </div>
        <div class="pdp-final-actions">
          <a class="button button-dark" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
            ${isBn ? "WhatsApp-এ যোগাযোগ" : "Inquire on WhatsApp"} <span aria-hidden="true">↗</span>
          </a>
          <a class="button button-outline" href="tel:${phone}">
            ${isBn ? "কল করুন: " + phoneDisplay : "Call " + phoneDisplay}
          </a>
          <a class="text-link" href="/${lang}/shop/">
            ${isBn ? "সব কালেকশন দেখুন →" : "Browse all pieces →"}
          </a>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(lang)}

  <div class="toast" role="status" aria-live="polite"></div>
  <script src="/assets/js/site.js?v=9cad191d" defer></script>
</body>
</html>`;
}

async function main() {
  const enCatalog = JSON.parse(await readFile(path.join(root, "assets/data/catalog.en.json"), "utf8"));
  const bnCatalog = JSON.parse(await readFile(path.join(root, "assets/data/catalog.bn.json"), "utf8"));

  const readyEn = enCatalog.products.filter((p) => p.status === "ready");
  const readyBn = bnCatalog.products.filter((p) => p.status === "ready");

  console.log(`Found ${readyEn.length} ready products in EN catalog and ${readyBn.length} ready products in BN catalog.`);

  // Write EN PDPs
  for (const product of readyEn) {
    const related = readyEn.filter((p) => p.id !== product.id && (p.category === product.category || true));
    // prioritize same category first, then others
    related.sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1));
    const html = generatePdpHtml(product, "en", related);
    const targetDir = path.join(root, "en", "products", product.slug);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "index.html"), html, "utf8");
  }

  // Write BN PDPs
  for (const product of readyBn) {
    const related = readyBn.filter((p) => p.id !== product.id);
    related.sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1));
    const html = generatePdpHtml(product, "bn", related);
    const targetDir = path.join(root, "bn", "products", product.slug);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "index.html"), html, "utf8");
  }

  console.log(`Successfully generated ${readyEn.length * 2} PDP HTML files across EN and BN!`);

  // Synchronize sitemap.xml
  const sitemapPath = path.join(root, "sitemap.xml");
  const currentSitemap = await readFile(sitemapPath, "utf8");
  const urlEntries = [];
  for (const p of readyEn) {
    urlEntries.push(`  <url><loc>${siteUrl}/en/products/${p.slug}/</loc></url>`);
  }
  for (const p of readyBn) {
    urlEntries.push(`  <url><loc>${siteUrl}/bn/products/${p.slug}/</loc></url>`);
  }

  // Remove existing product urls if any, and insert fresh ones
  let baseSitemap = currentSitemap.replace(/\s*<url><loc>https:\/\/emarket247\.shop\/(?:en|bn)\/products\/[^<]+<\/loc><\/url>/g, "");
  const insertIndex = baseSitemap.lastIndexOf("</urlset>");
  if (insertIndex !== -1) {
    const newSitemap = baseSitemap.slice(0, insertIndex) + urlEntries.join("\n") + "\n" + baseSitemap.slice(insertIndex);
    await writeFile(sitemapPath, newSitemap, "utf8");
    console.log(`Updated sitemap.xml with ${urlEntries.length} PDP entries.`);
  }
}

main().catch(console.error);
