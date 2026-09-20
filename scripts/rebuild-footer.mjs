// FINAL footer rebuild — one canonical footer on every content page (EN + BN).
// Preserves each page's newsletter + link columns; rebuilds the brand column
// (logo, then tagline, then social row), the Contact column (always LAST),
// the payment row, and the bottom bar. Idempotent. Skips admin.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";
const FB = "https://web.facebook.com/Emarket247bd";

const IC = {
  fb: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="#0866FF"/><path d="M13.65 23.83v-9.17h3.08l.46-3.58h-3.54V8.8c0-1.04.29-1.74 1.77-1.74h1.89V3.86c-.33-.04-1.45-.14-2.76-.14-2.73 0-4.6 1.67-4.6 4.73v2.64H6.87v3.58h3.08v9.17A12.06 12.06 0 0 0 12 24c.56 0 1.11-.04 1.65-.17z" fill="#FFFFFF"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#FFD521"/><stop offset="30%" stop-color="#F50000"/><stop offset="65%" stop-color="#B900B4"/><stop offset="100%" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-grad)"/><rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.5" fill="none" stroke="#FFFFFF" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="#FFFFFF" stroke-width="1.8"/><circle cx="17.1" cy="6.9" r="1.1" fill="#FFFFFF"/></svg>`,
  li: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="4.8" fill="#0A66C2"/><path d="M5.5 8.5h2.8V18H5.5V8.5zM6.9 4.8a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zM18.5 18h-2.8v-4.7c0-1.2-.4-2-1.5-2-.8 0-1.3.6-1.5 1.1-.1.2-.1.5-.1.8V18H9.8V8.5h2.8v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.2 1.3 3.2 4.1V18z" fill="#FFFFFF"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="5" fill="#000000"/><g fill-rule="evenodd"><path d="M16.6 8.5c-.8-.4-1.4-1.1-1.6-2V4.5h-2.5v10.3a2.3 2.3 0 1 1-2.3-2.3c.2 0 .5.04.7.1V7.1a5.6 5.6 0 0 0-.7-.04 5.8 5.8 0 1 0 5.8 5.8V7.5c1.1.8 2.5 1.3 4 1.3V6.3c-.5 0-1-.1-1.4-.3z" fill="#FE2C55"/><path d="M16.2 8.1c-.8-.4-1.4-1.1-1.6-2V4.1h-2.5v10.3a2.3 2.3 0 1 1-2.3-2.3c.2 0 .5.04.7.1V6.7a5.6 5.6 0 0 0-.7-.04 5.8 5.8 0 1 0 5.8 5.8V7.1c1.1.8 2.5 1.3 4 1.3V5.9c-.5 0-1-.1-1.4-.3z" fill="#25F4EE"/><path d="M16.4 8.3c-.8-.4-1.4-1.1-1.6-2V4.3h-2.5v10.3a2.3 2.3 0 1 1-2.3-2.3c.2 0 .5.04.7.1V6.9a5.6 5.6 0 0 0-.7-.04 5.8 5.8 0 1 0 5.8 5.8V7.3c1.1.8 2.5 1.3 4 1.3V6.1c-.5 0-1-.1-1.4-.3z" fill="#FFFFFF"/></g></svg>`,
};

const socialRow = (l) =>
  `<div class="footer-social" aria-label="${l === "bn" ? "সোশ্যাল মিডিয়া" : "Social media"}">` +
  `<a class="social-link" href="${FB}" target="_blank" rel="noopener noreferrer" aria-label="${l === "bn" ? "eMarket247 Facebook-এ" : "eMarket247 on Facebook"}">${IC.fb}</a>` +
  `<span class="social-placeholder" title="${l === "bn" ? "Instagram — শীঘ্রই আসছে" : "Instagram — coming soon"}">${IC.ig}</span>` +
  `<span class="social-placeholder" title="${l === "bn" ? "LinkedIn — শীঘ্রই আসছে" : "LinkedIn — coming soon"}">${IC.li}</span>` +
  `<span class="social-placeholder" title="${l === "bn" ? "TikTok — শীঘ্রই আসছে" : "TikTok — coming soon"}">${IC.tt}</span></div>`;

const contactCol = (l) =>
  `<div class="footer-contact"><h3>${l === "bn" ? "যোগাযোগ" : "Contact"}</h3><ul class="footer-address">` +
  `<li><strong>${l === "bn" ? "ঠিকানা" : "Address"}</strong>${l === "bn" ? "কালুক্ষেত্র, ইয়াকুবপুর, ঠাকুরগাঁও, বাংলাদেশ" : "Kalukhetra, Yakubpur, Thakurgaon, Bangladesh"}</li>` +
  `<li><strong>${l === "bn" ? "ফোন" : "Phone"}</strong><a href="tel:+8801740501062">+880 1740-501062</a></li>` +
  `<li><strong>${l === "bn" ? "ইমেইল" : "Email"}</strong><a href="mailto:support@emarket247.shop">support@emarket247.shop</a></li></ul></div>`;

const payRow = (l) =>
  `<div class="footer-pay"><p class="footer-pay-label">${l === "bn" ? "আমরা গ্রহণ করি" : "We accept"}</p>` +
  `<div class="footer-pay-marks"><img src="/assets/images/payment/bkash.svg" width="108" height="60" alt="${l === "bn" ? "বিকাশ" : "bKash"}" loading="lazy"><img src="/assets/images/payment/nagad.svg" width="108" height="60" alt="${l === "bn" ? "নগদ" : "Nagad"}" loading="lazy"><img src="/assets/images/payment/visa.svg" width="108" height="60" alt="${l === "bn" ? "ভিসা" : "Visa"}" loading="lazy"><span class="cod-chip">${l === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}</span></div></div>`;

const bottomBar =
  `<div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p>` +
  `<p>This site is developed by FarhanMomen</p></div>`;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["assets", "api"].includes(e.name)) walk(p, out); }
    else if (e.name === "index.html" || e.name === "404.html") out.push(p);
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

  // Brand column: logo + tagline + social row.
  const tagM = footer.match(/<img src="\/assets\/images\/brand\/emarket247-logo-transparent\.png"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
  const tagline = tagM && tagM[1] ? tagM[1].trim() : (l === "bn" ? "প্রতিটি মুহূর্তের জন্য আধুনিক জুয়েলারি গন্তব্য।" : "A modern destination for jewellery that carries the moment.");
  const brandCol =
    `<div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion &amp; Jewellery">` +
    `<p>${tagline}</p>` +
    socialRow(l) +
    `</div>`;

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
