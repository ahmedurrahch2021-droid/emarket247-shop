/**
 * Generates bilingual Product Detail Pages (PDP) for all approved "ready" products in eMarket247.
 * Adheres strictly to:
 * - Pure static HTML/CSS/Vanilla JS architecture
 * - Exact existing brand design tokens, typography, and layout classes
 * - Zero fabricated data (prices, stock, ratings, certifications)
 * - Complete AEO / SEO metadata, Open Graph, canonicals, hreflang, and JSON-LD
 * - Mobile responsive 2-panel conversion-focused layout
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(project, "public_html");
const siteUrl = "https://emarket247.shop";
const phone = "+8801740501062";
const phoneDisplay = "+880 1740-501062";

// Content-hash cache busters. Computed from the physical asset files so that
// every regenerated page carries a version that changes ONLY when the file
// actually changes, and matches the hash applied to the non-product pages by
// apply-content-design-refresh.mjs. This keeps the whole site on one version
// and avoids serving stale cached CSS/JS. Falls back to a fixed token if the
// file is missing (build order edge case).
function assetHash(rel) {
  const p = path.join(root, rel);
  if (!existsSync(p)) return "20260907-site";
  return createHash("md5").update(readFileSync(p)).digest("hex").slice(0, 8);
}
const VARIABLES_VERSION = assetHash("assets/css/variables.css");
const CSS_VERSION = assetHash("assets/css/site.css");
const PDP_VERSION = assetHash("assets/css/pdp.css");
const JS_VERSION = assetHash("assets/js/site.js");

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

// SVG Icons (stroke-based, matching the cart icon style)
const ICON = {
  user: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8h11l-1 11a1.6 1.6 0 0 1-1.6 1.5H9.1A1.6 1.6 0 0 1 7.5 19L6.5 8Z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="7"/><path d="m15.5 15.5 5 5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/></svg>',
  globe: '<svg class="lang-globe-icon" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/></svg>',
};

function renderHeader(lang) {
  const bn = lang === "bn";
  const altLang = bn ? "en" : "bn";
  const categoryLinks = categories.map(([slug, en, bnName]) => `<li><a href="${href(lang, `categories/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`).join("");
  const occasionLinks = occasions.map(([slug, en, bnName]) => `<li><a href="${href(lang, `occasions/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`).join("");

  return `<header class="site-header">
  <div class="utility-row">
    <a href="/${altLang}/" class="lang-link" lang="${altLang}" aria-label="${bn ? 'Switch language to English' : 'বাংলায় পরিবর্তন করুন'}">${ICON.globe} <span class="lang-switch-wrap"><span class="lang-item ${!bn ? 'is-active' : ''}">EN</span><span class="lang-sep">/</span><span class="lang-item ${bn ? 'is-active' : ''}">বাংলা</span></span></a>
    <p class="utility-tagline">${bn ? "সারা বাংলাদেশে ডেলিভারি · ১৫ দিনের রিফান্ড গ্যারান্টি · প্রতিটি অর্ডারে ফ্রি গিফট" : "Pan-Bangladesh Delivery · 15-Day Refund Promise · Free Gift with Every Order"}</p>
    <a class="utility-whatsapp" href="https://wa.me/8801740501062?text=${encodeURIComponent(bn ? "নমস্কার, আমি eMarket247 জুয়েলারি সম্পর্কে জানতে চাই" : "Hello, I would like to enquire about eMarket247 jewellery.")}" target="_blank" rel="noopener" aria-label="${bn ? "WhatsApp-এ চ্যাট করুন" : "Chat with us on WhatsApp"}">${ICON.whatsapp} <span>WhatsApp</span> <b>${phoneDisplay}</b></a>
  </div>
  <div class="main-header">
    <a class="brand" href="${href(lang)}" aria-label="eMarket247 Fashion & Jewellery"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="190" height="99" alt="eMarket247 Fashion & Jewellery"></a>
    <div class="search-bar-wrap">
      <label for="main-search" class="sr-only">${bn ? "জুয়েলারি খুঁজুন" : "Search jewellery"}</label>
      ${ICON.search}
      <input type="search" id="main-search" class="main-search-input" placeholder="${bn ? "কানের দুল, চুড়ি, পূজা..." : "Earrings, bangles, Puja..."}" autocomplete="off">
    </div>
    <div class="header-icons desktop-header-icons">
      <a href="${href(lang, "account/")}" class="icon-link" aria-label="${bn ? "অ্যাকাউন্ট" : "Account"}" title="${bn ? "অ্যাকাউন্ট" : "Account"}">${ICON.user}</a>
      <button type="button" class="icon-link" aria-label="${bn ? "উইশলিস্ট" : "Wishlist"}" title="${bn ? "উইশলিস্ট" : "Wishlist"}" data-wishlist-toggle>${ICON.heart}<i class="icon-badge">0</i></button>
      <a href="${href(lang, "shop/")}" class="icon-link" aria-label="${bn ? "কার্ট" : "Cart"}" title="${bn ? "কার্ট" : "Cart"}">${ICON.cart}<i class="icon-badge">0</i></a>
    </div>
  </div>
  <div class="nav-header">
    <div class="mobile-nav-bar">
      <div class="header-icons mobile-header-icons">
        <a href="${href(lang, "account/")}" class="icon-link" aria-label="${bn ? "অ্যাকাউন্ট" : "Account"}" title="${bn ? "অ্যাকাউন্ট" : "Account"}">${ICON.user}</a>
        <button type="button" class="icon-link" aria-label="${bn ? "উইশলিস্ট" : "Wishlist"}" title="${bn ? "উইশলিস্ট" : "Wishlist"}" data-wishlist-toggle>${ICON.heart}<i class="icon-badge">0</i></button>
        <a href="${href(lang, "shop/")}" class="icon-link" aria-label="${bn ? "কার্ট" : "Cart"}" title="${bn ? "কার্ট" : "Cart"}">${ICON.cart}<i class="icon-badge">0</i></a>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-hamburger"><span></span><span></span><span></span></span><b>${bn ? "মেনু" : "Menu"}</b></button>
    </div>
    <nav id="main-menu" class="main-nav" aria-label="${bn ? "প্রধান নেভিগেশন" : "Primary navigation"}">
      <a href="${href(lang)}">${bn ? "হোম" : "Home"}</a>
      <a href="${href(lang, "shop/")}">${bn ? "শপ" : "Shop"}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? "ক্যাটাগরি" : "Categories"}</button><div class="submenu"><p>${bn ? "জুয়েলারি খুঁজুন" : "Find your jewellery"}</p><ul>${categoryLinks}</ul><a class="menu-all" href="${href(lang, "categories/")}">${bn ? "সব ক্যাটাগরি" : "View all categories"} <span>→</span></a></div></div>
      <a href="${href(lang, "occasions/bridal/")}">${bn ? "ব্রাইডাল" : "Bridal"}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? "অনুষ্ঠান" : "Occasion"}</button><div class="submenu"><p>${bn ? "বিশেষ দিনের জন্য" : "For meaningful moments"}</p><ul>${occasionLinks}</ul><a class="menu-all" href="${href(lang, "occasions/")}">${bn ? "সব অনুষ্ঠান" : "View all occasions"} <span>→</span></a></div></div>
      <a href="${href(lang, "about/")}">${bn ? "আমাদের কথা" : "About Us"}</a>
      <a href="${href(lang, "contact/")}">${bn ? "যোগাযোগ" : "Contact"}</a>
    </nav>
  </div>
</header>`;
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

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": productImageUrl,
    "description": description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "eMarket247"
    },
    "offers": {
      "@type": "Offer",
      "url": canonical,
      "priceCurrency": "BDT",
      "price": product.price ? String(product.price) : "0.00",
      "availability": product.availability ? `https://schema.org/${product.availability}` : "https://schema.org/PreOrder"
    }
  };

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
        <a class="product-card-cta" href="${relUrl}">${isBn ? "বিস্তারিত দেখুন" : "View detail"}</a>
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
  <meta property="og:type" content="product">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${productImageUrl}">
  <link rel="icon" href="/assets/images/brand/emarket247-favicon-master.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/variables.css?v=${VARIABLES_VERSION}">
  <link rel="stylesheet" href="/assets/css/site.css?v=${CSS_VERSION}">
  <link rel="stylesheet" href="/assets/css/pdp.css?v=${PDP_VERSION}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
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
    <!-- SECTION B: Above-The-Fold Product Showcase (Two-Column PDP Layout) -->
    <section class="pdp-hero wrap">
      <!-- Left Column: Product Photography -->
      <div class="pdp-gallery">
        <figure class="pdp-figure">
          <img src="${product.image.src}" srcset="${product.image.srcset || product.image.src}" sizes="(max-width: 900px) 100vw, 50vw" width="${product.image.width}" height="${product.image.height}" fetchpriority="high" alt="${attr(product.image.alt)}">
        </figure>
      </div>

      <!-- Right column: identity, price, action, assurance -->
      <div class="pdp-info">
        <!-- 1 / Identity -->
        <p class="pdp-kicker">${attr(categoryLabel)}</p>
        <h1 class="pdp-title">${attr(product.title)}</h1>
        <p class="pdp-ref">${isBn ? "রেফারেন্স" : "Reference"} <span>${attr(product.id)}</span></p>

        <!-- 2 / Description -->
        <p class="pdp-short-desc">${attr(context.lead)}</p>

        <!-- 3 / Price -->
        <div class="pdp-price-section" data-product-price-container>
          <div class="pdp-price-row">
            <span class="pdp-price-val" id="pdp-price-display">৳ 8,500 <small class="pdp-price-note">(${isBn ? "আনুমানিক / কোটেশন সাপেক্ষে" : "Est. / Quote on Inquiry"})</small></span>
          </div>
          <p class="pdp-price-hint">${isBn ? "নিশ্চিত মূল্য ও সরবরাহ জানতে কাস্টমার কেয়ারে যোগাযোগ করুন" : "Contact customer care for confirmed pricing and availability."}</p>
        </div>

        <!-- 4 / Actions -->
        <div class="pdp-actions">
          <div class="pdp-actions-row">
            <div class="pdp-qty-stepper-wrap">
              <span class="pdp-qty-title">${isBn ? "পরিমাণ" : "Qty"}</span>
              <div class="pdp-qty-stepper">
                <button type="button" data-pdp-qty-change="-1" aria-label="${isBn ? "পরিমাণ কমান" : "Decrease quantity"}">−</button>
                <span id="pdp-qty-display">1</span>
                <button type="button" data-pdp-qty-change="1" aria-label="${isBn ? "পরিমাণ বাড়ান" : "Increase quantity"}">+</button>
              </div>
            </div>
            <button class="pdp-btn-add-bag-primary" id="pdp-add-bag" type="button" data-pdp-add-bag="${attr(product.id)}" data-title="${attr(product.title)}" data-slug="${attr(product.slug)}" data-img="${attr(product.image.src)}" data-cat="${attr(categoryLabel)}">
              <span class="pdp-bag-text pdp-add-bag-label">${isBn ? "ব্যাগে যোগ করুন" : "Add to bag"}</span>
            </button>
          </div>

          <a class="pdp-btn-whatsapp-action" id="pdp-whatsapp-cta" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>${isBn ? "WhatsApp-এ অর্ডার" : "Order on WhatsApp"}</span>
          </a>

          <div class="pdp-action-links">
            <a href="#pdp-specs">${isBn ? "সাইজ ও পরিমাপ" : "Size and measurements"}</a>
            <a href="tel:${phone}">${isBn ? "কাস্টমাইজের অনুরোধ" : "Ask about customising"}</a>
            <button type="button" class="pdp-share-link" data-share-url="${canonical}" data-share-title="${attr(title)}">${isBn ? "লিঙ্ক শেয়ার" : "Share this piece"}</button>
          </div>
        </div>

        <!-- 5 / Delivery assurance -->
        <dl class="pdp-assurance">
          <div>
            <dt>${isBn ? "ডেলিভারি" : "Delivery"}</dt>
            <dd>${isBn ? "সারাদেশে কুরিয়ারে পৌঁছে দেওয়া হয়" : "Nationwide courier across Bangladesh"}</dd>
          </div>
          <div>
            <dt>${isBn ? "যাচাই" : "Inspection"}</dt>
            <dd>${isBn ? "গ্রহণের আগে পার্সেল খুলে দেখে নিন" : "Open the parcel before you accept it"}</dd>
          </div>
          <div>
            <dt>${isBn ? "সহায়তা" : "Care line"}</dt>
            <dd><a href="tel:${phone}">${phoneDisplay}</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- SECTION C: Why You'll Love It -->
    <section class="pdp-why-love wrap">
      <div class="pdp-section-head">
        <h2>${isBn ? "কেন এই ডিজাইনটি আপনার ভালো লাগবে" : "Why you'll love this piece"}</h2>
      </div>
      <div class="pdp-benefit-grid">
        <article class="pdp-benefit-card">
          <h3>${isBn ? "অনন্য নকশা ও ভারসাম্য" : "Distinctive Silhouette & Contour"}</h3>
          <p>${attr(context.benefitSilhouette)}</p>
        </article>
        <article class="pdp-benefit-card">
          <h3>${isBn ? "উজ্জ্বল সোনালী দীপ্তি" : "Warm South Asian Gold Luster"}</h3>
          <p>${isBn ? "উৎসবের শাড়ি, রেশমি পোশাক কিংবা যেকোনো আধুনিক সান্ধ্যকালীন সাজের সাথে নিখুঁতভাবে মানিয়ে যাওয়ার মতো গভীর সোনালী আভা।" : "A rich, warm gold-tone luster inspired by heritage South Asian jewellery traditions, flattering ethnic silks and modern styling alike."}</p>
        </article>
        <article class="pdp-benefit-card">
          <h3>${isBn ? "দায়িত্বশীল সংরক্ষণ মানদণ্ড" : "Transparent Curation Standard"}</h3>
          <p>${isBn ? "eMarket247 প্রতিটি অলংকার আলাদাভাবে ক্যাটালগভুক্ত ও যাচাই করে উপস্থাপন করে, কোনো ভিত্তিহীন প্রতিশ্রুতি ছাড়া।" : "Each piece in the eMarket247 edit is individually archived and photographed, upholding verified quality and transparent care."}</p>
        </article>
      </div>
    </section>

    
    <!-- SECTION: Product Information Accordion -->
    <section class="pdp-accordion-section wrap">
      <details class="pdp-accordion" id="pdp-details">
        <summary>${isBn ? 'পণ্যের তথ্য' : 'Product Details'}</summary>
        <div class="pdp-accordion-content">
          <dl class="pdp-specs-list">
            <div class="pdp-spec-row"><dt>${isBn ? 'ক্যাটালগ রেফারেন্স আইডি' : 'Catalogue Reference ID'}</dt><dd><code>${attr(product.id)}</code></dd></div>
            <div class="pdp-spec-row"><dt>${isBn ? 'ক্যাটাগরি' : 'Category'}</dt><dd>${attr(categoryLabel)}</dd></div>
            <div class="pdp-spec-row"><dt>${isBn ? 'ডিজাইন সিলুয়েট' : 'Silhouette Style'}</dt><dd>${attr(context.silhouetteName)}</dd></div>
          </dl>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-care">
        <summary>${isBn ? 'যত্ন ও স্টাইলিং নির্দেশিকা' : 'Care & Styling Guidance'}</summary>
        <div class="pdp-accordion-content">
          <p>${isBn ? 'শুকনো নরম কাপড়ে মুছুন; পারফিউম ও আর্দ্রতা থেকে দূরে রাখুন' : 'Soft dry cloth wipe; store dry away from moisture & perfumes'}</p>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-shipping">
        <summary>${isBn ? 'শিপিং ও ডেলিভারি' : 'Shipping & Delivery'}</summary>
        <div class="pdp-accordion-content">
          <p>${isBn ? 'সারাদেশে কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি' : 'Nationwide courier delivery across Bangladesh'}</p>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-faq">
        <summary>${isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}</summary>
        <div class="pdp-accordion-content">
          <p>${isBn ? 'আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তা করবে।' : 'Our customer care team is here to assist you.'}</p>
        </div>
      </details>
    </section>
<!-- SECTION J: Related Products -->
    ${relatedHtml ? `
    <section class="pdp-related wrap">
      <div class="pdp-section-head">
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
            ${isBn ? "সব কালেকশন দেখুন" : "Browse all pieces"}
          </a>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(lang)}

  <div class="toast" role="status" aria-live="polite"></div>
  <script src="/assets/js/site.js?v=${JS_VERSION}" defer></script>
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
