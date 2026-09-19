// One-off: visual design pass on three homepage sections (EN+BN):
// 1. puja-prompt — rebuild as an editorial split: framed image one side,
//    ALL text (eyebrow, h2, strong, p, button) aligned in the other column.
// 2. city-gold-guide — heading/intro/CTA get an image companion; cards stay.
// 3. faq — items framed as bordered paper cards matching the design system.
import { readFileSync, writeFileSync } from "node:fs";

const IMG = "/assets/images/editorial/emarket247-gifting-puja-editorial.webp";

for (const lang of ["en", "bn"]) {
  const f = `public_html/${lang}/index.html`;
  let s = readFileSync(f, "utf8");

  // --- 1. Durga Puja section: single text column + editorial figure ---
  const copy = lang === "en"
    ? { eyebrow: "Durga Puja Jewellery", h2: "Get Ready for the Festival Season",
        strong: "Gold-inspired jewellery for Puja",
        p: "Discover gold-inspired jewellery to pair with sarees, traditional outfits and festive looks throughout the Puja season.",
        cta: "Shop Puja Jewellery", alt: "Festive gold-tone jewellery editorial",
        cap: "Puja season" }
    : { eyebrow: "দুর্গা পূজার গহনা", h2: "উৎসবের মৌসুমের জন্য প্রস্তুত হোন",
        strong: "পূজার জন্য সোনালি-ভাবের গহনা",
        p: "পূজার মৌসুমজুড়ে শাড়ি, ঐতিহ্যবাহী পোশাক ও উৎসবের সাজের সাথে মানানসই সোনালি-ভাবের গহনা খুঁজে নিন।",
        cta: "পূজার গহনা দেখুন", alt: "উৎসবের সোনালি গহনার এডিটোরিয়াল",
        cap: "পূজার মৌসুম" };
  const href = lang === "en" ? "/en/occasions/puja/" : "/bn/occasions/puja/";

  const pujaStart = s.indexOf('<section class="puja-prompt"');
  if (pujaStart >= 0) {
    const pujaEnd = s.indexOf("</section>", pujaStart) + "</section>".length;
    const block = `<section class="puja-prompt"><div class="wrap puja-split"><figure class="puja-figure"><img src="${IMG}" width="2304" height="1536" alt="${copy.alt}" loading="lazy"><figcaption>${copy.cap}</figcaption></figure><div class="puja-copy"><p class="eyebrow">${copy.eyebrow}</p><h2>${copy.h2}</h2><strong>${copy.strong}</strong><p>${copy.p}</p><a class="button button-dark" href="${href}">${copy.cta} <span>→</span></a></div></div></section>`;
    s = s.slice(0, pujaStart) + block + s.slice(pujaEnd);
    console.log("puja rebuilt:", lang);
  }

  // --- 2. City Gold Guide: image companion beside heading/intro/CTA ---
  const gAnchor = '<p class="guide-intro">';
  if (s.includes('class="guide-top"') === false && s.includes(gAnchor)) {
    const gImgCap = lang === "en" ? "The city gold story" : "সিটি গোল্ডের গল্প";
    const gAlt = lang === "en" ? "Gold-tone jewellery detail" : "সোনালি গহনার কাছ থেকে";
    const head = lang === "en"
      ? `<p class="eyebrow">City Gold Guide</p><h2>How Can You Know the Real or Pure City Gold?</h2>`
      : `<p class="eyebrow">সিটি গোল্ড গাইড</p><h2>আসল বা খাঁটি সিটি গোল্ড কীভাবে চিনবেন?</h2>`;
    s = s.replace(head, `<div class="guide-top"><figure class="guide-figure"><img src="${IMG}" width="2304" height="1536" alt="${gAlt}" loading="lazy"><figcaption>${gImgCap}</figcaption></figure><div class="guide-head">` + head + `</div></div>`);
    console.log("guide top rebuilt:", lang);
  }

  writeFileSync(f, s);
}
console.log("done");
