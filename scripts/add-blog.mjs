// One-off: create the site blog (EN + BN) and publish its first two posts.
//
//   /{lang}/blog/                                  blog index
//   /{lang}/blog/why-i-started-emarket247/          founder story
//   /{lang}/blog/jewellery-buying-checklist/        practical buying checks
//
// The founder story carries the reserved photo slot for Rozina Akter, so the
// page is finished and only the photograph is outstanding.
//
// Every block reuses a component the site already ships (slim-hero, guide-list,
// category-choose, info-grid/info-card, care-note, about-quote, founder-photo,
// shop-contact-cta). The only new CSS is the post byline — one rule, added to
// the same stylesheet section as the rest of the About/editorial additions.
//
// Pages are built from the guides shell of the same language, which carries the
// approved header, footer and asset references.
import { appendFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = "public_html";
const SITE = "https://emarket247.shop";
const PUBLISHED = "2026-09-19";
const OG_IMAGE = "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp";

const INDEX = { en: "blog", bn: "blog" };
const POSTS = [
  {
    slug: "why-i-started-emarket247",
    section: { bn: "প্রতিষ্ঠার গল্প", en: "The founder's story" },
    title: {
      bn: "কেন আমি ঠাকুরগাঁও থেকে একটি অনলাইন জুয়েলারি দোকান শুরু করলাম | eMarket247",
      en: "Why I Started an Online Jewellery Shop from Thakurgaon | eMarket247",
    },
    meta: {
      bn: "রোজিনা আক্তার লিখেছেন কীভাবে ঠাকুরগাঁও থেকে ছোট একটি উদ্যোগ দিয়ে eMarket247 শুরু হলো, কেন ক্রেতার আস্থাই সবচেয়ে গুরুত্বপূর্ণ, এবং সামনে তিনি কী করতে চান।",
      en: "Rozina Akter on how eMarket247 began as a small initiative in Thakurgaon, why a buyer's trust decides everything, and what she wants to build next.",
    },
    h1: {
      bn: "কেন আমি ঠাকুরগাঁও থেকে একটি অনলাইন জুয়েলারি দোকান শুরু করলাম",
      en: "Why I Started an Online Jewellery Shop from Thakurgaon",
    },
    lede: {
      bn: "আমার নাম রোজিনা আক্তার। এই লেখায় বলতে চাই—কেন শুরু করলাম, শুরুতে কী নিয়ে ভয় ছিল, আর কোন বিষয়টা আমি কিছুতেই ছাড়তে চাই না।",
      en: "My name is Rozina Akter. I want to write plainly about why I started, what frightened me at the beginning, and the one thing I refuse to give up on.",
    },
    date: PUBLISHED,
  },
  {
    slug: "jewellery-buying-checklist",
    section: { bn: "কেনার পরামর্শ", en: "Buying guidance" },
    title: {
      bn: "অনলাইনে গহনা কেনার আগে যাচাই করার ৫টি বিষয় | eMarket247",
      en: "5 Things to Check Before Buying Jewellery Online | eMarket247",
    },
    meta: {
      bn: "ছবি, উপাদান, মাপ, ফেরতের নিয়ম আর যোগাযোগের পথ—অনলাইনে গহনা কেনার আগে যাচাই করার পাঁচটি ব্যবহারিক বিষয়, সহজ বাংলায়।",
      en: "Photographs, materials, measurements, the return window and a working contact path — five practical checks to make before you order jewellery online.",
    },
    h1: {
      bn: "অনলাইনে গহনা কেনার আগে যাচাই করার ৫টি বিষয়",
      en: "5 Things to Check Before Buying Jewellery Online",
    },
    lede: {
      bn: "গহনা কেনা বিশ্বাসের একটি সিদ্ধান্ত। সিদ্ধান্ত নেওয়ার আগে এই পাঁচটি বিষয় যাচাই করে নিলে অনিশ্চয়তা অনেক কমে যায়—এবং পণ্য হাতে পাওয়ার পর আফসোস করার সুযোগও।",
      en: "Buying jewellery is a decision about trust. Checking these five things before you order takes most of the uncertainty out of it — and leaves less room for regret once the parcel arrives.",
    },
    date: PUBLISHED,
  },
];

const bnDigits = (value) => String(value).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
const bnDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  return `${bnDigits(d)} ${months[m - 1]} ${bnDigits(y)}`;
};
const enDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const FOUNDER_BODY = {
  bn: `
<section class="wrap"><figure class="founder-photo founder-photo-pending"><div class="founder-photo-frame"><span>রোজিনা আক্তার — Founder, eMarket247</span><small>Photo coming soon / ছবি শীঘ্রই আসছে</small></div></figure></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">যেখান থেকে শুরু</p>
  <h2>ছোট একটি উদ্যোগ, বড় কোনো পরিকল্পনা ছাড়া</h2>
  <p>eMarket247-এর শুরুটা কোনো বড় শোরুম, বড় বিনিয়োগ বা বড় টিম দিয়ে হয়নি। শুরুটা একটি ছোট উদ্যোগ দিয়ে—ঠাকুরগাঁও থেকে, সীমিত সামর্থ্য নিয়ে। তখন যা ছিল, তা হলো শুরু করার সাহস আর একটি সিদ্ধান্ত: <strong>কাজটা ঠিকভাবে করব।</strong></p>
  <p>শহর থেকে দূরে বসে অনলাইনে গহনা বিক্রি করা সহজ ছিল না। বড় প্রতিষ্ঠানের মতো সুবিধা বা অবকাঠামো ছিল না। কিন্তু একটি বিষয় আমি নিশ্চিত ছিলাম—<strong>সঠিকভাবে কাজ করলে মানুষ একদিন চিনবেই।</strong></p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">সবচেয়ে বড় ভয়</p>
  <h2>যিনি আমাকে দেখেননি, তাঁকে ভরসা দিতে হয়</h2>
  <p>গহনা কেনা সাধারণ কেনাকাটা নয়—এটি বিশ্বাসের একটি সিদ্ধান্ত। অনলাইনে সিদ্ধান্তটি আরও কঠিন। যিনি গহনাটি কিনতে চান, তিনি আমার মুখ দেখেননি, দোকান দেখেননি, গহনাটি হাতে নেননি। তিনি দেখেছেন একটি ছবি আর কয়েক লাইন লেখা।</p>
  <p>শুরুতে এই কথাটাই আমাকে সবচেয়ে বেশি ভাবাতো—কেউ অনেক স্নেহের, অনেক জমানো টাকায় একটি গহনা বেছে নিচ্ছেন, আর আমি যেন <strong>সেই বিশ্বাসটা কোনোভাবেই নষ্ট না করি।</strong> তাই ব্যবসা বড় করার চেয়ে দীর্ঘমেয়াদে মানুষের আস্থা ধরে রাখা আমার কাছে সবসময় বেশি জরুরি।</p>
</div></section>
<section class="wrap"><div class="care-note">
  <p class="eyebrow">একটি সৎ স্বীকারোক্তি</p>
  <h2>সহজ পথটা আমার হাতের কাছেই ছিল</h2>
  <p>ছবি একটু বেশি চকচকে দেখানো, প্রতিটি পণ্যের সঙ্গে বাড়িয়ে বলা, কিংবা কৃত্রিম তাড়া তৈরি করা—এই সহজ পথগুলো আমার হাতের কাছেই ছিল। হয়তো তখনই বিক্রি কিছুটা বেশি হতো।</p>
  <p><strong>কিন্তু যে ক্রেতা একবার ঠকেছেন, তিনি আর ফিরে আসেন না—এবং তাঁর বন্ধুকেও আমাদের কথা বলেন না।</strong> একটি ছোট উদ্যোগের সবচেয়ে বড় পুঁজি ঠিক এটাই: মানুষ আবার ফিরে আসেন। তাই সহজ পথটা আমি ছাড়তে বেছে নিয়েছি।</p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">কমিউনিটি</p>
  <h2>১০,০০০+ মানুষের অনলাইন কমিউনিটি আমাকে যা শিখিয়েছে</h2>
  <p>আজ আমাদের সঙ্গে যুক্ত হয়েছে <strong>১০,০০০+ Facebook followers-এর একটি অনলাইন কমিউনিটি</strong>। এই সংখ্যাটি আমার কাছে কোনো পুরস্কার নয়—এটি প্রতিদিন পাওয়া ১০,০০০+ সুযোগ, প্রতিটি প্রশ্নের উত্তর ঠিকভাবে দেওয়ার।</p>
  <p>এই কমিউনিটি আমাকে শিখিয়েছে, মানুষ সবচেয়ে বেশি প্রশংসা করে না—প্রশ্ন করে। আর প্রতিটি প্রশ্নের সৎ উত্তরই ধীরে ধীরে একটি সম্পর্ক তৈরি করে। কেউ আবার ফিরে আসেন, কেউ তাঁর প্রিয় মানুষটিকে আমাদের কথা বলে দেন। আমার কাছে এটাই সবচেয়ে বড় অর্জন।</p>
</div></section>
<section class="about-quote wrap"><blockquote><p>"আমার কাছে সবচেয়ে বড় সাফল্য কোনো বড় সংখ্যা নয়—বরং একজন ক্রেতা দ্বিতীয়বার ফিরে এসে নিশ্চিন্তে অর্ডার করা।"</p></blockquote><cite><strong>রোজিনা আক্তার</strong><span>Founder, eMarket247</span></cite></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">সামনে</p>
  <h2>এখন আমার স্বপ্নটা কী</h2>
  <p>এখন স্বপ্নটা আগের চেয়ে বড়—ঠাকুরগাঁওয়ের এই ছোট উদ্যোগটিকে <strong>সারা বাংলাদেশের মানুষের কাছে পৌঁছে দেওয়া</strong>, এবং ভবিষ্যতে দেশের বাইরেও। এটি একদিনে হবে না, সেটা আমি ভালো করেই জানি।</p>
  <p>কিন্তু প্রতিটি অর্ডার, প্রতিটি নতুন follower এবং প্রতিটি ফিরে আসা ক্রেতা আমাকে এই পথেই এগিয়ে নিয়ে যাচ্ছে। <strong>একটি ছোট শহর থেকেও বড় স্বপ্ন দেখা যায়</strong>—এই কথাটাই আমি বিশ্বাস করি।</p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">সামনে পথ অনেক</p><h2>আমাদের সঙ্গে এই যাত্রায় থাকুন</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">eMarket247-এর গল্প এখনও লেখা হচ্ছে। কোনো কিছু জানতে চাইলে বা নিজের জন্য কিছু খুঁজতে চাইলে—আপনাকে স্বাগতম।</p></div><div class="section-cta"><a class="button button-dark" href="/bn/shop/">জুয়েলারি দেখুন</a><a class="button button-dark" href="/bn/blog/">সব লেখা পড়ুন</a></div></section>`,
  en: `
<section class="wrap"><figure class="founder-photo founder-photo-pending"><div class="founder-photo-frame"><span>Rozina Akter — Founder, eMarket247</span><small>Photo coming soon / ছবি শীঘ্রই আসছে</small></div></figure></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">Where it started</p>
  <h2>A small initiative, with no grand plan</h2>
  <p>eMarket247 did not begin with a large showroom, a large investment or a large team. It began as a small initiative — from Thakurgaon, with limited means. What I had was the courage to start and one decision: <strong>I would do this thing properly.</strong></p>
  <p>Selling jewellery online from a small town was not easy. I did not have the infrastructure or the advantages a large business has. But one thing I was certain about: <strong>if I work honestly, people will recognise it eventually.</strong></p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">The hardest part</p>
  <h2>When they cannot see you, trust is the only thing you can offer</h2>
  <p>Jewellery is not a routine purchase. It is a decision about trust — and online, that decision is harder still. The person buying has not seen my face, has not visited the shop, has not held the piece. They have a photograph and a few lines of text.</p>
  <p>That is what occupied my mind most in the beginning: someone is choosing a piece with money they have saved and care they feel, and I must not damage <strong>that trust in any way.</strong> Keeping trust over the long run has always mattered more to me than growing the business quickly.</p>
</div></section>
<section class="wrap"><div class="care-note">
  <p class="eyebrow">An honest admission</p>
  <h2>The easy path was within reach</h2>
  <p>Making photographs look a little shinier, exaggerating each product, manufacturing false urgency — those shortcuts were available to me. For a while they might even have sold more.</p>
  <p><strong>But a buyer who feels misled does not come back, and does not recommend you to a friend.</strong> For a small initiative, that is the whole asset: people return. So I chose to leave the easy path alone.</p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">Community</p>
  <h2>What 10,000+ people have taught me</h2>
  <p>Today this small initiative carries an <strong>online community of 10,000+ Facebook followers</strong>. That number is not a trophy to me — it is 10,000+ chances, every day, to answer a question properly.</p>
  <p>What this community has taught me is that people do not mostly praise; they ask. And an honest answer to each question builds a relationship slowly. Some come back. Some tell someone they love. To me, that is the real achievement.</p>
</div></section>
<section class="about-quote wrap"><blockquote><p>"The achievement I actually care about is not a large number — it is one customer returning a second time and ordering without hesitation."</p></blockquote><cite><strong>Rozina Akter</strong><span>Founder, eMarket247</span></cite></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">What comes next</p>
  <h2>What I am working towards now</h2>
  <p>The dream is bigger than it was — to bring this small Thakurgaon initiative <strong>to people across Bangladesh</strong>, and in time beyond it. That will not happen quickly, and I know it.</p>
  <p>But every order, every new follower and every returning customer moves it along. <strong>A small town can hold a big dream</strong> — that is what I believe.</p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">The road ahead</p><h2>Stay with us on this journey</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">The eMarket247 story is still being written. If you would like to know something, or find something for yourself, you are welcome here.</p></div><div class="section-cta"><a class="button button-dark" href="/en/shop/">Shop Jewellery</a><a class="button button-dark" href="/en/blog/">Read all posts</a></div></section>`,
};

