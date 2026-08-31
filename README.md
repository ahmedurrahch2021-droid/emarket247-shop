# eMarket247 — Fashion & Jewellery (Bangladesh)

Bilingual (English / Bengali) jewellery storefront. Pure static HTML + CSS + vanilla
JavaScript, deployed by uploading `dist/public/` through the Hostinger File Manager.

## Project Overview

- **Name**: eMarket247
- **Stack**: Static HTML + CSS + vanilla JS. No framework, no runtime dependencies.
- **Hosting**: Hostinger shared hosting (Apache + `.htaccess`), file-manager upload.
- **Languages**: `/en/` and `/bn/` route trees, 27 pages each, plus root and `404.html`
  (56 HTML files total). Every page carries reciprocal `hreflang` (`en`, `bn`, `x-default`).
- **Design**: Premium / editorial jewellery treatment. The existing design is
  deliberately preserved — improvement work is corrective, never a redesign.

## Current State

The site is a **catalogue preview**, not yet a transacting store. 48 catalogue records
render from JSON with honest "price and specifications in preparation" copy. There are
deliberately no fabricated prices, SKUs, materials, or stock figures.

### Working today

- Bilingual navigation, header/footer chrome, breadcrumbs, skip links
- Home hero slider (3 slides, prev/next controls)
- Shop and category grids rendered client-side from JSON
- Catalogue filtering (6 category buttons) and sorting (record order / A–Z / category)
- Branded genuine-404 page at `/404.html`
- `robots.txt` and `sitemap.xml`

### Not yet implemented

- Real product prices, SKUs, materials, availability and stock (Phase 2 established the schema; values await business approval)
- Product detail pages (Phase 3)
- Cart (Phase 4)
- Checkout, WhatsApp ordering, payment (Phase 5)
- Full SEO/AEO pass, incl. Product / BreadcrumbList JSON-LD (Phase 6)
- Image replacement and optimisation, deployment cleanup (Phase 7)

## Route Map

| Path | Purpose |
| --- | --- |
| `/` | Root, mirrors `/en/index.html` |
| `/en/`, `/bn/` | Home |
| `/en/shop/`, `/bn/shop/` | Full 48-record catalogue with filter + sort |
| `/en/categories/` + 9 children | `bangles`, `bracelets`, `bridal-jewellery`, `earrings`, `gift-jewellery`, `jewellery-sets`, `necklaces`, `pendants`, `rings` |
| `/en/occasions/` + 8 children | `anniversary`, `birthday`, `bridal`, `eid`, `gifts`, `puja`, `wedding` |
| `/en/about/`, `/contact/`, `/care/`, `/guides/`, `/privacy/`, `/terms/` | Content pages |
| `/en/studio-pilot/` | Internal image pilot, `noindex,nofollow` |
| `/404.html` | Served by Apache `ErrorDocument` |

All routes exist under both `/en/` and `/bn/`. No query parameters are used for routing.

## Data Architecture

- **Storage**: none. Static JSON files read by the browser; no database, no server.
- **Catalogue**: `assets/data/catalog.en.json` and `catalog.bn.json`, 48 records each.
  Record keys (model `2.0`): `id`, `slug`, `sku`, `category`, `categoryLabel`,
  `title`, `description`, `price`, `compareAtPrice`, `currency`, `availability`,
  `materials`, `sizes`, `variants`, `image{src,srcset,width,height,alt,caption}`,
  `gallery`, `seo{title,description}`, `status`, `copyright`, `original_filename`.
  `currency` is fixed to `"BDT"`; every commerce field without an approved value
  (`sku`, `price`, `compareAtPrice`, `availability`, `materials`, `sizes`,
  `variants`, `gallery`) is `null` / an empty array and is **never** fabricated.
  `image` is the primary-image metadata (with alt text) and `gallery` holds approved
  additional views once they exist.
