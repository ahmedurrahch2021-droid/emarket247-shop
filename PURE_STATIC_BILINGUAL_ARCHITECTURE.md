# eMarket247 Pure Static Bilingual Architecture

## Decision

The storefront will be converted from its current React/TypeScript source to a **pure multi-page HTML, CSS, and vanilla JavaScript website**. The final delivery will contain ordinary `.html` files, a readable `assets/` directory, static images, CSS, JavaScript, sitemap files, and a Hostinger-compatible `.htaccess` fallback. No framework runtime, server, API key, payment secret, or build tool will be required to host the resulting package.

This decision supports the owner’s File Manager workflow and creates visibly separate, crawlable pages. It is not an SEO shortcut: search performance will depend on page quality, semantic HTML, language-specific content, internal links, page speed, valid technical metadata, accurate image information, and real product facts.

## Delivery tree

```text
emarket247-static/
├── index.html                         # Neutral language selection / x-default
├── robots.txt
├── sitemap.xml
├── .htaccess
├── assets/
│   ├── css/
│   │   └── site.css
│   ├── js/
│   │   └── site.js
│   ├── data/
│   │   ├── catalog.en.json            # Approved English product metadata only
│   │   └── catalog.bn.json            # Approved Bengali product metadata only
│   └── images/
│       ├── brand/                     # Supplied logo, favicon, manifest icons
│       ├── editorial/                 # Optimized hero/seasonal imagery
│       └── products/                  # Approved WebP/JPEG product derivatives
├── en/
│   ├── index.html
│   ├── shop/index.html
│   ├── categories/index.html
│   ├── categories/rings/index.html
│   ├── categories/earrings/index.html
│   ├── categories/necklaces/index.html
│   ├── categories/bracelets/index.html
│   ├── categories/bangles/index.html
│   ├── categories/pendants/index.html
│   ├── categories/jewellery-sets/index.html
│   ├── categories/gift-jewellery/index.html
│   ├── occasions/puja/index.html
│   ├── occasions/bridal/index.html
│   ├── occasions/gifts/index.html
│   ├── guides/index.html
│   ├── care/index.html
│   ├── about/index.html
│   ├── contact/index.html
│   ├── privacy/index.html
│   └── terms/index.html
└── bn/
    └── [the reciprocal Bengali page tree]
```

## Navigation and header contract

The header will use the **functional conventions** of a modern jewelry storefront: a calm utility line, supplied eMarket247 lockup, primary navigation, hover/focus category submenu, search entry point, language switch, and bag/account affordances. It will be original eMarket247 work rather than an exact copy of Pandora’s protected header design, labels, spacing, icons, or visual expression.

The Category menu will expose a dedicated link to every individual category page. The static header will use semantic `<nav>`, `<button>`, `<ul>`, and `<a>` elements; keyboard focus, escape handling, and mobile menu behavior will be implemented in vanilla JavaScript.

## Hero slider and motion contract

The homepage will use a full-width **image** slider rather than video. It will include three image panels, visible previous/next controls, slide status, touch-safe navigation, and a gentle time-based rotation only when reduced-motion is not requested. Hover, focus, or interaction will pause autoplay. The slide text will remain in HTML, distinct from the image, so it is crawlable, translatable, and accessible.

Scroll effects will be limited to lightweight opacity and transform transitions. The site will not use video, auto-opening sign-in prompts, or motion that blocks access to content.

## Cookie and account contract

The initial static package will not use a cookie banner unless non-essential cookies are actually enabled. If analytics or marketing cookies are added later, the site will show a real preference notice with Accept, Reject, and Manage choices, store the preference locally, and load non-essential scripts only after consent. A sign-in interface will not open automatically and will remain absent until a real secure account service exists.

## Product catalog contract

The owner has approved use of the 48 supplied product photographs before prices are available. The static catalog will therefore display product cards with image, bilingual descriptive title, category, image caption, and a clear “Details preparing” / “বিস্তারিত প্রস্তুত হচ্ছে” status. Prices, stock, material, delivery, payment, review, rating, sale, and return claims will remain out of the public HTML until verified.

Every published image must have a source record, stable subject-based filename, copyright `© eMarket247. All rights reserved.`, bilingual alt text, bilingual caption, embedded metadata, responsive dimensions, and an explicit page/code reference.

## Multilingual and SEO contract

Each corresponding language pair uses an English canonical technical route, a Bengali localized route, reciprocal `hreflang="en"` and `hreflang="bn"` links, an `x-default` language-selection link, and visible single-language page content. The root page will not auto-redirect users.

Every public category, occasion, guide, policy, and future product page will receive a unique `<title>`, description, semantic heading hierarchy, `BreadcrumbList`, visible internal links, canonical link, Open Graph image, and a sitemap entry. Product JSON-LD will not be added until its visible product record contains verified, complete information.
