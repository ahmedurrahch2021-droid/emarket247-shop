// One-off: finish the wedding occasion page (EN + BN).
//
// Two approved items:
//   1. Hero image — replace the gold-jewellery still life with the model-in-
//      jewellery editorial shot. The hero system is built for it: the CSS
//      keeps `object-position: center right` with the comment "Preserves
//      jewelry & model photography focal point", and every other occasion
//      page leads with jewellery being worn.
//   2. Body copy — the wedding page absorbed the bridal page when that URL was
//      retired, so it has to carry the story alone. Two sections are added:
//      the bridal styling craft that lived on the bridal page (carried over,
//      not duplicated), and a preparation/measurement guide so a buyer knows
//      what to have ready before choosing.
//
// Existing sections are left as they were: hero, assurance strip, category
// links, the four ceremony articles, the planning panel and the trust grid.
// No existing copy is rewritten — new sections are inserted between the
// ceremony articles and the planning panel, which is where the page was
// thinnest.
import { readFileSync, writeFileSync } from "node:fs";

const HERO = {
  // 1376x768 — the only model-in-jewellery editorial on the site that was not
  // already in use on another page.
  src: "/assets/images/editorial/occasions_hero_banner.webp",
  width: 1376,
  height: 768,
};

const HERO_ALT = {
  bn: "লাল-সাদা শাড়িতে সজ্জিত মডেলের গলায় ও হাতে সোনালি বিয়ের গহনা | eMarket247",
  en: "Model in a red-and-white saree wearing gold bridal jewellery | eMarket247",
};

// The bridal keyword lost its page when that URL was retired; the wedding lede
// is where it belongs now.
const LEDE = {
  bn: "হলুদ সন্ধ্যা থেকে জমকালো বিবাহোত্তর সংবর্ধনা—প্রতিটি মাঙ্গলিক মুহূর্তের জন্য ব্রাইডাল জুয়েলারি, ঐতিহ্যবাহী সীতা হার ও কারুকাজের নির্ভরযোগ্য কালেকশন।",
  en: "From the Gaye Holud evening to a grand post-wedding reception — bridal jewellery, traditional sita hars and ceremonial sets for every part of a Bengali wedding.",
};

