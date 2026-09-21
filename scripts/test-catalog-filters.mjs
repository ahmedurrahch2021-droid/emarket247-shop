#!/usr/bin/env node
/**
 * Catalogue filter integration test (real DOM, real site.js).
 *
 * Loads a fixture page into jsdom against a local static server, with a
 * scripted /api/products.php, and drives the shop grid the way a shopper does:
 * category tabs, the four facets, the price bands, search, sort, and the URL
 * that filtering writes back.
 *
 * The fixture page is served from memory rather than from a file, so the test
 * never writes anything into public_html. Everything under test is the shipped
 * assets/js/site.js — no copy, no stub of the code being verified.
 *
 * jsdom is intentionally not a project dependency — the storefront ships no
 * test framework. Install it temporarily and run:
 *
 *   npm install --no-save jsdom
 *   node scripts/test-catalog-filters.mjs
 *
 * Exit code 0 means every assertion passed.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "public_html");

const jsdom = await import("jsdom").catch(() => {
  console.error("jsdom is not installed. Run: npm install --no-save jsdom");
  process.exit(2);
});
const { JSDOM, VirtualConsole, ResourceLoader, requestInterceptor } = jsdom;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

// Eight pieces chosen so every facet has at least one member and so the price
// bands land exactly on their edges: 499 / 500 / 999 / 1000 are all present, and
// one piece has no confirmed price at all.
//
// Hand-checked facet marks (EN / BN):
//   TST-001  499  earrings     pearl / drop          single   পার্ল / ড্রপ
//   TST-002  500  rings        gold-tone / textured  single   সোনালি / খোদাই
//   TST-003  999  bangles      silver-tone / geometric / PAIR
//   TST-004 1000  bracelets    bead / minimal         single   পুঁতি / স্লিম
//   TST-005    0  bracelets    heart / charm          single   হার্ট / চার্ম
//   TST-006 2500  jewellery-set stone / floral / SET
//   TST-007 5000  earrings     gold-tone / rose-gold / two-tone / minimal
//   TST-008  750  rings        silver-tone / textured single   রুপালি / খোদাই
const FIXTURE = [
  {
    sku: "TST-001",
    slug: "tst-rosette-pearl-drop-earrings",
    title_en: "Rosette Pearl Drop Earrings",
    title_bn: "রোজেট পার্ল ড্রপ কানের দুল",
    category: "Earrings",
    price: 499,
    is_price_pending: 0,
    lead_en: "Fixture piece one.",
    lead_bn: "ফিক্সচার পণ্য এক।",
  },
  {
    sku: "TST-002",
    slug: "tst-gold-filigree-ring",
    title_en: "Gold Filigree Ring",
    title_bn: "সোনালি খোদাই আংটি",
    category: "Rings",
    price: 500,
    is_price_pending: 0,
    lead_en: "Fixture piece two.",
    lead_bn: "ফিক্সচার পণ্য দুই।",
  },
  {
    sku: "TST-003",
    slug: "tst-silver-infinity-bangle-pair",
    title_en: "Silver Infinity Bangle Pair",
    title_bn: "রুপালি ইনফিনিটি চুড়ি জোড়া",
    category: "Bangles",
    price: 999,
    is_price_pending: 0,
    lead_en: "Fixture piece three.",
    lead_bn: "ফিক্সচার পণ্য তিন।",
  },
  {
    sku: "TST-004",
    slug: "tst-slim-beaded-bar-bracelet",
    title_en: "Slim Beaded Bar Bracelet",
    title_bn: "স্লিম পুঁতির ব্রেসলেট",
    // Lower-case slug, not the database label: both shapes must normalise.
    category: "bracelets",
    price: 1000,
    is_price_pending: 0,
    lead_en: "Fixture piece four.",
    lead_bn: "ফিক্সচার পণ্য চার।",
  },
  {
    sku: "TST-005",
    slug: "tst-heart-charm-bracelet",
    title_en: "Heart Charm Bracelet",
    title_bn: "হার্ট চার্ম ব্রেসলেট",
    category: "Bracelets",
    // No price yet: must still be reachable, and must never sort as if it were ৳0.
    price: 0,
    is_price_pending: 1,
    lead_en: "Fixture piece five.",
    lead_bn: "ফিক্সচার পণ্য পাঁচ।",
  },
  {
    sku: "TST-006",
    slug: "tst-floral-stone-jewellery-set",
    title_en: "Floral Stone Jewellery Set",
    title_bn: "ফুলেল স্টোন জুয়েলারি সেট",
    category: "Jewellery Sets",
    price: 2500,
    is_price_pending: 0,
    lead_en: "Fixture piece six.",
    lead_bn: "ফিক্সচার পণ্য ছয়।",
  },
  {
    sku: "TST-007",
    slug: "tst-two-tone-rose-gold-petite-hoops",
    title_en: "Two-Tone Rose Gold Petite Hoop Earrings",
    title_bn: "টু-টোন রোজ গোল্ড ছোট হুপ কানের দুল",
    category: "Earrings",
    price: 5000,
    is_price_pending: 0,
    lead_en: "Fixture piece seven.",
    lead_bn: "ফিক্সচার পণ্য সাত।",
  },
  {
    sku: "TST-008",
    slug: "tst-ornate-silver-ring",
    title_en: "Ornate Silver Ring",
    title_bn: "রুপালি খোদাই আংটি",
    category: "Rings",
    price: 750,
    is_price_pending: 0,
    lead_en: "Fixture piece eight.",
    lead_bn: "ফিক্সচার পণ্য আট।",
  },
].map((product) => ({
  ...product,
  is_active: 1,
  image_url: `/assets/images/products/${product.slug}.webp`,
  image_alt_en: `${product.title_en} — eMarket247 product photograph.`,
}));

// Pre-rendered card markup, as the published pages ship it. Only the parts
// site.js and the filter code read are needed here.
const staticCard = (product) => `<article class="product-card" data-product-id="${product.sku}">
  <a class="product-card-media" href="/en/products/${product.slug}/" aria-label="${product.title_en}">
    <img src="${product.image_url}" loading="lazy" alt="${product.title_en}">
  </a>
  <div class="product-card-body">
    <h3 class="product-card-title"><a href="/en/products/${product.slug}/">${product.title_en}</a></h3>
  </div>
</article>`;

// The fixture page mirrors the real shop/category markup: a section whose first
// child is the .catalog-toolbar heading block, followed by the data-catalog grid.
const fixturePage = ({ lang, scope = "catalog", cards = [] }) => `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><title>Catalogue filter fixture</title></head>
<body data-language="${lang}">
  <header><a class="lang-link" href="#">${lang === "bn" ? "English" : "বাংলা"}</a></header>
  <section class="catalog-area wrap" id="catalog-area">
    <div class="catalog-toolbar">
      <div><p class="eyebrow">The Collection</p><h2>Fixture Collection</h2></div>
      <p class="catalog-subhead">Fixture grid used by the catalogue filter test.</p>
    </div>
    <div class="product-grid" data-catalog data-category="${scope}" data-empty="Approved products for this category are in preparation.">${cards.join("")}</div>
  </section>
  <div class="toast" data-toast></div>
  <script src="/assets/js/site.js"></script>
</body></html>`;

// Whether the scripted API answers with prices or with a catalogue that has not
// been priced yet, so the price-facet note can be exercised.
let priced = true;
// Whether /api/products.php is reachable at all, so the snapshot fallback - the
// path a static preview and an API outage both take - can be exercised.
let apiDown = false;
// The shipped snapshot the fallback reads. Null serves the real file.
let snapshotProducts = null;
const snapshotPayload = () =>
  FIXTURE.map((product) => ({
    id: product.sku,
    slug: product.slug,
    title: product.title_en,
    category: product.category,
    price: product.price,
    status: "ready",
    description: product.lead_en,
    image: {
      src: product.image_url,
      srcset: product.image_url,
      width: 1200,
      height: 1200,
      alt: product.title_en,
      caption: product.lead_en,
    },
  }));

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  const clean = decodeURIComponent(url.pathname);
  const json = (payload, status = 200) => {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(payload));
  };

  if (clean === "/api/products.php") {
    if (apiDown) return json({ success: false, error: "Service unavailable." }, 503);
    const products = priced
      ? FIXTURE
      : FIXTURE.map((product) => ({ ...product, price: 0, is_price_pending: 1 }));
    return json({ success: true, total: products.length, products });
  }
  if (clean === "/api/auth.php") return json({ success: true, csrf_token: "test-token", user: null });
  if (clean === "/api/wishlist.php") return json({ success: false, error: "Unauthorized Access." }, 401);

  if (clean === "/assets/data/catalog.en.json" || clean === "/assets/data/catalog.bn.json") {
    if (snapshotProducts) return json({ status: "fixture", modelVersion: 2, products: snapshotProducts });
  }

  const html = (page) => {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(page);
  };
  if (clean === "/filters/en/" || clean === "/filters/bn/") {
    return html(fixturePage({ lang: clean.includes("/bn/") ? "bn" : "en" }));
  }
  if (clean === "/filters/en/rings/") return html(fixturePage({ lang: "en", scope: "rings" }));
  // A page that ships its reviewed cards and takes the snapshot fallback path.
  if (clean === "/filters/en/static/") return html(fixturePage({ lang: "en", cards: FIXTURE.map(staticCard) }));
  // A page whose reviewed cards and shipped snapshot disagree: the cards must win.
  if (clean === "/filters/en/drift/") {
    return html(fixturePage({ lang: "en", cards: FIXTURE.slice(0, 3).map(staticCard) }));
  }

  const wanted = clean.endsWith("/") ? `${clean}index.html` : clean;
  try {
    const body = await readFile(path.join(SITE, `.${wanted}`));
    response.writeHead(200, { "Content-Type": TYPES[path.extname(wanted)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Only local pages are fetched: the storefront must never depend on a remote
// resource, and a filter test must not either. Both the classic ResourceLoader
// and the newer request interceptor are supported, as in test-wishlist.mjs.
const emptyResponse = (url) =>
  new Response(String(url).endsWith(".css") ? "" : "", {
    status: 200,
    headers: { "Content-Type": String(url).endsWith(".css") ? "text/css" : "text/plain" },
  });

const legacyLoader =
  typeof ResourceLoader === "function"
    ? class extends ResourceLoader {
        fetch(url, options) {
          return url.startsWith(origin) ? super.fetch(url, options) : null;
        }
      }
    : null;

const resources =
  typeof requestInterceptor === "function"
    ? {
        interceptors: [
          requestInterceptor((request) =>
            String(request.url).startsWith(origin) ? undefined : emptyResponse(request.url)
          ),
        ],
      }
    : legacyLoader
      ? new legacyLoader()
      : "usable";

const failures = [];
const passes = [];
const thrown = [];

const check = (label, condition, detail = "") => {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeConsole = () => {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => thrown.push(`jsdomError: ${error.message}`));
  virtualConsole.on("error", (...args) => thrown.push(`console.error: ${args.join(" ")}`));
  return virtualConsole;
};

// site.js renders the controls only after /api/products.php answers, so wait for
// the controls themselves instead of a fixed delay.
const settle = async (dom, timeout = 8000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (dom.window.document.querySelector(".catalog-controls")) return;
    await wait(25);
  }
};

const openPage = async (url, { withPrices = true, down = false, snapshot = null } = {}) => {
  priced = withPrices;
  apiDown = down;
  snapshotProducts = snapshot;
  const dom = await JSDOM.fromURL(`${origin}${url}`, {
    runScripts: "dangerously",
    resources,
    pretendToBeVisual: true,
    virtualConsole: makeConsole(),
    beforeParse(window) {
      // jsdom has no fetch and no matchMedia; site.js needs both.
      window.fetch = (input, init) => fetch(new URL(String(input), `${origin}${url}`), init);
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    },
  });
  await settle(dom);
  return dom;
};

const q = (window, selector) => window.document.querySelector(selector);
const qa = (window, selector) => [...window.document.querySelectorAll(selector)];
const cardIds = (window) => qa(window, ".product-card").map((card) => card.dataset.productId);
const text = (window, selector) => (q(window, selector)?.textContent || "").trim();
const countText = (window) => text(window, ".catalog-result-count");
const tabCount = (window, slug) => text(window, `[data-category-tab="${slug}"] .catalog-tab-count`);
const chip = (window, facet, value) => q(window, `[data-facet="${facet}"][data-value="${value}"]`);
const pressed = (element) => element?.getAttribute("aria-pressed") === "true";
const click = (window, element) => {
  if (!element) throw new Error("tried to click an element that is not on the page");
  element.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
};
const setField = (window, element, value, eventName = "input") => {
  element.value = value;
  element.dispatchEvent(new window.Event(eventName, { bubbles: true }));
};
const param = (window, key) => new URLSearchParams(window.location.search).get(key);

const ids = (list) => list.join(", ");

/* ------------------------------------------------------------------ EN page */
{
  const dom = await openPage("/filters/en/");
  const { window } = dom;

  check("the filter controls are built into the toolbar by site.js", Boolean(q(window, ".catalog-controls-top")));
  check(
    "the four facets carry their English labels",
    qa(window, ".catalog-facet legend").map((legend) => legend.textContent.trim()).join(" / ") ===
      "Price / Finish / Design / Format",
    qa(window, ".catalog-facet legend").map((legend) => legend.textContent.trim()).join(" / ")
  );
  check(
    "the retired filter placeholder is gone",
    q(window, ".filter-stub") === null,
    "a .filter-stub element is still in the DOM"
  );

  // Tabs + live counts
  check(
    "eight category tabs render: All plus the seven core categories",
    qa(window, "[data-category-tab]").length === 8,
    String(qa(window, "[data-category-tab]").length)
  );
  const counts = ["all", "rings", "bangles", "jewellery-sets", "bracelets", "necklaces", "earrings", "pendants"]
    .map((slug) => tabCount(window, slug))
    .join(",");
  check("every tab shows its live count", counts === "8,2,1,1,2,0,2,0", counts);
  check("the All tab is active on the shop grid", pressed(q(window, '[data-category-tab="all"]')));
  check("the full grid renders eight cards", cardIds(window).length === 8, ids(cardIds(window)));
  check("the result count reflects the whole catalogue", countText(window) === "8 pieces", countText(window));

  // Category tab filtering
  click(window, q(window, '[data-category-tab="rings"]'));
  check(
    "a category tab filters the grid to that category",
    ids(cardIds(window)) === "TST-002, TST-008",
    ids(cardIds(window))
  );
  check("the chosen tab becomes the active one", pressed(q(window, '[data-category-tab="rings"]')));
  check("the All tab is deactivated", !pressed(q(window, '[data-category-tab="all"]')));
  check("the result count follows the tab", countText(window) === "2 pieces", countText(window));
  click(window, q(window, '[data-category-tab="all"]'));
  check("All restores the full grid", cardIds(window).length === 8);

  // Finish facet
  check(
    "every finish keyword family is offered as a chip",
    qa(window, '[data-facet="finish"]').map((c) => c.dataset.value).join(",") ===
      "gold-tone,silver-tone,rose-gold,two-tone,pearl,stone,bead",
    qa(window, '[data-facet="finish"]').map((c) => c.dataset.value).join(",")
  );
  click(window, chip(window, "finish", "silver-tone"));
  check(
    "a finish chip narrows the grid",
    ids(cardIds(window)) === "TST-003, TST-008",
    ids(cardIds(window))
  );
  check("the pressed chip is marked for assistive tech", pressed(chip(window, "finish", "silver-tone")));
  click(window, chip(window, "finish", "pearl"));
  check(
    "two chips inside one facet are OR-ed, not AND-ed",
    ["TST-001", "TST-003", "TST-008"].every((id) => cardIds(window).includes(id)) && cardIds(window).length === 3,
    ids(cardIds(window))
  );

  // Design facet, AND-ed across facets
  click(window, chip(window, "finish", "pearl"));
  click(window, chip(window, "design", "textured"));
  check(
    "facets are AND-ed together",
    ids(cardIds(window)) === "TST-008",
    ids(cardIds(window))
  );
  // TST-007 carries three finish marks (gold-tone, rose-gold, two-tone) because
  // its title says "Two-Tone Rose Gold". One piece must still count once.
  click(window, q(window, ".catalog-clear"));
  click(window, chip(window, "finish", "gold-tone"));
  check(
    "a piece with several marks in one facet is listed once",
    ids(cardIds(window)) === "TST-002, TST-007",
    ids(cardIds(window))
  );
  click(window, chip(window, "finish", "rose-gold"));
  check(
    "adding another of its marks widens the union without duplicating the card",
    ids(cardIds(window)) === "TST-002, TST-007",
    ids(cardIds(window))
  );
  click(window, q(window, ".catalog-clear"));
  check(
    "the clear-all control resets every selection",
    (() => {
      click(window, chip(window, "finish", "stone"));
      click(window, q(window, ".catalog-clear"));
      return cardIds(window).length === 8 && qa(window, '[aria-pressed="true"][data-facet]').length === 0;
    })(),
    ids(cardIds(window))
  );

  // Format facet
  check(
    "format offers set, pair and single",
    qa(window, '[data-facet="format"]').map((c) => c.dataset.value).join(",") === "set,pair,single",
    qa(window, '[data-facet="format"]').map((c) => c.dataset.value).join(",")
  );
  click(window, chip(window, "format", "set"));
  check("the set chip finds the jewellery set", ids(cardIds(window)) === "TST-006", ids(cardIds(window)));
  click(window, chip(window, "format", "set"));
  click(window, chip(window, "format", "pair"));
  check("the pair chip finds the bangle pair", ids(cardIds(window)) === "TST-003", ids(cardIds(window)));
  click(window, q(window, ".catalog-clear"));

  // Price bands, on their exact edges
  click(window, chip(window, "price", "under-500"));
  check(
    "the under-500 band stops below 500",
    ids(cardIds(window)) === "TST-001",
    ids(cardIds(window))
  );
  click(window, chip(window, "price", "under-500"));
  click(window, chip(window, "price", "500-999"));
  check(
    "the 500-999 band includes 500 and 999 but not 1000",
    // Record order: TST-002 (৳500), TST-003 (৳999), TST-008 (৳750) — and no TST-004 (৳1000).
    ids(cardIds(window)) === "TST-002, TST-003, TST-008",
    ids(cardIds(window))
  );
  click(window, chip(window, "price", "500-999"));
  click(window, chip(window, "price", "1000-1999"));
  check("the 1000-1999 band starts at exactly 1000", ids(cardIds(window)) === "TST-004", ids(cardIds(window)));
  click(window, chip(window, "price", "5000-plus"));
  check(
    "two price chips are OR-ed into a union of bands",
    ids(cardIds(window)) === "TST-004, TST-007",
    ids(cardIds(window))
  );
  click(window, q(window, ".catalog-clear"));
  click(window, chip(window, "price", "on-request"));
  check(
    "a piece without a price is reachable through the on-request band",
    ids(cardIds(window)) === "TST-005",
    ids(cardIds(window))
  );
  click(window, q(window, ".catalog-clear"));

  // Search
  const search = q(window, ".catalog-search-input");
  setField(window, search, "charm");
  check("search filters the grid", ids(cardIds(window)) === "TST-005", ids(cardIds(window)));
  check("the result count follows the search", countText(window) === "1 piece", countText(window));
  setField(window, search, "no such piece");
  check("a search with no matches shows the empty state", Boolean(q(window, ".catalog-no-results")));
  check("the empty state replaces the grid", cardIds(window).length === 0);
  click(window, q(window, ".catalog-reset-btn"));
  check("the empty state's reset restores the grid", cardIds(window).length === 8 && countText(window) === "8 pieces");
  setField(window, search, "charm");
  click(window, q(window, ".catalog-search-clear"));
  check("the clear button empties the search box", search.value === "" && cardIds(window).length === 8);

  // Sort
  const sort = q(window, "[data-sort]");
  check(
    "the sort control offers featured and both price orders",
    [...sort.options].map((option) => option.value).join(",") === "featured,price-asc,price-desc",
    [...sort.options].map((option) => option.value).join(",")
  );
  setField(window, sort, "price-asc", "change");
  check(
    "price low-to-high walks the bands in order",
    ids(cardIds(window)) === "TST-001, TST-002, TST-008, TST-003, TST-004, TST-006, TST-007, TST-005",
    ids(cardIds(window))
  );
  check("a piece without a price sorts last going up", cardIds(window).at(-1) === "TST-005");
  setField(window, sort, "price-desc", "change");
  check(
    "price high-to-low reverses the priced pieces",
    ids(cardIds(window)) === "TST-007, TST-006, TST-004, TST-003, TST-008, TST-002, TST-001, TST-005",
    ids(cardIds(window))
  );
  check("a piece without a price sorts last going down too, never as ৳0", cardIds(window).at(-1) === "TST-005");
  setField(window, sort, "featured", "change");
  check("featured restores the catalogue order", ids(cardIds(window)) === "TST-001, TST-002, TST-003, TST-004, TST-005, TST-006, TST-007, TST-008", ids(cardIds(window)));

  // URL sync, both ways
  click(window, q(window, '[data-category-tab="bracelets"]'));
  click(window, chip(window, "finish", "bead"));
  setField(window, search, "slim");
  setField(window, sort, "price-asc", "change");
  check(
    "filtering writes a shareable query string",
    param(window, "category") === "bracelets" &&
      param(window, "finish") === "bead" &&
      param(window, "q") === "slim" &&
      param(window, "sort") === "price-asc",
    window.location.search
  );
  check("the filtered view shows the one matching piece", ids(cardIds(window)) === "TST-004", ids(cardIds(window)));

  const mobile = q(window, ".catalog-filter-toggle");
  click(window, mobile);
  check("the mobile filter toggle opens the facet panel", mobile.getAttribute("aria-expanded") === "true" && q(window, ".catalog-controls").classList.contains("is-open"));
  click(window, mobile);
  check("the mobile filter toggle closes it again", mobile.getAttribute("aria-expanded") === "false");

  dom.window.close();
}

