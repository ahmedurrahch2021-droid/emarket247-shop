// One-off: upgrade the remaining 7 category pages (EN+BN) with keyword-led
// sections, mirroring the rings upgrade. Data-driven from the keyword matrix
// cluster pattern: [category] Bangladesh / online / for women / new design /
// gift (+ Bengali variants).
import { readFileSync, writeFileSync } from "node:fs";

const C = {
  earrings: {
    enTitle: "Earrings in Bangladesh — Studs, Drops &amp; Jhumkas | eMarket247",
    enMeta: "Shop earrings in Bangladesh — studs, drops, jhumkas and hoops in gold-tone finishes. See design details before you order. Final price confirmed on WhatsApp.",
    enH2a: "From Daily Studs to New Drop &amp; Jhumka Designs",
    enPa: "The earrings collection spans quiet everyday studs, slender drops and fuller jhumka-inspired pieces. Lighter designs carry a workday; statement pairs carry Eid evenings and wedding functions. Each product page lists the available design details so you can compare pairs before deciding.",
    enH2b: "Earrings That Gift Easily",
    enPb: "Earrings are the easiest jewellery gift to get right — small, personal and worn often. For birthdays and milestones, note the design name from the product page and ask us on WhatsApp in Bangla or English; we confirm availability before you commit.",
    bnTitle: "কানের দুল — বাংলাদেশে স্টাড, ড্রপ ও ঝুমকা | eMarket247",
    bnMeta: "বাংলাদেশে কানের দুল কিনুন — স্টাড, ড্রপ, ঝুমকা ও হুপস, সোনালি ফিনিশে। অর্ডারের আগে ডিজাইনের বিবরণ দেখুন। চূড়ান্ত দাম হোয়াটসঅ্যাপে নিশ্চিত।",
    bnH2a: "প্রতিদিনের স্টাড থেকে নতুন ড্রপ ও ঝুমকা ডিজাইন",
    bnPa: "কানের দুলের কালেকশনে রয়েছে প্রতিদিনের হালকা স্টাড, সরু ড্রপ আর ঝুমকা-অনুপ্রাণিত বড় ডিজাইন। হালকা জোড়া অফিসের দিনে, স্টেটমেন্ট জোড়া ঈদের সন্ধ্যা বা বিয়ের অনুষ্ঠানে। প্রতিটি পণ্য পেজে ডিজাইনের বিবরণ দেওয়া আছে, যাতে কেনার আগে তুলনা করতে পারেন।",
    bnH2b: "উপহার দিতে সবচেয়ে সহজ — কানের দুল",
    bnPb: "কানের দুল উপহার হিসেবে সবচেয়ে নিরাপদ পছন্দ — ছোট, ব্যক্তিগত আর প্রতিদিনই ব্যবহার হয়। জন্মদিন বা বিশেষ দিনের জন্য পণ্য পেজ থেকে ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন; সিদ্ধান্তের আগেই প্রাপ্যতা জানিয়ে দেব।",
  },
  bangles: {
    enTitle: "Gold-Tone Bangles in Bangladesh — Churi Sets &amp; Pairs | eMarket247",
    enMeta: "Shop gold-tone bangles (churi) in Bangladesh — open engraved pieces to ornate pairs for festive and daily wear. See details and order easily on WhatsApp.",
    enH2a: "Everyday Churi to Festive Bangle Sets",
    enPa: "Bangles carry the wrist of every celebration. The collection runs from slim daily-wear churi to open engraved and ornate festival pairs that stack into a fuller set. Design details on each product page make it simple to plan a set before ordering.",
    enH2b: "Bangle Sets as Occasion Gifts",
    enPb: "A pair of bangles is a traditional gift for weddings, Eid and Puja season. If you are choosing a set for someone, note the design names and ask on WhatsApp in Bangla or English — we share availability and current details before you decide.",
    bnTitle: "সোনালি চুড়ি — বাংলাদেশে চুড়ি সেট ও জোড়া | eMarket247",
    bnMeta: "বাংলাদেশে সোনালি চুড়ি কিনুন — খোলা নকশা থেকে অলংকৃত জোড়া, উৎসব ও প্রতিদিনের জন্য। বিবরণ দেখুন ও হোয়াটসঅ্যাপে সহজে অর্ডার করুন।",
    bnH2a: "প্রতিদিনের চুড়ি থেকে উৎসবের চুড়ি সেট",
    bnPa: "প্রতিটি উৎসবে হাতের সাজ সম্পূর্ণ করে চুড়ি। কালেকশনে প্রতিদিন পরার সরু চুড়ি থেকে খোলা নকশা ও অলংকৃত উৎসবের জোড়া — একসাথে সাজিয়ে বড় সেট বানানো যায়। পণ্য পেজের ডিজাইন বিবরণ দেখে অর্ডারের আগেই সেট পরিকল্পনা করুন।",
    bnH2b: "অনুষ্ঠানের উপহার হিসেবে চুড়ি সেট",
    bnPb: "চুড়ির জোড়া বিয়ে, ঈদ ও পূজার মৌসুমের চিরাচরিত উপহার। কারও জন্য সেট বেছে নিলে ডিজাইনের নামগুলো নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন — সিদ্ধান্তের আগেই প্রাপ্যতা ও বর্তমান বিবরণ জানিয়ে দেব।",
  },
  necklaces: {
    enTitle: "Necklaces &amp; Chains in Bangladesh — Everyday to Statement | eMarket247",
    enMeta: "Shop necklaces and chains in Bangladesh — charm chains to statement drops in gold-tone finishes. See design details and order easily on WhatsApp.",
    enH2a: "Light Chains to Statement Necklaces",
    enPa: "Necklaces set the line of an outfit. Charm-chain and station designs stay light for workdays; dangling-bead and statement pieces rise to weddings, Eid evenings and Puja. Each product page carries the design's details so you can match the piece to the occasion.",
    enH2b: "Necklaces for Gifting &amp; Milestones",
    enPb: "A necklace is the centrepiece of a jewellery gift. For anniversaries and celebrations, pick a design, note its name from the product page, and ask us on WhatsApp in Bangla or English — availability and current details are confirmed before you commit.",
    bnTitle: "হার ও চেইন — বাংলাদেশে প্রতিদিন থেকে স্টেটমেন্ট | eMarket247",
    bnMeta: "বাংলাদেশে হার ও চেইন কিনুন — চার্ম চেইন থেকে স্টেটমেন্ট ড্রপ, সোনালি ফিনিশে। ডিজাইনের বিবরণ দেখুন ও হোয়াটসঅ্যাপে সহজে অর্ডার করুন।",
    bnH2a: "হালকা চেইন থেকে স্টেটমেন্ট হার",
    bnPa: "পোশাকের লাইন ঠিক করে হার। চার্ম-চেইন ও স্টেশন ডিজাইন অফিসের দিনে হালকা থাকে; ড্যাংলিং-বিড ও স্টেটমেন্ট পিস বিয়ে, ঈদের সন্ধ্যা ও পূজায় উঠে আসে। পণ্য পেজে ডিজাইনের বিবরণ থাকে, যাতে অনুষ্ঠান অনুযায়ী পিস মেলাতে পারেন।",
    bnH2b: "উপহার ও মাইলফলকের জন্য হার",
    bnPb: "গহনার উপহারের কেন্দ্রবিন্দু হার। বার্ষিকী ও উৎসবের জন্য ডিজাইন বেছে পণ্য পেজ থেকে নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন — সিদ্ধান্তের আগেই প্রাপ্যতা ও বিবরণ নিশ্চিত করা হয়।",
  },
  bracelets: {
    enTitle: "Bracelets &amp; Kadas in Bangladesh — Daily Wear Styles | eMarket247",
    enMeta: "Shop bracelets and kadas in Bangladesh — braided links to solid bangle-style kadas in gold-tone finishes. See details and order easily on WhatsApp.",
    enH2a: "Braided, Linked &amp; Solid Kada Styles",
    enPa: "Bracelets sit between a ring's quietness and a bangle's presence. Braided link-chain designs move easily through a workday; wider kada shapes carry more weight at festivals and functions. The design details on each product page help you match the piece to how it will be worn.",
    enH2b: "A Bracelet Gift That Wears Every Day",
    enPb: "Bracelets are a practical gift — worn daily, sized generously, easy to style. For birthdays and thank-you gifts, note the design name from the product page and ask on WhatsApp in Bangla or English; availability is confirmed before you decide.",
    bnTitle: "ব্রেসলেট ও কড়া — বাংলাদেশে প্রতিদিনের স্টাইল | eMarket247",
    bnMeta: "বাংলাদেশে ব্রেসলেট ও কড়া কিনুন — ব্রেইডেড লিংক থেকে চওড়া কড়া, সোনালি ফিনিশে। বিবরণ দেখুন ও হোয়াটসঅ্যাপে সহজে অর্ডার করুন।",
    bnH2a: "ব্রেইডেড, লিংক ও শক্ত কড়া স্টাইল",
    bnPa: "ব্রেসলেট আংটির নীরবতা আর চুড়ির উপস্থিতির মাঝামাঝি। ব্রেইডেড লিংক-চেইন ডিজাইন অফিসের দিনে সহজে মানায়; চওড়া কড়া উৎসব ও অনুষ্ঠানে বেশি ভার বহন করে। পণ্য পেজের ডিজাইন বিবরণ দেখে ব্যবহার অনুযায়ী পিস বেছে নিন।",
    bnH2b: "প্রতিদিন ব্যবহারের উপহার — ব্রেসলেট",
    bnPb: "ব্রেসলেট ব্যবহারিক উপহার — প্রতিদিন পরা যায়, সাইজে নমনীয়, স্টাইলে সহজ। জন্মদিন বা কৃতজ্ঞতার উপহারে পণ্য পেজ থেকে ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন; সিদ্ধান্তের আগেই প্রাপ্যতা নিশ্চিত করা হয়।",
  },
  pendants: {
    enTitle: "Pendants &amp; Lockets in Bangladesh — Delicate Designs | eMarket247",
    enMeta: "Shop pendants and lockets in Bangladesh — teardrops to detailed motifs on fine chains, gold-tone finishes. See details and order easily on WhatsApp.",
    enH2a: "Teardrops, Motifs &amp; Locket Designs",
    enPa: "Pendants concentrate a whole look into one small piece. Teardrop and floral motifs stay delicate on fine chains; detailed lockets carry a keepsake feeling. Each product page describes the pendant and its chain so you know exactly what arrives.",
    enH2b: "A Personal Gift Close to the Heart",
    enPb: "Pendants sit close to the heart — which is why they are a favourite personal gift. Note the design name from the product page and ask us on WhatsApp in Bangla or English; we confirm availability and the current details before you commit.",
    bnTitle: "লকেট ও পেন্ডেন্ট — বাংলাদেশে সূক্ষ্ম ডিজাইন | eMarket247",
    bnMeta: "বাংলাদেশে লকেট ও পেন্ডেন্ট কিনুন — টিয়ারড্রপ থেকে নকশা খোদাই, সূক্ষ্ম চেইনে, সোনালি ফিনিশে। বিবরণ দেখুন ও হোয়াটসঅ্যাপে অর্ডার করুন।",
    bnH2a: "টিয়ারড্রপ, মোটিফ ও লকেট ডিজাইন",
    bnPa: "একটি ছোট পিসেই পুরো লুক ধরে রাখে পেন্ডেন্ট। টিয়ারড্রপ ও ফ্লোরাল মোটিফ সূক্ষ্ম চেইনে নাজাকত বহন করে; খোদাই-করা লকেট বহন করে স্মৃতির অনুভূতি। পণ্য পেজে পেন্ডেন্ট ও চেইনের বিবরণ থাকে — কী আসবে তা আগেই জানবেন।",
    bnH2b: "বুকের কাছের ব্যক্তিগত উপহার",
    bnPb: "পেন্ডেন্ট বুকের কাছে বসে — তাই এটি ব্যক্তিগত উপহারের প্রিয় পছন্দ। পণ্য পেজ থেকে ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন; সিদ্ধান্তের আগেই প্রাপ্যতা ও বর্তমান বিবরণ নিশ্চিত করা হয়।",
  },
  "jewellery-sets": {
    enTitle: "Jewellery Sets in Bangladesh — Complete the Look | eMarket247",
    enMeta: "Shop coordinated jewellery sets in Bangladesh — necklace, earrings and bangles designed to wear together. See set details and order easily on WhatsApp.",
    enH2a: "Coordinated Sets That Complete the Outfit",
    enPa: "A set removes the guessing: necklace, earrings and bangles designed to sit together in colour, weight and style. Circle-motif and floral sets serve weddings and functions; lighter pairings carry festive days. Each product page lists what the set includes.",
    enH2b: "Sets for Weddings &amp; Special Days",
    enPb: "For a trousseau or a milestone celebration, a set is the traditional choice. Note the set name from the product page and ask on WhatsApp in Bangla or English — we confirm the pieces included, availability and current details before you decide.",
    bnTitle: "জুয়েলারি সেট — বাংলাদেশে সম্পূর্ণ সাজ | eMarket247",
    bnMeta: "বাংলাদেশে জুয়েলারি সেট কিনুন — হার, কানের দুল ও চুড়ি একসাথে পরার জন্য ডিজাইন। সেটের বিবরণ দেখুন ও হোয়াটসঅ্যাপে অর্ডার করুন।",
    bnH2a: "পোশাক সম্পূর্ণ করে সমন্বিত সেট",
    bnPa: "সেট দূর করে অনুমানের কাজ: হার, কানের দুল ও চুড়ি রঙ, ওজন ও স্টাইলে একসাথে বসার জন্য ডিজাইন। সার্কেল-মোটিফ ও ফ্লোরাল সেট বিয়ে ও অনুষ্ঠানের জন্য; হালকা সমন্বয় উৎসবের দিন বহন করে। পণ্য পেজে সেটে যা আছে তার তালিকা থাকে।",
    bnH2b: "বিয়ে ও বিশেষ দিনের জন্য সেট",
    bnPb: "বিয়ের সাজ বা মাইলফলক উদযাপনে সেটই চিরাচরিত পছন্দ। পণ্য পেজ থেকে সেটের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন — সিদ্ধান্তের আগেই সেটের পিস, প্রাপ্যতা ও বিবরণ নিশ্চিত করা হয়।",
  },
  "gift-jewellery": {
    enTitle: "Gift Jewellery in Bangladesh — For Every Occasion | eMarket247",
    enMeta: "Find gift jewellery in Bangladesh — rings, earrings, sets and keepsakes chosen for birthdays, anniversaries and celebrations. Order easily on WhatsApp.",
    enH2a: "Gifts Chosen by Occasion",
    enPa: "Some pieces gift more easily than others: rings for commitments, earrings for birthdays, pendants for personal milestones, sets for weddings. This collection gathers the designs our catalogue suggests for giving — with the design details visible on every product page before you choose.",
    enH2b: "Help Choosing, Before You Buy",
    enPb: "Unsure which piece suits the person or the moment? Note one or two design names and ask on WhatsApp in Bangla or English. We confirm availability and share the current details — no account or online payment needed to ask.",
    bnTitle: "উপহারের জুয়েলারি — প্রতিটি অনুষ্ঠানের জন্য | eMarket247",
    bnMeta: "বাংলাদেশে উপহারের জুয়েলারি খুঁজুন — জন্মদিন, বার্ষিকী ও উদযাপনের জন্য আংটি, কানের দুল, সেট ও কিপসেক। হোয়াটসঅ্যাপে সহজে অর্ডার করুন।",
    bnH2a: "অনুষ্ঠান অনুযায়ী উপহার",
    bnPa: "কিছু পিস উপহার হিসেবে সহজেই মানায়: প্রতিশ্রুতির জন্য আংটি, জন্মদিনে কানের দুল, ব্যক্তিগত মাইলফলকে পেন্ডেন্ট, বিয়েতে সেট। এই কালেকশনে ক্যাটালগ অনুযায়ী উপহার-উপযোগী ডিজাইনগুলো একসাথে — প্রতিটি পণ্য পেজে বিবরণ দেখেই বেছে নিন।",
    bnH2b: "কেনার আগে বেছে নিতে সহায়তা",
    bnPb: "কোন পিস মানুষটি বা মুহূর্তটির সাথে মানাবে নিশ্চিত নন? এক-দুটি ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন। প্রাপ্যতা নিশ্চিত করে বর্তমান বিবরণ জানিয়ে দেব — জিজ্ঞেস করতে অ্যাকাউন্ট বা অনলাইন পেমেন্ট লাগে না।",
  },
};