const CHECKLIST_BODY = {
  bn: `
<section class="info-grid wrap"><div><p class="eyebrow">যাচাইয়ের তালিকা</p><h2>পাঁচটি বিষয়, যে ক্রমে দেখা উচিত</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:420px;margin:16px 0 0;">এই পাঁচটি প্রশ্নের উত্তর আপনি যত সহজে পাবেন, সিদ্ধান্ত নেওয়াও তত সহজ হবে। উত্তর না পেলে জিজ্ঞেস করা আপনার অধিকার—অনুরোধ নয়।</p></div><article class="info-card"><h3>ছবি নয়, বাস্তব রূপ</h3><p>গহনার ছবি আলো, ছায়া ও সম্পাদনায় সাধারণত বাস্তবের চেয়ে উজ্জ্বল দেখায়। তাই প্রশ্ন করুন—ছবিটি কি সম্পাদনা ছাড়া, স্বাভাবিক আলোয় তোলা? প্রয়োজনে হাতে ধরে বা গায়ে পরে তোলা একটি সাধারণ ছবি চেয়ে নিন।</p></article><article class="info-card"><h3>উপাদান ও ফিনিশ</h3><p>এটি আসল সোনা, সোনার প্রলেপ নাকি City Gold বা imitation jewellery—এটি শুরুতে পরিষ্কার জানা উচিত। পণ্যের সঙ্গে যে উপাদানের তথ্য দেওয়া আছে, সেটি না মিললে কেনার আগেই থামুন এবং সরাসরি জিজ্ঞেস করুন।</p></article><article class="info-card"><h3>মাপ ও ব্যবহারযোগ্যতা</h3><p>আংটির সাইজ, চুড়ির ব্যাস, হারের দৈর্ঘ্য—মাপ ভুল হলে গহনা পরে আরাম হবে না। মাপ কীভাবে মাপতে হয় তা জেনে নিন, এবং আপনার মাপটি বিক্রেতাকে আগেই জানিয়ে দিন। প্রতিদিন পরার গহনা হলে ওজন ও আরামও ভেবে দেখুন।</p></article><article class="info-card"><h3>ফেরত ও সমস্যার নিয়ম</h3><p>কোনো সমস্যা হলে কী হবে—এই প্রশ্নটি কেনার আগেই জানা উচিত। ফেরতের সময়সীমা, শর্ত এবং কত দিনের মধ্যে জানাতে হবে, এসব লিখিতভাবে পাওয়ার চেষ্টা করুন। একটি পরিষ্কার নিয়ম থাকলে ঝুঁকি অনেকটাই কমে যায়।</p></article><article class="info-card"><h3>যোগাযোগের পথ</h3><p>কেনার আগে একবার কথা বলে দেখুন। যিনি বিক্রি করছেন তিনি প্রশ্নের উত্তর দিচ্ছেন কি না, তাড়াহুড়ো করাচ্ছেন কি না—এতে অনেকটা বোঝা যায়। <a href="/bn/contact/">আমাদের যোগাযোগের তথ্য এখানে</a>।</p></article></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">শেষ কথা</p>
  <h2>প্রশ্ন করা দুর্বলতা নয়</h2>
  <p>অনলাইনে গহনা কেনার সময় প্রশ্ন করলে অনেকেই ভাবেন—তিনি হয়তো ঝামেলা করছেন। বিষয়টা ঠিক উল্টো। <strong>যত ভালো প্রশ্ন, তত নিরাপদ কেনাকাটা</strong>—এবং যে বিক্রেতা সৎভাবে উত্তর দিতে পারেন, তিনিই দীর্ঘমেয়াদে টিকে থাকেন।</p>
  <p>আমাদের কাছ থেকে কেনাকাটা করুন বা অন্য কারও কাছ থেকে—এই পাঁচটি বিষয় যাচাই করে নিলে আপনার সিদ্ধান্ত নিশ্চিতভাবে ভালো হবে।</p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">প্রশ্ন আছে?</p><h2>সরাসরি জিজ্ঞেস করুন</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">যে প্রশ্নই থাকুক, হোয়াটসঅ্যাপে লিখুন। পণ্যের তথ্য, মাপ কিংবা ফেরতের নিয়ম—পরিষ্কার উত্তর দেওয়ার চেষ্টা করি।</p></div><div class="section-cta"><a class="button button-dark" href="/bn/shop/">জুয়েলারি দেখুন</a><a class="button button-dark" href="/bn/blog/">সব লেখা পড়ুন</a></div></section>`,
  en: `
<section class="info-grid wrap"><div><p class="eyebrow">The checklist</p><h2>Five checks, in the order that helps most</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:420px;margin:16px 0 0;">The more easily you can get answers to these five questions, the easier the decision becomes. If the answers are not offered, asking for them is your right — not a favour you are requesting.</p></div><article class="info-card"><h3>How it really looks, not just the photo</h3><p>Product photographs use light, shadow and editing, so they usually look brighter than the real piece. Ask whether the photo is unedited and shot in normal light. If you need reassurance, request an ordinary photo of the piece held in hand or worn.</p></article><article class="info-card"><h3>Material and finish</h3><p>Whether a piece is solid gold, gold-plated, City Gold or imitation jewellery should be clear before you buy. If the stated material does not match what the listing suggests, stop and ask directly rather than assuming the better option.</p></article><article class="info-card"><h3>Measurements and wearability</h3><p>Ring size, bangle diameter, necklace length — a wrong measurement means a piece you cannot wear comfortably. Find out how the seller measures, give your own measurement in advance, and think about weight and comfort if you plan to wear it daily.</p></article><article class="info-card"><h3>The return and problem policy</h3><p>What happens if something goes wrong is a question to settle before you pay, not after. Look for the return window, its conditions, and how long you have to raise a problem — preferably in writing. A clear policy removes most of the risk.</p></article><article class="info-card"><h3>A contact path that works</h3><p>Talk to the seller once before you buy. Whether questions get answered properly, or whether you are rushed towards paying, tells you a great deal. <a href="/en/contact/">Our contact details are here</a>.</p></article></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">In closing</p>
  <h2>Asking questions is not being difficult</h2>
  <p>Many people worry that asking questions about an online jewellery purchase makes them a nuisance. It is the other way around. <strong>The better the questions, the safer the purchase</strong> — and a seller who can answer them honestly is the one who lasts.</p>
  <p>Buy from us or from someone else — checking these five things will make your decision a better one either way.</p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">Any questions?</p><h2>Just ask us directly</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">Whatever the question, message us on WhatsApp. Product details, measurements or the return terms — we try to give a clear answer.</p></div><div class="section-cta"><a class="button button-dark" href="/en/shop/">Shop Jewellery</a><a class="button button-dark" href="/en/blog/">Read all posts</a></div></section>`,
};

