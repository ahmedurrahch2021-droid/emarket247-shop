/**
 * One-off script: PDP section remover
 * Last needed: Before T1 (legacy consolidation), when generate-product-detail-pages.mjs was active
 * Purpose: Stripped sections D-I from the PDP template to simplify product pages
 * Status: Obsolete — generate-product-detail-pages.mjs is now disabled (targeted static-site/)
 * Archived: 2026-09-17 during T2 (repository cleanup)
 */
const fs = require('fs');

let content = fs.readFileSync('scripts/generate-product-detail-pages.mjs', 'utf8');

const regexD = /<!-- SECTION D: Product Specifications -->[\s\S]*?(?=<!-- SECTION E: Product Story & Editorial Narrative -->)/;
const regexE = /<!-- SECTION E: Product Story & Editorial Narrative -->[\s\S]*?(?=<!-- SECTION F: Styling & Occasions -->)/;
const regexF = /<!-- SECTION F: Styling & Occasions -->[\s\S]*?(?=<!-- SECTION G: Delivery, Ordering & Payment Guidance -->)/;
const regexG = /<!-- SECTION G: Delivery, Ordering & Payment Guidance -->[\s\S]*?(?=<!-- SECTION H: Jewellery Care Guide -->)/;
const regexH = /<!-- SECTION H: Jewellery Care Guide -->[\s\S]*?(?=<!-- SECTION I: Frequently Asked Questions -->)/;
const regexI = /<!-- SECTION I: Frequently Asked Questions -->[\s\S]*?(?=<!-- SECTION J: Related Products -->)/;

const replacements = [
  { name: 'D', regex: regexD },
  { name: 'E', regex: regexE },
  { name: 'F', regex: regexF },
  { name: 'G', regex: regexG },
  { name: 'H', regex: regexH },
  { name: 'I', regex: regexI }
];

replacements.forEach(({ name, regex }) => {
  if (regex.test(content)) {
    content = content.replace(regex, '');
    console.log(`✓ Removed section ${name}`);
  } else {
    console.log(`✗ Section ${name} not found or already removed`);
  }
});

fs.writeFileSync('scripts/generate-product-detail-pages.mjs', content, 'utf8');
console.log('\nPDP template simplified');
