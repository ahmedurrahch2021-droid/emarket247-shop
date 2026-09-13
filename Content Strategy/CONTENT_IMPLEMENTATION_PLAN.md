# eMarket247 — Content Implementation Plan (for approval)

**Owner:** eMarket247 (business is final approver on facts/prices; Claude is last approver on content quality)
**Date:** 10 Sep 2026 · **Status:** Draft awaiting your sign-off before any edits
**Scope:** Content first (this document). Design improvements start only after content is approved and shipped.

---

## 0. Locked decisions (from your answers)

| Decision | Your call | Consequence for this plan |
|---|---|---|
| Price display | **Honest price bands** | Category + PDP pages show ranges + "final price confirmed on WhatsApp." Enables `Offer`/`AggregateOffer` schema. Numbers are DRAFT until you confirm each. |
| Pan-Bangladesh delivery | **Real — keep** | Backed by a full Delivery page (Phase 1). Utility-bar claim becomes truthful. |
| 15-day refund | **Real — keep** | Backed by a full Refund & Exchange page (Phase 1). Legally required in BD anyway. |
| Free gift with every order | **Keep as-is, confirm later** | Not rewritten or removed. A threshold promo ("spend X → gift") is coming; treated as amber/pending. |
| Delivery/refund facts | **You'll provide** | I need courier name(s), timeframes, charges by area, refund window & conditions to finalize those two pages. |
| Top utility-bar layout | **Deferred (design)** | Captured in §10 design backlog. Not touched now. |

---

## 1. Guiding principles (the spine)

Adopted from `content_planning.docx` v3.0 (strong) + `Cross Cehck.docx` (correct). The 36-topic `City Gold` xlsx is **mined for guide topics only** — its invented product/service lines (re-electroplating service, anti-tarnish boxes, B2B wholesale, international shipping), aggressive micron claims, and `/collections/` URLs are **rejected** as off-architecture and off-brand.

1. **Radical honesty is the product.** No claim we can't stand behind. Every unverifiable spec becomes a *verifiable promise* instead (e.g. not "100% nickel-free" but "we buy nickel-free plated stock and can show the supplier declaration; if your skin reacts within 7 days, return it for a refund").
2. **Keyworded H1 + poetic deck.** Every H1 carries the head term; the editorial line moves to a `deck` immediately below. Voice is preserved, ranking signal is gained. (Fixes 17 pages currently competing for nothing — e.g. category H1 that is just "Rings".)
3. **AEO answer-first blocks.** Each key page opens with a ~40–55 word BLUF direct-answer paragraph an AI engine can quote, followed by the editorial content. FAQ blocks use real questions with `FAQPage` schema.
4. **Bilingual by transcreation, not translation.** Bengali is written *first* for homepage, care, and guides, then English matched — not literal rendering. Removes the drift Cross Check flagged ("দেখান যে মনে করেছেন", English words left inside Bengali sentences).
5. **Green/amber honesty tiering.** Green = publish now (verified/verifiable). Amber = gated until the business confirms (specific micron counts, courier open-box, promo terms, exact prices). Nothing amber ships unconfirmed.
6. **One page, one job, one CTA.** Every page asks for exactly one next action. Today the only conversion path is WhatsApp `+880 1740-501062`; price bands + shortlist requests route there.
7. **Thin-content discipline.** Ship pages we can fill; `noindex` the rest until they have real content and photos. Twenty complete pages outrank 116 empty ones.

---

## 2. Information architecture — resolve the cannibalization

Current drift: **bridal** and **gift** each exist as *both* a category and an occasion; Google will pick one, probably the wrong one. Fix by role:

- **Categories = product-form pages** (what the thing *is*). Transactional intent. `/en/categories/{rings, earrings, necklaces, bracelets, bangles, pendants, jewellery-sets, bridal-jewellery, gift-jewellery}/`.
- **Occasions = editorial/styling pages** (when/how to wear, what to gift). Commercial-investigation intent. `/en/occasions/{puja, eid, wedding, anniversary, birthday, gifts, bridal}/`.
- **Guides = informational pages** (`/en/guides/` hub + `/en/guides/<slug>/` articles). Trust-transfer intent.

**Canonical rules to stop cannibalization:**
- `bridal-jewellery` (category) = the product-form page and the SEO target for "bridal jewellery bangladesh". `occasions/bridal` and `occasions/wedding` = styling/editorial, cross-linking *into* the category, not competing for the head term.
- `gift-jewellery` (category) vs `occasions/gifts` — same treatment: category owns the transactional term, occasion owns "gift ideas for …" styling queries.
- Decide the **guide article route is `/guides/<slug>/`** (plural, matching the existing hub). The Explore map confirms no singular `/guide/` dir exists — so we standardize on `/guides/<slug>/` and never reference `/guide/…`.

---

## 2b. Honest ranking expectation (read this before anything else)