// ---------------------------------------------------------------------------
// New section 1 — bridal styling craft (carried over from the retired bridal
// page, in the site's existing 2x2 info-card grid).
// ---------------------------------------------------------------------------
const CRAFT = {
  bn: `
<section class="info-grid wrap"><div><p class="eyebrow">কনের সাজের কারুকাজ</p><h2>ভারী সাজেও ভারসাম্য রাখার চারটি নিয়ম</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:420px;margin:16px 0 0;">বিয়ের সাজে গহনার পরিমাণ নয়, ভারসাম্যই মূল কথা। নিচের চারটি বিষয় মাথায় রাখলে কনের সাজ জমকালো হয়েও ক্লান্তিকর হয় না।</p></div><article class="info-card"><h3>চোকার ও সীতা হারের ভারসাম্য</h3><p>গলার কাছে বসা চোকার এবং লম্বা সীতা হার—দুটি ভারী টুকরা একসঙ্গে একই মাপে এলে সাজ নিচের দিকে ভারী দেখায়। একটি ভারী হলে অন্যটি হালকা রাখলে পুরো কম্পোজিশন ভারসাম্যপূর্ণ থাকে।</p></article><article class="info-card"><h3>ঝুমকার ভার ও আরাম</h3><p>বহুস্তরের ঝুমকা সুন্দর, তবে কানলতির ওপর চাপ পড়ে। দুই কানের ঝুমকার ওজন কাছাকাছি কি না, আর পিছনে কানটানা বা সাপোর্ট আছে কি না—এই দুই জিনিসই ঘণ্টার পর ঘণ্টা আরামে পরার নির্ণায়ক।</p></article><article class="info-card"><h3>হাতের সমন্বয়: শাঁখা, পোলা ও বালা</h3><p>শাঁখা, পোলা আর সোনালি বালা একসঙ্গে পরলে হাত খুব ভরা দেখাতে পারে। এক-একটি করে যোগ করে দেখুন কোন মিশ্রণে হাত ভারসাম্যপূর্ণ লাগে—দুই হাতে একই রকম রাখলে সবচেয়ে সুষম দেখায়।</p></article><article class="info-card"><h3>অনুষ্ঠানের পরে যত্ন</h3><p>ঘাম, পারফিউম ও পানিতে গহনার ফিনিশ ধীরে ধীরে নষ্ট হয়। অনুষ্ঠান শেষে শুকনো নরম কাপড়ে মুছে, টুকরাগুলো আলাদা পাউচে রেখে দিলে সূক্ষ্ম কারুকাজ অনেক দিন ভালো থাকে। বিস্তারিত জানতে <a href="/bn/care/">যত্ন সহায়িকা</a> দেখুন।</p></article></section>`,
  en: `
<section class="info-grid wrap"><div><p class="eyebrow">The bridal styling</p><h2>Four rules that keep a heavy bridal look balanced</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:420px;margin:16px 0 0;">A bridal set works because of balance, not volume. These four things are what keep a rich look comfortable through a long day.</p></div><article class="info-card"><h3>The choker and sita har balance</h3><p>A snug choker and a long sita har are both statement pieces; worn together at the same scale they pull the whole look downwards. If one is heavy, keep the other light and the composition holds its balance.</p></article><article class="info-card"><h3>Jhumka weight and comfort</h3><p>Multi-tiered jhumkas are beautiful, but they load the earlobe. Whether the two sides weigh close to the same, and whether there is a support chain behind, is what decides comfort across hours of rituals.</p></article><article class="info-card"><h3>Organising shankha, pola and bala</h3><p>Shankha, pola and gold bala worn together can crowd the wrist. Add them one at a time and see which combination looks balanced — matching both wrists reads as the most even.</p></article><article class="info-card"><h3>Care after the ceremony</h3><p>Sweat, perfume and water dull a finish over time. Wiping each piece with a dry soft cloth and storing the set in separate pouches keeps fine work intact far longer — see the <a href="/en/care/">jewellery care guide</a>.</p></article></section>`,
};

// ---------------------------------------------------------------------------
// New section 2 — what to have ready before choosing (preparation, not a
// product claim). This is the part of a bridal purchase that buyers get wrong
// most often, and nothing else on the site covers it.
// ---------------------------------------------------------------------------
const PREPARE = {
  bn: `
<section class="category-choose wrap"><div>
  <p class="eyebrow">নির্বাচনের আগে প্রস্তুতি</p>
  <h2>বিয়ের সাজ বাছার আগে যা জানা থাকলে ভুল কম হয়</h2>
  <p>বিয়ের গহনা বাছাইয়ে সবচেয়ে বড় ভুলটি হয় তথ্যের অভাবে, পছন্দের অভাবে নয়। চারটি বিষয় আগেই ঠিক করে রাখলে দূর থেকে বা অনলাইনে বাছাই করাও অনেক সহজ হয়ে যায়।</p>
  <ol class="buyer-questions"><li>আংটির সাইজ — ঠান্ডা হাতে দিনের শেষে মাপ নিন; সকালের মাপ সাধারণত একটু ছোট আসে।</li><li>চুড়ির মাপ — হাতের চওড়া অংশ দিয়ে মাপুন, আর কব্জি নয়; হাতে দিতে পারার মতো একটু ঢিল থাকা দরকার।</li><li>হারের দৈর্ঘ্য — কোন হারটি কতটা নিচে নামবে তা ব্লাউজের নেকলাইন ও গলার মাপের ওপর নির্ভর করে। পোশাক আগে চূড়ান্ত করে নিন।</li><li>কেশবিন্যাস ও কানের দুল — দীর্ঘ ঝুমকার প্রলম্বন চুলের সঙ্গে জড়িয়ে যায়। আগে ঠিক করুন চুল খোলা থাকবে না বাঁধা হবে।</li></ol>
  <p>এই চারটি তথ্য হাতের কাছে থাকলে আমাদের হোয়াটসঅ্যাপে লিখেই মিলিয়ে দেখা যায়—<strong>কোন টুকরাটি আপনার পোশাক ও গলার মাপের সঙ্গে মানাবে।</strong></p>
  <p><a class="text-link" href="/bn/contact/">যোগাযোগের সব উপায় দেখুন →</a></p>
</div></section>`,
  en: `
<section class="category-choose wrap"><div>
  <p class="eyebrow">Before you choose</p>
  <h2>What to know before you pick a bridal set</h2>
  <p>The most common bridal mistake is not a matter of taste — it is a matter of information. Four things settled in advance make choosing far easier, whether you are shopping in person or from another city.</p>
  <ol class="buyer-questions"><li>Ring size — measure at the end of the day with cool hands; a morning measurement usually comes out slightly small.</li><li>Bangle size — measure across the widest part of the hand, not the wrist, and allow enough room to pass over the knuckles.</li><li>Necklace length — how far a piece falls depends on your neckline and neck measurement, so finalise the outfit first.</li><li>Hair and earrings — long jhumkas tangle with loose hair. Decide in advance whether your hair will be worn open or pinned.</li></ol>
  <p>With those four answers to hand, we can check on WhatsApp which piece suits <strong>your outfit, your neckline and your measurements</strong>.</p>
  <p><a class="text-link" href="/en/contact/">See all the ways to reach us →</a></p>
</div></section>`,
};