const section = (lang, c) => {
  const L = lang === "en" ? "/en/" : "/bn/";
  const browse = lang === "en" ? "Browse all jewellery" : "সব গহনা দেখুন";
  const giftLink = lang === "en" ? "See gift jewellery" : "উপহারের গহনা দেখুন";
  const order = lang === "en" ? "How ordering works" : "অর্ডারের নিয়ম";
  const giftPath = c === "gift-jewellery" ? `${L}occasions/gifts/` : `${L}categories/gift-jewellery/`;
  const ebA = lang === "en" ? "The collection" : "কালেকশন";
  const ebB = lang === "en" ? "Gifting" : "উপহার";
  const ebC = lang === "en" ? "Before you order" : "অর্ডারের আগে";
  return `<section class="category-notes wrap"><div><p class="eyebrow">${ebA}</p><h2>${c.enH2a ? "" : ""}${lang === "en" ? c.enH2a : c.bnH2a}</h2><p>${lang === "en" ? c.enPa : c.bnPa}</p><p><a class="text-link" href="${L}shop/">${browse} <span>→</span></a></p></div><div><p class="eyebrow">${ebB}</p><h2>${lang === "en" ? c.enH2b : c.bnH2b}</h2><p>${lang === "en" ? c.enPb : c.bnPb}</p><p><a class="text-link" href="${giftPath}">${giftLink} <span>→</span></a></p></div><div><p class="eyebrow">${ebC}</p><h2>${lang === "en" ? "Clear Details, Confirmed on WhatsApp" : "পরিষ্কার বিবরণ, হোয়াটসঅ্যাপে নিশ্চিত"}</h2><p>${lang === "en"
    ? "Prices for this category are shown as a range; the final price of a specific design is confirmed personally on WhatsApp. No account or online payment is needed to start — send the design name, and we will reply with availability and the current details of the piece."
    : "এই ক্যাটাগরিতে দাম দেখানো হয় রেঞ্জ হিসেবে; নির্দিষ্ট ডিজাইনের চূড়ান্ত দাম হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করা হয়। শুরু করতে অ্যাকাউন্ট বা অনলাইন পেমেন্ট লাগে না — ডিজাইনের নাম পাঠান, আমরা প্রাপ্যতা ও বর্তমান বিবরণ জানিয়ে উত্তর দেব।"}</p><p><a class="text-link" href="${L}how-to-order/">${order} <span>→</span></a></p></div></section>`;
};

