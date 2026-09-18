const fs = require('fs');

const bnPath = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/index.html';
let c = fs.readFileSync(bnPath, 'utf8');
const ops = [];

// 1. BN occasion eyebrow + H2 + subhead
// Use regex to handle any dash/whitespace variations
const occRe = / <p class="eyebrow">Meaningful Moments · বিশেষ ক্ষণ<\/p>\s*\n?\s*<h2>প্রতিটি অনুষ্ঠানের জন্য সেরা নির্বাচন<\/h2>\s*\n?\s*<p class="section-subhead">বিয়ের শুভ সূচনা থেকে উৎসবের আনন্দ—মডেলের সাজ দেখতে যেকোনো অলংকারে মাউস আনলে বা স্পর্শ করলে থেমে যাবে।<\/p>/;
const occNew = '<p class="eyebrow">আপনার বিশেষ মুহূর্তের জন্য গহনা</p>\n    <h2>বিয়ে, ঈদ, পূজা ও প্রতিদিনের সাজের জন্য গহনা খুঁজুন</h2>\n    <p class="section-subhead">প্রতিটি অনুষ্ঠানের সাজ আলাদা। আপনার পোশাক, অনুষ্ঠান ও ব্যক্তিগত স্টাইলের সঙ্গে মানানসই গহনা বেছে নিতে কালেকশন দেখুন।</p>';
if (occRe.test(c)) {
  c = c.replace(occRe, occNew);
  ops.push('occ ok');
} else {
  ops.push('occ skip');
}

// 2. BN trust point 2
const t2Re = /<strong>সঠিক তথ্যের নিশ্চয়তা<\/strong><p>আমরা প্রতিটি পণ্যের সঠিক তথ্য ও আকার প্রদান করি, যাতে আপনি নিশ্চিন্তে বেছে নিতে পারেন।<\/p>/;
const t2New = '<strong>অনুষ্ঠানের সঙ্গে মানানসই গহনা</strong><p>গহনার ধরন বা অনুষ্ঠান অনুযায়ী দেখুন এবং আপনার পোশাক ও স্টাইলের সঙ্গে মানানসই পছন্দটি করুন।</p>';
if (t2Re.test(c)) {
  c = c.replace(t2Re, t2New);
  ops.push('trust2 ok');
} else {
  ops.push('trust2 skip');
}

// 3. BN trust point 3 — em-dash may vary, use flexible regex
const t3Re = /<strong>উভয় ভাষায় সেবার ব্যবস্থা<\/strong><p>আমাদের কালেকশন ও গ্রাহক সেবা[—\u2014\u2013-]+উভয়ই আপনি বাংলা বা ইংরেজি[—\u2014\u2013-]+যেকোনো ভাষায় গ্রহণ করতে পারবেন।<\/p>/;
const t3New = '<strong>হোয়াটসঅ্যাপ সাপোর্ট</strong><p>পণ্য নিয়ে কোনো প্রশ্ন আছে? অর্ডারের আগে বাংলায় বা ইংরেজিতে হোয়াটসঅ্যাপে আমাদের জিজ্ঞেস করুন।</p>';
if (t3Re.test(c)) {
  c = c.replace(t3Re, t3New);
  ops.push('trust3 ok');
} else {
  ops.push('trust3 skip');
  // dump the actual trust p3 to see what we have
  const idx = c.indexOf('<b>03</b>');
  const slice = c.substring(idx, idx + 200);
  console.log('trust3 raw:', JSON.stringify(slice));
}

fs.writeFileSync(bnPath, c, 'utf8');
console.log('ops:', ops.join(', '));
