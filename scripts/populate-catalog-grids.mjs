/**
 * Legacy catalogue-grid writer retired during taxonomy reconciliation.
 *
 * The previous implementation inferred product categories from published URL
 * slugs. Several preserved URLs contain historical category words that do not
 * describe the actual products, so rerunning it could place necklaces, rings
 * and earrings into the Bangles category.
 *
 * Catalogue identity and taxonomy now live in:
 *   public_html/assets/data/catalog.taxonomy.json
 *
 * EN/BN catalogue parity, the 27 published URL sets and category assignments
 * are enforced by scripts/validate-public-html.mjs. Existing static grids remain
 * snapshots until a marker-based publisher is implemented from that manifest.
 * This script intentionally writes nothing.
 */

console.error(
  "Catalogue-grid generation is disabled: the legacy writer inferred taxonomy from historical URL slugs."
);
console.error(
  "Use catalog.taxonomy.json as the canonical mapping and run npm test before publishing catalogue changes."
);
process.exitCode = 1;
