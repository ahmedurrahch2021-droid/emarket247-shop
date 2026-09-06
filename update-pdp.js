const fs = require('fs');

let content = fs.readFileSync('scripts/generate-product-detail-pages.mjs', 'utf8');

const regexD = /<!-- SECTION D: Product Specifications -->[\s\S]*?(?=<!-- SECTION E: Product Story & Editorial Narrative -->)/;
const regexE = /<!-- SECTION E: Product Story & Editorial Narrative -->[\s\S]*?(?=<!-- SECTION F: Styling & Occasions -->)/;
const regexF = /<!-- SECTION F: Styling & Occasions -->[\s\S]*?(?=<!-- SECTION G: Delivery, Ordering & Payment Guidance -->)/;
const regexG = /<!-- SECTION G: Delivery, Ordering & Payment Guidance -->[\s\S]*?(?=<!-- SECTION H: Jewellery Care Guide -->)/;
const regexH = /<!-- SECTION H: Jewellery Care Guide -->[\s\S]*?(?=<!-- SECTION I: Frequently Asked Questions -->)/;
const regexI = /<!-- SECTION I: Frequently Asked Questions -->[\s\S]*?(?=<!-- SECTION J: Related Products -->)/;

content = content.replace(regexD, '');
// Keep E and F as they are probably useful for editorial/marketing, but wait - the plan says "Replace separate 'Specifications', 'Care Guide', and 'FAQ' sections..."
// Let's replace D, G, H, I. 
