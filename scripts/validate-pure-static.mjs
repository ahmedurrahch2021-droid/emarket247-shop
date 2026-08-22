import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = "/home/ubuntu/emarket247-hostinger-static";
const errors = [];
const htmlFiles = [];
async function walk(folder) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walk(file);
    else if (entry === "index.html") htmlFiles.push(file);
  }
}
await walk(root);
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (relative === "index.html") continue;
  for (const [label, pattern] of [
    ["lang", /<html lang="(?:en|bn)"/], ["title", /<title>[^<]+<\/title>/],
    ["description", /<meta name="description" content="[^"]+">/], ["canonical", /<link rel="canonical" href="https:\/\/emarket247\.shop\//],
    ["hreflang en", /hreflang="en"/], ["hreflang bn", /hreflang="bn"/], ["h1", /<h1>[^<]+<\/h1>/], ["skip link", /class="skip-link"/],
  ]) if (!pattern.test(html)) errors.push(`${relative}: missing ${label}`);
}
for (const asset of ["assets/images/brand/emarket247-logo-transparent.png", "assets/images/brand/emarket247-favicon-master.png", "assets/images/editorial/emarket247-hero-vermilion-atelier.webp", "assets/data/catalog.en.json", "assets/data/catalog.bn.json", "robots.txt", "sitemap.xml", ".htaccess"]) {
  try { await stat(path.join(root, asset)); } catch { errors.push(`missing package asset: ${asset}`); }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML pages, language alternates, baseline metadata, accessibility skip links, and core static assets.`);
