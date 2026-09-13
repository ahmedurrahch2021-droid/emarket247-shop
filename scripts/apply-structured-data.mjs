/**
 * Injects SEO/AEO structured data (JSON-LD) into the eMarket247 pure static site.
 *
 * Design goals:
 *  - Derive every value from real, visible page content (breadcrumbs, catalogue,
 *    canonicals, titles). Nothing is fabricated: no prices, no address, no socials,
 *    no search action that the site does not actually have.
 *  - Idempotent: re-running produces byte-identical output. Any prior JSON-LD block
 *    is removed and re-emitted, so this is safe to run after every content change.
 *  - Non-destructive: only a single <script type="application/ld+json"> is added
 *    before </head>. CSS/JS references are untouched, so the ?v= content hashes and
 *    the Phase 1 cache-busting guarantees are unaffected.
 *
 * Usage:
 *   node scripts/apply-structured-data.mjs           # write changes
 *   node scripts/apply-structured-data.mjs --check   # dry run, report only
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "static-site");
const SITE = "https://emarket247.shop";
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const PHONE = "+8801740501062"; // Real customer-care line, already used site-wide in assets/js/site.js
const check = process.argv.includes("--check");

/* ---------- small helpers ---------- */
const decodeEntities = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
    .trim();

const abs = (url) => (url?.startsWith("http") ? url : `${SITE}${url || ""}`);

// Serialise JSON-LD compactly and neutralise any "</script>" / "<!--" sequences.
const serialise = (graph) =>
  JSON.stringify(graph).replace(/</g, "\\u003c").replace(/-->/g, "--\\u003e");

async function walk(folder, out = []) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walk(file, out);
    else if (entry === "index.html" || entry === "404.html") out.push(file);
  }
  return out;
}

/* ---------- catalogue (for ItemList) ---------- */
const catalogs = {};
async function catalogFor(lang) {
  if (!catalogs[lang]) {
    const raw = await readFile(path.join(root, `assets/data/catalog.${lang}.json`), "utf8");
    catalogs[lang] = JSON.parse(raw).products || [];
  }
  return catalogs[lang];
}
// Mirror exactly what assets/js/site.js renders: status === "ready", optional category.
async function readyProducts(lang, category) {
  const products = await catalogFor(lang);
  return products.filter((p) => p.status === "ready" && (!category || p.category === category));
}

/* ---------- page classification ---------- */
function classify(relative) {
  const rel = relative.replace(/\\/g, "/");
  if (rel === "index.html" || rel === "en/index.html" || rel === "bn/index.html") return { kind: "home" };
  if (rel === "404.html") return { kind: "skip" };
  if (/(^|\/)studio-pilot\//.test(rel)) return { kind: "skip" }; // internal noindex,nofollow tool

  const parts = rel.split("/"); // e.g. en/categories/bangles/index.html
  const lang = parts[0] === "bn" ? "bn" : "en";
  const seg = parts.slice(1, -1); // drop lang + index.html

  if (seg[0] === "products" && seg.length === 2) return { kind: "product", lang, slug: seg[1] };
  if (seg[0] === "categories" && seg.length === 2) return { kind: "category", lang, category: seg[1] };
  if (seg[0] === "shop") return { kind: "listing", lang, pageType: "CollectionPage" };
  if (seg[0] === "categories") return { kind: "page", lang, pageType: "CollectionPage" };
  if (seg[0] === "occasions") return { kind: "page", lang, pageType: "CollectionPage" };
  if (seg[0] === "about") return { kind: "page", lang, pageType: "AboutPage" };
  if (seg[0] === "contact") return { kind: "page", lang, pageType: "ContactPage" };
  return { kind: "page", lang, pageType: "WebPage" };
}

/* ---------- extract facts from the HTML ---------- */
function extract(html) {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || null;
  const title = decodeEntities(html.match(/<title>([^<]+)<\/title>/)?.[1] || "");
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || null;
  const lang = html.match(/<html lang="(en|bn)"/)?.[1] || "en";

  // Visible breadcrumb -> ordered [{name, url|null}]
  let crumbs = null;
  const ol = html.match(/<nav class="breadcrumb[^"]*"[^>]*>\s*<ol>([\s\S]*?)<\/ol>/);
  if (ol) {
    crumbs = [];
    const liRe = /<li>(.*?)<\/li>/g;
    let li;
    while ((li = liRe.exec(ol[1]))) {
      const inner = li[1];
      const a = inner.match(/<a href="([^"]+)">([\s\S]*?)<\/a>/);
      const span = inner.match(/<span[^>]*>([\s\S]*?)<\/span>/);
      if (a) crumbs.push({ name: decodeEntities(a[2]), url: abs(a[1]) });
      else if (span) crumbs.push({ name: decodeEntities(span[1]), url: null });
    }
  }
  return { canonical, title, ogImage, lang, crumbs };
}

