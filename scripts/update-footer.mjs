// Task 5: footer — add an address block under the brand column, and a
// right-aligned payment-marks row (bKash, Nagad, Visa) above the footer-bottom.
// Idempotent; skips admin pages. Keeps EN/BN copy localised.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";

/* ── Address block (appended inside the brand column, after its <p>) ───────── */
const ADDRESS = {
  en: `<ul class="footer-address"><li><strong>Address</strong>Kalukhali, Yakubpur, Thakurgaon, Bangladesh</li><li><strong>Phone</strong><a href="tel:+8801740501062">+880 1740-501062</a></li><li><strong>Email</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul>`,
  bn: `<ul class="footer-address"><li><strong>ঠিকানা</strong>কালুকাত্রা, ইয়াকুবপুর, ঠাকুরগাঁও, বাংলাদেশ</li><li><strong>ফোন</strong><a href="tel:+8801740501062">+880 1740-501062</a></li><li><strong>ইমেইল</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul>`,
};

/* ── Payment-marks row (inserted just before .footer-bottom) ───────────────── */
const PAY = {
  en: `<div class="footer-pay"><p class="footer-pay-label">We accept</p><div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="bKash" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="Nagad" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="Visa" loading="lazy"></div></div>`,
  bn: `<div class="footer-pay"><p class="footer-pay-label">আমরা গ্রহণ করি</p><div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="বিকাশ" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="নগদ" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="ভিসা" loading="lazy"></div></div>`,
};

/* ── Social row (after the address block). Facebook is live; the other three ──
   are inactive placeholders (social-placeholder) until their URLs are known.
   Update FACEBOOK_URL once confirmed. */
const FACEBOOK_URL = "https://www.facebook.com/emarket247";
const ICON = {
  fb: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.18 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>`,
  li: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.05.85.13V9.4a6.33 6.33 0 0 0-.85-.05A6.34 6.34 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.5z"/></svg>`,
};
const social = {
  en: `<div class="footer-social" aria-label="Social media"><a class="social-link" href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" aria-label="eMarket247 on Facebook">${ICON.fb}</a><span class="social-placeholder" aria-hidden="true" title="Instagram — coming soon">${ICON.ig}</span><span class="social-placeholder" aria-hidden="true" title="LinkedIn — coming soon">${ICON.li}</span><span class="social-placeholder" aria-hidden="true" title="TikTok — coming soon">${ICON.tt}</span></div>`,
  bn: `<div class="footer-social" aria-label="সোশ্যাল মিডিয়া"><a class="social-link" href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" aria-label="Facebook-এ eMarket247">${ICON.fb}</a><span class="social-placeholder" aria-hidden="true" title="Instagram — শীঘ্রই আসছে">${ICON.ig}</span><span class="social-placeholder" aria-hidden="true" title="LinkedIn — শীঘ্রই আসছে">${ICON.li}</span><span class="social-placeholder" aria-hidden="true" title="TikTok — শীঘ্রই আসছে">${ICON.tt}</span></div>`,
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
let addrAdded = 0, payAdded = 0, socialAdded = 0, skipped = 0;

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

  // 2. Social row — after the address block (which we add in step 1), else after brand blurb.
  if (!s.includes("footer-social")) {
    if (s.includes("footer-address")) {
      // insert right after the closing </ul> of the address block
      s = s.replace(/(<ul class="footer-address">[\s\S]*?<\/ul>)/, "$1" + social[lang]);
      if (s.includes("footer-social")) { socialAdded++; changed = true; }
    }
  }

  // 3. Payment row — before the footer-bottom bar.
  if (!s.includes("footer-pay") && s.includes('<div class="footer-bottom">')) {
    s = s.replace('<div class="footer-bottom">', PAY[lang] + '<div class="footer-bottom">');
    payAdded++; changed = true;
  }

  if (changed) writeFileSync(file, s, "utf8");
}

console.log(`pages scanned: ${pages.length}`);
console.log(`admin skipped: ${skipped}`);
console.log(`address added: ${addrAdded}`);
console.log(`social row added: ${socialAdded}`);
console.log(`payment row added: ${payAdded}`);
