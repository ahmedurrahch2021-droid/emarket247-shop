# eMarket247 — Sequential Task Queue

The single ordered list of what to do next. One task at a time, in this order.

Read `AGENTS.md` (rules) and `ENGINEERING_PLAYBOOK.md` (judgement, verification,
reporting) before starting. This file says *what* and *when*; those say *how*.

---

## Operating rules for every development tool

**Work in order.** Do not pick a task you find more interesting. If you believe
the order is wrong, say so in your report and wait — do not reorder silently.

**One task, one commit.** The commit message names the task. No unrelated
formatting, refactoring, or "while I was in there" changes.

**Read before writing.** Inspect the current `master`, the file you intend to
change, its generator, and its EN/BN counterpart. Many files here are generated;
editing output instead of its source guarantees the fix disappears later.

**Change the smallest thing that solves the task.** A large diff is not more
thorough, it is harder to review and revert.

**Never invent a commerce fact.** No price, stock level, material, delivery
window, review, or rating unless the owner confirmed it. "Price on Request" is
a correct answer.

**Run `npm test` after your final edit**, not before it. Then open the affected
pages in a browser, in both languages, and use the feature including one failure
case.

**Report honestly.** Use the format at the end of `ENGINEERING_PLAYBOOK.md`,
including the `Not verified:` line. A false "complete" is worse than an
unfinished task, because it removes the owner's ability to trust any report.

**Never do these without explicit owner approval:** deploy to Hostinger, force
push, rewrite history, delete a published URL, change checkout or authentication
logic, touch `api/config.php` credentials, or modify the live database.

---

## Deployment state — read first

Verified against the live site on 2026-09-15:

| Check | Result |
| --- | --- |
| `public_html/` in this repository | **Not deployed.** `emarket247.shop` serves an older build |
| `https://emarket247.shop/api/database.sql` | 404 — the schema dump is not exposed on the live server |
| `https://emarket247.shop/api/upload.php` | 401 — the API exists and is the **unpatched** version |
| `https://emarket247.shop/en/admin/` | 200 — the admin dashboard is publicly reachable |

Three consequences that every tool must understand:

1. **The security fixes in this repository protect nothing yet.** They are code,
   not deployment. The live server still runs the old upload endpoint.
2. **The live database is separate from this repository.** Product rows, prices,
   and accounts created through the live admin exist only there. Never assume
   the catalogue JSON in this repo reflects live data, and never regenerate live
   data from it.
3. **Any prices currently visible in the admin are owner test data**, not
   approved commerce facts. They must be removed before launch (task T0).

## T0 — Remove test data and stop trusting it

**Why:** two placeholder prices were entered by the owner to confirm the admin
panel worked. If they survive to launch, the store publishes invented prices.

**Do:** identify every test product, test price, and test order in the live
database, list them for the owner, and remove them once confirmed. Do not delete
anything the owner has not confirmed is test data.

**Done when:** every remaining price in the database is one the owner approved,
and `is_price_pending` is correct for everything else.

## T1 — Consolidate the duplicate source trees

**Why:** `static-site/` (51 MB), `src/` (10 MB), and `client/` hold near-copies
of the live site. A fix applied to one leaves the others stale, which is exactly
how a patched security hole survived in a second file. This also removes the
React/Vite/Express dependency surface that carries the current
`npm audit` findings.

**Do:** Establish which of `static-site/`, `src/`, `client/`, `server/`, and
`server.ts` are genuinely unused. For each, prove it: no script, config, or
documentation references it, and nothing in `public_html/` is generated from it.
Produce that evidence list first. Then, with owner approval, delete the unused
trees in one commit per tree, and remove the now-unused dependencies from
`package.json`.

**Do not** delete anything that a script in `scripts/` still reads.

**Done when:** the repository has one source of truth for the storefront,
`npm test` passes, `npm run build` produces the same `dist/public` output as
before, and repository size is materially reduced.

---

## T2 — Clean the repository of development debris

**Why:** stray artefacts make it impossible to see what matters.

**Do:** remove `Screenshot (81).png`, `site.css.2`, `site.css.3`, the duplicate
`fix-pdp-accordion.cjs`/`.js` pair, and any other one-off artefact with no
current purpose. Move genuinely useful one-off scripts into `scripts/archive/`
with a one-line header saying what each did and when it was last needed.

**Done when:** every file in the repository root has an explainable reason to
exist.

---

## T3 — Re-encode uploaded product images on the server

**Why:** the admin upload endpoint accepts and stores whatever is uploaded, up
to 5 MB, at original dimensions and with EXIF metadata intact. Product photos
taken on a phone routinely exceed that budget and carry GPS coordinates. Do this
before anyone loads the catalogue in bulk, not after.

**Do:** extend `public_html/api/upload.php` so that after the existing security
checks, the image is re-encoded server-side: convert to WebP, cap the long edge
at about 1600 px, strip EXIF (which contains location data), and target roughly
200 KB. Keep the existing verification logic exactly as it is — re-encoding is
an addition, not a replacement. Handle the case where GD or Imagick is
unavailable by failing cleanly with a clear admin-facing message.

**Verify:** upload a large phone photo and confirm the stored file is WebP,
correctly oriented, under budget, and displays properly on a product page.

**Done when:** no newly uploaded image exceeds 200 KB and orientation is
correct.

---

## T4 — Bring existing images inside budget

**Why:** 46 MB of images, 34 files over 300 KB, including 3.7 MB PNGs in
`assets/editorial/`. This alone makes LCP ≤ 2.5 s impossible.