const INDEX_HERO = {
  bn: {
    eyebrow: "ব্লগ",
    h1: "গল্প, যত্ন আর গহনা বাছাইয়ের কথা",
    lede: "eMarket247-এর যাত্রা, গহনা বাছাইয়ের ব্যবহারিক পরামর্শ এবং কেনার আগে যা যাচাই করা উচিত—সব এক জায়গায়, পরিষ্কার ভাষায়।",
  },
  en: {
    eyebrow: "Blog",
    h1: "Stories, craft and how to choose well",
    lede: "The eMarket247 journey, practical guidance for choosing jewellery, and what to verify before you order — all in one place, written plainly.",
  },
};

const INDEX_SEO = {
  bn: {
    title: "ব্লগ | গল্প, যত্ন ও গহনা বাছাই | eMarket247",
    meta: "eMarket247-এর ব্লগ—প্রতিষ্ঠার গল্প, অনলাইনে গহনা কেনার ব্যবহারিক পরামর্শ এবং কেনার আগে যা যাচাই করা উচিত, সহজ বাংলায়।",
    ogTitle: "ব্লগ | eMarket247",
  },
  en: {
    title: "Blog | Stories, Craft and Buying Guidance | eMarket247",
    meta: "The eMarket247 blog — the founder's story, practical guidance for buying jewellery online, and what to check before you order.",
    ogTitle: "Blog | eMarket247",
  },
};

