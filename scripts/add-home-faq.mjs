// One-off: add a customer-intent FAQ section + FAQPage schema to the
// HOMEPAGE (EN+BN), placed right after the City Gold Guide section.
// AEO best practice: FAQPage markup on the page users land on.
// Answers use only verified metallurgy facts or eMarket247's published
// practice — no invented sourcing, warranty, or delivery claims.
import { readFileSync, writeFileSync } from "node:fs";

const FAQ = {
  en: [
    ["What is city gold jewellery?",
     "City gold is the everyday Bangladeshi name for gold-tone fashion jewellery: a base metal — usually brass or a similar alloy — shaped into the design and finished with a gold-coloured electroplated layer. It gives the look of gold at a small fraction of the price."],
    ["How is city gold made?",
     "Workshops cast or stamp the base-metal form, polish it smooth, clean it thoroughly, then immerse it in a plating bath where electric current deposits the gold-tone layer evenly over every surface. The technique descends from electroplating, patented in 1840 by the Elkington brothers of Birmingham."],
    ["Who makes city gold?",
     "It is made by jewellery workshops — in Bangladesh and across Asia — using the same electroplating process industrialised in 19th-century Birmingham. Quality varies by workshop: the base alloy, the plating thickness, and the finishing care all differ from maker to maker."],
    ["Is city gold real gold?",
     "The plating layer contains real gold-tone finish, but city gold is not solid gold — and it is not sold as gold by weight. That is why it costs a small fraction of the price. Reputable sellers state what a piece is made of rather than presenting it as solid gold."],
    ["Why does some city gold fade and some lasts for years?",
     "Two things decide it: plating thickness (thin plating wears through with daily friction) and the base alloy (metals that react with sweat and moisture cause discolouration from underneath). Solid, heavier pieces with even plating keep their look far longer."],
    ["Is city gold safe for sensitive skin?",
     "Most people wear it without any problem. If your skin reacts to certain metals, choose heavier solid-base pieces, keep the piece dry, and remove it before bathing — moisture against the base metal is what usually causes irritation or discolouration."],
    ["How should I care for city gold ornaments?",
     "Keep pieces away from water, perfume and sweat; wipe gently with a dry cloth after wearing; and store them separately so they do not scratch each other. The plating is a surface layer — care is what keeps it looking new."],
    ["How much does city gold cost compared to real gold?",
     "A city gold piece typically costs a tiny fraction of the same design in solid gold, because you are paying for the design and craft, not the metal weight. Prices are usually shown as a range, with the final price of a specific design confirmed before you order."],
  ],
  bn: [
    ["সিটি গোল্ড গহনা কী?",
     "সিটি গোল্ড বাংলাদেশে সোনালি রঙের ফ্যাশন গহনার পরিচিত নাম: বেস মেটাল — সাধারণত পিতল বা মিলে ধাতু — ডিজাইন অনুযায়ী গড়ে তার ওপর সোনালি রঙের ইলেক্ট্রোপ্লেটেড স্তর। সামান্য খরচে সোনার ভাব দেয়।"],
    ["সিটি গোল্ড কীভাবে তৈরি হয়?",
     "কারখানায় বেস মেটালের ফর্ম ঢালাই বা স্ট্যাম্প করা হয়, পালিশ ও পরিষ্কার করা হয়, তারপর প্লেটিং বাথে ডুবিয়ে বিদ্যুৎপ্রবাহে সোনালি স্তর প্রতিটি পৃষ্ঠে জমানো হয়। কৌশলটি ১৮৪০ সালে বার্মিংহামের এলকিংটন ভাইদের পেটেন্ট করা ইলেক্ট্রোপ্লেটিং থেকে এসেছে।"],
    ["সিটি গোল্ড কারা তৈরি করে?",
     "বাংলাদেশসহ এশিয়ার গহনা কারখানাগুলো একই ইলেক্ট্রোপ্লেটিং প্রক্রিয়ায় তৈরি করে, যা উনিশ শতকের বার্মিংহামে শিল্পে পরিণত হয়। কারখানাভেদে মান আলাদা — বেস অ্যালয়, প্রলেপের পুরুত্ব ও ফিনিশিংয়ের যত্ন নির্মাতাভেদে বদলায়।"],
    ["সিটি গোল্ড কি আসল সোনা?",
     "প্রলেপের স্তরে সোনালি ফিনিশ থাকে, কিন্তু সিটি গোল্ড খাঁটি সোনা নয় — এবং ওজন ধরে সোনা হিসেবেও বিক্রি হয় না। এ কারণেই এর দাম সোনার অল্প ভগ্নাংশ। সৎ বিক্রেতা পিসটি কী দিয়ে তৈরি সেটা স্পষ্ট বলেন, খাঁটি সোনা হিসেবে চালান না।"],
    ["কিছু সিটি গোল্ড রঙ হারায়, কিছু বছরের পর বছর টেকে কেন?",
     "দুটি বিষয় ঠিক করে দেয়: প্রলেপের পুরুত্ব (পাতলা প্রলেপ ঘর্ষণে উঠে যায়) এবং বেস অ্যালয় (ঘাম ও আর্দ্রতায় প্রতিক্রিয়াকারী ধাতু নিচ থেকে দাগ ফেলে)। শক্ত ও ভারী পিসে সমান প্রলেপ থাকলে সেটি অনেক দিন সৌন্দর্য ধরে রাখে।"],
    ["সংবেদনশীল চামড়ার জন্য সিটি গোল্ড নিরাপদ?",
     "বেশিরভাগ মানুষ সমস্যা ছাড়াই পরেন। নির্দিষ্ট ধাতুতে চামড়া প্রতিক্রিয়া করলে শক্ত ও ভারী বেসের পিস বেছে নিন, গহনা শুকনো রাখুন, আর গোসলের আগে খুলে রাখুন — বেস মেটালের সাথে আর্দ্রতাই সাধারণত জ্বালা বা দাগের কারণ।"],
    ["সিটি গোল্ড গহনার যত্ন কীভাবে নেব?",
     "পানি, পারফিউম ও ঘাম থেকে দূরে রাখুন; পরা শেষে শুকনো কাপড়ে আলতো মুছে নিন; আর একটার ওপর আরেকটা না ঘষে আলাদা করে রাখুন। প্রলেপ একটি পৃষ্ঠস্তর — যত্নই একে নতুনের মতো রাখে।"],
    ["আসল সোনার তুলনায় সিটি গোল্ডের দাম কেমন?",
     "একই ডিজাইনের খাঁটি সোনার গহনার তুলনায় সিটি গোল্ড সাধারণত অল্প ভগ্নাংশ দামে পাওয়া যায়, কারণ আপনি ধাতুর ওজন নয়, ডিজাইন ও কারুশিল্পের জন্য দাম দেন। দাম দেখানো হয় রেঞ্জ হিসেবে, নির্দিষ্ট ডিজাইনের চূড়ান্ত দাম অর্ডারের আগে নিশ্চিত করা হয়।"],
  ],
};

