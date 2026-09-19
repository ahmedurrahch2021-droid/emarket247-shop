// One-off: remove the 4-card guide-grid from the homepage City Gold Guide
// (FAQ section now covers this ground) and place the cards on the
// History of City Gold article pages (EN+BN), where they fit the
// "how it's made / how to judge quality" narrative.
import { readFileSync, writeFileSync } from "node:fs";

for (const lang of ["en", "bn"]) {
  // 1) Strip the guide-grid from the homepage
  const hf = `public_html/${lang}/index.html`;
  let h = readFileSync(hf, "utf8");
  const gs = h.indexOf('<div class="guide-grid">');
  if (gs >= 0) {
    const ge = h.indexOf('</div>', gs) + '</div>'.length;
    h = h.slice(0, gs) + h.slice(ge);
    writeFileSync(hf, h);
    console.log("guide-grid removed from homepage:", lang);
  } else {
    console.log("homepage: no guide-grid found:", lang);
  }

  // 2) Insert the cards into the article, after the "how a piece is made" section
  const af = `public_html/${lang}/history-of-city-gold/index.html`;
  let a = readFileSync(af, "utf8");
  if (a.includes('class="guide-grid"')) { console.log("article: cards already present:", lang); continue; }

  const cards = lang === "en"
    ? `<div class="guide-grid"><article class="guide-card"><h3>What is City Gold?</h3><p>City gold is the everyday Bangladeshi name for gold-tone fashion jewellery: a base metal — usually brass or a similar alloy — shaped into the design and finished with a gold-coloured electroplated layer. It offers the look of gold at a fraction of the price. The name covers a wide range of real quality, which is exactly why a buyer should know what to look for.</p></article><article class="guide-card"><h3>What elements make real city gold?</h3><p>Two layers, always: the <strong>base metal</strong> underneath (brass or a similar alloy — it gives the piece weight and strength) and the <strong>gold-tone finish</strong> on top (an electroplated layer that gives the colour). In better pieces the base is solid, not hollow, and the plating is applied evenly over every surface.</p></article><article class="guide-card"><h3>How are low-quality pieces made?</h3><p>Low-quality city gold usually fails in one of two ways: a very thin plating that wears through with daily friction, or a base alloy containing metals that react with sweat and moisture, causing discolouration from underneath. Cheaply made pieces often show both problems within weeks of daily wear.</p></article><article class="guide-card"><h3>How to detect real city gold?</h3><p><strong>Weight:</strong> a solid brass base feels noticeably heavier than a hollow or thin one. <strong>Finish:</strong> check edges and inner curves — plating wears thin first where pieces rub, and uneven colour there is an early warning. <strong>Ask:</strong> a seller who can tell you the base metal and how the piece is finished is a seller standing behind their product.</p></article></div>`
    : `<div class="guide-grid"><article class="guide-card"><h3>সিটি গোল্ড কী?</h3><p>সিটি গোল্ড বাংলাদেশে সোনালি রঙের ফ্যাশন গহনার পরিচিত নাম: বেস মেটাল — সাধারণত পিতল বা মিলে ধাতু — ডিজাইন অনুযায়ী গড়ে তার ওপর সোনালি রঙের ইলেক্ট্রোপ্লেটেড স্তর। সামান্য খরচে সোনার ভাব দেয়। কিন্তু এই নামের আড়ালে মানের বিশাল পরিসর লুকিয়ে — তাই ক্রেতার জানা দরকার কী দেখতে হবে।</p></article><article class="guide-card"><h3>আসল সিটি গোল্ড কী কী দিয়ে তৈরি?</h3><p>সবসময় দুটি স্তর: নিচে <strong>বেস মেটাল</strong> (পিতল বা মিলে ধাতু — এটিই দেয় ওজন ও মজবুতি) এবং ওপরে <strong>সোনালি রঙের ফিনিশ</strong> (ইলেক্ট্রোপ্লেটেড স্তর, যা রঙ দেয়)। ভালো মানের পিসে বেস শক্ত ও ঠাসা, ফাঁপা নয়, আর প্রলেপ প্রতিটি পৃষ্ঠে সমানভাবে বসে।</p></article><article class="guide-card"><h3>নিম্নমানের সিটি গোল্ড কীভাবে তৈরি হয়?</h3><p>নিম্নমানের সিটি গোল্ড সাধারণত দুইভাবে নষ্ট হয়: খুব পাতলা প্রলেপ, যা প্রতিদিনের ঘর্ষণে উঠে যায়; অথবা ঘাম ও আর্দ্রতায় প্রতিক্রিয়া করে এমন বেস অ্যালয়, যার কারণে নিচ থেকে দাগ পড়ে। সস্তায় তৈরি পিসে প্রতিদিন পরলে কয়েক সপ্তাহেই দুটো সমস্যাই দেখা যায়।</p></article><article class="guide-card"><h3>আসল সিটি গোল্ড চেনার উপায়?</h3><p><strong>ওজন:</strong> শক্ত পিতলের পিস ফাঁপা বা পাতলার চেয়ে বেশ ভারী লাগে। <strong>প্রলেপ:</strong> কিনারা আর ভেতরের বাঁকা জায়গা দেখুন — ঘর্ষণে প্রথমে সেখানেই প্রলেপ কমে, অসমান রঙ একটা সতর্কতা। <strong>জিজ্ঞাসা:</strong> যে বিক্রেতা বেস মেটাল ও ফিনিশিং বলতে পারে, সে-ই তার পণ্যের পেছনে দাঁড়ায়।</p></article></div>`;

  // Insert right before the care-note block inside .prose
  const anchor = '<div class="care-note">';
  if (!a.includes(anchor)) { console.error("article: care-note anchor missing:", lang); continue; }
  a = a.replace(anchor, cards + anchor);

  // The care-note pointed readers back to the homepage guide for these
  // checks — the cards now live on this page, so rewrite that line.
  if (lang === "en") {
    a = a.replace(
      /<h3>Judging a piece before you buy<\/h3><p>Our City Gold Guide on the homepage covers what to look for: weight, plating at the edges, and the questions worth asking any seller\.<\/p>/,
      `<h3>Judging a piece before you buy</h3><p>The cards above give you the buyer's checklist: weight, plating at the edges, and the questions worth asking any seller. Our homepage FAQ covers more of what buyers ask.</p>`
    );
  } else {
    a = a.replace(
      /<h3>কেনার আগে যাচাই<\/h3><p>হোমপেজের সিটি গোল্ড গাইডে আছে কী দেখবেন: ওজন, কিনারার প্রলেপ, আর যেকোনো বিক্রেতাকে করা উচিত প্রশ্নগুলো।<\/p>/,
      `<h3>কেনার আগে যাচাই</h3><p>ওপরের কার্ডগুলোই ক্রেতার চেকলিস্ট: ওজন, কিনারার প্রলেপ, আর যেকোনো বিক্রেতাকে করা উচিত প্রশ্নগুলো। ক্রেতাদের আরও প্রশ্নের উত্তর আছে হোমপেজের FAQ-তে।</p>`
    );
  }
  writeFileSync(af, a);
  console.log("cards added to article:", lang);
}