// ---------------------------------------------------------------------------
// Small builders
// ---------------------------------------------------------------------------

const shell = (lang) => readFileSync(`${ROOT}/${lang}/guides/index.html`, "utf8");

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function setHead(html, lang, { title, meta, canonical, ogTitle, ogImage, ogType = "website" }) {
  let s = html;
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeAttr(meta)}$2`);
  s = s.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  for (const target of ["en", "bn"]) {
    s = s.replace(
      new RegExp(`(<link rel="alternate" hreflang="${target}" href=")[^"]*(")`),
      `$1${canonical.replace(new RegExp(`/${lang}/`), `/${target}/`)}$2`,
    );
  }
  s = s.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeAttr(ogTitle)}$2`);
  s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeAttr(meta)}$2`);
  s = s.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  s = s.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${SITE}${ogImage}$2`);
  return s;
}

function setBreadcrumb(html, lang, crumbs) {
  const labels = crumbs.map(([label, href]) =>
    href
      ? `<li><a href="${href}">${label}</a></li>`
      : `<li><span aria-current="page">${label}</span></li>`,
  ).join("");
  const aria = lang === "bn" ? "পথনির্দেশ" : "Breadcrumb";
  return html.replace(
    /<nav class="breadcrumb wrap"[^>]*>[\s\S]*?<\/nav>/,
    `<nav class="breadcrumb wrap" aria-label="${aria}"><ol>${labels}</ol></nav>`,
  );
}

function setMain(html, body) {
  const start = html.indexOf('<main id="main">');
  const end = html.indexOf("</main>", start);
  return html.slice(0, start + '<main id="main">'.length) + body + html.slice(end);
}

function setLd(html, data) {
  return html.replace(
    /<script type="application\/ld\+json" data-emk="ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" data-emk="ld">${JSON.stringify(data)}</script>`,
  );
}

