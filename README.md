# eMarket247 — Fashion & Jewellery

Bilingual English/Bengali jewellery storefront for Bangladesh.

## Approved development contract

- `master` is the owner-approved working branch.
- `public_html/` is the authoritative website and final Hostinger deployment tree.
- Each commit must contain one clear task and its EN/BN counterpart work.
- Published URLs must remain stable unless an approved migration includes tested 301 redirects.
- Production deployment is manual and requires owner approval.
- Do not fabricate prices, availability, materials, reviews, ratings, delivery promises, or other commerce facts.

Read [`AGENTS.md`](AGENTS.md) before making changes.

## Technology

The approved target is a static-first storefront:

- semantic HTML;
- shared CSS;
- vanilla JavaScript;
- Apache `.htaccess` for real 404s, caching, headers, and stable directory URLs;
- bilingual `/en/` and `/bn/` route trees;
- WhatsApp as the active order/conversion path.

### Current architecture status

The public pages and assets are static, but the repository still contains dynamic PHP/MySQL behavior:

- `.htaccess` routes product URLs through `product.php`;
- `product.php` reads from MySQL and falls back to static product pages;
- `public_html/api/` contains authentication, product, order, and upload endpoints.

Until those dependencies are audited and deliberately migrated, the deployed repository is technically hybrid rather than fully static. Do not remove or bypass PHP/API files without confirming production use and preserving product URLs, SEO, cart behavior, and EN/BN parity.

## Repository structure

| Path | Purpose |
| --- | --- |
| `public_html/` | Authoritative site and Hostinger deployment tree |
| `public_html/en/` | English pages |
| `public_html/bn/` | Bengali pages |
| `public_html/assets/css/` | Shared design system and page styles |
| `public_html/assets/js/site.js` | Shared frontend behavior |
| `public_html/assets/data/` | Bilingual catalogue records |
| `public_html/en/products/` | English static product pages |
| `public_html/bn/products/` | Bengali static product pages |
| `public_html/.htaccess` | Apache routing, error, cache, and header rules |
| `public_html/sitemap.xml` | Canonical indexable URL inventory |
| `public_html/robots.txt` | Crawler directives |
| `scripts/` | Validation and controlled build utilities |
| `dist/public/` | Optional generated snapshot; never the editing source |
| `static-site/`, `client/`, `server/`, `shared/`, `src/` | Legacy trees; do not use for active storefront work |

## Local checks

Run the public-site quality gate before completing a task:

```bash
npm test
```

It checks core metadata, EN/BN page counterparts, local references, catalogue parity, JavaScript syntax, PHP syntax when PHP CLI is available, and known unsafe price placeholders.

Create an optional clean snapshot from `public_html/`:

```bash
npm run build
```

The snapshot is written to `dist/public/`. The build does not modify `public_html/` or synchronize legacy trees.

## Required task workflow

1. Synchronize and inspect the latest `master` state.
2. Read `AGENTS.md`.
3. Define one bounded task and exact file list.
4. Identify authoritative data, generators, and EN/BN counterparts.
5. Make the smallest coherent change.
6. Run `npm test` and focused browser checks.
7. Commit with a task-specific message.
8. Report the commit, changed files, checks, risks, and rollback command.
9. Do not deploy or force-push.

## Product and URL rules

- English and Bengali catalogue records must preserve matching product IDs and slugs.
- Existing product folder names are published URLs, even when their wording is imperfect.
- Correct product categories through authoritative catalogue data, not silent folder renames.
- Product structured data may include an `Offer` only when price, currency, and availability are verified.
- Unknown routes must return a genuine HTTP 404, not the homepage.

## Design direction

Preserve the established Vermilion Atelier system unless a redesign is explicitly approved:

- DM Serif Display;
- DM Sans;
- Noto Bengali;
- vermilion `#ED1C24`;
- warm ivory/parchment surfaces;
- responsive, accessible, editorial jewellery presentation.

## Completion sequence

1. Establish the controlled development baseline.
2. Normalize the static-versus-hybrid architecture.
3. Reconcile catalogue taxonomy and EN/BN product identity.
4. Standardize shared header, footer, navigation, and design components.
5. Verify browse → product → bag → cart → WhatsApp behavior.
6. Complete technical SEO and truthful structured data.
7. Validate accessibility and Bengali internationalization.
8. Optimize Core Web Vitals by page template.
9. Verify policies, business claims, and trust content.
10. Complete release checks, credential rotation where applicable, backup, and manual deployment.

## Quality targets

- WCAG 2.2 AA working target.
- LCP ≤ 2.5 seconds.
- INP ≤ 200 ms.
- CLS ≤ 0.10.
- Unique titles and descriptions on indexable pages.
- Self-referencing canonicals and reciprocal EN/BN hreflang.
- No fabricated commerce data or unsupported structured-data claims.
- No broken internal links, orphan pages, soft 404s, or unapproved URL changes.

These targets must be proven through automated checks, focused browser testing, and—after deployment—field monitoring. They must not be described as perfect merely because the code appears complete.

## Deployment

The approved deployment source is `public_html/`. Before uploading:

1. run the quality gate;
2. test representative EN/BN pages and the complete WhatsApp journey;
3. confirm no secrets, database setup files, logs, or development artifacts are included;
4. back up the existing Hostinger site;
5. upload only after owner approval;
6. verify HTTPS, redirects, 404 behavior, sitemap, robots, headers, and critical journeys on production.
