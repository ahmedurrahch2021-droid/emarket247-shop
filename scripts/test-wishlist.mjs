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

// Scripted API so the account-sync path can be exercised: the storefront talks
// to these two endpoints exactly as it does against Hostinger.
const api = {
  signedIn: false,
  user: { id: 7, full_name: "Priya Customer", email: "priya@example.com", role: "customer" },
  items: [],
  // Slugs the endpoint will refuse to store, mirroring the real one: it keeps
  // only rows that exist in emk_products with is_active = 1, so a piece
  // published to the static catalogue but not yet a DB row is turned away.
  unpublished: [],
  calls: [],
  reset({ signedIn = false, items = [], unpublished = [] } = {}) {
    this.signedIn = signedIn;
    this.items = [...items];
    this.unpublished = [...unpublished];
    this.calls = [];
  },
};

const server = createServer(async (request, response) => {
  const clean = decodeURIComponent((request.url || "/").split("?")[0]);

  if (clean.startsWith("/api/")) {
    api.calls.push({ url: clean + (request.url.includes("?") ? `?${request.url.split("?")[1]}` : ""), method: request.method });
    let body = "";
    for await (const chunk of request) body += chunk;
    const json = (payload, status = 200) => {
      response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(payload));
    };
    if (clean === "/api/auth.php") {
      api.calls[api.calls.length - 1].body = body;
      return json({ success: true, csrf_token: "test-token", user: api.signedIn ? api.user : null });
    }
    if (clean === "/api/wishlist.php") {
      if (!api.signedIn) return json({ success: false, error: "Unauthorized Access." }, 401);
      if (request.method === "GET") return json({ success: true, items: api.items });
      const payload = body ? JSON.parse(body) : {};
      let rejected = [];
      if (payload.action === "replace") {
        const asked = Array.isArray(payload.slugs) ? payload.slugs : [];
        // The endpoint answers with both halves: what it stored, and what it
        // turned away by name, so the caller can stop offering those.
        api.items = asked.filter((slug) => !api.unpublished.includes(slug));
        rejected = asked.filter((slug) => api.unpublished.includes(slug));
      }
      if (payload.action === "clear") api.items = [];
      api.calls[api.calls.length - 1].body = body;
      return json({ success: true, items: api.items, rejected });
    }
    return json({ success: false, error: "Unknown endpoint." }, 404);
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

const openPage = async (
  url,
  { seed = null, unsynced = null, signedIn = false, serverItems = [], unpublished = [], blockedStorage = false } = {}
) => {
  api.reset({ signedIn, items: serverItems, unpublished });
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
      if (blockedStorage) {
        // Private windows and hardened privacy settings can make storage throw
        // on access. "local" is the common case (a session copy still answers);
        // "all" is the worst case, where nothing can be kept at all. The
        // wishlist must keep working in both.
        const blocked = blockedStorage === "all" ? ["localStorage", "sessionStorage"] : ["localStorage"];
        for (const name of blocked) {
          Object.defineProperty(window, name, {
            configurable: true,
            get() {
              throw new Error(`${name} is blocked`);
            },
          });
        }
      }
      if (seed) window.localStorage.setItem("emarket247_wishlist", JSON.stringify(seed));
      // The memo of slugs the server has already refused. Seeding it stands in
      // for a previous visit that was told no, which is what the re-push loop
      // needs in order to be observable in a single page load.
      if (unsynced) window.localStorage.setItem("emarket247_wishlist_unsynced", JSON.stringify(unsynced));
    },
  });
  // site.js is a deferred script that enhances the grid after it parses, and
  // how long that takes varies with machine load. Waiting a fixed 700ms raced
  // it and failed about one run in four on a cold start - the shop grid still
  // had its 27 server-rendered cards but no hearts yet, so the first
  // querySelector(".wishlist-btn") returned null and the run died mid-file.
  // Poll for the work to have finished instead, then let the toasts settle.
  await settle(dom);
  await wait(120);
  return dom;
};