const breadcrumbLd = (lang, base, crumbs) => ({
  "@type": "BreadcrumbList",
  "@id": `${base}#breadcrumb`,
  itemListElement: crumbs.map(([label, href], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: label,
    item: href ? `${SITE}${href}` : base,
  })),
});

// ---------------------------------------------------------------------------
// 1) Blog index
// ---------------------------------------------------------------------------
for (const lang of ["en", "bn"]) {
  const base = `${SITE}/${lang}/blog/`;
  const seo = INDEX_SEO[lang];
  const hero = INDEX_HERO[lang];
  const home = lang === "bn" ? "হোম" : "Home";
  const blogLabel = lang === "bn" ? "ব্লগ" : "Blog";

  const crumbRows = [
    [home, `/${lang}/`],
    [blogLabel, null],
  ];

  const cards = POSTS.map((post, index) => {
    const num = lang === "bn" ? bnDigits(String(index + 1).padStart(2, "0")) : String(index + 1).padStart(2, "0");
    return `<article><span>${num}</span><h2>${post.h1[lang]}</h2><p>${post.lede[lang]}</p><a href="/${lang}/blog/${post.slug}/">${lang === "bn" ? "পড়ুন" : "Read"} →</a></article>`;
  }).join("");

  const body = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> ${hero.eyebrow}</p>
  <h1>${hero.h1}</h1>
  <p>${hero.lede}</p>
</div></section>
<section class="guide-list wrap" aria-label="${lang === "bn" ? "ব্লগের লেখা" : "Blog posts"}">${cards}</section>`;

  let html = shell(lang);
  html = setHead(html, lang, {
    title: seo.title,
    meta: seo.meta,
    canonical: base,
    ogTitle: seo.ogTitle,
    ogImage: OG_IMAGE,
  });
  html = setBreadcrumb(html, lang, crumbRows);
  html = setMain(html, body);
  html = setLd(html, {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${base}#blog`,
        url: base,
        name: seo.ogTitle,
        description: seo.meta,
        inLanguage: lang,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#organization` },
        breadcrumb: { "@id": `${base}#breadcrumb` },
      },
      breadcrumbLd(lang, base, crumbRows),
    ],
  });

  mkdirSync(`${ROOT}/${lang}/${INDEX[lang]}`, { recursive: true });
  writeFileSync(`${ROOT}/${lang}/${INDEX[lang]}/index.html`, html, "utf8");
  console.log(`${lang}/blog/index.html created`);
}

