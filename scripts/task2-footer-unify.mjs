import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

// The canonical newsletter footers (already extracted)
const EN_FOOTER = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Submit">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p></form></section><div class="footer-main"><div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>A modern destination for jewellery that carries the moment.</p></div><div><h3>Discover</h3><a href="/en/shop/">Shop</a><a href="/en/categories/">Categories</a><a href="/en/occasions/puja/">Puja</a><a href="/en/occasions/gifts/">Gifts</a></div><div><h3>Care</h3><a href="/en/care/">Care & support</a><a href="/en/guides/">Guides</a><a href="/en/contact/">Contact</a></div><div><h3>Information</h3><a href="/en/about/">About</a><a href="/en/privacy/">Privacy</a><a href="/en/terms/">Terms</a></div></div><div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p><p>Built with product care, clear detail, and responsible publishing.</p></div></footer>`;

const BN_FOOTER = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p><h2>নতুন কালেকশন, উপহারের ভাবনা এবং বিবেচনাপূর্ণ জুয়েলারি নোট।</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="আপনার ইমেইল" required><button type="submit" aria-label="Submit">↗</button><p>সংবাদ আপডেট পেতে সম্মতি দেওয়ার আগে একটি আনুষ্ঠানিক গোপনীয়তা ব্যবস্থা যুক্ত হবে।</p></form></section><div class="footer-main"><div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>প্রতিটি মুহূর্তের জন্য আধুনিক জুয়েলারি গন্তব্য।</p></div><div><h3>আবিষ্কার</h3><a href="/bn/shop/">শপ</a><a href="/bn/categories/">ক্যাটাগরি</a><a href="/bn/occasions/puja/">পূজা</a><a href="/bn/occasions/gifts/">উপহার</a></div><div><h3>যত্ন</h3><a href="/bn/care/">যত্ন ও সহায়তা</a><a href="/bn/guides/">গাইড</a><a href="/bn/contact/">যোগাযোগ</a></div><div><h3>তথ্য</h3><a href="/bn/about/">আমাদের কথা</a><a href="/bn/privacy/">গোপনীয়তা</a><a href="/bn/terms/">শর্তাবলি</a></div></div><div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. সর্বস্বত্ব সংরক্ষিত।</p><p>পণ্যের যত্ন, পরিষ্কার তথ্য এবং দায়িত্বশীল প্রকাশের সাথে তৈরি।</p></div></footer>`;

// Pattern that identifies the old multi-column footers (all variants to replace)
// Variant A: <footer-inner> wrapper (delivery, refund, cart pages)
const OLD_FOOTER_INNER_RE = /<footer class="site-footer">\s*<div class="footer-inner">[\s\S]*?<\/footer>/;
const OLD_FOOTER_INNER_COMPACT_RE = /<footer class="site-footer"><div class="footer-inner">[\s\S]*?<\/footer>/;
// Variant B: <footer-main wrap> variant (PDP product pages)
const OLD_FOOTER_MAIN_RE = /<footer class="site-footer">\s*<div class="footer-main wrap">[\s\S]*?<\/footer>/;
const OLD_FOOTER_MAIN_COMPACT_RE = /<footer class="site-footer"><div class="footer-main wrap">[\s\S]*?<\/footer>/;
// Variant C: <footer-main> without wrap (account pages)
const OLD_FOOTER_MAIN_BARE_RE = /<footer class="site-footer">\s*<div class="footer-main">[\s\S]*?<\/footer>/;
const OLD_FOOTER_MAIN_BARE_COMPACT_RE = /<footer class="site-footer"><div class="footer-main">[\s\S]*?<\/footer>/;
// Variant D: bare copyright-only footer (bn/account minimal footer)
const OLD_FOOTER_BARE_RE = /<footer class="site-footer">\s*<div class="footer-bottom">[\s\S]*?<\/footer>/;
const OLD_FOOTER_BARE_COMPACT_RE = /<footer class="site-footer"><div class="footer-bottom">[\s\S]*?<\/footer>/;

function getLang(htmlPath) {
  // Paths starting with /bn/ or /bn\ are Bengali
  return /[/\\]bn[/\\]/.test(htmlPath) ? 'bn' : 'en';
}

function getFooter(path) {
  return /[/\\]bn[/\\]/.test(path) ? BN_FOOTER : EN_FOOTER;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Check if it has a site-footer at all
  if (!html.includes('class="site-footer"')) return { file: filePath, status: 'no-footer' };

  // Try all old-footer patterns
  let oldMatch =
    html.match(OLD_FOOTER_INNER_COMPACT_RE) ||
    html.match(OLD_FOOTER_INNER_RE) ||
    html.match(OLD_FOOTER_MAIN_COMPACT_RE) ||
    html.match(OLD_FOOTER_MAIN_RE) ||
    html.match(OLD_FOOTER_MAIN_BARE_COMPACT_RE) ||
    html.match(OLD_FOOTER_MAIN_BARE_RE) ||
    html.match(OLD_FOOTER_BARE_COMPACT_RE) ||
    html.match(OLD_FOOTER_BARE_RE);

  if (!oldMatch) {
    // Has a footer but doesn't match old pattern — check if it already has newsletter
    if (html.includes('class="newsletter"')) {
      return { file: filePath, status: 'already-newsletter' };
    }
    // Debug: report unexpected footer structure
    const footerM = html.match(/<footer[\s\S]*?<\/footer>/);
    console.log('  DEBUG UNKNOWN:', path.relative(pub, filePath), '| footer-len:', footerM ? footerM[0].length : 0, '| starts:', footerM ? footerM[0].substring(0, 80) : 'none');
    return { file: filePath, status: 'unknown-footer' };
  }

  const canonicalFooter = getFooter(filePath);
  const newHtml = html.replace(oldMatch[0], canonicalFooter);
  fs.writeFileSync(filePath, newHtml, 'utf8');
  return { file: filePath, status: 'replaced' };
}

function walkDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip api, admin, node_modules, .git
      if (['api', 'admin', 'node_modules', '.git', 'assets', 'scripts'].includes(entry.name)) continue;
      results.push(...walkDir(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = walkDir(pub);
console.log(`Scanning ${allFiles.length} HTML files...`);

const results = allFiles.map(f => processFile(f));

const replaced = results.filter(r => r.status === 'replaced');
const alreadyOk = results.filter(r => r.status === 'already-newsletter');
const unknown = results.filter(r => r.status === 'unknown-footer');
const noFooter = results.filter(r => r.status === 'no-footer');

console.log(`\n=== RESULTS ===`);
console.log(`Replaced old footers:   ${replaced.length}`);
replaced.forEach(r => console.log(`  REPLACED: ${path.relative(pub, r.file)}`));

console.log(`\nAlready newsletter:     ${alreadyOk.length}`);
console.log(`\nUnknown footer type:    ${unknown.length}`);
unknown.forEach(r => console.log(`  UNKNOWN:   ${path.relative(pub, r.file)}`));

console.log(`\nNo footer:              ${noFooter.length}`);
noFooter.forEach(r => console.log(`  NO-FOOTER: ${path.relative(pub, r.file)}`));

if (replaced.length > 0) {
  console.log(`\n✅ Task 2 DONE — ${replaced.length} files updated.`);
} else {
  console.log(`\n✅ Task 2 already complete — no old footers found.`);
}