**Do:** re-encode every existing image to WebP within the budget in
`ENGINEERING_PLAYBOOK.md`. Remove the duplicate copies that exist in both
`assets/images/` and `assets/images/products/` — keep one path and update
references. Add `width`, `height`, and meaningful bilingual `alt` to every
`<img>`. Use `loading="lazy"` below the fold, never on the LCP image.

**Do not** change any image filename that appears in a published page without
updating every reference.

**Done when:** no image exceeds 200 KB, no image is stored twice, and a product
page weighs under 1 MB.

---

## T5 — Establish one authoritative product source

**Why:** the database, `assets/data/catalog.*.json`, and the static product
pages are three sources of truth that can disagree. After the client's upload
session, the database is correct and the other two are stale.

**Do:** define the publishing direction explicitly — database is authoritative,
catalogue JSON and static pages are generated from it. Write or repair one
generator that produces both languages from the database, preserving every
published slug and URL exactly. Delete or clearly mark the competing generators
in `scripts/` so no tool uses the wrong one again.

**Verify:** every EN/BN pair matches on ID, SKU, slug, category, image, and
price state. No published URL changed.

**Done when:** regenerating produces no unexpected diff, and no page contradicts
the database.

---

## T6 — Harden the remaining API endpoints

**Why:** admin sessions can read every customer's name, phone, and address.
`products.php` and `orders.php` accept writes with no CSRF protection, and the
login endpoint has no meaningful brute-force protection.

**Do:**
- add CSRF tokens to every state-changing admin request;
- add login rate limiting (progressive delay plus temporary lockout per account
  and per IP);
- confirm `checkAuth()` / `checkAdmin()` is the first statement in every write
  path, before any input is read;
- recalculate order totals server-side from stored product data, never trusting
  a posted price;
- return generic error messages, logging detail server-side only;
- whitelist any sort or filter column that reaches SQL.

**Verify:** each endpoint logged out, and as a customer-role user. Any success
is a bug.

**Done when:** no state-changing endpoint accepts an unauthenticated,
non-admin, or cross-site request.

---

## T7 — Verify the complete order journey

**Do:** walk browse → search → product → bag → cart → WhatsApp in both
languages, on a 360 px viewport and desktop, including: empty cart, quantity
changes, removing the last item, a product with no approved price, and a failed
network request. Confirm the WhatsApp message carries product title, SKU, and
URL.

**Done when:** every step works in EN and BN, and every failure state shows a
clear message instead of breaking.

---

## T8 — Truthful SEO and structured data

**Do:** add `Offer` structured data **only** where price, currency, and
availability are confirmed by the owner in the database. At the time of writing
no approved price exists, so the correct output is no `Offer` at all. Products
awaiting approval keep their honest pending state. Re-check canonicals,
reciprocal hreflang, unique titles and descriptions, sitemap accuracy (currently
97 URLs against 120 pages — confirm the gap is deliberate), and genuine 404s.

**Done when:** structured data validates and every claim in it is true.

---

## T9 — Accessibility and Bengali quality

**Do:** keyboard-only navigation through the full order journey, visible focus
states, contrast against the vermilion palette, form labels and errors, image
alt text in both languages, Bengali digits and typography consistency, and
correct line height for long Bengali product titles.

**Done when:** WCAG 2.2 AA holds on the templates, and a Bengali page contains
no untranslated interface text.

---

## T10 — Measure Core Web Vitals

**Do:** measure LCP, INP, and CLS on the four page templates (home, shop,
product, cart) on a throttled mobile connection. Report numbers, not
impressions. Fix what misses budget, then measure again.

**Done when:** every template meets the budget with evidence attached.

---

## T11 — Verify business claims and policies

**Do:** confirm with the owner every delivery window, refund term, privacy
statement, contact detail, and payment claim shown on the site, including the
bKash/Nagad/Visa footer logos — a payment logo implies an accepted payment
method.

**Done when:** every published claim is confirmed or removed.

---

## T12 — Release

**Do:** back up the live site and database; rotate all credentials; run
`npm test` and `npm run build`; confirm `database/` and all `.sql`, `.env`, and
log files are excluded from the upload; deploy `public_html/` manually with
owner approval; then verify on production: HTTPS redirect, HSTS, a real 404,
sitemap, robots, admin login, one complete WhatsApp order, and both languages.
Watch field Core Web Vitals for a week.

**Done when:** the production checks pass and the owner has confirmed the store
behaves correctly on a real device.

---

## Completed and not to be redone

- Admin product sheet export (CSV with UTF-8 BOM, EN/BN URLs, pending prices
  exported as empty cells). Do not replace it with a library or a second export.
- Breadcrumbs hidden by one visually-hidden CSS block in `site.css`, kept in the
  DOM for structured data and screen readers. Do not delete the markup, and do
  not "restore" the visible row.

## Owner-only actions (no tool performs these)

1. **Decide how to handle the administrator password now.** It is published in
   this repository's history, the repository is public, the live admin panel is
   reachable, and the live server still runs the unpatched upload endpoint.
   Either change the password (the login email stays the same, so the client is
   not disrupted) or deploy the patched `api/upload.php` and
   `assets/images/.htaccess` to the live server, and preferably both.
2. Give each person their own administrator account once the current work is
   done, then delete the shared one.
3. Rotate the database and hosting passwords.
4. Decide whether the GitHub repository should stay public.
