const fs = require('fs');
const en = fs.readFileSync('F:/EMARKET247/Project 011/emarket247-shop-main/public_html/en/index.html', 'utf8');
const bn = fs.readFileSync('F:/EMARKET247/Project 011/emarket247-shop-main/public_html/bn/index.html', 'utf8');

const checks = [
  // EN checks
  ['EN: meta description (City Gold)', 'City Gold jewellery in Bangladesh'],
  ['EN: meta title', 'City Gold Jewellery Shop in Bangladesh'],
  ['EN: OG title', 'City Gold Jewellery Shop in Bangladesh'],
  ['EN: utility tagline', 'City Gold Jewellery'],
  ['EN: utility tagline BAD (COD/refund)', 'Refund within 15 days'],
  ['EN: hero H1', 'City Gold Jewellery for Every Occasion'],
  ['EN: hero eyebrow', 'City Gold Jewellery</strong>'],
  ['EN: hero supporting copy', 'Beautifully detailed jewellery'],
  ['EN: hero CTA', 'Shop Jewellery'],
  ['EN: slide 2 eyebrow', 'Gold-Inspired Moments'],
  ['EN: slide 2 H', 'Jewellery for Weddings, Eid, Puja'],
  ['EN: slide 2 CTA', 'Shop by Occasion'],
  ['EN: slide 3 eyebrow', 'Everyday Elegance'],
  ['EN: slide 3 H', 'Beautiful Details for Everyday'],
  ['EN: slide 3 CTA', 'Shop Everyday Jewellery'],
  ['EN: category eyebrow', 'Shop by Jewellery Type'],
  ['EN: category H2', 'City Gold Jewellery: Earrings'],
  ['EN: occasion eyebrow', 'Jewellery for Your Special'],
  ['EN: occasion H2', 'Find Jewellery for Weddings'],
  ['EN: truth-line GOOD', 'Clear information. Real product'],
  ['EN: truth-line BAD OLD', 'should know exactly what you are ordering'],
  ['EN: two-panel eyebrow', 'For Your Most Important'],
  ['EN: two-panel H2', 'Bridal Jewellery That Completes'],
  ['EN: puja eyebrow', 'Durga Puja Jewellery'],
  ['EN: puja H2', 'Get Ready for the Festival'],
  ['EN: puja BAD (year)', 'Puja 2026'],
  ['EN: trust eyebrow', 'Why Shop With Us'],
  ['EN: trust H2', 'Clear Details. Real Choices'],
  ['EN: trust p1', 'Clear Product Information'],
  ['EN: trust p2', 'Jewellery for Real Occasions'],
  ['EN: trust p3', 'WhatsApp Support'],
  ['EN: trust BAD (old p1)', 'Photographic Integrity'],
  // BN checks
  ['BN: meta description', 'City Gold জুয়েলারি কিনুন'],
  ['BN: meta title', 'City Gold জুয়েলারি শপ'],
  ['BN: utility BAD (রিফান্ড)', 'রিফান্ড'],
  ['BN: utility GOOD', 'City Gold জুয়েলারি'],
  ['BN: occasion eyebrow', 'আপনার বিশেষ মুহূর্তের জন্য গহনা'],
  ['BN: occasion H2', 'বিয়ে, ঈদ, পূজা'],
  ['BN: truth-line GOOD', 'পরিষ্কার তথ্য। পণ্যের বাস্তব বিবরণ'],
  ['BN: truth-line OLD BAD', 'অর্ডার করার আগেই পণ্যের স্বচ্ছ'],
  ['BN: two-panel eyebrow', 'আপনার জীবনের বিশেষ দিনের জন্য'],
  ['BN: two-panel H2', 'বিয়ের সাজ সম্পূর্ণ করতে বেছে নিন ব্রাইডাল'],
  ['BN: puja eyebrow', 'দুর্গাপূজার গহনা'],
  ['BN: puja H2', 'উৎসবের সাজে যোগ করুন সোনালি আভা'],
  ['BN: puja BAD (year)', 'পূজা ২০২৬'],
  ['BN: trust eyebrow', 'কেন eMarket247 থেকে কিনবেন'],
  ['BN: trust H2', 'পরিষ্কার তথ্য। পছন্দের স্বাধীনতা'],
  ['BN: trust p2 NEW', 'অনুষ্ঠানের সঙ্গে মানানসই গহনা'],
  ['BN: trust p3 NEW', 'হোয়াটসঅ্যাপ সাপোর্ট'],
];

console.log('=== HOMEPAGE AUDIT ===\n');
let ok = 0, miss = 0;
for (const [label, needle] of checks) {
  const src = label.startsWith('BN:') ? bn : en;
  const found = src.includes(needle);
  if (found) { ok++; console.log('OK  ' + label); }
  else { miss++; console.log('MISS ' + label); }
}
console.log('\n' + ok + ' OK, ' + miss + ' MISSING');