// ---------------------------------------------------------------------------
// 2) Posts
// ---------------------------------------------------------------------------
const BODIES = {
  "why-i-started-emarket247": FOUNDER_BODY,
  "jewellery-buying-checklist": CHECKLIST_BODY,
};

for (const post of POSTS) {
  for (const lang of ["en", "bn"]) {
    const base = `${SITE}/${lang}/blog/${post.slug}/`;
    const home = lang === "bn" ? "হোম" : "Home";
    const blogLabel = lang === "bn" ? "ব্লগ" : "Blog";
    const byline = lang === "bn"
      ? `রোজিনা আক্তার · Founder, eMarket247 · ${bnDate(post.date)}`
      : `Rozina Akter · Founder, eMarket247 · ${enDate(post.date)}`;

    const crumbRows = [
      [home, `/${lang}/`],
      [blogLabel, `/${lang}/blog/`],
      [post.h1[lang], null],
    ];

    const body = `
<section class="page-hero wrap simple slim-hero"><div>
  <p class="eyebrow"><strong class="brand-name">eMarket247</strong> ${post.section[lang]}</p>
  <h1>${post.h1[lang]}</h1>
  <p>${post.lede[lang]}</p>
  <p class="post-byline">${byline}</p>
</div></section>${BODIES[post.slug][lang]}`;

    let html = shell(lang);
    html = setHead(html, lang, {
      title: post.title[lang],
      meta: post.meta[lang],
      canonical: base,
      ogTitle: post.title[lang],
      ogImage: OG_IMAGE,
      ogType: "article",
    });
    html = setBreadcrumb(html, lang, crumbRows);
    html = setMain(html, body);
    html = setLd(html, {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${base}#webpage`,
          url: base,
          name: post.title[lang],
          description: post.meta[lang],
          isPartOf: { "@id": `${SITE}/#website` },
          inLanguage: lang,
          breadcrumb: { "@id": `${base}#breadcrumb` },
          primaryImageOfPage: `${SITE}${OG_IMAGE}`,
        },
        {
          "@type": "BlogPosting",
          "@id": `${base}#article`,
          headline: post.h1[lang],
          description: post.meta[lang],
          inLanguage: lang,
          datePublished: post.date,
          dateModified: post.date,
          articleSection: post.section[lang],
          author: { "@type": "Person", name: "রোজিনা আক্তার", url: `${SITE}/${lang}/about/` },
          publisher: { "@id": `${SITE}/#organization` },
          isPartOf: { "@id": `${SITE}/#website` },
          mainEntityOfPage: { "@id": `${base}#webpage` },
          // No "image" is published until Rozina Akter's photograph exists: an
          // editorial stock image is not a picture of the author.
        },
        breadcrumbLd(lang, base, crumbRows),
      ],
    });

    mkdirSync(`${ROOT}/${lang}/blog/${post.slug}`, { recursive: true });
    writeFileSync(`${ROOT}/${lang}/blog/${post.slug}/index.html`, html, "utf8");
    console.log(`${lang}/blog/${post.slug}/index.html created`);
  }
}

