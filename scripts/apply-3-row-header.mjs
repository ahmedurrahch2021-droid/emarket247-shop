#!/usr/bin/env node
/**
 * 3-Row Header Redesign — Pandora-style, breathable, global.
 * Row 1: WhatsApp (left) · Tagline (center) · Language (right)
 * Row 2: Logo (left) · Search bar (center) · Account/Wishlist/Cart icons (right)
 * Row 3: Main menu only
 *
 * Applied to ALL pages (EN + BN, both trees), with clean line-drawing SVG icons.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// SVG Icons (stroke-based, matching the cart icon style)
const ICON = {
  user: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8h11l-1 11a1.6 1.6 0 0 1-1.6 1.5H9.1A1.6 1.6 0 0 1 7.5 19L6.5 8Z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="7"/><path d="m15.5 15.5 5 5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/></svg>',
};

// Categories & occasions (for menu)
const categories = [
  ['rings', 'Rings', 'আংটি'], ['earrings', 'Earrings', 'কানের দুল'], ['necklaces', 'Necklaces', 'হার'],
  ['bracelets', 'Bracelets', 'ব্রেসলেট'], ['bangles', 'Bangles', 'চুড়ি'], ['pendants', 'Pendants', 'লকেট'],
  ['jewellery-sets', 'Jewellery Sets', 'জুয়েলারি সেট'], ['bridal-jewellery', 'Bridal Jewellery', 'ব্রাইডাল জুয়েলারি'],
  ['gift-jewellery', 'Gift Jewellery', 'উপহারের জুয়েলারি'],
];
const occasions = [
  ['puja', 'Puja', 'পূজা'], ['eid', 'Eid', 'ঈদ'], ['wedding', 'Wedding', 'বিয়ে'],
  ['anniversary', 'Anniversary', 'বার্ষিকী'], ['birthday', 'Birthday', 'জন্মদিন'], ['gifts', 'Gifts', 'উপহার'],
];

function href(lang, route = '') {
  return `/${lang}/${route}`.replace(/\/+$/, '/');
}

function renderHeader(lang) {
  const bn = lang === 'bn';
  const altLang = bn ? 'en' : 'bn';
  const altLabel = bn ? 'English' : 'বাংলা';
  const categoryLinks = categories.map(([slug, en, bnName]) =>
    `<li><a href="${href(lang, `categories/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`
  ).join('');
  const occasionLinks = occasions.map(([slug, en, bnName]) =>
    `<li><a href="${href(lang, `occasions/${slug}/`)}">${bn ? bnName : en}<small>${bn ? en : bnName}</small></a></li>`
  ).join('');

  return `<header class="site-header">
  <div class="utility-row">
    <a class="utility-whatsapp" href="https://wa.me/8801740501062?text=${encodeURIComponent(bn ? 'নমস্কার, আমি eMarket247 জুয়েলারি সম্পর্কে জানতে চাই' : 'Hello, I would like to enquire about eMarket247 jewellery.')}" target="_blank" rel="noopener" aria-label="${bn ? 'WhatsApp-এ চ্যাট করুন' : 'Chat with us on WhatsApp'}">${ICON.whatsapp} <span>WhatsApp</span> <b>+880 1740-501062</b></a>
    <p class="utility-tagline">${bn ? 'জুয়েলারি যা মুহূর্তকে বহন করে' : 'Jewellery that carries the moment'}</p>
    <a href="/${altLang}/" class="lang-link" lang="${altLang}">${altLabel}</a>
  </div>
  <div class="main-header">
    <a class="brand" href="${href(lang)}" aria-label="eMarket247 Fashion & Jewellery"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="190" height="99" alt="eMarket247 Fashion & Jewellery"></a>
    <div class="search-bar-wrap">
      <label for="main-search" class="sr-only">${bn ? 'জুয়েলারি খুঁজুন' : 'Search jewellery'}</label>
      ${ICON.search}
      <input type="search" id="main-search" class="main-search-input" placeholder="${bn ? 'কানের দুল, চুড়ি, পূজা...' : 'Earrings, bangles, Puja...'}" autocomplete="off">
    </div>
    <div class="header-icons">
      <a href="${href(lang, 'account/')}" class="icon-link" aria-label="${bn ? 'অ্যাকাউন্ট' : 'Account'}" title="${bn ? 'অ্যাকাউন্ট' : 'Account'}">${ICON.user}</a>
      <button type="button" class="icon-link" aria-label="${bn ? 'উইশলিস্ট' : 'Wishlist'}" title="${bn ? 'উইশলিস্ট' : 'Wishlist'}" data-wishlist-toggle>${ICON.heart}<i class="icon-badge">0</i></button>
      <a href="${href(lang, 'shop/')}" class="icon-link" aria-label="${bn ? 'কার্ট' : 'Cart'}" title="${bn ? 'কার্ট' : 'Cart'}">${ICON.cart}<i class="icon-badge">0</i></a>
    </div>
  </div>
  <div class="nav-header">
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><span></span><b>${bn ? 'মেনু' : 'Menu'}</b></button>
    <nav id="main-menu" class="main-nav" aria-label="${bn ? 'প্রধান নেভিগেশন' : 'Primary navigation'}">
      <a href="${href(lang)}">${bn ? 'হোম' : 'Home'}</a>
      <a href="${href(lang, 'shop/')}">${bn ? 'শপ' : 'Shop'}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? 'ক্যাটাগরি' : 'Categories'}</button><div class="submenu"><p>${bn ? 'জুয়েলারি খুঁজুন' : 'Find your jewellery'}</p><ul>${categoryLinks}</ul><a class="menu-all" href="${href(lang, 'categories/')}">${bn ? 'সব ক্যাটাগরি' : 'View all categories'} <span>→</span></a></div></div>
      <a href="${href(lang, 'occasions/bridal/')}">${bn ? 'ব্রাইডাল' : 'Bridal'}</a>
      <div class="has-submenu"><button type="button" aria-expanded="false">${bn ? 'অনুষ্ঠান' : 'Occasion'}</button><div class="submenu"><p>${bn ? 'বিশেষ দিনের জন্য' : 'For meaningful moments'}</p><ul>${occasionLinks}</ul><a class="menu-all" href="${href(lang, 'occasions/')}">${bn ? 'সব অনুষ্ঠান' : 'View all occasions'} <span>→</span></a></div></div>
      <a href="${href(lang, 'about/')}">${bn ? 'আমাদের কথা' : 'About Us'}</a>
      <a href="${href(lang, 'contact/')}">${bn ? 'যোগাযোগ' : 'Contact'}</a>
    </nav>
  </div>
</header>`;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'index.html') out.push(p);
  }
  return out;
}

async function replaceHeader(file) {
  let src = await readFile(file, 'utf8');
  const lang = file.includes('/en/') ? 'en' : 'bn';

  // Match the old <header>...</header> block (minified or not)
  const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/;
  if (!headerRegex.test(src)) {
    console.log(`⚠️  No header found: ${file}`);
    return false;
  }

  const newHeader = renderHeader(lang);
  src = src.replace(headerRegex, newHeader);

  await writeFile(file, src, 'utf8');
  return true;
}

async function main() {
  const trees = ['static-site', 'public_html'];
  let total = 0;

  for (const tree of trees) {
    const files = walk(path.join(ROOT, tree));
    let changed = 0;
    for (const f of files) {
      if (await replaceHeader(f)) changed++;
    }
    console.log(`${tree}: ${files.length} pages, ${changed} headers updated`);
    total += changed;
  }

  console.log(`\n✅ TOTAL: ${total} headers replaced with 3-row Pandora-style layout`);
  console.log('Next: Add CSS for .utility-row, .main-header, .nav-header, .search-bar-wrap, .header-icons to site.css');
}

main().catch(console.error);
