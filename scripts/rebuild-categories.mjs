// One-off: rebuild the categories index pages (EN + BN).
// Replaces the staging-era page-hero (with its "information in preparation"
// caption) and the bare text-link list with: a slim H1 hero, a nine-tile
// image grid reusing the homepage's category-tile markup, a merged
// "how to choose" editorial block, and a bottom CTA. Anchored on ASCII.
import { readFileSync, writeFileSync } from "node:fs";

const P = "public_html";

const EN = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> Categories</p>
  <h1>Jewellery Categories</h1>
  <p>Find your preferred jewellery in one place — earrings, bangles, bracelets, necklaces, pendants, rings and jewellery sets, arranged by your style, outfit and occasion.</p>
</div></section>
<section class="category-section wrap" aria-label="All jewellery categories">
  <div class="category-grid category-product-grid">
    <a href="/en/categories/earrings/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-pearl-style-gold-tone-set-06.webp" alt="eMarket247 earrings category — pearl-style gold-tone earrings" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Earrings</h3><small>কানের দুল <b>↗</b></small></div><p class="category-desc">From subtle everyday pairs to statement styles for celebrations.</p></div></a>
    <a href="/en/categories/bangles/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-bangles-08.webp" alt="eMarket247 bangles category — gold-tone bangles" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Bangles</h3><small>চুড়ি <b>↗</b></small></div><p class="category-desc">Classic and contemporary bangles to complete your look.</p></div></a>
    <a href="/en/categories/bracelets/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-braided-link-chain-bracelet.webp" alt="eMarket247 bracelets category — braided link-chain bracelet" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Bracelets</h3><small>ব্রেসলেট <b>↗</b></small></div><p class="category-desc">Easy-to-style pieces for everyday wear and special moments.</p></div></a>
    <a href="/en/categories/necklaces/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-floral-gold-tone-necklace-04.webp" alt="eMarket247 necklaces category — floral gold-tone necklace" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Necklaces</h3><small>হার <b>↗</b></small></div><p class="category-desc">From simple everyday designs to expressive occasion looks.</p></div></a>
    <a href="/en/categories/pendants/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-teardrop-set-05.webp" alt="eMarket247 pendants category — gold-tone teardrop pendant" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Pendants</h3><small>লকেট <b>↗</b></small></div><p class="category-desc">Small details that make a personal statement.</p></div></a>
    <a href="/en/categories/rings/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-cross-band-ring-10.webp" alt="eMarket247 rings category — gold-tone cross band ring" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Rings</h3><small>আংটি <b>↗</b></small></div><p class="category-desc">Versatile rings for everyday styling, gifting and occasions.</p></div></a>
    <a href="/en/categories/jewellery-sets/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-circle-jewellery-set-07.webp" alt="eMarket247 jewellery sets category — gold-tone circle jewellery set" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Jewellery Sets</h3><small>জুয়েলারি সেট <b>↗</b></small></div><p class="category-desc">Coordinated pieces for a complete and polished look.</p></div></a>
    <a href="/en/categories/bridal-jewellery/" class="category-tile has-media"><figure><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" alt="eMarket247 bridal jewellery category — bridal styling" width="1664" height="2080" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Bridal Jewellery</h3><small>ব্রাইডাল <b>↗</b></small></div><p class="category-desc">Jewellery chosen to work with your bridal look, outfit and the whole picture.</p></div></a>
    <a href="/en/categories/gift-jewellery/" class="category-tile has-media"><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" alt="eMarket247 gift jewellery category — gifting moments" width="2304" height="1536" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>Gift Jewellery</h3><small>উপহার <b>↗</b></small></div><p class="category-desc">Thoughtful choices for birthdays, anniversaries and special moments.</p></div></a>
  </div>
</section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">Choosing well</p>
  <h2>How to Choose the Right Jewellery</h2>
  <p>Design is only part of the decision — <strong>where you'll wear it, which outfit it pairs with, and your own style</strong> matter just as much. Simple, understated designs suit everyday wear; more eye-catching pieces come into their own at celebrations and festivals. For each product, look at the <strong>materials, finish, measurements and other details provided</strong> before deciding.</p>
  <p>Jewellery is also an expression of personal preference. Alongside following trends, choose designs you will genuinely feel comfortable wearing.</p>
  <p><strong>Start from the category you like best.</strong></p>
  <p><a class="button button-dark" href="/en/shop/">Shop All Jewellery <span>→</span></a></p>