/* ---------------------------------------------- EN deep link + category page */
{
  const dom = await openPage("/filters/en/?category=rings&finish=silver-tone&sort=price-asc");
  const { window } = dom;

  check("a shared link restores the grid it described", ids(cardIds(window)) === "TST-008", ids(cardIds(window)));
  check("the shared link restores the pressed chip", pressed(chip(window, "finish", "silver-tone")));
  check("the shared link restores the active tab", pressed(q(window, '[data-category-tab="rings"]')));
  check("the shared link restores the sort order", q(window, "[data-sort]").value === "price-asc");
  check("the shared link keeps its query string", window.location.search.includes("finish=silver-tone"));
  dom.window.close();
}

{
  const dom = await openPage("/filters/en/rings/");
  const { window } = dom;

  check("a category page opens on its own category", pressed(q(window, '[data-category-tab="rings"]')));
  check("a category page shows only its own pieces", ids(cardIds(window)) === "TST-002, TST-008", ids(cardIds(window)));
  check("a category page count excludes the rest of the catalogue", countText(window) === "2 pieces", countText(window));
  check(
    "a category page still offers every other category's count",
    ["all", "bangles", "jewellery-sets", "bracelets", "earrings"].map((slug) => tabCount(window, slug)).join(",") === "8,1,1,2,2",
    ["all", "bangles", "jewellery-sets", "bracelets", "earrings"].map((slug) => tabCount(window, slug)).join(",")
  );
  click(window, q(window, '[data-category-tab="bracelets"]'));
  check("switching category on a category page works", ids(cardIds(window)) === "TST-004, TST-005", ids(cardIds(window)));
  dom.window.close();
}

