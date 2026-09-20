#!/usr/bin/env node
/**
 * Wishlist page generator.
 *
 * Creates public_html/en/wishlist/index.html and public_html/bn/wishlist/index.html
 * from the canonical Shop page of the same language. The shared shell (header,
 * navigation, search panel, footer, toast host and the site.js reference) is
 * therefore byte-identical to the rest of the storefront; only the head
 * metadata and the <main> content are authored here.
 *
 * The generated pages carry no commerce facts of their own: the grid is built
 * at runtime by site.js from the visitor's saved slugs plus the approved
 * catalogue records, so a product title, price or image can never be stale or
 * invented on this page.
 *
 * Re-runnable by design. When the shared header or footer changes, re-run this
 * script (then scripts/wire-wishlist-nav.mjs and scripts/fix-cache-busting.mjs)
 * so both language pages pick the new shell up again.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://emarket247.shop";

const COPY = {
  en: {
    lang: "en",
    title: "Your Wishlist — Saved Jewellery | eMarket247",
    description:
      "Review the jewellery you saved while browsing eMarket247. Your wishlist is stored in this browser with no account or sign-up required, and any piece can be added to your bag.",
    ogTitle: "Your Wishlist | eMarket247",
    breadcrumb: "Wishlist",
    home: "Home",
    eyebrow: "Saved pieces",
    h1: "Your Wishlist",
    intro:
      "Everything you saved while browsing, in one place. Your wishlist lives in this browser — no account, sign-up or e-mail is required to keep it.",
    heroPrimary: "Browse the collection",
    heroSecondary: "Shop by category",
    gridHeading: "Saved jewellery",
    countUnit: "saved pieces",
    addAll: "Add all to bag",
    clear: "Clear wishlist",
    loading: "Loading your saved pieces…",
    notesIntro: "How this list works",
    notesHeading: "A wishlist that never asks you to register.",
    notes: [
      [
        "No account, ever required",
        "The heart works for guests. Creating an account only makes sense if you want your orders and wishlist kept together in one place — it is entirely optional.",
      ],
      [
        "Saved in this browser",
        "Your list is stored on this device, not on a server. Clearing your browser's site data removes it, so add the pieces you are sure about to your bag as well.",
      ],
      [
        "Details confirmed before you pay",
        "Saved pieces carry the same details as the catalogue. Final price, availability and courier charge are confirmed on WhatsApp before any payment.",
      ],
    ],
  },
  bn: {
    lang: "bn",
    title: "আপনার উইশলিস্ট — সংরক্ষিত গহনা | eMarket247",
    description:
      "ব্রাউজ করার সময় পছন্দের গহনা উইশলিস্টে সংরক্ষণ করুন — অ্যাকাউন্ট, সাইন-আপ বা ইমেইল ছাড়াই। উইশলিস্ট আপনার ব্রাউজারে সংরক্ষিত থাকে এবং যেকোনো সময় ব্যাগে যোগ করা যায়।",
    ogTitle: "আপনার উইশলিস্ট | eMarket247",
    breadcrumb: "উইশলিস্ট",
    home: "হোম",
    eyebrow: "সংরক্ষিত গহনা",
    h1: "আপনার উইশলিস্ট",
    intro:
      "ব্রাউজ করার সময় যেসব গহনা পছন্দ হয়েছে, সব এক জায়গায়। উইশলিস্ট আপনার ব্রাউজারেই সংরক্ষিত থাকে — রাখতে অ্যাকাউন্ট, সাইন-আপ বা ইমেইল লাগে না।",
    heroPrimary: "কালেকশন দেখুন",
    heroSecondary: "ক্যাটাগরি অনুযায়ী দেখুন",
    gridHeading: "সংরক্ষিত গহনা",
    countUnit: "টি সংরক্ষিত গহনা",
    addAll: "সব ব্যাগে যোগ করুন",
    clear: "উইশলিস্ট খালি করুন",
    loading: "আপনার সংরক্ষিত গহনা আনা হচ্ছে…",
    notesIntro: "উইশলিস্ট কীভাবে কাজ করে",
    notesHeading: "এমন উইশলিস্ট, যেখানে রেজিস্ট্রেশন লাগে না।",
    notes: [
      [
        "অ্যাকাউন্ট কখনোই বাধ্যতামূলক নয়",
        "হার্ট আইকন অতিথিদের জন্যই কাজ করে। অর্ডার ও উইশলিস্ট এক জায়গায় রাখতে চাইলে অ্যাকাউন্ট খোলা যায় — সেটি সম্পূর্ণ ঐচ্ছিক।",
      ],
      [
        "এই ব্রাউজারে সংরক্ষিত",
        "তালিকাটি এই ডিভাইসে রাখা হয়, কোনো সার্ভারে নয়। ব্রাউজারের সাইট ডেটা মুছলে উইশলিস্টও মুছে যায়, তাই নিশ্চিত পছন্দের গহনা ব্যাগেও রাখুন।",
      ],
      [
        "পেমেন্টের আগে বিবরণ নিশ্চিত",
        "সংরক্ষিত গহনার বিবরণ ক্যাটালগের মতোই থাকে। চূড়ান্ত দাম, প্রাপ্যতা ও কুরিয়ার চার্জ হোয়াটসঅ্যাপে নিশ্চিত করার পরেই পেমেন্ট।",
      ],
    ],
  },
};

const whatsappSection = (mainHtml) => {
  const match = mainHtml.match(/<section class="whatsapp-cta-section"[\s\S]*?<\/section>/);
  if (!match) throw new Error("Shop page main is missing its whatsapp-cta-section.");
  return match[0];
};

const structuredData = (config, url) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: config.title,
      description: config.description,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: config.lang,
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: config.home,
          item: `${SITE}/${config.lang}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: config.breadcrumb,
          item: url,
        },
      ],
    },
  ],
});

const buildPage = (lang) => {
  const config = COPY[lang];
  const shopPath = path.join(ROOT, "public_html", lang, "shop", "index.html");
  const shop = readFileSync(shopPath, "utf8");

  const headEnd = shop.indexOf("</head>");
  const mainStart = shop.indexOf("<main");
  const mainEnd = shop.indexOf("</main>") + "</main>".length;
  if (headEnd < 0 || mainStart < 0 || mainEnd < 0) {
    throw new Error(`${lang}/shop/index.html: expected head and main anchors were not found.`);
  }

  const url = `${SITE}/${lang}/wishlist/`;
  const otherLang = lang === "en" ? "bn" : "en";
  const shopMain = shop.slice(mainStart, mainEnd);

  let head = shop.slice(0, headEnd + "</head>".length);
  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${config.title}</title>`],
    [
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${config.description}">`,
    ],
    // A personal page: the content belongs to whoever saved it, so it must not
    // be indexed. Links on it are still followed for crawl discovery.
    [/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="noindex,follow">`],
    [/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`],
    [
      /<link rel="alternate" hreflang="en" href="[^"]*">/,
      `<link rel="alternate" hreflang="en" href="${SITE}/en/wishlist/">`,
    ],
    [
      /<link rel="alternate" hreflang="bn" href="[^"]*">/,
      `<link rel="alternate" hreflang="bn" href="${SITE}/bn/wishlist/">`,
    ],
    [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${config.ogTitle}">`],
    [
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${config.description}">`,
    ],
    [/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`],
    [
      /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-emk="ld">${JSON.stringify(structuredData(config, url), null, 2)}</script>`,
    ],
  ];

  for (const [pattern, value] of replacements) {
    if (!pattern.test(head)) throw new Error(`${lang}/shop/index.html: head is missing ${pattern}.`);
    head = head.replace(pattern, value);
  }

  const notes = config.notes
    .map(
      ([title, body], index) =>
        `<li><b>0${index + 1}</b><div><strong>${title}</strong><p>${body}</p></div></li>`,
    )
    .join("");

  const main = `<main id="main">
  <nav class="breadcrumb wrap" aria-label="Breadcrumb">
    <ol>
      <li><a href="/${lang}/">${config.home}</a></li>
      <li><span aria-current="page">${config.breadcrumb}</span></li>
    </ol>
  </nav>

  <section class="page-hero wrap simple wishlist-hero">
    <div>
      <p class="eyebrow">${config.eyebrow}</p>
      <h1>${config.h1}</h1>
      <p>${config.intro}</p>
      <div class="wishlist-hero-actions">
        <a class="button button-dark" href="/${lang}/shop/">${config.heroPrimary} <span>&#8594;</span></a>
        <a class="button button-outline" href="/${lang}/categories/">${config.heroSecondary}</a>
      </div>
    </div>
  </section>

  <section class="catalog-area wrap wishlist-area" aria-labelledby="wishlist-heading">
    <h2 class="sr-only" id="wishlist-heading">${config.gridHeading}</h2>

    <div class="wishlist-toolbar" data-wishlist-toolbar hidden>
      <p class="wishlist-count-line"><strong data-wishlist-count>0</strong><span>${config.countUnit}</span></p>
      <div class="wishlist-toolbar-actions">
        <button type="button" class="wishlist-action-btn" data-wishlist-add-all>${config.addAll}</button>
        <button type="button" class="wishlist-action-btn wishlist-action-btn-quiet" data-wishlist-clear>${config.clear}</button>
      </div>
    </div>

    <p class="wishlist-status" data-wishlist-status role="status" aria-live="polite"></p>

    <div class="product-grid wishlist-grid" data-wishlist-page>
      <div class="wishlist-loading" role="status"><p>${config.loading}</p></div>
    </div>

    <p class="wishlist-account-note" data-wishlist-account-note hidden></p>
  </section>

  <section class="trust-grid wrap">
    <div>
      <p class="eyebrow">${config.notesIntro}</p>
      <h2>${config.notesHeading}</h2>
    </div>
    <ol>${notes}</ol>
  </section>

  ${whatsappSection(shopMain)}
</main>`;

  const bodyStart = shop.slice(headEnd + "</head>".length, mainStart);
  const tail = shop.slice(mainEnd);
  return `${head}${bodyStart}${main}${tail}`;
};

for (const lang of ["en", "bn"]) {
  const folder = path.join(ROOT, "public_html", lang, "wishlist");
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
  const file = path.join(folder, "index.html");
  writeFileSync(file, buildPage(lang), "utf8");
  console.log(`Wrote public_html/${lang}/wishlist/index.html`);
}

console.log(
  "Next: node scripts/wire-wishlist-nav.mjs && node scripts/fix-cache-busting.mjs && npm run check",
);
