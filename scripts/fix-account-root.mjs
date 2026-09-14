import fs from 'fs';
const root = 'F:/EMARKET247/Project 011/emarket247-shop-main/public_html';
const file = root + '/account/index.html';
const html = fs.readFileSync(file, 'utf8');

const CANONICAL_FOOTER = `<footer class="site-footer"><section class="newsletter"><div><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2></div><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Submit">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p></form></section><div class="footer-main"><div><img src="/assets/images/brand/emarket247-logo-transparent.png" width="180" height="94" alt="eMarket247 Fashion & Jewellery"><p>A modern destination for jewellery that carries the moment.</p></div><div><h3>Discover</h3><a href="/en/shop/">Shop</a><a href="/en/categories/">Categories</a><a href="/en/occasions/puja/">Puja</a><a href="/en/occasions/gifts/">Gifts</a></div><div><h3>Care</h3><a href="/en/care/">Care & support</a><a href="/en/guides/">Guides</a><a href="/en/contact/">Contact</a></div><div><h3>Information</h3><a href="/en/about/">About</a><a href="/en/privacy/">Privacy</a><a href="/en/terms/">Terms</a></div></div><div class="footer-bottom"><p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p><p>Built with product care, clear detail, and responsible publishing.</p></div></footer>`;

if (!html.includes('class="site-footer"')) {
  // Append footer before closing </body>
  const newHtml = html.replace('</body>', CANONICAL_FOOTER + '</body>');
  fs.writeFileSync(file, newHtml, 'utf8');
  console.log('✅ Footer added to account/index.html');
} else {
  console.log('Footer already present in account/index.html');
}