/* ----------------------------------------------- price note (no prices yet) */
{
  const dom = await openPage("/filters/en/", { withPrices: false });
  const { window } = dom;

  check("an unpriced catalogue still renders the price facet", Boolean(q(window, 'fieldset[data-facet-group="price"]')));
  check("an unpriced catalogue offers no price chips", qa(window, '[data-facet="price"]').length === 0);
  check(
    "an unpriced catalogue explains itself in English",
    text(window, 'fieldset[data-facet-group="price"] .catalog-facet-note').includes("Prices are being published"),
    text(window, 'fieldset[data-facet-group="price"] .catalog-facet-note')
  );
  check(
    "the other facets still work without prices",
    qa(window, '[data-facet="finish"]').length === 7 && qa(window, '[data-facet="design"]').length === 7,
    `${qa(window, '[data-facet="finish"]').length} finish / ${qa(window, '[data-facet="design"]').length} design`
  );
  setField(window, q(window, "[data-sort]"), "price-asc", "change");
  check("sorting an unpriced catalogue keeps every card", cardIds(window).length === 8);
  dom.window.close();
}

/* ------------------------------------------------------------------ BN page */
{
  const dom = await openPage("/filters/bn/");
  const { window } = dom;

  check(
    "the four facets carry their Bangla labels",
    qa(window, ".catalog-facet legend").map((legend) => legend.textContent.trim()).join(" / ") ===
      "মূল্য / ফিনিশ / ডিজাইন / ধরন",
    qa(window, ".catalog-facet legend").map((legend) => legend.textContent.trim()).join(" / ")
  );
  // Bangla can be written with the combining nukta (ড + ়) or the precomposed
  // letter (ড়). Compare normalised, or the check fails on an invisible difference.
  const nfc = (value) => value.normalize("NFC");
  check(
    "the Bangla tabs use the Bangla category names",
    nfc(text(window, '[data-category-tab="bangles"]')).startsWith(nfc("চুড়ি")) &&
      nfc(text(window, '[data-category-tab="rings"]')).startsWith(nfc("আংটি")),
    text(window, '[data-category-tab="bangles"]')
  );
  check("the Bangla grid renders every piece", cardIds(window).length === 8);
  check("the Bangla result count reads in Bangla", countText(window) === "8টি অলংকার", countText(window));
  check(
    "the Bangla finish chips are labelled in Bangla",
    qa(window, '[data-facet="finish"]').map((c) => c.textContent.trim()).includes("পার্ল"),
    qa(window, '[data-facet="finish"]').map((c) => c.textContent.trim()).join(",")
  );
  check(
    "the Bangla sort options are labelled in Bangla",
    [...q(window, "[data-sort]").options].map((option) => option.textContent.trim()).join(",") ===
      "নির্বাচিত,দাম: কম থেকে বেশি,দাম: বেশি থেকে কম",
    [...q(window, "[data-sort]").options].map((option) => option.textContent.trim()).join(",")
  );

  // Filters must read the Bangla titles, not the English ones.
  click(window, chip(window, "finish", "bead"));
  check("a Bangla finish chip filters on the Bangla title", ids(cardIds(window)) === "TST-004", ids(cardIds(window)));
  click(window, q(window, ".catalog-clear"));
  click(window, chip(window, "design", "floral"));
  check("a Bangla design chip filters on the Bangla title", ids(cardIds(window)) === "TST-006", ids(cardIds(window)));
  click(window, q(window, ".catalog-clear"));
  click(window, chip(window, "format", "set"));
  check("the Bangla set chip finds the jewellery set", ids(cardIds(window)) === "TST-006", ids(cardIds(window)));
  click(window, q(window, ".catalog-clear"));
  click(window, q(window, '[data-category-tab="bangles"]'));
  check("a Bangla category tab filters the grid", ids(cardIds(window)) === "TST-003", ids(cardIds(window)));
  click(window, q(window, '[data-category-tab="all"]'));

  setField(window, q(window, ".catalog-search-input"), "চুড়ি");
  check("search reads the Bangla titles", ids(cardIds(window)) === "TST-003", ids(cardIds(window)));
  check(
    "filtering writes the same language-neutral query string on both languages",
    param(window, "q") === "চুড়ি",
    window.location.search
  );
  setField(window, q(window, ".catalog-search-input"), "খুঁজে পাওয়া যায়নি");
  check(
    "the Bangla empty state reads in Bangla",
    text(window, ".catalog-no-results h3") === "কোনো পণ্য পাওয়া যায়নি",
    text(window, ".catalog-no-results h3")
  );
  click(window, q(window, ".catalog-reset-btn"));
  check("the Bangla reset restores the grid", cardIds(window).length === 8);

  setField(window, q(window, "[data-sort]"), "price-desc", "change");
  check(
    "Bangla price sorting keeps the unpriced piece last",
    cardIds(window).at(-1) === "TST-005" && cardIds(window)[0] === "TST-007",
    ids(cardIds(window))
  );

  dom.window.close();
}

