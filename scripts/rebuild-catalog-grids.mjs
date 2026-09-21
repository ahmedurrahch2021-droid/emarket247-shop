#!/usr/bin/env node
/**
 * rebuild-catalog-grids.mjs
 *
 * Regenerates the pre-rendered product cards AND the ItemList structured data of
 * the shop page and the seven core category pages, in both languages, from
 * catalog.taxonomy.json and catalog.<lang>.json ONLY.
 *
 * WHY THIS EXISTS
 *   Product cards and their ItemList markup were previously written from the
 *   category word inside a product's URL slug. Several published slugs carry the
 *   name of a category the product is not in (emarket247-necklaces-16 is a
 *   bracelet, emarket247-earrings-32 is a jewellery set), so those pages
 *   advertised the wrong categories and the wrong item counts to shoppers and to
 *   search engines. Category now comes from the audited taxonomy, and every
 *   field comes from the reviewed catalogue record for that slug.
 *
 * WHY THE MARKUP IS SHAPED LIKE THIS
 *   site.js renders the same cards client-side from /api/products.php with the
 *   catalogue snapshot as fallback, and it deliberately keeps pre-rendered cards
 *   when the API is unavailable ("the last line of defence"). The card markup
 *   below therefore mirrors the productCard() renderer in site.js, so the static
 *   and scripted views agree. The one deliberate difference is the wishlist
 *   button, which depends on browser state and is added at runtime.
 *
 * ORDER
 *   Products keep the order they have in catalog.taxonomy.json, which is the
 *   order the live pages already use, so regenerating only changes what was
 *   actually wrong.
 *
 * USAGE
 *   node scripts/rebuild-catalog-grids.mjs           # write
 *   node scripts/rebuild-catalog-grids.mjs --check   # exit 0 if nothing would change
 *
 * Idempotent: a second run changes nothing.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "public_html");
const DATA = join(ROOT, "assets", "data");
const SITE_ORIGIN = "https://emarket247.shop";

const checkOnly = process.argv.includes("--check");

// ── The seven core categories this script owns ────────────────────────────────
// bridal-jewellery and gift-jewellery are editorial landing pages with no
// published products; they are deliberately not regenerated here.
const CORE_CATEGORIES = [
  "rings",
  "bangles",
  "jewellery-sets",
  "bracelets",
  "necklaces",
  "earrings",
  "pendants",
];

const CATEGORY_PAGE_TITLE = {
  rings: { en: "Rings", bn: "আংটি" },
  bangles: { en: "Bangles", bn: "চুড়ি" },
  "jewellery-sets": { en: "Jewellery Sets", bn: "জুয়েলারি সেট" },
  bracelets: { en: "Bracelets", bn: "ব্রেসলেট" },
  necklaces: { en: "Necklaces", bn: "হার" },
  earrings: { en: "Earrings", bn: "কানের দুল" },
  pendants: { en: "Pendants", bn: "লকেট" },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const readJson = (file) => JSON.parse(readFileSync(join(DATA, file), "utf8"));
const taxonomy = readJson("catalog.taxonomy.json");
const catalogs = { en: readJson("catalog.en.json"), bn: readJson("catalog.bn.json") };

const fail = (message) => {
  console.error(`rebuild-catalog-grids: ${message}`);
  process.exit(2);
};

if (!Array.isArray(taxonomy.products) || !taxonomy.products.length) {
  fail("catalog.taxonomy.json has no products — refusing to guess.");
}

const taxonomyBySlug = new Map(taxonomy.products.map((p) => [p.slug, p]));
const recordBySlug = {
  en: new Map(catalogs.en.products.map((p) => [p.slug, p])),
  bn: new Map(catalogs.bn.products.map((p) => [p.slug, p])),
};

// Every ready product must be described by the taxonomy, and every taxonomy row
// must agree with its catalogue record. A mismatch is a data bug, not something
// this script should paper over.
const ready = { en: [], bn: [] };
for (const lang of ["en", "bn"]) {
  for (const entry of taxonomy.products) {
    const record = recordBySlug[lang].get(entry.slug);
    if (!record) fail(`${lang}: ${entry.slug} is in the taxonomy but not in catalog.${lang}.json`);
    if (record.status !== "ready") continue;
    if (record.category !== entry.category) {
      fail(
        `${lang}: ${entry.slug} taxonomy category "${entry.category}" but catalogue category "${record.category}"`
      );
    }
    ready[lang].push({ entry, record });
  }
  if (ready[lang].length !== taxonomy.publishedProductCount) {
    fail(
      `${lang}: ${ready[lang].length} ready products but the taxonomy declares ${taxonomy.publishedProductCount}`
    );
  }
}

// ── Card markup (mirrors productCard() in site.js) ────────────────────────────

const esc = (value) =>
  String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char]);

// The WhatsApp glyph is the same artwork the scripted card uses; the assertion
// below makes drift between the two a loud failure instead of a silent one.
const WA_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
{
  const siteJs = readFileSync(join(ROOT, "assets", "js", "site.js"), "utf8");
  if (!siteJs.includes(WA_PATH)) {
    fail("the WhatsApp icon path no longer matches the one in assets/js/site.js — re-sync the card markup");
  }
}
const WA_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;

function cardHtml(record, lang) {
  const bn = lang === "bn";
  const pdpUrl = `/${lang}/products/${esc(record.slug)}/`;
  const ctaText = bn ? "বিস্তারিত দেখুন →" : "View detail →";
  const waMsg = bn
    ? `হ্যালো eMarket247, আমি ${record.title} (রেফারেন্স: ${record.id}, লিঙ্ক: ${SITE_ORIGIN}/${lang}/products/${record.slug}/) অর্ডার বা তথ্য জানতে আগ্রহী।`
    : `Hello eMarket247, I want to inquire about ${record.title} (Ref: ${record.id}, Link: ${SITE_ORIGIN}/${lang}/products/${record.slug}/).`;
  const waUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waMsg)}`;

  const priceNum = Number(record.price);
  const isPending = !(priceNum > 0);
  const priceText = isPending
    ? bn
      ? "মূল্য জানতে যোগাযোগ করুন"
      : "Price on request"
    : `৳${priceNum.toLocaleString("en-US")}`;

  const image = record.image || {};
  const srcset = image.srcset || image.src;

  return `<article class="product-card" data-product-id="${esc(record.id)}">
      <a class="product-card-media" href="${pdpUrl}" aria-label="${esc(record.title)}">
        <img src="${esc(image.src)}" srcset="${esc(srcset)}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 33vw" width="${esc(image.width)}" height="${esc(image.height)}" loading="lazy" alt="${esc(image.alt)}">
        <span class="product-card-badge">${esc(record.id)}</span>
      </a>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-cat">${esc(record.categoryLabel)}</span>
          <span class="product-card-status">● ${bn ? "প্রস্তুত" : "Ready"}</span>
        </div>
        <h3 class="product-card-title"><a href="${pdpUrl}">${esc(record.title)}</a></h3>
        <small class="product-card-desc">${esc(image.caption)}</small>
        <p class="product-card-price${isPending ? " is-pending" : ""}">${priceText}</p>
      </div>
      <div class="product-card-actions">
        <button type="button" class="product-card-add-btn" data-add-bag="${esc(record.id)}" data-product-title="${esc(record.title)}" data-product-slug="${esc(record.slug)}" data-product-image="${esc(image.src)}" data-product-cat="${esc(record.categoryLabel)}" aria-label="${bn ? "ব্যাগে যোগ করুন: " + esc(record.title) : "Add to bag: " + esc(record.title)}">
          <span class="btn-icon">+</span> <span class="btn-label">${bn ? "ব্যাগে যোগ" : "Add to Bag"}</span>
        </button>
        <a class="product-card-wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer" aria-label="${bn ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}" title="${bn ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}">
          ${WA_ICON}
        </a>
        <a class="product-card-cta" href="${pdpUrl}">${ctaText}</a>
      </div>
    </article>`;
}

function gridHtml(scope, lang) {
  const list = scope
    ? ready[lang].filter(({ entry }) => entry.category === scope)
    : ready[lang];
  return list.map(({ record }) => cardHtml(record, lang)).join("\n    ");
}

function itemListHtml(scope, lang, canonicalPath) {
  const list = scope
    ? ready[lang].filter(({ entry }) => entry.category === scope)
    : ready[lang];
  const node = {
    "@type": "ItemList",
    "@id": `${SITE_ORIGIN}/${lang}/${canonicalPath}/#products`,
    numberOfItems: list.length,
    itemListElement: list.map(({ record }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: record.title,
      image: record.image.src.startsWith("http")
        ? record.image.src
        : `${SITE_ORIGIN}${record.image.src}`,
    })),
  };
  return JSON.stringify(node);
}

// ── Page surgery ──────────────────────────────────────────────────────────────

/** Inner HTML of the first <div class="product-grid" …> … </div>. */
function replaceGrid(html, inner, rel) {
  const start = html.indexOf('<div class="product-grid"');
  if (start < 0) fail(`${rel}: no <div class="product-grid"> found`);
  const openEnd = html.indexOf(">", start) + 1;
  const token = /<div\b[^>]*>|<\/div>/g;
  token.lastIndex = openEnd;
  let depth = 1;
  let match;
  while ((match = token.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, openEnd) + inner + html.slice(match.index);
      }
    } else {
      depth += 1;
    }
  }
  return fail(`${rel}: unbalanced <div class="product-grid">`);
}