- **Mapping**: 21 of 48 records are mapped into real categories — `bangles` (14),
  `necklaces` (4), `bracelets` (2), `earrings` (1). The other **27** records remain
  in the `jewellery-detail` bucket pending a business category decision.
- **Empty categories**: `rings`, `pendants`, `jewellery-sets`, `gift-jewellery`,
  and `bridal-jewellery` hold no products. They stay empty (no guessing) and their
  category pages are temporarily `noindex,follow` and excluded from `sitemap.xml`
  until approved products arrive.
- **Flow**: `site.js` fetches `/assets/data/catalog.<lang>.json`, builds cards via
  `productCard()`, injects them into `.product-grid`, then wires filter and sort.
- **Known data issue**: catalogue records declare `image.width/height` of 1200×1200
  while the actual files are 475×475. Corrected in Phase 7 alongside image work.

## Local Development

There is no build step for the site itself — the files under `static-site/` are what
ship. To preview:

```bash
cd static-site && python3 -m http.server 3000
```

Note that `python3 -m http.server` does not emulate Apache's `ErrorDocument`, so 404
behaviour must be verified against real Apache or an emulating server.

### Validation

```bash
node scripts/validate-pure-static.mjs
```

Checks per-page metadata (lang, title, description, canonical, both `hreflang`s, `h1`,
skip link), navigation presence, breadcrumbs, audited routes, required assets, and:

- `.htaccess` declares `ErrorDocument 404 /404.html`
- `.htaccess` has **no** SPA catch-all rewrite (which would create soft-404s)
- every root-relative `href`/`src`/`srcset` reference resolves to a real file
- `assets/js/site.js` does **not** inject CSS at runtime (Phase 1 regression guard)
- every `assets/css` / `assets/js` reference carries a `?v=` content hash (Phase 1 guard)

### Packaging for upload

```bash
node scripts/build-managed-static-site.mjs   # writes dist/public/
```

Upload the **contents** of `dist/public/` to `public_html/`, including the dotfile
`.htaccess` (Hostinger File Manager hides dotfiles by default — enable showing them).

`npm run build` additionally bundles the unused `server/` directory with esbuild and
currently exits 127 because esbuild is not installed. This is pre-existing, affects only
dead code, and does not block the static package. Cleaned up in Phase 7.

## Caching and Cache Busting

`site.css` and `site.js` are referenced with a `?v=<md5-8>` content hash, so a release
is a new URL. `.htaccess` therefore caches them for one year as `immutable`, while HTML
revalidates every 10 minutes so a new release reaches visitors promptly.

**When you edit `site.css` or `site.js`, the hash must be updated across all 56 pages.**
The validator only checks that a hash is present, not that it is current — verify with:

```bash
cd static-site
md5sum assets/css/site.css | cut -c1-8   # must match ?v= in the HTML
md5sum assets/js/site.js  | cut -c1-8
```

## Improvement Phases

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Deployment-correctness safe fixes | ✅ Complete (`4b6a217`) |
| 1 | CSS consolidation + basic performance | ✅ Complete (`0535497`) |
| 2 | Product data model + real categories/prices | In progress — schema established, 21/48 mapped, 27 awaiting business decision, prices pending |
| 3 | Product detail pages | Pending |
| 4 | Cart | Pending |
| 5 | Checkout + WhatsApp + payment | Pending |
| 6 | Final SEO / AEO | Pending |
| 7 | Image replacement/optimisation + deployment cleanup | Pending |

### Phase 0 (complete)

Removed the `.htaccess` SPA catch-all that turned every unknown URL into a soft-404
homepage; added `ErrorDocument 404 /404.html` and built `/404.html` from the existing
chrome with no new CSS. Repointed 6 broken studio-pilot image references. Fixed a sort
bug where `Number("src-001")` produced `NaN`. Deleted 96 unreferenced product images
(2.8 MB).

### Phase 1 (complete)

