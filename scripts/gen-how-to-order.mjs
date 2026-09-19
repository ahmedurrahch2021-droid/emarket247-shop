// One-off generator: build /en/how-to-order/ and /bn/how-to-order/ from the
// care-page pattern. Same header/footer, new main content, corrected head.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- EN ----------
let en = readFileSync("public_html/en/care/index.html", "utf8");
en = en.replace(
  new RegExp('<meta name="description" content="[^"]*"'),
  '<meta name="description" content="Order City Gold jewellery from eMarket247 in three clear steps: choose your piece, confirm details on WhatsApp, and arrange delivery. No account or online payment needed.">'
);
en = en.replace("Care &amp; support | eMarket247</title>", "How to Order | eMarket247</title>");
en = en.replace(/https:\/\/emarket247\.shop\/en\/care\//g, "https://emarket247.shop/en/how-to-order/");
en = en.replace(/https:\/\/emarket247\.shop\/bn\/care\//g, "https://emarket247.shop/bn/how-to-order/");
en = en.replace(/"name":"Care &amp; support \| eMarket247"/g, '"name":"How to Order | eMarket247"');
en = en.replace(/"name":"Care"/g, '"name":"How to Order"');

const mainStart = en.indexOf('<main id="main">');
const mainEnd = en.indexOf("</main>") + 7;
const newMainEN = `<main id="main"><section class="page-hero wrap simple"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong></p><h1>Order jewellery in three clear steps.</h1><p>No account, no online payment. Every order is confirmed personally on WhatsApp before anything is arranged.</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="Gold jewellery editorial image" loading="lazy"><figcaption>How ordering works</figcaption></figure></section><section class="info-grid wrap"><article class="info-card"><span>✦</span><ol><li><b>01</b><p><strong>Choose your piece.</strong> Browse the shop, categories or occasion edits and note the product name of the piece you like.</p></li><li><b>02</b><p><strong>Confirm on WhatsApp.</strong> Send us the product name or photo. We reply with availability, the current details of the piece, and answer your questions in Bangla or English.</p></li><li><b>03</b><p><strong>Arrange delivery.</strong> Once you are happy with the details, we confirm the delivery arrangement for your area and complete the order together.</p></li></ol></article><article class="care-note"><p class="eyebrow">Good to know</p><h2>Clear details before you commit.</h2><p><strong class="brand-name">eMarket247</strong> shares product information before you decide — and please do not send payment details through chat until we have confirmed your order personally.</p><a class="button button-outline" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20order%20jewellery%20from%20eMarket247." target="_blank" rel="noopener noreferrer">Start an Order on WhatsApp <span>→</span></a></article></section></main>`;
en = en.slice(0, mainStart) + newMainEN + en.slice(mainEnd);
en = en.replace(/href="\/en\/care\/"/g, 'href="/en/how-to-order/"');

// ---------- BN ----------
let bn = readFileSync("public_html/bn/care/index.html", "utf8");
bn = bn.replace(/https:\/\/emarket247\.shop\/bn\/care\//g, "https://emarket247.shop/bn/how-to-order/");
bn = bn.replace(/https:\/\/emarket247\.shop\/en\/care\//g, "https://emarket247.shop/en/how-to-order/");
const bnMainStart = bn.indexOf('<main id="main">');
const bnMainEnd = bn.indexOf("</main>") + 7;
const newMainBN = `<main id="main"><section class="page-hero wrap simple"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong></p><h1>তিনটি সহজ ধাপে গহনা অর্ডার করুন।</h1><p>কোনো অ্যাকাউন্ট বা অনলাইন পেমেন্ট লাগে না। প্রতিটি অর্ডার হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করার পরেই পরবর্তী ধাপ এগোয়।</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="সোনালি গহনার এডিটোরিয়াল ছবি" loading="lazy"><figcaption>অর্ডারের ধাপগুলো</figcaption></figure></section><section class="info-grid wrap"><article class="info-card"><span>✦</span><ol><li><b>০১</b><p><strong>পছন্দের গহনা বেছে নিন।</strong> শপ, ক্যাটাগরি বা অনুষ্ঠানভিত্তিক কালেকশন দেখে পছন্দের পণ্যের নামটি নোট করুন।</p></li><li><b>০২</b><p><strong>হোয়াটসঅ্যাপে নিশ্চিত করুন।</strong> পণ্যের নাম বা ছবি আমাদের পাঠান। আমরা প্রাপ্যতা, পণ্যের বর্তমান বিবরণ জানিয়ে বাংলা বা ইংরেজিতে আপনার প্রশ্নের উত্তর দিই।</p></li><li><b>০৩</b><p><strong>ডেলিভারির ব্যবস্থা করুন।</strong> বিবরণে সন্তুষ্ট হলে আপনার এলাকার জন্য ডেলিভারির ব্যবস্থা নিশ্চিত করে অর্ডারটি সম্পন্ন করি।</p></li></ol></article><article class="care-note"><p class="eyebrow">জানা জরুরি</p><h2>সিদ্ধান্তের আগে পরিষ্কার তথ্য।</h2><p><strong class="brand-name">eMarket247</strong> সিদ্ধান্ত নেওয়ার আগেই পণ্যের তথ্য জানিয়ে দেয় — এবং অর্ডার ব্যক্তিগতভাবে নিশ্চিত না হওয়া পর্যন্ত চ্যাটে কোনো পেমেন্টের তথ্য পাঠাবেন না।</p><a class="button button-outline" href="https://wa.me/8801740501062?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20eMarket247%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%97%E0%A6%B9%E0%A6%A8%E0%A6%BE%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87" target="_blank" rel="noopener noreferrer">হোয়াটসঅ্যাপে অর্ডার শুরু করুন <span>→</span></a></article></section></main>`;
bn = bn.slice(0, bnMainStart) + newMainBN + bn.slice(bnMainEnd);
bn = bn.replace(/<title>[^<]*<\/title>/, "<title>কীভাবে অর্ডার করবেন | eMarket247</title>");
bn = bn.replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="তিন ধাপে eMarket247 থেকে City Gold গহনা অর্ডার করুন: পছন্দের গহনা বেছে নিন, হোয়াটসঅ্যাপে বিবরণ নিশ্চিত করুন, ডেলিভারির ব্যবস্থা করুন।">');
bn = bn.replace(/href="\/bn\/care\/"/g, 'href="/bn/how-to-order/"');

mkdirSync("public_html/en/how-to-order", { recursive: true });
mkdirSync("public_html/bn/how-to-order", { recursive: true });
writeFileSync("public_html/en/how-to-order/index.html", en);
writeFileSync("public_html/bn/how-to-order/index.html", bn);
console.log("written EN", en.length, "BN", bn.length);