/** Replaces the ItemList node inside the page's JSON-LD @graph. */
function replaceItemList(html, replacement, rel) {
  const open = /<script type="application\/ld\+json"[^>]*>/.exec(html);
  if (!open) fail(`${rel}: no JSON-LD block`);
  const bodyStart = open.index + open[0].length;
  const bodyEnd = html.indexOf("</script>", bodyStart);
  if (bodyEnd < 0) fail(`${rel}: unterminated JSON-LD block`);

  const raw = html.slice(bodyStart, bodyEnd);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`${rel}: JSON-LD is not parseable (${error.message})`);
  }
  const nodes = parsed["@graph"] || [parsed];
  const index = nodes.findIndex(
    (node) => node["@type"] === "ItemList" && String(node["@id"] || "").endsWith("#products")
  );
  if (index < 0) fail(`${rel}: JSON-LD has no ItemList with a #products @id`);

  nodes[index] = JSON.parse(replacement);
  // Re-serialising the whole graph is safe: parse -> stringify round-trips the
  // untouched nodes byte-for-byte, which is what keeps this script idempotent.
  const next = JSON.stringify(parsed);
  return html.slice(0, bodyStart) + next + html.slice(bodyEnd);
}

// ── Targets ───────────────────────────────────────────────────────────────────

