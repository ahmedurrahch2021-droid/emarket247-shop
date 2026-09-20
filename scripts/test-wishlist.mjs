#!/usr/bin/env node
/**
 * Wishlist integration test (real DOM, real site.js).
 *
 * Loads the shipped pages into jsdom against a local static server and
 * exercises the wishlist the way a visitor does: save a piece from a grid,
 * save from a product page, and manage the list on /en/wishlist/ and
 * /bn/wishlist/.
 *
 * jsdom is intentionally not a project dependency — the storefront ships no
 * test framework. Install it temporarily and run:
 *
 *   npm install --no-save jsdom
 *   node scripts/test-wishlist.mjs
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

const server = createServer(async (request, response) => {
  const clean = decodeURIComponent((request.url || "/").split("?")[0]);
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
// resource to function, and the test must not either. jsdom changed this API
// between majors, so both the classic ResourceLoader and the newer request
// interceptor are supported.
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

const check = (label, condition, detail = "") => {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const openPage = async (url, { seed = null } = {}) => {
  const dom = await JSDOM.fromURL(`${origin}${url}`, {
    runScripts: "dangerously",
    resources,
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
    beforeParse(window) {
      // jsdom has no fetch and no matchMedia; site.js needs both. Requests are
      // resolved against the same static server, so the API fails exactly as it
      // does on a static preview and the catalogue fallback is exercised.
      window.fetch = (input, init) => fetch(new URL(String(input), `${origin}${url}`), init);
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      window.confirm = () => true;
      if (seed) window.localStorage.setItem("emarket247_wishlist", JSON.stringify(seed));
    },
  });
  // Give the deferred scripts, the catalogue fallback fetch and the render a
  // chance to settle.
  await wait(700);
  return dom;
};

const heartOf = (document, slug) => document.querySelector(`.wishlist-btn[data-wishlist-item="${slug}"]`);
const click = (element) => element.dispatchEvent(new element.ownerDocument.defaultView.MouseEvent("click", { bubbles: true, cancelable: true }));

// ---------------------------------------------------------------------------
// 1. Shop grid: hearts exist on every card and save/unsave the piece.
// ---------------------------------------------------------------------------
{
  const dom = await openPage("/en/shop/");
  const { document, localStorage } = dom.window;
  const cards = document.querySelectorAll(".product-card");
  check("shop grid renders product cards", cards.length > 0, `found ${cards.length}`);
  const missing = [...cards].filter((card) => !card.querySelector(".wishlist-btn"));
  check("every shop card carries a wishlist button", missing.length === 0, `${missing.length} without`);

  // Structural regression: converting the header heart to a link must never
  // consume another element's closing tag. An unbalanced </button> would leave
  // the mobile menu button open and swallow the navigation that follows it.
  const menuButton = document.querySelector("header .menu-toggle");
  check(
    "header markup stays balanced after the heart conversion",
    Boolean(menuButton) &&
      !menuButton.querySelector(".main-nav") &&
      document.querySelector(".main-nav")?.closest("button") === null &&
      document.querySelectorAll("header .icon-link").length >= 4,
    menuButton ? `open buttons: ${document.querySelectorAll("button").length}` : "no menu toggle"
  );

  const first = document.querySelector(".wishlist-btn");
  const slug = first.dataset.wishlistItem;
  const toggle = document.querySelector("[data-wishlist-toggle]");
  check("header control is a link to the wishlist page", toggle.tagName === "A" && toggle.getAttribute("href") === "/en/wishlist/", toggle.outerHTML.slice(0, 80));
  check("badge hidden while nothing is saved", document.querySelector("[data-wishlist-toggle] .icon-badge").hidden === true);

  click(first);
  await wait(120);
  check("clicking the heart saves the slug", JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]").includes(slug), slug);
  check("clicked heart is marked active", heartOf(document, slug).classList.contains("is-active"));
  check("clicked heart reports pressed state", heartOf(document, slug).getAttribute("aria-pressed") === "true");
  const badge = toggle.querySelector(".icon-badge");
  check("header badge counts one saved piece", badge.textContent === "1" && badge.hidden === false);
  check("save shows a confirmation toast", document.querySelector(".toast").textContent.includes("wishlist"));

  click(heartOf(document, slug));
  await wait(120);
  check("clicking again removes the slug", JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]").length === 0);
  check("badge hidden again after removal", badge.hidden === true);
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 2. Product page: the heart sits beside "add to bag" and saves that product.
// ---------------------------------------------------------------------------
{
  const dom = await openPage("/en/products/emarket247-bangles-17/");
  const { document, localStorage } = dom.window;
  const button = document.querySelector(".pdp-actions-row .wishlist-btn");
  check("PDP renders a labelled wishlist action", Boolean(button) && Boolean(button.querySelector(".wishlist-btn-text")));
  click(button);
  await wait(120);
  check("PDP heart saves the product slug", JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]").includes("emarket247-bangles-17"));
  check("PDP heart text switches to saved", button.querySelector(".wishlist-btn-text").textContent.includes("Saved"));
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 3. Wishlist page: empty state, saved list, add all to bag, remove.
// ---------------------------------------------------------------------------
{
  const slug = "emarket247-bangles-17";
  const dom = await openPage("/en/wishlist/", { seed: [slug] });
  const { document, localStorage } = dom.window;

  check("wishlist page keeps the saved slug", JSON.parse(localStorage.getItem("emarket247_wishlist")).includes(slug));
  const card = document.querySelector(".product-card");
  check("saved piece renders as a product card", Boolean(card));
  check("saved card links to the product page", card?.querySelector(".product-card-title a")?.getAttribute("href") === `/en/products/${slug}/`);
  check("wishlist page card exposes a remove action", Boolean(card?.querySelector(".wishlist-remove-btn")));
  check("wishlist toolbar shows the count", document.querySelector("[data-wishlist-count]").textContent === "1" && document.querySelector("[data-wishlist-toolbar]").hidden === false);
  check("saved card heart is active", card.querySelector(".wishlist-btn").classList.contains("is-active"));

  click(document.querySelector("[data-wishlist-add-all]"));
  await wait(120);
  const bag = JSON.parse(localStorage.getItem("emk_bag") || "[]");
  check("add all to bag fills the shopping bag", bag.length === 1 && bag[0].slug === slug, JSON.stringify(bag));

  click(document.querySelector(".wishlist-remove-btn"));
  await wait(120);
  check("remove empties the saved list", JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]").length === 0);
  check("empty state appears with the collection link", document.querySelector(".wishlist-empty-cta")?.getAttribute("href") === "/en/shop/");

  // Stale slug pruning: a saved slug with no published catalogue record.
  localStorage.setItem("emarket247_wishlist", JSON.stringify([slug, "emarket247-not-a-real-slug"]));
  dom.window.dispatchEvent(new dom.window.StorageEvent("storage", { key: "emarket247_wishlist" }));
  await wait(150);
  check("unpublished saved slugs are pruned", JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]").join() === slug);
  check(
    "pruning is announced while the rest of the list stays",
    document.querySelector("[data-wishlist-status]").textContent.includes("no longer published") &&
      document.querySelectorAll(".product-card").length === 1
  );

  localStorage.setItem("emarket247_wishlist", JSON.stringify(["emarket247-not-a-real-slug"]));
  dom.window.dispatchEvent(new dom.window.StorageEvent("storage", { key: "emarket247_wishlist" }));
  await wait(150);
  check(
    "pruning notice survives an emptied list",
    document.querySelector("[data-wishlist-page]").textContent.includes("no longer published") &&
      Boolean(document.querySelector(".wishlist-empty"))
  );
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 4. Bengali page: localised control, empty state and copy.
// ---------------------------------------------------------------------------
{
  const dom = await openPage("/bn/wishlist/");
  const { document } = dom.window;
  const toggle = document.querySelector("[data-wishlist-toggle]");
  check("bn header control links to the bn wishlist page", toggle.getAttribute("href") === "/bn/wishlist/");
  check("bn empty state is localised", document.querySelector(".wishlist-empty")?.textContent.includes("উইশলিস্ট এখন খালি"));
  check("bn empty state links to the bn shop", document.querySelector(".wishlist-empty-cta")?.getAttribute("href") === "/bn/shop/");
  check("bn page rendered its own header heart", Boolean(document.querySelector(".icon-badge")));
  dom.window.close();
}

server.close();

console.log(`\n${passes.length} checks passed`);
for (const name of passes) console.log(`  ✓ ${name}`);
if (failures.length) {
  console.error(`\n${failures.length} checks FAILED`);
  for (const name of failures) console.error(`  ✗ ${name}`);
  process.exit(1);
}
console.log("\nWishlist integration test passed.");
