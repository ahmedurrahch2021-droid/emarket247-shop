import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "static-site");
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
  for (const [label, pattern] of [["Home navigation", />Home<\/a>/], ["Occasion navigation", />Occasion(?:<span|<\/button)/], ["Contact navigation", />Contact<\/a>/]]) {
    if (relative.startsWith("en/") && !pattern.test(html)) errors.push(`${relative}: missing ${label}`);
  }
  if (!relative.endsWith("/index.html") && !/^(en|bn)\/index\.html$/.test(relative) && !/class="breadcrumb/.test(html)) errors.push(`${relative}: missing breadcrumb`);
}
for (const route of [
  "en/occasions/index.html", "en/occasions/wedding/index.html", "en/occasions/anniversary/index.html", "en/occasions/birthday/index.html", "en/categories/bridal-jewellery/index.html",
  "bn/occasions/index.html", "bn/occasions/wedding/index.html", "bn/occasions/anniversary/index.html", "bn/occasions/birthday/index.html", "bn/categories/bridal-jewellery/index.html",
]) {
  try { await stat(path.join(root, route)); } catch { errors.push(`missing audited route: ${route}`); }
}
for (const asset of ["assets/images/brand/emarket247-logo-transparent.png", "assets/images/brand/emarket247-favicon-master.png", "assets/images/editorial/emarket247-hero-vermilion-atelier.webp", "assets/data/catalog.en.json", "assets/data/catalog.bn.json", "robots.txt", "sitemap.xml", ".htaccess", "404.html"]) {
  try { await stat(path.join(root, asset)); } catch { errors.push(`missing package asset: ${asset}`); }
}

// Hostinger routing: an unknown URL must return a genuine 404, never a soft-404 homepage.
const htaccess = await readFile(path.join(root, ".htaccess"), "utf8");
if (!/^\s*ErrorDocument\s+404\s+\/404\.html\s*$/m.test(htaccess)) errors.push(".htaccess: missing ErrorDocument 404 /404.html");
if (/RewriteRule\s+\^\s+index\.html/.test(htaccess)) errors.push(".htaccess: single-page-application catch-all rewrite would create soft-404s");

// Every root-relative reference inside a served file must resolve to a file in the package.
const servedFiles = [];
async function walkAll(folder) {
  for (const entry of await readdir(folder)) {
    const file = path.join(folder, entry);
    const info = await stat(file);
    if (info.isDirectory()) await walkAll(file);
    else if (/\.(html|css|js|json|xml)$/.test(entry)) servedFiles.push(file);
  }
}
await walkAll(root);
for (const file of servedFiles) {
  const text = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  const targets = new Set();
  // href/src attributes, plus srcset/JSON candidate lists which hold several
  // comma-separated "url 600w" descriptors inside a single quoted value.
  for (const reference of text.match(/(?:href|src|srcset)="([^"]*)"|"(\/assets\/[^"]*)"/g) || []) {
    const value = reference.replace(/^(?:href|src|srcset)="/, "").replace(/^"/, "").replace(/"$/, "");
    for (const candidate of value.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url.startsWith("/") && !url.startsWith("//")) targets.add(url.split(/[?#]/)[0]);
    }
  }
  for (const target of targets) {
    const resolved = target.endsWith("/") ? path.join(root, target, "index.html") : path.join(root, target);
    try { await stat(resolved); } catch { errors.push(`${relative}: broken local reference ${target}`); }
  }
}
for (const filename of ["emarket247-jewellery-detail-01-600-square.webp", "emarket247-jewellery-detail-01-1200-square.webp"]) {
  try { await stat(path.join(root, "assets/images/products-square", filename)); } catch { errors.push(`missing catalog image asset: ${filename}`); }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML pages, language alternates, baseline metadata, accessibility skip links, and core static assets.`);
