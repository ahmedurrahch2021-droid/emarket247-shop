/** Build a shareable price-request bundle from the verified static product catalog. */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const staticSite = path.join(project, "static-site");
const output = path.join(project, "dist", "eMarket247-client-price-request");
const imageOutput = path.join(output, "product-images-1200px");
const publishedBase = "https://jewelshop-3ofuxwg9.manus.space";
const catalog = JSON.parse(await readFile(path.join(staticSite, "assets", "data", "catalog.en.json"), "utf8"));

const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const categoryPairs = [
  ["Rings", "rings", "আংটি"],
  ["Earrings", "earrings", "কানের দুল"],
  ["Necklaces", "necklaces", "হার"],
  ["Bracelets", "bracelets", "ব্রেসলেট"],
  ["Bangles", "bangles", "চুড়ি"],
  ["Pendants", "pendants", "লকেট"],
  ["Jewellery Sets", "jewellery-sets", "জুয়েলারি সেট"],
  ["Gift Jewellery", "gift-jewellery", "উপহারের জুয়েলারি"],
];

await rm(output, { recursive: true, force: true });
await mkdir(imageOutput, { recursive: true });

const rows = [[
  "Record ID", "Temporary catalogue name", "Live image URL", "Download filename", "Correct product name (client)",
  "Approved category (client)", "Price in BDT (client)", "SKU (client)", "Material/specification (client)",
  "Stock / availability (client)", "Client notes"
]];

for (const product of catalog.products) {
  const sourceRelative = product.image.src.replace(/^\//, "");
  const source = path.join(staticSite, sourceRelative);
  const filename = path.basename(source);
  await cp(source, path.join(imageOutput, filename));
  rows.push([
    product.id,
    product.title,
    `${publishedBase}${product.image.src}`,
    filename,
    "", "", "", "", "", "", ""
  ]);
}

await writeFile(path.join(output, "eMarket247_product_price_request.csv"), `${rows.map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");

const categoryRows = categoryPairs.map(([english, slug, bengali]) =>
  `| ${english} / ${bengali} | ${publishedBase}/en/categories/${slug}/ | ${publishedBase}/bn/categories/${slug}/ |`
).join("\n");

await writeFile(path.join(output, "eMarket247_category_page_urls.md"), `# eMarket247 Category Page URLs\n\nThe category pages are already present as separate English and Bengali HTML routes.\n\n| Category | English page | Bengali page |\n|---|---|---|\n${categoryRows}\n\nThere are also complete index pages: [English Categories](${publishedBase}/en/categories/) and [Bengali Categories](${publishedBase}/bn/categories/).\n`, "utf8");

await writeFile(path.join(output, "README.md"), `# eMarket247 Client Price Request Package\n\nThis bundle has **48 high-resolution square product images** and one matching CSV record for every image. Send the CSV to the client. They should complete the blank client columns for the correct product name, category, price in BDT, SKU, material/specification, availability, and notes.\n\n## How to use the live image URLs\n\nEach CSV row includes a published image URL. The client can open each URL in a browser, or copy it into their reply beside the required price and product details. The URLs currently use the live project domain ${publishedBase}. If eMarket247.shop is later connected as the custom domain, only the domain prefix changes; the image path and filename stay the same.\n\n## Downloaded images\n\nThe product-images-1200px folder contains the 48 matching 1200px WebP product images. Their filenames exactly match the Download filename column in the CSV.\n\n## Category-page directory\n\nOpen eMarket247_category_page_urls.md for all eight English and Bengali category-page URLs. Each category is a separate page, even where a final product assignment is still waiting for client confirmation.\n\n## Asset locations in the website source\n\nThe website’s published product assets are stored at:\n\n- static-site/assets/images/products-square/ — final catalogue images used by the website: 48 products × 2 responsive WebP sizes.\n- static-site/assets/data/catalog.en.json and catalog.bn.json — the corresponding English and Bengali catalogue records.\n- static-site/en/categories/ and static-site/bn/categories/ — the individual category HTML page folders.\n\nThe supplied JPEG originals remain separately preserved and have not been overwritten.\n`, "utf8");

console.log(`Created ${catalog.products.length}-product client package at ${output}`);
