import fs from 'fs';

// Comprehensive footer inventory across all page types
const files = [
  'public_html/en/index.html',
  'public_html/bn/index.html',
  'public_html/en/shop/index.html',
  'public_html/bn/shop/index.html',
  'public_html/en/categories/bangles/index.html',
  'public_html/bn/categories/bangles/index.html',
  'public_html/en/products/emarket247-bangles-17/index.html',
  'public_html/bn/products/emarket247-bangles-17/index.html',
  'public_html/en/about/index.html',
  'public_html/bn/about/index.html',
  'public_html/en/contact/index.html',
  'public_html/bn/contact/index.html',
  'public_html/en/delivery/index.html',
  'public_html/bn/delivery/index.html',
  'public_html/en/refund/index.html',
  'public_html/bn/refund/index.html',
];

const results = [];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const hasFooter = html.includes('<footer');
  const footerClass = html.match(/<footer[^>]*class="([^"]+)"/)?.[1] || 'no-class';
  const newsletter = html.includes('newsletter') || html.includes('email') || html.includes('subscribe');
  const social = html.includes('facebook') || html.includes('instagram') || html.includes('social') || html.includes('twitter');
  const contact = html.includes('phone') || html.includes('contact');
  const whatsapp = html.includes('wa.me');
  const whatsappInFooter = html.match(/<footer[^>]*>[\s\S]{1,1000}?wa\.me/)?.[0]?.includes('wa.me');
  const brandLogo = html.match(/<footer[^>]*>[\s\S]{1,2000}?(brand-logo|footer-brand|brand.*logo)/i)?.[0] ? true : false;
  const copyright = html.includes('©') || html.includes('copyright');
  const quickLinks = html.includes('quick-link') || html.includes('footer-link') || html.includes('footer-nav');
  const footerCols = (html.match(/footer-col/g) || []).length;
  const paymentIcons = html.includes('payment') || html.includes('bKash') || html.includes('nagad');
  const privacyLink = html.includes('privacy') || html.includes('refund');
  const aboutInFooter = html.match(/<footer[^>]*>[\s\S]{1,3000}?(About|আমাদের)/)?.[0] ? true : false;
  results.push({
    file: f.replace('public_html/', ''),
    hasFooter,
    footerClass,
    newsletter,
    social,
    contact,
    whatsapp,
    whatsappInFooter,
    brandLogo,
    copyright,
    quickLinks,
    footerCols,
    paymentIcons,
    privacyLink,
  });
});

console.log('=== FOOTER INVENTORY ===\n');
console.log('PAGE'.padEnd(50), 'NL', 'SOC', 'CON', 'WA', 'WAF', 'LOGO', 'CR', 'QL', 'COL', 'PAY', 'PRIV');
console.log('-'.repeat(80));
results.forEach(r => {
  console.log(
    r.file.substring(0, 48).padEnd(50),
    r.newsletter ? 'Y' : 'N',
    r.social ? 'Y' : 'N',
    r.contact ? 'Y' : 'N',
    r.whatsapp ? 'Y' : 'N',
    r.whatsappInFooter ? 'Y' : 'N',
    r.brandLogo ? 'Y' : 'N',
    r.copyright ? 'Y' : 'N',
    r.quickLinks ? 'Y' : 'N',
    String(r.footerCols).padStart(3),
    r.paymentIcons ? 'Y' : 'N',
    r.privacyLink ? 'Y' : 'N',
  );
});

console.log('\n\n=== FOOTER GENERATOR SCRIPT ===');
try {
  const gen = fs.readFileSync('scripts/task2-footer-unify.mjs', 'utf8');
  console.log('task2-footer-unify.mjs exists: YES');
  const lines = gen.split('\n');
  const hasWrite = gen.includes('writeFile') || gen.includes('writeFileSync');
  const targetsPublic = gen.includes('public_html');
  const targetsStatic = gen.includes('static-site');
  const hasNewsletter = gen.includes('newsletter');
  const hasSocial = gen.includes('social') || gen.includes('facebook');
  const hasBrandLogo = gen.includes('brand-logo') || gen.includes('footer-brand');
  const hasPayment = gen.includes('payment') || gen.includes('bKash');
  console.log('  writes files:', hasWrite);
  console.log('  targets public_html:', targetsPublic);
  console.log('  targets static-site:', targetsStatic);
  console.log('  has newsletter:', hasNewsletter);
  console.log('  has social links:', hasSocial);
  console.log('  has brand logo:', hasBrandLogo);
  console.log('  has payment icons:', hasPayment);
} catch (e) {
  console.log('task2-footer-unify.mjs: NOT FOUND');
}