/* ----------------------------------- the snapshot fallback (API unreachable) */
{
  const dom = await openPage("/filters/en/static/", { down: true, snapshot: snapshotPayload() });
  const { window } = dom;

  check(
    "with the API down the filters are still built over the shipped snapshot",
    Boolean(q(window, ".catalog-controls"))
  );
  check("with the API down the reviewed cards are counted, not duplicated", cardIds(window).length === 8, ids(cardIds(window)));
  check("with the API down the tab counts still come from the snapshot", tabCount(window, "rings") === "2", tabCount(window, "rings"));
  check(
    "with the API down every occupied price band is offered",
    qa(window, '[data-facet="price"]').map((c) => c.dataset.value).join(",") ===
      "under-500,500-999,1000-1999,2000-4999,5000-plus,on-request",
    qa(window, '[data-facet="price"]').map((c) => c.dataset.value).join(",")
  );
  click(window, chip(window, "price", "500-999"));
  check(
    "with the API down a price chip still filters the grid",
    ids(cardIds(window)) === "TST-002, TST-003, TST-008",
    ids(cardIds(window))
  );
  click(window, q(window, '[data-category-tab="rings"]'));
  check(
    "with the API down a category tab still filters the grid",
    ids(cardIds(window)) === "TST-002, TST-008",
    ids(cardIds(window))
  );
  check("with the API down filtering still writes the query string", param(window, "category") === "rings");
  dom.window.close();
}