</div></section>`;

const BN = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> ক্যাটাগরি</p>
  <h1>জুয়েলারির ক্যাটাগরি</h1>
  <p>আপনার পছন্দের জুয়েলারি এক জায়গায় খুঁজে নিন — কানের দুল, চুড়ি, ব্রেসলেট, হার, পেনডেন্ট, আংটি কিংবা জুয়েলারি সেট—আপনার স্টাইল, পোশাক ও উপলক্ষ অনুযায়ী পছন্দের গহনা সহজেই খুঁজে দেখুন।</p>
</div></section>
<section class="category-section wrap" aria-label="সব জুয়েলারি ক্যাটাগরি">
  <div class="category-grid category-product-grid">
    <a href="/bn/categories/earrings/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-pearl-style-gold-tone-set-06.webp" alt="eMarket247 কানের দুল ক্যাটাগরি — পার্ল-স্টাইল গোল্ড-টোন দুল" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>কানের দুল</h3><small>Earrings <b>↗</b></small></div><p class="category-desc">ছোট ও সিম্পল ডিজাইন থেকে শুরু করে বিশেষ অনুষ্ঠানের জন্য নজরকাড়া স্টাইল—আপনার সাজের সঙ্গে মানানসই কানের দুল খুঁজে নিন।</p></div></a>
    <a href="/bn/categories/bangles/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-bangles-08.webp" alt="eMarket247 চুড়ি ক্যাটাগরি — গোল্ড-টোন চুড়ি" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>চুড়ি</h3><small>Bangles <b>↗</b></small></div><p class="category-desc">ঐতিহ্যবাহী সাজ থেকে আধুনিক লুক—বিভিন্ন পোশাক ও উপলক্ষের সঙ্গে মিলিয়ে চুড়ি বেছে নিন।</p></div></a>
    <a href="/bn/categories/bracelets/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-braided-link-chain-bracelet.webp" alt="eMarket247 ব্রেসলেট ক্যাটাগরি — ব্রেইডেড লিংক-চেইন ব্রেসলেট" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>ব্রেসলেট</h3><small>Bracelets <b>↗</b></small></div><p class="category-desc">হাতে একটি পরিমিত গহনা যোগ করতে চাইলে ব্রেসলেট হতে পারে সহজ একটি পছন্দ। প্রতিদিনের সাজ ও বিশেষ মুহূর্তের জন্য বিভিন্ন স্টাইল দেখুন।</p></div></a>
    <a href="/bn/categories/necklaces/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-floral-gold-tone-necklace-04.webp" alt="eMarket247 হার ক্যাটাগরি — ফ্লোরাল গোল্ড-টোন হার" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>হার ও নেকলেস</h3><small>Necklaces <b>↗</b></small></div><p class="category-desc">সিম্পল লুক থেকে উৎসব বা অনুষ্ঠানের সাজ—পোশাকের সঙ্গে মানানসই হার ও নেকলেসের বিভিন্ন ডিজাইন খুঁজে দেখুন।</p></div></a>
    <a href="/bn/categories/pendants/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-teardrop-set-05.webp" alt="eMarket247 লকেট ক্যাটাগরি — গোল্ড-টোন টিয়ারড্রপ লকেট" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>পেনডেন্ট</h3><small>Pendants <b>↗</b></small></div><p class="category-desc">ছোট একটি পেনডেন্টও আপনার সাজে আলাদা একটি ব্যক্তিগত ছোঁয়া যোগ করতে পারে। বিভিন্ন ডিজাইন থেকে আপনার পছন্দেরটি খুঁজে নিন।</p></div></a>
    <a href="/bn/categories/rings/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-cross-band-ring-10.webp" alt="eMarket247 আংটি ক্যাটাগরি — গোল্ড-টোন ক্রস ব্যান্ড আংটি" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>আংটি</h3><small>Rings <b>↗</b></small></div><p class="category-desc">প্রতিদিনের ব্যবহার, বিশেষ উপলক্ষ বা উপহারের জন্য বিভিন্ন ধরনের আংটির ডিজাইন দেখুন।</p></div></a>
    <a href="/bn/categories/jewellery-sets/" class="category-tile has-media"><figure><img src="/assets/images/products/emarket247-gold-tone-circle-jewellery-set-07.webp" alt="eMarket247 জুয়েলারি সেট ক্যাটাগরি — গোল্ড-টোন সার্কেল জুয়েলারি সেট" width="1350" height="1800" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>জুয়েলারি সেট</h3><small>Jewellery Sets <b>↗</b></small></div><p class="category-desc">একসঙ্গে মিলিয়ে নেওয়া গহনা দিয়ে সম্পূর্ণ লুক তৈরি করতে চাইলে জুয়েলারি সেট দেখতে পারেন।</p></div></a>
    <a href="/bn/categories/bridal-jewellery/" class="category-tile has-media"><figure><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" alt="eMarket247 ব্রাইডাল জুয়েলারি ক্যাটাগরি — ব্রাইডাল স্টাইলিং" width="1664" height="2080" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>ব্রাইডাল জুয়েলারি</h3><small>Bridal <b>↗</b></small></div><p class="category-desc">বিয়ে ও বিশেষ অনুষ্ঠানের সাজে গহনা বাছাই করার সময় ডিজাইন, পোশাক ও পুরো লুকের সঙ্গে সামঞ্জস্য গুরুত্বপূর্ণ। আপনার ব্রাইডাল স্টাইলের সঙ্গে মানানসই জুয়েলারি খুঁজে দেখুন।</p></div></a>
    <a href="/bn/categories/gift-jewellery/" class="category-tile has-media"><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" alt="eMarket247 উপহারের জুয়েলারি ক্যাটাগরি — উপহারের মুহূর্ত" width="2304" height="1536" loading="lazy" decoding="async"></figure><div class="category-tile-body"><div class="category-tile-header"><h3>উপহারের জুয়েলারি</h3><small>Gift <b>↗</b></small></div><p class="category-desc">জন্মদিন, বিবাহবার্ষিকী বা অন্য কোনো বিশেষ মুহূর্তে উপহার দেওয়ার জন্য পছন্দের জুয়েলারি খুঁজে দেখুন।</p></div></a>
  </div>
</section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">সঠিক বাছাই</p>
  <h2>কীভাবে সঠিক জুয়েলারি বেছে নেবেন?</h2>
  <p>জুয়েলারি বাছাইয়ের সময় শুধু ডিজাইন নয়—<strong>কোথায় পরবেন, কোন পোশাকের সঙ্গে পরবেন এবং আপনার ব্যক্তিগত স্টাইল কী</strong>, সেগুলোও বিবেচনা করুন। প্রতিদিনের জন্য সাধারণ ডিজাইন, আর অনুষ্ঠান বা উৎসবের জন্য একটু বেশি আকর্ষণীয় স্টাইল বেছে নেওয়া যেতে পারে। পণ্যের ক্ষেত্রে যে <strong>উপাদান, ফিনিশ, মাপ ও অন্যান্য তথ্য দেওয়া আছে</strong>, সেগুলো দেখে সিদ্ধান্ত নিন।</p>
  <p>জুয়েলারি শুধু সাজের অংশ নয়—এটি আপনার ব্যক্তিগত পছন্দেরও প্রকাশ। তাই ট্রেন্ড অনুসরণ করার পাশাপাশি এমন ডিজাইন বেছে নিন যেটি আপনি সত্যিই পরতে স্বচ্ছন্দ্যবোধ করেন।</p>
  <p><strong>আপনার পছন্দের ক্যাটাগরি থেকে শুরু করুন।</strong></p>
  <p><a class="button button-dark" href="/bn/shop/">সব জুয়েলারি দেখুন <span>→</span></a></p>
</div></section>`;

