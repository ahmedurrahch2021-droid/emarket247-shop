// FINAL footer rebuild — one canonical footer on every content page (EN + BN).
// Preserves each page's newsletter + link columns; rebuilds the brand column
// (logo, then social row, then tagline), the Contact column (always LAST),
// the payment row, and the bottom bar. Idempotent. Skips admin.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";
const FB = "https://web.facebook.com/Emarket247bd";

const IC = {
  fb: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="#1877F2"/><path d="M16.5 12.6h-2.6v7.9h-3.3v-7.9H8.9V9.7h1.7V7.9c0-2 .9-3.4 3.4-3.4h2.1v3h-1.5c-.9 0-1.2.4-1.2 1.1v1.1h2.7l-.4 2.9z" fill="#fff"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><defs><linearGradient id="igx" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f9ce34"/><stop offset=".5" stop-color="#ee2a7b"/><stop offset="1" stop-color="#6228d7"/></linearGradient></defs><rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="url(#igx)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff"/></svg>`,
  li: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#0A66C2"/><path d="M7.1 9.6H4.4V19h2.7V9.6zM5.7 5.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM19.6 19h-2.7v-4.6c0-1.1-.4-1.9-1.4-1.9-.8 0-1.2.5-1.4 1-.1.2-.1.5-.1.8V19h-2.7V9.6H14v1.2c.4-.6 1-1.4 2.5-1.4 1.8 0 3.1 1.2 3.1 3.7V19z" fill="#fff"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill="#010101"/><path d="M16.8 8.9a4.1 4.1 0 0 1-2.4-3.4V4.3h-2.7v10.5a2.3 2.3 0 1 1-2.3-2.3c.24 0 .47.04.68.1V6.6a5.9 5.9 0 0 0-.68-.04A5.86 5.86 0 1 0 15.2 12V7.7a6.7 6.7 0 0 0 3.9 1.2V6.2c-.3 0-.6-.02-.9-.07z" fill="#EE1D52"/></svg>`,
};

const socialRow = (l) =>
  `<div class="footer-social" aria-label="${l === "bn" ? "সোশ্যাল মিডিয়া" : "Social media"}">` +
  `<a class="social-link" href="${FB}" target="_blank" rel="noopener noreferrer" aria-label="eMarket247 on Facebook">${IC.fb}</a>` +
  `<span class="social-placeholder" title="Instagram — coming soon">${IC.ig}</span>` +
  `<span class="social-placeholder" title="LinkedIn — coming soon">${IC.li}</span>` +
  `<span class="social-placeholder" title="TikTok — coming soon">${IC.tt}</span></div>`;

const contactCol = (l) =>
  `<div class="footer-contact"><h3>${l === "bn" ? "যোগাযোগ" : "Contact"}</h3><ul class="footer-address">` +
  `<li><strong>${l === "bn" ? "ঠিকানা" : "Address"}</strong>${l === "bn" ? "কালুকাত্রা, ইয়াকুবপুর, ঠাকুরগাঁও, বাংলাদেশ" : "Kalukhali, Yakubpur, Thakurgaon, Bangladesh"}</li>` +
  `<li><strong>${l === "bn" ? "ফোন" : "Phone"}</strong><a href="tel:+8801740501062">+880 1740-501062</a></li>` +
  `<li><strong>${l === "bn" ? "ইমেইল" : "Email"}</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul></div>`;

const payRow = (l) =>
  `<div class="footer-pay">${socialRow(l)}<p class="footer-pay-label">${l === "bn" ? "আমরা গ্রহণ করি" : "We accept"}</p>` +
  `<div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="${l === "bn" ? "বিকাশ" : "bKash"}" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="${l === "bn" ? "নগদ" : "Nagad"}" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="${l === "bn" ? "ভিসা" : "Visa"}" loading="lazy"><span class="cod-chip">${l === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}</span></div></div>`;

const bottomBar =
  `<div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p>` +
  `<p>Site developed by <strong>FarhanMumeen</strong></p></div>`;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["assets", "api"].includes(e.name)) walk(p, out); }
    else if (e.name === "index.html") out.push(p);
  }
  return out;
};

const pages = walk(root);
let done = 0, skipped = 0, problems = [];

for (const file of pages) {
  if (/[\\/]admin[\\/]/.test(file)) { skipped++; continue; }
  const l = /[\\/]bn[\\/]/.test(file) ? "bn" : "en";
  let s = readFileSync(file, "utf8");

  const footerStart = s.indexOf('<footer class="site-footer">');
  const footerEnd = s.indexOf("</footer>", footerStart);
  if (footerStart === -1 || footerEnd === -1) { problems.push("no-footer:" + file.slice(root.length)); continue; }

  const footer = s.slice(footerStart, footerEnd + "</footer>".length);

  // Extract the newsletter block (keep as-is; Task 4 standardised it).
  const nlM = footer.match(/<section class="newsletter">[\s\S]*?<\/section>/);
  const newsletter = nlM ? nlM[0] : "";

  // Extract the link columns: every <div>…<h3>…links…</div> that is NOT the
  // brand column and NOT the contact column. We capture them in order.
  const linkCols = [];
  const colRe = /<div>\s*<h3>[\s\S]*?<\/div>/g;
  let m;
  while ((m = colRe.exec(footer)) !== null) linkCols.push(m[0].trim());
  // Drop any captured contact column (we rebuild it) — contact cols use class.
  const cleanCols = linkCols.filter((c) => !/footer-contact/.test(c));
  if (cleanCols.length === 0) { problems.push("no-cols:" + file.slice(root.length)); continue; }

  // Brand column: logo + social row + tagline.
  const tagM = footer.match(/<img src="\/assets\/images\/brand\/emarket247-logo-transparent\.png"[^>]*>\s*(?:<p>([\s\S]*?)<\/p>)?/);
  const tagline = tagM && tagM[1] ? tagM[1].trim() : (l === "bn" ? "প্রতিটি মুহূর্তের জন্য আধুনিক জুয়েলারি গন্তব্য।" : "A modern destination for jewellery that carries the moment.");
  const brandCol =
    `<div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion &amp; Jewellery">` +
    socialRow(l) +
    `<p>${tagline}</p></div>`;

  const newFooter =
    `<footer class="site-footer">\n` + newsletter + `\n` +
    `<div class="footer-main">` + brandCol + cleanCols.join("") + contactCol(l) + `</div>\n` +
    payRow(l) + "\n" + bottomBar + `\n</footer>`;

  s = s.slice(0, footerStart) + newFooter + s.slice(footerEnd + "</footer>".length);
  writeFileSync(file, s, "utf8");
  done++;
}

console.log(`pages scanned: ${pages.length}`);
console.log(`admin skipped: ${skipped}`);
console.log(`rebuilt: ${done}`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 15).forEach((p) => console.log("  " + p));