const targets = [];
for (const lang of ["en", "bn"]) {
  targets.push({ lang, scope: null, canonicalPath: "shop", rel: `${lang}/shop/index.html` });
  for (const category of CORE_CATEGORIES) {
    targets.push({
      lang,
      scope: category,
      canonicalPath: `categories/${category}`,
      rel: `${lang}/categories/${category}/index.html`,
    });
  }
}

let changed = [];
let unchanged = [];

for (const { lang, scope, canonicalPath, rel } of targets) {
  const file = join(ROOT, rel);
  if (!existsSync(file)) fail(`${rel}: page does not exist`);
  const before = readFileSync(file, "utf8");

  let after = replaceGrid(before, gridHtml(scope, lang), rel);
  after = replaceItemList(after, itemListHtml(scope, lang, canonicalPath), rel);

  if (after === before) {
    unchanged.push(rel);
    continue;
  }
  changed.push(rel);
  if (!checkOnly) writeFileSync(file, after, "utf8");
}

// ── Report ────────────────────────────────────────────────────────────────────

const counts = CORE_CATEGORIES.map(
  (c) => `${c} ${ready.en.filter(({ entry }) => entry.category === c).length}`
).join(", ");

console.log(`rebuild-catalog-grids${checkOnly ? " --check" : ""}`);
console.log(`  scope: shop ${ready.en.length}, ${counts}`);
console.log(`  ${unchanged.length} pages already match, ${changed.length} pages ${checkOnly ? "would change" : "updated"}`);
for (const rel of changed) console.log(`    ${checkOnly ? "would update" : "updated"} ${rel}`);

if (checkOnly && changed.length) {
  console.log("\nDrift detected. Run without --check to regenerate.");
  process.exit(1);
}
console.log(checkOnly ? "\nNo drift: every grid and ItemList matches the taxonomy." : "\nDone.");
