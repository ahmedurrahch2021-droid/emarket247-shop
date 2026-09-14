import fs from 'fs';
const root = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html';
const files = ['en/occasions/puja/index.html', 'bn/occasions/puja/index.html'];
for (const f of files) {
  const html = fs.readFileSync(root + '/' + f, 'utf8');
  const price = html.match(/৳\s*350\s*[-–]\s*6[\s,]*000[^<"]*/g);
  console.log(f + ': fabricated price matches = ' + (price ? JSON.stringify(price) : 'none'));
  // Also check BN numeric pattern
  const bnPrice = html.match(/৳\s*৩৫০[^<"]*/g);
  if (bnPrice) console.log('  BN fabricated: ' + JSON.stringify(bnPrice));
}
