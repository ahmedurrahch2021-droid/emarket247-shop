# eMarket247 Engineering Playbook

How an experienced ecommerce developer would build and finish this store.

`AGENTS.md` is the rulebook: what you may and may not do. This playbook is the
judgement layer: what to work on, in what order, and how to know a thing is
genuinely done. Read both before touching the repository.

---

## 1. The order of value

Ecommerce work has a natural priority order. Work that sits lower on this list
is wasted if the work above it is broken.

1. **The money path works.** Browse → product → bag → cart → WhatsApp order,
   on a mid-range Android phone, in both languages. If this breaks, nothing
   else matters.
2. **The store is safe.** No credential leaks, no unauthenticated writes, no
   executable uploads, no data exposure. One breach ends a small store.
3. **Facts are true.** Price, stock, materials, delivery time, refund terms.
   A wrong price is a legal and reputational problem, not a typo.
4. **The store can be found.** Indexable, canonical, hreflang-correct,
   truthful structured data.
5. **The store is fast.** Especially on 4G in Bangladesh, where most visits
   come from mid-range phones on variable networks.
6. **The store looks finished.** Polish last. Polish on top of a broken
   checkout is decoration on a closed shop.

When a task conflicts with this order, the higher item wins. Say so in your
report instead of quietly doing the easier work.

---

## 2. Definition of done

A task is done when all of the following are true. "The code looks right" is
not on the list.

- The change does one thing, and the commit message says what that thing is.
- English and Bengali counterparts changed together.
- `npm test` passes, and you ran it *after* your final edit.
- You loaded the affected pages in a browser and used the feature, including
  one failure case (empty cart, missing image, network error, wrong password).
- Published URLs are unchanged, or a tested 301 exists.
- No commerce fact was invented.
- Your report states what you verified **and what you did not**.

The last point is the one that separates a professional from a tool that
declares victory. Unverified is not the same as working. Write the gap down.

---

## 3. Security baseline

This store runs PHP and MySQL on shared hosting. That platform has a small,
well-known set of ways to get owned. Hold this line permanently.

**Never trust the client.** Not the MIME type, not the filename, not a hidden
form field, not a price posted from the browser, not a role in localStorage.
Every one of those is attacker-editable. Server-side checks are the only
checks.

**Uploads.** Decide the file type by inspecting bytes (`finfo` plus
`getimagesize`), map the verified type to an extension from a fixed whitelist,
generate a random filename, and store it in a directory that refuses to execute
code. `public_html/api/upload.php` and `public_html/assets/images/.htaccess`
are the reference implementation. Do not loosen either.

**Authorization on every endpoint.** Every write path calls `checkAuth()` or
`checkAdmin()` as its first statement, before reading input. An endpoint that
checks permissions halfway down is an endpoint that leaks.

**Queries.** Prepared statements with bound parameters, always. Never
concatenate request data into SQL, including `ORDER BY` — whitelist sort
columns instead.

**Secrets.** No password, hash, token, or API key in the repository, ever, in
any file type, including SQL, documentation, and comments. Credentials come
from the environment or are entered on the server. A secret committed once is
a secret leaked permanently: rotate it, do not just delete it, because git
history keeps the old value.

**Nothing but the site in the web root.** No `.sql`, `.env`, `.log`, backups,
setup scripts, or documentation under `public_html/`. Anything there is a
public URL. Repository-only material lives in `database/` and is never
uploaded.

**Errors.** Users get a generic message; details go to the server log. Database
errors, file paths, and stack traces are reconnaissance.

**Money.** Price, discount, and total are recalculated on the server from
stored product data. A total that arrives from the browser is a suggestion.

---

## 4. Truthful commerce data

- No price is published until the owner confirms it. `is_price_pending`
  and "Price on Request" are correct, honest states — never paper over them
  with a fallback number.
- Structured data may contain an `Offer` only when price, currency, and
  availability are all real. Inventing `"availability": "InStock"` to satisfy
  a validator is fabricating a legal claim about a product.
- Delivery times, refund windows, and materials are business facts. If you
  cannot cite where a value came from, it does not ship.
- The database is authoritative for admin-managed commerce fields. Catalogue
  JSON and static pages are snapshots and must never contradict it.

---

## 5. Bilingual and Bangladesh specifics

- EN and BN are one product with two faces. Same IDs, same slugs, same
  categories, same images, reciprocal hreflang, matching page inventory.
- Translate meaning, not strings. A Bengali page with English button labels,
  English `alt` text, or Latin-digit prices reads as unfinished.
- Bengali typography needs real line-height and font fallbacks. Test with the
  longest realistic product title, not a short sample.
- Prices display in BDT with the ৳ symbol. Bengali pages use Bengali digits
  consistently — mixed digits look like a bug to local customers.