**No content plan can guarantee rankings.** Content quality is roughly **40%** of the outcome; the remainder is topical authority, brand/link signals, catalog depth, technical health, and time. Realistic expectations for a new domain in this niche:

| Target | Realistic timeline | Confidence |
|---|---|---|
| Long-tail informational (care troubleshooting, glossary terms, sizing) | 2–4 months | High — low competition |
| Bengali-script queries | 3–5 months | High — far less contested than English |
| Banglish / transliterated queries | 3–5 months | Medium — under-served, volume unverified |
| Occasion/styling commercial-investigation | 5–8 months | Medium |
| Category head terms ("gold tone jewellery bangladesh") | 9–15 months | Low without links/brand signals |
| AI-engine citation (ChatGPT/Perplexity/AI Overviews) | 2–5 months | **Medium-high — our best near-term win** (see §6b) |

**Known constraints working against us:** 27 products is a small catalog (category pages will look thin next to Daraz); the domain is new; there is no link profile yet. **Working for us:** almost nobody in BD publishes honest price/delivery data, Bengali SERPs are soft, and the honesty positioning produces genuinely citable content.

**No keyword volume, CPC, or difficulty figure in this plan is verified** — keyword research tools were unavailable during planning. Every term below is a **hypothesis to validate against Search Console data** after ~4–6 weeks of live impressions. Do not treat any of it as measured.

---

## 3. Keyword strategy — long-tail first

**Strategic correction:** the earlier draft aimed at category head terms first. That is the hardest tier and the slowest to move for a new site. **Reversed priority: win specific queries first, accumulate topical authority, then rise to head terms.** Head terms stay as page targets (a page must still be optimised for its term) but they are *aspirations*, not launch KPIs.

### 3.1 Three language registers — target all three

Bangladeshi search is trilingual and the plan previously covered only two. All three must be targeted, primarily through natural inclusion in body copy, FAQs, and guide headings — never keyword stuffing.

| Register | Example queries | Competition | Priority |
|---|---|---|---|
| **English** | gold plated jewellery bangladesh, imitation jewellery online bd | High | Medium |
| **Bengali script** | ইমিটেশন গহনা দাম, সোনালি গহনার যত্ন, পূজার গহনা | **Low** | **High** |
| **Banglish (Roman Bengali)** | imitation gohona dam, sonali gohona, churi dam, kaner dul design, nakli sona, gohona design | **Low / under-served** | **High** |

Banglish was entirely absent from the earlier draft. It is a substantial share of real BD queries and almost nobody optimises for it deliberately.

### 3.2 Local vocabulary — the term set to own

**Correction to my earlier verdict:** I dismissed the `City Gold` xlsx too broadly. Its *scope creep* was wrong (Dokra/terracotta lines, re-electroplating service, anti-tarnish products, B2B wholesale, international shipping) — but **"city gold" as a keyword anchor is a legitimate local term** and removing it was my error. It returns as a priority term to validate.

Terms to use naturally across guides, glossary, category copy and FAQs:
`city gold` · `imitation jewellery` · `gold plated` · `gold filled` · `rolled gold` · `one gram gold` · `American diamond (AD)` · `kundan` · `polki` · `meenakari` · `jhumka` · `nolok` · `tikli` · `shitahar` · `chik` · `bala` · `churi` · `kaner dul` · `golar har` · `locket` · `deshi/Dubai necklace`

### 3.3 Bengali as a primary ranking channel

Bengali is **not** a translation duty — it is the **fastest realistic route to first-page rankings**, because Bengali-script SERPs for these queries are materially less contested than English. Consequences for the plan:

- Bengali pages get **their own keyword targets**, not translated English targets.
- Bengali gets **guide topics with no English twin** where the query only exists in Bengali (e.g. যত্ন/troubleshooting phrasings, festival-specific searches).
- Bengali content is **written first** for homepage, care, glossary and all troubleshooting guides — translated Bengali will not rank and native readers detect it instantly.
- URL architecture is unchanged (English canonical taxonomy, `/bn/` mirror) — this is a *content targeting* change, not a routing change.

### 3.4 Keyword → page → intent → content → CTA map

Focus keyword per docx: homepage = *gold tone jewellery bangladesh*; shop = *buy imitation jewellery online bd*. Both are **long-horizon** targets per §2b.

