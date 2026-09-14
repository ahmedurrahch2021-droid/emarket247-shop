# eMarket247 — Work Handoff & Next-Task Instructions

> **Read `AGENTS.md` first** (project rules), then this file.
> This is the **ordered work plan**. Any AI tool continuing this work must follow it
> **strictly and in order**, and keep sections **0 (Workflow)** and **9 (Guardrails)**
> in force at all times.
>
> - **Canonical source of truth:** `public_html/` **ONLY**. Never edit `static-site/`, `client/`, `server/`, `shared/`, `src/`.
> - **Last verified:** 2026-09-14 against commit `4a680c0`.
> - **Status:** No storefront files have been edited yet — the state below is a verified diagnosis (census). Task 1 is the next thing to execute.

---

## 0. Workflow Discipline (non-negotiable — this is *how* we work)

Work like an engineer who ships an international-grade site: **simple, but never sloppy.**

1. **One canonical tree.** Edit only inside `public_html/`. Every page carries its **own inline header/footer** (there is no global include), so any chrome change **must be propagated to every affected page** — no orphan pages left on an old template.
2. **Bilingual parity, always.** Every change to an `/en/` page is mirrored on its `/bn/` sibling in the same commit. EN is the canonical taxonomy; BN is a transcreation, not a literal translation.
3. **Small, verifiable batches.** Change one page-type at a time (EN + BN together), verify, then move on. Never do a giant blind find-replace across the whole tree.
4. **Preserve URLs & SEO.** Do **not** rename product/category folders. Categorization is done via the page's data layer / content, not by moving files. Keep `rel=canonical` and reciprocal `hreflang` intact.
5. **Cache-bust discipline.** The site has exactly **one** `site.css`, **one** `site.js`, **one** `variables.css`. The `?v=` query strings are cache-busters only. When any of those files actually changes, bump its `?v=` to the **same new value on every page**. Never let versions drift per-page.
6. **Never break the conversion path.** The only checkout is **WhatsApp `+8801740501062`**. Do not touch the cart engine or WhatsApp CTAs without runtime testing (see Task 4).
7. **Prices:** bands only (e.g. `"৳ 800–3,500 (price band)"`) + `"final price on WhatsApp"`. **Never fabricate a specific price.**
8. **Design system is frozen:** Vermilion Atelier — DM Serif Display / DM Sans / Noto Bengali, accent `#ED1C24`, warm ivory/parchment. No React/Next/Vite/build tools. No new CI or sync scripts.
9. **Verify before you claim done.** After each batch, re-run the census in §10 and report the actual numbers.

---

## 1. Verified Current State (census — 121 `index.html` pages)

**Assets (single physical file each; only the `?v=` differs):**

| File | Canonical version | Notes |
|---|---|---|
| `/assets/css/variables.css` | `?v=9fcdc491` | design tokens (`:root` custom props) — must load **before** site.css |
| `/assets/css/site.css` | `?v=ca128acc` | main stylesheet |
| `/assets/css/pdp.css` | (product pages only) | product-detail styles — keep on product pages |
| `/assets/js/site.js` | `?v=446b10df` | global behavior: mobile menu toggle, submenus, search, cookie banner, language switch, **bag/WhatsApp-checkout system** |

**Header:** 114 of 121 pages already share the canonical header (57 EN `md5=a307117e`, 57 BN `md5=ba148194`). Outliers:

| Page | Header | Decision |
|---|---|---|
| `en/cart`, `bn/cart` | old `nav-wrap` (simpler, no search/mega-menu) | **Task 4** — swap to canonical (checkout-critical, test first) |
| `en/admin`, `bn/admin`, top-level `admin` | admin backend header / none | **LEAVE ALONE** (backend) |
| top-level `account` | none — page title is *"Cookie check"* | **LEAVE ALONE** (diagnostic stub, not a real page) |

**Footer:** clean **page-type split** (not random drift):

