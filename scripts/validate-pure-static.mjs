import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "static-site");
const errors = [];
const htmlFiles = [];
async function walk(folder) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walk(file);
    else if (entry === "index.html") htmlFiles.push(file);
  }
}
await walk(root);
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (relative === "index.html") continue;
  for (const [label, pattern] of [
    ["lang", /<html lang="(?:en|bn)"/], ["title", /<title>[^<]+<\/title>/],
    ["description", /<meta name="description" content="[^"]+">/], ["canonical", /<link rel="canonical" href="https:\/\/emarket247\.shop\//],
    ["hreflang en", /hreflang="en"/], ["hreflang bn", /hreflang="bn"/], ["h1", /<h1>[^<]+<\/h1>/], ["skip link", /class="skip-link"/],
  ]) if (!pattern.test(html)) errors.push(`${relative}: missing ${label}`);
  for (const [label, pattern] of [["Home navigation", />Home<\/a>/], ["Occasion navigation", />Occasion(?:<span|<\/button)/], ["Contact navigation", />Contact<\/a>/]]) {
    if (relative.startsWith("en/") && !pattern.test(html)) errors.push(`${relative}: missing ${label}`);
  }
  if (!relative.endsWith("/index.html") && !/^(en|bn)\/index\.html$/.test(relative) && !/class="breadcrumb/.test(html)) errors.push(`${relative}: missing breadcrumb`);
}
for (const route of [
  "en/occasions/index.html", "en/occasions/wedding/index.html", "en/occasions/anniversary/index.html", "en/occasions/birthday/index.html", "en/categories/bridal-jewellery/index.html",
  "bn/occasions/index.html", "bn/occasions/wedding/index.html", "bn/occasions/anniversary/index.html", "bn/occasions/birthday/index.html", "bn/categories/bridal-jewellery/index.html",
]) {
  try { await stat(path.join(root, route)); } catch { errors.push(`missing audited route: ${route}`); }
}
for (const asset of ["assets/images/brand/emarket247-logo-transparent.png", "assets/images/brand/emarket247-favicon-master.png", "assets/images/editorial/emarket247-hero-vermilion-atelier.webp", "assets/data/catalog.en.json", "assets/data/catalog.bn.json", "robots.txt", "sitemap.xml", ".htaccess", "404.html"]) {
  try { await stat(path.join(root, asset)); } catch { errors.push(`missing package asset: ${asset}`); }
}

// Hostinger routing: an unknown URL must return a genuine 404, never a soft-404 homepage.
const htaccess = await readFile(path.join(root, ".htaccess"), "utf8");
if (!/^\s*ErrorDocument\s+404\s+\/404\.html\s*$/m.test(htaccess)) errors.push(".htaccess: missing ErrorDocument 404 /404.html");
if (/RewriteRule\s+\^\s+index\.html/.test(htaccess)) errors.push(".htaccess: single-page-application catch-all rewrite would create soft-404s");

// Phase 1 guard: the stylesheet must be complete on first paint. Re-introducing a
// runtime-injected <style> element brings back the flash of re-laid-out content.
const siteJs = await readFile(path.join(root, "assets/js/site.js"), "utf8");
if (/createElement\((["'])style\1\)/.test(siteJs)) {
  errors.push("assets/js/site.js: injects CSS at runtime; move those rules into assets/css/site.css");
}

// Phase 1 guard: css/js are cached for a year, so every reference must carry the
// ?v= content hash. A missing hash means a returning visitor can be served a
// stale stylesheet alongside an updated script.
const versionedFiles = [];
async function walkVersioned(folder) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walkVersioned(file);
    else if (entry.endsWith(".html")) versionedFiles.push(file);
  }
}
await walkVersioned(root);
for (const file of versionedFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  for (const reference of html.match(/(?:href|src)="(\/assets\/(?:css|js)\/[^"]*)"/g) || []) {
    const url = reference.replace(/^(?:href|src)="/, "").replace(/"$/, "");
    if (!/\?v=[0-9a-f]{6,}$/.test(url)) errors.push(`${relative}: asset reference without ?v= content hash: ${url}`);
  }
}

