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
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const favicon = html.match(/<link rel="icon"[^>]+href="([^"]+)"/)?.[1];
  const wishlistBtn = html.includes('data-wishlist-toggle');
  const hasUtility = html.includes('utility-row');
  const hasBreadcrumb = html.includes('breadcrumb');
  const hasMainMenu = html.includes('main-nav');
  const hasBrand = html.match(/class="brand"[^>]+href="([^"]+)"/)?.[1];
  const searchPlaceholder = html.match(/placeholder="([^"]+)"/)?.[1];
  const hasShopLink = html.includes('/en/shop/') || html.includes('/bn/shop/');
  const mobileWishlistLink = html.match(/href="\/[^/]+\/wishlist\/"/)?.[0];
  console.log(`\n=== ${f} ===`);
  console.log(`lang: ${lang}`);
  console.log(`title: ${title}`);
  console.log(`canonical: ${canonical}`);
  console.log(`description: ${desc ? desc.substring(0, 80) : 'MISSING'}`);
  console.log(`og:title: ${ogTitle}`);
  console.log(`og:url: ${ogUrl}`);
  console.log(`favicon: ${favicon}`);
  console.log(`wishlist-toggle button: ${wishlistBtn}`);
  console.log(`mobile wishlist link (broken): ${mobileWishlistLink || 'none'}`);
  console.log(`utility-row: ${hasUtility}`);
  console.log(`breadcrumb: ${hasBreadcrumb}`);
  console.log(`main-nav: ${hasMainMenu}`);
  console.log(`brand href: ${hasBrand}`);
  console.log(`search placeholder: ${searchPlaceholder}`);
  console.log(`shop link present: ${hasShopLink}`);
});
