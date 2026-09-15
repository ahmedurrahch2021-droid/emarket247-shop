import fs from 'fs';

// Extract footer HTML from a page WITH footer-cols vs WITHOUT
const withCols = fs.readFileSync('public_html/en/delivery/index.html', 'utf8');
const withoutCols = fs.readFileSync('public_html/en/index.html', 'utf8');

const footerWith = withCols.match(/<footer[^>]*>[\s\S]{1,5000}?<\/footer>/i)?.[0] || 'NOT FOUND';
const footerWithout = withoutCols.match(/<footer[^>]*>[\s\S]{1,5000}?<\/footer>/i)?.[0] || 'NOT FOUND';

console.log('=== FOOTER WITH COLS (delivery) ===');
console.log(footerWith.substring(0, 3000));
console.log('\n\n=== FOOTER WITHOUT COLS (homepage) ===');
console.log(footerWithout.substring(0, 3000));