| Page | Primary query (EN / BN) | Intent | Page must contain | The one CTA |
|---|---|---|---|---|
| Home | gold tone jewellery bangladesh / গোল্ড টোন গহনা | brand+category discovery | answer-block, how-ordering-works, 9 category tiles, care teaser, why-us, FAQ | Browse the collection |
| Shop | buy imitation jewellery online bd / ইমিটেশন গহনা অনলাইন | transactional | live grid, price bands per card, filter/sort, empty-state honesty | Ask for a shortlist (WhatsApp) |
| Category (e.g. rings) | gold tone rings bangladesh / সোনালি আংটি দাম | transactional | keyworded H1+deck, band, form-specific buying help, FAQ | See pieces / WhatsApp |
| Occasion (e.g. puja) | puja jewellery / পূজার গহনা | commercial investigation | styling answer-block, curated links into categories, festival-specific care | Explore Puja picks |
| Care | will gold-tone colour last / রং কতদিন থাকবে | informational (trust) | "Will the colour last?" + four care rules + wudu note | Read the plating guide |
| Guide: real vs plated | how to tell real gold from plated / আসল সোনা চেনার উপায় | informational (high trust-transfer) | test methods, honest limits, what we disclose | Talk to us |
| Refund/Exchange | return policy / রিটার্ন পলিসি | transactional support | 15-day window, conditions, how-to, exclusions | Start a return (WhatsApp) |
| Delivery | delivery charge bangladesh / ডেলিভারি চার্জ | transactional support | courier, timeframe, charge by area, COD status (amber) | Track/ask (WhatsApp) |

Full per-page keyword sets will be attached during implementation; this is the load-bearing subset.

---

## 4. Page-by-page content spec

> Workflow: this plan defines **structure + voice + exemplar copy**. On approval, I draft **full bilingual copy per page** and surface it for your line-level sign-off before it publishes. Homepage copy below is near-final to lock the voice.

### 4.1 Homepage — `/{en,bn}/index.html`

Replace the generic H1 ("Your personal jewellery destination.") and reorder sections. Target section sequence:

1. **Hero** (keep the 3-slide carousel structure).
   - **H1 (EN):** "Gold-tone jewellery in Bangladesh, described honestly."
   - **Deck:** "Everyday pieces and occasion sets — photographed as they really are, priced from ৳300 in clear ranges, delivered nationwide with a 15-day return."
   - **H1 (BN, transcreated):** "বাংলাদেশে সোনালি রঙের গহনা — সৎভাবে বর্ণনা করা।" (final BN written first at implementation)
   - CTA: **Browse the collection** → `/en/shop/`.
   - **Price signal is deliberate:** for a site whose differentiator is published pricing, a concrete "from ৳300" is the most quotable, extractable and differentiating fact we own (§6b). Exact figure follows your confirmed bands.
