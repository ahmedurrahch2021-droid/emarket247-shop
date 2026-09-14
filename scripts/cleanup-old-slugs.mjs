/**
 * cleanup-old-slugs.mjs
 * Deletes the old (now-duplicate) product folders after migration
 */
import { rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = 'F:/EMARKET247/Project 011/emarket247-shop-main';
const OLD_SLUGS = [
  'emarket247-bangles-17', 'emarket247-bangles-18', 'emarket247-bangles-19',
  'emarket247-bangles-23', 'emarket247-bangles-24', 'emarket247-bangles-25',
  'emarket247-bangles-26', 'emarket247-bangles-27', 'emarket247-bangles-28',
  'emarket247-jewellery-detail-01', 'emarket247-jewellery-detail-06',
  'emarket247-jewellery-detail-07', 'emarket247-jewellery-detail-10',
  'emarket247-jewellery-detail-11', 'emarket247-jewellery-detail-12',
  'emarket247-jewellery-detail-13', 'emarket247-jewellery-detail-31',
];
const LANGS = ['en', 'bn'];
let removed = 0;
let skipped = 0;

for (const lang of LANGS) {
  for (const slug of OLD_SLUGS) {
    const dir = join(ROOT, 'public_html', lang, 'products', slug);
    if (!existsSync(dir)) continue;

    // Verify new folder exists before deleting old one
    const newSlugMap = {
      'emarket247-bangles-17': 'emarket247-necklaces-17',
      'emarket247-bangles-18': 'emarket247-necklaces-18',
      'emarket247-bangles-19': 'emarket247-rings-19',
      'emarket247-bangles-23': 'emarket247-earrings-23',
      'emarket247-bangles-24': 'emarket247-rings-24',
      'emarket247-bangles-25': 'emarket247-rings-25',
      'emarket247-bangles-26': 'emarket247-rings-26',
      'emarket247-bangles-27': 'emarket247-rings-27',
      'emarket247-bangles-28': 'emarket247-rings-28',
      'emarket247-jewellery-detail-01': 'emarket247-rings-01',
      'emarket247-jewellery-detail-06': 'emarket247-earrings-06',
      'emarket247-jewellery-detail-07': 'emarket247-earrings-07',
      'emarket247-jewellery-detail-10': 'emarket247-rings-10',
      'emarket247-jewellery-detail-11': 'emarket247-rings-11',
      'emarket247-jewellery-detail-12': 'emarket247-rings-12',
      'emarket247-jewellery-detail-13': 'emarket247-rings-13',
      'emarket247-jewellery-detail-31': 'emarket247-pendants-31',
    };
    const newSlug = newSlugMap[slug];
    const newDir = join(ROOT, 'public_html', lang, 'products', newSlug);

    if (!existsSync(newDir)) {
      console.log(`⚠ SKIP — new folder missing: ${lang}/products/${newSlug} (old: ${slug})`);
      skipped++;
      continue;
    }

    rmSync(dir, { recursive: true, force: true });
    removed++;
    console.log(`✓ Removed: ${lang}/products/${slug}`);
  }
}

console.log(`\nDone: ${removed} old folders removed, ${skipped} skipped.`);
