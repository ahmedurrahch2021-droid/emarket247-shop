/** Map the verified 48 original product photographs to non-destructive studio-treatment jobs. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const originalRoot = "/home/ubuntu/projects/emarket247-pandora-clone-7f5043cd";
const enhancedManifest = JSON.parse(await readFile(path.join(project, "research/enhanced-product-image-manifest.json"), "utf8"));
const catalog = JSON.parse(await readFile(path.join(project, "static-site/assets/data/catalog.en.json"), "utf8"));
const catalogById = new Map(catalog.products.map((product) => [product.id, product]));

const assets = enhancedManifest.images || enhancedManifest.assets || enhancedManifest.products || [];
if (assets.length !== 48) throw new Error(`Expected 48 verified catalog source records, found ${assets.length}.`);
const displayAssets = assets.slice(0, 47);
const reserveAsset = assets[47];
const jobs = displayAssets.map((asset, index) => {
  const number = String(index + 1).padStart(2, "0");
  const id = asset.asset_id || `src-${String(index + 1).padStart(3, "0")}`;
  const catalogProduct = catalogById.get(id) || {};
  const sourceFilename = asset.source_filename;
  return {
    id,
    index: index + 1,
    source_filename: sourceFilename,
    source_path: path.join(originalRoot, sourceFilename),
    target_filename: `emarket247-studio-product-${number}.png`,
    target_path: `/home/ubuntu/webdev-static-assets/studio-catalog-full/emarket247-studio-product-${number}.png`,
    catalog_category: catalogProduct.category || asset.category || "unassigned",
    catalog_title: catalogProduct.title || `Jewellery detail ${number}`,
  };
});

if (jobs.length !== 47) throw new Error(`Expected 47 display catalog jobs, found ${jobs.length}.`);
await mkdir(path.join(project, "research"), { recursive: true });
await writeFile(
  path.join(project, "research/studio-catalog-batch-jobs.json"),
  JSON.stringify({
    status: "ready-for-non-destructive-studio-treatment",
    source_count: jobs.length,
    reserve_catalog_record: reserveAsset.asset_id,
    reserve_source_filename: reserveAsset.source_filename,
    excluded_files: "One non-catalog image in the source folder is excluded because it is absent from the existing 48-record source manifest. The 48th verified catalog record is retained as a non-displayed reserve to meet the requested 47-product storefront scope.",
    jobs,
  }, null, 2) + "\n",
  "utf8",
);
console.log(`Created ${jobs.length} verified studio-treatment jobs.`);
