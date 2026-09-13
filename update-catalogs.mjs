import { readFile, writeFile } from "node:fs/promises";

// Final mapping: 27 unique matches
const mapping = {
  'src-001': 'emarket247-gold-interwoven-pattern-ring.webp',
  'src-006': 'emarket247-gold-tone-stone-detail-set-09.webp',
  'src-007': 'emarket247-gold-tone-circle-jewellery-set-07.webp',
  'src-010': 'emarket247-gold-lattice-dome-ring.webp',
  'src-011': 'emarket247-gold-infinity-crossed-band-ring.webp',
  'src-012': 'emarket247-gold-heart-ring-pair.webp',
  'src-013': 'emarket247-gold-double-heart-ring.webp',
  'src-014': 'emarket247-gold-braided-link-chain-bracelet.webp',
  'src-016': 'emarket247-gold-floral-charm-chain.webp',
  'src-017': 'emarket247-floral-gold-tone-necklace-04.webp',
  'src-018': 'emarket247-floral-gold-tone-necklace-18.webp',
  'src-019': 'emarket247-geometric-gold-tone-ring-19.webp',
  'src-020': 'emarket247-gold-tone-bangles-08.webp',
  'src-021': 'emarket247-gold-tone-cross-band-ring-10.webp',
  'src-022': 'emarket247-womens-gold-tone-ring-01.webp',
  'src-023': 'emarket247-pearl-style-gold-tone-set-06.webp',
  'src-024': 'emarket247-gold-tone-triple-bead-ring-12.webp',
  'src-025': 'emarket247-gold-tone-crossed-band-ring-11.webp',
  'src-026': 'emarket247-gold-tone-detail-ring-14.webp',
  'src-027': 'emarket247-gold-tone-floral-ring-13.webp',
  'src-028': 'emarket247-gold-tone-floral-ring-16.webp',
  'src-029': 'emarket247-gold-engraved-open-bangle.webp',
  'src-030': 'emarket247-gold-ornate-open-bangle.webp',
  'src-031': 'emarket247-gold-tone-teardrop-set-05.webp',
  'src-032': 'emarket247-gold-tone-earrings-pendant-set-03.webp',
  'src-046': 'emarket247-gold-beaded-charm-chain.webp',
  'src-047': 'emarket247-gold-dangling-bead-statement-necklace.webp',
};

async function updateCatalog(filePath, isEnglish) {
  const content = JSON.parse(await readFile(filePath, 'utf8'));
  let updated = 0;

  for (const product of content.products) {
    if (mapping[product.id]) {
      const fileName = mapping[product.id];
      const newSrc = `/assets/images/products/${fileName}`;
      const newSrcSet = `${newSrc}`;
      
      // Update image reference
      product.image.src = newSrc;
      product.image.srcset = newSrcSet;
      // Keep width/height as-is (will be actual dims of the new images)
      
      updated++;
      console.log(`  ${product.id}: ${fileName}`);
    }
  }

  await writeFile(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`${isEnglish ? 'English' : 'Bengali'} catalog: ${updated} products updated`);
}

console.log('Updating catalogs with 27 matched images...\n');
await updateCatalog('static-site/assets/data/catalog.en.json', true);
console.log();
await updateCatalog('static-site/assets/data/catalog.bn.json', false);
console.log('\n✓ Catalogs updated');
