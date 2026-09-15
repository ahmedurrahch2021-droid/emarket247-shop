import fs from 'fs';

// 1. Find the mobile nav HTML in the live page
const html = fs.readFileSync('public_html/en/delivery/index.html', 'utf8');
const htmlLines = html.split('\n');
for (let i = 0; i < htmlLines.length; i++) {
  if (htmlLines[i].includes('mobile-nav-icons')) {
    console.log(`Live page mobile-nav-icons at line ${i}:`);
    for (let j = i - 2; j < Math.min(i + 8, htmlLines.length); j++) {
      console.log(`  ${j}: ${htmlLines[j].trim()}`);
    }
    break;
  }
}

// 2. Check what generate-product-detail-pages.mjs produces for mobile nav
const pdpGen = fs.readFileSync('scripts/generate-product-detail-pages.mjs', 'utf8');
const pdpLines = pdpGen.split('\n');
for (let i = 0; i < pdpLines.length; i++) {
  if (pdpLines[i].includes('mobile-nav') || pdpLines[i].includes('wishlist') && pdpLines[i].includes('mobile')) {
    console.log(`\ngenerate-product-detail-pages.mjs mobile/wishlist at line ${i}: ${pdpLines[i].trim()}`);
    for (let j = i; j < Math.min(i + 5, pdpLines.length); j++) {
      console.log(`  ${j}: ${pdpLines[j].trim()}`);
    }
    break;
  }
}

// 3. Check if renderHeader in PDP generator has wishlist button vs link
for (let i = 0; i < pdpLines.length; i++) {
  if (pdpLines[i].includes('renderHeader') && pdpLines[i].includes('function')) {
    console.log(`\ngenerate-product-detail-pages.mjs renderHeader at line ${i}:`);
    for (let j = i; j < Math.min(i + 30, pdpLines.length); j++) {
      if (pdpLines[j].includes('wishlist') || pdpLines[j].includes('mobile') || pdpLines[j].includes('ICON') || pdpLines[j].includes('header-icon')) {
        console.log(`  ${j}: ${pdpLines[j].trim()}`);
      }
    }
    break;
  }
}

// 4. Summary of header sources
console.log('\n=== HEADER SOURCE SUMMARY ===');
console.log('apply-3-row-header.mjs: Full-page header generator (EN+BN), targets public_html/ AND static-site/');
console.log('_update-pdp-header.mjs: One-time patch for generate-product-detail-pages.mjs (targets that script only)');
console.log('generate-product-detail-pages.mjs: PDP-specific generator — renders product detail page body');
console.log('  -> Does NOT have 3-row header ICON constants');
console.log('  -> Does NOT have utility-row, main-header structure');
console.log('  -> Does it have ANY header at all?');
const hasHeader = pdpGen.includes('header class') || pdpGen.includes('site-header');
console.log('  -> Has site-header:', hasHeader);
