import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

// The canonical newsletter footers (already extracted)
const FACEBOOK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" aria-hidden="true" focusable="false"><path d="M24 12a12 12 0 1 0-13.86 11.87V15.47h-2.72v-3.35h2.72v-2.55c0-2.7 1.6-4.2 4.06-4.2 1.18 0 2.42.21 2.42.21v2.66h-1.36c-1.34 0-1.76.83-1.76 1.69v2.03h3l-.5 3.35h-2.53V24A12 12 0 0 0 24 12Z"/></svg>';
const INSTAGRAM_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#665f5a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="0.8" fill="#665f5a" stroke="none"/></svg>';
const TIKTOK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#665f5a" aria-hidden="true" focusable="false"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.53V7.01a4.85 4.85 0 0 1-1.01-.32Z"/></svg>';
const YOUTUBE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#665f5a" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3 3 0 0 0-.24-1.06 2 2 0 0 0-.73-.75C21.4 4 12 4 12 4s-9.4 0-10.53.39A2 2 0 0 0 9.73 5.1 3 3 0 0 0 9.5 6.2 29.5 29.5 0 0 0 9 12a29.5 29.5 0 0 0 .5 5.8 3 3 0 0 0 .24 1.06 2 2 0 0 0 .73.75C11.6 20 21 20 21 20s9.4 0 10.53-.39a2 2 0 0 0 .73-.75 3 3 0 0 0 .24-1.06A29.5 29.5 0 0 0 23.5 12a29.5 29.5 0 0 0-.5-5.8Zm-13.99 7.5-5.53 3.2v-6.4l5.53 3.2Z"/></svg>';
// bKash: brand oval with pink background and white "bKash" text
const BKASH_SVG = '<svg viewBox="0 0 55 36" width="46" height="30" role="img" aria-label="bKash"><rect width="55" height="36" rx="6" fill="#E61961"/><text x="27.5" y="23" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white" text-anchor="middle" letter-spacing="0.5">bKash</text></svg>';
// Nagad: rounded rectangle with orange background and stylized "n" mark
const NAGAD_SVG = '<svg viewBox="0 0 55 36" width="46" height="30" role="img" aria-label="Nagad"><rect width="55" height="36" rx="6" fill="#E66A1F"/><text x="27.5" y="24" font-family="Arial,sans-serif" font-size="15" font-weight="800" fill="white" text-anchor="middle" font-style="italic">nagad</text></svg>';
// Visa: classic blue wordmark
const VISA_SVG = '<svg viewBox="0 0 55 36" width="46" height="30" role="img" aria-label="Visa"><rect width="55" height="36" rx="6" fill="#1A1F71"/><text x="27.5" y="24" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" letter-spacing="2">VISA</text></svg>';

const EN_FOOTER = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Submit">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p></form></section><div class="footer-main"><div class="footer-brand"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>A modern destination for jewellery that carries the moment.</p><div class="footer-social"><a href="https://web.facebook.com/Emarket247bd" target="_blank" rel="noopener noreferrer" aria-label="eMarket247 on Facebook" class="social-link social-facebook">${FACEBOOK_SVG}</a><span class="social-placeholder" title="Instagram — coming soon" aria-label="Instagram coming soon">${INSTAGRAM_SVG}</span><span class="social-placeholder" title="TikTok — coming soon" aria-label="TikTok coming soon">${TIKTOK_SVG}</span></div></div><div><h3>Discover</h3><a href="/en/shop/">Shop</a><a href="/en/categories/">Categories</a><a href="/en/occasions/puja/">Puja</a><a href="/en/occasions/gifts/">Gifts</a></div><div><h3>Care</h3><a href="/en/care/">Care &amp; support</a><a href="/en/guides/">Guides</a><a href="/en/contact/">Contact</a></div><div><h3>Information</h3><a href="/en/about/">About</a><a href="/en/privacy/">Privacy</a><a href="/en/terms/">Terms</a></div></div><div class="footer-bottom"><p class="footer-copy">© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p><div class="footer-payments"><span class="payments-label">Secure payment</span><div class="payment-icons">${BKASH_SVG}${NAGAD_SVG}${VISA_SVG}</div></div></div></footer>`;

const BN_FOOTER = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p><h2>নতুন কালেকশন, উপহারের ভাবনা এবং বিবেচনাপূর্ণ জুয়েলারি নোট।</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="আপনার ইমেইল" required><button type="submit" aria-label="Submit">↗</button><p>সংবাদ আপডেট পেতে সম্মতি দেওয়ার আগে একটি আনুষ্ঠানিক গোপনীয়তা ব্যবস্থা যুক্ত হবে।</p></form></section><div class="footer-main"><div class="footer-brand"><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>প্রতিটি মুহূর্তের জন্য আধুনিক জুয়েলারি গন্তব্য।</p><div class="footer-social"><a href="https://web.facebook.com/Emarket247bd" target="_blank" rel="noopener noreferrer" aria-label="eMarket247 Facebook-এ" class="social-link social-facebook">${FACEBOOK_SVG}</a><span class="social-placeholder" title="Instagram — শীঘ্রই আসছে" aria-label="Instagram শীঘ্রই আসছে">${INSTAGRAM_SVG}</span><span class="social-placeholder" title="TikTok — শীঘ্রই আসছে" aria-label="TikTok শীঘ্রই আসছে">${TIKTOK_SVG}</span></div></div><div><h3>আবিষ্কার</h3><a href="/bn/shop/">শপ</a><a href="/bn/categories/">ক্যাটাগরি</a><a href="/bn/occasions/puja/">পূজা</a><a href="/bn/occasions/gifts/">উপহার</a></div><div><h3>যত্ন</h3><a href="/bn/care/">যত্ন ও সহায়তা</a><a href="/bn/guides/">গাইড</a><a href="/bn/contact/">যোগাযোগ</a></div><div><h3>তথ্য</h3><a href="/bn/about/">আমাদের কথা</a><a href="/bn/privacy/">গোপনীয়তা</a><a href="/bn/terms/">শর্তাবলি</a></div></div><div class="footer-bottom"><p class="footer-copy">© 2026 <strong class="brand-name">eMarket247</strong>. সর্বস্বত্ব সংরক্ষিত।</p><div class="footer-payments"><span class="payments-label">নিরাপদ পেমেন্ট</span><div class="payment-icons">${BKASH_SVG}${NAGAD_SVG}${VISA_SVG}</div></div></div></footer>`;

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