// ---------------------------------------------------------------------------
for (const lang of ["en", "bn"]) {
  const file = `public_html/${lang}/occasions/wedding/index.html`;
  let s = readFileSync(file, "utf8");
  const original = s;

  // 1) Hero image -> model-in-jewellery shot, with the real intrinsic size.
  const heroRe = /<img class="hero-bg" src="[^"]*" width="[^"]*" height="[^"]*" alt="[^"]*" fetchpriority="high">/;
  if (!heroRe.test(s)) throw new Error(`${lang}: hero image pattern not found`);
  s = s.replace(
    heroRe,
    `<img class="hero-bg" src="${HERO.src}" width="${HERO.width}" height="${HERO.height}" alt="${HERO_ALT[lang]}" fetchpriority="high">`,
  );

  // 2) Lede now names bridal, the keyword the page inherited.
  const ledeRe = /(<div class="hero-content hero-editorial-col">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>)([\s\S]*?)(<\/p>)/;
  if (!ledeRe.test(s)) throw new Error(`${lang}: hero lede pattern not found`);
  s = s.replace(ledeRe, (m, head, _body, tail) => head + LEDE[lang] + tail);

  // 3) Insert the two new sections before the planning panel.
  const anchor = `<section class="two-panel wrap">`;
  const at = s.indexOf(anchor);
  if (at === -1) throw new Error(`${lang}: planning panel anchor not found`);
  s = s.slice(0, at) + CRAFT[lang] + PREPARE[lang] + s.slice(at);

  if (s === original) throw new Error(`${lang}: nothing changed`);
  writeFileSync(file, s, "utf8");
  console.log(`${file} updated`);
}

// Verify the hero swap and the new sections landed, in both languages.
for (const lang of ["en", "bn"]) {
  const file = `public_html/${lang}/occasions/wedding/index.html`;
  const s = readFileSync(file, "utf8");
  if (!s.includes(HERO.src)) throw new Error(`${lang}: hero src missing`);
  if ((s.match(/class="hero-bg"/g) || []).length !== 1) throw new Error(`${lang}: hero count wrong`);
  if (!s.includes('width="1376"') || !s.includes('height="768"')) throw new Error(`${lang}: hero dims wrong`);
  const cards = (s.match(/class="info-card"/g) || []).length;
  const questions = (s.match(/class="buyer-questions"/g) || []).length;
  if (cards !== 4) throw new Error(`${lang}: expected 4 info-cards, found ${cards}`);
  if (questions !== 1) throw new Error(`${lang}: expected 1 preparation list, found ${questions}`);
  console.log(`${lang}: hero ok, 4 styling cards, preparation list ok`);
}

console.log("\nWedding page finished.");
