// One-off: generate the "History of City Gold" article page (EN+BN) from the
// care-page pattern, and wire footer links + sitemap entries.
// Historical facts sourced from Wikipedia (Electroplating, Gilding, Vermeil,
// Costume jewelry) — verified Sept 2026. No eMarket247 product claims.
import { readFileSync, writeFileSync } from "node:fs";

const enTitle = "The History of City Gold — How Plated Jewellery Began | eMarket247";
const enMeta = "Where city gold comes from: 4,000 years of gilded jewellery, the 1805 invention of electroplating, and how today's gold-tone pieces are made. A plain-language history.";
const bnTitle = "সিটি গোল্ডের ইতিহাস — প্রলেপ গহনার শুরু কোথায় | eMarket247";
const bnMeta = "সিটি গোল্ড কোথা থেকে এলো: চার হাজার বছরের গিল্ডেড গহনা, ১৮০৫ সালে ইলেক্ট্রোপ্লেটিংয়ের উদ্ভাবন এবং আজকের সোনালি গহনা কীভাবে তৈরি হয় — সহজ ভাষায়।";

const enBody = `<section class="page-hero wrap simple"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> City Gold Guide</p><h1>The History of City Gold</h1><p>Gold-coloured jewellery on a base metal is not a modern shortcut — it is one of the oldest techniques in jewellery making, refined over four thousand years. This is its story, told plainly.</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="Gold-tone jewellery editorial image" loading="lazy"><figcaption>The city gold story</figcaption></figure></section>

<section class="prose wrap">
<h2>The idea is ancient: gold on the outside</h2>
<p>People have wanted the look of gold without its price for as long as gold has been treasured. The simplest answer — hammering thin gold foil over another surface — appears in Homer's <em>Odyssey</em> and in treasures from ancient Ur dating back over 4,000 years. Ancient Egyptian craftsmen gilded wood and metals on a large scale, and by the 4th century BC metalworkers were <strong>fire-gilding</strong>: bonding a gold-mercury mixture onto bronze and silver, then heating the mercury away. That method dominated for more than two thousand years — beautiful, but dangerous, because mercury fumes poisoned the artisans who worked with it.</p>

<h2>The breakthrough: electricity puts on the gold</h2>
<p>The modern technique behind every city gold piece arrived in <strong>1805</strong>, when the Italian chemist <strong>Luigi Valentino Brugnatelli</strong> used Alessandro Volta's new voltaic pile to deposit gold onto metal by electric current — the first electroplating. His work was suppressed by the French Academy of Sciences and sat unused for about thirty years. In <strong>1840</strong>, <strong>George and Henry Elkington</strong> of Birmingham, England, took the first electroplating patents — after John Wright discovered that potassium cyanide worked as an electrolyte for gold and silver — and built the industry that made plated wares affordable for ordinary households.</p>

<h2>From Victorian industry to "city gold"</h2>
<p>Through the late 19th century, mass production and electric generators let workshops plate brass, nickel and other base metals in bulk, and costume jewellery spread across Europe and America — jewellery made with inexpensive materials that anyone could wear. That same idea, adapted by workshops across Asia, is what Bangladesh today calls <strong>city gold</strong>: a brass or alloy base shaped into the design, finished with a gold-tone electroplated layer.</p>

<h2>How a city gold piece is made</h2>
<p>The workshop process is short to describe: cast or stamp the base-metal form; polish it smooth; clean it thoroughly (plating only bonds to clean metal); then immerse it in a plating bath, where electric current deposits the gold-tone layer evenly over every surface. The differences between a piece that lasts and one that fades come down to the quality of the base alloy, how thickly and carefully the layer is deposited, and how the finished piece is handled.</p>

<h2>What the standards say — and who watches quality</h2>
<p>Plating thickness is treated seriously in the trade. In the United States, for example, a piece may only be called <strong>vermeil</strong> if its core is sterling silver and the gold layer is at least 2½ microns thick — a reminder that "gold-coloured" covers a wide range of real quality. There is no single international authority for fashion jewellery; quality is judged by the buyer's own checks (weight, finish at the edges, an honest seller who names the base metal) and by trade standards bodies such as national jewellery associations and consumer-protection agencies. The most reliable expert, in practice, is a seller who explains exactly what a piece is made of — which is why every eMarket247 product page describes its design's details, and the final price is confirmed personally on WhatsApp before you order.</p>

<div class="care-note"><p class="eyebrow">Continue the guide</p><h3>Judging a piece before you buy</h3><p>Our City Gold Guide on the homepage covers what to look for: weight, plating at the edges, and the questions worth asking any seller.</p><p><a class="button button-outline" href="/en/#city-gold-guide">Back to the City Gold Guide <span>→</span></a> <a class="button button-outline" href="/en/how-to-order/">How ordering works <span>→</span></a></p></div>
</section>`;

