#!/usr/bin/env node
/**
 * Step 4a — Catalog Brand Cleanup.
 * Removes "City Gold Jewellery" from all SEO titles in the bilingual catalogs.
 * Replaces it with the correct brand: "eMarket247".
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'static-site/assets/data/catalog.en.json',
  'static-site/assets/data/catalog.bn.json',
];

async function cleanCatalog(filePath) {
  const fullPath = path.join(ROOT, filePath);
  const content = await readFile(fullPath, 'utf8');
  const data = JSON.parse(content);

  let changed = 0;
  data.products.forEach(p => {
    if (p.seo && p.seo.title) {
      const oldTitle = p.seo.title;
      // Remove stale brand and clean up separators
      const newTitle = oldTitle
        .replace(/ \| City Gold Jewellery — eMarket247/g, ' | eMarket247')
        .replace(/ \| City Gold Jewellery/g, ' | eMarket247')
        .trim();

      if (oldTitle !== newTitle) {
        p.seo.title = newTitle;
        changed++;
      }
    }
  });

  if (changed > 0) {
    await writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: ${changed} products cleaned.`);
  } else {
    console.log(`No changes needed for ${filePath}.`);
  }
}

async function main() {
  for (const f of FILES) {
    await cleanCatalog(f);
  }
}

main().catch(console.error);
