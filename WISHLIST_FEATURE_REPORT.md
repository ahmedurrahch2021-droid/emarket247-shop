# Wishlist Feature — Implementation Report

**Task:** Guest-first wishlist: heart control on product tiles, save/remove in
`localStorage`, header heart linked to a dedicated wishlist page, and
`/en/wishlist/` + `/bn/wishlist/` pages that list the saved pieces with
add-to-bag and remove actions plus an empty state.

**Status:** Implemented and verified. No account, sign-up, e-mail or server
write is required to use the wishlist. Signing in additionally stores the list
on the account, so the same wishlist opens on another device.

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
| Optional account copy | When a customer is signed in, the list is stored on the account (`emk_wishlist_items`) and also mirrored under `emarket247_wishlist_account_<id>` so two customers on one browser never share a list. The account dashboard shows the saved count. |
| Cross-device wishlist | Signed in, the browser list and the account list are **unioned** on load: a piece saved on a phone appears on a laptop, a piece saved as a guest before signing in is kept (and pushed up once), and nothing is ever deleted by signing in. |
| Storage that cannot fail silently | The list uses the strongest storage layer that answers — device (`localStorage`), session (`sessionStorage`) or memory. A visitor whose browser blocks saved items still gets a working list for the visit and is told plainly what could not be kept. |
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

**Server-side (new)**

- `database/wishlist-migration.sql` — the wishlist table, unique per
  (user, slug) and cascading on account deletion. Repository only; run once on
  the live database (see §6).
- `public_html/api/wishlist.php` — session-scoped read/replace/clear for a
  signed-in customer, with bound parameters, published-slug validation and the
  existing global CSRF enforcement.

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
5. **Account sync is now real, and the merge policy is "union, then push".**
   Signing in unions the browser list with the account list and pushes anything
   the account does not have yet. Union was chosen because it can only ever add
   a saved piece, never silently delete one: the failure mode of "last device
   wins" (a removal on one device wiping the list elsewhere) is worse than an
   item reappearing. If the owner prefers deletions to win, that is a product
   decision and a small change in `mergeWishlistWithServer()`.
6. **Guests cause no request at all.** Every wishlist API call sits behind a
   signed-in check in `site.js`, and `scripts/validate-public-html.mjs` now
   fails the build if that guard is removed. `scripts/test-wishlist.mjs` asserts
   a guest session performs zero `/api/wishlist.php` calls.

## 4. Verification

| Check | Command | Result |
| --- | --- | --- |
| HTML/catalogue/taxonomy/security validation | `npm run check` | Passed — "Checked 126 public HTML pages, 1 JavaScript files, 8 PHP files, both catalogues, and the canonical taxonomy." Now also checks the wishlist endpoint's auth/parameter/SQL hygiene and the migration's unique + cascade invariants. Only pre-existing warning: PHP CLI unavailable in this sandbox, so PHP syntax checks were skipped. |
| JavaScript syntax | `node --check public_html/assets/js/site.js` | Passed |
| Wishlist integration test (real DOM, real `site.js`) | `npm install --no-save jsdom && node scripts/test-wishlist.mjs` | 44/44 checks passed: hearts on every grid card, save/remove + badge + toast, PDP heart, wishlist page list, add-all-to-bag, remove, empty state, stale-slug pruning, Bengali page and links, a DOM-structure assertion on the converted header, guest isolation (no API call at all), signed-in union + push of browser-only pieces, removal stored on the account, and both blocked-storage cases. |
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

- A guest who clears browser site data loses the list (the page says so). A
  signed-in customer keeps it: the account copy is fetched again on the next
  visit.
- If the browser blocks every storage layer, the list lasts for the current page
  only and the visitor is told exactly that; the bag and WhatsApp ordering remain
  available (the bag has the same pre-existing storage constraint).
- Union merge means an item removed on one device can reappear from another
  device that still had it; removals are not tombstoned (see §3.5).
- Two signed-in accounts on one shared browser each keep their own list; a guest
  list on that browser is merged into whichever account signs in next (the same
  browser-level sharing the shopping bag already has).
- `en/privacy/` and `bn/privacy/` are still placeholder pages. When the real
  policy is written it should state that a signed-in customer's wishlist is
  stored on the account (product references only — no payment or personal data).

## 6. Cross-device sync — shipped, with one owner action

Implemented in the follow-up commit; the only step that cannot be done from this
sandbox is running the migration on the live database:

1. `database/wishlist-migration.sql` — adds
   `emk_wishlist_items(id, user_id, slug, created_at, UNIQUE(user_id, slug),
   FOREIGN KEY(user_id) REFERENCES emk_users(id) ON DELETE CASCADE)`. Re-runnable,
   creates only, deletes nothing.
2. `public_html/api/wishlist.php` — `GET` returns the session user's slugs;
   `POST {action:"replace"|"clear", slugs:[…]}` writes them. `checkAuth()` runs
   before any input is read, every statement is prepared with bound parameters,
   slugs are validated against `emk_products.is_active`, and CSRF is enforced on
   the write by the shared `config.php`.
3. `site.js` — after the session is known, the browser list and the account list
   are unioned; anything the account lacks is pushed once; then the browser copy
   stays the offline source.

**Owner action required before cross-device sync works in production:** run
`database/wishlist-migration.sql` once in Hostinger's phpMyAdmin (the database
already used by the storefront). Until then the endpoint returns a generic
"wishlist is unavailable" error and the feature silently stays browser-only —
no page breaks, no data is written.

## 7. Rollback

Revert the feature commits. Runtime rollback alone is also safe: delete
`public_html/en/wishlist/` and `public_html/bn/wishlist/`, restore the header
heart markup from git, and remove the wishlist section from `site.js` —
`localStorage` keys are ignored by every other part of the site. The account
table can be left in place or dropped with
`DROP TABLE IF EXISTS emk_wishlist_items;` — nothing else references it.
