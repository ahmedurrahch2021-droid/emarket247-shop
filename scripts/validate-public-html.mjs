import { readdir, readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(project, "public_html");
const errors = [];
const warnings = [];
const catalogues = {};

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(folder, out = []) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await walk(file, out);
    else out.push(file);
  }
  return out;
}

function sameValues(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

if (!(await exists(root))) {
  console.error("ERROR: public_html was not found.");
  process.exit(1);
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const jsFiles = files.filter((file) => file.endsWith(".js"));
const phpFiles = files.filter((file) => file.endsWith(".php"));
const publicPages = htmlFiles.filter((file) => {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  return /^(en|bn)\//.test(rel) && !/^((en|bn)\/(admin|account|studio-pilot)\/)/.test(rel);
});

for (const file of publicPages) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const lang = rel.startsWith("bn/") ? "bn" : "en";
  const otherLang = lang === "en" ? "bn" : "en";
  const counterpartRel = rel.replace(new RegExp(`^${lang}/`), `${otherLang}/`);

  if (!new RegExp(`<html[^>]+lang=["']${lang}["']`, "i").test(html)) errors.push(`${rel}: missing or incorrect html lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${rel}: missing title`);
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) errors.push(`${rel}: missing meta description`);
  if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/emarket247\.shop\//i.test(html)) errors.push(`${rel}: missing canonical URL`);
  if (!new RegExp(`hreflang=["']${otherLang}["']`, "i").test(html)) errors.push(`${rel}: missing ${otherLang} hreflang`);
  if (!/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i.test(html)) errors.push(`${rel}: missing h1`);
  if (!(await exists(path.join(root, counterpartRel)))) errors.push(`${rel}: missing ${otherLang} counterpart ${counterpartRel}`);

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref.startsWith("/") || ref.startsWith("//") || ref.startsWith("/api/")) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean || clean === "/") continue;
    const candidate = path.join(root, clean);
    const resolved = path.extname(clean) ? candidate : path.join(candidate, "index.html");
    if (!(await exists(resolved))) errors.push(`${rel}: broken local reference ${clean}`);
  }
}

for (const lang of ["en", "bn"]) {
  const file = path.join(root, "assets", "data", `catalog.${lang}.json`);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(parsed.products)) errors.push(`catalog.${lang}.json: products must be an array`);
    else catalogues[lang] = parsed.products;
  } catch (error) {
    errors.push(`catalog.${lang}.json: invalid JSON (${error.message})`);
  }
}

let taxonomy;
try {
  taxonomy = JSON.parse(await readFile(path.join(root, "assets/data/catalog.taxonomy.json"), "utf8"));
  if (!Array.isArray(taxonomy.products)) errors.push("catalog.taxonomy.json: products must be an array");
  if (!taxonomy.categories || typeof taxonomy.categories !== "object") errors.push("catalog.taxonomy.json: categories must be an object");
} catch (error) {
  errors.push(`catalog.taxonomy.json: invalid JSON (${error.message})`);
}

if (catalogues.en && catalogues.bn) {
  const enKeys = catalogues.en.map((product) => `${product.id}:${product.slug}`);
  const bnKeys = catalogues.bn.map((product) => `${product.id}:${product.slug}`);
  if (!sameValues(enKeys, bnKeys)) errors.push("catalog EN/BN product ID and slug parity failed");
}

