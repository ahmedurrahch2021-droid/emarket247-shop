/** Refine unpriced Bengali catalog copy without inventing product specifications. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const catalogPath = path.join(project, "static-site", "assets", "data", "catalog.bn.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

const labels = {
  "jewellery-detail": "জুয়েলারি আইটেম",
  bracelets: "ব্রেসলেট",
  necklaces: "হার",
  bangles: "চুড়ি",
  earrings: "কানের দুল",
};

for (const product of catalog.products) {
  const number = new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2, useGrouping: false }).format(Number(product.id.replace("src-", "")));
  const label = labels[product.category] || "জুয়েলারি আইটেম";
  product.categoryLabel = label;
  product.title = `${label} ${number}`;
  product.status = "তথ্য যাচাই চলছে";
  product.image.alt = `${product.title}-এর ছবি। নকশা ও মূল্য যাচাই শেষে প্রকাশ করা হবে।`;
  product.image.caption = "পণ্যের তথ্য যাচাইাধীন — মূল্য পরে যোগ করা হবে।";
}

catalog.status = "মূল্য-ছাড়া পণ্যের তথ্য যাচাইাধীন";
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
