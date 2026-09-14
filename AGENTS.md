# eMarket247 Development Rules

## Project
- **Site:** emarket247.shop — bilingual (EN/BN) jewellery storefront
- **Founder:** Rozina Akter, Kalukhetra, Yakubpur, Thakurgaon, Bangladesh 5100
- **Family-owned brand.** Single conversion path: WhatsApp +8801740501062

## Canonical Source — DO NOT TOUCH OTHER COPIES
- **`public_html/`** is the one and only source of truth.
- Everything in `public_html/` is deployed directly to Hostinger File Manager.
- Zip `public_html/` contents → Hostinger File Manager → extract → live.
- `static-site/`, `client/`, `server/`, `shared/`, `src/` — these are legacy/dead. Do not edit them.

## Design System — DO NOT CHANGE
- Brand: **Vermilion Atelier**
- Fonts: DM Serif Display / DM Sans / Noto Bengali
- Accent: `#ED1C24` (vermilion)
- Warm ivory/parchment surfaces
- No databases. No backend. Pure static HTML + vanilla JS.
- Global header/footer not implemented — each page has its own inline header/footer.

## Prices — DEVELOPMENT STAGE
- **No real prices visible on any page.**
- Show: `"৳ 800–3,500 (price band)"` or similar — never fabricate specific prices.
- Always add: `"final price on WhatsApp"`
- Never write a specific price like `৳ 8,500` on any page unless you have confirmed it with the business.

## Payments (Phase 2 — Not Yet)
- Coming: Bkash, Nagad, bank card
- For now: WhatsApp order only (no online payment UI)

## Delivery
- **Pathao Courier** — nationwide 64 districts, 24–72 hr, BDT 60–180
- COD fee: 0.5–1% of order value
- **Refund window: 15 days** (Pathao base 3 days + eMarket247's own promise)

## What NOT to Do
- ❌ Do not add database code or backend logic
- ❌ Do not change the design system (fonts, colors, layout patterns)
- ❌ Do not suggest React, Next.js, Vite, or any build toolchain
- ❌ Do not create or edit files in `static-site/`, `client/`, `server/`, `shared/`, `src/`
- ❌ Do not touch `public_html/api/config.php` (DB credentials — rotate before launch)
- ❌ Do not fabricate product prices
- ❌ Do not create new AI tooling, CI pipelines, or sync scripts unless explicitly asked

## Workflow
1. Edit files in `public_html/` directly
2. Test locally (open `index.html` or serve the folder)
3. Commit to GitHub
4. Zip `public_html/` contents → Hostinger File Manager → extract

## Hosting
- **Hostinger shared hosting** — pure static HTML only
- PHP is deferred/not used for the storefront
- Upload via Hostinger File Manager (no FTP, no Git pull on server)

## Security Notes
- `public_html/api/config.php` contains hardcoded DB credentials — rotate before launch
- `public_html/api/upload.php` is hardened (MIME check + webp re-encode) — keep it that way
- `.htaccess` deny rules exist for `api/` and sensitive paths — keep them
