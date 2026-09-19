// One-off: upgrade the rings category page (EN+BN) with keyword-bearing
// sections per the content guideline. Inserts after the catalog section.
import { readFileSync, writeFileSync } from "node:fs";

// ---------- EN ----------
const enF = "public_html/en/categories/rings/index.html";
let en = readFileSync(enF, "utf8");

en = en.replace("<title>Rings | eMarket247</title>", "<title>Rings in Bangladesh — Fashion &amp; Daily Wear | eMarket247</title>");
en = en.replace(
  /<meta name="description" content="[^"]*"/,
  '<meta name="description" content="Shop gold-tone rings in Bangladesh — simple daily-wear bands to statement cocktail designs. See product details and order easily on WhatsApp. Final price confirmed in chat.">'
);
en = en.replace(
  /<meta property="og:title" content="[^"]*"/,
  '<meta property="og:title" content="Rings in Bangladesh — Fashion &amp; Daily Wear | eMarket247">'
);

const enSections = `<section class="category-notes wrap"><div><p class="eyebrow">Rings for women &amp; men</p><h2>From Everyday Bands to New Statement Designs</h2><p>The rings collection moves between two moods: light daily-wear bands that sit quietly beside everything else, and fuller statement pieces — floral clusters, signet shapes, crossed bands — chosen for celebrations and photographs. Each product page lists the available design details so you can compare before deciding.</p><p><a class="text-link" href="/en/shop/">Browse all jewellery <span>→</span></a></p></div><div><p class="eyebrow">Rings as gifts</p><h2>A Ring Gift That Carries the Moment</h2><p>A ring is a small gift with a long memory — birthdays, anniversaries, and milestones. If you are choosing for someone else, note the design name from the product page and ask us on WhatsApp in Bangla or English; we will share what is available before you commit.</p><p><a class="text-link" href="/en/occasions/gifts/">See gift jewellery <span>→</span></a></p></div><div><p class="eyebrow">Before you order</p><h2>Clear Details, Confirmed on WhatsApp</h2><p>Prices for this category are shown as a range; the final price of a specific design is confirmed personally on WhatsApp. No account or online payment is needed to start — send the design name, and we will reply with availability and the current details of the piece.</p><p><a class="text-link" href="/en/how-to-order/">How ordering works <span>→</span></a></p></div></section>`;
const anchor = "</section></main>";
if (!en.includes(anchor)) { console.error("EN anchor missing"); process.exit(1); }
en = en.replace(anchor, "</section>" + enSections + "</main>");
writeFileSync(enF, en);
console.log("EN updated", en.length);

// ---------- BN ----------
const bnF = "public_html/bn/categories/rings/index.html";
let bn = readFileSync(bnF, "utf8");
const bnAnchor = "</section></main>";
const bnSections = `<section class="category-notes wrap"><div><p class="eyebrow">নারী ও পুরুষের আংটি</p><h2>প্রতিদিনের আংটি থেকে নতুন স্টেটমেন্ট ডিজাইন</h2><p>আংটির কালেকশনে দুটি ধরন রয়েছে — প্রতিদিন সহজে পরার মতো হালকা ব্যান্ড, আর উৎসব বা ছবির জন্য বেছে নেওয়া ফুল ক্লাস্টার, সিগনেট ও ক্রসড ব্যান্ডের মতো স্টেটমেন্ট ডিজাইন। প্রতিটি পণ্য পেজে ডিজাইনের বিবরণ দেওয়া থাকে, যাতে সিদ্ধান্তের আগে তুলনা করতে পারেন।</p><p><a class="text-link" href="/bn/shop/">সব গহনা দেখুন <span>→</span></a></p></div><div><p class="eyebrow">উপহার হিসেবে আংটি</p><h2>মুহূর্তটি বহন করবে আংটির উপহার</h2><p>আংটি ছোট একটি উপহার, কিন্তু স্মৃতি অনেক দিনের — জন্মদিন, বার্ষিকী কিংবা বিশেষ কোনো দিনে। অন্য কারও জন্য বেছে নিলে পণ্য পেজ থেকে ডিজাইনের নাম নোট করে হোয়াটসঅ্যাপে বাংলা বা ইংরেজিতে জিজ্ঞেস করুন; সিদ্ধান্তের আগেই প্রাপ্যতা জানিয়ে দেব।</p><p><a class="text-link" href="/bn/occasions/gifts/">উপহারের গহনা দেখুন <span>→</span></a></p></div><div><p class="eyebrow">অর্ডারের আগে</p><h2>পরিষ্কার বিবরণ, হোয়াটসঅ্যাপে নিশ্চিত</h2><p>এই ক্যাটাগরিতে দাম দেখানো হয় রেঞ্জ হিসেবে; নির্দিষ্ট ডিজাইনের চূড়ান্ত দাম হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করা হয়। শুরু করতে অ্যাকাউন্ট বা অনলাইন পেমেন্ট লাগে না — ডিজাইনের নাম পাঠান, আমরা প্রাপ্যতা ও বর্তমান বিবরণ জানিয়ে উত্তর দেব।</p><p><a class="text-link" href="/bn/how-to-order/">অর্ডারের নিয়ম <span>→</span></a></p></div></section>`;
if (!bn.includes(bnAnchor)) { console.error("BN anchor missing"); process.exit(1); }
bn = bn.replace(bnAnchor, "</section>" + bnSections + "</main>");
writeFileSync(bnF, bn);
console.log("BN updated", bn.length);