**CSS consolidation.** `site.js` was appending five `<style>` elements to `<head>` on
every page load, so the browser painted with an incomplete stylesheet and re-laid-out
when the script ran. Worst case: the hero painted as a 42%/58% split grid before
flipping to full-bleed. All five blocks now live at the end of `site.css`, verbatim and
in their original DOM-append order — order is significant, since later sections
deliberately override earlier ones.

Proven visually identical by fingerprinting 31 selectors × 55 computed CSS properties
across 8 page/viewport combinations (264 measurements): the fingerprint was **byte-identical**
before and after consolidation, with runtime `<style>` tags dropping 5 → 0.

**Cache busting.** Consolidating CSS and JS together created a hazard: a returning
visitor could receive the new `site.js` (no longer injecting styles) alongside a cached
old `site.css` (lacking those rules), producing an unstyled page. Closed by adding
`?v=<md5-8>` to both assets on all 56 pages.

**Layout stability.** Added intrinsic `width`/`height` to 62 `<img>` tags (181 total, 0
missing). This exposed a pre-existing bug: the reset was `img{max-width:100%;display:block}`
with **no `height:auto`**, letting the intrinsic `height` attribute override CSS
`aspect-ratio`. Adding `height:auto` fixed three squashed cases at once:

| Element | Box ratio before | After | CSS target |
| --- | --- | --- | --- |
| `.page-hero figure img` | 0.31 | **1.45** | `1.45/1` |
| `.product-card > img` (48 cards) | 0.35 | **1.00** | `1/1` |
| `.site-footer` logo | 1.44 | **1.91** | 800×418 native |

Shop `.page-hero` height dropped 2383px → 754px. All geometry verified stable between
early and late snapshots (no layout shift).

Also removed two provably-dead CSS rules and added the two validator regression guards
listed above. `site.js` shrank 16,795 → 11,886 bytes (−29%).

### Phase 2 (in progress)

**Product data model.** Extended the bilingual catalogue schema (`modelVersion: "2.0"`)
with eCommerce-ready fields on all 48 records in both `catalog.en.json` and
`catalog.bn.json`: `sku`, `description`, `price`, `compareAtPrice`, `currency: "BDT"`,
`availability`, `materials`, `sizes`, `variants`, `gallery`, and `seo{title,description}`.
`image` is documented as the primary-image metadata (incl. alt text). No prices, SKUs,
materials, sizes, variants, gallery images, ratings, or stock figures were invented —
every unapproved commerce field is `null`/empty, keeping the site's honest
"details in preparation" presentation intact.

**Category mapping.** 21 records already sit in real categories — `bangles` (14),
`necklaces` (4), `bracelets` (2), `earrings` (1). The remaining **27** `jewellery-detail`
records (`src-001..013`, `src-031`, `src-033..045`) need the business's category
decision; none were guessed.

**Empty categories.** `rings`, `pendants`, `jewellery-sets`, `gift-jewellery`, and
`bridal-jewellery` have no products. They stay empty and their pages are temporarily
`noindex,follow` with their URLs removed from `sitemap.xml` until approved products are
assigned.

**Visual design unchanged.** No CSS or page markup changed; the catalogue continues to
render from the same `image`/`title`/`categoryLabel`/`caption`/`status` fields via
`site.js`. Product images are untouched pending the later optimised uploads.

**Validation.** `validate-pure-static.mjs` now asserts the Phase 2 schema: 48 records per
language, identical id order, `currency === "BDT"`, null/empty commerce fields, exact
category counts (27 / 14 / 4 / 2 / 1), empty categories stay empty with `noindex`, and the
sitemap excludes the 10 empty-category URLs.

## Deployment

- **Platform**: Hostinger shared hosting, manual File Manager upload of `dist/public/`
- **Status**: catalogue preview — not accepting orders
- **Requires**: Apache with `mod_deflate`, `mod_expires`, `mod_headers`
- **Last updated**: Phase 1