{
  const dom = await openPage("/filters/en/drift/", { down: true, snapshot: snapshotPayload() });
  const { window } = dom;

  check(
    "a snapshot that disagrees with the published cards draws no controls",
    !q(window, ".catalog-controls"),
    "controls were built over a snapshot the page does not match"
  );
  check(
    "a snapshot that disagrees leaves the published cards untouched",
    ids(cardIds(window)) === "TST-001, TST-002, TST-003",
    ids(cardIds(window))
  );
  dom.window.close();
}

/* --------------------------------------- BN price note + no stray exceptions */
{
  const before = thrown.length;
  const dom = await openPage("/filters/bn/", { withPrices: false });
  const { window } = dom;

  check(
    "an unpriced catalogue explains itself in Bangla",
    text(window, 'fieldset[data-facet-group="price"] .catalog-facet-note').includes("মূল্য প্রকাশের কাজ চলছে"),
    text(window, 'fieldset[data-facet-group="price"] .catalog-facet-note')
  );
  check("an unpriced Bangla catalogue offers no price chips", qa(window, '[data-facet="price"]').length === 0);
  dom.window.close();

  const raised = thrown.slice(before);
  check("site.js raised no uncaught error while filtering", raised.length === 0, raised.join(" | "));
}

server.close();

console.log(`\n${passes.length} checks passed`);
for (const name of passes) console.log(`  ✓ ${name}`);
if (failures.length) {
  console.error(`\n${failures.length} checks FAILED`);
  for (const name of failures) console.error(`  ✗ ${name}`);
  process.exit(1);
}
console.log("\nCatalogue filter integration test passed.");
