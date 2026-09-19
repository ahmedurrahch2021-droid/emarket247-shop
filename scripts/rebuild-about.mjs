// One-off: rebuild the About pages (EN + BN) from the founder-story brief.
// Reuses existing section classes (two-panel, info-grid/info-card, care-note,
// category-choose, shop-contact-cta, full-width-hero, founder-grid).
// The full-width hero and founder-grid each carry their own CSS in site.css.
// Keep these templates in sync with the live files.
import { readFileSync, writeFileSync } from "node:fs";

const BN = `
<section class="editorial-hero full-width-hero"><img class="hero-bg" src="/assets/images/editorial/About%20Us.webp" width="2048" height="1152" alt="eMarket247-এর গল্প ও কারুকাজ — ঠাকুরগাঁও থেকে শুরু" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> আমাদের গল্প</p><h1>আমাদের গল্প</h1><p>ঠাকুরগাঁওয়ের এক গৃহিণীর ছোট উদ্যোগ, যা ধীরে ধীরে হয়ে উঠছে একটি জুয়েলারি গন্তব্য — পরিষ্কার তথ্য, সৎ প্রত্যাশা আর মানুষের আস্থায় গড়া।</p></div></div></section>
<section class="two-panel wrap"><figure><img src="/assets/images/editorial/About%20Us.webp" width="2048" height="1152" loading="lazy" alt="eMarket247-এর গল্প ও কারুকাজ"><figcaption>eMarket247 — ঠাকুরগাঁও থেকে শুরু</figcaption></figure><div>
  <p class="eyebrow">ছোট শুরু</p>
  <h2>সব বড় গল্পের শুরুটা ছোট হয়</h2>
  <p>eMarket247-এর গল্প কোনো বড় শোরুম বা বড় বিনিয়োগ দিয়ে শুরু হয়নি। এর শুরু একজন সাধারণ গৃহিণী <strong>রোজিনা আক্তারের</strong> ছোট একটি উদ্যোগ দিয়ে—ঠাকুরগাঁও থেকে, সীমিত সামর্থ্য নিয়ে, নিজের পরিশ্রম ও মানুষের আস্থা অর্জনের ইচ্ছাকে সঙ্গে করে।</p>
  <p>ব্যবসার শুরুতে তার কাছে ছিল না বড় কোনো প্রতিষ্ঠান, বিশাল বিনিয়োগ বা বড় টিম। ছিল একটি ছোট উদ্যোগ শুরু করার সাহস। শুরুটা ছোট হলেও একটি বিষয় শুরু থেকেই গুরুত্বপূর্ণ ছিল—<strong>যে মানুষটি তার কাছ থেকে জুয়েলারি কিনবেন, তার আস্থা যেন নষ্ট না হয়।</strong></p>
  <p>কারণ অনলাইনে একটি ছবি দেখে কোনো গহনা পছন্দ করা সহজ। কিন্তু সেই গহনা হাতে পাওয়ার পরও যেন মনে হয়, <strong>"আমি ঠিক জায়গা থেকেই কিনেছি"</strong>—এই বিশ্বাস তৈরি করাই আসল চ্যালেঞ্জ।</p>
  <p>আজ সেই ছোট উদ্যোগের সঙ্গে যুক্ত হয়েছে <strong>১০,০০০+ Facebook followers-এর একটি অনলাইন কমিউনিটি</strong>। আর এখন স্বপ্নটা আরও বড়—ঠাকুরগাঁও থেকে সারা বাংলাদেশে, এবং ভবিষ্যতে দেশের বাইরেও eMarket247-এর পরিচিতি তৈরি করা।</p>
</div></section>
<section class="founder-grid wrap"><blockquote class="about-quote"><p>"আমি খুব বড় কিছু দিয়ে শুরু করিনি। ছোট করে শুরু করেছিলাম। মানুষের বিশ্বাস আর নিজের পরিশ্রমকে সঙ্গে নিয়ে আজ এখানে এসেছি। এখন আমার স্বপ্ন—ঠাকুরগাঁওয়ের এই ছোট উদ্যোগকে সারা বাংলাদেশের মানুষের কাছে পৌঁছে দেওয়া।"</p><cite><strong>রোজিনা আক্তার</strong><span>Founder, eMarket247</span></cite></blockquote><figure class="founder-photo founder-photo-pending"><div class="founder-photo-frame"><span>রোজিনা আক্তার — Founder, eMarket247</span><small>Photo coming soon / ছবি শীঘ্রই আসছে</small></div></figure></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">ক্রেতার প্রশ্ন</p>
  <h2>পণ্য বিক্রি করা সহজ। আস্থা অর্জন করা কঠিন।</h2>
  <p>অনলাইনে জুয়েলারি কেনার সময় একজন ক্রেতার স্বাভাবিক কিছু প্রশ্ন থাকে—</p>
  <ol class="buyer-questions"><li>ছবির মতোই কি দেখতে হবে?</li><li>পণ্যের তথ্য কি পরিষ্কার?</li><li>আমি আসলে কী কিনছি?</li><li>কোনো সমস্যা হলে কার সঙ্গে কথা বলব?</li></ol>
  <p>এই প্রশ্নগুলোকে আমরা অস্বাভাবিক মনে করি না। বরং আমাদের কাছে এগুলো একজন সচেতন ক্রেতার স্বাভাবিক অধিকার।</p>
  <p>তাই eMarket247-এর লক্ষ্য শুধু সুন্দর জুয়েলারি দেখানো নয়। আমরা চাই, একজন ক্রেতা কেনার আগে যতটা সম্ভব পরিষ্কার তথ্য পান এবং নিজের সিদ্ধান্ত নিজেই আত্মবিশ্বাসের সঙ্গে নিতে পারেন।</p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">উদ্যোগটির পরিচয়</p>
  <h2>রোজিনার কাছে eMarket247 কী?</h2>
  <ol class="story-timeline">
<li><h3>শুধু একটি দোকান নয়</h3><p>eMarket247 শুধু একটি online jewellery shop নয়। এটি এমন একটি উদ্যোগ, যেখানে একজন গৃহিণী নিজের ছোট ব্যবসাকে ধীরে ধীরে একটি বড় স্বপ্নে পরিণত করার চেষ্টা করছেন।</p></li>
<li><h3>ছোট করে শুরু করা দুর্বলতা নয়</h3><p>সীমিত সুযোগের মধ্যেও শুরু করে, ভুল থেকে শেখা, প্রতিদিন কাজ করা এবং ধীরে ধীরে এগিয়ে যাওয়াই এই যাত্রার গুরুত্বপূর্ণ অংশ।</p></li>
<li><h3>ধীরে ধীরে, ধাপে ধাপে</h3><p>একটি ছোট শহর থেকে অনলাইনে ব্যবসা শুরু করে মানুষের কাছে পৌঁছানো একদিনের কাজ নয়। প্রতিটি অর্ডার, প্রতিটি কথোপকথন, প্রতিটি নতুন follower এবং প্রতিটি ফিরে আসা customer—ধীরে ধীরে এই পথ তৈরি করেছে।</p></li>
</ol>
</div></section>
<section class="info-grid wrap"><div><p class="eyebrow">আমাদের বিশ্বাস</p><h2>আমরা কী বিশ্বাস করি</h2></div><article class="info-card"><h3>পরিষ্কার তথ্য</h3><p>আপনি কী কিনছেন, সেটি বোঝার মতো তথ্য পাওয়া গুরুত্বপূর্ণ। পণ্যের ক্ষেত্রে যে তথ্য যাচাই করা ও প্রকাশ করা সম্ভব, সেটি পরিষ্কারভাবে দেওয়াই আমাদের লক্ষ্য।</p></article><article class="info-card"><h3>বাস্তব প্রত্যাশা</h3><p>City Gold বা imitation jewellery-কে আমরা আসল সোনা বলে উপস্থাপন করি না। এটি নিজস্ব সৌন্দর্য, ব্যবহার ও মূল্যের একটি আলাদা jewellery category।</p></article><article class="info-card"><h3>মানুষের সঙ্গে সরাসরি যোগাযোগ</h3><p>অনলাইনে কেনাকাটার সময় প্রশ্ন থাকা স্বাভাবিক। কোনো কিছু বুঝতে অসুবিধা হলে আমাদের সঙ্গে যোগাযোগ করার সুযোগ থাকা উচিত।</p></article><article class="info-card"><h3>ধীরে, কিন্তু সঠিকভাবে এগোনো</h3><p>আমরা এমন প্রতিশ্রুতি দিতে চাই না যা বাস্তবে পূরণ করা সম্ভব নয়। ব্যবসা বড় করার চেয়ে দীর্ঘমেয়াদে মানুষের আস্থা ধরে রাখা আমাদের কাছে বেশি গুরুত্বপূর্ণ।</p></article></section>
<section class="wrap"><div class="care-note"><p class="eyebrow">আমাদের সীমারেখা</p><h2>আমরা যা বলি না</h2>
<p>আমরা বলব না—<strong><span class="refusal-q">"এটি আসল সোনা।"</span></strong> যদি এটি imitation বা City Gold jewellery হয়।</p>
<p>আমরা বলব না—<strong><span class="refusal-q">"আজই কিনুন, নইলে আর পাবেন না।"</span></strong> শুধু বিক্রি বাড়ানোর জন্য কৃত্রিম urgency তৈরি করে।</p>
<p>আমরা বলব না—<strong><span class="refusal-q">"সবাই আমাদের পছন্দ করে।"</span></strong> যদি তার পেছনে বাস্তব ও যাচাইযোগ্য customer evidence না থাকে।</p>
<p>আমরা বলব না—<strong><span class="refusal-q">"১০০% গ্যারান্টি।"</span></strong> যদি সেই গ্যারান্টির পরিষ্কার ও বাস্তব policy না থাকে।</p>
<p>আমাদের কাছে বিশ্বাস তৈরি হয় বড় বড় কথায় নয়—<strong>কথা ও কাজের মিল থেকে।</strong></p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">পথচলা</p>
  <h2>একটি ছোট শহর থেকে বড় স্বপ্ন</h2>
  <p>eMarket247-এর পথচলা শুরু হয়েছে ঠাকুরগাঁও থেকে। পরবর্তী লক্ষ্য সারা বাংলাদেশে আরও মানুষের কাছে পৌঁছানো—ঢাকা থেকে চট্টগ্রাম, রাজশাহী থেকে সিলেট, এবং দেশের আরও অনেক প্রান্তে। আর ভবিষ্যতের স্বপ্ন আরও বড়—একদিন বাংলাদেশের বাইরেও eMarket247-এর পরিচয় তৈরি করা। তবে সেই স্বপ্নের শুরুটা আমরা ভুলতে চাই না। <strong>কারণ eMarket247-এর গল্পের প্রথম অধ্যায় লেখা হয়েছে ঠাকুরগাঁওয়ে।</strong></p>
  <p>আজ আমরা যেখানে দাঁড়িয়ে আছি, সেটিই শেষ নয়। আরও ভালো product presentation, আরও পরিষ্কার product information, আরও সহজ online shopping experience এবং আরও শক্তিশালী customer support—প্রতিটি দিকেই ধীরে ধীরে উন্নতি করার লক্ষ্য রয়েছে।</p>
  <p>আমরা বড় হতে চাই। কিন্তু শুধু বড় একটি business হিসেবে নয়। <strong>একটি বাংলাদেশি jewellery brand হিসেবে, যার শুরুটা ছোট ছিল, কিন্তু যার সঙ্গে মানুষের আস্থা বড় হয়েছে।</strong></p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">সামনে পথ অনেক</p><h2>আমাদের সঙ্গে এই যাত্রায় থাকুন</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">eMarket247-এর গল্প এখনও লেখা হচ্ছে। আপনি যদি আমাদের কাছ থেকে জুয়েলারি কেনেন, কোনো কিছু জানতে চান, অথবা শুধু আমাদের এই ছোট উদ্যোগটির পথচলা দেখতে চান—আপনাকে স্বাগতম। <strong>আজকের ছোট উদ্যোগই হয়তো আগামী দিনের বড় বাংলাদেশি ব্র্যান্ডের শুরু।</strong></p></div><div class="section-cta"><a class="button button-dark" href="/bn/shop/">জুয়েলারি দেখুন</a><a class="button button-dark" href="/bn/contact/">যোগাযোগ করুন</a></div></section>`;