// Every root-relative reference inside a served file must resolve to a file in the package.
const servedFiles = [];
async function walkAll(folder) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walkAll(file);
    else if (/\.(html|css|js|json|xml)$/.test(entry)) servedFiles.push(file);
  }
}
await walkAll(root);
for (const file of servedFiles) {
  const text = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  const targets = new Set();
  // href/src attributes, plus srcset/JSON candidate lists which hold several
  // comma-separated "url 600w" descriptors inside a single quoted value.
  for (const reference of text.match(/(?:href|src|srcset)="([^"]*)"|"(\/assets\/[^"]*)"/g) || []) {
    const value = reference.replace(/^(?:href|src|srcset)="/, "").replace(/^"/, "").replace(/"$/, "");
    for (const candidate of value.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url.startsWith("/") && !url.startsWith("//")) targets.add(url.split(/[?#]/)[0]);
    }
  }
  for (const target of targets) {
    const resolved = target.endsWith("/") ? path.join(root, target, "index.html") : path.join(root, target);
    try { await stat(resolved); } catch { errors.push(`${relative}: broken local reference ${target}`); }
  }
}
for (const filename of ["emarket247-jewellery-detail-01-600-square.webp", "emarket247-jewellery-detail-01-1200-square.webp"]) {
  try { await stat(path.join(root, "assets/images/products-square", filename)); } catch { errors.push(`missing catalog image asset: ${filename}`); }
}

// Phase 2 guard: the bilingual catalogue must keep the extended product schema without
// invented commerce data. Prices, SKUs, availability, materials, sizes, variants, and
// gallery images stay null / empty until the business provides approved values.
const phase2Fields = ["id", "slug", "sku", "category", "categoryLabel", "title", "description", "price", "compareAtPrice", "currency", "availability", "materials", "sizes", "variants", "image", "gallery", "seo"];
const nullFields = ["sku", "price", "compareAtPrice", "availability"];
const arrayFields = ["materials", "sizes", "variants", "gallery"];
const enCatalog = JSON.parse(await readFile(path.join(root, "assets/data/catalog.en.json"), "utf8"));
const bnCatalog = JSON.parse(await readFile(path.join(root, "assets/data/catalog.bn.json"), "utf8"));
if (enCatalog.products.length !== 48) errors.push(`catalog.en.json: expected 48 products, found ${enCatalog.products.length}`);
if (bnCatalog.products.length !== 48) errors.push(`catalog.bn.json: expected 48 products, found ${bnCatalog.products.length}`);
if (JSON.stringify(enCatalog.products.map((p) => p.id)) !== JSON.stringify(bnCatalog.products.map((p) => p.id))) errors.push("catalog.en.json / catalog.bn.json: product id lists differ");
const expectedCategoryCounts = { "jewellery-detail": 27, bangles: 14, necklaces: 4, bracelets: 2, earrings: 1 };
const enCategoryCounts = {};
for (const product of enCatalog.products) enCategoryCounts[product.category] = (enCategoryCounts[product.category] || 0) + 1;
for (const [category, expected] of Object.entries(expectedCategoryCounts)) {
  if (enCategoryCounts[category] !== expected) errors.push(`catalog.en.json: category ${category} count ${enCategoryCounts[category] ?? 0} !== expected ${expected}`);
}
const emptyCategories = ["rings", "pendants", "jewellery-sets", "gift-jewellery", "bridal-jewellery"];
for (const category of emptyCategories) {
  if (enCategoryCounts[category]) errors.push(`catalog.en.json: category ${category} should stay empty pending a business decision`);
  for (const lang of ["en", "bn"]) {
    const page = path.join(root, lang, "categories", category, "index.html");
    const html = await readFile(page, "utf8");
    if (!/<meta name="robots" content="noindex,follow">/.test(html)) errors.push(`${lang}/categories/${category}/: expected temporary noindex,follow on empty category`);
  }
}
const sitemapText = await readFile(path.join(root, "sitemap.xml"), "utf8");
for (const category of emptyCategories) {
  for (const lang of ["en", "bn"]) {
    if (sitemapText.includes(`/${lang}/categories/${category}/`)) errors.push(`sitemap.xml: empty category /${lang}/categories/${category}/ should be excluded while noindexed`);
  }
}
for (const [label, catalog] of [["en", enCatalog], ["bn", bnCatalog]]) {
  for (const product of catalog.products) {
    for (const field of phase2Fields) if (!(field in product)) errors.push(`catalog.${label}.json ${product.id}: missing phase 2 field "${field}"`);
    if (product.currency !== "BDT") errors.push(`catalog.${label}.json ${product.id}: currency must be "BDT"`);
    for (const field of nullFields) if (product[field] !== null) errors.push(`catalog.${label}.json ${product.id}: "${field}" must be null until approved`);
    for (const field of arrayFields) if (!Array.isArray(product[field]) || product[field].length !== 0) errors.push(`catalog.${label}.json ${product.id}: "${field}" must be an empty array until approved`);
    if (!product.seo || typeof product.seo.title !== "string" || !product.seo.title || typeof product.seo.description !== "string") errors.push(`catalog.${label}.json ${product.id}: seo.title and seo.description must be non-empty strings`);
  }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML pages, language alternates, baseline metadata, accessibility skip links, and core static assets.`);
