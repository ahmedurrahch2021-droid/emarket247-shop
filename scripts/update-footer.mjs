// Task 5: footer — add an address block under the brand column, and a
// right-aligned payment-marks row (bKash, Nagad, Visa) above the footer-bottom.
// Idempotent; skips admin pages. Keeps EN/BN copy localised.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";

/* ── Address block (appended inside the brand column, after its <p>) ───────── */
const ADDRESS = {
  en: `<ul class="footer-address"><li><strong>Address</strong>Kaluktra, Yakubpur, Thakurgaon, Bangladesh</li><li><strong>Phone</strong><a href="tel:+8801740501062">+880 1740-501062</a></li><li><strong>Email</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul>`,
  bn: `<ul class="footer-address"><li><strong>ঠিকানা</strong>কালুকাত্রা, ইয়াকুবপুর, ঠাকুরগাঁও, বাংলাদেশ</li><li><strong>ফোন</strong><a href="tel:+8801740501062">+880 1740-501062</a></li><li><strong>ইমেইল</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul>`,
};

/* ── Payment-marks row (inserted just before .footer-bottom) ───────────────── */
const PAY = {
  en: `<div class="footer-pay"><p class="footer-pay-label">We accept</p><div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="bKash" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="Nagad" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="Visa" loading="lazy"></div></div>`,
  bn: `<div class="footer-pay"><p class="footer-pay-label">আমরা গ্রহণ করি</p><div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="বিকাশ" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="নগদ" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="ভিসা" loading="lazy"></div></div>`,
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["assets", "api"].includes(e.name)) walk(p, out); }
    else if (e.name === "index.html") out.push(p);
  }
  return out;
};

const pages = walk(root);
let addrAdded = 0, payAdded = 0, skipped = 0;

for (const file of pages) {
  if (/[\\/]admin[\\/]/.test(file)) { skipped++; continue; }
  const lang = /[\\/]bn[\\/]/.test(file) ? "bn" : "en";
  let s = readFileSync(file, "utf8");
  let changed = false;

  // 1. Address — after the brand blurb <p>...</p> in the first footer column.
  //    Matches both footer variants (plain column and .footer-brand wrapper).
  if (!s.includes("footer-address")) {
    const re = /(<img src="\/assets\/images\/brand\/emarket247-logo-transparent\.png"[^>]*>\s*<p>[\s\S]*?<\/p>)/;
    if (re.test(s)) {
      s = s.replace(re, "$1" + ADDRESS[lang]);
      addrAdded++; changed = true;
    }
  }

  // 2. Payment row — before the footer-bottom bar.
  if (!s.includes("footer-pay") && s.includes('<div class="footer-bottom">')) {
    s = s.replace('<div class="footer-bottom">', PAY[lang] + '<div class="footer-bottom">');
    payAdded++; changed = true;
  }

  if (changed) writeFileSync(file, s, "utf8");
}

console.log(`pages scanned: ${pages.length}`);
console.log(`admin skipped: ${skipped}`);
console.log(`address added: ${addrAdded}`);
console.log(`payment row added: ${payAdded}`);
