# Wishlist Feature — Implementation Report

**Task:** Guest-first wishlist: heart control on product tiles, save/remove in
`localStorage`, header heart linked to a dedicated wishlist page, and
`/en/wishlist/` + `/bn/wishlist/` pages that list the saved pieces with
add-to-bag and remove actions plus an empty state.

**Status:** Implemented and verified. No account, sign-up, e-mail or server
write is required to use the wishlist.

---

## 1. What a visitor gets

| Behaviour | Detail |
| --- | --- |
| Save without friction | Heart button on every product tile (grid and product page). One click saves the product slug in the browser — no registration, no modal, no e-mail. |
| Immediate feedback | Filled red heart, `aria-pressed`, header badge count, and a toast ("Saved … to your wishlist") with a **View wishlist →** shortcut. Removing offers **Undo**. |
| Dedicated page | `/en/wishlist/` and `/bn/wishlist/` render the saved pieces with photo, title, category, price rule, Add to Bag, Remove, plus *Add all to bag* and *Clear wishlist*. |
| Empty state | "Your wishlist is currently empty … Explore our jewellery collection →" with links to shop, categories and occasions. |
| Header entry point | The existing heart in every page header is now a real link (`/en/wishlist/`, `/bn/wishlist/`) and keeps its live count badge. |
| Guest storage | `localStorage["emarket247_wishlist"]` = array of published product slugs, newest first, de-duplicated, capped at 120, sanitised against `/^[a-z0-9][a-z0-9-]{1,90}$/`. |
| Optional account copy | When a customer is signed in, the same list is mirrored under `emarket247_wishlist_account_<id>` so two customers on one browser never share a list, and the account dashboard shows the saved count. |
| Cross-tab sync | A `storage` listener keeps every open tab and the badge in step. |
| Honest data | Only slugs are stored. Titles, categories, prices and images always come from the approved catalogue (`/api/products.php`, falling back to `assets/data/catalog.<lang>.json`), so a saved item can never display stale facts. Prices keep the existing rule: a confirmed price or "Price on request". |

## 2. Files changed

**Runtime**

- `public_html/assets/js/site.js` — new wishlist section (store, badge, hearts,
  toasts, cross-tab sync, account mirror), a shared `loadCatalogRecords()` used
  by the grids and the wishlist page, wishlist-page renderer, PDP heart, and the
  optional account-subnav count.