const EN = `
<section class="editorial-hero full-width-hero"><img class="hero-bg" src="/assets/images/editorial/About%20Us.webp" width="2048" height="1152" alt="The eMarket247 story and craft — it began in Thakurgaon" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> Our Story</p><h1>Our Story</h1><p>A homemaker's small initiative from Thakurgaon, growing into a jewellery destination — built slowly on clear information, honest expectations, and the trust of the people it serves.</p></div></div></section>
<section class="two-panel wrap"><figure><img src="/assets/images/editorial/About%20Us.webp" width="2048" height="1152" loading="lazy" alt="The eMarket247 story and craft"><figcaption>eMarket247 — it began in Thakurgaon</figcaption></figure><div>
  <p class="eyebrow">A small start</p>
  <h2>Every big story begins small</h2>
  <p>eMarket247 did not begin with a big showroom or a large investment. It began with the small initiative of a homemaker, <strong>Rozina Akter</strong> — from Thakurgaon, with limited means, driven by her own hard work and the wish to earn people's trust.</p>
  <p>At the start there was no big establishment, no large capital, no team. There was the courage to begin something small. Yet one thing mattered from day one — <strong>that the person who buys jewellery from her never loses their trust.</strong></p>
  <p>Choosing a piece of jewellery from a photo online is easy. The real challenge is making sure that when it arrives, the buyer still feels — <strong>"I bought it from the right place."</strong></p>
  <p>Today that small initiative has grown into <strong>an online community of 10,000+ Facebook followers</strong>. And the dream is bigger now — from Thakurgaon to all of Bangladesh, and one day, recognition for eMarket247 beyond the country too.</p>
</div></section>
<section class="founder-grid wrap"><blockquote class="about-quote"><p>"I didn't start with anything big. I started small. Carrying people's trust and my own hard work, I've come this far. Now my dream is to carry this small initiative from Thakurgaon to people across Bangladesh."</p><cite><strong>Rozina Akter</strong><span>Founder, eMarket247</span></cite></blockquote><figure class="founder-photo founder-photo-pending"><div class="founder-photo-frame"><span>Rozina Akter — Founder, eMarket247</span><small>Photo coming soon / ছবি শীঘ্রই আসছে</small></div></figure></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">The buyer's questions</p>
  <h2>Selling products is easy. Earning trust is not.</h2>
  <p>When buying jewellery online, a buyer naturally has a few questions —</p>
  <ol class="buyer-questions"><li>Will it look like the photo?</li><li>Is the product information clear?</li><li>What exactly am I buying?</li><li>Who do I talk to if something goes wrong?</li></ol>
  <p>We don't find these questions unusual. To us, they are the natural rights of an aware buyer.</p>
  <p>So eMarket247's aim is not only to show beautiful jewellery. We want every buyer to get as much clear information as possible before deciding — and to make that decision with confidence, on their own.</p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">What this initiative is</p>
  <h2>What eMarket247 means to Rozina</h2>
  <ol class="story-timeline">
<li><h3>Not just a shop</h3><p>eMarket247 is not just an online jewellery shop. It is an initiative where a homemaker is slowly trying to turn her small business into a bigger dream.</p></li>
<li><h3>Starting small is not a weakness</h3><p>Beginning within limited means, learning from mistakes, working at it every day and moving forward step by step — that is an essential part of this journey.</p></li>
<li><h3>Built step by step</h3><p>Reaching people after starting an online business from a small town doesn't happen in a day. Every order, every conversation, every new follower and every returning customer — they built this path slowly.</p></li>
</ol>
</div></section>
<section class="info-grid wrap"><div><p class="eyebrow">What we believe</p><h2>What we believe in</h2></div><article class="info-card"><h3>Clear information</h3><p>Getting information that helps you understand what you're buying matters. Our aim is to present, clearly, whatever product information can be verified and published.</p></article><article class="info-card"><h3>Honest expectations</h3><p>We never present City Gold or imitation jewellery as real gold. It is its own jewellery category, with its own beauty, use and value.</p></article><article class="info-card"><h3>Direct contact with people</h3><p>Questions are normal when shopping online. If anything is unclear, there should always be a way to reach us and ask.</p></article><article class="info-card"><h3>Slow, but in the right direction</h3><p>We don't want to make promises that can't actually be kept. Keeping people's trust over the long term matters more to us than growing fast.</p></article></section>
<section class="wrap"><div class="care-note"><p class="eyebrow">Where we draw the line</p><h2>What we don't say</h2>
<p>We won't say — <strong><span class="refusal-q">"This is real gold."</span></strong> If it is imitation or City Gold jewellery.</p>
<p>We won't say — <strong><span class="refusal-q">"Buy today or lose it forever."</span></strong> Creating artificial urgency just to push sales.</p>
<p>We won't say — <strong><span class="refusal-q">"Everyone loves us."</span></strong> Without real, verifiable customer evidence behind it.</p>
<p>We won't say — <strong><span class="refusal-q">"100% guarantee."</span></strong> Without a clear, real policy behind that guarantee.</p>
<p>For us, trust is not built on big words — <strong>it is built on words matching actions.</strong></p>
</div></section>
<section class="category-choose wrap"><div>
  <p class="eyebrow">The road ahead</p>
  <h2>A big dream from a small town</h2>
  <p>eMarket247's journey began in Thakurgaon. The next goal is to reach more people across Bangladesh — from Dhaka to Chattogram, Rajshahi to Sylhet, and many more corners of the country. And the future dream is bigger: one day, recognition for eMarket247 beyond Bangladesh. But we never want to forget where it started. <strong>Because the first chapter of eMarket247's story was written in Thakurgaon.</strong></p>
  <p>Where we stand today is not the end. Better product presentation, clearer product information, an easier online shopping experience and stronger customer support — we aim to improve on every front, step by step.</p>
  <p>We want to grow. But not just as a bigger business — <strong>as a Bangladeshi jewellery brand that started small, and grew with people's trust.</strong></p>
</div></section>
<section class="shop-contact-cta wrap"><div><p class="eyebrow">Much further to go</p><h2>Join us on this journey</h2><p style="color:var(--muted);font-size:15px;line-height:1.65;max-width:560px;margin:14px 0 0;">eMarket247's story is still being written. Whether you buy jewellery from us, want to know something, or simply want to follow this small initiative's path — you are welcome. <strong>Today's small initiative may be the beginning of tomorrow's big Bangladeshi brand.</strong></p></div><div class="section-cta"><a class="button button-dark" href="/en/shop/">Shop Jewellery</a><a class="button button-dark" href="/en/contact/">Contact Us</a></div></section>`;

