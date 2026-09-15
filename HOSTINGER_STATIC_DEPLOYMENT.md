# eMarket247 — Hostinger Deployment Contract

## Approved source

- `public_html/` is the authoritative website and final Hostinger deployment tree.
- Edit and review the site in `public_html/`; do not develop against `dist/public/` or legacy trees.
- `dist/public/` is an optional snapshot generated from `public_html/` by `npm run build`.
- Never copy `dist/public/` back into `public_html/`.
- Deployment is manual and requires the project owner's approval.

## Hosting model

The storefront is a bilingual multi-page site on Hostinger shared hosting with Apache.

- English routes live under `/en/`.
- Bengali routes live under `/bn/`.
- Directory routes resolve to their own `index.html` files.
- Unknown routes must return a genuine HTTP 404 using `/404.html`.
- Do not add a single-page-application catch-all rewrite.

### Current architecture warning

The approved target is static HTML, CSS, and vanilla JavaScript, but the current repository still includes PHP/MySQL behavior. Product routes are currently rewritten to `product.php`, and `public_html/api/` contains authentication, product, order, and upload endpoints.

Do not describe the deployed implementation as fully static until those dependencies are audited and deliberately normalized. Do not remove them blindly: product URLs, catalogue behavior, cart state, WhatsApp ordering, SEO metadata, and EN/BN parity must remain intact.

## Design and commerce rules

- Preserve the Vermilion Atelier visual system.
- Use only approved eMarket247 brand assets.
- Do not use external temporary storage URLs.
- Do not publish sample or inferred prices, availability, materials, ratings, reviews, discounts, or guarantees.
- WhatsApp remains the approved active conversion path until another checkout method is explicitly approved.
- Product structured data may include an `Offer` only when its price, currency, and availability are verified.

## Validation before deployment

From the repository root, run:

```bash
npm test
```

When a clean snapshot is required, run:

```bash
npm run build
```

Then manually verify:

1. `/`, `/en/`, and `/bn/`.
2. Shop and representative category pages in both languages.
3. At least two product URLs in both languages.
4. Add-to-bag, quantity changes, removal, cart, and WhatsApp message generation.
5. Mobile navigation and keyboard navigation.
6. Canonical, hreflang, Open Graph, and structured data.
7. Genuine 404 behavior for an unknown URL.
8. `robots.txt` and `sitemap.xml`.
9. HTTPS, redirects, cache headers, and asset loading.
10. Absence of secrets, SQL setup files, logs, and development artifacts in the upload.

Any failed check must be fixed or explicitly reported. Do not deploy merely because a build command completed.

## Manual File Manager deployment

1. Back up the current Hostinger `public_html` contents and database, if still used.
2. Confirm the exact approved `master` commit.
3. Run validation and focused browser checks.
4. Choose either the reviewed contents of `public_html/` or the verified `dist/public/` snapshot generated from that exact commit.
5. Upload the contents, not an extra parent directory.
6. Ensure `.htaccess` is included; enable display of hidden files in File Manager.
7. Do not upload repository-only documentation, source trees, logs, tests, secrets, or database setup exports.
8. Clear or revalidate hosting/CDN caches as appropriate.
9. Repeat the production smoke tests immediately.
10. Keep the previous deployment backup until the release is confirmed stable.

## Rollback

If production validation fails:

1. stop further uploads;
2. record the failing URL and behavior;
3. restore the previous Hostinger backup;
4. revert the responsible Git commit instead of rewriting history;
5. validate the correction before redeploying.

A release is complete only after production smoke tests pass and the rollback backup remains available.
