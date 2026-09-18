const fs = require('fs');
const bn = fs.readFileSync('F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/index.html', 'utf8');
let c = bn;
const ops = [];

// 1. BN occasion eyebrow + H2 + subhead (with newlines as in file)
const occOld = ' <p class="eyebrow">Meaningful Moments · বিশেষ ক্ষণ</p>\n    <h2>প্রতিটি অনুষ্ঠানের জন্য সেরা নির্বাচন</h2>\n    <p class="section-subhead">বিয়ের শুভ সূচনা থেকে উৎসবের আনন্দ—মডেলের সাজ দেখতে যেকোনো অলংকারে মাউস আনলে বা স্পর্শ করলে থেমে যাবে।</p>';
const occNew = '<p class="eyebrow">আপনার বিশেষ মুহূর্তের জন্য গহনা</p>\n    <h2>বিয়ে, ঈদ, পূজা ও প্রতিদিনের সাজের জন্য গহনা খুঁজুন</h2>\n    <p class="section-subhead">প্রতিটি অনুষ্ঠানের সাজ আলাদা। আপনার পোশাক, অনুষ্ঠান ও ব্যক্তিগত স্টাইলের সঙ্গে মানানসই গহনা বেছে নিতে কালেকশন দেখুন।</p>';
if (c.includes(occOld)) { c = c.replace(occOld, occNew); ops.push('occ ok'); }
else { ops.push('occ skip'); console.log('occ NOT found'); }

// 2. BN trust point 2
const t2Old = '<strong>সঠিক তথ্যের নিশ্চয়তা</strong><p>আমরা প্রতিটি পণ্যের সঠিক তথ্য ও আকার প্রদান করি, যাতে আপনি নিশ্চিন্তে বেছে নিতে পারেন।</p>';
const t2New = '<strong>অনুষ্ঠানের সঙ্গে মানানসই গহনা</strong><p>গহনার ধরন বা অনুষ্ঠান অনুযায়ী দেখুন এবং আপনার পোশাক ও স্টাইলের সঙ্গে মানানসই পছন্দটি করুন।</p>';
if (c.includes(t2Old)) { c = c.replace(t2Old, t2New); ops.push('trust2 ok'); }
else { ops.push('trust2 skip'); }

// 3. BN trust point 3 - dump exact around <b>03
const t3idx = c.indexOf('<b>03</b>');
if (t3idx >= 0) {
  const slice = c.substring(t3idx, t3idx + 250);
  console.log('t3 raw:', JSON.stringify(slice.substring(0, 200)));
  // Now find and replace trust point 3
  const t3Needle = '<strong>উভয় ভাষায় সেবার ব্যবস্থা</strong><p>আমাদের কালেকশন ও গ্রাহক সেবা—উভয়ই আপনি বাংলা বা ইংরেজি—যেকোনো ভাষায় গ্রহণ করতে পারবেন।</p>';
  const t3Replace = '<strong>হোয়াটসঅ্যাপ সাপোর্ট</strong><p>পণ্য নিয়ে কোনো প্রশ্ন আছে? অর্ডারের আগে বাংলায় বা ইংরেজিতে হোয়াটসঅ্যাপে আমাদের জিজ্ঞেস করুন।</p>';
  if (c.includes(t3Needle)) {
    c = c.replace(t3Needle, t3Replace);
    ops.push('trust3 ok');
  } else {
    ops.push('trust3 skip');
    console.log('t3 needle not found, checking current trust p3...');
    const cur = c.substring(t3idx, t3idx + 300);
    console.log('current t3:', JSON.stringify(cur.substring(0, 250)));
  }
}

fs.writeFileSync('F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/index.html', c, 'utf8');
console.log('ops:', ops);
