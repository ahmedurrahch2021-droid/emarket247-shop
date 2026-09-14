import { readFileSync } from 'fs';
const c = readFileSync('public_html/en/products/emarket247-bangles-17/index.html', 'utf8');
console.log('has data-add-bag:', c.includes('data-add-bag='));
console.log('has data-product-title:', c.includes('data-product-title='));
console.log('has data-pdp-add-bag:', c.includes('data-pdp-add-bag='));
console.log('has id="pdp-add-bag":', c.includes('id="pdp-add-bag"'));
console.log('OLD_BTN_RE.test:', /<button([^>]*?)id="pdp-add-bag"([^>]*?)>/.test(c));