if (taxonomy?.products && taxonomy?.categories && catalogues.en && catalogues.bn) {
  const expectedCount = taxonomy.publishedProductCount;
  if (expectedCount !== taxonomy.products.length) {
    errors.push(`catalog.taxonomy.json: publishedProductCount is ${expectedCount}, but ${taxonomy.products.length} products are listed`);
  }
  if (expectedCount !== 27) errors.push(`catalog.taxonomy.json: expected 27 published products, found ${expectedCount}`);

  for (const field of ["id", "sku", "slug"]) {
    const duplicates = duplicateValues(taxonomy.products.map((product) => product[field]));
    if (duplicates.length) errors.push(`catalog.taxonomy.json: duplicate ${field} values: ${duplicates.join(", ")}`);
  }

  const taxonomySlugs = taxonomy.products.map((product) => product.slug);
  const taxonomyBySlug = new Map(taxonomy.products.map((product) => [product.slug, product]));

  for (const item of taxonomy.products) {
    if (!taxonomy.categories[item.category]) {
      errors.push(`catalog.taxonomy.json: ${item.slug} uses unknown category ${item.category}`);
      continue;
    }

    for (const lang of ["en", "bn"]) {
      const record = catalogues[lang].find((product) => product.slug === item.slug);
      if (!record) {
        errors.push(`catalog.${lang}.json: missing published product ${item.slug}`);
        continue;
      }
      if (record.id !== item.id) errors.push(`catalog.${lang}.json: ${item.slug} ID must be ${item.id}`);
      if (record.status !== "ready") errors.push(`catalog.${lang}.json: ${item.slug} must have status ready`);
      if (record.category !== item.category) errors.push(`catalog.${lang}.json: ${item.slug} category must be ${item.category}`);
      const expectedLabel = taxonomy.categories[item.category][lang];
      if (record.categoryLabel !== expectedLabel) errors.push(`catalog.${lang}.json: ${item.slug} categoryLabel must be ${expectedLabel}`);
      if (!record.title || typeof record.title !== "string") errors.push(`catalog.${lang}.json: ${item.slug} needs a localized title`);
      if (!record.image?.src) errors.push(`catalog.${lang}.json: ${item.slug} needs an image source`);
      if (record.sku != null && record.sku !== item.sku) errors.push(`catalog.${lang}.json: ${item.slug} SKU conflicts with ${item.sku}`);
    }

    const enRecord = catalogues.en.find((product) => product.slug === item.slug);
    const bnRecord = catalogues.bn.find((product) => product.slug === item.slug);
    if (enRecord?.image?.src && bnRecord?.image?.src && enRecord.image.src !== bnRecord.image.src) {
      errors.push(`catalog EN/BN image mismatch for ${item.slug}`);
    }
  }

  for (const lang of ["en", "bn"]) {
    const readySlugs = catalogues[lang].filter((product) => product.status === "ready").map((product) => product.slug);
    if (!sameValues(readySlugs, taxonomySlugs)) errors.push(`catalog.${lang}.json: ready products must match the 27-product taxonomy manifest`);

    const productRoot = path.join(root, lang, "products");
    const publishedDirs = (await readdir(productRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    if (!sameValues(publishedDirs, taxonomySlugs)) errors.push(`${lang}/products: published URL folders must match the taxonomy manifest`);

    for (const category of Object.keys(taxonomy.categories)) {
      if (!(await exists(path.join(root, lang, "categories", category, "index.html")))) {
        errors.push(`${lang}/categories/${category}/index.html: missing category page`);
      }
    }

    for (const record of catalogues[lang]) {
      if (record.status === "ready" && !taxonomyBySlug.has(record.slug)) {
        errors.push(`catalog.${lang}.json: unregistered ready product ${record.slug}`);
      }
    }
  }
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) errors.push(`${path.relative(root, file)}: JavaScript syntax failed`);
}

const phpProbe = spawnSync("php", ["-v"], { encoding: "utf8" });
if (phpProbe.error?.code === "ENOENT") {
  warnings.push("PHP CLI is unavailable; PHP syntax checks were skipped.");
} else {
  for (const file of phpFiles) {
    const result = spawnSync("php", ["-l", file], { encoding: "utf8" });
    if (result.status !== 0) errors.push(`${path.relative(root, file)}: PHP syntax failed`);
  }
}

const activeTextFiles = files.filter((file) => /\.(?:html|js|php|json)$/i.test(file));
for (const file of activeTextFiles) {
  const text = await readFile(file, "utf8");
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (text.includes("৳ 8,500")) warnings.push(`${rel}: contains the unapproved ৳ 8,500 placeholder`);
  if (/\bprice\s*:\s*bp\.price\s*\|\|\s*4200\b/.test(text)) warnings.push(`${rel}: contains the unapproved 4200 price fallback`);
}

// ---------------------------------------------------------------------------
// Commerce-truth regressions
//
// 1. A published product page may only carry an Offer/price in its structured
//    data when the catalogue record for that slug has an owner-confirmed
//    price. Fabricated price bands and availability claims were shipped once;
//    this check keeps them from returning.
// ---------------------------------------------------------------------------
if (catalogues.en && catalogues.bn) {
  for (const lang of ["en", "bn"]) {
    const bySlug = new Map(catalogues[lang].map((product) => [product.slug, product]));
    const productPages = htmlFiles.filter((file) => {
      const rel = path.relative(root, file).replaceAll("\\", "/");
      return new RegExp(`^${lang}/products/[^/]+/index\\.html$`).test(rel);
    });
    for (const file of productPages) {
      const rel = path.relative(root, file).replaceAll("\\", "/");
      const slug = rel.split("/")[2];
      const html = await readFile(file, "utf8");

      // Structured data must be parseable JSON: a Phase C regex edit once left
      // every PDP with a dangling comma, silently voiding all product markup.
      const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
      if (ldMatch) {
        try {
          JSON.parse(ldMatch[1]);
        } catch (error) {
          errors.push(`${rel}: JSON-LD is not parseable JSON (${error.message})`);
        }
      }

      const hasOfferMarkup = /"offers"\s*:|"AggregateOffer"|"lowPrice"|"highPrice"|schema\.org\/InStock/.test(html);
      if (!hasOfferMarkup) continue;
      const record = bySlug.get(slug);
      const confirmedPrice = Number(record?.price) > 0;
      if (!confirmedPrice) {
        errors.push(`${rel}: structured data contains an Offer/price/availability claim but catalog.${lang}.json has no owner-confirmed price for ${slug}`);
      }
    }
  }
}

// 2. Every category page's data-category grid attribute must match its own URL
//    folder slug (or the generic "catalog"/"all" sentinel used by Shop). A
//    mislabeled attribute once made four category pages render the entire
//    catalogue instead of their category.
if (taxonomy?.categories) {
  const knownCategories = new Set(Object.keys(taxonomy.categories));
  for (const lang of ["en", "bn"]) {
    for (const category of knownCategories) {
      const page = path.join(root, lang, "categories", category, "index.html");
      if (!(await exists(page))) continue;
      const html = await readFile(page, "utf8");
      const match = html.match(/data-catalog[^>]*data-category="([^"]*)"/) || html.match(/data-category="([^"]*)"[^>]*data-catalog/);
      if (!match) continue;
      const value = match[1].toLowerCase();
      if (value !== category && value !== "catalog" && value !== "all") {
        errors.push(`${lang}/categories/${category}/index.html: data-category="${match[1]}" does not match the page's category slug`);
      } else if (value === "catalog" && knownCategories.has(category)) {
        errors.push(`${lang}/categories/${category}/index.html: data-category="catalog" on a specific category page renders the whole catalogue; it must be "${category}"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Security regressions
//
// Each check below corresponds to a real defect that was found in this
// repository. They exist so the same mistake cannot be reintroduced quietly by
// a later change, human or automated.
// ---------------------------------------------------------------------------

// 1. Nothing that describes or configures the database may sit in the web root.
const forbiddenWebRootFiles = files.filter((file) =>
  /\.(?:sql|env|log|bak|old|orig)$/i.test(file),
);
for (const file of forbiddenWebRootFiles) {
  errors.push(
    `${path.relative(root, file).replaceAll("\\", "/")}: database/environment files must live in /database, not in the deployed web root`,
  );
}

// 2. The upload endpoint must never decide a file's type or extension from
//    caller-controlled input.
const uploadEndpoint = path.join(root, "api", "upload.php");
if (await exists(uploadEndpoint)) {
  const upload = await readFile(uploadEndpoint, "utf8");
  if (/PATHINFO_EXTENSION/.test(upload)) {
    errors.push("api/upload.php: the stored extension must come from a verified type whitelist, not the uploaded filename");
  }
  if (/in_array\(\s*\$file\['type'\]/.test(upload)) {
    errors.push("api/upload.php: $_FILES[...]['type'] is client-supplied and must not be used to validate uploads");
  }
  if (!/getimagesize/.test(upload)) {
    errors.push("api/upload.php: uploads must be verified by inspecting the file contents");
  }
}

// 2b. CSRF enforcement must stay wired: config.php enforces the token on every
// state-changing request, and the frontend sends it. Each check matches the
// protection added after the audit found session-cookie writes with no token.
const apiConfig = path.join(root, "api", "config.php");
if (await exists(apiConfig)) {
  const config = await readFile(apiConfig, "utf8");
  if (!/function\s+checkCsrf\s*\(/.test(config)) {
    errors.push("api/config.php: checkCsrf() is missing; state-changing requests must verify the X-CSRF-Token header");
  }
  // The call must be live code: strip the definition, then require an
  // uncommented `checkCsrf();` statement at the start of a line.
  const configWithoutDef = config.replace(/function\s+checkCsrf[\s\S]*?\n\}/, "");
  if (!/^\s*checkCsrf\(\);/m.test(configWithoutDef)) {
    errors.push("api/config.php: checkCsrf() is defined but never enforced for non-GET requests");
  }
  if (!/hash_equals/.test(config)) {
    errors.push("api/config.php: CSRF comparison must use hash_equals, not ==/===");
  }
}
const apiAuth = path.join(root, "api", "auth.php");
if (await exists(apiAuth)) {
  const auth = await readFile(apiAuth, "utf8");
  if (!/loginThrottle/.test(auth)) {
    errors.push("api/auth.php: login throttling has been removed; failed sign-ins must be rate limited");
  }
  if (!/session_regenerate_id\s*\(\s*true\s*\)/.test(auth)) {
    errors.push("api/auth.php: login must call session_regenerate_id(true) to prevent session fixation");
  }
}
for (const [relFile, label] of [["api/orders.php", "order_ref"], ["api/products.php", "SKU fallback"]]) {
  const file = path.join(root, relFile);
  if (await exists(file)) {
    const text = await readFile(file, "utf8");
    if (/\brand\s*\(/.test(text)) {
      errors.push(`${relFile}: ${label} must use random_bytes/random_int, not rand()`);
    }
  }
}
const siteJsFile = path.join(root, "assets", "js", "site.js");
if (await exists(siteJsFile)) {
  const siteJs = await readFile(siteJsFile, "utf8");
  if (!/X-CSRF-Token/.test(siteJs)) {
    errors.push("assets/js/site.js: API writes no longer send the X-CSRF-Token header");
  }
}

// 3. Uploaded media must never be executable.
const uploadGuard = path.join(root, "assets", "images", ".htaccess");
if (!(await exists(uploadGuard))) {
  errors.push("assets/images/.htaccess: missing the rule that prevents uploaded files from being executed");
}

// 4. Baseline transport and browser security must stay in place.
const htaccessPath = path.join(root, ".htaccess");
if (await exists(htaccessPath)) {
  const htaccess = await readFile(htaccessPath, "utf8");
  const required = [
    [/RewriteCond\s+%\{HTTPS\}\s+!=on/i, "an HTTPS redirect"],
    [/Strict-Transport-Security/i, "the Strict-Transport-Security header"],
    [/Content-Security-Policy/i, "a Content-Security-Policy header"],
    [/X-Content-Type-Options/i, "the X-Content-Type-Options header"],
  ];
  for (const [pattern, label] of required) {
    if (!pattern.test(htaccess)) errors.push(`.htaccess: missing ${label}`);
  }
}

// 5. No credential may ever be published in the repository again.
const repositorySqlDir = path.join(project, "database");
if (await exists(repositorySqlDir)) {
  for (const file of await walk(repositorySqlDir)) {
    const text = await readFile(file, "utf8");
    if (/\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/.test(text)) {
      errors.push(`database/${path.basename(file)}: contains a committed password hash; administrators must be created with database/create-admin.php`);
    }
  }
}

console.log(`Checked ${publicPages.length} public HTML pages, ${jsFiles.length} JavaScript files, ${phpFiles.length} PHP files, both catalogues, and the canonical taxonomy.`);
if (warnings.length) {
  console.warn(`\nWARNINGS (${warnings.length})`);
  for (const warning of [...new Set(warnings)]) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`\nERRORS (${errors.length})`);
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nPublic-site validation passed.");
