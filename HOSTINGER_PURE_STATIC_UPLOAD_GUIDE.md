# eMarket247 Pure Static Hostinger Upload Guide

## What this package contains

The final upload folder is **`/home/ubuntu/emarket247-shop/dist/hostinger-file-manager/`**. It is a self-contained pure static website: ordinary HTML files, a shared CSS file, one vanilla JavaScript file, JSON catalog records, and local image assets. There is no React, TypeScript, server-side rendering, database, payment secret, or external asset dependency in the package.

The current File Manager archive is **`/home/ubuntu/emarket247-shop/dist/eMarket247-hostinger-static.zip`**. It includes the direct-English entry page, full-width responsive image hero, square product catalog derivatives, and client-side category filtering and non-price sorting.

| Package location | Purpose |
|---|---|
| `index.html` | Direct English storefront entry point; Bengali remains one click away in the utility bar. |
| `en/` | English individual HTML page tree. |
| `bn/` | Bengali individual HTML page tree. |
| `assets/css/site.css` | White, black, and eMarket247-red design system. |
| `assets/js/site.js` | Vanilla-JavaScript menu, search panel, full-width image slider, unpriced catalog, category filters, non-price sorting, toast behavior, and reduced-motion-aware interactions. |
| `assets/images/brand/` | Supplied logo and favicon. |
| `assets/images/editorial/` | Optimized hero, bridal, and Puja editorial WebP images. |
| `assets/images/products-square/` | 96 responsive 600px/1200px WebP square derivatives of the 48 supplied product photographs, with transparent padding trimmed and every visible subject edge preserved. |
| `assets/data/catalog.en.json` and `catalog.bn.json` | Bilingual unpriced product records, captions, alt text, source references, and rights fields. |
| `robots.txt`, `sitemap.xml`, `.htaccess` | Crawl directives, static URL discovery, routing, compression, caching, and basic headers. |

## Hostinger File Manager upload

Upload the **contents** of `emarket247-hostinger-static/` into the domain’s `public_html` directory. Do not upload the enclosing folder itself if the domain should open directly at `https://emarket247.shop/`; upload the files and folders inside it. The root `index.html` should sit directly inside `public_html`.

After upload, open the following checks in a private browser window: `/`, `/en/`, `/bn/`, `/en/shop/`, `/bn/shop/`, `/en/categories/rings/`, `/bn/categories/rings/`, and `/en/occasions/puja/`. The `.htaccess` file is intended for Apache-based Hostinger plans. If the host does not apply `.htaccess`, the individual directory `index.html` pages still work directly.

## Search and language controls

Each English and Bengali page has its own URL, canonical link, meta description, reciprocal `hreflang="en"` and `hreflang="bn"` annotations, an English `x-default` entry, semantic heading hierarchy, accessible skip link, crawlable navigation, and XML sitemap entry. This implements Google’s recommended approach of distinct language URLs and explicit language alternates rather than automatic redirects.[1] [2]

The 300-row keyword matrix is deliberately qualitative because public research was selected. It provides bilingual candidate phrases, intent, priority, and target pages, but it does not fabricate Bangladesh search volume, CPC, or keyword difficulty. The 2026 Puja content treats September as the pre-Puja discovery period and identifies the main Durga Puja observance in October; it does not promise delivery dates.[3] [4]

## Product image and metadata status

All 48 supplied originals are preserved outside the Hostinger folder. The published catalog uses 96 non-destructive square WebP derivatives: a 600-pixel and 1200-pixel version for each source. The current product derivatives were separately background-cleaned and modestly enhanced for clarity and balanced lighting, then framed on an ivory square studio canvas after trimming only transparent padding. Every visible jewellery edge and original proportion is preserved. Every derivative carries an embedded eMarket247 copyright, creator, title, and description metadata record. Every catalog entry has a stable subject-based filename, bilingual title, bilingual alt text, bilingual caption, source reference, and **unpriced information-under-review status**.

Some images are visually ambiguous. Their initial labels are intentionally conservative, such as `Jewellery detail`, `Circular jewellery detail`, or `Necklace-style jewellery detail`. This protects customers from unverified material, purity, gemstone, size, certification, or product-type claims. Final product names, materials, prices, SKUs, stock, and availability must be reviewed before they replace these temporary records.

## Changes to make only when business facts are approved

| Business input | Where it must be updated |
|---|---|
| Product name, material, SKU, price, stock, size, and category | Both catalog JSON files and the product metadata/derivative workflow. |
| Customer-care phone number and delivery commitment | The utility bar, customer-support page, policy pages, and structured data only after the exact phone number and operating promise are confirmed. |
| Payment options, cash-on-delivery, mobile wallet, delivery, exchange, and return policy | Visible policy pages, checkout/service workflow, customer support copy, and structured data only after the operating policy is real. |
| Newsletter provider and marketing cookies | Consent notice, provider integration, privacy policy, and cookie-preference logic. |
| Customer accounts | A secure hosted account or commerce platform; no automatic sign-in prompt should be added. |
| Genuine product reviews | A real review collection and moderation process. Never seed or invent ratings or testimonials. |

## References

[1]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search Central: Tell Google about localized versions of your page"

[2]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites "Google Search Central: Managing multi-regional and multilingual sites"

[3]: https://www.timeanddate.com/holidays/bangladesh/durga-puja "Timeanddate: Durga Puja 2026 in Bangladesh"

[4]: https://www.drikpanchang.com/navratri/durga-puja/durga-puja-calendar.html?geoname-id=1185241 "Drik Panchang: 2026 Durga Puja Calendar for Dhaka"
