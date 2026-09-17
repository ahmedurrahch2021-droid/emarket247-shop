/**
 * patch-pdp-aggregate-offer.cjs
 * Removes fabricated AggregateOffer JSON-LD from all static PDP HTML files.
 *
 * All 27 products have is_price_pending=1 / price=NULL — no offer may be
 * published. This script removes the hardcoded offer block from every
 * EN and BN product page so that structured data matches the live page.
 *
 * Run: node scripts/patch-pdp-aggregate-offer.cjs
 */

const { readFileSync, writeFileSync, existsSync, readdirSync } = require("fs");
const { resolve } = require("path");

const ROOT = resolve(__dirname, "..", "public_html");

// Pattern matches the exact AggregateOffer block found in existing PDPs
const OFFER_RE = /"offers":\{"@type":"AggregateOffer","lowPrice":"[^"]+","highPrice":"[^"]+","priceCurrency":"BDT","availability":"https:\/\/schema\.org\/InStock"\},?/g;

let patched = 0;
let clean = 0;

for (const lang of ["en", "bn"]) {
  const base = resolve(ROOT, lang, "products");
  if (!existsSync(base)) {
    console.warn(`Directory not found: ${base}`);
    continue;
  }

  const entries = readdirSync(base);
  for (const entry of entries) {
    const file = resolve(base, entry, "index.html");
    if (!existsSync(file)) continue;

    let html = readFileSync(file, "utf8");
    if (OFFER_RE.test(html)) {
      html = html.replace(OFFER_RE, "");
      writeFileSync(file, html, "utf8");
      patched++;
      console.log(`PATCHED  ${lang}/products/${entry}/`);
    } else {
      clean++;
    }
  }
}

console.log(`\nDone — ${patched} patched, ${clean} already clean.`);