- WhatsApp is the live conversion path. Every order message must carry the
  product title, SKU, and page URL so the seller can answer without asking.
- When payments arrive, bKash and Nagad come before cards, and cash on
  delivery remains the default expectation for many customers. Design the
  checkout around that reality, not around a Western card flow.
- Courier reality (Pathao, Steadfast, Sundarban) shapes delivery promises.
  Do not publish a delivery window the courier does not offer.

---

## 6. Performance budgets

Targets apply on a mid-range Android phone over 4G, not on a laptop.

| Metric | Budget |
| --- | --- |
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.10 |
| Largest image | ≤ 200 KB |
| Page weight (product page) | ≤ 1 MB |

Rules that keep you inside the budget:

- Product and editorial images are WebP, sized to their largest display width,
  and compressed. A 3 MB PNG hero is an automatic failure.
- Every `<img>` carries `width`, `height`, and meaningful `alt`. Missing
  dimensions cause layout shift; missing `alt` breaks accessibility and SEO.
- Below-the-fold images use `loading="lazy"`; the LCP image never does.
- Fonts are preconnected and `display=swap`. No new font families.
- No image is stored twice under different paths.

Measure before and after. "Should be faster" is not a measurement.

---

## 7. How to verify

Pick the cheapest test that could actually catch the failure.

- **Automated:** `npm test` before every commit. It checks metadata, EN/BN
  parity, links, catalogue parity, JS and PHP syntax, forbidden files in the
  web root, upload hardening, and required security headers.
- **Browser:** the changed page in both languages, at 360 px and desktop,
  keyboard-only for anything interactive.
- **Data:** for catalogue changes, compare EN and BN records field by field
  rather than eyeballing one example.
- **Security:** for any endpoint change, try it logged out and as a
  non-admin user. If it succeeds, you found a bug.
- **Production:** after deployment, re-check HTTPS, a real 404, the sitemap,
  and one complete WhatsApp order.

---

## 8. Failure modes seen in this repository

These are real patterns from this project's history. Recognise them in your own
output.

- **Reporting work as complete that was not applied.** A commit said database
  setup files were excluded from deployment; they stayed in the web root for
  weeks because the exclusion only touched an unused build snapshot. Verify the
  actual deployed path, not the path you edited.
- **Polishing while critical issues wait.** Footers and meta tags were refined
  across dozens of commits while an unauthenticated-upload RCE and a published
  admin password sat untouched. Check the top of the priority list first.
- **Duplicate trees drifting.** `static-site/`, `src/`, and `client/` hold near
  copies of the live site. A fix applied to one leaves the others vulnerable.
  Fix every copy or delete the copy — never leave two truths.
- **Scripts instead of sources.** Dozens of one-off `fix-*.mjs` scripts mutate
  generated HTML. If a fix cannot be reproduced from an authoritative source,
  the next regeneration silently undoes it.
- **Passing checks that prove nothing.** A quality gate that skips PHP linting
  and reports success is a green light with no engine behind it. When a check
  cannot run, treat it as unknown, not as passed.

---

## 9. Remaining roadmap

In order. Do not skip ahead; each step assumes the ones above it.

1. **Rotate credentials.** Any admin account created from the old schema, plus
   database and hosting passwords. The old hash is in git history forever.
2. **Collapse duplicate trees.** Decide whether `static-site/`, `src/`, and
   `client/` are needed. Delete or archive them so `public_html/` is the single
   truth. Remove unused React and Express dependencies at the same time.
3. **Finish the static-versus-hybrid decision.** One authoritative product
   source. Either static pages generated from the database, or dynamic pages
   with static fallback — not both pretending to be canonical.
4. **Image and performance pass.** Re-encode every image to budget, remove
   duplicates, add dimensions, then measure the four page templates.
5. **Endpoint audit.** Authorization, validation, and rate limiting on
   `auth.php`, `products.php`, `orders.php`. Add login throttling.
6. **Accessibility and Bengali QA.** Keyboard paths, focus states, contrast,
   screen-reader labels in both languages.
7. **Commerce truth pass.** Confirm every price, material, delivery promise,
   and policy with the owner, then publish structured data that matches.
8. **Launch checklist.** Backup, credential rotation, deploy, then verify on
   production and watch real Core Web Vitals for a week.

---

## 10. Reporting format

Every task ends with this, honestly filled in:

```text
Task:
Commit:
Changed files:
Automated checks:      (command + result)
Manual checks:         (what you actually opened and did)
Not verified:          (say it plainly)
Known risks:
Rollback command:
Deployment performed:  No
```

An honest "not verified" costs a follow-up task. A false "complete" costs the
owner's trust in every report you have ever written.
