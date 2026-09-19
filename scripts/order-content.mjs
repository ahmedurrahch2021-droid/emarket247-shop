// One-off, three tasks (EN+BN):
// 1. Remove the .guide-note paragraph under the homepage guide CTA.
// 2. Remove the "History of City Gold" article link from the site footer
//    (footers are for site navigation, not articles).
// 3. Expand the How to Order page with a full "Ways to order" + payment
//    section, facts sourced from the site's own delivery & refund pages:
//    - order by WhatsApp directly, or fill the cart and order via WhatsApp
//    - payment: cash on delivery via Pathao (COD fee 0.5%-1% of order value,
//      charged by Pathao), or pay bKash/Nagad to the courier rider on
//      delivery to avoid the COD fee; no online payment on the site.
import { readFileSync, writeFileSync } from "node:fs";

const T = {
  en: {
    eyebrow: "Ways to order",
    h2: "Order the way that suits you.",
    intro: "There is no rigid checkout here. Two simple routes lead to the same personal confirmation on WhatsApp — and payment happens at your doorstep.",
    w1h: "Order directly on WhatsApp",
    w1p: "Note the design name from its product page and send it to us on WhatsApp at +880 1740-501062, in Bangla or English. We reply with availability, the current details, and the confirmed final price. Most customers use this route — it is the fastest.",
    w2h: "Build a bag, then order it",
    w2p: "Prefer to collect pieces first? Add the designs you like to your shopping bag, review the list on the bag page, then send it to us on WhatsApp in one message. Same personal confirmation, same confirmed price before anything is arranged.",
    payh: "How you pay",
    payintro: "There is no online payment on this site — you never enter card details here. Payment happens when your parcel arrives:",
    li1: "<strong>Cash on delivery.</strong> Pay the courier rider in cash when your parcel is handed to you. Pathao charges a small COD fee of 0.5%–1% of the order value (for example, about BDT 7.50–15 on a BDT 1,500 order), added to the courier charge.",
    li2: "<strong>bKash or Nagad on delivery.</strong> You can pay the courier rider by bKash or Nagad instead of cash — this avoids the COD fee.",
    li3: "<strong>Courier charge separately.</strong> Delivery charges (roughly BDT 60–90 inside Dhaka, BDT 110–180 outside, per Pathao's route-based rates) are confirmed with you before dispatch and paid on delivery.",
    noteh: "One thing to remember",
    notep: "Please do not send payment details through chat before your order is confirmed personally with us. The exact product price, courier charge and any COD fee are all confirmed on WhatsApp before dispatch — nothing is collected twice.",
    links: `<a class="button button-dark" href="/en/shop/">Browse the Collection <span>→</span></a> <a class="button button-outline" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20order%20jewellery%20from%20eMarket247." target="_blank" rel="noopener noreferrer">Start an Order on WhatsApp <span>→</span></a>`
  },
  bn: {
    eyebrow: "অর্ডার করার উপায়",
    h2: "আপনার সুবিধামতো অর্ডার করুন।",
    intro: "এখানে কঠোর কোনো চেকআউট প্রক্রিয়া নেই। দুটি সহজ পথই শেষ হয় হোয়াটসঅ্যাপে ব্যক্তিগত নিশ্চিতকরণে — আর পেমেন্ট হয় আপনার দরজায়।",
    w1h: "সরাসরি হোয়াটসঅ্যাপে অর্ডার",
    w1p: "প্রোডাক্ট পেজ থেকে ডিজাইনের নাম নোট করে +880 1740-501062 নম্বরে বাংলা বা ইংরেজিতে হোয়াটসঅ্যাপে পাঠান। আমরা উত্তর দিই স্টক, বর্তমান ডিটেলস ও নিশ্চিত চূড়ান্ত দামসহ। বেশিরভাগ ক্রেতা এই পথই ব্যবহার করেন — এটিই দ্রুততম।",
    w2h: "ব্যাগে জমিয়ে তারপর অর্ডার",
    w2p: "আগে পছন্দের পিসগুলো জমিয়ে রাখতে চান? পছন্দের ডিজাইনগুলো শপিং ব্যাগে যোগ করুন, ব্যাগ পেজে তালিকা দেখে এক মেসেজে হোয়াটসঅ্যাপে পাঠিয়ে দিন। একই ব্যক্তিগত নিশ্চিতকরণ, কিছু সাজানোর আগেই নিশ্চিত দাম।",
    payh: "কীভাবে পরিশোধ করবেন",
    payintro: "এই সাইটে কোনো অনলাইন পেমেন্ট নেই — কার্ডের ডিটেলস দিতে হয় না। পেমেন্ট হয় পার্সেল হাতে পাওয়ার সময়:",
    li1: "<strong>ক্যাশ অন ডেলিভারি।</strong> পার্সেল হাতে পেয়ে কুরিয়ার রাইডারকে নগদে পরিশোধ করুন। Pathao ০.৫%–১% হারে ছোট একটি COD ফি নেয় (যেমন, ১,৫০০ টাকার অর্ডারে প্রায় ৭.৫০–১৫ টাকা), যা কুরিয়ার চার্জের সাথে যোগ হয়।",
    li2: "<strong>ডেলিভারিতে bKash বা Nagad।</strong> নগদের বদলে কুরিয়ার রাইডারকে bKash বা Nagad-এ পরিশোধ করা যায় — তাহলে COD ফি লাগে না।",
    li3: "<strong>কুরিয়ার চার্জ আলাদা।</strong> ডেলিভারি চার্জ (ঢাকার ভেতরে প্রায় ৬০–৯০ টাকা, ঢাকার বাইরে ১১০–১৮০ টাকা, Pathao-র রুটভিত্তিক হার অনুযায়ী) ডিসপ্যাচের আগেই নিশ্চিত করে জানিয়ে দেওয়া হয়, পরিশোধ ডেলিভারির সময়।",
    noteh: "একটি কথা মনে রাখুন",
    notep: "অর্ডার ব্যক্তিগতভাবে নিশ্চিত হওয়ার আগে চ্যাটে কোনো পেমেন্ট ডিটেলস পাঠাবেন না। প্রোডাক্টের নিশ্চিত দাম, কুরিয়ার চার্জ ও COD ফি — সবই ডিসপ্যাচের আগে হোয়াটসঅ্যাপে জানানো হয়; দুবার কিছু নেওয়া হয় না।",
    links: `<a class="button button-dark" href="/bn/shop/">কালেকশন দেখুন <span>→</span></a> <a class="button button-outline" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20order%20jewellery%20from%20eMarket247." target="_blank" rel="noopener noreferrer">হোয়াটসঅ্যাপে অর্ডার শুরু করুন <span>→</span></a>`
  }
};

