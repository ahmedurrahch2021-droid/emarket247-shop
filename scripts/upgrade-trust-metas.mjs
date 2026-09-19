// One-off: upgrade trust-page metas (about, contact, privacy, terms) EN+BN.
// Titles gain the brand line; descriptions state the page's real job per the
// content guideline (140-160 chars, no invented claims).
import { readFileSync, writeFileSync } from "node:fs";

const M = {
  about: {
    en: {
      title: "About Us | eMarket247 — Jewellery Shop in Bangladesh",
      meta: "Learn about eMarket247, a family-run jewellery shop from Thakugaon offering gold-tone jewellery across Bangladesh with clear product details and WhatsApp ordering.",
      jsonld: "About Us | eMarket247 — Jewellery Shop in Bangladesh",
    },
    bn: {
      title: "আমাদের কথা | eMarket247 — বাংলাদেশের জুয়েলারি শপ",
      meta: "eMarket247 সম্পর্কে জানুন — ঠাকুরগাঁও থেকে পরিবারিক পরিচর্যায় গড়া জুয়েলারি শপ, পরিষ্কার পণ্যের বিবরণ ও হোয়াটসঅ্যাপে অর্ডারের সুবিধাসহ।",
      jsonld: "আমাদের কথা | eMarket247 — বাংলাদেশের জুয়েলারি শপ",
    },
  },
  contact: {
    en: {
      title: "Contact | eMarket247 — Ask Before You Order",
      meta: "Contact eMarket247 on WhatsApp at +880 1740-501062 in Bangla or English. Ask about any jewellery piece, availability or your order before you decide.",
      jsonld: "Contact | eMarket247 — Ask Before You Order",
    },
    bn: {
      title: "যোগাযোগ | eMarket247 — কেনার আগে জিজ্ঞেস করুন",
      meta: "হোয়াটসঅ্যাপে +880 1740-501062 নম্বরে বাংলা বা ইংরেজিতে eMarket247-এর সাথে কথা বলুন। সিদ্ধান্তের আগে যেকোনো গহনা, প্রাপ্যতা বা অর্ডার নিয়ে জিজ্ঞেস করুন।",
      jsonld: "যোগাযোগ | eMarket247 — কেনার আগে জিজ্ঞেস করুন",
    },
  },
  privacy: {
    en: {
      title: "Privacy | eMarket247 — How Your Information Is Handled",
      meta: "How eMarket247 handles your information: what is collected, why, and your choices — written plainly before any data collection goes live.",
      jsonld: "Privacy | eMarket247 — How Your Information Is Handled",
    },
    bn: {
      title: "গোপনীয়তা | eMarket247 — আপনার তথ্য যেভাবে ব্যবহৃত হয়",
      meta: "eMarket247 আপনার তথ্য কীভাবে ব্যবহার করে: কী সংগ্রহ করা হয়, কেন, এবং আপনার পছন্দ — তথ্য সংগ্রহ চালুর আগেই সহজ ভাষায় লেখা।",
      jsonld: "গোপনীয়তা | eMarket247 — আপনার তথ্য যেভাবে ব্যবহৃত হয়",
    },
  },
  terms: {
    en: {
      title: "Terms | eMarket247 — Understand Before You Purchase",
      meta: "The terms that apply to shopping with eMarket247 — ordering on WhatsApp, product information, and what happens next — written to be understood before purchase.",
      jsonld: "Terms | eMarket247 — Understand Before You Purchase",
    },
    bn: {
      title: "শর্তাবলি | eMarket247 — কেনার আগে জেনে নিন",
      meta: "eMarket247-এ কেনাকাটার শর্তাবলি — হোয়াটসঅ্যাপে অর্ডার, পণ্যের তথ্য ও পরবর্তী ধাপ — কেনার আগে যেন সহজে বোঝা যায় সেভাবে লেখা।",
      jsonld: "শর্তাবলি | eMarket247 — কেনার আগে জেনে নিন",
    },
  },
};

for (const [page, langs] of Object.entries(M)) {
  for (const [lang, v] of Object.entries(langs)) {
    const f = `public_html/${lang}/${page}/index.html`;
    let s = readFileSync(f, "utf8");
    s = s.replace(/<title>[^<]*<\/title>/, `<title>${v.title}</title>`);
    s = s.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${v.meta}"`);
    s = s.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${v.title}"`);
    s = s.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${v.meta}"`);
    // JSON-LD WebPage name (first "name" with the old title text)
    s = s.replace(/"name":"(About|Contact|Privacy|Terms)( \| eMarket247)?"/, `"name":"${v.jsonld}"`);
    writeFileSync(f, s);
    console.log("ok", f);
  }
}
