/** Generates a qualitative, public-data keyword matrix; no search volume, CPC, or difficulty is fabricated. */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(import.meta.dirname, "BANGLADESH_PUBLIC_KEYWORD_MATRIX.csv");
const rows = [];
const add = (cluster, keyword, language, intent, page, priority, evidence) => rows.push({ cluster, keyword, language, intent, page, priority, evidence, metric_note: "Public-data research: exact monthly volume, CPC, and keyword difficulty not verified." });

const categories = [
  ["rings", "আংটি", "rings"], ["earrings", "কানের দুল", "earrings"], ["necklaces", "হার", "necklaces"], ["bracelets", "ব্রেসলেট", "bracelets"],
  ["bangles", "চুড়ি", "bangles"], ["pendants", "লকেট", "pendants"], ["jewellery sets", "জুয়েলারি সেট", "jewellery-sets"], ["gift jewellery", "উপহারের জুয়েলারি", "gift-jewellery"],
];

for (const [en, bn, slug] of categories) {
  [
    ["Bangladesh", "English", "Transactional", "High"], ["online Bangladesh", "English", "Transactional", "High"], ["shop Bangladesh", "English", "Commercial", "High"],
    ["for women Bangladesh", "English", "Commercial", "High"], ["new design Bangladesh", "English", "Commercial", "Medium"], ["gift Bangladesh", "English", "Commercial", "Medium"],
    ["অনলাইন", "Bengali", "Transactional", "High"], ["বাংলাদেশ", "Bengali", "Transactional", "High"], ["নতুন ডিজাইন", "Bengali", "Commercial", "Medium"], ["দাম বাংলাদেশ", "Bengali", "Commercial", "Medium"],
  ].forEach(([suffix, language, intent, priority]) => add("Product category discovery", `${language === "Bengali" ? bn : en} ${suffix}`, language, intent, `/en/categories/${slug}/`, priority, "Public Bangladesh jewelry category terminology and search-result language."));
}

const seasonal = [
  ["Puja jewellery Bangladesh", "English", "Commercial", "puja"], ["Puja earrings Bangladesh", "English", "Commercial", "puja"], ["Puja bangles Bangladesh", "English", "Commercial", "puja"], ["Puja necklace set Bangladesh", "English", "Commercial", "puja"],
  ["Durga Puja jewellery gift", "English", "Commercial", "puja"], ["Puja jewellery collection 2026", "English", "Commercial", "puja"], ["পূজার জুয়েলারি", "Bengali", "Commercial", "puja"], ["দুর্গা পূজা জুয়েলারি", "Bengali", "Commercial", "puja"],
  ["পূজার কানের দুল", "Bengali", "Commercial", "puja"], ["পূজার চুড়ি", "Bengali", "Commercial", "puja"], ["পূজার উপহার জুয়েলারি", "Bengali", "Commercial", "puja"], ["পূজা লুক জুয়েলারি", "Bengali", "Informational", "puja"],
  ["bridal jewellery Bangladesh", "English", "Commercial", "bridal"], ["wedding jewellery set Bangladesh", "English", "Transactional", "bridal"], ["বিয়ের জুয়েলারি", "Bengali", "Commercial", "bridal"], ["ব্রাইডাল জুয়েলারি সেট", "Bengali", "Commercial", "bridal"],
  ["anniversary jewellery gift Bangladesh", "English", "Commercial", "gifts"], ["birthday jewellery gift Bangladesh", "English", "Commercial", "gifts"], ["জন্মদিনের জুয়েলারি উপহার", "Bengali", "Commercial", "gifts"], ["উপহারের কানের দুল", "Bengali", "Commercial", "gifts"],
];
for (let i = 0; i < 3; i++) seasonal.forEach(([keyword, language, intent, page]) => add("Occasion and seasonal discovery", keyword, language, intent, `/en/occasions/${page}/`, i === 0 ? "High" : "Medium", "Public seasonal-query language and verified 2026 Puja calendar."));

