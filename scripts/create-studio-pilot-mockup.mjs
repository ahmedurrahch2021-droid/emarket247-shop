/** Create a noindex visual approval page; it does not publish products, prices, stock, or checkout. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(project, "static-site");
const phoneNational = "8801740501062";
const phoneDisplay = "+880 1740-501062";
const images = [
  {
    src: "/manus-storage/emarket247-studio-pilot-crossed-band-ring_edbabd9d.png",
    enTitle: "Crossed-Band Ring",
    bnTitle: "ক্রসড-ব্যান্ড আংটি",
    enCategory: "Rings",
    bnCategory: "আংটি",
    enAlt: "Crossed-band ring with clear stone detailing on a warm-white studio background",
    bnAlt: "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে স্বচ্ছ পাথরের ডিটেইলসহ ক্রসড-ব্যান্ড আংটি",
  },
  {
    src: "/manus-storage/emarket247-studio-pilot-floral-ring_f3fa0884.png",
    enTitle: "Floral Motif Ring",
    bnTitle: "ফুলেল নকশার আংটি",
    enCategory: "Rings",
    bnCategory: "আংটি",
    enAlt: "Floral-motif ring with clear stone accents on a warm-white studio background",
    bnAlt: "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে স্বচ্ছ পাথরের অ্যাকসেন্টসহ ফুলেল নকশার আংটি",
  },
  {
    src: "/manus-storage/emarket247-studio-pilot-pave-components_f68812f4.png",
    enTitle: "Pavé Jewellery Components",
    bnTitle: "পাভে জুয়েলারি কম্পোনেন্ট",
    enCategory: "Jewellery Detail",
    bnCategory: "জুয়েলারি ডিটেইল",
    enAlt: "Three pavé-set jewellery components on a warm-white studio background",
    bnAlt: "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে তিনটি পাভে-সেট জুয়েলারি কম্পোনেন্ট",
  },
];

const esc = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

function productCard(product, lang) {
  const bn = lang === "bn";
  const title = bn ? product.bnTitle : product.enTitle;
  const category = bn ? product.bnCategory : product.enCategory;
  const alt = bn ? product.bnAlt : product.enAlt;
  const message = encodeURIComponent(bn ? `আসসালামু আলাইকুম, আমি eMarket247-এর ${title} সম্পর্কে জানতে চাই।` : `Hello, I would like to know more about the eMarket247 ${title}.`);
  return `<article class="studio-product-card"><a class="studio-image" href="https://wa.me/${phoneNational}?text=${message}" target="_blank" rel="noopener noreferrer" aria-label="${bn ? `${title} সম্পর্কে WhatsApp-এ জানতে চান` : `Ask about ${title} on WhatsApp`}"><img src="${product.src}" width="1920" height="1920" loading="lazy" alt="${esc(alt)}"></a><div class="studio-card-copy"><p class="eyebrow">${esc(category)}</p><h2>${esc(title)}</h2><p class="studio-price">${bn ? "মূল্য অনুমোদনের অপেক্ষায়" : "Price pending approval"}</p><p class="studio-caption">${bn ? "স্টুডিও ইমেজ পাইলট · পণ্যের বিস্তারিত ও প্রাপ্যতা যাচাইাধীন" : "Studio-image pilot · Product detail and availability under review"}</p></div><div class="studio-card-actions"><button class="studio-add" type="button" aria-disabled="true" data-toast="${bn ? "দাম ও প্রাপ্যতা অনুমোদনের পর ব্যাগে যোগ করার সুবিধা চালু হবে।" : "Add to Bag will be enabled after price and availability approval."}">${bn ? "ব্যাগে যোগ করুন" : "Add to Bag"}</button><a class="studio-whatsapp" href="https://wa.me/${phoneNational}?text=${message}" target="_blank" rel="noopener noreferrer">${bn ? "WhatsApp-এ জানুন" : "Ask on WhatsApp"} <span aria-hidden="true">↗</span></a></div></article>`;
}

function main(lang) {
  const bn = lang === "bn";
  const cards = images.map((product) => productCard(product, lang)).join("");
  return `<main id="main"><nav class="breadcrumb wrap" aria-label="${bn ? "পথনির্দেশ" : "Breadcrumb"}"><ol><li><a href="/${lang}/">${bn ? "হোম" : "Home"}</a></li><li><a href="/${lang}/categories/">${bn ? "ক্যাটাগরি" : "Categories"}</a></li><li><a href="/${lang}/categories/rings/">${bn ? "আংটি" : "Rings"}</a></li><li><span aria-current="page">${bn ? "স্টুডিও পাইলট" : "Studio pilot"}</span></li></ol></nav><section class="studio-pilot-hero wrap"><div><p class="eyebrow">${bn ? "স্টুডিও ইমেজ পাইলট" : "Studio-image pilot"}</p><h1>${bn ? "উষ্ণ-সাদা স্টুডিওতে পণ্যের বাস্তব উপস্থাপনা।" : "A lived-in studio finish for product discovery."}</h1><p>${bn ? "এটি অনুমোদনের জন্য একটি ভিজ্যুয়াল মক-আপ। ছবিতে কোনো লোগো বা টেক্সট নেই; দাম, স্টক ও চেকআউট এখনো প্রকাশিত নয়।" : "This is a visual approval mock-up. Product imagery is text-free; price, stock, and checkout remain unpublished."}</p></div><aside><span>${bn ? "কাস্টমার কেয়ার" : "Customer care"}</span><a href="tel:${phoneDisplay.replace(/\s/g, "")}">${phoneDisplay}</a><a class="studio-contact-whatsapp" href="https://wa.me/${phoneNational}?text=${encodeURIComponent(bn ? "আসসালামু আলাইকুম, আমি eMarket247-এর জুয়েলারি সম্পর্কে জানতে চাই।" : "Hello, I would like to enquire about eMarket247 jewellery.")}" target="_blank" rel="noopener noreferrer">${bn ? "WhatsApp-এ কথা বলুন" : "Chat on WhatsApp"} ↗</a></aside></section><section class="studio-catalog wrap" aria-labelledby="studio-catalog-title"><div class="studio-catalog-head"><div><p class="eyebrow">${bn ? "ক্যাটাগরি পেজ মক-আপ" : "Category-page mock-up"}</p><h2 id="studio-catalog-title">${bn ? "আংটি ও জুয়েলারি ডিটেইল" : "Rings & jewellery details"}</h2></div><p>${bn ? "৩-কলামের ডেস্কটপ গ্রিড · ২-কলামের মোবাইল গ্রিড" : "Three-column desktop grid · Two-column mobile grid"}</p></div><div class="studio-product-grid">${cards}</div></section><aside class="studio-pilot-note wrap"><strong>${bn ? "পাইলট নোট" : "Pilot note"}</strong><p>${bn ? "‘ব্যাগে যোগ করুন’ বাটনটি লেআউট ও কাস্টমার জার্নি দেখানোর জন্য রয়েছে। অনুমোদিত মূল্য, স্টক এবং নিরাপদ চেকআউট যুক্ত হওয়ার আগে এটি অর্ডার গ্রহণ করবে না।" : "The Add to Bag control demonstrates the intended layout and customer journey. It will not accept orders until approved price, stock, and secure checkout are connected."}</p></aside></main>`;
}

async function createPage(lang) {
  const bn = lang === "bn";
  const basePath = path.join(source, lang, "categories", "rings", "index.html");
  let html = await readFile(basePath, "utf8");
  const title = bn ? "স্টুডিও প্রোডাক্ট পাইলট | eMarket247" : "Studio Product Pilot | eMarket247";
  const description = bn ? "eMarket247-এর টেক্সট-ফ্রি উষ্ণ-সাদা স্টুডিও প্রোডাক্ট ইমেজ ও ক্যাটাগরি পেজ মক-আপ।" : "Text-free warm-white studio product imagery and category-page mock-up for eMarket247.";
  const canonical = `https://emarket247.shop/${lang}/studio-pilot/`;
  const alternate = `https://emarket247.shop/${bn ? "en" : "bn"}/studio-pilot/`;
  html = html
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,nofollow">')
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="https://emarket247.shop/en/studio-pilot/">`)
    .replace(/<link rel="alternate" hreflang="bn" href="[^"]*">/, `<link rel="alternate" hreflang="bn" href="https://emarket247.shop/bn/studio-pilot/">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(new RegExp(`href="/${bn ? "en" : "bn"}/" class="lang-link"`), `href="/${bn ? "en" : "bn"}/studio-pilot/" class="lang-link"`)
    .replace(/<nav class="breadcrumb wrap"[\s\S]*?<\/nav>\s*<main id="main">[\s\S]*?<\/main>/, main(lang));
  const target = path.join(source, lang, "studio-pilot", "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

let css = await readFile(path.join(source, "assets", "css", "site.css"), "utf8");
if (!css.includes("STUDIO_IMAGE_PILOT")) {
  css += `
/* STUDIO_IMAGE_PILOT: approval-only category mock-up, preserving eMarket247's ivory/red editorial system. */
.studio-pilot-hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(250px,.6fr);gap:clamp(28px,6vw,88px);align-items:end;padding-top:clamp(72px,11vw,155px);padding-bottom:clamp(42px,6vw,80px);border-bottom:1px solid var(--line)}.studio-pilot-hero h1{max-width:840px;margin:0;font:clamp(44px,5.6vw,88px)/.94 var(--serif);letter-spacing:-.05em}.studio-pilot-hero>div>p:not(.eyebrow){max-width:680px;margin:24px 0 0;color:var(--muted)}.studio-pilot-hero aside{padding:21px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}.studio-pilot-hero aside span,.studio-pilot-hero aside a{display:block}.studio-pilot-hero aside span{color:var(--red-dark);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.studio-pilot-hero aside>a:not(.studio-contact-whatsapp){margin:8px 0 17px;font:clamp(24px,2.3vw,34px)/1 var(--serif);letter-spacing:-.03em}.studio-contact-whatsapp{width:max-content;border-bottom:1px solid var(--ink);padding-bottom:4px;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}.studio-catalog{padding-top:clamp(42px,6vw,82px);padding-bottom:clamp(32px,4vw,56px)}.studio-catalog-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:27px}.studio-catalog-head h2{margin:0;font:clamp(34px,4vw,58px)/1 var(--serif);letter-spacing:-.04em}.studio-catalog-head>p{max-width:180px;margin:0;color:var(--muted);font-size:10px;text-align:right;text-transform:uppercase;letter-spacing:.08em}.studio-product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.studio-product-card{display:flex;flex-direction:column;border:1px solid var(--line);background:#fffdfb}.studio-image{display:block;overflow:hidden;background:#faf9f6}.studio-image img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .35s var(--ease)}.studio-product-card:hover .studio-image img{transform:scale(1.015)}.studio-card-copy{flex:1;padding:18px 18px 0}.studio-card-copy .eyebrow{margin-bottom:8px}.studio-card-copy h2{margin:0;font:clamp(24px,2.25vw,34px)/1.03 var(--serif);letter-spacing:-.035em}.studio-price{margin:15px 0 0;font-size:12px;font-weight:700}.studio-caption{min-height:36px;margin:7px 0 0;color:var(--muted);font-size:10px;line-height:1.45}.studio-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:18px}.studio-card-actions>*{display:inline-flex;justify-content:center;align-items:center;min-height:43px;border:1px solid var(--ink);padding:10px;background:#fff;color:var(--ink);font-size:9px;font-weight:700;letter-spacing:.07em;text-align:center;text-transform:uppercase}.studio-add{background:#e8e2dc!important;border-color:#e8e2dc!important;color:#746d67!important;cursor:not-allowed}.studio-whatsapp{background:var(--ink);color:#fff}.studio-whatsapp:hover{background:var(--red-dark);border-color:var(--red-dark)}.studio-pilot-note{display:grid;grid-template-columns:150px 1fr;gap:28px;padding-top:26px;padding-bottom:80px;border-top:1px solid var(--line)}.studio-pilot-note strong{font-size:10px;letter-spacing:.1em;text-transform:uppercase}.studio-pilot-note p{max-width:700px;margin:0;color:var(--muted);font-size:13px}@media(max-width:820px){.studio-pilot-hero{grid-template-columns:1fr}.studio-product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.studio-catalog-head{align-items:start;flex-direction:column}.studio-catalog-head>p{text-align:left}.studio-pilot-note{grid-template-columns:1fr;gap:10px}}@media(max-width:520px){.studio-pilot-hero{padding-top:54px}.studio-card-copy{padding:13px 13px 0}.studio-card-copy h2{font-size:23px}.studio-card-actions{grid-template-columns:1fr;padding:13px}.studio-pilot-note{padding-bottom:54px}.studio-caption{min-height:auto}}
`;
  await writeFile(path.join(source, "assets", "css", "site.css"), css, "utf8");
}

let js = await readFile(path.join(source, "assets", "js", "site.js"), "utf8");
if (!js.includes("CONTACT_PHONE_WHATSAPP")) {
  js = js.replace(
    'const careLink = one("a:not(.utility-language)", utility);',
    `const phoneLink = document.createElement("a");\n    phoneLink.className = "utility-phone";\n    phoneLink.href = "tel:+8801740501062";\n    phoneLink.textContent = "+880 1740-501062";\n    phoneLink.setAttribute("aria-label", language === "bn" ? "কাস্টমার কেয়ারের ফোন নম্বর" : "Customer care phone number");\n    utility.insertBefore(phoneLink, message);\n    const careLink = one("a:not(.utility-language):not(.utility-phone)", utility);`,
  );
  js = js.replace(
    'utilityStyle.textContent = `.utility{height:34px;',
    'utilityStyle.textContent = `/* CONTACT_PHONE_WHATSAPP */.utility{height:34px;',
  );
  js = js.replace(
    '.utility a:not(.utility-language){text-decoration:none;border-bottom:1px solid var(--red);padding-bottom:1px}',
    '.utility-phone{color:var(--ink)!important;text-decoration:none!important;font-weight:700;white-space:nowrap}.utility a:not(.utility-language):not(.utility-phone){text-decoration:none;border-bottom:1px solid var(--red);padding-bottom:1px}',
  );
  js = js.replace(
    '.utility a:not(.utility-language){font-size:9px}}`;',
    '.utility-phone{font-size:9px}.utility a:not(.utility-language):not(.utility-phone){font-size:9px}}`;',
  );
  await writeFile(path.join(source, "assets", "js", "site.js"), js, "utf8");
}

await Promise.all([createPage("en"), createPage("bn")]);
console.log("Created bilingual noindex studio product-grid mock-up pages with WhatsApp and phone contact treatment.");