let done = 0;
for (const [slug, c] of Object.entries(C)) {
  // EN
  const enF = `public_html/en/categories/${slug}/index.html`;
  let en = readFileSync(enF, "utf8");
  const enTitleOld = en.match(/<title>[^<]*<\/title>/)[0];
  en = en.replace(enTitleOld, `<title>${c.enTitle}</title>`);
  en = en.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${c.enMeta}"`);
  en = en.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${c.enTitle}"`);
  const anchor = "</section></main>";
  if (!en.includes(anchor)) { console.error("EN anchor missing:", slug); continue; }
  if (en.includes("category-notes")) { console.log("skip EN (already upgraded):", slug); }
  else {
    en = en.replace(anchor, "</section>" + section("en", c) + "</main>");
    writeFileSync(enF, en);
    done++;
  }
  // BN
  const bnF = `public_html/bn/categories/${slug}/index.html`;
  let bn = readFileSync(bnF, "utf8");
  const bnTitleOld = bn.match(/<title>[^<]*<\/title>/)[0];
  bn = bn.replace(bnTitleOld, `<title>${c.bnTitle}</title>`);
  bn = bn.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${c.bnMeta}"`);
  bn = bn.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${c.bnTitle}"`);
  if (!bn.includes(anchor)) { console.error("BN anchor missing:", slug); continue; }
  if (bn.includes("category-notes")) { console.log("skip BN (already upgraded):", slug); }
  else {
    bn = bn.replace(anchor, "</section>" + section("bn", c) + "</main>");
    writeFileSync(bnF, bn);
    done++;
  }
  console.log("upgraded:", slug);
}
console.log("total file writes:", done);