// ---------------------------------------------------------------------------
// 3) "Blog" in the main navigation, next to About Us
// ---------------------------------------------------------------------------
{
  const targets = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(?:html|php)$/.test(entry.name)) targets.push(file);
    }
  };
  walk(ROOT);
  targets.sort();

  const anchorRe = (lang) =>
    new RegExp(
      `(<a class="menu-all" href="/${lang}/occasions/">[^<]*<span>→</span></a></div></div>\\n)(\\s*)(<a href="/${lang}/about/">)`,
    );
  const items = { en: `<a href="/en/blog/">Blog</a>`, bn: `<a href="/bn/blog/">ব্লগ</a>` };

  let touched = 0;
  for (const file of targets) {
    let s = readFileSync(file, "utf8");
    let changed = false;
    for (const lang of ["en", "bn"]) {
      if (s.includes(items[lang])) continue;
      const re = anchorRe(lang);
      if (!re.test(s)) continue;
      // Match the indentation of the row the item joins, so the PHP-generated
      // product pages (deeper indent) and the static pages stay consistent.
      s = s.replace(re, `$1$2${items[lang]}\n$2$3`);
      changed = true;
    }
    if (changed) {
      writeFileSync(file, s, "utf8");
      touched += 1;
    }
  }
  console.log(`blog nav item added to ${touched} page(s)`);

  // The PHP header builds the same row from a template string.
  const php = `${ROOT}/product.php`;
  let s = readFileSync(php, "utf8");
  const anchor = `      <a href="/' . $lang . '/about/">' . ($isBn ? 'আমাদের কথা' : 'About Us') . '</a>`;
  const item = `      <a href="/' . $lang . '/blog/">' . ($isBn ? 'ব্লগ' : 'Blog') . '</a>`;
  if (!s.includes(item)) {
    if (!s.includes(anchor)) throw new Error("product.php nav anchor not found");
    s = s.replace(anchor, `${item}\n${anchor}`);
    writeFileSync(php, s, "utf8");
    console.log("product.php: blog nav item added");
  }
}

