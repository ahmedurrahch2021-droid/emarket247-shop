const mapping = {
  'emarket247-gold-beaded-charm-chain.webp': 'src-046',
  'emarket247-gold-braided-link-chain-bracelet.webp': 'src-014',
  'emarket247-gold-dangling-bead-statement-necklace.webp': 'src-047',
  'emarket247-gold-double-heart-ring.webp': 'src-013',
  'emarket247-gold-engraved-open-bangle.webp': 'src-029',
  'emarket247-gold-floral-charm-chain.webp': 'src-016',
  'emarket247-gold-heart-ring-pair.webp': 'src-012',
  'emarket247-gold-infinity-crossed-band-ring.webp': 'src-011',
  'emarket247-gold-interwoven-pattern-ring.webp': 'src-001',
  'emarket247-gold-lattice-dome-ring.webp': 'src-010',
  'emarket247-gold-ornate-open-bangle.webp': 'src-030',
  'emarket247-floral-gold-tone-necklace-02.webp': 'src-046',
  'emarket247-floral-gold-tone-necklace-04.webp': 'src-017',
  'emarket247-floral-gold-tone-necklace-18.webp': 'src-018',
  'emarket247-geometric-gold-tone-ring-19.webp': 'src-019',
  'emarket247-gold-tone-bangles-08.webp': 'src-020',
  'emarket247-gold-tone-circle-jewellery-set-07.webp': 'src-007',
  'emarket247-gold-tone-cross-band-ring-10.webp': 'src-021',
  'emarket247-gold-tone-crossed-band-ring-11.webp': 'src-025',
  'emarket247-gold-tone-detail-ring-14.webp': 'src-026',
  'emarket247-gold-tone-drop-jewellery-15.webp': 'src-032',
  'emarket247-gold-tone-earrings-pendant-set-03.webp': 'src-032',
  'emarket247-gold-tone-floral-ring-13.webp': 'src-027',
  'emarket247-gold-tone-floral-ring-16.webp': 'src-028',
  'emarket247-gold-tone-stone-detail-set-09.webp': 'src-006',
  'emarket247-gold-tone-teardrop-set-05.webp': 'src-031',
  'emarket247-gold-tone-triple-bead-ring-12.webp': 'src-024',
  'emarket247-pearl-style-gold-tone-set-06.webp': 'src-023',
  'emarket247-womens-gold-tone-ring-01.webp': 'src-022',
};

console.log('=== PHASE 3A IMAGE MAPPING ===');
console.log('Total images:', Object.keys(mapping).length);
console.log('\nImage to Product Mapping:');
Object.entries(mapping).forEach(([file, srcId]) => {
  console.log(`  ${file} -> ${srcId}`);
});

// Find issues
const srcCounts = {};
Object.values(mapping).forEach(src => {
  srcCounts[src] = (srcCounts[src] || 0) + 1;
});
const dups = Object.entries(srcCounts).filter(([_, c]) => c > 1);
if (dups.length > 0) {
  console.log('\n⚠ DUPLICATE MAPPINGS:');
  dups.forEach(([src, count]) => {
    const files = Object.entries(mapping).filter(([_, s]) => s === src).map(([f]) => f);
    console.log(`  ${src}: ${files.join(', ')}`);
  });
}

// Unmapped products
const mapped = new Set(Object.values(mapping));
const unmapped = [];
for (let i = 1; i <= 47; i++) {
  const id = `src-${String(i).padStart(3, '0')}`;
  if (!mapped.has(id)) unmapped.push(id);
}
console.log('\nProducts without images:', unmapped.length);
if (unmapped.length <= 20) {
  unmapped.forEach(id => console.log(`  ${id}`));
}