| Footer | md5 (EN) | Pages | Meaning |
|---|---|---|---|
| **Newsletter footer** | `e1841930` | 27 — **homepage**, shop, all categories, all occasions, about, care, contact, guides, privacy, terms, studio-pilot | **CANONICAL** (it's on the homepage & every nav destination) |
| Product footer | `592074ab` | 27 — all product-detail pages | older variant, product pages only |
| WS-C4 footer | `197d72cd` | `delivery`, `refund` | one-off; shows **© 2025** (wrong year) |
| cart footer | `e1377146` | `cart` | one-off |
| stub | `e40ae601` | `account` | ignore |

(BN mirrors EN with its own md5s — confirm the BN canonical footer by checking `bn/index.html` before propagating.)

**The 6 functional outlier pages** (BARE `<body>`, missing `site.js`):
`en/cart`, `bn/cart`, `en/delivery`, `bn/delivery`, `en/refund`, `bn/refund`.
- cart: css OK, has its **own inline cart engine**; header is old `nav-wrap`.
- delivery/refund: css is an **absolute URL `?v=1.0`**, **missing `variables.css`** (they carry a private inline `<style>` copy of the tokens instead), footer shows © 2025.

**24 BN product pages** load `site.css?v=9a44f9e6` (should be `ca128acc`) — cosmetic cache-string only.

---

## 2. Canonical Chrome Contract (the target every storefront page must match)

Copy these **verbatim**. For the header/footer blocks, copy from a known-good exemplar rather than retyping.

```html
<!-- BODY (EN) -->
<body data-language="en" data-cookie-mode="essential-only">
<!-- BODY (BN) -->
<body data-language="bn" data-cookie-mode="essential-only">
```

```html
<!-- FONTS (canonical) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet">

<!-- STYLES (order matters: variables BEFORE site) -->
<link rel="stylesheet" href="/assets/css/variables.css?v=9fcdc491">
<link rel="stylesheet" href="/assets/css/site.css?v=ca128acc">
<!-- product pages additionally: <link rel="stylesheet" href="/assets/css/pdp.css?v=..."> -->
```

```html
<!-- Just before </body> on EVERY storefront page -->
<div class="toast" role="status" aria-live="polite"></div>
<script src="/assets/js/site.js?v=446b10df" defer></script>
</body>
```

- **Header:** copy verbatim from `public_html/en/terms/index.html` (EN) or `public_html/bn/terms/index.html` (BN). Must `md5` to `a307117e` (EN) / `ba148194` (BN).
- **Footer (canonical):** copy verbatim from `public_html/en/index.html` (EN homepage) or `public_html/bn/index.html` (BN homepage). EN must `md5` to `e1841930`.

---

## 3. TASK 1 — Chrome/CSS Propagation Sweep  ⟵ **DO THIS FIRST**

Goal: make the 6 outlier pages functional and normalize the product cache-string. **Safe & mechanical** — no design decisions. Do it in three batches, verify after each.

### Batch 1a — `delivery` + `refund` (EN + BN = 4 files)
Files: `en/delivery`, `bn/delivery`, `en/refund`, `bn/refund` (`.../index.html`).
For each file:
1. `<body>` → `<body data-language="en" ...>` / `data-language="bn"` (per tree) `data-cookie-mode="essential-only"`.
2. Add the **`variables.css`** link **before** the site.css link (see §2).
3. Replace `https://emarket247.shop/assets/css/site.css?v=1.0` → `/assets/css/site.css?v=ca128acc` (root-relative).
4. Normalize the fonts `<link>` to the canonical one in §2.
5. Insert the toast div + `site.js` script before `</body>` (see §2). **Required** — the canonical header's mobile menu/search/cookie banner need it.
6. Fix the footer year **© 2025 → © 2026** (superseded later if Task 2 replaces this footer).
7. **Keep** the page's existing inline `<style>` block for now (harmless token duplicate; a later cleanup can remove it once verified equal to variables.css). **Keep** the header (already canonical — verified identical).

### Batch 1b — `cart` (EN + BN = 2 files) — **SAFE SUBSET ONLY**
Files: `en/cart`, `bn/cart`.
1. `<body>` → add `data-language` (en/bn) + `data-cookie-mode="essential-only"`. **This is the only change** — it fixes Bengali font selection.
2. **DO NOT** add `site.js` and **DO NOT** swap the header here. Reason: `site.js` has its own bag/checkout system and the cart page has a **separate inline cart engine** — combining them blind can double-render or corrupt the bag. That integration is **Task 4** (test-required).

### Batch 1c — 24 BN product pages — cache-string hygiene
Files: `bn/products/emarket247-*` (the 24 listed with `?v=9a44f9e6`).
1. `site.css?v=9a44f9e6` → `site.css?v=ca128acc`. Nothing else.

**Verify Task 1:** re-run §10 census. Expected after 1a+1b: delivery/refund fully canonical (body/css/js/variables all `ok`); cart bodies no longer `BARE`; products all `ca128acc`. Report the numbers.

---

## 4. TASK 2 — Footer Unification (one footer, site-wide)

**Evidence:** the canonical **newsletter footer** (`e1841930`) is on the homepage and every nav destination; product pages use an older variant (`592074ab`); delivery/refund/cart each have one-offs. An international-grade site has **one** footer everywhere.

**Owner decision needed** (business/design — flag to Rozina / site owner):
- **Option A (recommended):** adopt the **newsletter footer** as the single site-wide footer → propagate to all 27 product pages + delivery + refund + cart (EN + BN). Result: 1 footer per language.
- **Option B:** keep a leaner footer on product pages intentionally (document the rule so it stops looking like drift).

**If Option A:** copy the canonical footer verbatim from the homepage (EN from `en/index.html`, BN from `bn/index.html`), replace the `<footer>…</footer>` block on each non-canonical page, keep links correct per language, verify md5 uniformity via §10.

---

## 5. TASK 3 — Product → Category Mapping (fill the 5 empty categories)

Empty categories: **bridal, gift, rings, sets, pendants** (`public_html/en/categories/…` + BN).
27 products exist; 8 are in the generic **`jewellery-detail-NN`** bucket (`01,06,07,10,11,12,13,31`).

Steps:
1. **Find how category grids are populated** — inspect the catalog data layer (`data-catalog` / `data-category` attributes and the JS/JSON in `site.js` that renders category grids). Understand the mechanism before assigning.
2. For each of the 8 `jewellery-detail-NN` products, read its content/image and determine its true category.
3. Assign categories **via the data layer / page content — NOT by renaming folders** (preserve URLs/SEO).
4. Fill the 5 empty categories where confident; **flag genuine gaps** to the owner (e.g. if no product truly fits "rings", say so rather than mis-filing).
5. Renaming product folders for human-readable slugs, if ever wanted, is a **separate manual task** with 301 redirects — do not do it silently.

---

## 6. TASK 4 — Cart Header + JS Unification (checkout-critical, test-required)

Bring `en/cart` + `bn/cart` to the canonical header **and** wire `site.js` **without breaking the cart**.
1. Read the cart's **inline engine** and identify its `localStorage` key(s) and render targets.
2. Read `site.js`'s **bag system** (search `bag-checkout-wa`, order recording ~lines 350 / 842–859) and its `localStorage` key(s).
3. Confirm they share a key/contract or can coexist. Resolve any conflict (ideally the cart page reuses `site.js`'s bag rather than a parallel engine).
4. Swap `nav-wrap` header → canonical header; add `site.js`.
5. **Runtime-test the full flow:** add to bag on a PDP → open `/cart/` → quantities/totals correct → WhatsApp checkout link correct. Test EN and BN. Only then commit.

---

## 7. TASK 5 — Salvage from old branch `claude/upbeat-hermann-1d51a2`

Two net-new pieces master lacks:
1. **Bilingual glossary pages** (`guides/glossary`) with **`DefinedTermSet`** schema — lift them, **rebuild their chrome to the current canonical contract** (§2) before committing.
2. **Durga Puja 2026** version of the Puja page — compare against the existing `occasions/puja/`; adopt only the parts that are clearly better/timelier. Keep one canonical puja page, not two.

---

## 8. TASK 6 — Content-Quality Review of Occasion Pages

Pages built by other tools, not yet quality-reviewed: `occasions/{eid, wedding, anniversary, birthday, gifts, bridal}` (EN + BN). Review for: correct facts (delivery/refund per AGENTS.md), price bands (no fabricated prices), WhatsApp CTA present, bilingual parity, on-brand copy. Fix or flag.

---

## 9. Guardrails (security + must-not-touch)

- 🔴 **URGENT — rotate DB credentials NOW.** `public_html/api/config.php` contains a hardcoded DB password and **the GitHub repo is PUBLIC**, so it is already exposed. Rotate the password in Hostinger, and keep the real secret only in Hostinger env/config — not in the committed file. **Do not read, print, echo, or commit that password.** Do not otherwise edit `config.php`.
- Change the default admin login (`admin247`) before launch.
- Keep `public_html/api/upload.php` hardening and the `api/` `.htaccess` deny rules.
- Do **not** edit `static-site/`, `client/`, `server/`, `shared/`, `src/`.
- Do **not** add databases/backend, React/Next/Vite/build tools, or new CI/sync scripts.
- Do **not** fabricate prices. Do **not** change the design system.
- Leave `admin` and `account` (Cookie-check) pages alone.

---

## 10. Definition of Done + Verification Commands

**Sweep is "done" when** the census shows: 0 `BARE` bodies on storefront pages, 0 `NO-JS` storefront pages, 0 absolute/`v=1.0` css links, a single css version site-wide, 1 header variant per language, and (after Task 2) 1 footer variant per language. `admin`/`account` are the only allowed exceptions.

Run from repo root (read-only; safe):

```bash
# Chrome/CSS drift census — flags any page that deviates
find public_html -name index.html | sort | while read -r f; do
  rel="${f#public_html/}"
  bare="ok"; grep -oE '<body[^>]*>' "$f" | head -1 | grep -q 'data-language' || bare="BARE"
  js="ok";   grep -q 'assets/js/site.js' "$f" || js="NO-JS"
  v1="ok";   grep -qE 'site\.css\?v=1\.0|emarket247\.shop/assets/css' "$f" && v1="ABS-v1"
  nv="ok";   grep -q 'assets/css/variables.css' "$f" || nv="NO-VAR"
  ver=$(grep -oE 'site\.css\?v=[a-z0-9.]+' "$f" | head -1 | sed 's|site.css?v=||')
  [ "$bare" != ok ] || [ "$js" != ok ] || [ "$v1" != ok ] || [ "$nv" != ok ] || [ "$ver" != ca128acc ] \
    && printf '%-40s bare=%s js=%s css=%s var=%s ver=%s\n' "$rel" "$bare" "$js" "$v1" "$nv" "$ver"
done

# Header/footer variant distribution (should collapse to 1 per language for storefront)
find public_html -name index.html | while read -r f; do
  perl -0777 -ne 'print $1 if /(<header\b.*?<\/header>)/s' "$f" | md5sum | cut -c1-8
done | sort | uniq -c
find public_html -name index.html | while read -r f; do
  perl -0777 -ne 'print $1 if /(<footer\b.*?<\/footer>)/s' "$f" | md5sum | cut -c1-8
done | sort | uniq -c
```

> Note: files have embedded newlines in the header/footer region — use the `perl -0777 … /s` slurp form above for multiline extraction, **not** single-line `grep`.

---

*Task order: 1 → 2 → 3 → 4 → 5 → 6. Tasks 1 and 3 are safe to proceed on now; Tasks 2 and 4 need an owner decision / runtime testing first; keep §0 and §9 in force throughout.*
