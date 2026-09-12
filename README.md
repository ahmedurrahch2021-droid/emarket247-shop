# eMarket247 — Fashion & Jewellery (Bangladesh)

Bilingual (English / Bengali) jewellery storefront. Pure static HTML + CSS + vanilla
JavaScript, deployed by uploading `public_html/` through the Hostinger File Manager.

## Project Overview

- **Name**: eMarket247
- **Stack**: Static HTML + CSS + vanilla JS + PHP backend (MySQL). No frontend framework.
- **Canonical source**: `public_html/` — this is what ships to Hostinger, nothing else.
- **Hosting**: Hostinger shared hosting (Apache + `.htaccess`), file-manager upload.
- **Languages**: `/en/` and `/bn/` route trees, 116 HTML files total. Every page carries
  reciprocal `hreflang` (`en`, `bn`, `x-default`).
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
- Mobile header: 44px touch targets, hamburger with animated spans, Account/Wishlist/Cart
  in mobile nav row, icon-only WhatsApp at ≤400px
- CSS cache-busting via `?v=<md5-8>` on all 116 pages

### Not yet implemented

- Real product prices, SKUs, materials, availability and stock (schema established; values await business approval)
- Cart + checkout + WhatsApp ordering + bKash/Nagad/COD (Phases 4–5)
- Full SEO/AEO pass, incl. Product / BreadcrumbList JSON-LD (Phase 6)
- Image replacement and optimisation (Phase 7)
- Admin order inbox (Phase 5)

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
| `/en/admin/`, `/bn/admin/` | Admin panel (noindex) |
| `/404.html` | Served by Apache `ErrorDocument` |

All routes exist under both `/en/` and `/bn/`. No query parameters are used for routing.

## Data Architecture

- **Static catalogue**: `public_html/assets/data/catalog.en.json` and `catalog.bn.json`,
  48 records each. Read by `site.js` in the browser.
- **PHP backend** (`public_html/api/`): `products.php`, `orders.php`, `auth.php`,
  `upload.php`, `config.php`. Config reads env vars with a one-time hardcoded fallback.
- **Database**: MySQL via Hostinger phpMyAdmin. Schema: `emk_products`, `emk_users`,
  `emk_orders`, `emk_wishlist`.
- **Known data issue**: catalogue records declare `image.width/height` of 1200×1200
  while the actual files are 475×475. Corrected in Phase 7 alongside image work.

## Local Development

Preview the site with the built-in server:

```bash
npm run dev          # serves public_html/ on http://localhost:3000
npm run preview      # serves public_html/ on http://localhost:3000 (production mode)
```

To preview without Node:

```bash
cd public_html && python3 -m http.server 3000
```

> Note: Python's `http.server` does not emulate Apache's `ErrorDocument`, so 404
> behaviour must be verified against real Apache or Hostinger.

### Validation

```bash
node scripts/validate-pure-static.mjs
```

Checks per-page metadata (lang, title, description, canonical, both `hreflang`s, `h1`,
skip link), navigation presence, breadcrumbs, audited routes, required assets, and:

- `.htaccess` declares `ErrorDocument 404 /404.html`
- `.htaccess` has **no** SPA catch-all rewrite
- every root-relative `href`/`src`/`srcset` reference resolves to a real file
- `assets/css` / `assets/js` references carry a `?v=` content hash

### Cache-busting (run before every deploy)

```bash
npm run build
# or directly:
node scripts/fix-cache-busting.mjs
```

Computes MD5 hashes of `site.css`, `pdp.css`, `variables.css`, `site.js` and stamps
them on every HTML file. Always run after editing CSS or JS.

## Deployment

1. Edit `public_html/` locally
2. Run `npm run build` (cache-busting)
3. Upload `public_html/` contents to Hostinger File Manager
   - Include `.htaccess` (File Manager hides dotfiles by default — enable showing them)
   - Everything inside `public_html/` goes directly into Hostinger's `public_html/`

## Deployment

1. Run `npm run build` to refresh CSS/JS hashes
2. Upload the **contents** of `public_html/` to Hostinger's `public_html/` via File Manager
   (enable "show hidden files" to see `.htaccess`)

> **Do not upload `static-site/`, `client/`, `server/`, `scripts/`, or any other
> directory** — they are excluded from the deployment target.

## Caching Strategy

`.htaccess` caches CSS and JS for one year as `immutable` (they change URL on every
deploy via `?v=<hash>`). HTML revalidates every 10 minutes so a new release reaches
visitors promptly.

## Improvement Phases

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Deployment-correctness safe fixes | ✅ Complete |
| 1 | CSS consolidation + basic performance | ✅ Complete |
| 2 | Product data model + real categories/prices | In progress — schema established, 21/48 mapped, 27 awaiting business decision |
| 3 | Product detail pages | ✅ HTML structure complete, prices pending |
| 4 | Cart + localStorage | Pending |
| 5 | Checkout + WhatsApp + bKash/Nagad/COD + admin order inbox | Pending |
| 6 | Final SEO / AEO | Pending |
| 7 | Image replacement/optimisation + deployment cleanup | Pending |

## Security Notes

- `public_html/api/config.php` reads DB credentials from environment variables
  (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`). Rotate credentials and remove
  the hardcoded fallback before going live.
- `public_html/api/upload.php` validates MIME type with `finfo_file()`, strips
  double extensions, and re-encodes uploads as WebP.
- `/admin/` and `/api/` are `noindex` but not blocked from direct access.
  Add HTTP-auth or IP restrictions in `.htaccess` before launch.
