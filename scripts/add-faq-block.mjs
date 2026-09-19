// One-off: add FAQ block + FAQPage JSON-LD to the How to Order pages (EN+BN).
// Every answer is derived from copy already published on the site (how-to-order,
// contact, terms) — no new delivery/refund/COD claims are introduced.
import { readFileSync, writeFileSync } from "node:fs";

const FAQ = {
  en: {
    h2: "Frequently Asked Questions",
    qs: [
      ["Do I need an account to order?",
       "No. Browsing, asking about a piece, and ordering all work without an account or online payment. You can also create an account to keep orders and your wishlist in one place."],
      ["How do I order a piece?",
       "Note the design name from its product page and send it to us on WhatsApp in Bangla or English. We reply with availability, the current details, and the confirmed final price before you commit."],
      ["Why is the price shown as a range?",
       "Each category shows a price range; the final price of a specific design depends on its current details, so it is confirmed personally on WhatsApp before anything is arranged."],
      ["Can I ask questions before buying?",
       "Yes — that is exactly how ordering works here. Ask about any piece, its availability or your order on WhatsApp at +880 1740-501062, in Bangla or English, before you decide."],
      ["Is it safe to send payment details in chat?",
       "Please do not send payment details through chat until your order has been confirmed personally with us. We share all product information before you decide."],
    ],
  },
  bn: {
    h2: "সাধারণ জিজ্ঞাসা",
    qs: [
      ["অর্ডার করতে অ্যাকাউন্ট লাগবে?",
       "না। ব্রাউজ করা, গহনা সম্পর্কে জিজ্ঞেস করা বা অর্ডার করা — সবই অ্যাকাউন্ট বা অনলাইন পেমেন্ট ছাড়াই করা যায়। চাইলে অ্যাকাউন্ট খুলে অর্ডার ও উইশলিস্ট এক জায়গায় রাখতে পারেন।"],
      ["একটি গহনা কীভাবে অর্ডার করব?",
       "পণ্য পেজ থেকে ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে পাঠান। আমরা প্রাপ্যতা, বর্তমান বিবরণ ও নিশ্চিত চূড়ান্ত দাম জানিয়ে উত্তর দেব — সিদ্ধান্তের আগেই।"],
      ["দাম রেঞ্জ হিসেবে কেন দেখানো হয়?",
       "প্রতিটি ক্যাটাগরিতে দামের রেঞ্জ দেখানো হয়; নির্দিষ্ট ডিজাইনের চূড়ান্ত দাম তার বর্তমান বিবরণের ওপর নির্ভর করে, তাই সবকিছু ব্যবস্থা করার আগে হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করা হয়।"],
      ["কেনার আগে প্রশ্ন করা যাবে?",
       "অবশ্যই — এখানে অর্ডার এভাবেই শুরু হয়। +880 1740-501062 নম্বরে হোয়াটসঅ্যাপে যেকোনো গহনা, প্রাপ্যতা বা অর্ডার নিয়ে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন, সিদ্ধান্তের আগেই।"],
      ["চ্যাটে পেমেন্টের তথ্য পাঠানো নিরাপদ?",
       "অর্ডার ব্যক্তিগতভাবে নিশ্চিত না হওয়া পর্যন্ত চ্যাটে কোনো পেমেন্টের তথ্য পাঠাবেন না। সিদ্ধান্ত নেওয়ার আগেই আমরা পণ্যের সব তথ্য জানিয়ে দিই।"],
    ],
  },
};

const ld = (lang) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `https://emarket247.shop/${lang}/how-to-order/#faq`,
  inLanguage: lang,
  mainEntity: FAQ[lang].qs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

for (const lang of ["en", "bn"]) {
  const f = `public_html/${lang}/how-to-order/index.html`;
  let s = readFileSync(f, "utf8");
  if (s.includes("faq-section")) { console.log("skip (already present):", lang); continue; }
  const [h2, ...rest] = [FAQ[lang].h2, ...FAQ[lang].qs];
  const items = FAQ[lang].qs.map(([q, a]) =>
    `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("");
  const block = `<section class="faq-section wrap"><p class="eyebrow">${lang === "en" ? "Questions, answered" : "প্রশ্ন ও উত্তর"}</p><h2>${FAQ[lang].h2}</h2>${items}</section>`;
  const anchor = "</section></main>";
  if (!s.includes(anchor)) { console.error("anchor missing:", lang); continue; }
  s = s.replace(anchor, "</section>" + block + "</main>");
  s = s.replace("</script></head>", "," + ld(lang) + "</script></head>");
  writeFileSync(f, s);
  console.log("faq added:", f);
}