const trust = [
  ["jewellery shop Bangladesh trusted", "English", "Commercial"], ["online jewellery delivery Bangladesh", "English", "Commercial"], ["jewellery return policy Bangladesh", "English", "Informational"], ["cash on delivery jewellery Bangladesh", "English", "Commercial"],
  ["jewellery payment Bangladesh", "English", "Commercial"], ["jewellery product details Bangladesh", "English", "Informational"], ["বিশ্বস্ত অনলাইন জুয়েলারি", "Bengali", "Commercial"], ["জুয়েলারি ক্যাশ অন ডেলিভারি", "Bengali", "Commercial"],
  ["জুয়েলারি ডেলিভারি বাংলাদেশ", "Bengali", "Commercial"], ["জুয়েলারি রিটার্ন পলিসি", "Bengali", "Informational"], ["অনলাইন জুয়েলারি নিরাপদ পেমেন্ট", "Bengali", "Informational"], ["জুয়েলারি সাইজ গাইড", "Bengali", "Informational"],
  ["how to buy jewellery online Bangladesh", "English", "Informational"], ["how to choose earrings Bangladesh", "English", "Informational"], ["জুয়েলারি কেনার আগে কি দেখবেন", "Bengali", "Informational"], ["কানের দুল কীভাবে বাছাই করবেন", "Bengali", "Informational"],
  ["jewellery customer support Bangladesh", "English", "Navigational"], ["জুয়েলারি কাস্টমার সাপোর্ট", "Bengali", "Navigational"], ["jewellery authenticity information", "English", "Informational"], ["জুয়েলারি পণ্যের তথ্য", "Bengali", "Informational"],
];
for (let i = 0; i < 3; i++) trust.forEach(([keyword, language, intent]) => add("Trust, policy, and purchase readiness", keyword, language, intent, "/en/care/", i === 0 ? "High" : "Medium", "Bangladesh eCommerce trust, COD, delivery, privacy, and support research."));

const style = [
  ["minimal jewellery Bangladesh", "English"], ["traditional jewellery Bangladesh", "English"], ["gold tone jewellery Bangladesh", "English"], ["pearl jewellery Bangladesh", "English"], ["statement earrings Bangladesh", "English"],
  ["everyday jewellery Bangladesh", "English"], ["jewellery for sari Bangladesh", "English"], ["jewellery for salwar kameez Bangladesh", "English"], ["office jewellery Bangladesh", "English"], ["party jewellery Bangladesh", "English"],
  ["মিনিমাল জুয়েলারি", "Bengali"], ["ঐতিহ্যবাহী জুয়েলারি", "Bengali"], ["পার্ল জুয়েলারি", "Bengali"], ["ঝুমকা কানের দুল", "Bengali"], ["শাড়ির সাথে জুয়েলারি", "Bengali"],
  ["সালওয়ার কামিজের সাথে জুয়েলারি", "Bengali"], ["অফিস জুয়েলারি", "Bengali"], ["পার্টি জুয়েলারি", "Bengali"], ["হালকা জুয়েলারি", "Bengali"], ["ফ্যাশন জুয়েলারি", "Bengali"],
];
for (let i = 0; i < 3; i++) style.forEach(([keyword, language]) => add("Style, look, and material exploration", keyword, language, "Commercial", "/en/editorial/style-guides/", i === 0 ? "High" : "Medium", "Local category and occasion merchandising language."));

const guides = [
  ["earrings style guide Bangladesh", "English"], ["ring size guide Bangladesh", "English"], ["how to care for jewellery", "English"], ["jewellery gift guide Bangladesh", "English"], ["Puja jewellery style guide", "English"],
  ["bridal jewellery guide Bangladesh", "English"], ["bangles vs bracelets Bangladesh", "English"], ["necklace length guide Bangladesh", "English"], ["jewellery trend Bangladesh 2026", "English"], ["how to layer necklaces", "English"],
  ["কানের দুল স্টাইল গাইড", "Bengali"], ["আংটির সাইজ গাইড", "Bengali"], ["জুয়েলারি কীভাবে যত্ন নেবেন", "Bengali"], ["জুয়েলারি গিফট গাইড", "Bengali"], ["পূজার জুয়েলারি গাইড", "Bengali"],
  ["ব্রাইডাল জুয়েলারি গাইড", "Bengali"], ["চুড়ি না ব্রেসলেট", "Bengali"], ["নেকলেস লেন্থ গাইড", "Bengali"], ["জুয়েলারি ট্রেন্ড বাংলাদেশ", "Bengali"], ["নেকলেস লেয়ারিং", "Bengali"],
];
for (let i = 0; i < 3; i++) guides.forEach(([keyword, language]) => add("Guides, FAQs, and answer-engine content", keyword, language, "Informational", "/en/guides/", i === 0 ? "High" : "Medium", "Search-intent expansion for visible educational content and FAQs."));

const matrixRows = rows.slice(0, 300);
if (matrixRows.length !== 300) throw new Error(`Expected 300 rows, received ${matrixRows.length}`);
const columns = Object.keys(matrixRows[0]);
const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
await writeFile(output, `${columns.join(',')}\n${matrixRows.map((row) => columns.map((column) => quote(row[column])).join(',')).join('\n')}\n`, "utf8");
console.log(`Generated ${matrixRows.length} public-data keyword candidates at ${output}`);
