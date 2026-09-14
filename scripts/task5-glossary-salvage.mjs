import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

const CANONICAL_VAR = '/assets/css/variables.css?v=9fcdc491';
const CANONICAL_CSS = '/assets/css/site.css?v=ca128acc';

const CANONICAL_FOOTER_EN = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Submit">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p></form></section><div class="footer-main"><div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>A modern destination for jewellery that carries the moment.</p></div><div><h3>Discover</h3><a href="/en/shop/">Shop</a><a href="/en/categories/">Categories</a><a href="/en/occasions/puja/">Puja</a><a href="/en/occasions/gifts/">Gifts</a></div><div><h3>Care</h3><a href="/en/care/">Care & support</a><a href="/en/guides/">Guides</a><a href="/en/contact/">Contact</a></div><div><h3>Information</h3><a href="/en/about/">About</a><a href="/en/privacy/">Privacy</a><a href="/en/terms/">Terms</a></div></div><div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p><p>Built with product care, clear detail, and responsible publishing.</p></div></footer>`;

const CANONICAL_FOOTER_BN = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p><h2>নতুন কালেকশন, উপহারের ভাবনা এবং বিবেচনাপূর্ণ জুয়েলারি নোট।</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="আপনার ইমেইল" required><button type="submit" aria-label="Submit">↗</button><p>সংবাদ আপডেট পেতে সম্মতি দেওয়ার আগে একটি আনুষ্ঠানিক গোপনীয়তা ব্যবস্থা যুক্ত হবে।</p></form></section><div class="footer-main"><div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>প্রতিটি মুহূর্তের জন্য আধুনিক জুয়েলারি গন্তব্য।</p></div><div><h3>আবিষ্কার</h3><a href="/bn/shop/">শপ</a><a href="/bn/categories/">ক্যাটাগরি</a><a href="/bn/occasions/puja/">পূজা</a><a href="/bn/occasions/gifts/">উপহার</a></div><div><h3>যত্ন</h3><a href="/bn/care/">যত্ন ও সহায়তা</a><a href="/bn/guides/">গাইড</a><a href="/bn/contact/">যোগাযোগ</a></div><div><h3>তথ্য</h3><a href="/bn/about/">আমাদের কথা</a><a href="/bn/privacy/">গোপনীয়তা</a><a href="/bn/terms/">শর্তাবলি</a></div></div><div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. সর্বস্বত্ব সংরক্ষিত।</p><p>পণ্যের যত্ন, পরিষ্কার তথ্য এবং দায়িত্বশীল প্রকাশের সাথে তৈরি।</p></div></footer>`;

// Old footer patterns (proven in task 2)
const OLD_RE_LIST = [
  /<footer class="site-footer"><div class="footer-inner">[\s\S]*?<\/footer>/,
  /<footer class="site-footer">\s*<div class="footer-inner">[\s\S]*?<\/footer>/,
  /<footer class="site-footer"><div class="footer-main wrap">[\s\S]*?<\/footer>/,
  /<footer class="site-footer">\s*<div class="footer-main wrap">[\s\S]*?<\/footer>/,
  /<footer class="site-footer"><div class="footer-main">[\s\S]*?<\/footer>/,
  /<footer class="site-footer">\s*<div class="footer-main">[\s\S]*?<\/footer>/,
  /<footer class="site-footer"><div class="footer-bottom">[\s\S]*?<\/footer>/,
  /<footer class="site-footer">\s*<div class="footer-bottom">[\s\S]*?<\/footer>/,
];

function gitShow(branch, file) {
  try {
    return execSync(`git -C "${root}" show ${branch}:${file}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return null;
  }
}

function isBn(filePath) {
  return /[/\\]bn[/\\]/.test(filePath);
}

function fixPage(html, filePath) {
  let result = html;

  // 1. Fix CSS cache-busting strings
  result = result.replace(/\/assets\/css\/variables\.css\?v=[a-f0-9]+/g, CANONICAL_VAR);
  result = result.replace(/\/assets\/css\/site\.css\?v=[a-f0-9]+/g, CANONICAL_CSS);

  // 2. Fix fabricated prices in meta description
  // EN: "৳350–6,000" → price band
  result = result.replace(/৳\s*350\s*[-–]\s*6[\s,]*000[^<"]*/g, '৳ 800–3,500 (price band) — final price on WhatsApp');
  // BN: similar patterns
  result = result.replace(/৳\s*৩৫০\s*[-–]\s*৬[\s,]*০০০[^<"]*/g, '৳ ৮০০–৩,৫০০ (মূল্য সীমা) — চূড়ান্ত মূল্য WhatsApp-এ জানুন');

  // 3. Replace old footer
  let footerReplaced = false;
  for (const re of OLD_RE_LIST) {
    const m = result.match(re);
    if (m) {
      result = result.replace(m[0], isBn(filePath) ? CANONICAL_FOOTER_BN : CANONICAL_FOOTER_EN);
      footerReplaced = true;
      break;
    }
  }

  return { html: result, footerReplaced };
}

const tasks = [
  // [gitPath, source: 'branch-name' or null for master]
  ['public_html/en/guides/glossary/index.html', 'claude/upbeat-hermann-1d51a2'],
  ['public_html/bn/guides/glossary/index.html', 'claude/upbeat-hermann-1d51a2'],
  ['public_html/en/occasions/puja/index.html', null],
  ['public_html/bn/occasions/puja/index.html', null],
];

let saved = 0;
for (const [gitPath, branch] of tasks) {
  let html;
  if (branch) {
    html = gitShow(branch, gitPath);
    if (!html) { console.log(`❌ MISSING in branch: ${gitPath}`); continue; }
    console.log(`→ Restoring from old branch: ${gitPath}`);
  } else {
    const filePath = path.join(root, gitPath);
    html = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    if (!html) { console.log(`❌ MISSING on master: ${gitPath}`); continue; }
    console.log(`→ Fixing on master: ${gitPath}`);
  }

  const { html: fixed, footerReplaced } = fixPage(html, gitPath);
  const outPath = path.join(root, gitPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fixed, 'utf8');
  console.log(`  ✅ Saved (footer replaced: ${footerReplaced})`);
  saved++;
}

console.log(`\n${saved} files processed.`);