const SEO = {
  "public_html/en/about/index.html": {
    title: "About Us | Our Story | eMarket247 — Jewellery Shop in Bangladesh",
    meta: "The eMarket247 story — started by homemaker Rozina Akter in Thakurgaon, built on clear information, honest expectations and people's trust.",
    ogTitle: "About Us | Our Story | eMarket247",
    h1: "Our Story",
  },
  "public_html/bn/about/index.html": {
    title: "আমাদের গল্প | eMarket247 — বাংলাদেশের জুয়েলারি শপ",
    meta: "eMarket247-এর গল্প — ঠাকুরগাঁও থেকে গৃহিণী রোজিনা আক্তারের ছোট উদ্যোগ, পরিষ্কার তথ্য, বাস্তব প্রত্যাশা ও মানুষের আস্থা নিয়ে এগিয়ে চলা।",
    ogTitle: "আমাদের গল্প | eMarket247",
    h1: "আমাদের গল্প",
  },
};

for (const [file, html] of [["public_html/en/about/index.html", EN], ["public_html/bn/about/index.html", BN]]) {
  let s = readFileSync(file, "utf8");
  const seo = SEO[file];
  const mainStart = s.indexOf('<main id="main">');
  const mainEnd = s.indexOf('</main>', mainStart);
  if (mainStart === -1 || mainEnd === -1) throw new Error(`main not found in ${file}`);
  s = s.slice(0, mainStart + '<main id="main">'.length) + html + s.slice(mainEnd);
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`);
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${seo.ogTitle}$2`);
  s = s.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${seo.meta}$2`);
  writeFileSync(file, s, "utf8");
  console.log(`${file}: rebuilt`);
}