// SEO metadata per language: [oldTitle, newTitle, oldMeta, newMeta]
const SEO = {
  "public_html/en/categories/index.html": {
    oldTitle: "<title>Categories | eMarket247</title>",
    newTitle: "<title>Jewellery Categories | Earrings, Bangles, Necklaces & Rings | eMarket247</title>",
    oldMeta: null, // patched separately below if present
    newMeta: 'Explore eMarket247’s jewellery categories — earrings, bangles, bracelets, necklaces, pendants, rings and jewellery sets. Find your preferred design in one place.',
  },
  "public_html/bn/categories/index.html": {
    oldTitle: "<title>ক্যাটাগরি | eMarket247</title>",
    newTitle: "<title>জুয়েলারির ক্যাটাগরি | কানের দুল, চুড়ি, হার ও আংটি | eMarket247</title>",
    oldMeta: null,
    newMeta: 'কানের দুল, চুড়ি, ব্রেসলেট, হার, পেনডেন্ট, আংটি ও জুয়েলারি সেটের ক্যাটাগরি দেখুন এবং আপনার পছন্দের ডিজাইন খুঁজে নিন।',
  },
};

for (const [file, html] of [["public_html/en/categories/index.html", EN], ["public_html/bn/categories/index.html", BN]]) {
  let s = readFileSync(file, "utf8");
  // Replace from <main ...> up to the last </section> before </main>
  const mainStart = s.indexOf('<main id="main">');
  const mainEnd = s.indexOf('</main>', mainStart);
  if (mainStart === -1 || mainEnd === -1) throw new Error(`main not found in ${file}`);
  s = s.slice(0, mainStart + '<main id="main">'.length) + html + s.slice(mainEnd);

  const seo = SEO[file];
  if (seo.oldTitle && s.includes(seo.oldTitle)) s = s.replace(seo.oldTitle, seo.newTitle);
  else console.log(`note: title pattern not matched in ${file}`);
  // Replace meta description content (unique attribute anchor)
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${seo.newMeta}$2`);
  writeFileSync(file, s, "utf8");
  console.log(`${file}: main rebuilt, title+meta updated`);
}
