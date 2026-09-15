import fs from 'fs';

const files = [
  'public_html/en/index.html',
  'public_html/bn/index.html',
  'public_html/en/categories/bangles/index.html',
  'public_html/bn/categories/bangles/index.html',
  'public_html/en/products/emarket247-bangles-17/index.html',
  'public_html/bn/products/emarket247-bangles-17/index.html',
];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const hasFooter = html.includes('<footer');
  const footerClass = html.match(/<footer[^>]*class="([^"]+)"/)?.[1] || 'no-class';
  const hasFooterBrand = html.includes('footer-brand') || html.includes('brand-logo');
  const hasNewsletter = html.includes('newsletter') || html.includes('email');
  const hasSocial = html.includes('social') || html.includes('facebook') || html.includes('instagram');
  const hasContact = html.includes('contact') || html.includes('phone');
  const hasWhatsappFooter = html.includes('wa.me');
  const footerCols = (html.match(/footer-col/g) || []).length;
  const productCard = html.includes('product-card') || html.includes('pdp-card') || html.includes('catalog-card');
  const hasWishlistCard = html.includes('data-wishlist-card') || html.includes('wishlist-card');
  const hasPriceOnRequest = html.includes('Price on request') || html.includes('মূল্য জানতে');
  console.log(`\n=== ${f} ===`);
  console.log(`footer present: ${hasFooter}`);
  console.log(`footer class: ${footerClass}`);
  console.log(`footer brand logo: ${hasFooterBrand}`);
  console.log(`newsletter: ${hasNewsletter}`);
  console.log(`social links: ${hasSocial}`);
  console.log(`contact info: ${hasContact}`);
  console.log(`whatsapp in footer: ${hasWhatsappFooter}`);
  console.log(`footer columns: ${footerCols}`);
  console.log(`product card markup: ${productCard}`);
  console.log(`wishlist card attr: ${hasWishlistCard}`);
  console.log(`price on request: ${hasPriceOnRequest}`);
});