for (const lang of ["en", "bn"]) {
  const t = T[lang];

  // 1) homepage: drop the guide-note paragraph
  const hf = `public_html/${lang}/index.html`;
  let h = readFileSync(hf, "utf8");
  const gn = h.indexOf('<p class="guide-note">');
  if (gn >= 0) {
    const ge = h.indexOf("</p>", gn) + 4;
    h = h.slice(0, gn) + h.slice(ge);
    console.log("guide-note removed:", lang);
  }

  // 2) footer: remove the History of City Gold article link
  const fh = lang === "en" ? "/en/history-of-city-gold/" : "/bn/history-of-city-gold/";
  const label = lang === "en" ? "History of City Gold" : "সিটি গোল্ডের ইতিহাস";
  const flink = `<a href="${fh}">${label}</a>`;
  if (h.includes(flink)) {
    h = h.replace(flink, "");
    console.log("footer link removed (home):", lang);
  }
  writeFileSync(hf, h);

  // 3) every other html page footer too
  const { readdirSync, statSync } = await import("node:fs");
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(`${dir}/${d.name}`) : d.name === "index.html" ? [`${dir}/${d.name}`] : []);
  let fixed = 0;
  for (const f of walk("public_html")) {
    if (f.endsWith(`/${lang}/index.html`) || !f.includes(`/${lang}/`)) continue;
    let s = readFileSync(f, "utf8");
    if (s.includes(flink)) { s = s.replace(flink, ""); writeFileSync(f, s); fixed++; }
  }
  console.log("footer links removed across pages:", lang, fixed);

  // 4) how-to-order page: insert the new section before the FAQ
  const of_ = `public_html/${lang}/how-to-order/index.html`;
  let o = readFileSync(of_, "utf8");
  if (o.includes('class="ways"')) { console.log("how-to-order already updated:", lang); continue; }
  const faqAnchor = '<section class="faq-section wrap">';
  if (!o.includes(faqAnchor)) { console.error("faq anchor missing", lang); continue; }
  const sec = `<section class="ways wrap"><p class="eyebrow">${t.eyebrow}</p><h2>${t.h2}</h2><p class="ways-intro">${t.intro}</p><div class="ways-grid"><article class="way-card"><h3>${t.w1h}</h3><p>${t.w1p}</p></article><article class="way-card"><h3>${t.w2h}</h3><p>${t.w2p}</p></article></div><div class="pay-block"><h3>${t.payh}</h3><p>${t.payintro}</p><ul><li>${t.li1}</li><li>${t.li2}</li><li>${t.li3}</li></ul></div><div class="care-note"><h3>${t.noteh}</h3><p>${t.notep}</p></div><div class="ways-actions">${t.links}</div></section>`;
  o = o.replace(faqAnchor, sec + faqAnchor);
  writeFileSync(of_, o);
  console.log("how-to-order section added:", lang);
}
console.log("done");