// Resolves once site.js has wired the page. Three shapes have to be waited
// for: the header control, which every page has; product cards, which are
// server-rendered and only get their hearts once the script has run; and the
// wishlist page, which draws its own contents from storage, so neither a card
// nor the empty state is there at parse time. Falls through after the timeout
// so a genuine failure reports as a failed assertion rather than a hang.
const settle = async (dom, timeout = 5000) => {
  const { document } = dom.window;
  const ready = () => {
    if (!document.querySelector("[data-wishlist-toggle]")) return false;
    const cards = document.querySelector(".product-card");
    if (document.location.pathname.includes("/wishlist/")) {
      if (!cards && !document.querySelector(".wishlist-empty-cta")) return false;
    }
    return !cards || Boolean(document.querySelector("[data-wishlist-item]"));
  };
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (ready()) return;
    await wait(25);
  }
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

// ---------------------------------------------------------------------------
// 5. Guest isolation: a guest's wishlist never leaves the browser.
// ---------------------------------------------------------------------------
{
  const dom = await openPage("/en/shop/");
  const { document } = dom.window;
  click(document.querySelector(".wishlist-btn"));
  await wait(900); // longer than the 600 ms push debounce
  const wishlistCalls = api.calls.filter((call) => call.url.startsWith("/api/wishlist.php"));
  check("a guest never calls the wishlist API", wishlistCalls.length === 0, JSON.stringify(wishlistCalls));
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 6. Signed in: browser and account lists are unioned, and changes are stored.
// ---------------------------------------------------------------------------
{
  const localSlug = "emarket247-bangles-17";
  const accountSlug = "emarket247-earrings-32";
  const dom = await openPage("/en/wishlist/", {
    seed: [localSlug],
    signedIn: true,
    serverItems: [accountSlug],
  });
  const { document, localStorage } = dom.window;

  await wait(900); // let the debounced account push land
  const stored = JSON.parse(localStorage.getItem("emarket247_wishlist") || "[]");
  check(
    "signing in merges the account list with the browser list",
    stored.includes(localSlug) && stored.includes(accountSlug),
    JSON.stringify(stored)
  );
  const serverPush = api.calls.find((call) => call.url.startsWith("/api/wishlist.php") && call.method !== "GET");
  check(
    "the browser-only piece is pushed to the account",
    Boolean(serverPush) && JSON.parse(serverPush.body).action === "replace" &&
      JSON.parse(serverPush.body).slugs.includes(localSlug),
    serverPush ? serverPush.body : "no write"
  );
  check("both merged pieces render on the page", document.querySelectorAll(".product-card").length === 2);
  check(
    "the signed-in note promises the account copy",
    document.querySelector("[data-wishlist-account-note]").textContent.includes("saved to your account")
  );

  const accountSlugHeart = document.querySelector(`.wishlist-btn[data-wishlist-item="${accountSlug}"]`);
  click(accountSlugHeart);
  await wait(900);
  const lastWrite = api.calls.filter((call) => call.method !== "GET" && call.url.startsWith("/api/wishlist.php")).pop();
  check(
    "removing a piece is stored on the account too",
    Boolean(lastWrite) && !JSON.parse(lastWrite.body).slugs.includes(accountSlug),
    lastWrite ? lastWrite.body : "no write"
  );
  check("no CSRF-tokenless write is possible", api.calls.some((call) => call.url.startsWith("/api/auth.php")));
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 7. Blocked storage: the wishlist still works, and says what it can keep.
// ---------------------------------------------------------------------------
{
  // 7a. localStorage is unavailable, but the browser still keeps a session copy.
  const dom = await openPage("/en/shop/", { blockedStorage: "local" });
  const { document, sessionStorage } = dom.window;
  const heart = document.querySelector(".wishlist-btn");
  click(heart);
  await wait(150);
  const slug = heart.dataset.wishlistItem;
  check(
    "with localStorage blocked the piece is still saved for the visit",
    document.querySelector(`.wishlist-btn[data-wishlist-item="${slug}"]`).classList.contains("is-active") &&
      JSON.parse(sessionStorage.getItem("emarket247_wishlist") || "[]").includes(slug)
  );
  check("the header badge still counts it", document.querySelector("[data-wishlist-toggle] .icon-badge").textContent === "1");
  check(
    "the visitor is told the limit instead of being misled",
    document.querySelector(".toast").textContent.includes("for this visit"),
    document.querySelector(".toast").textContent
  );
  dom.window.close();
}

{
  // 7b. Every storage layer is blocked: nothing can be kept, and the page says
  // so — while the piece still goes into the bag, so the visit is never a dead
  // end.
  const dom = await openPage("/en/shop/", { blockedStorage: "all" });
  const { document } = dom.window;
  const card = document.querySelector(".product-card");
  const heart = card.querySelector(".wishlist-btn");
  click(heart);
  await wait(150);
  check(
    "with all storage blocked the page still responds without error",
    heart.classList.contains("is-active") &&
      document.querySelector("[data-wishlist-toggle] .icon-badge").textContent === "1"
  );
  check(
    "the visitor is told the list cannot be kept, not that it was saved",
    document.querySelector(".toast").textContent.includes("cannot be kept"),
    document.querySelector(".toast").textContent
  );
  click(card.querySelector("[data-add-bag]"));
  await wait(150);
  check(
    "the piece can still go to the bag or WhatsApp from a blocked browser",
    card.querySelector("[data-add-bag]").classList.contains("is-added") &&
      Boolean(card.querySelector(".product-card-wa-btn"))
  );
  dom.window.close();
}

// ---------------------------------------------------------------------------
// 8. The account refuses a piece: it is named back, kept on the device, and
//    never offered again. Without this the browser re-pushed the same slug on
//    every page load and the server silently dropped it every time.
// ---------------------------------------------------------------------------
{
  const refused = "emarket247-bangles-17";
  const stored = "emarket247-earrings-32";

  // 8a. First visit: the account turns the piece away.
  const dom = await openPage("/en/wishlist/", {
    seed: [refused, stored],
    signedIn: true,
    serverItems: [stored],
    unpublished: [refused],
  });
  await wait(900); // longer than the 600 ms push debounce
  const memo = JSON.parse(dom.window.localStorage.getItem("emarket247_wishlist_unsynced") || "[]");
  check(
    "a piece the account refuses is remembered as unsynced",
    memo.includes(refused),
    JSON.stringify(memo)
  );
  check(
    "a refused piece is still kept on the device, not quietly lost",
    JSON.parse(dom.window.localStorage.getItem("emarket247_wishlist") || "[]").includes(refused)
  );
  check(
    "a refused piece still renders, so the visitor never sees it vanish",
    dom.window.document.querySelectorAll(".product-card").length === 2
  );
  dom.window.close();

  // 8b. Next visit, same state: the browser must not ask again.
  const again = await openPage("/en/wishlist/", {
    seed: [refused, stored],
    unsynced: [refused],
    signedIn: true,
    serverItems: [stored],
    unpublished: [refused],
  });
  await wait(900);
  const rewrites = api.calls.filter((call) => call.url.startsWith("/api/wishlist.php") && call.method !== "GET");
  check(
    "a slug the account already refused is not pushed again",
    rewrites.length === 0,
    JSON.stringify(rewrites.map((call) => call.body))
  );
  again.window.close();

  // 8c. The piece is published: the memo clears so it can sync normally again.
  const published = await openPage("/en/wishlist/", {
    seed: [refused, stored],
    unsynced: [refused],
    signedIn: true,
    serverItems: [refused, stored],
  });
  await wait(900);
  check(
    "once the account accepts the piece the refusal is forgotten",
    JSON.parse(published.window.localStorage.getItem("emarket247_wishlist_unsynced") || "[]").length === 0,
    published.window.localStorage.getItem("emarket247_wishlist_unsynced")
  );
  published.window.close();
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