2. **Answer block (AEO, ~45 words).** "eMarket247 sells gold-tone (imitation) jewellery in Bangladesh — rings, earrings, necklaces, bangles and sets. We show honest studio photos, share price ranges upfront, confirm the final price on WhatsApp, and deliver across the country with a 15-day return." (once refund/delivery facts confirmed).
3. **How ordering works — 3 steps** (NEW; replaces nothing, fills a gap). Message us → we confirm price & availability → delivery with 15-day return. Reduces friction; matches the WhatsApp-only reality.
4. **9 category tiles** (expand from current 4). Rings, Earrings, Necklaces, Bracelets, Bangles, Pendants, Jewellery Sets, Bridal, Gift. (Also fixes the "Rings is noindex/absent from sitemap" self-defeat once §10 tech items run.)
5. **"Will the colour last?" care teaser** (NEW on home; the single best trust block per Cross Check). 2–3 sentences + link to Care.
6. **Solid gold vs gold-tone** — short honest explainer (NEW). Positions the product category truthfully; feeds the materials guide.
7. **Bridal & occasion panel** (keep; relink into `bridal-jewellery` category to avoid cannibalization).
8. **Puja 2026 panel** (keep; timely — Puja is mid-Oct, we're in the pre-Puja peak now).
9. **Why eMarket247** — 3 items (keep, tighten): Photographic integrity / Informed choice / Bilingual service. Drop clichéd "we'd rather be trusted than cheapest."
10. **FAQ block** (NEW; `FAQPage` schema): "Is this real gold?", "Will the colour fade?", "How do I know the price?", "Do you deliver to my district?", "Can I return it?"
11. **Founder note** (amber — Phase 3, once you supply it).
12. **Newsletter + footer** (keep).

Kill/deprioritize: none removed outright; "How to choose" 4-tile block folds into guides links.

### 4.2 Shop — `/{en,bn}/shop/index.html`

- **H1:** "Buy gold-tone jewellery online in Bangladesh" · **Deck:** current "A considered collection is taking shape" demoted or retired once products show.
- **Each card shows a price band** (e.g. "৳ 900–3,500") once bands confirmed — this is the core change the pricing decision unlocks.
- Fix the JSON-LD `ItemList` (currently hardcodes 27 products while the visible grid is empty/JS-driven) to reflect actual rendered items.
- Honest empty-state retained only where a category genuinely has no photographed stock.
- CTA: **Ask for a shortlist** (WhatsApp) + per-card enquiry.

### 4.3 Category pages ×9 — `/{en,bn}/categories/<cat>/`

Uniform pattern (keyworded H1 + deck + answer block + band + form-specific buying help + FAQ + JSON-LD `CollectionPage`+`BreadcrumbList`+`ItemList`). H1 + DRAFT band (⚠ replace with real supplier pricing before publish):

| Category | H1 (EN) | Deck (poetic line, demoted) | DRAFT band ⚠ |
|---|---|---|---|
| Rings | Gold-Tone Rings in Bangladesh | "Worn on the hand you talk with." | ৳300–1,500 |
| Earrings | Gold-Tone Earrings in Bangladesh | "The first thing seen up close." | ৳350–2,500 |
| Necklaces | Gold-Tone Necklaces in Bangladesh | "The line that frames a face." | ৳900–6,000 |
| Bracelets | Gold-Tone Bracelets in Bangladesh | "A quiet weight on the wrist." | ৳500–2,500 |
| Bangles | Gold-Tone Bangles in Bangladesh | "Sound before sight." | ৳800–3,500 |
| Pendants | Gold-Tone Pendants in Bangladesh | "One detail, close to the heart." | ৳400–1,800 |
| Jewellery Sets | Gold-Tone Jewellery Sets in Bangladesh | "Chosen together, worn together." | ৳1,500–7,000 |
| Bridal Jewellery | Bridal Gold-Tone Jewellery in Bangladesh | "For the day the details matter most." | ৳3,500–15,000 |
| Gift Jewellery | Gold-Tone Gift Jewellery in Bangladesh | "Something to hand over." | ৳500–3,000 |

### 4.4 Occasion pages ×7 — `/{en,bn}/occasions/<occ>/`

Editorial/styling role (not product-form). Keyworded H1 + deck + styling answer block + curated links *into* categories + occasion-specific care. Puja keeps its strong current H1 direction; give **each occasion genuine specificity** (Cross Check: Puja deserves depth, not generic parallel copy — e.g. Puja morning vs evening looks; Eid day-to-night; wedding gaye-holud vs reception).

### 4.5 Care — `/{en,bn}/care/`

Replace the 01/02/03 "in preparation" stub with the real content:
- **H1:** "Caring for gold-tone jewellery: will the colour last?" · Deck keeps "A clear answer begins with the right question."
- **"Will the colour last?"** honest section (what plating is, what fades it, realistic lifespan).
- **Four care rules** (concrete): remove before wudu/shower/swim; keep dry & sealed; avoid perfume/lotion contact; store separately. Keep the **wudu reference** — it signals a real local seller.
- FAQ + link to the materials & real-vs-plated guides.

### 4.6 About — `/{en,bn}/about/`

- **H1:** "About eMarket247 — honest gold-tone jewellery." Deck keeps "built with care."
- **"Four things we'll never tell you"** distinctive block (keep the concept; drop the cliché line).
- Founder note (amber, Phase 3).
- Seller-identity disclosure (name/contact) — **required by BD Digital Commerce Guidelines 2021.**

### 4.7 Contact — `/{en,bn}/contact/`

Already the strongest page (WhatsApp block fleshed out). Keep; add the payment-safety note prominence and link to Delivery/Refund once live. Retire the 01/02/03 stub.

### 4.8 Guides — hub `/{en,bn}/guides/` + articles `/{en,bn}/guides/<slug>/`

Hub currently shows 4 placeholder cards linking to `/care/` — repoint to real articles. **Reconciled guide backlog** (mined from Cross Check + City Gold xlsx, scope-creep removed):

**Phase 2 — 4 priority guides (highest intent/trust):**
1. `real-vs-plated` — How to tell real gold from gold-plated / gold-tone (honest test methods + limits).
2. `will-the-colour-last` — Caring for gold-tone jewellery so it lasts (feeds Care page).
3. `gold-types-explained` — City gold vs gold-plated vs gold-filled vs rolled gold vs stainless steel.
4. `puja-style-guide` — Choosing jewellery for Puja & festive season (timely now).

**Phase 3 — monthly:**
5. `zakat-imitation-jewellery` — Does imitation jewellery count for zakat?
6. `jewellery-for-men` — Chains, rings, bracelets for men.
7. `sizing-guide` — Ring & bangle sizing with real inch/cm measurements.
8. `earrings-by-face-shape` — Choosing earrings for your face shape.
9. `bridal-jewellery-guide` — Building a bridal set.
10. `everyday-vs-occasion` — Everyday vs occasion pieces.
11. `buy-safely-online-bd` — Spotting counterfeits & buying safely (Daraz/Facebook context).
12. `gifting-guide` — Gifting jewellery in Bangladesh.

**Rejected from xlsx:** Dokra/terracotta/clay/resham artisanal lines, re-electroplating *service*, anti-tarnish *product*, B2B wholesale, UK/USA/UAE diaspora shipping — unless you confirm you actually offer them.

### 4.9 Refund & Exchange — NEW page `/{en,bn}/refund-exchange/` (Phase 1)

Legally required (BD 2021). Content pending your facts: **15-day window** (confirmed), what qualifies, how to initiate (WhatsApp), refund vs exchange, who pays return shipping, exclusions (custom-sized/made-to-order), timeline to refund. Link from footer + utility bar + PDPs.

### 4.10 Delivery — NEW page `/{en,bn}/delivery/` (Phase 1)

Content pending your facts: courier name(s), delivery timeframe, **charge by area/district**, COD availability (amber until courier-confirmed), open-box policy (amber — name courier + conditions or omit), Pan-Bangladesh coverage statement.

### 4.11 Privacy / Terms — review existing

Both exist. Audit for BD-compliance (seller identity, contact, dispute path) and link consistency. Low effort.

### 4.12 Product detail pages (PDPs)

Two systems exist (27 static HTML PDPs + dynamic `product.php`). **Content actions this pass:**
- **Strip the fabricated "৳ 8,500 (Est.)"** from the 27 static PDPs; replace with the confirmed **category band** + "final price on WhatsApp."
- Reconcile JSON-LD: emit `Offer` with a band (`lowPrice`/`highPrice` via `AggregateOffer`) only where a real band exists; otherwise no price in schema (no more `0.00 / PreOrder` mismatch).
- Add real FAQ content to the PDP accordion.
- **Which system wins** (static vs `product.php`) is a **technical decision deferred to §10** — content is authored to be portable either way.

---

## 5. Bengali transcreation plan

- Write **Bengali first** for homepage, care, and the 4 priority guides; match English to it.
- Fix drift: retire literal renderings; no English words inside Bengali sentences; soften over-claims ("হুবহু সোনার মতো" / indistinguishable → an honest "সোনার মতো দেখতে" register that matches the English).
- Keep the mirrored nav helper-labels behavior (EN pages show BN sub-labels and vice-versa) — verified working, real UTF-8.
- Local vocabulary retained: Churi, Shitahar, Deshi/Dubai Necklace, Locket, etc. (per keyword-intent notes).

---

## 6. Pricing implementation (bands)

- **Where shown:** shop cards, category pages, PDPs — as a range ("৳ 900–3,500") + "Final price confirmed on WhatsApp for custom sizing."
- **Schema:** `AggregateOffer` with `lowPrice`/`highPrice`/`priceCurrency: BDT` where a band exists.
- **Source of truth:** bands live in the catalog data / DB, not hardcoded in 27 HTML files, so they update in one place.
- **Numbers:** every band in §4.3 is DRAFT — you overwrite with real supplier ranges; nothing publishes until you confirm each.

---

## 6b. AEO — earning AI-engine citations (our best near-term win)

AI engines (ChatGPT, Perplexity, Google AI Overviews, Gemini) do not cite *well-written* content — they cite **specific, self-contained, uniquely-sourced** content. Well-formed generic prose is never quoted. The earlier draft's answer blocks were correctly structured but generically worded, which limits their citation value.

**The unlock: publish data that exists nowhere else.** eMarket247 is about to own three data assets no BD competitor publishes cleanly:

| Data asset | Why it gets cited | Where it lives |
|---|---|---|
| **Honest price band table** (per category, dated) | Competitors say "ইনবক্সে দাম". A published BD price table for imitation jewellery is close to unique. | Shop + each category + a dedicated pricing explainer |
| **Delivery charge + timeframe table by district/area** | Concrete, structured, frequently asked, rarely published in extractable form. | Delivery page |
| **Plating longevity observations from our own stock** | First-hand experience (the "E" in E-E-A-T) that no aggregator can copy. | Care page + colour-longevity guide |

**Writing rules for citation-worthiness:**
- Lead each key page with a **self-contained 40–55 word answer** that makes sense quoted with zero surrounding context.
- Prefer **short declarative sentences containing numbers** ("Inside Dhaka, delivery takes 1–3 days and costs ৳80.") over descriptive prose.
- Use **tables and clean lists** — these are disproportionately extracted.
- **Date-stamp factual content** ("Prices reviewed September 2026") and honour the refresh cadence in §9b.
- **Cite outward** to authoritative sources (BAJUS, BSTI, courier policy pages) — outbound citation is a trust signal, not a leak.
- Keep the brand a clean **entity**: identical name, address, and phone everywhere, plus links to your real social profiles.

---

## 6c. Information gain — the bar every page must clear

A page ranks when it contains something the existing results do not. Structure alone is not differentiation. **Every guide must state its information gain before it is written.**

| Guide | What everyone else publishes | Our information gain |
|---|---|---|
| `real-vs-plated` | Generic "bite it / magnet test" listicles | What *we* disclose about our own stock; where in Dhaka to get an independent check and what it costs; honest limits of each home test |
| `will-the-colour-last` | Vague "it depends" | Our own observed longevity by piece type; the specific BD triggers (humidity, monsoon, perfume, wudu, kitchen steam) |
| `gold-types-explained` | Copy-paste US definitions | BD market reality: what "city gold" actually means locally, what sellers here mean vs. the technical definition |
| `sizing-guide` | Generic ring charts | Real inch/cm measurements for *our* pieces + a thread-and-scale method for home measuring |
| `buy-safely-online-bd` | Generic warnings | Named local red flags: "ইনবক্সে দাম", stolen catalog photos, no return policy, no seller identity |
| `zakat-imitation-jewellery` | Absent or unclear | Direct, well-sourced answer for BD readers |
| Care troubleshooting | Scattered forum answers | Specific fixes for the exact symptoms people search |

**Rule:** if a guide's only advantage is being better written, it is not ready to publish.

---

## 6d. New content types (highest effort-to-reward ratio)

Two content types were missing entirely from the earlier draft and are among the strongest opportunities available:

**1. Bilingual jewellery glossary — `/{en,bn}/guides/jewellery-glossary/`**
Definitions for `city gold`, `gold plated`, `gold filled`, `rolled gold`, `one gram gold`, `American diamond`, `kundan`, `polki`, `meenakari`, `jhumka`, `nolok`, `tikli`, `shitahar`, `chik`, `bala`, `churi`, `kaner dul`, `golar har`, `locket`, `deshi/Dubai necklace`.
*Why:* long-tail magnet + AI-citation magnet (definitional content is heavily quoted) + strong cultural-authenticity signal. One page with anchors now; individual pages later if terms earn impressions. **Promote to Phase 2.**

**2. Care troubleshooting cluster** — high-volume, low-competition, perfect trust-transfer:
- "গয়না পরলে চামড়া কালো/সবুজ হয়ে যায় কেন" / why jewellery turns skin green or black
- how to clean tarnished gold-plated jewellery at home / ইমিটেশন গহনা কালো হয়ে গেলে কী করবেন
- how to store jewellery in humid/monsoon weather
- what to do when plating starts wearing off
*Why:* these are asked constantly, answered badly, and are exactly what an honest seller should own. **Promote to Phase 2.**

**Also promoted:** `sizing-guide` moves from Phase 3 to Phase 2 (high intent, low competition, directly reduces returns).

---

## 6e. Internal linking — topical clusters

Rankings depend heavily on how pages support each other. The earlier draft said "cross-link deliberately" without a model. The model:

- **Hub → spoke → hub.** Each cluster has one hub that links to every spoke; every spoke links back to its hub and to 2–3 sibling spokes.
  - *Product cluster:* `/shop/` → 9 category pages → PDPs → back to category.
  - *Editorial cluster:* `/guides/` → guide articles → back to hub + into the relevant category.
  - *Occasion cluster:* `/occasions/` → occasion pages → into categories (never competing with them).
- **Descriptive anchor text**, varied naturally — "how long gold-tone plating lasts", not "click here" or the same exact-match phrase every time.
- **Every guide links to at least one commercial page**; every category page links to at least one guide. This is what converts informational traffic into enquiries, and it is currently missing.
- **Bridal/gift cannibalization rule (from §2):** occasion pages link *into* the category page for the head term and never optimise for it themselves.

---

## 6f. E-E-A-T — the credibility layer

Anonymous brand voice underperforms demonstrated human expertise. Currently the site has none of this.

- **A named author with a real bio.** Guides should be by-lined by you (or a named person) with a short credential line and a photo. This single change materially affects how both Google and AI engines weigh the content.
- **First-hand experience signals** — "we have handled X pieces", "what we see come back", "what our customers ask most". Experience is the hardest signal to fake and the one you genuinely have.
- **Real customer proof** — post-delivery WhatsApp review requests, real-wear photos (with permission), and honest testimonials. Build these legitimately; never fabricate ratings.
- **Outbound citations** to BAJUS, BSTI, and your courier's published policy.
- **Complete seller identity** — legal name, address, phone, email on About/Contact (also required by the BD 2021 guidelines).

---

## 6g. Trust vs. desire — rebalance the narrative

**The most important content critique of the earlier draft:** it is ~90% rational (colour lasts, prices are clear, returns work) and ~10% emotional. **Jewellery is bought emotionally and justified rationally.** Trust gets you believed; desire gets you bought. A plan that only builds trust produces a credible shop nobody feels anything about.

**Target balance ≈ 60% trust / 40% desire.** Practically:
- Occasion pages lead with **the moment, not the metal** — gaye-holud morning light, the aunt who notices, the first Puja after marriage, a daughter's first pair of jhumkas.
- Category pages include **one styling paragraph** ("what this looks like with a cotton saree vs a kameez").
- Guides get a **"how to wear it"** section, not only "how to care for it".
- Product copy describes **how a piece feels and reads on the body**, not only its specification.
- Keep every emotional line **truthful** — evocative is fine, exaggerated is not. Desire and honesty are not in conflict; overclaiming is the only thing that breaks the thesis.

---

## 6h. Content calendar — Bangladesh seasonality

Absent from the earlier draft. Seasonal content must be published **6–8 weeks ahead** of the event to be indexed and ranking in time.

| Season | Peak | Publish by | Content |
|---|---|---|---|
| **Durga Puja 2026** | mid-Oct (Mahalaya ~10 Oct, main days ~16–21 Oct) | **now — already late** | Puja occasion page, Puja style guide, gifting |
| **Wedding season** | Nov–Feb | Sep–Oct | Bridal guides, gaye-holud/reception styling, bridal sets |
| **Eid** | per lunar calendar | 8 weeks prior | Eid occasion page, family gifting |
| **Pohela Boishakh** | 14 April | Feb | Red-and-white styling, traditional pieces |
| **Valentine's / Falgun** | 13–14 Feb | Jan | Gifting, pendants, couple pieces |

**Refresh, don't re-create:** update the same seasonal URLs each year rather than spawning new ones — accumulated authority is preserved and the honesty date-stamp stays accurate.

---

## 6i. Product page content — the money pages

27 products × 2 languages is small and entirely achievable, so PDP content **moves from Phase 3 to Phase 2**. These convert; thin or duplicated product copy is the most common e-commerce content failure.

Per-product requirements: a unique 2–3 sentence description (**never templated across products**), what it's made of stated honestly, what it suits (occasion/outfit), size/measurement, care note, the price band, and 2–3 product-specific FAQs. Cross-link to its category and one relevant guide.

---

## 7. Phased delivery sequence

**Revised for long-tail-first (§3) and the promotions in §6d/§6i.** Rationale: Phase 1 stays trust/compliance because it is legally required and every other page cites it. But guides are no longer a "later" tier — **they are the traffic engine**, so the fastest-winning long-tail content moves up alongside categories.

**Phase 1 — trust, compliance & entity foundation:**
- Homepage rewrite (H1/deck **with price signal**, answer block, how-ordering-works, 9 tiles, care teaser, gold-vs-gold-tone, FAQ).
- Care page real content — including first-hand plating-longevity observations (§6b data asset).
- **Refund & Exchange + Delivery pages** (needs your facts; Delivery carries the district charge table — §6b data asset).
- About: seller identity + named author bio (§6f).
- Contact tidy.
- Strip fabricated ৳8,500; apply confirmed bands across shop/categories/PDPs (§6b data asset).
- **Puja content shipped immediately** — already inside the window (§6h).

**Phase 2 — the ranking engine:**
- **Bilingual glossary** (§6d) — long-tail + AI-citation magnet.
- **Care troubleshooting cluster** (§6d) — fastest-winning queries on the site.
- **Sizing guide** (promoted from Phase 3).
- 4 priority guides: real-vs-plated, colour-longevity, gold-types-explained, puja-style-guide.
- 9 category pages: full copy + bands + styling paragraph (§6g) + FAQ.
- 7 occasion pages, each genuinely specific and leading with the moment (§6g).
- **PDP content for all 27 products** (promoted from Phase 3, §6i).
- Internal linking model implemented across all clusters (§6e).
- Bengali-first writing for homepage, care, glossary, troubleshooting (§3.3).

**Phase 3 — depth, authority & compounding:**
- Remaining guides monthly: zakat, men's jewellery, earrings-by-face-shape, bridal guide, everyday-vs-occasion, buy-safely-online-bd, gifting guide.
- Bengali-only guide topics with no English twin (§3.3).
- Founder note.
- Customer proof: reviews, real-wear photos (§6f).
- Wedding-season and Eid content per the calendar (§6h).
- Refresh pass on Phase 1–2 pages (§9b).

---

## 8. Inputs I need from you

**Blocking Phase 1:**
1. **Confirmed price bands** per category (overwrite the §4.3 drafts, or approve them). Also gives us the "from ৳X" hero signal.
2. **Delivery facts:** courier name(s), delivery timeframe, **charge by area/district** (the table is a §6b data asset), COD yes/no, open-box yes/no + conditions.
3. **Refund facts:** confirm 15-day window, what qualifies, return-shipping payer, exclusions, refund timeline.
4. **Seller identity** for About/legal: legal/trading name, address, phone, email (§6f, required by BD 2021 guidelines).
5. **Named author** for by-lines: who writes/approves the guides, a one-line credential, and a photo (§6f).

**Blocking Phase 2 (needed for information gain, §6c):**
6. **First-hand observations** — how long your pieces actually hold colour, what comes back and why, the questions customers ask most on WhatsApp. *This is the material no competitor can copy and the strongest asset in the whole plan.*
7. **Real measurements** for sizing (ring sizes, bangle diameters, chain lengths) across the 27 products.

**When ready / non-blocking:**
8. **Free-gift promo terms** (spend threshold, what the gift is).
9. **Founder note** text (Phase 3).
10. **Any City-Gold xlsx lines you *do* offer** (artisanal/Dokra, services, international shipping) — else they stay rejected. *(Note: "city gold" as a keyword is back in per §3.2 — this question is only about product/service lines.)*

---

## 9. Measurement layer

- Set up **Google Search Console** + sitemap submission; validate hreflang. **This is the single most important non-content action** — it converts every unverified keyword hypothesis in §3 into real data.
- Track queries **separately by register** (English / Bengali script / Banglish) — they will perform very differently and the split tells us where to invest.
- **Competitor set to watch:** Daraz jewellery sellers, Facebook page-shops, established imitation retailers.
- Review-capture process (post-delivery WhatsApp ask) to build reviews and `AggregateRating` legitimately — never fabricated.
- **Monitor AI-engine citation** manually: monthly, ask ChatGPT/Perplexity/Gemini the questions our pages answer and record whether we are cited. This is currently the only practical way to measure AEO.

### 9a. Honest KPIs by horizon

Judge the plan against the right milestone for its age, not against head-term rankings on day 30.

| Horizon | What success actually looks like |
|---|---|
| **Month 1–2** | Pages indexed; GSC shows first impressions; real query data replaces §3 hypotheses |
| **Month 2–4** | Long-tail + Bengali queries entering top 20; first AI-engine citations; WhatsApp enquiries citing a guide |
| **Month 4–8** | Troubleshooting/glossary/sizing pages in top 10; occasion pages ranking in season; measurable enquiry volume from organic |
| **Month 8–15** | Category terms competitive; brand searches for "eMarket247" appearing — the strongest signal of all |

**Leading indicator to watch above all others:** enquiries that mention something they read on the site. That means the content did its job — trust transferred before contact.

### 9b. Refresh cadence (rankings decay; honesty content decays faster)

For a brand whose thesis is accuracy, stale content is a direct contradiction, not just an SEO cost.

- **Quarterly:** price bands, delivery charges/timeframes, refund terms — the §6b data assets. Update the visible date stamp each time.
- **Annually:** seasonal pages refreshed in place (never re-created at new URLs — see §6h).
- **Continuously:** every guide gains the real questions customers ask on WhatsApp. **Your WhatsApp inbox is the best keyword research tool you own** — no tool reports BD imitation-jewellery intent better than actual customer messages. Log recurring questions and turn them into content.

---

## 10. Deferred (not in this content pass)

**Design backlog (after content):**
- **Utility/top bar layout:** BN/EN toggle pinned to LEFT edge; promo/claims text centered exactly; WhatsApp pinned to RIGHT edge with considerate padding/margin. (Your spec — design phase.)

**Technical SEO / indexability (flagged, deferred):**
- Sitemap omits 5 existing categories (rings, pendants, jewellery-sets, bridal-jewellery, gift-jewellery ×2 langs); homepage's #1 tile "Rings" is `noindex` — self-defeating. Fix indexability + JSON-LD consistency (the 4 indexable categories carry no JSON-LD; the noindex ones carry rich JSON-LD — backwards).
- Two-PDP-system duplication (static HTML vs `product.php`): pick one canonical system.
- Fabricated **"22K Gold Luster & Sterling Silver" material default** in the DB/create path — you agreed it's legally risky; turn off by default (honesty-thesis-aligned).
- Order/checkout technical items — kept aside per your instruction.

**Security (remind only at the very end, per your instruction):** rotate the live DB password; change default admin `admin247`. *(Not raised now — logged here so it isn't forgotten at handoff.)*

---

## 11. New sections — how they're built (the content/design boundary)

**Principle:** in the content phase, new sections **reuse existing components and styles** — no new visual design language is invented. Each new section is a *content + markup* task composed from patterns the site already has, so it publishes on-brand and requires **zero design decisions from you to go live.** Anything that would genuinely benefit from a new visual treatment is **flagged for the design phase**, not built now.

**Existing pattern kit reused:** 4-item strip · 3-item card row · category tiles · aside/quote block · accordions (FAQ) · shared content-page template · existing button styles.

| New section / page | Reuses | Design decision *now*? | Optional upgrade (design phase) |
|---|---|---|---|
| Homepage answer block | intro text block | No | — |
| "How ordering works" (3 steps) | 3-item card row | No | custom step icons |
| 4 → 9 category tiles | tile component | No | — |
| "Will the colour last?" teaser | aside/text-link block | No | — |
| "Solid gold vs gold-tone" | 2-column text | No | comparison graphic |
| Homepage FAQ | accordion + FAQPage schema | No | — |
| Category / occasion answer + FAQ | intro + accordion | No | — |
| Care "four rules" / About "four things" | 4-item strip | No | icons |
| Refund & Exchange (new page) | content-page template | No | — |
| Delivery (new page) | content-page template + simple table | No | — |
| Guide articles (new route) | content/article template | No | richer editorial layout |

**Content phase** = reuse patterns → functional, consistent, no design choice required from you.
**Design phase** = optional custom treatment (icons, comparison graphic, photography, refined UI/UX, and the top-bar layout in §10) chosen from the "optional upgrade" column.

Two caveats: (1) the guide-article route is new — built from the existing content-page template (same chrome, not a new look); (2) the 9-tile homepage ties to the deferred indexability fix (Rings is currently `noindex`), so content and that one tech fix will land together — flagged when we reach it.

---

*Nothing in this plan is edited into the site until you approve it. On approval I start Phase 1, drafting full bilingual copy page-by-page for your line-level sign-off.*
