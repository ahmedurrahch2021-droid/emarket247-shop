/**
 * Legacy product-page generator intentionally disabled.
 *
 * Why:
 * - it targeted the retired static-site/ tree instead of public_html/;
 * - it embedded an unapproved fixed price and misleading Offer data;
 * - it could overwrite bilingual fallback PDPs with stale shared chrome.
 *
 * The approved architecture is static-first hybrid. Live product facts are
 * maintained in MySQL and rendered by public_html/product.php. Existing EN/BN
 * static product pages remain URL-preserving fallbacks and must not be
 * regenerated until a reviewed publisher can consume authoritative product
 * data without inventing prices, stock, materials, availability, or claims.
 *
 * This explicit failure is safer than silently writing stale storefront files.
 */

console.error(
  "Product-page generation is disabled: the legacy script targeted static-site and contained unapproved commerce fallbacks."
);
console.error(
  "Use the database-backed product workflow. Build a reviewed public_html publisher before re-enabling static PDP generation."
);
process.exitCode = 1;