const bnBody = `<section class="page-hero wrap simple"><div><p class="eyebrow"><strong class="brand-name">eMarket247</strong> সিটি গোল্ড গাইড</p><h1>সিটি গোল্ডের ইতিহাস</h1><p>বেস মেটালের ওপর সোনালি গহনা — এটি কোনো আধুনিক শর্টকাট নয়, বরং গহনা তৈরির সবচেয়ে প্রাচীন কৌশলগুলোর একটি, চার হাজার বছর ধরে পরিমার্জিত। এই তার সহজ ভাষায় বলা গল্প।</p></div><figure><img src="/assets/images/editorial/emarket247-gifting-puja-editorial.webp" width="2304" height="1536" alt="সোনালি গহনার এডিটোরিয়াল ছবি" loading="lazy"><figcaption>সিটি গোল্ডের গল্প</figcaption></figure></section>

<section class="prose wrap">
<h2>পুরোনো ধারণা: বাইরে সোনা</h2>
<p>সোনা যত দিনের প্রিয়, তার দাম ছাড়াই সোনার ভাব পাওয়ার চেষ্টা তত দিনের। সবচেয়ে সহজ উত্তর — পাতলা সোনার ফয়েল অন্য পৃষ্ঠে ঠোকা — হোমারের <em>ওডিসি</em>-তে এবং প্রাচীন উরের ধন-সম্পদে পাওয়া যায়, যার বয়স চার হাজার বছরেরও বেশি। প্রাচীন মিশরীয় কারিগররা কাঠ ও ধাতুতে বড় আকারে গিল্ডিং করতেন; আর খ্রিস্টপূর্ব চতুর্থ শতকে ধাতুকর্মীরা <strong>ফায়ার-গিল্ডিং</strong> আবিষ্কার করেন: সোনা-পারদের মিশ্রণ ব্রোঞ্জ ও রুপোতে লাগিয়ে তাপ দিয়ে পারদ উড়িয়ে দেওয়া। দুই হাজার বছরেরও বেশি সময় এই পদ্ধতিই প্রধান ছিল — সুন্দর, কিন্তু বিপজ্জনক, কারণ পারদের ধোঁয়া কারিগরদের বিষাক্ত করত।</p>

<h2>যুগান্তকারী উদ্ভাবন: বিদ্যুৎ লাগাল সোনা</h2>
<p>আজকের প্রতিটি সিটি গোল্ড গহনার পেছনের প্রযুক্তিটি এলো <strong>১৮০৫</strong> সালে, যখন ইতালীয় রসায়নবিদ <strong>লুইজি ভালেন্তিনো ব্রুনিয়াতেল্লি</strong> আলেসান্দ্রো ভোল্তার নতুন ভোল্টায়িক পাইল ব্যবহার করে বিদ্যুৎপ্রবাহে ধাতুতে সোনা জমা করলেন — প্রথম ইলেক্ট্রোপ্লেটিং। ফরাসি বিজ্ঞান একাডেমি তাঁর কাজ দমিয়ে রাখে, আর প্রায় ত্রিশ বছর এটি অব্যবহৃত থাকে। <strong>১৮৪০</strong> সালে ইংল্যান্ডের বার্মিংহামের <strong>জর্জ ও হেনরি এলকিংটন</strong> প্রথম ইলেক্ট্রোপ্লেটিং পেটেন্ট পান — জন রাইটের আবিষ্কারের পর, যিনি দেখান পটাশিয়াম সায়ানাইড সোনা ও রুপোর প্রলেপে কার্যকর ইলেকট্রোলাইট — এবং গড়ে তোলেন সেই শিল্প, যা প্রলেপ-করা জিনিস সাধারণ মানুষের নাগালে এনে দেয়।</p>

<h2>ভিক্টোরিয়ান শিল্প থেকে "সিটি গোল্ড"</h2>
<p>উনিশ শতকের শেষভাগে ব্যাপক উৎপাদন ও বৈদ্যুতিক জেনারেটর কারখানাগুলোকে বড় আকারে পিতল, নিকেলসহ বিভিন্ন বেস মেটালে প্রলেপ দিতে সহায়তা করে, আর কসটিউম জুয়েলারি ইউরোপ-আমেরিকায় ছড়িয়ে পড়ে — সস্তা উপকরণে তৈরি গহনা, যা সবাই পরতে পারে। একই ধারণা এশিয়ার কারিগররা নিজেদের মতো মানিয়ে নেন — আজ বাংলাদেশ যাকে বলে <strong>সিটি গোল্ড</strong>: ডিজাইন অনুযায়ী গড়া পিতল বা অ্যালয়ের ভিত, তার ওপর ইলেক্ট্রোপ্লেটেড সোনালি স্তর।</p>

<h2>সিটি গোল্ড গহনা তৈরি হয় যেভাবে</h2>
<p>কারখানার প্রক্রিয়া বলতে কম: বেস মেটালের ফর্ম ঢালাই বা স্ট্যাম্প করা; মসৃণ করে পালিশ করা; ভালোভাবে পরিষ্কার করা (পরিষ্কার ধাতুতেই প্রলেপ বাঁধে); তারপর প্লেটিং বাথে ডুবিয়ে বিদ্যুৎপ্রবাহে সোনালি স্তর প্রতিটি পৃষ্ঠে সমানভাবে জমানো। কোন গহনা টেকে আর কোনটা রঙ হারায় — তা নির্ভর করে বেস অ্যালয়ের মান, স্তরটি কত পুরু ও কত যত্নে জমানো হয়েছে, আর শেষ ধাপের হাতে-কলমের ওপর।</p>

<h2>মানদণ্ড কী বলে — আর মান কারা দেখেন</h2>
<p>প্রলেপের পুরুত্ব বাণিজ্যে গুরুত্ব পায়। যুক্তরাষ্ট্রে উদাহরণ দিলে, কোনো পিসকে <strong>ভার্মেইল</strong> বলা যাবে কেবল তখনই যখন ভেতরটা স্টার্লিং সিলভার এবং সোনার স্তর কমপক্ষে ২.৫ মাইক্রন পুরু — মনে রাখার মতো কথা যে "সোনালি রঙ" বলতে বাস্তবে বড় মানের পরিসর বোঝায়। ফ্যাশন জুয়েলারির জন্য একটিমাত্র আন্তর্জাতিক কর্তৃপক্ষ নেই; মান যাচাই হয় ক্রেতার নিজের পরীক্ষায় (ওজন, কিনারার প্রলেপ, বেস মেটালের নাম বলতে পারা সৎ বিক্রেতা) এবং জাতীয় জুয়েলারি অ্যাসোসিয়েশন ও ভোক্তা অধিকার সংস্থার মতো সংস্থার মানদণ্ডে। বাস্তবে সবচেয়ে নির্ভরযোগ্য বিশেষজ্ঞ সেই বিক্রেতা, যিনি পিসটি ঠিক কী দিয়ে তৈরি সেটা ব্যাখ্যা করেন — তাই প্রতিটি eMarket247 পণ্য পেজে ডিজাইনের বিবরণ দেওয়া থাকে, আর চূড়ান্ত দাম হোয়াটসঅ্যাপে ব্যক্তিগতভাবে নিশ্চিত করা হয়।</p>

<div class="care-note"><p class="eyebrow">গাইড চালিয়ে যান</p><h3>কেনার আগে যাচাই</h3><p>হোমপেজের সিটি গোল্ড গাইডে আছে কী দেখবেন: ওজন, কিনারার প্রলেপ, আর যেকোনো বিক্রেতাকে করা উচিত প্রশ্নগুলো।</p><p><a class="button button-outline" href="/bn/#city-gold-guide">সিটি গোল্ড গাইডে ফিরে যান <span>→</span></a> <a class="button button-outline" href="/bn/how-to-order/">অর্ডারের নিয়ম <span>→</span></a></p></div>
</section>`;