const heading = { en: "City Gold: Questions Buyers Ask", bn: "সিটি গোল্ড: ক্রেতাদের প্রশ্ন" };
const eyebrow = { en: "Before you buy", bn: "কেনার আগে" };

const ld = (lang) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `https://emarket247.shop/${lang}/#faq`,
  inLanguage: lang,
  mainEntity: FAQ[lang].map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

for (const lang of ["en", "bn"]) {
  const f = `public_html/${lang}/index.html`;
  let s = readFileSync(f, "utf8");
  if (s.includes("faq-section")) { console.log("skip (present):", lang); continue; }
  const items = FAQ[lang].map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("");
  const block = `<section class="faq-section wrap" id="faq"><p class="eyebrow">${eyebrow[lang]}</p><h2>${heading[lang]}</h2>${items}<p class="faq-more">${lang === "en" ? "Have a question about a specific design? Ask us on WhatsApp in Bangla or English — we reply with availability and current details before you decide." : "নির্দিষ্ট কোনো ডিজাইন নিয়ে প্রশ্ন আছে? হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন — সিদ্ধান্তের আগেই প্রাপ্যতা ও বর্তমান বিবরণ জানিয়ে দেব।"}</p></section>`;
  const anchor = '<section class="whatsapp-cta-section"';
  if (!s.includes(anchor)) { console.error("anchor missing:", lang); continue; }
  s = s.replace(anchor, block + anchor);
  // Merge FAQPage into the homepage's @graph
  const m = s.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  const graph = JSON.parse(m[1]);
  graph["@graph"].push(ld(lang));
  s = s.replace(m[1], JSON.stringify(graph));
  writeFileSync(f, s);
  console.log("homepage faq added:", f);
}