- `public_html/assets/css/site.css` — `.wishlist-btn` overlay (positioned in the
  tile's top-right, sibling of the media link so the product link still works),
  PDP action button, wishlist page toolbar/empty/loading/remove styles, and
  `.icon-badge[hidden]` so a zero count is not shown.
- `public_html/product.php` — the dynamic product page header's heart is now a
  link to the language wishlist page (its PDP already renders the heart through
  the shared script).
- `public_html/en/account/index.html`, `public_html/bn/account/index.html` —
  "My Wishlist (n)" entry in the account sub-navigation.

**New pages**

- `public_html/en/wishlist/index.html`, `public_html/bn/wishlist/index.html` —
  generated from the canonical Shop page of the same language, so header,
  navigation, search panel, footer, toast host and the `site.js` reference are
  identical to the rest of the storefront.

**Tooling (repeatable)**

- `scripts/add-wishlist-pages.mjs` — generator for both wishlist pages.
- `scripts/wire-wishlist-nav.mjs` — turns the header heart `<button>` into a
  real link on every page. It matches a complete `&lt;button …&gt;…&lt;/button&gt;`
  element, so re-running it is a no-op (see §4 for the defect this fixed).
- `scripts/test-wishlist.mjs` — jsdom integration test (see §4).

**Mechanical**

- Every public HTML page: header heart converted to a link and `?v=` asset
  stamps refreshed with true content hashes by `scripts/fix-cache-busting.mjs`.

## 3. Decisions worth knowing

1. **Guest-first, no server write.** The wishlist performs no network write at
   all, so it cannot fail, leak or require consent. This is the lowest-friction
   and lowest-risk option and matches how the shopping bag already works.
2. **`noindex,follow` on the wishlist pages.** They contain no crawlable product
   content for anyone but the owner of the list, so indexing them would publish
   thin pages. They are therefore also left out of `sitemap.xml`. Both are
   one-line changes in `scripts/add-wishlist-pages.mjs` if the owner prefers the
   cart page's `index,follow` convention.
3. **Unpublished saved slugs are pruned, visibly.** If a saved product is later
   unpublished or renamed, the wishlist page drops it and tells the visitor
   ("… no longer published and was removed from your wishlist") instead of
   showing a broken card.
4. **Heart sits beside the media link, not inside it.** A `<button>` nested in an
   anchor is invalid HTML and breaks keyboard focus; the heart is an absolutely
   positioned sibling, so tapping the photo still opens the product page.
5. **Account sync is currently per-device.** Signing in mirrors and merges the
   list under the customer's own key in this browser. True cross-device sync
   needs server persistence, which is deliberately **not** shipped here because
   it requires a database migration and an API surface that only the owner can
   approve and run (see §6).

## 4. Verification

| Check | Command | Result |
| --- | --- | --- |
| HTML/catalogue/taxonomy/security validation | `npm run check` | Passed — "Checked 126 public HTML pages, 1 JavaScript files, 7 PHP files, both catalogues, and the canonical taxonomy." Only pre-existing warning: PHP CLI unavailable in this sandbox, so PHP syntax checks were skipped. |
| JavaScript syntax | `node --check public_html/assets/js/site.js` | Passed |
| Wishlist integration test (real DOM, real `site.js`) | `npm install --no-save jsdom && node scripts/test-wishlist.mjs` | 31/31 checks passed: hearts on every grid card, save/remove + badge + toast, PDP heart, wishlist page list, add-all-to-bag, remove, empty state, stale-slug pruning, Bengali page and links, plus a DOM-structure assertion on the converted header. |
| HTML tag balance across the whole site | tag-pair sweep of all 136 pages (`<button>`/`</button>`, `<a>`/`</a>`) | 0 unbalanced files; 129 pages carry the linked wishlist control and none carries the old `<button>` form. |
| Deployment snapshot | `npm run build` | "Deployment snapshot prepared from public_html at dist/public" (24 MB, no forbidden files). |
| Cache-busting | `node scripts/fix-cache-busting.mjs` | Version map `variables 0b3625cd · site 5e7796d3 · pdp c29083ed · js e6800159` applied to all 136 pages. |

jsdom is intentionally not a project dependency; the test exits with a clear
message if it is not installed.

### Defect found and fixed during verification

The first version of `scripts/wire-wishlist-nav.mjs` converted the heart with a
two-step regex; on its **second** run it replaced the next unrelated `</button>`
on each page, so the mobile menu toggle lost its closing tag on 129 pages. The
script now matches one complete button element with its own closing tag
(idempotent), the pages were restored from the previous commit and regenerated,
and the integration test gained a DOM-structure assertion so this class of
corruption cannot pass silently again. Fixed in `88fc325`.

## 5. Known limitations

- A visitor who clears browser site data loses the list (the page says so in the
  "Saved in this browser" note; the bag remains the durable path to an order).
- Private-mode browsers may refuse storage; saving then shows a clear message
  instead of silently doing nothing.
- Two signed-in accounts on one shared browser each keep their own merged list;
  a guest list on that browser is merged into whichever account signs in next
  (the same browser-level sharing the shopping bag already has).

## 6. Follow-up for true cross-device sync (needs owner approval)

Not implemented, because it requires a schema change and an approved API:

1. Migration (repository only, `database/`):
   `emk_wishlist_items(user_id INT UNSIGNED, sku VARCHAR(64), created_at TIMESTAMP,
   UNIQUE(user_id, sku), FOREIGN KEY(user_id) REFERENCES emk_users(id) ON DELETE CASCADE)`.
2. `public_html/api/wishlist.php`: `GET` returns the session user's SKUs;
   `POST {action: "add"|"remove"|"replace", sku}` writes them. Must call
   `checkAuth()` before reading input, use bound parameters, and rely on the
   existing global CSRF enforcement; `sku` must be validated against
   `emk_products`.
3. Front end: after login, union the local list with the server response, push
   the local-only SKUs up, then keep the local list as an offline cache. The
   merge policy (whose item wins when both sides changed) needs a product
   decision before release.

## 7. Rollback

Revert the feature commit. Runtime rollback alone is also safe: delete
`public_html/en/wishlist/` and `public_html/bn/wishlist/`, restore the header
heart markup from git, and remove the wishlist section from `site.js` —
`localStorage` keys are ignored by every other part of the site.