// ---------------------------------------------------------------------------
// 4) Sitemap
// ---------------------------------------------------------------------------
{
  const file = `${ROOT}/sitemap.xml`;
  let s = readFileSync(file, "utf8");
  const urls = [];
  for (const lang of ["en", "bn"]) {
    urls.push(`${SITE}/${lang}/blog/`);
    for (const post of POSTS) urls.push(`${SITE}/${lang}/blog/${post.slug}/`);
  }
  const added = urls.filter((url) => !s.includes(`<loc>${url}</loc>`));
  if (added.length) {
    const block = added.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
    s = s.replace("</urlset>", `${block}\n</urlset>`);
    writeFileSync(file, s, "utf8");
  }
  console.log(`sitemap.xml: ${added.length} blog URL(s) added`);
}

// ---------------------------------------------------------------------------
// 5) One new style: the post byline
// ---------------------------------------------------------------------------
{
  const file = `${ROOT}/assets/css/site.css`;
  let s = readFileSync(file, "utf8");
  if (!s.includes(".post-byline")) {
    appendFileSync(
      file,
      `\n/* \u2500\u2500 Blog: post byline \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n.post-byline {\n  margin: 20px 0 0;\n  color: var(--muted);\n  font-size: 11px;\n  letter-spacing: .07em;\n  text-transform: uppercase;\n}\n`,
      "utf8",
    );
    console.log("site.css: .post-byline added");
  } else {
    console.log("site.css: .post-byline already present");
  }
}

console.log("\nBlog created.");
