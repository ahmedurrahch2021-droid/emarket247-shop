const fs = require('fs');
const path = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html/en/index.html';
let c = fs.readFileSync(path, 'utf8');

const replacements = [
  // Slide 1 - eyebrow, H1 is already set, copy + CTA
  [
    '<strong class="brand-name">eMarket247</strong> Fashion & Jewellery</p><h1>City Gold Jewellery for Every Occasion in Bangladesh</h1><p>Whether for everyday wear or a special gift, explore our curated edit.</p><a class="button button-dark" href="/en/shop/">Explore the edit <span>→</span></a>',
    '<strong class="brand-name">eMarket247</strong> City Gold Jewellery</p><h1>City Gold Jewellery for Every Occasion in Bangladesh</h1><p>Beautifully detailed jewellery for weddings, Eid, Puja, celebrations and everyday style. Explore earrings, bangles, necklaces, rings and complete sets — with clear product information before you order.</p><a class="button button-dark" href="/en/shop/">Shop Jewellery <span>→</span></a>'
  ],
  // Slide 3 - eyebrow, headline, copy, CTA
  [
    '<p class="eyebrow">Everyday wear</p><h1>Style for every day.</h1><p>Small details. Subtle shine. Explore pieces for work, leisure and daily dressing.</p><a class="button button-dark" href="/en/shop/">Shop the collection <span>→</span></a>',
    '<p class="eyebrow">Everyday Elegance</p><h1>Beautiful Details for Everyday Style.</h1><p>Choose lighter, versatile pieces for work, outings and everyday wear, with product details that help you decide before buying.</p><a class="button button-dark" href="/en/shop/">Shop Everyday Jewellery <span>→</span></a>'
  ],
  // Category section - eyebrow, H2, subhead
  [
    '<p class="eyebrow">All Categories · সকল ক্যাটাগরি</p><h2>Explore Every Silhouette in Motion</h2><p class="section-subhead">Discover our complete collection across each jewellery category—hover or tap any piece to pause.</p>',
    '<p class="eyebrow">Shop by Jewellery Type</p><h2>City Gold Jewellery: Earrings, Bangles, Necklaces, Rings &amp; More</h2><p class="section-subhead">Looking for a particular type of jewellery? Browse the collection by category and find the design that fits your style, outfit and occasion.</p>'
  ],
  // Occasion section - eyebrow, H2, subhead
  [
    '<p class="eyebrow">Meaningful Moments · বিশেষ ক্ষণ</p><h2>Curated for every occasion</h2><p class="section-subhead">From bridal vows to festive mornings—hover any piece to view it worn on model.</p>',
    '<p class="eyebrow">Jewellery for Your Special Moments</p><h2>Find Jewellery for Weddings, Eid, Puja &amp; Everyday Style</h2><p class="section-subhead">Different occasions call for different styles. Explore jewellery selected around the moments, outfits and celebrations that matter to you.</p>'
  ],
  // Truth-line
  [
    '<aside class="truth-line"><span>We believe you should know exactly what you are ordering before you order.</span></aside>',
    '<aside class="truth-line"><span>Clear information. Real product details. A simpler way to buy jewellery online.</span></aside>'
  ],
  // Two-panel - eyebrow, H2, copy, CTA (uses bare &)
  [
    '<p class="eyebrow">Bridal & Occasion</p><h2>For the day the details matter most.</h2><p>Selecting jewellery for an important day should feel thoughtful. Explore our guidance to find pieces that balance style and occasion.</p><a class="text-link" href="/en/occasions/bridal/">Explore the edit →</a>',
    '<p class="eyebrow">For Your Most Important Days</p><h2>Bridal Jewellery That Completes the Look</h2><p>From necklace sets and earrings to traditional-inspired statement pieces, discover jewellery designed to complement sarees, lehengas and your wedding-day style.</p><a class="text-link" href="/en/occasions/bridal/">Shop Bridal Jewellery →</a>'
  ],
  // Puja eyebrow + H2 + strong label + subhead
  [
    '<p class="eyebrow">Puja 2026</p><h2>Prepare for the festival season.</h2><div><strong>Pre-Puja discovery</strong><p>Explore ideas for upcoming moments, ensuring each choice is thoughtful and calm.</p>',
    '<p class="eyebrow">Durga Puja Jewellery</p><h2>Get Ready for the Festival Season</h2><div><strong>Gold-inspired jewellery for Puja</strong><p>Discover gold-inspired jewellery to pair with sarees, traditional outfits and festive looks throughout the Puja season.</p>'
  ],
  // Puja CTA
  [
    '<a class="button button-outline" href="/en/occasions/puja/">Explore collection →</a>',
    '<a class="button button-outline" href="/en/occasions/puja/">Shop Puja Jewellery →</a>'
  ],
  // Trust grid eyebrow + H2
  [
    '<p class="eyebrow">Why eMarket247</p><h2>We start with detail, not promises.</h2>',
    '<p class="eyebrow">Why Shop With Us</p><h2>Clear Details. Real Choices. Helpful Support Before You Buy.</h2>'
  ],
  // Trust point 1
  [
    '<strong>Photographic Integrity</strong><p>We present our pieces through studio photography so you can see the detail before you talk to us.</p>',
    '<strong>Clear Product Information</strong><p>See the available product details, materials, design information and care guidance before ordering.</p>'
  ],
  // Trust point 2
  [
    '<strong>Informed decision making</strong><p>We provide clear specifications so you can choose with confidence.</p>',
    '<strong>Jewellery for Real Occasions</strong><p>Browse by jewellery type or occasion to find pieces that fit your outfit and the moment.</p>'
  ],
  // Trust point 3
  [
    '<strong>Bilingual service</strong><p>Our catalogue and customer support offer the same guidance in both languages.</p>',
    '<strong>WhatsApp Support</strong><p>Have a question about a product? Contact us on WhatsApp and ask in Bangla or English before placing your order.</p>'
  ]
];

let applied = 0;
let skipped = 0;
for (const [oldStr, newStr] of replacements) {
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    applied++;
    console.log('APPLIED:', oldStr.substring(0, 70));
  } else {
    skipped++;
    console.log('SKIPPED:', oldStr.substring(0, 70));
  }
}

fs.writeFileSync(path, c, 'utf8');
console.log('\nTotal applied:', applied, '| Skipped:', skipped);