/* ---------- graph builders ---------- */
function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "eMarket247",
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/assets/images/brand/emarket247-logo-transparent.png`,
      width: 800,
      height: 418,
    },
    description:
      "eMarket247 is a bilingual (Bengali and English) fashion and jewellery destination in Bangladesh, offering bangles, necklaces, bracelets, earrings and gifting pieces.",
    areaServed: { "@type": "Country", name: "Bangladesh" },
    knowsLanguage: ["en", "bn"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["English", "Bengali"],
    },
  };
}
function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE,
    name: "eMarket247",
    publisher: { "@id": ORG_ID },
    inLanguage: ["en", "bn"],
  };
}
function breadcrumbNode(url, crumbs) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url || url,
    })),
  };
}
function itemListNode(url, products) {
  return {
    "@type": "ItemList",
    "@id": `${url}#products`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: decodeEntities(p.title),
      image: abs(p.image?.src),
    })),
  };
}
function webPageNode(url, pageType, title, lang, hasCrumbs, ogImage) {
  const node = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: title,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: lang,
  };
  if (hasCrumbs) node.breadcrumb = { "@id": `${url}#breadcrumb` };
  if (ogImage) node.primaryImageOfPage = abs(ogImage);
  return node;
}

/* ---------- build the graph for one page ---------- */
async function buildGraph(cls, facts) {
  const url = facts.canonical || SITE + "/";
  const graph = [];

  if (cls.kind === "home") {
    graph.push(organizationNode(), websiteNode());
    graph.push(webPageNode(url, "WebPage", facts.title, facts.lang, false, facts.ogImage));
    return graph;
  }

  if (cls.kind === "product") {
    const products = await catalogFor(cls.lang);
    const product = products.find((p) => p.slug === cls.slug);
    graph.push(webPageNode(url, "ItemPage", facts.title, facts.lang, !!facts.crumbs, facts.ogImage));
    if (facts.crumbs?.length) graph.push(breadcrumbNode(url, facts.crumbs));
    if (product) {
      const pNode = {
        "@type": "Product",
        "@id": `${url}#product`,
        name: decodeEntities(product.title),
        description: decodeEntities(product.seo?.description || product.description || ""),
        image: abs(product.image?.src),
        category: decodeEntities(product.categoryLabel),
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "eMarket247",
        },
      };
      graph.push(pNode);
    }
    return graph;
  }

  const pageType = cls.pageType || "CollectionPage";
  graph.push(webPageNode(url, pageType, facts.title, facts.lang, !!facts.crumbs, facts.ogImage));
  if (facts.crumbs?.length) graph.push(breadcrumbNode(url, facts.crumbs));

  if (cls.kind === "category") {
    const products = await readyProducts(cls.lang, cls.category);
    if (products.length) graph.push(itemListNode(url, products));
  } else if (cls.kind === "listing") {
    const products = await readyProducts(cls.lang, null);
    if (products.length) graph.push(itemListNode(url, products));
  }
  return graph;
}

/* ---------- inject into HTML (idempotent) ---------- */
function inject(html, graph) {
  // Remove any existing JSON-LD (the original home Org/WebSite block, or a prior run).
  let cleaned = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, "");
  const block = `<script type="application/ld+json" data-emk="ld">${serialise({
    "@context": "https://schema.org",
    "@graph": graph,
  })}</script>`;
  return cleaned.replace(/<\/head>/, `${block}</head>`);
}

/* ---------- run ---------- */
const files = await walk(root);
const summary = { processed: 0, skipped: 0, byType: {}, itemLists: 0, breadcrumbs: 0, changed: 0, errors: [] };

for (const file of files.sort()) {
  const relative = path.relative(root, file);
  const cls = classify(relative);
  if (cls.kind === "skip") { summary.skipped++; continue; }

  const html = await readFile(file, "utf8");
  const facts = extract(html);
  if (!facts.canonical && cls.kind !== "home") {
    summary.errors.push(`${relative}: no canonical URL found`);
    continue;
  }
  const graph = await buildGraph(cls, facts);

  // Validate every emitted node is serialisable / parseable.
  try { JSON.parse(serialise({ "@graph": graph }).replace(/\\u003c/g, "<")); }
  catch (e) { summary.errors.push(`${relative}: invalid JSON-LD (${e.message})`); continue; }

  const next = inject(html, graph);
  summary.processed++;
  summary.byType[cls.pageType || cls.kind] = (summary.byType[cls.pageType || cls.kind] || 0) + 1;
  if (graph.some((n) => n["@type"] === "ItemList")) summary.itemLists++;
  if (graph.some((n) => n["@type"] === "BreadcrumbList")) summary.breadcrumbs++;
  if (next !== html) {
    summary.changed++;
    if (!check) await writeFile(file, next, "utf8");
  }
}

console.log(check ? "DRY RUN (no files written)\n" : "WROTE structured data\n");
console.log(`Pages processed : ${summary.processed}`);
console.log(`Pages changed   : ${summary.changed}`);
console.log(`Pages skipped   : ${summary.skipped} (home/404 breadcrumb rules + studio-pilot)`);
console.log(`BreadcrumbList  : ${summary.breadcrumbs}`);
console.log(`ItemList        : ${summary.itemLists}`);
console.log(`By page type    :`, summary.byType);
if (summary.errors.length) {
  console.log(`\nERRORS (${summary.errors.length}):`);
  summary.errors.forEach((e) => console.log("  - " + e));
  process.exit(1);
}