// --- Build EN page from care-page template ---
const tmpl = readFileSync("public_html/en/care/index.html", "utf8");
const bnTmpl = readFileSync("public_html/bn/care/index.html", "utf8");

function buildPage(tpl, { title, meta, lang, body, navPath }) {
  let s = tpl;
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  s = s.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta}"`);
  s = s.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  s = s.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta}"`);
  s = s.replace(/(rel="canonical" href=")[^"]*(")/, `$1https://emarket247.shop/${lang}/history-of-city-gold/$2`);
  s = s.replace(/(rel="alternate" hreflang=")en(" href=")[^"]*(")/, `$1en$2https://emarket247.shop/en/history-of-city-gold/$3`);
  s = s.replace(/(rel="alternate" hreflang=")bn(" href=")[^"]*(")/, `$1bn$2https://emarket247.shop/bn/history-of-city-gold/$3`);
  s = s.replace(/(rel="alternate" hreflang=")x-default(" href=")[^"]*(")/, `$1x-default$2https://emarket247.shop/$3`);
  s = s.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://emarket247.shop/${lang}/history-of-city-gold/$2`);
  // Replace main content between <main and </main>
  const mainStart = s.indexOf("<main");
  const mainEnd = s.indexOf("</main>");
  s = s.slice(0, mainStart) + `<main id="main">` + body + `</main>` + s.slice(mainEnd + 7);
  // Swap JSON-LD names/urls
  s = s.replace(/"url":"https:\/\/emarket247\.shop\/[a-z]+\/care\/"/, `"url":"https://emarket247.shop/${lang}/history-of-city-gold/"`);
  s = s.replace(/https:\/\/emarket247\.shop\/[a-z]+\/care\/#webpage/, `https://emarket247.shop/${lang}/history-of-city-gold/#webpage`);
  s = s.replace(/https:\/\/emarket247\.shop\/[a-z]+\/care\/#breadcrumb/, `https://emarket247.shop/${lang}/history-of-city-gold/#breadcrumb`);
  s = s.replace(/"item":"https:\/\/emarket247\.shop\/[a-z]+\/care\/"/, `"item":"https://emarket247.shop/${lang}/history-of-city-gold/"`);
  return s;
}

const enPage = buildPage(tmpl, { title: enTitle, meta: enMeta, lang: "en", body: enBody });
const bnPage = buildPage(bnTmpl, { title: bnTitle, meta: bnMeta, lang: "bn", body: bnBody });

// Fix lang attribute and breadcrumb/JSON-LD page names for BN
const bnFixed = bnPage
  .replace(/<html lang="en">/, '<html lang="bn">')
  .replace(/"name":"Care \| eMarket247"/g, `"name":"${bnTitle}"`);

const enFixed = enPage.replace(/"name":"Care \| eMarket247"/g, `"name":"${enTitle}"`);

writeFileSync("public_html/en/history-of-city-gold/index.html", enFixed);
writeFileSync("public_html/bn/history-of-city-gold/index.html", bnFixed);
console.log("pages written");

// --- Footer links on all pages ---
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
const walk = (d, o = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, o);
    else if (p.endsWith(".html")) o.push(p);
  }
  return o;
};
let linked = 0;
for (const f of walk("public_html")) {
  const norm = f.split(path.sep).join("/");
  if (norm.includes("history-of-city-gold")) continue;
  let s = readFileSync(f, "utf8");
  if (s.includes("/history-of-city-gold/")) continue;
  const isBN = norm.includes("/bn/");
  const label = isBN ? "সিটি গোল্ডের ইতিহাস" : "History of City Gold";
  // Insert after the how-to-order footer link if present, else before </footer>-close nav
  const href = isBN ? "/bn/history-of-city-gold/" : "/en/history-of-city-gold/";
  const htoHref = isBN ? "/bn/how-to-order/" : "/en/how-to-order/";
  const htoAnchor = new RegExp(`(<a href="${htoHref.replace(/\//g, "\\/")}"[^>]*>[\\s\\S]*?</a>)`);
  if (htoAnchor.test(s)) {
    s = s.replace(htoAnchor, `$1<a href="${href}">${label}</a>`);
  } else continue;
  writeFileSync(f, s);
  linked++;
}
console.log("footer links added:", linked);
